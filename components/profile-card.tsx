"use client"

import { useAuthStore } from "@/stores/auth";
import { SolarUserBold, SolarLogout2Bold, SolarLogin2Bold } from "@/components/icons";
import PlayfulButton from "./playful-button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface ProfileCardProps {
  className?: string;
}

export default function ProfileCard({ className = "" }: ProfileCardProps) {
  const { user, role, isAuthenticated, signOut } = useAuthStore();
  const router = useRouter();

  console.log(isAuthenticated)
  console.log(user)

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
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-xs">
            <span className="inline-block bg-success/20 text-success px-2 py-1 rounded-full">
              User
            </span>
          </div>
          <PlayfulButton
            size="sm"
            variant="secondary"
            onClick={handleSignOut}
            startIcon={<SolarLogout2Bold />}
            className="text-xs"
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
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-xs">
          <span className="inline-block bg-warning/20 text-warning px-2 py-1 rounded-full">
            Guest
          </span>
        </div>
        <PlayfulButton
          size="sm"
          variant="primary"
          onClick={handleSignIn}
          startIcon={<SolarLogin2Bold />}
          className="text-xs"
        >
          Sign In
        </PlayfulButton>
      </div>
    </div>
  );
}
