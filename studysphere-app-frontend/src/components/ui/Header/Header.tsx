import React, { useState } from "react";
import Logo from "./Logo";
import HeaderButton from "./HeaderButton";
import MobileMenuButton from "./MobileMenuButton";
import MobileMenuModal from "./MobileMenuModal";
import { paths } from "../../../config/paths";

const Header: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex flex-row items-center justify-between border-b border-border bg-backgroundOverlay px-6 py-6 backdrop-blur-sm lg:justify-evenly">
      <Logo clickable={true} size={48} />
      <div className="hidden flex-row items-center gap-1 md:flex lg:gap-4">
        <HeaderButton linkName={paths.landing.home.path} buttonName="Home" />
        <HeaderButton linkName={paths.landing.pricing.path} buttonName="Pricing" />
        <HeaderButton linkName={paths.landing.blog.path} buttonName="Blog" />
      </div>
      <div className="hidden flex-row items-center gap-1 md:flex lg:gap-4">
        <HeaderButton linkName={paths.auth.login.path} buttonName="Log in" />
        <HeaderButton linkName={paths.auth.signup.path} buttonName="Sign up" />
      </div>
      <div className="block pt-1 md:hidden">
        <MobileMenuButton onPress={openModal} />
      </div>

      {isModalOpen && <MobileMenuModal onClose={closeModal} />}
    </div>
  );
};

export default Header;
