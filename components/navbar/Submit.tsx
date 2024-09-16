import Link from "next/link";
import React from "react";

const Submit = () => {
  return (
    <div>
      <Link href={"/new-product"} className="text-red-600">
        Submit
      </Link>
    </div>
  );
};

export default Submit;
