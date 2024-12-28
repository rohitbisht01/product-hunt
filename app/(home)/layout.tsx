import { auth } from "@/auth";
import Navbar from "@/components/navbar/Navbar";
import React, { Suspense } from "react";
import Spinner from "@/components/spinner";
import { getProductsByUserId } from "@/lib/server-actions";


const HomeLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  // get the user
  const authenticatedUser = await auth();
  const products = await getProductsByUserId(authenticatedUser?.user?.id || "")

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <Suspense fallback={<Spinner />}>
          <Navbar authenticatedUser={authenticatedUser} products ={products} />
          {children}
        </Suspense>
      </body>
    </html>
  );
};

export default HomeLayout;
