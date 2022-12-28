import React from 'react'
import AuthForm from '../../components/auth/AuthForm'
import authStyles from '~/styles/auth.css'
import { validateCredentials } from '~/data/validation.server'
import { login, signup } from '~/data/auth.server'
import type { ActionArgs, LinksFunction } from '@remix-run/node'
import type { LoginForm } from '~/types'

const AuthPage = () => {
  return <AuthForm />
}

export default AuthPage

export async function action({ request }: ActionArgs) {
  const searchParams = new URL(request.url).searchParams
  const authMode = searchParams.get('mode') || 'login'

  const formData = await request.formData()
  const credentials = Object.fromEntries(formData) as LoginForm

  try {
    validateCredentials(credentials)
  } catch (error) {
    return error
  }

  try {
    if (authMode === 'login') {
      //login logic

      return await login(credentials)
    } else {
      //signup logic (create user)
      return await signup(credentials)
    }
  } catch (error: any) {
    if ((error.status = 422)) {
      return {
        credentials: error.message,
      }
    }
  }
}

export const links:LinksFunction = ()  => {
  return [{ rel: 'stylesheet', href: authStyles }]
}
