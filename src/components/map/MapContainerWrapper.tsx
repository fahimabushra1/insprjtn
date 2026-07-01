"use client";

import React from "react";
import dynamic from "next/dynamic";
import FullPageLoader from "@/components/loaders/FullPageLoader";

const ExplorerMap = dynamic(() => import("@/components/map/ExplorerMap"), {
  ssr: false,
  loading: () => <FullPageLoader />,
});

export default function MapContainerWrapper() {
  return <ExplorerMap />;
}
