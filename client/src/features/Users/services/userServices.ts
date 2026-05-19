import axiosInstance from "../../../lib/axios";
import type { User,UserResponse,CreateUserResponse,UpdateUserPayload,UpdateUserResponse } from "../types";
const API_URLS={
    CREATE_USER:'/user',
    GET_ALL_USERS:'/users',
    GET_USER:(user_id:string)=>`/user/${user_id}`,
    UPDATE_USER:(user_id:string)=>`/user/${user_id}`
}

const userSerice={
    createUser:async (user:User):Promise<CreateUserResponse>=>{
    const response=await axiosInstance.post(API_URLS.CREATE_USER,user)
    return response.data
    },
    getAllUsers:async ():Promise<UserResponse[]>=>{
        const response=await axiosInstance.get(API_URLS.GET_ALL_USERS)
        return response.data
    },
    getUserById:async (user_id:string):Promise<UserResponse>=>{
        const response=await axiosInstance.get(API_URLS.GET_USER(user_id))
        return response.data
    },
    updateUser:async(payload:UpdateUserPayload):Promise<UpdateUserResponse>=>{
        const response=await axiosInstance.put(API_URLS.UPDATE_USER(payload.id),payload)
        return response.data
    }
}
export default userSerice
