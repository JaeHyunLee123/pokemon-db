"use client";

import { Menu, X } from "lucide-react";
import { createContext, ReactNode, useContext, useState } from "react";

interface MobileSidebarContextProps {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const MobileSidebarContext = createContext<MobileSidebarContextProps | undefined>(
  undefined
);

export function MobileSidebar({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MobileSidebarContext.Provider
      value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}
    >
      {children}
    </MobileSidebarContext.Provider>
  );
}

MobileSidebar.Trigger = function MobileSidebarTrigger() {
  const context = useContext(MobileSidebarContext);
  if (!context) throw new Error("Trigger must be used within MobileSidebar");

  return (
    <div className="md:hidden flex items-center">
      <button
        onClick={context.open}
        className="text-white p-1"
        aria-label="Open sidebar"
      >
        <Menu size={28} />
      </button>
    </div>
  );
};

MobileSidebar.Content = function MobileSidebarContent({
  children,
}: {
  children: (props: { close: () => void }) => ReactNode;
}) {
  const context = useContext(MobileSidebarContext);
  if (!context) throw new Error("Content must be used within MobileSidebar");

  if (!context.isOpen) return null;

  return (
    <div className="md:hidden">
      {/* Dim Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={context.close}
      />
      {/* Sidebar Panel */}
      <div className="fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-xl flex flex-col p-5 gap-6">
        <div className="flex justify-end">
          <button
            onClick={context.close}
            className="p-1 text-gray-500 hover:text-black"
            aria-label="Close sidebar"
          >
            <X size={28} />
          </button>
        </div>
        {children({ close: context.close })}
      </div>
    </div>
  );
};
