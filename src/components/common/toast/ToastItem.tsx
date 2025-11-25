"use client";

import ToastContext from "@/libs/contexts/ToastContext";
import { cn } from "@/libs/utils";
import { Toast } from "@/types/types";
import { CircleCheckIcon, CircleXIcon, XIcon } from "lucide-react";
import { useContext } from "react";

const TOAST_COLORS = {
  success: {
    bg: "bg-green-50",
    icon: "text-green-500",
    title: "text-neutral-900 font-medium text-lg",
    content: "text-neutral-500",
  },

  error: {
    bg: "bg-red-50",
    icon: "text-red-500",
    title: "text-neutral-900 font-medium text-lg",
    content: "text-neutral-500",
  },
};

const TOAST_ICON = {
  success: CircleCheckIcon,
  error: CircleXIcon,
};

export default function ToastItem({ id, type, title, content }: Toast) {
  const styles = TOAST_COLORS[type];
  const Icon = TOAST_ICON[type];

  const { removeToast } = useContext(ToastContext);

  const handleClickDelete = () => {
    removeToast(id);
  };

  return (
    <div
      className={cn(
        "animate-fade-in-out-toast flex items-start justify-between gap-3 p-4 opacity-0 border-t border-l border-b-2 border-r-2 border-black",
        styles.bg
      )}
    >
      <Icon className={styles.icon} />
      <div className="flex-1 text-sm">
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.content}>{content}</p>
      </div>
      <XIcon className={styles.icon} onClick={handleClickDelete} />
    </div>
  );
}
