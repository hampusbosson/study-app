import React from "react";
import { Link } from "react-router-dom";

interface CallToActionButtonProps {
  linkName: string;
  buttonName: string;
}

const CallToActionButton: React.FC<CallToActionButtonProps> = ({ linkName, buttonName }) => {
  return (
    <Link
      to={linkName}
      className="rounded-full bg-accent px-8 py-3 text-2xl font-semibold text-white transition duration-200 hover:bg-accentHover"
    >
      {buttonName}
    </Link>
  );
};

export default CallToActionButton;
