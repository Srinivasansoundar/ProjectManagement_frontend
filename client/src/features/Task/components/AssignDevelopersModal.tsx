import React, { useState, useEffect } from 'react';
import { X, Loader2, Check, Users, Trash2 } from 'lucide-react';
import TaskService from '../services/taskService';
import projectService from '../../Projects/services/projectService';
import userService from '../../Users/services/userServices';

interface AssignDevelopersModalProps {
    task_id: string;
    project_id: string;
    current_assignee?: string;
    onClose: () => void;
    onSuccess: () => void;
}

interface Developer {
    id: string;
    name: string;
}

const AssignDevelopersModal: React.FC<AssignDevelopersModalProps> = ({
    task_id,
    project_id,
    current_assignee,
    onClose,
    onSuccess
}) => {
    const [developers, setDevelopers] = useState<Developer[]>([]);
    const [selectedDeveloper, setSelectedDeveloper] = useState<string | null>(current_assignee || null);
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

    useEffect(() => {
        const fetchDevelopers = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await projectService.getProjectDevelopers(project_id);
                console.log('Fetched developers response:', response);
                
                // Extract developer IDs from the response
                const developerIds = response.developer_ids;
                
               
                
                console.log('Developer IDs:', developerIds);

                // Fetch details for each developer
                const developerDetails: Developer[] = [];
                for (const devId of developerIds) {
                    try {
                        const userDetails = await userService.getUserById(devId);
                        developerDetails.push({
                            id: devId,
                            name: userDetails.name || devId // Fallback to ID if name is not available
                        });
                    } catch (err) {
                        console.error(`Failed to fetch details for developer ${devId}:`, err);
                        // Fallback to ID if details fetch fails
                        developerDetails.push({
                            id: devId,
                            name: devId
                        });
                    }
                }
                
                console.log('Developer details:', developerDetails);
                setDevelopers(developerDetails);
            } catch (err: any) {
                console.error('Failed to fetch developers:', err);
                setError(err.response?.data?.message || 'Failed to fetch project developers');
            } finally {
                setLoading(false);
            }
        };

        fetchDevelopers();
    }, [project_id]);

    const handleAssign = async () => {
        if (!selectedDeveloper) {
            setError('Please select a developer');
            return;
        }

        try {
            setAssigning(true);
            setError('');
            await TaskService.assignTask(task_id, selectedDeveloper);
            setSuccess('Developer assigned successfully!');
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to assign task');
            setAssigning(false);
        }
    };

    const handleRemove = async () => {
        if (!selectedDeveloper) {
            setError('Please select a developer to remove');
            return;
        }

        try {
            setRemoving(true);
            setError('');
            await TaskService.removeTask(task_id, selectedDeveloper);
            setSuccess('Developer removed successfully!');
            setShowRemoveConfirm(false);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to remove developer');
            setRemoving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <Users size={20} className="text-indigo-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">Assign Developer</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg border border-green-100 flex items-center gap-2">
                            <Check size={16} />
                            {success}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <Loader2 size={32} className="text-indigo-600 animate-spin mb-2" />
                            <p className="text-gray-500">Loading developers...</p>
                        </div>
                    ) : developers.length === 0 ? (
                        <div className="text-center py-8">
                            <Users size={32} className="text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500">No developers assigned to this project</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Select a developer:
                            </label>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {developers.map((developer) => (
                                    <button
                                        key={developer.id}
                                        onClick={() => setSelectedDeveloper(developer.id)}
                                        className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                                            selectedDeveloper === developer.id
                                                ? 'border-indigo-500 bg-indigo-50'
                                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white text-sm ${
                                                selectedDeveloper === developer.id
                                                    ? 'bg-indigo-600'
                                                    : 'bg-gray-400'
                                            }`}>
                                                {developer.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-800 truncate">{developer.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{developer.id}</p>
                                            </div>
                                            {selectedDeveloper === developer.id && (
                                                <Check size={20} className="text-indigo-600 flex-shrink-0" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {developers.length > 0 && (
                    <div className="border-t border-gray-100 p-6 bg-gray-50/50 flex flex-col gap-4">
                        {/* Confirmation Dialog for Remove */}
                        {showRemoveConfirm && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-700 text-sm font-medium mb-3">
                                    Are you sure you want to remove this developer from the task?
                                </p>
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowRemoveConfirm(false)}
                                        className="px-4 py-2 rounded-lg text-red-600 hover:bg-red-100 transition-colors font-medium text-sm"
                                        disabled={removing}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleRemove}
                                        disabled={removing || !selectedDeveloper}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all disabled:opacity-70 text-sm"
                                    >
                                        {removing ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" />
                                                <span>Removing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 size={16} />
                                                <span>Confirm Remove</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-between gap-3">
                            <button
                                type="button"
                                onClick={() => setShowRemoveConfirm(true)}
                                disabled={assigning || removing || !selectedDeveloper || !current_assignee}
                                className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 border border-red-200 transition-colors disabled:opacity-50"
                                title={!current_assignee ? "No developer currently assigned" : ""}
                            >
                                <Trash2 size={16} />
                                <span>Remove Developer</span>
                            </button>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-5 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                                    disabled={assigning || removing}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAssign}
                                    disabled={assigning || removing || !selectedDeveloper}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/20 transition-all disabled:opacity-70"
                                >
                                    {assigning ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            <span>Assigning...</span>
                                        </>
                                    ) : (
                                        <span>Assign Developer</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignDevelopersModal;

    