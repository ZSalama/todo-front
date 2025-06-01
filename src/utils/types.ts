export type Todo = {
    id: number
    title: string
    category: string
    description: string | null
    createdAt: Date
    dueDate?: Date
}
