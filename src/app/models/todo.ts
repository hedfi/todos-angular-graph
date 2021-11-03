export interface Todo {
  id: string
  title: string
  description: string
  completed: string
  createdAt: string
  updatedAt: string
}
export interface TodoResult {
  count: number;
  todos: Todo[];
}
export interface CreateTodo {
  createTodo: Todo
}
