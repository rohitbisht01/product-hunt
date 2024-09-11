"use client";

import { useState } from "react";
import Logo from "./Logo";
import Menu from "./Menu";
import Search from "./Search";
import SignInButton from "./SignInButton";
import SignUpButton from "./SignUpButton";
import Modal from "../ui/modals/Modal";
import AuthContent from "./AuthContent";
import Avatar from "./Avatar";

interface NavbarProps {
  authenticatedUser?: any;
}

export default function Navbar({ authenticatedUser }: NavbarProps) {
  const [authModalShow, setAuthModalShow] = useState(false);

  const handleAuthClick = () => {
    setAuthModalShow(true);
  };
  return (
    <div className="border-b py-2 md:py-0 px-4 md:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Logo />
          <Search />
        </div>

        <div className="absolute right-1/2 translate-x-1/2 transform z-10">
          <Menu />
        </div>

        <div className="flex items-center text-sm space-x-6 cursor-pointer">
          {authenticatedUser ? (
            <>
              <Avatar  authenticatedUser={authenticatedUser}/>
            </>
          ) : (
            <div
              className="flex items-center space-x-6 cursor-pointer text-sm"
              onClick={handleAuthClick}
            >
              <SignInButton />
              <SignUpButton />
            </div>
          )}
        </div>

        <Modal visible={authModalShow} setVisible={setAuthModalShow}>
          <AuthContent />
        </Modal>
      </div>
    </div>
  );
}
