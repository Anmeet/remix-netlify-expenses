import { getExpenses } from '~/data/expenses.server'
import { requireUserSession } from '~/data/auth.server'

export async function loader({ request }: any) {
  const userId = await requireUserSession(request)
  return getExpenses(userId)
}
