"use client";

import React, { useState } from "react";
import LaunchsMenu from "./menus/LaunchsMenu";
import Link from "next/link";
import CommunityMenu from "./menus/CommunityMenu";
import AboutMenu from "./menus/AboutMenu";

export default function Menu() {
  const [showLaunchesMenu, setShowLaunchesMenu] = useState(false);
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);
  const [showAboutMenu, setShowAboutMenu] = useState(false);

  return (
    <div className="hidden lg:flex items-center relative">
      <div className="space-x-6 text-gray-600 text-sm flex items-center">
        <div
          onMouseEnter={() => setShowLaunchesMenu(true)}
          onMouseLeave={() => setShowLaunchesMenu(false)}
          className="hover:text-red-500"
        >
          Launches {showLaunchesMenu && <LaunchsMenu />}
        </div>

        <Link href={"/categories"} className="hover:text-red-500">
          Categories
        </Link>

        <div
          onMouseEnter={() => setShowCommunityMenu(true)}
          onMouseLeave={() => setShowCommunityMenu(false)}
          className="hover:text-red-500"
        >
          Community {showCommunityMenu && <CommunityMenu />}
        </div>

        <div>Advertise</div>

        <div
          onMouseEnter={() => setShowAboutMenu(true)}
          onMouseLeave={() => setShowAboutMenu(false)}
          className="hover:text-red-500"
        >
          About {showAboutMenu && <AboutMenu />}
        </div>
      </div>
    </div>
  );
}
