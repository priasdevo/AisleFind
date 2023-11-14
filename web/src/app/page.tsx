"use client";
import StoreList from "@/components/Store/StoreList";
import Header from "@/components/header";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { role, isLogin } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (isLogin && role === "customer") {
      console.log("Prias role : ", role);
      router.replace("/aisle/customer");
    } else if (!isLogin) {
      console.log("Prias role : ", role);
      router.replace("/login");
    } else {
      console.log("Prias role : ", role);
    }
  }, [role]);

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
