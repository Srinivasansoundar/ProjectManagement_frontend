import axiosInstance from "../../../lib/project";
import type { CreateProjectRequest, ProjectResponse, UpdateProjectRequest, AssignDeveloperRequest, DevelopersListResponse } from "../types";

const API_URLS = {
    CREATE_PROJECT: '/projects',
    GET_ALL_PROJECTS: '/projects',
    GET_PROJECT: (project_id: string) => `/projects/${project_id}`,
    UPDATE_PROJECT: (project_id: string) => `/projects/${project_id}`,
    DELETE_PROJECT: (project_id: string) => `/projects/${project_id}`,
    ASSIGN_MANAGER: (project_id: string, manager_id: string) => `/projects/${project_id}/${manager_id}`,
    ASSIGN_DEVELOPER: (project_id: string) => `/projects/${project_id}/developers`,
    GET_PROJECT_DEVELOPERS: (project_id: string) => `/projects/${project_id}/developers`,
    REMOVE_DEVELOPER: (project_id: string, developer_id: string) => `/projects/${project_id}/developers/${developer_id}`,
    GET_PROJECTS_BY_MANAGER: (manager_id: string) => `/projects/manager/${manager_id}`,
}

const projectService = {
    createProject: async (project: CreateProjectRequest): Promise<ProjectResponse> => {
        const response = await axiosInstance.post(API_URLS.CREATE_PROJECT, project)
        return response.data
    },
    getAllProjects: async (): Promise<ProjectResponse[]> => {
        const response = await axiosInstance.get(API_URLS.GET_ALL_PROJECTS)
        return response.data
    },
    getProjectById: async (project_id: string): Promise<ProjectResponse> => {
        const response = await axiosInstance.get(API_URLS.GET_PROJECT(project_id))
        return response.data
    },
    updateProject: async (id: string, payload: UpdateProjectRequest): Promise<ProjectResponse> => {
        const response = await axiosInstance.put(API_URLS.UPDATE_PROJECT(id), payload)
        return response.data
    },
    deleteProject: async (id: string): Promise<ProjectResponse> => {
        const response = await axiosInstance.delete(API_URLS.DELETE_PROJECT(id))
        return response.data
    },
    assignManager: async (project_id: string, manager_id: string): Promise<ProjectResponse> => {
        const response = await axiosInstance.patch(API_URLS.ASSIGN_MANAGER(project_id, manager_id))
        return response.data
    },
    assignDeveloper: async (id: string, payload: AssignDeveloperRequest): Promise<ProjectResponse> => {
        const response = await axiosInstance.post(API_URLS.ASSIGN_DEVELOPER(id), payload)
        return response.data
    },
    getProjectDevelopers: async (project_id: string): Promise<DevelopersListResponse> => {
        const response = await axiosInstance.get(API_URLS.GET_PROJECT_DEVELOPERS(project_id))
        return response.data
    },
    removeDeveloper: async (project_id: string, developer_id: string): Promise<ProjectResponse> => {
        const response = await axiosInstance.delete(API_URLS.REMOVE_DEVELOPER(project_id, developer_id))
        return response.data
    },
    getProjectsByManager: async (manager_id: string): Promise<ProjectResponse[]> => {
        const response = await axiosInstance.get(API_URLS.GET_PROJECTS_BY_MANAGER(manager_id))
        return response.data
    }
}
export default projectService   