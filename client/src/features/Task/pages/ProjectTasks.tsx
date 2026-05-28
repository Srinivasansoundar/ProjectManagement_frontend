import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import TaskService from '../services/taskService'
import projectService from '../../Projects/services/projectService';
import type { Task } from '../types';
import type { ProjectResponse } from '../../Projects/types';
import TaskCard from '../components/TaskCard';
import CreateTaskModal from '../components/CreateTaskModal';

const ProjectTasks: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [project, setProject] = useState<ProjectResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [error, setError] = useState('');

    const fetchData = async () => {
        if (!projectId) return;
        try {
            setLoading(true);
            const [fetchedTasks, fetchedProject] = await Promise.all([
                TaskService.getTasksForProject(projectId),
                projectService.getProjectById(projectId)
            ]);
            setTasks(fetchedTasks);
            setProject(fetchedProject);
        } catch (err: any) {
            console.error('Failed to fetch data:', err);
            setError(err.response?.data?.message || 'Failed to fetch tasks or project details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [projectId]);

    const handleTaskCreated = () => {
        fetchData();
        setIsCreateModalOpen(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/manager')}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {project ? project.name : 'Project Tasks'}
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Manage tasks for this project
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-all shadow-sm font-medium"
                    >
                        <Plus size={20} />
                        <span>Add Task</span>
                    </button>
                </header>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
                        <p>{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                            To Do
                        </h2>
                        <div className="flex-1 overflow-y-auto flex flex-col gap-4">
                            {tasks.filter(t => t.status === 'todo').length === 0 ? (
                                <p className="text-gray-400 text-center py-8">No tasks in To Do</p>
                            ) : (
                                tasks.filter(t => t.status === 'todo').map(task => (
                                    <TaskCard key={task.id} task={task} onUpdate={fetchData} projectId={projectId} />
                                ))
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                            In Progress
                        </h2>
                        <div className="flex-1 overflow-y-auto flex flex-col gap-4">
                            {tasks.filter(t => t.status === 'in_progress').length === 0 ? (
                                <p className="text-gray-400 text-center py-8">No tasks in Progress</p>
                            ) : (
                                tasks.filter(t => t.status === 'in_progress').map(task => (
                                    <TaskCard key={task.id} task={task} onUpdate={fetchData} projectId={projectId} />
                                ))
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-green-500"></span>
                            Done
                        </h2>
                        <div className="flex-1 overflow-y-auto flex flex-col gap-4">
                            {tasks.filter(t => t.status === 'done').length === 0 ? (
                                <p className="text-gray-400 text-center py-8">No tasks completed</p>
                            ) : (
                                tasks.filter(t => t.status === 'done').map(task => (
                                    <TaskCard key={task.id} task={task} onUpdate={fetchData} projectId={projectId} />
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {isCreateModalOpen && projectId && (
                    <CreateTaskModal
                        project_id={projectId}
                        onClose={() => setIsCreateModalOpen(false)}
                        onSuccess={handleTaskCreated}
                    />
                )}
            </div>
        </div>
    );
};

export default ProjectTasks;
