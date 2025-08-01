"use client"

import Divider from "@/components/divider";
import PlayfulButton from "@/components/playful-button";
import { useRouter } from "nextjs-toploader/app";
import Image from "next/image";
import Logo from "@/public/logo.svg";

export default function Home() {
  const router = useRouter()
  return (
    <main className="flex flex-col gap-4 items-center justify-center h-full">
      <div className="flex items-center pb-4 animate-pulse">
        <Image src={Logo} alt="Logo" width={200} height={200} />
      </div>
      <PlayfulButton size="xl" variant="primary" onClick={() => router.push("/member/sign-up")}>
        Sign Up
      </PlayfulButton>
      <PlayfulButton size="lg" variant="secondary" onClick={() => router.push("/member/sign-in")}>
        Sign In
      </PlayfulButton>
      <Divider>
        <p className="text-center text-xs">continue as</p>
      </Divider>
      <PlayfulButton size="lg" variant="disabled" onClick={() => router.push("/play")}>
        Guest
      </PlayfulButton>
    </main>
  );
}
