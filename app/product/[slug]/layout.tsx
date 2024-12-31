import { auth } from "@/auth";
import Navbar from "@/components/navbar/Navbar";
import { getNotifications, getProductsByUserId } from "@/lib/server-actions";

const ProductPageLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const authenticatedUser = await auth();
  const notifications = await getNotifications();
  console.log(notifications);

  const products = await getProductsByUserId(authenticatedUser?.user?.id || "");

  return (
    <html lang="en">
      <body>
        <Navbar
          authenticatedUser={authenticatedUser}
          products={products}
          notifications={notifications}
        />
        {children}
      </body>
    </html>
  );
};

export default ProductPageLayout;
