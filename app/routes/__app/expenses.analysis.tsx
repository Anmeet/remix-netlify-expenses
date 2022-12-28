import React from 'react'
import ExpenseStatistics from '~/components/expenses/ExpenseStatistics'
import Chart from '~/components/expenses/Chart'
import { getExpenses } from '~/data/expenses.server'

import { useCatch, useLoaderData } from '@remix-run/react'
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node'
import { requireUserSession } from '~/data/auth.server'
import ErrorComp from '~/components/util/ErrorComp'

const ExpensesAnalysisPage = () => {
  const expenses = useLoaderData<typeof loader>()
  return (
    <main>
      <Chart expenses={expenses} />
      <ExpenseStatistics expenses={expenses} />
    </main>
  )
}

export default ExpensesAnalysisPage

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserSession(request)
  const expenses = await getExpenses(userId)
  if (!expenses || expenses.length === 0) {
    throw json(
      { message: 'Could not load expenses fro the requested analysis.' },
      {
        status: 404,
        statusText: 'Expenses not found',
      }
    )
  }
  return expenses
}

export function CatchBoundary() {
  const caughtResponse = useCatch()

  return (
    <main>
      <ErrorComp title={caughtResponse.statusText}>
        <p>
          {caughtResponse.data?.message ||
            'Something went wrong. Couldnot load expenses'}
        </p>
      </ErrorComp>
    </main>
  )
}
