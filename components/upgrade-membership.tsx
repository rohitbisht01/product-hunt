import { createCheckoutSession } from "@/lib/stripe";
import Image from "next/image";
import { PiX } from "react-icons/pi";
import { toast } from "sonner";

interface UpgradeMembershipProps {
  authenticatedUser: any;
}

const UpgradeMembership = ({ authenticatedUser }: UpgradeMembershipProps) => {
  const handleCallCheckoutSession = async () => {
    try {
      const result = await createCheckoutSession({
        email: authenticatedUser.user.email,
        name: "Test",
        address: {
          line1: "123 Main Street",
          city: "Springfield",
          state: "Uttarakhand",
          postal_code: "263601",
          country: "India",
        },
      });
      if (result && result.url) {
        window.location.href = result.url;
      } else {
        throw new Error("Error creating checkout session");
      }
    } catch (error) {
      toast(
        <>
          <div className="flex items-center gap-4 mx-auto">
            <PiX className="text-red-500 text-3xl" />
            <p className="text-md font-semibold">
              Could not create checkout session. Please try again later.
            </p>
          </div>
        </>,
        {
          position: "top-center",
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      <Image
        src={"/logo/ProductHunt.png"}
        width={150}
        height={150}
        alt="Upgrade Membership"
        className="mx-auto my-5"
      />
      <h1 className="text-2xl font-semibold text-center mt-10">
        Go Pro and unlock more features
      </h1>
      <p className="text-gray-600 text-center">
        Looking to create more projects ? Upgrade your membership to unlock
        unlimited projects
      </p>

      <div className="pt-4">
        <button
          onClick={handleCallCheckoutSession}
          className="bg-indigo-500 text-white p-2 rounded-md w-full"
        >
          Upgrade Membership
        </button>
      </div>
    </div>
  );
};

export default UpgradeMembership;
