import React from "react";
import Logo from "./Logo";
import HeaderButton from "./HeaderButton";
import icons from "../../../assets/icons/icons";

interface MobileMenuModalProps {
  onClose: () => void;
}

const MobileMenuModal: React.FC<MobileMenuModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-backgroundOverlay px-6 md:hidden">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full border border-border bg-surface p-2 text-text transition hover:bg-surfaceAlt"
      >
        {icons.closeIcon}
      </button>

      <div className="flex h-full w-full flex-col items-center justify-evenly bg-background">
        <Logo clickable={false} size={85} />
        <ul className="flex flex-col items-center justify-center gap-4">
          <HeaderButton linkName="home" buttonName="Home" size={24} />
          <HeaderButton linkName="pricing" buttonName="Pricing" size={24} />
          <HeaderButton linkName="blog" buttonName="Blog" size={24} />
        </ul>
        <ul className="flex flex-col items-center justify-center gap-4">
          <HeaderButton linkName="login" buttonName="Log in" size={22} />
          <HeaderButton linkName="signup" buttonName="Sign up" size={22} />
        </ul>
      </div>
    </div>
  );
};

export default MobileMenuModal;
