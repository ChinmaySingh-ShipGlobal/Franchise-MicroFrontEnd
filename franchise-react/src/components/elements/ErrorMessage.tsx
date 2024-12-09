export default function ErrorMessage({ error }: { error: string }) {
  return <>{error && <span className="text-xs font-medium text-destructive">{error}</span>}</>;
}
