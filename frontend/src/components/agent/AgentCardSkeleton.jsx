const AgentCardSkeleton = ({ variant = "full" }) => {
  if (variant === "compact") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-3 text-center dark:border-slate-800 dark:bg-[#111827]">
        <div className="mx-auto h-16 w-16 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
        <div className="mx-auto mt-3 h-3 w-2/3 animate-pulse rounded bg-slate-100 dark:bg-slate-700" />
        <div className="mx-auto mt-2 h-2 w-1/2 animate-pulse rounded bg-slate-100 dark:bg-slate-700" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#111827]">
      <div className="h-[260px] animate-pulse bg-slate-100 dark:bg-slate-800" />
      <div className="space-y-2 p-5">
        <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100 dark:bg-slate-700" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100 dark:bg-slate-700" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-slate-100 dark:bg-slate-700" />
      </div>
    </div>
  );
};

export default AgentCardSkeleton;