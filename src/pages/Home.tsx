import { Link } from "react-router-dom";
import { routes } from "../App";
import { useManifest } from "../manifest";

const categoryLabel: Record<string, string> = {
  "open-ended": "Open-ended",
  carefulness: "Carefulness",
};

export default function Home() {
  const { pairs, error } = useManifest();

  return (
    <div className="min-h-full">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Motion-style annotation UI ideas
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Click through each idea over a few of the video pairs in{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">
              data/
            </code>{" "}
            to get a feel for how the interaction feels in practice. Submitting
            does <em>not</em> record anything; it just advances to the next
            pair so you can iterate quickly.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            {pairs
              ? `${pairs.length} video pair(s) available.`
              : error
                ? `Error loading manifest: ${error}`
                : "Loading manifest…"}
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {routes.map((r) => (
            <li key={r.path}>
              <Link
                to={`/${r.path}`}
                className="group block h-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-400 hover:shadow-md"
              >
                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {categoryLabel[r.category] ?? r.category}
                </div>
                <div className="mt-1 text-lg font-semibold text-slate-900 group-hover:text-slate-700">
                  {r.title}
                </div>
                <p className="mt-2 text-sm text-slate-600">{r.blurb}</p>
                <div className="mt-4 text-xs font-mono text-slate-400">
                  /{r.path}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
