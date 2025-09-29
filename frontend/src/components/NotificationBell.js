// frontend/src/components/NotificationBell.js (BARU)

import React, { useContext, useState } from "react";
import { FaBell, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaHourglassHalf } from 'react-icons/fa';
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Untuk navigasi saat notif diklik

const API_BASE = "http://localhost:3000";

// Komponen Card Notifikasi Tunggal
const NotificationItem = ({ notif, onNavigate }) => {
    
    // Helper untuk menentukan ikon berdasarkan tipe notifikasi
    const getIcon = (type) => {
        if (type.includes('added')) return <FaCheckCircle className="text-green-500" />;
        if (type.includes('updated') || type.includes('status_changed')) return <FaInfoCircle className="text-blue-500" />;
        if (type.includes('training_started')) return <FaHourglassHalf className="text-teal-500" />;
        if (type.includes('training_finished')) return <FaTimesCircle className="text-red-500" />;
        return <FaBell className="text-gray-500" />;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('id-ID', {
            hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short'
        });
    };

    // Helper untuk menentukan path navigasi
    const getPath = (type, id) => {
        if (!id) return null;
        if (type.includes('customer')) return `/customer/${id}`;
        if (type.includes('opti') || type.includes('training_scheduled')) return `/opti/${id}`;
        if (type.includes('training')) return `/training`; // Arahkan ke halaman daftar training
        return null;
    };

    const targetPath = getPath(notif.type, notif.related_entity_id);
    const handleClick = () => {
        if (targetPath) {
            onNavigate(targetPath);
        }
    };
    
    return (
        <div 
            onClick={handleClick}
            className={`p-3 border-b hover:bg-gray-50 flex items-start space-x-3 transition cursor-pointer ${notif.is_read ? 'bg-white' : 'bg-blue-50'}`}
        >
            <div className="mt-1 flex-shrink-0">{getIcon(notif.type)}</div>
            <div className="flex-1">
                <p className={`text-sm ${notif.is_read ? 'text-gray-700' : 'font-semibold text-gray-900'}`}>{notif.message}</p>
                <p className="text-xs text-gray-500 mt-1">{formatDate(notif.created_at)}</p>
            </div>
        </div>
    );
};


const NotificationBell = () => {
    const { user, unreadCount, markAllAsRead, fetchUnreadCount } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        if (!user?.token) return;
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/api/notifications`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setNotifications(res.data);
            setIsLoading(false);
        } catch (e) {
            console.error("Failed to fetch notifications:", e);
            setIsLoading(false);
        }
    };

    const handleBellClick = async () => {
        if (!isOpen) {
            await fetchNotifications();
            // Tandai sudah dibaca setelah pop-up terbuka dan notifikasi diambil
            if (unreadCount > 0) {
                await markAllAsRead();
            }
        }
        setIsOpen(!isOpen);
    };

    const handleNavigate = (path) => {
        setIsOpen(false);
        navigate(path);
    };
    
    // Gunakan useLayoutEffect untuk menangani klik di luar pop-up
    React.useEffect(() => {
        if (!isOpen) return;
        const closeOnOutsideClick = (e) => {
            if (!e.target.closest('.notification-container')) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', closeOnOutsideClick);
        return () => document.removeEventListener('mousedown', closeOnOutsideClick);
    }, [isOpen]);

    return (
        <div className="relative notification-container">
            <button
                onClick={handleBellClick}
                className="p-2 relative rounded-full hover:bg-gray-100 transition"
                aria-label="Notifications"
            >
                <FaBell className="w-6 h-6 text-gray-700" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-red-500" />
                )}
            </button>
            
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 origin-top-right animate-scale-in">
                    <div className="p-3 border-b flex justify-between items-center">
                        <h3 className="text-md font-bold text-gray-800">Pemberitahuan</h3>
                        <span className="text-sm text-gray-500">{notifications.length} total</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {isLoading ? (
                            <div className="p-4 text-center text-sm text-gray-500">Memuat...</div>
                        ) : notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <NotificationItem key={notif.id} notif={notif} onNavigate={handleNavigate} />
                            ))
                        ) : (
                            <div className="p-4 text-center text-sm text-gray-500">Tidak ada pemberitahuan.</div>
                        )}
                    </div>
                </div>
            )}
            {/* Animasi CSS (bisa ditempatkan di file CSS utama jika menggunakan Tailwind) */}
            <style>{`
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-scale-in {
                    animation: scaleIn 0.1s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default NotificationBell;