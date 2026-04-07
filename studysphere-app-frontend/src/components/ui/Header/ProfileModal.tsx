import React from "react";
import ProfileModalButton from "./ProfileModalButton";
import icons from "../../../assets/icons/icons";
import { logout } from "../../../lib/auth";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/auth/useAuth";
import { paths } from "../../../config/paths";


interface ProfileModalProps {
  email: string | null | undefined;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ email }) => {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleLogout = async() => {
        try {
            await logout();

            setUser(null);
            
            navigate(paths.landing.home.getHref());
        } catch(error) {
            console.error("Login failed:", error); // Log any errors
            alert("Login failed. Please try again."); // Provide feedback to the user
        }
    }

  return (
    <div className="flex w-64 justify-start rounded-lg border border-border bg-white shadow-2xl shadow-slate-200/70">
      <div className="flex flex-col items-start w-full">
      <p className="w-full max-w-[16rem] truncate px-4 pb-3 pt-4 font-raleway text-sm font-medium text-slate-600">
          {email}
        </p>
        <div className="flex w-full flex-col border-t border-border">
            <ProfileModalButton name="Upgrade" icon={icons.upgradeIcon} className=""/>
            <ProfileModalButton name="Settings" icon={icons.settingsIcon}/>
            <ProfileModalButton name="Logout" icon={icons.logoutIcon} className="rounded-b-lg text-rose-600 hover:bg-rose-50 hover:text-rose-700" onPress={handleLogout}/>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
