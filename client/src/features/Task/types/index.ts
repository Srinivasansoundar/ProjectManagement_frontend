export type TaskStatus = 'todo' | 'in_progress' | 'done';
export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    project_id: string;
    project_name?: string;
    assigned_to?: string;
    created_by: string;
}

export interface CreateTaskRequest {
    title: string;
    description: string;
    status: TaskStatus;
    project_id: string;
    assigned_to?: string;
    created_by: string;
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    status?: TaskStatus;
    assigned_to?: string;
}

export interface TaskStatusRequest {
    status: TaskStatus;
}

export interface TaskResponse {
    data: Task[];
}