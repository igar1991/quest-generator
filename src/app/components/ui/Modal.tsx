"use client";

import React, { useEffect, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  preventOutsideClose?: boolean;
}

/**
 * Reusable Modal component for displaying content in a modal dialog
 * @param isOpen - Whether the modal is open
 * @param onClose - Function to call when the modal is closed
 * @param children - Content to display in the modal
 * @param preventOutsideClose - If true, clicking outside the modal won't close it
 * @returns Modal component
 */
export default function Modal({
  isOpen,
  onClose,
  children,
  preventOutsideClose = false,
}: ModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // First render the component
      setShouldRender(true);
      // Then start the animation after a tiny delay
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      // First stop the animation
      setIsAnimating(false);
      // Then remove the component after animation completes
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out flex items-center justify-center z-50 p-4 md:p-6 
        ${isAnimating ? "bg-opacity-50 backdrop-blur-sm" : "bg-opacity-0"}`}
      onClick={(e) => {
        // Close modal when clicking the backdrop, not when clicking the modal content
        if (!preventOutsideClose && e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`bg-white rounded-xl p-6 max-w-md w-full mx-auto shadow-2xl transition-all duration-300 ease-out
          ${
            isAnimating
              ? "opacity-100 transform translate-y-0 scale-100"
              : "opacity-0 transform -translate-y-8 scale-95"
          }`}
      >
        {children}
      </div>
    </div>
  );
}
