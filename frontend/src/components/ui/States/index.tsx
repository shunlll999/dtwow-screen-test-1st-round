export const PageSpinner = ({ label = 'Loading…' }: { label?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted" role="status">
      <span className="spinner" />
      <span className="text-sm text-primary">{label}</span>
    </div>
  );
}
