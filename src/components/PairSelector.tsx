import type { Pair } from "../manifest";

type Props = {
  pairs: Pair[];
  index: number;
  onChange: (i: number) => void;
};

export default function PairSelector({ pairs, index, onChange }: Props) {
  return (
    <label className="flex items-center gap-3 text-sm">
      <span className="font-medium text-slate-700">Pair</span>
      <select
        value={index}
        onChange={(e) => onChange(Number(e.target.value))}
        className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm font-mono text-slate-800 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
      >
        {pairs.map((p, i) => (
          <option key={p.slug} value={i}>
            {p.slug}
          </option>
        ))}
      </select>
      <span className="whitespace-nowrap text-xs text-slate-500">
        {index + 1} / {pairs.length}
      </span>
    </label>
  );
}
