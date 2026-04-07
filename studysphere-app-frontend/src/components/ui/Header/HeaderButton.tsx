import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

interface HeaderButtonProps {
  linkName: string;
  buttonName: string;
  size?: number;
}

const HeaderButton: React.FC<HeaderButtonProps> = ({ linkName, buttonName, size = 20 }) => {
  const fontSize = { fontSize: `${size}px` };
  const isSignup = linkName === "signup";

  const buttonClass = classNames(
    "flex items-center justify-center rounded-full px-4 py-2 font-lato text-lg font-medium transition duration-200",
    {
      "text-text hover:bg-surfaceAlt": !isSignup,
      "bg-accent text-white hover:bg-accentHover": isSignup,
    }
  );

  return (
    <Link to={linkName} className={buttonClass} style={fontSize}>
      {buttonName}
    </Link>
  );
};

export default HeaderButton;
