import ToastContext from "@/libs/contexts/ToastContext";
import type { Toast } from "@/types/types";
import { useContext } from "react";

const TIMEOUT = 3000 as const;

function useToast() {
  const { addToast, removeToast } = useContext(ToastContext);

  function triggerToast(
    type: Toast["type"],
    title: Toast["title"],
    content: Toast["content"]
  ) {
    const newToast: Toast = {
      id: Date.now() + Math.random(),
      type,
      title,
      content,
    };

    addToast(newToast);

    setTimeout(() => {
      removeToast(newToast.id);
    }, TIMEOUT);
  }

  return triggerToast;
}

export default useToast;
