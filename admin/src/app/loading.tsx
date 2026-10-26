/** Skeleton shown instantly while a page renders on the server. */
function Block({ className }: { className: string }) {
  return (
    <div
      className={`animate-shimmer rounded-2xl bg-[linear-gradient(90deg,#F2F3F9_0%,#FAFAFD_50%,#F2F3F9_100%)] bg-[length:200%_100%] ${className}`}
    />
  );
}

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading" className="space-y-6">
      <div className="space-y-2">
        <Block className="h-9 w-56 rounded-lg" />
        <Block className="h-5 w-80 rounded-md" />
      </div>
      <Block className="h-[420px]" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Block key={i} className="h-36" />
        ))}
      </div>
    </div>
  );
}
