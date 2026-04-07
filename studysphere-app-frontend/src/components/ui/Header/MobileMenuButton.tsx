import React from "react"
import icons from "../../../assets/icons/icons"

interface MobileMenuButtonProps {
    onPress: () => void;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ onPress }) => {
    return (
        <button
          onClick={onPress}
          className="rounded-full border border-border bg-surface p-2 text-text transition hover:bg-surfaceAlt"
        >
            {icons.baricon}
        </button>
    )
}

export default MobileMenuButton
