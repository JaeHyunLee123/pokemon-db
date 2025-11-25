"use client";

import type { Toast } from "@/types/types";
import { useContext, useEffect, useState } from "react";
import ToastItem from "@/components/common/toast/ToastItem";
import ToastContext from "@/libs/contexts/ToastContext";

export default function ToastContainer() {
  const [renderedToasts, setRenderedToasts] = useState<Toast[]>([]);
  const { toasts } = useContext(ToastContext);

  useEffect(() => {
    setRenderedToasts(toasts);
  }, [toasts]);

  return (
    <div className="fixed top-18 right-1 z-500 w-full max-w-md space-y-1 p-1">
      {renderedToasts.map(({ id, type, title, content }) => (
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
