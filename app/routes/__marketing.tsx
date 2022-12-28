import { Outlet } from '@remix-run/react'
import marketingStyles from '~/styles/marketing.css'
import MainHeader from '~/components/navigation/MainHeader'
import { getUserFromSession } from '~/data/auth.server'
import type { LinksFunction, LoaderArgs } from '@remix-run/node'

export default function MarketingLayout() {
  return (
    <>
      <MainHeader />
      <Outlet />
    </>
  )
}

export function loader({ request }: LoaderArgs) {
  return getUserFromSession(request)
}
export const links:LinksFunction = () => {
  return [{ rel: 'stylesheet', href: marketingStyles }]
}
