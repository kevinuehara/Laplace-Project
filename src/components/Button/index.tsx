import { HTMLProps } from "react";

interface ButtonProps extends HTMLProps<HTMLButtonElement> {}

export const Button = ({ onClick, label }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="p-4 text-white text-2xl bg-purple-700 rounded-md m-3 h-20 w-40"
    >
      {label}
    </button>
  );
};
