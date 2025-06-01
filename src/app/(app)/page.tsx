'use client'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import AddTodo from './addTodo'
import type { Todo, TodoRaw } from '@/utils/types'
import { RefreshCw, X } from 'lucide-react'
import { deleteTodoAction, getTodosAction } from './actions'

export default function Home() {
    const [todoList, setTodoList] = useState<Todo[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchTodos = () => {
        setLoading(true)
        setError(null)

        getTodosAction()
            .then((rawList: TodoRaw[]) => {
                const converted: Todo[] = rawList.map((item) => ({
                    id: item.id,
                    title: item.title,
                    category: item.category,
                    description: item.description ?? null,
                    createdAt: new Date(item.createdAt),
                    dueDate: new Date(item.dueDate),
                }))
                setTodoList(converted)
            })
            .catch((err) => {
                console.error('getTodosAction error:', err)
                setError((err as Error).message)
            })
            .finally(() => {
                setLoading(false)
            })
    }
    // delete todo
    const deleteTodo = (id: string) => {
        setLoading(true)
        setError(null)
        deleteTodoAction(id)
            .then(() => {
                console.log(`Todo with id ${id} deleted successfully`)
                // Refresh the todo list after deletion
                fetchTodos()
            })
            .catch((err) => {
                console.error('deleteTodoAction error:', err)
                setError((err as Error).message)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchTodos()
    }, [])

    return (
        <>
            {/* <Button onClick={handleClick} className='block m-4'>
                add todo
            </Button> */}
            <AddTodo refresh={fetchTodos} />
            {/* Button to fetch all todos */}
            {/* Show a loading indicator */}
            {loading && <p>Loading…</p>}

            {/* Show an error message if something went wrong */}
            {error && <p className='text-red-500'>Error: {error}</p>}

            {/* Render the list if there is any data */}
            {todoList.length > 0 && (
                <div className='m-4 mt-10'>
                    <div className='flex justify-between items-center mb-4'>
                        <h1 className='text-2xl font-bold'>Todo List</h1>
                        <Button onClick={fetchTodos} className='cursor-pointer'>
                            <RefreshCw />
                        </Button>
                    </div>
                    {/* <h2 className='text-xl font-semibold mb-2'>Todo Data</h2> */}
                    <table className='w-full table-auto border-collapse'>
                        <thead>
                            <tr className='bg-gray-100'>
                                <th className='border px-4 py-2 text-left'>
                                    Title
                                </th>
                                <th className='border px-4 py-2 text-left'>
                                    Category
                                </th>
                                <th className='border px-4 py-2 text-left'>
                                    Description
                                </th>
                                <th className='border px-4 py-2 text-left'>
                                    Due
                                </th>
                                <th className='border px-4 py-2 text-left'>
                                    Created
                                </th>
                                <th className='border px-4 py-2 text-left text-red-500'>
                                    Delete
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {todoList.map((w, idx) => (
                                <tr key={idx} className='hover:bg-gray-50'>
                                    <td className='border px-4 py-2'>
                                        {w.title}
                                    </td>
                                    <td className='border px-4 py-2'>
                                        {w.category}
                                    </td>
                                    <td className='border px-4 py-2'>
                                        {w.description}
                                    </td>
                                    <td className='border px-4 py-2'>
                                        {/* display date in red if its in the past */}
                                        {w.dueDate ? (
                                            <span
                                                className={
                                                    w.dueDate < new Date()
                                                        ? 'text-red-500'
                                                        : ''
                                                }
                                            >
                                                {w.dueDate.toDateString()}
                                            </span>
                                        ) : (
                                            'No due date'
                                        )}
                                    </td>
                                    <td className='border px-4 py-2'>
                                        {w.createdAt.toDateString()}
                                    </td>
                                    <td className='border px-4 py-2 text-red-500'>
                                        <button
                                            className='cursor-pointer'
                                            onClick={() =>
                                                deleteTodo(String(w.id))
                                            }
                                        >
                                            <X />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* If there’s no data yet */}
            {!loading && !error && todoList.length === 0 && (
                <p className='text-gray-500 mt-2'>No weather data yet.</p>
            )}
        </>
    )
}
