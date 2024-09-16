import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { Heart, Package } from "lucide-react";
import { BsPersonFillGear } from "react-icons/bs";
import { signOut } from "next-auth/react";

interface AvatarProps {
  authenticatedUser?: any;
}

export default function Avatar({ authenticatedUser }: AvatarProps) {
  const handleMyUpvotes = () => {
    window.location.href = "/my-upvoted";
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <Image
            src={authenticatedUser.user.image}
            alt={authenticatedUser.user.name}
            height={40}
            width={40}
            className="rounded-full"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40 space-y-1 p-2 text-gray-600">
          <DropdownMenuItem>
            <Link
              href={"/my-products"}
              className="flex  gap-x-2 rounded-sm w-full cursor-pointer"
            >
              <Package className="h-5 w-5" />
              My Products
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div
              onClick={handleMyUpvotes}
              className="flex gap-x-2 rounded-sm w-full cursor-pointer"
            >
              <Heart className="h-5 w-5" />
              Upvoted
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link
              href={"/settings"}
              className="flex gap-x-2 rounded-sm w-full cursor-pointer"
            >
              <BsPersonFillGear className="h-5 w-5" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div onClick={() => signOut()}>Log out</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
