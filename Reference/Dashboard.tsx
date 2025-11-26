import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Activity, Users, FileText, Plus } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { events, activities, teamMembers, dailyLogs } = useData();
    const { user } = useAuth();

    const userName = user ? user.name.split(' ')[0] : 'Guest';

    return (
        <div className="p-6 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
            >
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">Welcome back, {userName}! 👋</h1>
                        <p className="text-sm text-gray-400">Here's what's happening with your team today.</p>
                    </div>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                >
                    <div className="flex items-center justify-between">
                        <Calendar className="w-6 h-6 text-blue-400" />
                        <span className="text-xl font-bold">{events.length}</span>
                    </div>
                    <h3 className="text-xs text-gray-400 mt-2">Upcoming Events</h3>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                >
                    <div className="flex items-center justify-between">
                        <Users className="w-6 h-6 text-green-400" />
                        <span className="text-xl font-bold">{teamMembers.filter(m => m.status === 'online').length}/{teamMembers.length}</span>
                    </div>
                    <h3 className="text-xs text-gray-400 mt-2">Members Online</h3>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                >
                    <div className="flex items-center justify-between">
                        <Activity className="w-6 h-6 text-orange-400" />
                        <span className="text-xl font-bold">{activities.length}</span>
                    </div>
                    <h3 className="text-xs text-gray-400 mt-2">Recent Activities</h3>
                </motion.div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                >
                    <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-red-400" />
                        Upcoming Events
                    </h2>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {events.slice(0, 5).map((event) => (
                            <div
                                key={event.id}
                                className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold truncate">{event.title}</h3>
                                        <p className="text-xs text-gray-400 mt-0.5">{event.location}</p>
                                    </div>
                                    <div className="text-right ml-2 flex-shrink-0">
                                        <p className="text-xs font-medium">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                        <p className="text-xs text-gray-400">{event.time}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {events.length === 0 && (
                            <p className="text-gray-400 text-sm text-center py-4">No upcoming events.</p>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                >
                    <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-orange-400" />
                        Recent Activity
                    </h2>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {activities.slice(0, 5).map((activity) => (
                            <div
                                key={activity.id}
                                className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                        {activity.avatar}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs">
                                            <span className="font-semibold">{activity.user}</span> {activity.action}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {activities.length === 0 && (
                            <p className="text-gray-400 text-sm text-center py-4">No recent activity.</p>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Recent Notebook Logs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-purple-400" />
                        Recent Notebook Logs
                    </h2>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.location.href = '/notebook'}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg font-medium shadow-lg shadow-red-500/20 text-xs"
                    >
                        <Plus className="w-3 h-3" />
                        Add Log Entry
                    </motion.button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dailyLogs.slice(0, 3).map((log) => (
                        <div key={log.id} className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-[10px] font-bold">
                                        {log.team_members?.avatar || 'U'}
                                    </div>
                                    <span className="text-xs font-medium text-gray-300">{log.team_members?.name || `Member #${log.user_id}`}</span>
                                </div>
                                <span className="text-[10px] text-gray-500">{new Date(log.created_at).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-2">{log.entry_text}</p>
                        </div>
                    ))}
                    {dailyLogs.length === 0 && (
                        <p className="col-span-full text-gray-400 text-sm text-center py-4">No recent logs.</p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
