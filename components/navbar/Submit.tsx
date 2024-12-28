"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";


interface SubmitProps{
  products?:any;
  authenticatedUser?:any
}

const Submit = ({products, authenticatedUser}:SubmitProps) => {
  const [isUpgradeModalVisible, setIsUpgradeModalVisible] = useState(false);
  const router = useRouter();


  return (
    <div>
      <Link href={"/new-product"} className="text-red-600">
        Submit
      </Link>
    </div>
  );
};

export default Submit;
