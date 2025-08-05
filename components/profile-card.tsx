"use client"

import { useAuthStore } from "@/stores/auth";
import { SolarUserBold, SolarLogout2Bold, SolarLogin2Bold } from "@/components/icons";
import PlayfulButton from "./playful-button";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "react-toastify";

interface ProfileCardProps {
  className?: string;
}

export default function ProfileCard({ className = "" }: ProfileCardProps) {
  const { user, role, isAuthenticated, isLoading, signOut } = useAuthStore();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully', {
        position: "top-right",
        autoClose: 2000,
      });
      router.push('/');
    } catch (error) {
      toast.error('Error signing out', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleSignIn = () => {
    router.push('/member/sign-in');
  };

  if (isLoading) {
    return (
      <div className={`bg-white/10 backdrop-blur-sm rounded-xl w-full p-4 border border-white/20 ${className}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white/10 rounded-full animate-pulse" />
          <div className="flex-1">
            <div className="h-4 bg-white/10 rounded animate-pulse mb-1" />
            <div className="h-3 bg-white/10 rounded animate-pulse w-3/4" />
          </div>
          <div className="h-6 w-12 bg-white/10 rounded-full animate-pulse" />
        </div>

        <div className="flex flex-col gap-y-2 items-center justify-between">
          <div className="h-8 bg-white/10 rounded-lg animate-pulse w-full" />
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className={`bg-white/10 backdrop-blur-sm rounded-xl w-full p-4 border border-white/20 ${className}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <SolarUserBold className="text-primary text-lg" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm text-white">{user.username}</h3>
            <p className="text-xs text-white/70">{user.email}</p>
          </div>
          <div className="text-xs">
            <span className="inline-block bg-success/20 text-success px-2 py-1 rounded-full">
              User
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-y-2 items-center justify-between">
          <PlayfulButton
            size="sm"
            variant="danger"
            onClick={handleSignOut}
            startIcon={<SolarLogout2Bold />}
            className="text-xs w-full"
          >
            Sign Out
          </PlayfulButton>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-xl w-full p-4 border border-white/20 ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
          <SolarUserBold className="text-warning text-lg" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-white">Guest Player</h3>
          <p className="text-xs text-white/70">Playing as guest</p>
        </div>
        <div className="text-xs">
          <span className="inline-block bg-warning/20 text-warning px-2 py-1 rounded-full">
            Guest
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between">
        
        <PlayfulButton
          size="sm"
          variant="primary"
          onClick={handleSignIn}
          startIcon={<SolarLogin2Bold />}
          className="text-xs w-full"
        >
          Sign In
        </PlayfulButton>
      </div>
    </div>
  );
}
