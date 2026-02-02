import { useState, useEffect, useContext, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Users,
    Heart,
    Share2,
    MessageCircle,
    Play,
    Volume2,
    Settings as SettingsIcon,
    Maximize,
    Flag,
    Info,
    Mic,
    MicOff,
    Video as VideoIcon,
    VideoOff,
    Activity
} from "lucide-react";
import io from "socket.io-client";
import Peer from "simple-peer";
import API from "../api/axios";
import { ThemeContext } from "../contexts/ThemeContexts";
import "./CSS/LiveStream.css";

const PORT_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function LiveStream() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewerCount, setViewerCount] = useState(0);
    const [chatMessage, setChatMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const { darkMode } = useContext(ThemeContext);
    const user = JSON.parse(localStorage.getItem("user"));

    // WebRTC & Socket States
    const [stream, setStream] = useState(null);
    const [isBroadcaster, setIsBroadcaster] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const socketRef = useRef();
    const myVideo = useRef();
    const remoteVideo = useRef();
    const peersRef = useRef([]); // For broadcaster: [{peerId, peer}]

    useEffect(() => {
        if (!eventId) return;

        // 1. Fetch Event Info
        API.get(`/events/${eventId}`)
            .then((res) => {
                const eventData = res.data;
                setEvent(eventData);
                setLoading(false);

                // Check if the current user is the owner/organizer
                const isOwner = eventData.createdBy?._id === user?.id || eventData.createdBy === user?.id;
                setIsBroadcaster(isOwner);

                // 2. Initialize Socket Connection
                socketRef.current = io(SOCKET_URL);
                socketRef.current.emit("joinRoom", eventId);

                if (isOwner) {
                    // BROADCASTER LOGIC
                    if (eventData.liveStream?.streamType === "Camera") {
                        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                            .then((currentStream) => {
                                setStream(currentStream);
                                if (myVideo.current) {
                                    myVideo.current.srcObject = currentStream;
                                }

                                socketRef.current.on("userJoined", (userId) => {
                                    console.log("New viewer joined:", userId);
                                    const peer = createPeer(userId, socketRef.current.id, currentStream);
                                    peersRef.current.push({
                                        peerId: userId,
                                        peer,
                                    });
                                });
                            })
                            .catch(err => console.error("Media error:", err));
                    }
                } else {
                    // VIEWER LOGIC
                    if (eventData.liveStream?.streamType === "Camera") {
                        socketRef.current.on("signal", (data) => {
                            const peer = addPeer(data.signal, data.from);
                        });
                    }
                }

                // Handle Chat
                socketRef.current.on("receiveMessage", (msg) => {
                    setMessages((prev) => [...prev, msg]);
                });

                // Handle Real Viewer Count
                socketRef.current.on("viewerCount", (count) => {
                    setViewerCount(count);
                });
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [eventId]);

    // Broadcaster Helper: Create a new peer for a viewer
    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", (signal) => {
            socketRef.current.emit("signal", { to: userToSignal, from: callerID, signal });
        });

        return peer;
    }

    // Viewer Helper: Join a stream from a broadcaster
    function addPeer(incomingSignal, callerID) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
        });

        peer.on("signal", (signal) => {
            socketRef.current.emit("signal", { to: callerID, from: socketRef.current.id, signal });
        });

        peer.on("stream", (stream) => {
            if (remoteVideo.current) {
                remoteVideo.current.srcObject = stream;
            }
        });

        peer.signal(incomingSignal);
        return peer;
    }

    const sendMessage = (e) => {
        if (e.key === "Enter" || e.type === "click") {
            if (!chatMessage.trim()) return;
            const msg = {
                id: Date.now(),
                user: user?.username || "Guest",
                text: chatMessage,
                eventId,
                isAdmin: isBroadcaster
            };
            socketRef.current.emit("sendMessage", msg);
            setChatMessage("");
        }
    };

    const toggleAudio = () => {
        if (stream) {
            stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
            setIsMuted(!stream.getAudioTracks()[0].enabled);
        }
    };

    const toggleVideo = () => {
        if (stream) {
            stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
            setIsVideoOff(!stream.getVideoTracks()[0].enabled);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white p-4">
                <h2 className="text-2xl font-bold mb-4">Stream Not Found</h2>
                <Link to="/events" className="text-pink-500 hover:underline">Return to Events</Link>
            </div>
        );
    }

    return (
        <div className={`live-stream-container ${darkMode ? 'dark' : ''}`}>
            {/* Main Stream Area */}
            <section className="main-stream-area">
                <div className="video-container">
                    <div className="video-placeholder !bg-black">
                        {event.liveStream?.streamType === "Camera" ? (
                            isBroadcaster ? (
                                <video
                                    ref={myVideo}
                                    autoPlay
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <>
                                    <video
                                        ref={remoteVideo}
                                        autoPlay
                                        playsInline
                                        className="w-full h-full object-cover"
                                        poster={event.image ? `${PORT_URL}/uploads/event_image/${event.image}` : undefined}
                                    />
                                    {!remoteVideo.current?.srcObject && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
                                            <Activity className="animate-spin mb-4" />
                                            <p>Waiting for broadcaster...</p>
                                        </div>
                                    )}
                                </>
                            )
                        ) : (
                            <div className="w-full h-full">
                                {event.liveStream?.streamURL ? (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={event.liveStream.streamURL.replace("watch?v=", "embed/")}
                                        title="Live Stream"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
                                        <VideoIcon size={48} className="mb-4" />
                                        <p>No stream URL provided for {event.liveStream?.streamType}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="stream-overlay">
                            <div className="live-indicator">
                                <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>
                                LIVE
                            </div>
                            <div className="viewer-count">
                                <Users size={14} />
                                {viewerCount.toLocaleString()}
                            </div>
                        </div>

                        {/* Video Controls */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    {isBroadcaster ? (
                                        <>
                                            <button onClick={toggleAudio} className={`p-2 rounded-full ${isMuted ? 'bg-red-500' : 'bg-white/20'}`}>
                                                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                                            </button>
                                            <button onClick={toggleVideo} className={`p-2 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-white/20'}`}>
                                                {isVideoOff ? <VideoOff size={20} /> : <VideoIcon size={20} />}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Play size={20} className="cursor-pointer hover:text-pink-500" />
                                            <Volume2 size={20} className="cursor-pointer hover:text-pink-500" />
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center gap-6">
                                    <SettingsIcon size={20} className="cursor-pointer hover:text-pink-500" />
                                    <Maximize size={20} className="cursor-pointer hover:text-pink-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stream Info Area */}
                <div className="stream-info-bar">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="stream-title">{event.title}</h1>
                            <div className="flex items-center gap-3 text-slate-400 text-sm">
                                <span className="flex items-center gap-1"><Info size={14} /> {event.category || "Event"}</span>
                                <span>•</span>
                                <span>{isBroadcaster ? "You are broadcasting" : `Started at ${new Date(event.startDate).toLocaleTimeString()}`}</span>
                            </div>
                        </div>
                        <div className="stream-actions">
                            <button className="btn-stream btn-share">
                                <Share2 size={18} /> Share
                            </button>
                            <button className="btn-stream btn-secondary bg-slate-700 px-3">
                                <Flag size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="creator-strip">
                        <div className="creator-info-left">
                            {event.createdBy?.profilePic ? (
                                <img
                                    src={`${PORT_URL}/uploads/profile_pic/${event.createdBy.profilePic}`}
                                    alt={event.createdBy.username}
                                    className="creator-avatar-large"
                                />
                            ) : (
                                <div className="creator-avatar-large bg-pink-500 flex items-center justify-center font-bold">
                                    {event.createdBy?.username?.charAt(0) || "U"}
                                </div>
                            )}
                            <div className="creator-details">
                                <h4>{event.createdBy?.username || "Organizer"}</h4>
                                <p className="follower-count">1.2K followers</p>
                            </div>
                            <button className="btn-stream btn-follow ml-4">
                                <Heart size={18} /> Follow
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 text-slate-300 text-sm border-t border-slate-700 pt-4">
                        <p>{event.description || "Join us for this amazing live event! Don't forget to interact in the chat."}</p>
                    </div>
                </div>
            </section>

            {/* Chat Sidebar */}
            <aside className="stream-chat-sidebar">
                <div className="chat-header">
                    Live Chat
                </div>
                <div className="chat-messages-container scrollbar-hide">
                    {messages.length === 0 && (
                        <div className="text-center text-slate-500 mt-10 text-sm">
                            Welcome to the chat! Say hello 👋
                        </div>
                    )}
                    {messages.map(msg => (
                        <div key={msg.id} className="mock-message animate-in slide-in-from-bottom-2 duration-300">
                            <span className={`mock-user ${msg.isAdmin ? 'text-pink-400' : 'text-slate-300'}`}>
                                {msg.user}:
                            </span>
                            <span className="mock-text">{msg.text}</span>
                        </div>
                    ))}
                    <div className="mt-auto p-2 bg-pink-500/10 border border-pink-500/20 rounded-lg text-xs text-pink-300 flex items-center gap-2">
                        <MessageCircle size={14} />
                        Keep the community safe and friendly!
                    </div>
                </div>
                <div className="chat-input-wrapper">
                    <input
                        type="text"
                        placeholder="Send a message..."
                        className="chat-input-field"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyDown={sendMessage}
                    />
                </div>
            </aside>
        </div>
    );
}

