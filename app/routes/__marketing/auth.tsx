import React from 'react'
import AuthForm from '../../components/auth/AuthForm'
import authStyles from '~/styles/auth.css'
import { validateCredentials } from '~/data/validation.server'
import { login, signup } from '~/data/auth.server'

const AuthPage = () => {
  return <AuthForm />
}

export default AuthPage

export async function action({ request }: any) {
  const searchParams = new URL(request.url).searchParams
  const authMode = searchParams.get('mode') || 'login'

  const formData = await request.formData()
  const credentials: any = Object.fromEntries(formData)

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

export function links() {
  return [{ rel: 'stylesheet', href: authStyles }]
}
