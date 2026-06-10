// components/LoadingOverlay.tsx
import { Loader2 } from "lucide-react";
import React from "react";

const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <Loader2
        width={50}
        height={50}
        style={{ color: "#fff" }}
        className="animate-spin"
      />

      {/* Spinner */}
      {/* <div className="relative w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div> */}
    </div>
  );
};

export default LoadingOverlay;
