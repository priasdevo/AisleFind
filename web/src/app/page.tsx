"use client";
import StoreList from "@/components/Store/StoreList";
import Header from "@/components/header";
import { useUser } from "@/context/userContext";

export default function Home() {
  const { role } = useUser();
  return (
    <>
      <Header />
      <StoreList />
    </>
  );
}
