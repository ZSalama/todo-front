'use server'

import { z } from 'zod'
// import { Todo } from '@/utils/types'
// This function adds a new todo item to the server
// and returns a promise that resolves when the operation is complete.

const formSchema = z.object({
    Title: z.string().min(1, {
        message: 'Title is required.',
    }),
    Category: z.string().min(1, {
        message: 'Category is required.',
    }),
    Description: z.string().optional(),
    DueDate: z
        .preprocess((arg) => {
            if (typeof arg === 'string' && arg.length > 0) {
                return new Date(arg)
            }
            if (arg instanceof Date) {
                return arg
            }
            return undefined
        }, z.date({ invalid_type_error: 'DueDate must be a valid date.' }))
        .optional(),
})

export async function addTodo(formData: FormData) {
    /* 2. Zod validation ----------------------------------------------------- */
    const parsed = formSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors }
    }
    const data = parsed.data

    console.log('Adding todo from action:', data)

    const response = await fetch('http://localhost:5291/api/todo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (response.ok) {
        const createdTodo = await response.json()
        console.log('Created:', createdTodo)
        return { success: true }
    } else {
        console.error('Failed to create', await response.text())
    }
}
