"use client";
import StoreList from "@/components/Store/StoreList";
import Header from "@/components/header";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { role } = useUser();
  const router = useRouter();
  if (role === "customer") {
    router.replace("/aisle/customer");
  } else if (!role) {
    router.replace("/login");
  }

  return (
    <>
      {role && (
        <>
          <Header />
          <StoreList />
        </>
      )}
    </>
  );
}
