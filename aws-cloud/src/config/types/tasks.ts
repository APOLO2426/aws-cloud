export type Task = {
    id: number
    title: string
    description: string
    completed: boolean
    created_at: string | null
    updated_at: string | null
}


export type TasksCreate = Omit<Task, 'id' | 'created_at' | 'updated_at'>
export type TasksUdate = Omit<Task, 'id' | 'created_at' | 'updated_at'>
