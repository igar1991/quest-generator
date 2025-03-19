"use client";

import React, { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "link" | "loading";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

/**
 * Reusable button component with various styles and sizes
 * @param props Button properties including variant, size, loading state, etc.
 * @returns Button component
 */
const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  icon,
  className = "",
  children,
  disabled,
  ...props
}) => {
  // Base styles that apply to all buttons
  const baseClasses =
    "font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  // Size variations
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  // Variant styles
  const variantClasses = {
    primary:
      "bg-primary hover:bg-primary/90 text-white focus:ring-primary disabled:bg-gray-300 disabled:text-gray-700",
    secondary:
      "bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-300 disabled:bg-gray-100 disabled:text-gray-600",
    danger:
      "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 disabled:bg-red-300 disabled:text-gray-700",
    link: "bg-transparent hover:bg-gray-100 text-primary underline focus:ring-primary disabled:text-gray-600 disabled:no-underline",
    loading: "bg-gray-400 text-gray-800 cursor-wait",
  };

  // Handle loading and disabled states
  const currentVariant = isLoading ? "loading" : variant;
  const isDisabled = disabled === true || isLoading === true;

  // Width classes
  const widthClasses = fullWidth === true ? "w-full" : "";

  // Get the appropriate spinner color based on the button variant
  const spinnerColor =
    variant === "secondary" || variant === "link"
      ? "text-gray-800"
      : "text-white";

  return (
    <button
      className={`
        ${baseClasses} 
        ${sizeClasses[size]} 
        ${!className.includes("bg-") ? variantClasses[currentVariant] : ""} 
        ${widthClasses}
        ${isDisabled ? "cursor-not-allowed" : ""}
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      <div className="flex items-center justify-center">
        {isLoading === true && (
          <svg
            className={`animate-spin -ml-1 mr-2 h-4 w-4 ${spinnerColor}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {isLoading !== true && icon !== undefined && icon !== null && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
      </div>
    </button>
  );
};

// Export common button styles to use across the app
export const buttonStyles = {
  questAction: "w-full bg-blue-600 hover:bg-blue-700 text-white min-h-[48px]",
};

export default Button;
