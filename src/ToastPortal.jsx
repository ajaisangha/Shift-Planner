import { createPortal } from "react-dom";

export default function ToastPortal({ message }) {
  if (!message || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="toast-notification-center"
      role="status"
      aria-live="polite"
    >
      {message}
    </div>,
    document.body
  );
}