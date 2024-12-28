import { auth } from "@/auth";
import Navbar from "@/components/navbar/Navbar";
import { redirect } from "next/navigation";
import React from "react";

const PageLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  // get the user
  const authenticatedUser = await auth();

  if (!authenticatedUser) {
    redirect("/");
  }

  return (
    <html lang="en">
      <body>
        <Navbar authenticatedUser={authenticatedUser} />
        {children}
      </body>
    </html>
  );
};

export default PageLayout;
