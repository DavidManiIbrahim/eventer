import { useRef, useEffect } from "react";
import { LogOut, X } from "lucide-react";
import "./css/LogoutModal.css";

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
    const modalRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="logout-modal-overlay">
            <div className="logout-modal-content" ref={modalRef}>
                <button className="logout-modal-close" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="logout-modal-icon-wrapper">
                    <LogOut size={32} className="logout-modal-icon" />
                </div>

                <h2 className="logout-modal-title">Sign out?</h2>
                <p className="logout-modal-message">
                    Are you sure you want to sign out? You'll need to sign back in to access your account.
                </p>

                <div className="logout-modal-actions">
                    <button className="logout-modal-btn cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="logout-modal-btn confirm" onClick={onConfirm}>
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
