import React from "react";
import Image from "next/image";
import ProductLogo from "@/public/logo/ProductHunt.png";
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { signIn } from "next-auth/react";

export default function AuthContent() {
  return (
    <div className="flex items-center justify-center flex-col -mt-[40px]">
      <Image src={ProductLogo} alt="logo" height={300} width={300} />

      <div className="flex flex-col items-center text-center mt-16">
        <div className="text-md w-2/3">
          Join our community of friendly folks discovering and sharing the
          latest products in tech.
        </div>
      </div>

      <button
        className="p-2 border rounded-md py-2 flex items-center gap-4 px-10 mt-4"
        onClick={() => signIn("google", { redirect: false })}
      >
        <FcGoogle className="text-xl" />
        Sign in with Google
      </button>
      <button
        onClick={() => signIn("github", { redirect: false })}
        className="p-2 border rounded-md py-2 flex items-center gap-4 px-10 mt-4"
      >
        <BsGithub className="text-xl" />
        Sign in with Github
      </button>
    </div>
  );
}
