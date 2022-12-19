import React from 'react'
import ExpenseStatistics from '~/components/expenses/ExpenseStatistics'
import Chart from '~/components/expenses/Chart'
import { getExpenses } from '~/data/expenses.server'
import Error from '~/components/util/Error'

import { useCatch, useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/node'
import { requireUserSession } from '~/data/auth.server'

const ExpensesAnalysisPage = () => {
  const expenses = useLoaderData()
  return (
    <main>
      <Chart expenses={expenses} />
      <ExpenseStatistics expenses={expenses} />
    </main>
  )
}

export default ExpensesAnalysisPage

export async function loader({ request }: any) {
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
      <Error title={caughtResponse.statusText}>
        <p>
          {caughtResponse.data?.message ||
            'Something went wrong. Couldnot load expenses'}
        </p>
      </Error>
    </main>
  )
}
