import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

// Popover context to manage open state
const PopoverContext = React.createContext<any>(null);

export function Popover({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      {children}
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactNode }) {
  const { setOpen } = React.useContext(PopoverContext);
  const child = React.Children.only(children);
  if (asChild && React.isValidElement(child)) {
    return React.cloneElement(child as any, {
      onClick: (e: any) => {
        setOpen((prev: boolean) => !prev);
        if (child.props.onClick) child.props.onClick(e);
      },
    });
  }
  return (
    <button onClick={() => setOpen((prev: boolean) => !prev)}>{children}</button>
  );
}

export function PopoverContent({ children, className = "", ...props }: { children: React.ReactNode; className?: string }) {
  const { open, setOpen } = React.useContext(PopoverContext);
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, setOpen]);

  if (!open) return null;
  return createPortal(
    <div
      ref={ref}
      className={`absolute left-0 bottom-14 bg-[#18181b] border border-[#2e2f33] rounded-xl shadow-lg ${className}`}
      style={{ minWidth: 250, zIndex: 50 }}
      {...props}
    >
      {children}
    </div>,
    document.body
  );
} 