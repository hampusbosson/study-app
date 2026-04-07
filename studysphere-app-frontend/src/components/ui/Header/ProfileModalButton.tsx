import React from "react";

interface ProfileModalButtonProps {
  onPress?: () => void;
  name: string;
  icon: React.ReactNode;
  className?: string;
}

const ProfileModalButton: React.FC<ProfileModalButtonProps> = ({
  onPress,
  name,
  icon,
  className,
}) => {
  return (
    <button
      onClick={onPress}
      className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-950 ${className}`}
    >
      {icon}
      {name}
    </button>
  );
};

export default ProfileModalButton;
