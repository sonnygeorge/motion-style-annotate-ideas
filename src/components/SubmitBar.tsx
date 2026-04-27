import type { ReactNode } from "react";

type Props = {
  noDiffLabel: ReactNode;
  noDiff: boolean;
  onNoDiffChange: (v: boolean) => void;
  onSubmit: () => void;
  disabled?: boolean;
};

export default function SubmitBar({
  noDiffLabel,
  noDiff,
  onNoDiffChange,
  onSubmit,
  disabled = false,
}: Props) {
  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <label className="flex items-start gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={noDiff}
          onChange={(e) => onNoDiffChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
        />
        <span>{noDiffLabel}</span>
      </label>
      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled}
        className="self-end rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:hover:bg-slate-300 sm:self-auto"
      >
        Submit
      </button>
    </div>
  );
}
