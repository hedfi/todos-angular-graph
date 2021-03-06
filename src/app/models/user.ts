export interface User {
  id: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface AuthUser {
  loginUser: {
    user: User
    token: string
  }
}
export interface RegisterUser {
  createUser: {
    user: User
    token: string
  }
}
