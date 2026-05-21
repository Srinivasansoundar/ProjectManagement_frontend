import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import TaskService from '../services/taskService';
import type { Task, TaskStatus } from '../types';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

const DeveloperTasks: React.FC = () => {
    const { user } = useAppSelector((state) => state.auth);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
    const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

    // const fetchAssignedTasks = async () => {
    //     if (!user?.id) return;
    //     try {
    //         setLoading(true);
    //         const fetchedTasks = await TaskService.getTasksAssignedTo(user.id);
    //         setTasks(fetchedTasks);
    //         setError('');
    //     } catch (err: any) {
    //         console.error('Failed to fetch tasks:', err);
    //         setError(err.response?.data?.message || 'Failed to fetch tasks');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     fetchAssignedTasks();
    // }, [user?.id]);

    useEffect(() => {
        if (!user?.id) return;

        setLoading(true);

        // fetch existing tasks first
        const fetchInitialTasks = async () => {
            try {
                const fetchedTasks = await TaskService.getTasksAssignedTo(user.id);
                setTasks(fetchedTasks);
                setError('');
            } catch (err: any) {
                console.error('Failed to fetch tasks:', err);
                setError(err.response?.data?.message || 'Failed to fetch tasks');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialTasks();

        // open SSE connection for real-time updates
        const eventSource = new EventSource(`http://localhost:8001/sse/${user.id}`);

        eventSource.addEventListener('task_assigned', (event) => {
            const data = JSON.parse(event.data);
            setTasks((prev) => [...prev, data]);
        });

        // cleanup on unmount
        return () => {
            eventSource.close();
        };
    }, [user?.id]);

    const handleStatusUpdate = async (taskId: string, newStatus: TaskStatus) => {
        try {
            setUpdatingTaskId(taskId);
            await TaskService.updateTaskStatus(taskId, { status: newStatus });
            setTasks(tasks.map(task => 
                task.id === taskId ? { ...task, status: newStatus } : task
            ));
        } catch (err: any) {
            console.error('Failed to update task status:', err);
            setError(err.response?.data?.message || 'Failed to update task status');
        } finally {
            setUpdatingTaskId(null);
        }
    };

    const getFilteredTasks = () => {
        if (filterStatus === 'all') return tasks;
        return tasks.filter(task => task.status === filterStatus);
    };

    const filteredTasks = getFilteredTasks();

    const getTaskStats = () => {
        return {
            total: tasks.length,
            todo: tasks.filter(t => t.status === 'todo').length,
            inProgress: tasks.filter(t => t.status === 'in_progress').length,
            done: tasks.filter(t => t.status === 'done').length
        };
    };

    const stats = getTaskStats();

    const getStatusIcon = (status: TaskStatus) => {
        switch (status) {
            case 'done':
                return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case 'in_progress':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'todo':
                return <Circle className="w-5 h-5 text-gray-400" />;
        }
    };

    const getStatusColor = (status: TaskStatus) => {
        switch (status) {
            case 'done':
                return 'bg-green-50 border-green-200';
            case 'in_progress':
                return 'bg-yellow-50 border-yellow-200';
            case 'todo':
                return 'bg-gray-50 border-gray-200';
        }
    };

    const getStatusButtonClass = (status: TaskStatus) => {
        switch (status) {
            case 'done':
                return 'bg-green-100 text-green-800 hover:bg-green-200';
            case 'in_progress':
                return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
            case 'todo':
                return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
        }
    };

    const statusOptions: TaskStatus[] = ['todo', 'in_progress', 'done'];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tasks</h1>
                    <p className="text-gray-600">View and manage your assigned tasks</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                        <div className="text-sm text-gray-600 mt-1">Total Tasks</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="text-2xl font-bold text-gray-900">{stats.todo}</div>
                        <div className="text-sm text-gray-600 mt-1">To Do</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="text-2xl font-bold text-gray-900">{stats.inProgress}</div>
                        <div className="text-sm text-gray-600 mt-1">In Progress</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="text-2xl font-bold text-gray-900">{stats.done}</div>
                        <div className="text-sm text-gray-600 mt-1">Done</div>
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filterStatus === 'all'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                        >
                            All
                        </button>
                        {statusOptions.map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    filterStatus === status
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                            >
                                {status === 'todo' ? 'To Do' : status === 'in_progress' ? 'In Progress' : 'Done'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Tasks List */}
                {filteredTasks.length === 0 ? (
                    <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-100 text-center">
                        <p className="text-gray-500 text-lg">No tasks assigned yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredTasks.map(task => (
                            <div
                                key={task.id}
                                className={`bg-white p-6 rounded-lg shadow-sm border transition-all ${getStatusColor(task.status)}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="mt-1">
                                            {getStatusIcon(task.status)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs font-medium text-indigo-600 mb-1">
                                                {task.project_name}
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {task.title}
                                            </h3>
                                            {task.description && (
                                                <p className="text-gray-600 text-sm mb-3">
                                                    {task.description}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <span className={`px-2 py-1 rounded ${getStatusButtonClass(task.status)}`}>
                                                    {task.status === 'todo' ? 'To Do' : task.status === 'in_progress' ? 'In Progress' : 'Done'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        {statusOptions.map(status => (
                                            <button
                                                key={status}
                                                onClick={() => handleStatusUpdate(task.id, status)}
                                                disabled={updatingTaskId === task.id || task.status === status}
                                                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                                                    task.status === status
                                                        ? getStatusButtonClass(status)
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50'
                                                } disabled:cursor-not-allowed`}
                                            >
                                                {status === 'todo' ? 'To Do' : status === 'in_progress' ? 'Doing' : 'Done'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeveloperTasks;
