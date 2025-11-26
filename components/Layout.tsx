import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Calendar, Activity, Users, ChevronRight, LogOut, Bell, LayoutDashboard, Package, Settings, FileText, Menu, X, Cpu, FolderOpen } from 'lucide-react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import PatternBackground from './PatternBackground';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { generatePalette } from '../utils/colorUtils';

const NAV_ITEMS = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'events', name: 'Events', icon: Calendar, path: '/events' },
    { id: 'notebook', name: 'Notebook', icon: FileText, path: '/notebook' },
    { id: 'programmers-nook', name: "Programmer's Nook", icon: Cpu, path: '/programmers-nook' },
    { id: 'inventory', name: 'Inventory', icon: Package, path: '/inventory' },
    { id: 'files', name: 'Files (Experimental)', icon: FolderOpen, path: '/files', disabled: true },
    { id: 'reports', name: 'Reports', icon: FileText, path: '/reports' },
    { id: 'settings', name: 'Settings', icon: Settings, path: '/settings' },
];

const ROLE_COLORS: Record<string, string> = {
    Driver: 'bg-pink-500',
    Programmer: 'bg-purple-500',
    Notebook: 'bg-red-500',
    Builder: 'bg-green-500',
    Coach: 'bg-blue-500',
    Adviser: 'bg-yellow-500',
};

export default function Layout() {
    const { teamMembers } = useData();
    const { user, logout } = useAuth();
    const { colorTheme, customColor } = useTheme(); // Get theme
    const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Mock current user if not logged in (fallback)
    const currentUser = user || {
        name: 'Guest',
        avatar: 'G',
        role: 'Visitor'
    };

    // Theme-based styles helper
    const getThemeStyles = () => {
        if (colorTheme === 'orange') {
            return {
                gradientClass: 'from-red-500 to-orange-500',
                activeBgClass: 'bg-gradient-to-r from-red-500/20 to-orange-500/20',
                activeBorderClass: 'border-red-500/30',
                logoGradientClass: 'from-red-500 to-orange-500',
                style: { gradient: {}, activeBg: {}, activeBorder: {}, logoGradient: {} }
            };
        }
        if (colorTheme === 'violet') {
            return {
                gradientClass: 'from-violet-500 to-fuchsia-500',
                activeBgClass: 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20',
                activeBorderClass: 'border-violet-500/30',
                logoGradientClass: 'from-violet-500 to-fuchsia-500',
                style: { gradient: {}, activeBg: {}, activeBorder: {}, logoGradient: {} }
            };
        }

        // Custom Theme - Generate Palette
        const palette = generatePalette(customColor);
        return {
            gradientClass: '',
            activeBgClass: '',
            activeBorderClass: '',
            logoGradientClass: '',
            style: {
                gradient: { backgroundImage: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})` },
                activeBg: { backgroundImage: `linear-gradient(90deg, ${palette.primary}33, ${palette.secondary}33)` },
                activeBorder: { borderColor: `${palette.primary}4D` },
                logoGradient: { backgroundImage: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})` }
            }
        };
    };

    const currentTheme = getThemeStyles();

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    // Handle screen resize to reset states
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden relative">
            {/* Pattern Background */}
            <PatternBackground />

            {/* Top Navigation */}
            <nav className="fixed w-full z-50 bg-black/40 backdrop-blur-xl shadow-lg border-b border-white/5">
                <div className="h-20 flex items-center justify-between px-4 md:px-6">
                    {/* Left Side: Mobile Menu & Logo */}
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 md:hidden hover:bg-white/5 rounded-lg transition-colors"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>

                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-7 h-7 bg-gradient-to-br ${currentTheme.logoGradientClass} rounded-lg flex items-center justify-center`}
                                style={currentTheme.style.logoGradient}
                            >
                                <span className="text-white font-bold text-xs">VEX</span>
                            </div>
                            <span className="text-lg font-bold hidden sm:block">CDM VEX Robotics Hub</span>
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-3">
                        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <Link to="/" onClick={logout} className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors text-sm">
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:block">Sign Out</span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Left Sidebar - Navigation */}
            {/* Mobile Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Content */}
            <aside className={`
                fixed left-0 top-20 h-[calc(100vh-5rem)] w-60 bg-black/40 backdrop-blur-xl shadow-xl z-40 flex flex-col border-r border-white/5
                transition-transform duration-300 ease-in-out
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="mb-4">
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Navigation</span>
                    </div>
                    <div className="space-y-1">
                        {NAV_ITEMS.map((item) => {
                            const isActive = location.pathname === item.path;
                            const isDisabled = (item as any).disabled;

                            if (isDisabled) {
                                return (
                                    <div
                                        key={item.id}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 opacity-40 cursor-not-allowed"
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span className="text-sm font-medium">{item.name}</span>
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={item.id}
                                    to={item.path}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                                        ? `${currentTheme.activeBgClass} text-white border ${currentTheme.activeBorderClass}`
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                    style={isActive ? { ...currentTheme.style.activeBg, ...currentTheme.style.activeBorder } : {}}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-sm font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* User Profile Section */}
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                        <div className={`w-10 h-10 rounded-full ${ROLE_COLORS[currentUser.role]} flex items-center justify-center font-bold text-sm`}>
                            {currentUser.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{currentUser.name}</p>
                            <p className="text-xs text-gray-400">{currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className={`pt-20 transition-all duration-300 ${mobileMenuOpen ? 'md:ml-60' : 'md:ml-60'} ml-0`}>
                <Outlet />
            </div>

            {/* Right Sidebar - Team Members (Overlay) */}
            <AnimatePresence>
                {rightSidebarOpen && (
                    <motion.div
                        initial={{ x: 288 }}
                        animate={{ x: 0 }}
                        exit={{ x: 288 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-20 h-[calc(100vh-5rem)] w-72 bg-black/40 backdrop-blur-xl border-l border-white/10 shadow-xl overflow-y-auto z-40 hidden lg:block"
                    >
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-bold flex items-center gap-2">
                                    <Users className="w-4 h-4 text-blue-400" />
                                    Team Members
                                </h2>
                                <button
                                    onClick={() => setRightSidebarOpen(false)}
                                    className="p-1 hover:bg-white/5 rounded transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-2">
                                {teamMembers.map((member, i) => (
                                    <motion.div
                                        key={member.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                                    >
                                        <div className="relative">
                                            <div className={`w-10 h-10 rounded-full ${ROLE_COLORS[member.role]} flex items-center justify-center font-bold text-xs`}>
                                                {member.avatar}
                                            </div>
                                            <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-black ${member.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{member.name}</p>
                                            <p className="text-xs text-gray-400">{member.role.charAt(0).toUpperCase() + member.role.slice(1)}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Right Sidebar Toggle Button */}
            {!rightSidebarOpen && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setRightSidebarOpen(true)}
                    className={`fixed right-4 top-20 p-2 bg-gradient-to-br ${currentTheme.gradientClass} rounded-full shadow-lg hover:scale-110 transition-transform z-40 hidden lg:block`}
                    style={currentTheme.style.gradient}
                >
                    <Users className="w-4 h-4" />
                </motion.button>
            )}
        </div>
    );
}
