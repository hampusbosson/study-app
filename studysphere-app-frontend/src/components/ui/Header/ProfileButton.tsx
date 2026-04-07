import React from "react";

interface ProfileButtonProps {
    firstLetterEmail: string | undefined;
    onPress: () => void;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({ firstLetterEmail, onPress }) => {
    return (
        <button
          onClick={onPress}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-sm font-bold text-white shadow-glow-accent transition hover:bg-accentHover"
        >
            {firstLetterEmail}
        </button>
    )
}

export default ProfileButton;
