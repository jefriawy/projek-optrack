// frontend/src/components/NotificationBell.js

import React, { useContext, useState, useEffect } from "react";
import { FaBell, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaHourglassHalf, FaCalendarCheck, FaChevronDown, FaChevronUp } from 'react-icons/fa'; 
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const API_BASE = "http://localhost:3000";

// Komponen Notifikasi Tunggal (sekarang tidak bisa diklik)
const NotificationItem = ({ notif }) => {
    
    const getIcon = (type) => {
        if (type.includes('added')) return <FaCheckCircle className="text-green-500" />;
        if (type.includes('updated')) return <FaInfoCircle className="text-blue-500" />;
        if (type.includes('status_updated')) return <FaInfoCircle className="text-purple-500" />;
        if (type.includes('scheduled_po_receive')) return <FaCalendarCheck className="text-orange-500" />; 
        if (type.includes('training_started')) return <FaHourglassHalf className="text-teal-500" />;
        if (type.includes('training_finished')) return <FaTimesCircle className="text-red-500" />;
        return <FaBell className="w-4 h-4 text-gray-500" />;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('id-ID', {
            hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short'
        });
    };
    
    return (
        // Mengganti wrapper dari anchor/link ke div biasa
        <div className={`p-3 border-b hover:bg-gray-50 flex items-start space-x-3 transition ${!notif.isRead ? 'bg-blue-50' : 'bg-white'}`}>
            <div className="mt-1 flex-shrink-0 w-4 h-4">{getIcon(notif.type)}</div>
            <div className="flex-1">
                <p className={`text-sm ${!notif.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{notif.message}</p>
                <p className="text-xs text-gray-500 mt-1">{formatDate(notif.created_at)}</p>
            </div>
        </div>
    );
};


const NotificationBell = () => {
    const { user, unreadCount, fetchUnreadCount } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState([]);
    const [readNotifications, setReadNotifications] = useState([]);
    const [showRead, setShowRead] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchNotifications = async () => {
        if (!user?.token) return;
        setIsLoading(true);
        try {
            // API sekarang mengambil SEMUA notifikasi
            const res = await axios.get(`${API_BASE}/api/notifications`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            
            // Pisahkan notifikasi menjadi 'read' dan 'unread'
            const allNotifs = res.data;
            setUnreadNotifications(allNotifs.filter(n => !n.isRead));
            setReadNotifications(allNotifs.filter(n => n.isRead));

        } catch (e) {
            console.error("Failed to fetch notifications:", e);
        } finally {
            setIsLoading(false);
        }
    };

    const markNotificationsAsRead = async () => {
        if (!user?.token || unreadCount === 0) return;
        try {
            // Panggil endpoint baru untuk menandai semua sebagai telah dibaca
            await axios.put(`${API_BASE}/api/notifications/mark-as-read`, {}, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            // Refresh unread count di context
            fetchUnreadCount();
        } catch (e) {
            console.error("Failed to mark notifications as read:", e);
        }
    };

    const handleBellClick = async () => {
        if (!isOpen) {
            // Reset state saat membuka kembali
            setShowRead(false); 
            await fetchNotifications();
            // Tandai sudah dibaca setelah pop-up terbuka
            await markNotificationsAsRead();
        }
        setIsOpen(!isOpen);
    };
    
    useEffect(() => {
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
                    <div className="p-3 border-b">
                        <h3 className="text-md font-bold text-gray-800">Pemberitahuan</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {isLoading ? (
                            <div className="p-4 text-center text-sm text-gray-500">Memuat...</div>
                        ) : (
                            <>
                                {/* Tampilkan notifikasi yang belum dibaca */}
                                {unreadNotifications.length > 0 ? (
                                    unreadNotifications.map((notif) => (
                                        <NotificationItem key={notif.id} notif={notif} />
                                    ))
                                ) : (
                                    // Pesan jika tidak ada notifikasi baru
                                    <div className="p-4 text-center text-sm text-gray-400 opacity-75">Tidak ada notifikasi baru.</div>
                                )}
                                
                                {/* Kontainer untuk notifikasi yang sudah dibaca dengan transisi */}
                                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showRead ? "max-h-96" : "max-h-0"}`}>
                                    {readNotifications.map((notif) => (
                                        <NotificationItem key={notif.id} notif={notif} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    {/* Footer baru dengan tombol buka/tutup dan border-radius */}
                    <footer className="p-2 border-t bg-gray-50 text-center rounded-b-lg">
                        {readNotifications.length > 0 && (
                            <button 
                                onClick={() => setShowRead(!showRead)}
                                className="text-sm text-blue-600 focus:outline-none flex flex-col items-center group w-full"
                            >
                                {showRead ? (
                                    <>
                                        <FaChevronUp className="h-5 w-5 mb-1 animate-bounce-y-up" />
                                        <span>Tutup notifikasi sebelumnya</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Buka notifikasi sebelumnya</span>
                                        <FaChevronDown className="h-5 w-5 mt-1 animate-bounce-y" />
                                    </>
                                )}
                            </button>
                        )}
                    </footer>
                </div>
            )}
            <style>{`
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-scale-in {
                    animation: scaleIn 0.1s ease-out forwards;
                }
                @keyframes bounce-y {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(3px);
                    }
                }
                .animate-bounce-y {
                    animation: bounce-y 1.5s infinite;
                }
                @keyframes bounce-y-up {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-3px);
                    }
                }
                .animate-bounce-y-up {
                    animation: bounce-y-up 1.5s infinite;
                }
            `}</style>
        </div>
    );
};

export default NotificationBell;
