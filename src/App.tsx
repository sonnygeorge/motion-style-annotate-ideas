import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import OpenEnded1 from "./pages/OpenEnded1";
import Carefulness1 from "./pages/Carefulness1";

export type DemoRoute = {
  path: string;
  title: string;
  blurb: string;
  category: "open-ended" | "carefulness";
  element: React.ReactNode;
};

export const routes: DemoRoute[] = [
  {
    path: "open-ended-1",
    title: "Open-ended v1",
    blurb:
      "Free-form differences between two trajectories: build a list of '<task> is performed w/ [more|less] X in [Video A|B]' rows.",
    category: "open-ended",
    element: <OpenEnded1 />,
  },
  {
    path: "carefulness-1",
    title: "Carefulness v1",
    blurb:
      "Single-axis comparison: how much more/less careful is the trajectory in Video A vs. Video B wrt the task?",
    category: "carefulness",
    element: <Carefulness1 />,
  },
];

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {routes.map((r) => (
          <Route key={r.path} path={`/${r.path}`} element={r.element} />
        ))}
        <Route path="*" element={<Home />} />
      </Routes>
    </HashRouter>
  );
}
