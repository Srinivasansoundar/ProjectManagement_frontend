import React, { useState } from 'react';
import { User, UserPlus } from 'lucide-react';
import type { Task, TaskStatus } from '../types';
import TaskService from '../services/taskService';
import AssignDevelopersModal from './AssignDevelopersModal';

interface TaskCardProps {
    task: Task;
    onUpdate: () => void;
    projectId?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, projectId }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as TaskStatus;
        try {
            setIsUpdating(true);
            await TaskService.updateTaskStatus(task.id, { status: newStatus });
            onUpdate();
        } catch (error) {
            console.error('Failed to update task status', error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-default group">
            <h3 className="text-gray-900 font-semibold mb-2 line-clamp-2">{task.title}</h3>
            <p className="text-gray-500 text-sm mb-4 line-clamp-3">{task.description}</p>

            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500 gap-1.5">
                        <User size={14} className="text-gray-400" />
                        <span className="truncate max-w-[100px]" title={task.assigned_to}>
                            {task.assigned_to || 'Unassigned'}
                        </span>
                    </div>

                    <select
                        value={task.status}
                        onChange={handleStatusChange}
                        disabled={isUpdating}
                        className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-indigo-500 text-gray-700 cursor-pointer disabled:opacity-50"
                    >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                </div>

                {projectId && (
                    <button
                        onClick={() => setIsAssignModalOpen(true)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-medium transition-colors border border-indigo-200"
                    >
                        <UserPlus size={14} />
                        <span>Assign Developer</span>
                    </button>
                )}
            </div>

            {isAssignModalOpen && projectId && (
                <AssignDevelopersModal
                    task_id={task.id}
                    project_id={projectId}
                    current_assignee={task.assigned_to}
                    onClose={() => setIsAssignModalOpen(false)}
                    onSuccess={onUpdate}
                />
            )}
        </div>
    );
};

export default TaskCard;
