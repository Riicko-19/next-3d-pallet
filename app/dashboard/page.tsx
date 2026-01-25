'use client';

import { motion } from 'framer-motion';
import {
    Package,
    MapPin,
    Activity,
    AlertTriangle,
    Thermometer,
    Zap,
    BarChart3,
    Bell,
    Settings,
    LogOut,
    Home,
} from 'lucide-react';
import Link from 'next/link';

const sensorData = [
    {
        id: 'PL-2401',
        status: 'normal',
        temp: 22,
        shock: 'Normal',
        location: 'Mumbai Port',
    },
    {
        id: 'PL-2402',
        status: 'alert',
        temp: 38,
        shock: 'High Impact Detected',
        location: 'Delhi Warehouse',
    },
    {
        id: 'PL-2403',
        status: 'normal',
        temp: 24,
        shock: 'Normal',
        location: 'Bangalore Hub',
    },
    {
        id: 'PL-2404',
        status: 'normal',
        temp: 20,
        shock: 'Normal',
        location: 'Chennai Port',
    },
];

export default function DashboardPage() {
    return (
        <div className="min-h-screen flex">
            {/* Sidebar Navigation */}
            <aside className="w-64 glass-panel border-r border-white/10 p-6 hidden lg:flex flex-col">
                <div className="mb-8">
                    <h2 className="text-2xl font-black tracking-tight">Ambica</h2>
                    <p className="text-xs text-gray-400">Patterns</p>
                </div>

                <nav className="flex-grow space-y-2">
                    <a
                        href="#"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 border border-primary/30 text-primary font-medium transition-all"
                    >
                        <Home className="w-5 h-5" />
                        Dashboard
                    </a>
                    <a
                        href="#"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all"
                    >
                        <Package className="w-5 h-5" />
                        Inventory
                    </a>
                    <a
                        href="#"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all"
                    >
                        <MapPin className="w-5 h-5" />
                        Tracking
                    </a>
                    <a
                        href="#"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all"
                    >
                        <BarChart3 className="w-5 h-5" />
                        Analytics
                    </a>
                    <a
                        href="#"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all"
                    >
                        <Activity className="w-5 h-5" />
                        Sensors
                    </a>
                </nav>

                <div className="space-y-2 border-t border-white/10 pt-6">
                    <a
                        href="#"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all"
                    >
                        <Settings className="w-5 h-5" />
                        Settings
                    </a>
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-2">
                            Command Center
                        </h1>
                        <p className="text-gray-400">Real-time operations monitoring</p>
                    </div>

                    <motion.button
                        className="px-6 py-4 rounded-xl bg-primary text-black font-bold hover:bg-yellow-500 transition-all pulse-animation flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Zap className="w-5 h-5" />
                        Request Urgent Shipment
                    </motion.button>
                </div>

                {/* Widgets Grid (Bento Layout) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Live Map Widget */}
                    <motion.div
                        className="lg:col-span-2 lg:row-span-2 gradient-border rounded-3xl p-6 backdrop-blur-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold flex items-center gap-2">
                                <MapPin className="w-6 h-6 text-primary" />
                                Live Tracking Map
                            </h3>
                            <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-medium flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                Live
                            </span>
                        </div>

                        {/* Map Placeholder */}
                        <div className="relative h-96 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center space-y-4">
                                    <MapPin className="w-16 h-16 text-primary/30 mx-auto" />
                                    <p className="text-gray-500">Map visualization placeholder</p>
                                    <div className="flex gap-4 justify-center">
                                        {/* Marker Examples */}
                                        <div className="px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-xs">
                                            <Package className="w-4 h-4 inline mr-1" />
                                            12 In Transit
                                        </div>
                                        <div className="px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs">
                                            <Package className="w-4 h-4 inline mr-1" />
                                            8 At Warehouses
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stock Health Widget */}
                    <motion.div
                        className="gradient-border rounded-3xl p-6 backdrop-blur-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-primary" />
                            Stock Health
                        </h3>

                        <div className="flex items-center justify-center mb-6">
                            <div className="relative w-40 h-40">
                                {/* Circular Progress Bar */}
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="80"
                                        cy="80"
                                        r="70"
                                        stroke="rgba(255,255,255,0.1)"
                                        strokeWidth="12"
                                        fill="none"
                                    />
                                    <circle
                                        cx="80"
                                        cy="80"
                                        r="70"
                                        stroke="#f59e0b"
                                        strokeWidth="12"
                                        fill="none"
                                        strokeDasharray="440"
                                        strokeDashoffset="35"
                                        strokeLinecap="round"
                                        className="transition-all duration-1000"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className="text-4xl font-black text-primary">92%</div>
                                    <div className="text-xs text-gray-400">Optimal</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">Raw Materials</span>
                                <span className="text-sm font-bold">3.2 months</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">Finished Goods</span>
                                <span className="text-sm font-bold">1,247 units</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">In Production</span>
                                <span className="text-sm font-bold">342 units</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div
                        className="gradient-border rounded-3xl p-6 backdrop-blur-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-green-500" />
                            System Status
                        </h3>

                        <div className="space-y-4">
                            <div className="p-4 rounded-xl glass-panel">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-400">Production Line</span>
                                    <span className="px-2 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs">
                                        Online
                                    </span>
                                </div>
                                <div className="text-2xl font-bold">98.5%</div>
                                <div className="text-xs text-gray-500">Uptime</div>
                            </div>

                            <div className="p-4 rounded-xl glass-panel">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-400">Solar Power</span>
                                    <span className="px-2 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs">
                                        Active
                                    </span>
                                </div>
                                <div className="text-2xl font-bold">85%</div>
                                <div className="text-xs text-gray-500">Renewable</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Sensors Widget - Spans remaining columns */}
                    <motion.div
                        className="lg:col-span-3 gradient-border rounded-3xl p-6 backdrop-blur-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold flex items-center gap-2">
                                <Activity className="w-6 h-6 text-blue-500" />
                                IoT Sensor Monitoring
                            </h3>
                            <button className="px-4 py-2 rounded-xl glass-panel hover:bg-white/10 transition-all text-sm font-medium flex items-center gap-2">
                                <Bell className="w-4 h-4" />
                                Alerts (1)
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {sensorData.map((sensor, index) => (
                                <motion.div
                                    key={sensor.id}
                                    className={`p-4 rounded-2xl border ${sensor.status === 'alert'
                                            ? 'bg-red-500/5 border-red-500/30'
                                            : 'glass-panel'
                                        }`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="font-bold text-lg">{sensor.id}</div>
                                            <div className="text-sm text-gray-400 flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {sensor.location}
                                            </div>
                                        </div>
                                        {sensor.status === 'alert' && (
                                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-bold animate-pulse">
                                                <AlertTriangle className="w-4 h-4" />
                                                Alert
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 rounded-xl bg-white/5">
                                            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                                                <Thermometer className="w-4 h-4" />
                                                Temperature
                                            </div>
                                            <div
                                                className={`text-xl font-bold ${sensor.temp > 30 ? 'text-red-400' : 'text-green-400'
                                                    }`}
                                            >
                                                {sensor.temp}°C
                                            </div>
                                        </div>

                                        <div className="p-3 rounded-xl bg-white/5">
                                            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                                                <Activity className="w-4 h-4" />
                                                Shock
                                            </div>
                                            <div
                                                className={`text-sm font-bold ${sensor.shock === 'Normal' ? 'text-green-400' : 'text-red-400'
                                                    }`}
                                            >
                                                {sensor.shock}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
