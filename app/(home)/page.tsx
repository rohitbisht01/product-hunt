import { auth } from "@/auth";

export default async function Home() {
  const authenticatedUser = await auth();

  console.log(authenticatedUser);

  return (
    <>
      <div>hi</div>
    </>
  );
}
