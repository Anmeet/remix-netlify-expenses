import { useNavigate } from '@remix-run/react'
import ExpensesForm from '~/components/expenses/ExpenseForm'
import {
  deleteExpense,
  getExpense,
  updateExpense,
} from '~/data/expenses.server'
import Modal from '../../../components/util/Modal'
import type { ActionArgs, MetaFunction} from '@remix-run/node';
import { redirect } from '@remix-run/node'
import { validateExpenseInput } from '~/data/validation.server'
import type { Expense } from '~/types'

const UpdateExpensesPage = () => {
  const navigate = useNavigate()

  const closeHandler = () => {
    navigate('..')
  }
  return (
    <Modal onClose={closeHandler}>
      <ExpensesForm />
    </Modal>
  )
}

export default UpdateExpensesPage

// export function loader({params}: any) {
//   const expenseId = params.id;
//   const expense  =  getExpense(expenseId);
//   return expense;
// }

export async function action({ params, request }: ActionArgs) {
  const expenseId = params.id

  if (request.method === 'PATCH') {
    const formData = await request.formData()
    const expenseData = Object.fromEntries(formData)

    try {
      validateExpenseInput(expenseData as unknown as Expense)
    } catch (error) {
      return error
    }
    await updateExpense(expenseId as string, expenseData as unknown as Expense)
    return redirect('/expenses')
  } else if (request.method === 'DELETE') {
    await deleteExpense(expenseId as string)
    return {
      deletedId: expenseId,
    }
  }
}

export const meta: MetaFunction =({ params, location, data, parentsData }) => {
  const expense = parentsData['routes/__app/expenses'].find(
    (expense: any) => expense.id === params.id
  )

  return {
    title: expense.title,
    description: 'Update Expense',
  }
}
