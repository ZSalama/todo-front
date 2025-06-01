'use server'

import { z } from 'zod'
import type { TodoRaw } from '@/utils/types' // Adjust the import path as necessary
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
    const backend_url = process.env.BACKEND_URL
    if (!backend_url) {
        throw new Error(
            'BACKEND_URL is not defined in the environment variables.'
        )
    }
    /* 2. Zod validation ----------------------------------------------------- */
    const parsed = formSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors }
    }
    const data = parsed.data

    console.log('Adding todo from action:', data)

    const response = await fetch(`${backend_url}/api/todo`, {
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

export async function getTodosAction(): Promise<TodoRaw[]> {
    const backend_url = process.env.BACKEND_URL
    if (!backend_url) {
        throw new Error(
            'BACKEND_URL is not defined in the environment variables.'
        )
    }

    const res = await fetch(`${backend_url}/api/todo`, {
        // no-store ensures we always fetch fresh results
        cache: 'no-store',
    })

    if (!res.ok) {
        // construct an error message based on status/text
        const errorText = await res.text()
        throw new Error(
            `getTodosAction failed: HTTP ${res.status} – ${errorText}`
        )
    }

    // We know our backend returns something like:
    // [{ id: 1, title: '…', category: '…', description: '…', createdAt: '2025-05-31T10:00:00.000Z', dueDate: '2025-06-01T00:00:00.000Z' }, …]
    // We type this as TodoRaw (dates as ISO strings).
    const data = (await res.json()) as TodoRaw[]
    return data
}

export async function deleteTodoAction(id: string): Promise<void> {
    const backend_url = process.env.BACKEND_URL
    if (!backend_url) {
        throw new Error(
            'BACKEND_URL is not defined in the environment variables.'
        )
    }

    const res = await fetch(`${backend_url}/api/todo/${id}`, {
        method: 'DELETE',
    })

    if (!res.ok) {
        const errorText = await res.text()
        throw new Error(
            `deleteTodoAction failed: HTTP ${res.status} – ${errorText}`
        )
    }
}
