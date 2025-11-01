// Button.tsx
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  className?:string;
  rounded?:string;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className="",
  rounded
}) => {
  const baseStyle =
    `transition-all duration-200 focus:outline-none cursor-pointer ${rounded?rounded:"rounded-lg"}`;

  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-700 disabled:bg-blue-300",
    secondary: "bg-gray-100 text-gray-600 hover:bg-gray-300 disabled:bg-gray-100",
    danger: "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300",
  };

  return (
    <button
      className={`${className} ${baseStyle} ${variants[variant]} ${
        disabled ? "cursor-not-allowed" : ""
      } `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
