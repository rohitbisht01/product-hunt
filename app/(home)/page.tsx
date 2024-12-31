import { auth } from "@/auth";
import ActiveProducts from "@/components/active-products";
import { getActiveProducts } from "@/lib/server-actions";

export default async function Home() {
  const activeProducts = await getActiveProducts();

  return (
    <>
      <div className="md:w-3/5 mx-auto py-10 px-6">
        <ActiveProducts activeProducts={activeProducts} />
      </div>
    </>
  );
}
