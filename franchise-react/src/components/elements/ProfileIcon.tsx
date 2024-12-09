export default function ProfileIcon({ text, className }: { text: string; className: string }) {
  return (
    <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-pink ${className}`}>
      <span className="text-xs text-white">{text}</span>
    </div>
  );
}
