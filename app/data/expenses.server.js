import { prisma } from './database.server'

export async function addExpense(expenseData, userId) {
  try {
    return await prisma.expense.create({
      data: {
        title: expenseData.title,
        amount: +expenseData.amount,
        date: new Date(expenseData.date),
        User: { connect: { id: userId } },
      },
    })
  } catch (error) {
    console.log(error)
    throw new Error('Failed to Add Expense.')
  }
}

export async function getExpenses(userId) {
  if (!userId) {
    throw new Error('Failed to get expenses.')
  }
  try {
    const expenses = await prisma.expense.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        date: 'desc',
      },
    })
    return expenses
  } catch (error) {
    console.log(error)
    throw new Error('Failed to Get Expenses.')
  }
}

export async function getExpense(id) {
  try {
    const expense = await prisma.expense.findFirst({
      where: { id: id },
    })
    return expense
  } catch (error) {
    throw new Error('Failed to Get Expense.')
  }
}

export async function updateExpense(id, expenseData) {
  try {
    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: {
        title: expenseData.title,
        amount: +expenseData.amount,
        date: new Date(expenseData.date),
      },
    })
    return updatedExpense
  } catch (error) {
    throw new Error('Failed to Update Expense.')
  }
}

export async function deleteExpense(id) {
  try {
    await prisma.expense.delete({
      where: { id },
    })
  } catch (error) {
    throw new Error('Failed to delete Expense.')
  }
}
