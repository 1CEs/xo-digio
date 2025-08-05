"use client"

import Divider from "@/components/divider";
import PlayfulButton from "@/components/playful-button";
import Image from "next/image";
import Logo from "@/public/logo.svg";
import MockBoard from "@/components/mock-board";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

export default function Home() {
  const { 
    isAuthenticated, 
    handleGuestPlay, 
    handleSignInRedirect, 
    handleSignUpRedirect, 
    handlePlayRedirect 
  } = useAuth();

  // If user is already authenticated, redirect to play page
  useEffect(() => {
    if (isAuthenticated) {
      handlePlayRedirect();
    }
  }, [isAuthenticated]);

  return (
      <main className="flex gap-x-16 items-center justify-center h-full w-full">
        <div>
          <MockBoard />
        </div>
        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="flex items-center pb-4 animate-pulse">
            <Image src={Logo} alt="Logo" width={200} height={200} />
          </div>
          <PlayfulButton size="xl" variant="primary" onClick={handleSignUpRedirect}>
            SIGN UP
          </PlayfulButton>
          <PlayfulButton size="lg" variant="secondary" onClick={handleSignInRedirect}>
            SIGN IN
          </PlayfulButton>
          <Divider>
            <p className="text-center text-xs">continue as</p>
          </Divider>
          <PlayfulButton size="lg" variant="warning" onClick={handleGuestPlay}>
            GUEST
          </PlayfulButton>
        </div>

      </main>
  );
}
