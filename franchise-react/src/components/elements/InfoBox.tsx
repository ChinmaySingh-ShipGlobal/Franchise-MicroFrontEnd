import React from "react";

export interface InfoBoxProps {
  icon?: any;
  title: string;
  text?: string;
  className?: string;
  goToPage?: string;
  trigger?: React.ReactNode;
}

export default function InfoBox({ icon, title, text, className }: InfoBoxProps) {
  return (
    <div className={`flex items-center px-2 py-3 gap-x-3 border border-lightBlue-100 rounded-[10px]  ${className}`}>
      <div>{icon}</div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs font-normal text-gray-800">{text}</p>
      </div>
    </div>
  );
}
