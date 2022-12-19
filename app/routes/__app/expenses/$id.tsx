import { useNavigate } from '@remix-run/react'
import ExpensesForm from '~/components/expenses/ExpenseForm'
import {
  deleteExpense,
  getExpense,
  updateExpense,
} from '~/data/expenses.server'
import Modal from '../../../components/util/Modal'
import { redirect } from '@remix-run/node'
import { validateExpenseInput } from '~/data/validation.server'

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

export async function action({ params, request }: any) {
  const expenseId = params.id

  if (request.method === 'PATCH') {
    const formData = await request.formData()
    const expenseData = Object.fromEntries(formData)

    try {
      validateExpenseInput(expenseData)
    } catch (error) {
      return error
    }
    await updateExpense(expenseId, expenseData)
    return redirect('/expenses')
  } else if (request.method === 'DELETE') {
    await deleteExpense(expenseId)
    return {
      deletedId: expenseId,
    }
  }
}

export function meta({ params, location, data, parentsData }: any) {
  const expense = parentsData['routes/__app/expenses'].find(
    (expense: any) => expense.id === params.id
  )

  return {
    title: expense.title,
    description: 'Update Expense',
  }
}
