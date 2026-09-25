"use client";

import dynamic from "next/dynamic";

// SDK / R3F が React 内部 API に触れるため、SSR すると
// ReactCurrentDispatcher が undefined になり 500 になる。
const AppShell = dynamic(
  () => import("@/components/AppShell").then((mod) => mod.AppShell),
  { ssr: false }
);

export default function Page() {
  return <AppShell />;
}
