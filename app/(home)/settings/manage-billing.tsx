"use client";

import { toast } from "sonner";
import { PiX } from "react-icons/pi";
import { createCustomerLink } from "@/lib/stripe";

const ManageBilling = () => {
  const handleManageBilling = async () => {
    try {
      const result = await createCustomerLink();
      if (result) {
        window.location.href = result;
      } else {
        throw new Error("Error catching customer portal link");
      }
    } catch (error: any) {
      toast(
        <>
          {" "}
          <div className="flex items-center gap-4 mx-auto">
            <PiX className="text-red-500 text-3xl" />
            <p>Could not create checkout session. Please try again</p>
          </div>
        </>,
        {
          position: "top-center",
        }
      );
    }
  };
  return (
    <button
      onClick={handleManageBilling}
      className="cursor-pointer mt-10 text-blue-500 hover:underline"
    >
      Manage Billing
    </button>
  );
};

export default ManageBilling;
