import { Suspense } from "react";
import QtmSite from "./components/QtmSite";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <QtmSite />
    </Suspense>
  );
}
