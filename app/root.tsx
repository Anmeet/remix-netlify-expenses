import type { LinksFunction, MetaFunction } from '@remix-run/node'
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


import sharedStyles from '~/styles/shared.css'
import { useMatches } from '@remix-run/react'
import React from 'react'
import ErrorComp from './components/util/ErrorComp'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Remix Expense App',
  viewport: 'width=device-width,initial-scale=1',
})

function Document({ title, children }: {children: React.ReactNode; title?:string}) {
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
        <ErrorComp title={caughtResponse.statusText}>
          <p>
            {caughtResponse.data?.message ||
              'Something went wrong. Please try again later'}
          </p>
          <p>
            Back to <Link to='/'>safety</Link>
          </p>
        </ErrorComp>
      </main>
    </Document>
  )
}

export function ErrorBoundary({ error }: any) {
  return (
    <Document title=' An Error Occured'>
      <main>
        <ErrorComp title='An error Occured'>
          <p>
            {error.message || 'Something went wrong. Please try again later'}
          </p>
          <p>
            Back to <Link to='/'>safety</Link>
          </p>
        </ErrorComp>
      </main>
    </Document>
  )
}

export const links:LinksFunction = () => {
  return [{ rel: 'stylesheet', href: sharedStyles }]
}
