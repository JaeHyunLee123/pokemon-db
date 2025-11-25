"use client";

import { useContext } from "react";
import ToastItem from "@/components/common/toast/ToastItem";
import ToastContext from "@/libs/contexts/ToastContext";

export default function ToastContainer() {
  const { toasts } = useContext(ToastContext);

  return (
    <div className="fixed top-18 right-1 z-500 w-full max-w-md space-y-1 p-1">
      {toasts.map(({ id, type, title, content }) => (
        <ToastItem
          key={id}
          id={id}
          type={type}
          title={title}
          content={content}
        />
      ))}
    </div>
  );
}
