import React from "react";

interface SubmitButtonProps {
    title: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ( { title } ) => {
  return (
    <button
      type="submit"
      className="mt-4 w-72 rounded-lg bg-accent px-4 py-3 font-semibold text-white transition duration-200 hover:bg-accentHover"
    >
      {title}
    </button>
  );
};

export default SubmitButton;
