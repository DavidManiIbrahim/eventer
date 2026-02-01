import { useState, useEffect, useContext } from "react";
import {
    X,
    Video,
    Activity,
    Settings,
    ChevronRight,
    AlertCircle,
    Play
} from "lucide-react";
import API from "../api/axios";
import { ThemeContext } from "../contexts/ThemeContexts";

export default function GoLiveModal({ isOpen, onClose, onStreamStarted }) {
    const [myEvents, setMyEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEventId, setSelectedEventId] = useState("");
    const [isToggling, setIsToggling] = useState(false);
    const { darkMode } = useContext(ThemeContext);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            API.get("/events/my-events")
                .then((res) => {
                    setMyEvents(res.data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [isOpen]);

    const handleToggleLive = async () => {
        if (!selectedEventId) return;

        setIsToggling(true);
        try {
            const res = await API.patch("/events/toggle-live", {
                eventId: selectedEventId,
                isLive: true
            });
            onStreamStarted(selectedEventId);
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to go live. Please try again.");
        } finally {
            setIsToggling(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm ${darkMode ? 'dark' : ''}`}>
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-lg text-pink-600 dark:text-pink-400">
                            <Video size={24} />
                        </div>
                        <h2 className="text-xl font-bold dark:text-white">Start Your Stream</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                        Select one of your existing events to start broadcasting live to your audience.
                    </p>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pink-500"></div>
                            <span className="text-slate-400 text-sm">Loading your events...</span>
                        </div>
                    ) : myEvents.length === 0 ? (
                        <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                            <AlertCircle className="mx-auto text-slate-300 mb-3" size={40} />
                            <p className="dark:text-slate-300 font-medium">No events found</p>
                            <p className="text-sm text-slate-500 mt-1">You need to create an event before you can go live.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                            {myEvents.map((event) => (
                                <div
                                    key={event._id}
                                    onClick={() => setSelectedEventId(event._id)}
                                    className={`group relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedEventId === event._id
                                            ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/10'
                                            : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/50'
                                        }`}
                                >
                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                                        {event.image ? (
                                            <img
                                                src={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/uploads/event_image/${event.image}`}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                <Play size={16} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-900 dark:text-white truncate">{event.title}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            {event.category || "General"} • {new Date(event.startDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {selectedEventId === event._id && (
                                        <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-white scale-in">
                                            <ChevronRight size={16} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                        <Activity size={14} className="flex-shrink-0" />
                        <p>Going live will notify all ticket holders that the event has started.</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={!selectedEventId || isToggling}
                            onClick={handleToggleLive}
                            className={`flex-[2] px-4 py-3 rounded-xl font-bold text-white transition-all transform active:scale-95 flex items-center justify-center gap-2 ${!selectedEventId || isToggling
                                    ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:-translate-y-0.5'
                                }`}
                        >
                            {isToggling ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Activity size={20} />
                                    Start Streaming
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
