export type Todo = {
    id: number
    title: string
    category: string
    description: string | null
    createdAt: Date
    dueDate?: Date
}

export interface TodoRaw {
    id: number
    title: string
    category: string
    description?: string
    createdAt: string // ISO string from backend
    dueDate: string // ISO string
}
