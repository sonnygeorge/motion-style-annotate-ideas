import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="min-h-full">
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
