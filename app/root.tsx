import type { MetaFunction } from '@remix-run/node'
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from '@remix-run/react'
import Error from '~/components/util/Error'

import sharedStyles from '~/styles/shared.css'
import { useMatches } from '@remix-run/react'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Remix Expense App',
  viewport: 'width=device-width,initial-scale=1',
})

function Document({ title, children }: any) {
  const matches = useMatches()

  const disableJS = matches.some((match) => match.handle?.disableJS)
  return (
    <html lang='en'>
      <head>
        {title && <title>{title}</title>}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        {!disableJS && <Scripts />}

        <LiveReload />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <Document>
      <Outlet />{' '}
    </Document>
  )
}

export function CatchBoundary() {
  const caughtResponse = useCatch()
  return (
    <Document>
      <main>
        <Error title={caughtResponse.statusText}>
          <p>
            {caughtResponse.data?.message ||
              'Something went wrong. Please try again later'}
          </p>
          <p>
            Back to <Link to='/'>safety</Link>
          </p>
        </Error>
      </main>
    </Document>
  )
}

export function ErrorBoundary({ error }: any) {
  return (
    <Document title=' An Error Occured'>
      <main>
        <Error title='An error Occured'>
          <p>
            {error.message || 'Something went wrong. Please try again later'}
          </p>
          <p>
            Back to <Link to='/'>safety</Link>
          </p>
        </Error>
      </main>
    </Document>
  )
}

export function links() {
  return [{ rel: 'stylesheet', href: sharedStyles }]
}
