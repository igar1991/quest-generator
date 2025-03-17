"use client";

import React, { AnchorHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "link";
type ButtonSize = "sm" | "md" | "lg";

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

/**
 * Reusable link button component with various styles and sizes
 * @param props Link button properties including variant, size, etc.
 * @returns LinkButton component
 */
const LinkButton: React.FC<LinkButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  className = "",
  children,
  ...props
}) => {
  // Base styles that apply to all buttons
  const baseClasses =
    "font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center text-center";

  // Size variations
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  // Variant styles
  const variantClasses = {
    primary: "bg-primary hover:bg-primary/90 text-white focus:ring-primary",
    secondary:
      "bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-300",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500",
    link: "bg-transparent hover:bg-gray-100 text-primary underline focus:ring-primary",
  };

  // Width classes
  const widthClasses = fullWidth ? "w-full" : "";

  return (
    <a
      className={`
        ${baseClasses} 
        ${sizeClasses[size]} 
        ${variantClasses[variant]} 
        ${widthClasses}
        ${className}
      `}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </a>
  );
};

export default LinkButton;
