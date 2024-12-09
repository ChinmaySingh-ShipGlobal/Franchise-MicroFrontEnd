export default function SuccessMessage({ success }: { success: string }) {
  return <div>{success && <span className="text-xs font-medium text-constructive">{success}</span>}</div>;
}
