"use client";
import React, { useRef, useEffect, useState } from "react";

interface InViewFadeProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // ms
}

export function InViewFade({ children, className = "", delay = 0 }: InViewFadeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`opacity-0 translate-y-8 transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : ""} ${className}`}
    >
      {children}
    </div>
  );
} 