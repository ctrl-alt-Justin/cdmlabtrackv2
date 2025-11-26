import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Bell, Save, AlertTriangle, Palette } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
    // Get current user from AuthContext
    const { user, updateProfile } = useAuth();
    const { settings, updateSettings, permission, requestPermission } = useNotification();
    const { refreshData } = useData();
    const { colorTheme, setColorTheme, customColor, setCustomColor } = useTheme();

    // Profile state reflects logged-in user
    const [profile, setProfile] = useState({ username: '', email: '', role: '' });

    // Sync profile with user data
    useEffect(() => {
        if (user) {
            setProfile({ username: user.name, email: user.email, role: user.role });
        }
    }, [user]);

    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    const handleSaveProfile = async () => {
        setSaveStatus('saving');
        try {
            await updateProfile({
                name: profile.username,
                email: profile.email,
                role: profile.role
            });
            await refreshData(); // Refresh sidebar and other data
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        } catch (error) {
            console.error('Failed to update profile:', error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };

    const cardBg = 'bg-white/5';
    const cardBorder = 'border-white/10';

    return (
        <div className="p-6 relative z-10">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-1">Settings</h1>
                    <p className="text-sm text-gray-400">Manage your account and preferences</p>
                </div>

                <div className="space-y-6">
                    {/* Profile Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${cardBg} ${cardBorder} backdrop-blur-sm rounded-xl p-6`}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <User className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">Profile Information</h2>
                                <p className="text-xs text-gray-400">Update your personal details</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                                <input
                                    type="text"
                                    value={profile.username}
                                    onChange={e => setProfile({ ...profile, username: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                                <select
                                    value={profile.role}
                                    onChange={e => setProfile({ ...profile, role: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                                >
                                    <option value="Driver" className="bg-black">Driver</option>
                                    <option value="Programmer" className="bg-black">Programmer</option>
                                    <option value="Notebook" className="bg-black">Notebook</option>
                                    <option value="Builder" className="bg-black">Builder</option>
                                    <option value="Coach" className="bg-black">Coach</option>
                                    <option value="Adviser" className="bg-black">Adviser</option>
                                </select>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSaveProfile}
                                disabled={saveStatus === 'saving'}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${saveStatus === 'saved'
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600'}`}
                            >
                                <Save className="w-4 h-4" />
                                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Theme Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`${cardBg} ${cardBorder} backdrop-blur-sm rounded-xl p-6`}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-pink-500/20 rounded-lg">
                                <Palette className="w-5 h-5 text-pink-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">Background Theme</h2>
                                <p className="text-xs text-gray-400">Customize the application appearance</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                onClick={() => setColorTheme('orange')}
                                className={`group relative p-4 rounded-xl border transition-all duration-300 overflow-hidden ${colorTheme === 'orange'
                                    ? 'border-orange-500 bg-orange-500/10'
                                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                                    }`}
                            >
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/30" />
                                    <div className="text-left">
                                        <h3 className="font-bold text-white">Orange</h3>
                                        <p className="text-xs text-gray-400">Sunset</p>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => setColorTheme('violet')}
                                className={`group relative p-4 rounded-xl border transition-all duration-300 overflow-hidden ${colorTheme === 'violet'
                                    ? 'border-violet-500 bg-violet-500/10'
                                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                                    }`}
                            >
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/30" />
                                    <div className="text-left">
                                        <h3 className="font-bold text-white">Violet</h3>
                                        <p className="text-xs text-gray-400">Cosmic</p>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => setColorTheme('custom')}
                                className={`group relative p-4 rounded-xl border transition-all duration-300 overflow-hidden ${colorTheme === 'custom'
                                    ? 'border-white/50 bg-white/10'
                                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                                    }`}
                            >
                                <div className="flex items-center gap-4 relative z-10">
                                    <div
                                        className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center overflow-hidden border-2 border-white/20"
                                        style={{ background: customColor }}
                                    >
                                        <input
                                            type="color"
                                            value={customColor}
                                            onChange={(e) => setCustomColor(e.target.value)}
                                            className="opacity-0 w-full h-full cursor-pointer"
                                        />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-white">Custom</h3>
                                        <p className="text-xs text-gray-400">Pick Color</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </motion.div>

                    {/* Notification Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`${cardBg} ${cardBorder} backdrop-blur-sm rounded-xl p-6`}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <Bell className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold">Notifications</h2>
                                    <p className="text-xs text-gray-400">Manage how you receive updates</p>
                                </div>
                            </div>
                            {permission !== 'granted' && (
                                <button
                                    onClick={requestPermission}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg text-xs font-medium hover:bg-yellow-500/30 transition-colors"
                                >
                                    <AlertTriangle className="w-3 h-3" />
                                    Enable Permissions
                                </button>
                            )}
                        </div>
                        <div className="space-y-4">
                            {/* Email */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Email Notifications</p>
                                    <p className="text-xs text-gray-400">Receive updates via email</p>
                                </div>
                                <button
                                    onClick={() => updateSettings({ email: !settings.email })}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${settings.email ? 'bg-red-500' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.email ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>
                            {/* Push */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Push Notifications</p>
                                    <p className="text-xs text-gray-400">Receive browser notifications</p>
                                </div>
                                <button
                                    onClick={() => updateSettings({ push: !settings.push })}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${settings.push ? 'bg-red-500' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.push ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>
                            {/* Events */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Event Reminders</p>
                                    <p className="text-xs text-gray-400">Get notified about upcoming events</p>
                                </div>
                                <button
                                    onClick={() => updateSettings({ events: !settings.events })}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${settings.events ? 'bg-red-500' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.events ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>
                            {/* Inventory */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Inventory Alerts</p>
                                    <p className="text-xs text-gray-400">Low stock and broken item alerts</p>
                                </div>
                                <button
                                    onClick={() => updateSettings({ inventory: !settings.inventory })}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${settings.inventory ? 'bg-red-500' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.inventory ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
