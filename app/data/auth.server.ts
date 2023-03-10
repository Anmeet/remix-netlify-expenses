import { prisma } from './database.server'
//@ts-ignore
import { hash, compare } from 'bcryptjs'
import { createCookieSessionStorage, redirect } from '@remix-run/node'
import { LoginForm } from '~/types'

const SESSION_SECRET = process.env.SESSION_SECRET

const sessionStorage = createCookieSessionStorage({
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    secrets: [SESSION_SECRET as string],
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    httpOnly: true,
  },
})

async function createUserSession(userId: string, redirectPath: string) {
  const session = await sessionStorage.getSession()
  session.set('userId', userId)
  return redirect(redirectPath, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session),
    },
  })
}

export async function destroyUserSession(request: Request) {
  const session = await sessionStorage.getSession(request.headers.get('Cookie'))
  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  })
}

export async function getUserFromSession(request: Request) {
  const session = await sessionStorage.getSession(request.headers.get('Cookie'))

  const userId = session.get('userId')
  if (!userId) {
    return null
  }
  return userId
}

export async function requireUserSession(request: Request) {
  const userId = await getUserFromSession(request)

  if (!userId) {
    throw redirect('/auth?mode=login')
  }
  return userId
}

export async function signup({ email, password }: LoginForm) {
  const existingUser = await prisma.user.findFirst({ where: { email } })

  if (existingUser) {
    const error: Error & {status?: number} = new Error('Email already exists')
    error.status = 422
    throw error
  }

  const hashedPassword = await hash(password, 12)
  const user = await prisma.user.create({
    data: { email: email, password: hashedPassword },
  })
  return createUserSession(user.id, '/expenses')
}

export async function login({ email, password }: LoginForm) {
  const existingUser = await prisma.user.findFirst({ where: { email } })

  if (!existingUser) {
    const error: Error & { status?: number} = new Error('Invalid credentials')
    error.status = 401
    throw error
  }

  const isCorrectPassword = await compare(password, existingUser.password)
  if (!isCorrectPassword) {
    const error: Error & {status?: number} = new Error(
      'Couldnot log you in, please check the provided credentials'
    )
    error.status = 401
    throw error
  }

  return createUserSession(existingUser.id, '/expenses')
}
