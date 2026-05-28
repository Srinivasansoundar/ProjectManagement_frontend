export interface CreateProjectRequest {
    name: string;
    description?: string;
    status?: string;
    manager_id?: string;
    created_by: string;
}

export interface UpdateProjectRequest {
    name?: string;
    description?: string;
    status?: string;
    manager_id?: string;

}

export interface ProjectResponse {
    id: string;
    name: string;
    description?: string;
    status: string;
    manager_id?: string;
}

export interface Developer {
    id: string;
    name: string;
    email?: string;
    username?: string;
}

export interface DevelopersListResponse {
    developer_ids: string[];
}

export interface AssignDeveloperRequest {
    developer_ids: string[];
}

