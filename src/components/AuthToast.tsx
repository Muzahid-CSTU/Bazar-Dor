"use client";

import { useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";

const AuthToast = () => {
  useEffect(() => {
    // Google ba GitHub theke page reload hoye ashle floating toast show korbe
    const pendingToast = localStorage.getItem("auth_toast_message");
    if (pendingToast) {
      toast.success(pendingToast);
      localStorage.removeItem("auth_toast_message");
    }
  }, []);

  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      containerStyle={{
        top: 20,
        right: 20,
        zIndex: 999999, // Screen er shob kichur upore bheshe thakbe
      }}
      toastOptions={{
        duration: 3500,
        style: {
          background: "#1f2937",
          color: "#ffffff",
          fontSize: "14px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
          padding: "12px 16px",
        },
      }}
    />
  );
};

export default AuthToast;