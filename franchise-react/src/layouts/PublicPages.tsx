import React from "react";
import { Link } from "react-router-dom";
import { Loader } from "lucide-react";
import { SGLogo } from "@/components/elements/SGLogo";

export default function PublicPages({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-screen">
      <div className="grid h-screen bg-cover bg-auth">
        <Link to="/">
          <SGLogo />
        </Link>
        {children}
      </div>
    </div>
  );
}

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="w-12 h-12 animate-spin" />
    </div>
  );
};
