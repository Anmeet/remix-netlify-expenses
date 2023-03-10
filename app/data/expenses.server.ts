import type { Expense } from '~/types'
import { prisma } from './database.server'

export async function addExpense(expenseData: Expense, userId: string): Promise<Expense> {
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

export async function getExpenses(userId: string): Promise<Expense[]> {
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

export async function getExpense(id:string): Promise<Expense> {
  try {
    const expense = await prisma.expense.findFirst({
      where: { id: id },
    })
    return expense as Expense
  } catch (error) {
    throw new Error('Failed to Get Expense.')
  }
}

export async function updateExpense(id: string, expenseData: Expense):Promise<Expense> {
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

export async function deleteExpense(id: string) {
  try {
    await prisma.expense.delete({
      where: { id },
    })
  } catch (error) {
    throw new Error('Failed to delete Expense.')
  }
}
