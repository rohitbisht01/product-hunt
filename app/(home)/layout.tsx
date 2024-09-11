import { auth } from "@/auth";
import Navbar from "@/components/navbar/Navbar";
import React from "react";

const HomeLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  // get the user
  const authenticatedUser = await auth();

  return (
    <html lang="en">
      <body>
        <Navbar authenticatedUser={authenticatedUser} />
        {children}
      </body>
    </html>
  );
};

export default HomeLayout;
