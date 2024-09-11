import Image from "next/image";
import Link from "next/link";
import React from "react";
import ProductLogo from "@/public/logo/logo.png";

export default function Logo() {
  return (
    <div>
      <Link href={"/"} className="md:hidden">
        <Image
          src={ProductLogo}
          alt="logo"
          height={50}
          width={50}
          className="p-1"
        />
      </Link>

      <Link href={"/"} className="hidden md:block">
        <Image
          src={ProductLogo}
          alt="logo"
          height={60}
          width={60}
          className="p-1"
        />
      </Link>
    </div>
  );
}
