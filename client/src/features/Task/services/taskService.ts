import axiosInstance from "../../../lib/project"
import type { CreateTaskRequest, UpdateTaskRequest, TaskStatusRequest, TaskResponse } from "../types";

const API_URLS = {
    CREATE_TASK: "/tasks",
    UPDATE_TASK: (task_id: string) => `/tasks/${task_id}`,
    DELETE_TASK: (task_id: string) => `/tasks/${task_id}`,
    GET_TASKS_FOR_PROJECT: (project_id: string) => `/tasks/${project_id}`,
    ASSIGN_TASK: (task_id: string, user_id: string) => `/tasks/${task_id}/assign/${user_id}`,
    REMOVE_TASK: (task_id: string, user_id: string) => `/tasks/${task_id}/remove/${user_id}`,
    UPDATE_TASK_STATUS: (task_id: string) => `/tasks/${task_id}/update_status`,
    GET_TASKS_ASSIGNED_TO: (user_id: string) => `/tasks/assigned-to/${user_id}`
}

export const TaskService = {
    createTask: async (task: CreateTaskRequest) => {
        const response = await axiosInstance.post(API_URLS.CREATE_TASK, task)
        return response.data
    },
    updateTask: async (task_id: string, task: UpdateTaskRequest) => {
        const response = await axiosInstance.put(API_URLS.UPDATE_TASK(task_id), task)
        return response.data
    },
    deleteTask: async (task_id: string) => {
        const response = await axiosInstance.delete(API_URLS.DELETE_TASK(task_id))
        return response.data
    },
    getTasksForProject: async (project_id: string) => {
        const response = await axiosInstance.get(API_URLS.GET_TASKS_FOR_PROJECT(project_id))
        return response.data
    },
    assignTask: async (task_id: string, user_id: string) => {
        const response = await axiosInstance.patch(API_URLS.ASSIGN_TASK(task_id, user_id))
        return response.data
    },
    removeTask: async (task_id: string, user_id: string) => {
        const response = await axiosInstance.patch(API_URLS.REMOVE_TASK(task_id, user_id))
        return response.data
    },
    updateTaskStatus: async (task_id: string, task: TaskStatusRequest) => {
        const response = await axiosInstance.patch(API_URLS.UPDATE_TASK_STATUS(task_id), task)
        return response.data
    },
    getTasksAssignedTo: async (user_id: string) => {
        const response = await axiosInstance.get(API_URLS.GET_TASKS_ASSIGNED_TO(user_id))
        return response.data
    }
}

export default TaskService