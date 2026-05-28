export type UserRole = 'admin' | 'manager' | 'developer'
export interface User{
    name:string
    email:string
    password:string
    role:UserRole
    created_by:string
}
export interface CreateUserPayload{
    name:string
    email:string
    password:string
    role:UserRole
}
export interface UserResponse{
    id:string
    name:string
    email:string
    role:UserRole
}
export interface CreateUserResponse{
    messsage:string
    user:UserResponse
}
export interface UpdateUserPayload{
  name?:string,
  email?:string,
}
// ->optional

export interface UpdateUserResponse{
   id:string
   name:string
   email:string
   role:UserRole
}

