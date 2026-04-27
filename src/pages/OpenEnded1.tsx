import { useState } from "react";
import Layout from "../components/Layout";
import VideoPair from "../components/VideoPair";
import PairSelector from "../components/PairSelector";
import SubmitBar from "../components/SubmitBar";
import { useToast } from "../components/Toast";
import { humanizeTask, useManifest } from "../manifest";

type Relation = "more" | "less";
type Subject = "A" | "B";
type Row = {
  id: string;
  relation: Relation;
  phrase: string;
  subject: Subject;
};

const newRow = (): Row => ({
  id: crypto.randomUUID(),
  relation: "more",
  phrase: "",
  subject: "A",
});

export default function OpenEnded1() {
  const { pairs, error } = useManifest();
  const [index, setIndex] = useState(0);
  const [rows, setRows] = useState<Row[]>([newRow()]);
  const [noDiff, setNoDiff] = useState(false);
  const { show, node: toast } = useToast();

  if (error) return <Errored msg={error} />;
  if (!pairs) return <Loading />;
  if (pairs.length === 0) return <Empty />;

  const pair = pairs[index];
  const taskLabel = humanizeTask(pair.task);
  const canSubmit =
    noDiff || rows.some((r) => r.phrase.trim().length > 0);

  const updateRow = (id: string, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const removeRow = (id: string) =>
    setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.id !== id) : rs));
  const addRow = () => setRows((rs) => [...rs, newRow()]);

  const onSubmit = () => {
    if (!canSubmit) return;
    show("Submitted (simulated) — advancing to next pair");
    setIndex((i) => (i + 1) % pairs.length);
    setRows([newRow()]);
    setNoDiff(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <PairSelector pairs={pairs} index={index} onChange={setIndex} />
        <VideoPair videoA={pair.videoA} videoB={pair.videoB} />

        <section
          aria-disabled={noDiff}
          className={
            "rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition " +
            (noDiff ? "pointer-events-none opacity-50" : "")
          }
        >
          <h2 className="text-sm font-semibold text-slate-900">
            Differences in motion / execution-style
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Add one row per difference you observe. Use the dropdowns to fill
            in the sentence template.
          </p>

          <ul className="mt-4 space-y-2">
            {rows.map((row) => (
              <li
                key={row.id}
                className="flex flex-wrap items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2 py-2 text-sm text-slate-800"
              >
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  aria-label="Remove row"
                  disabled={rows.length <= 1}
                  className="grid h-6 w-6 place-items-center rounded-full border border-slate-300 bg-white text-xs text-slate-500 hover:border-rose-400 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-300 disabled:hover:bg-white disabled:hover:text-slate-500"
                >
                  ×
                </button>
                <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs text-slate-800">
                  {taskLabel}
                </code>
                <span>is performed w/</span>
                <select
                  value={row.relation}
                  onChange={(e) =>
                    updateRow(row.id, { relation: e.target.value as Relation })
                  }
                  className="rounded border border-slate-300 bg-white px-2 py-1 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                >
                  <option value="more">more</option>
                  <option value="less">less</option>
                </select>
                <input
                  type="text"
                  placeholder="e.g. precision, hesitation, force…"
                  value={row.phrase}
                  onChange={(e) => updateRow(row.id, { phrase: e.target.value })}
                  className="min-w-[12ch] flex-1 rounded border border-slate-300 bg-white px-2 py-1 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
                <span>in</span>
                <select
                  value={row.subject}
                  onChange={(e) =>
                    updateRow(row.id, { subject: e.target.value as Subject })
                  }
                  className="rounded border border-slate-300 bg-white px-2 py-1 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                >
                  <option value="A">Video A</option>
                  <option value="B">Video B</option>
                </select>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={addRow}
            className="mt-3 inline-flex items-center gap-1 rounded-md border border-dashed border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:border-slate-500 hover:text-slate-900"
          >
            <span aria-hidden>+</span> add another difference
          </button>
        </section>

        <SubmitBar
          noDiffLabel="There is no meaningful difference in motion / execution-style"
          noDiff={noDiff}
          onNoDiffChange={setNoDiff}
          onSubmit={onSubmit}
          disabled={!canSubmit}
        />
      </div>
      {toast}
    </Layout>
  );
}

function Loading() {
  return (
    <Layout>
      <p className="text-sm text-slate-500">Loading…</p>
    </Layout>
  );
}
function Errored({ msg }: { msg: string }) {
  return (
    <Layout>
      <p className="text-sm text-rose-600">Error: {msg}</p>
    </Layout>
  );
}
function Empty() {
  return (
    <Layout>
      <p className="text-sm text-slate-500">
        No video pairs found. Make sure <code>data/</code> contains folders
        with at least two <code>.mp4</code> files, then re-run{" "}
        <code>npm run sync</code>.
      </p>
    </Layout>
  );
}
