export default function UnitBox({ unit }: { unit: string }) {
  return (
    <div className="flex h-10 bg-gray-200 border border-l-0 border-input rounded-r-md w-14">
      <span className="flex items-center px-3 text-sm border-l border-input">{unit}</span>
    </div>
  );
}
