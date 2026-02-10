import { useRef, useEffect } from "react";
import { AlertTriangle, X, Info } from "lucide-react";
import "./css/ConfirmationModal.css";

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.", 
  confirmText = "Confirm", 
  confirmColor = "primary",  // primary | danger
  icon = "info" // info | warning
}) {
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

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" ref={modalRef}>
                <button className="modal-close" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className={`modal-icon-wrapper ${confirmColor}`}>
                    {icon === "warning" ? <AlertTriangle size={32} /> : <Info size={32} />}
                </div>

                <h2 className="modal-title">{title}</h2>
                <p className="modal-message">{message}</p>

                <div className="modal-actions">
                    <button className="modal-btn cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button 
                      className={`modal-btn confirm ${confirmColor}`} 
                      onClick={() => {
                        onConfirm();
                        onClose();
                      }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
