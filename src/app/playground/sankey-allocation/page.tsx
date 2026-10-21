"use client";
import React from "react";
import { PlaygroundShell } from "@/components/playground/PlaygroundShell/PlaygroundShell";
import { SankeyAllocation } from "@/components/charts/SankeyAllocation/SankeyAllocation";

export default function SankeyAllocationPlayground() {
  const propsDocumentation = `<SankeyAllocation
  figureCaption="Figure 9 Allocation and Distribution of Student Organization Funds"
/>`;

  return (
    <PlaygroundShell
      title="SankeyAllocation Component"
      description="Proportional budget allocation Sankey flow diagram with pure SVG ribbons, pin needles, and source/destination stacks."
      propsNote={propsDocumentation}
      initialTheme="bab2"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <SankeyAllocation />
      </div>
    </PlaygroundShell>
  );
}
