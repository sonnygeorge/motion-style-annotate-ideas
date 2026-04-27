import { useState } from "react";
import Layout from "../components/Layout";
import VideoPair from "../components/VideoPair";
import PairSelector from "../components/PairSelector";
import SubmitBar from "../components/SubmitBar";
import { useToast } from "../components/Toast";
import { humanizeTask, useManifest } from "../manifest";

type Level =
  | "significantly_less"
  | "marginally_less"
  | "marginally_more"
  | "significantly_more";

const LEVEL_LABELS: Record<Level, string> = {
  significantly_less: "significantly less",
  marginally_less: "marginally less",
  marginally_more: "marginally more",
  significantly_more: "significantly more",
};

export default function Carefulness1() {
  const { pairs, error } = useManifest();
  const [index, setIndex] = useState(0);
  const [level, setLevel] = useState<Level | "">("");
  const [noDiff, setNoDiff] = useState(false);
  const { show, node: toast } = useToast();

  if (error) return <Errored msg={error} />;
  if (!pairs) return <Loading />;
  if (pairs.length === 0) return <Empty />;

  const pair = pairs[index];
  const taskLabel = humanizeTask(pair.task);
  const canSubmit = noDiff || level !== "";

  const onSubmit = () => {
    if (!canSubmit) return;
    show("Submitted (simulated) — advancing to next pair");
    setIndex((i) => (i + 1) % pairs.length);
    setLevel("");
    setNoDiff(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <PairSelector pairs={pairs} index={index} onChange={setIndex} />

        <p className="text-sm text-slate-600">
          Videos for task:{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-800">
            {taskLabel}
          </code>
        </p>

        <VideoPair videoA={pair.videoA} videoB={pair.videoB} />

        <section
          aria-disabled={noDiff}
          className={
            "rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition " +
            (noDiff ? "pointer-events-none opacity-50" : "")
          }
        >
          <p className="text-base leading-relaxed text-slate-800">
            The trajectory in <strong>Video A</strong> exhibits{" "}
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as Level | "")}
              className="mx-1 rounded border border-slate-300 bg-slate-50 px-2 py-1 text-sm font-medium text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            >
              <option value="" disabled>
                [ select ]
              </option>
              {(Object.keys(LEVEL_LABELS) as Level[]).map((k) => (
                <option key={k} value={k}>
                  {LEVEL_LABELS[k]}
                </option>
              ))}
            </select>{" "}
            carefulness than the trajectory in <strong>Video B</strong> with
            respect to the task:{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-800">
              {taskLabel}
            </code>
            .
          </p>
        </section>

        <SubmitBar
          noDiffLabel={
            <>
              Both trajectories exhibit approximately equal levels of
              carefulness with respect to the task:{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-800">
                {taskLabel}
              </code>
            </>
          }
          noDiff={noDiff}
          onNoDiffChange={(v) => {
            setNoDiff(v);
            if (v) setLevel("");
          }}
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
