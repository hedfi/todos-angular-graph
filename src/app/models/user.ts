export interface User {
  id: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface AuthUser {
  user: User
  token: string
}
