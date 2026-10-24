export interface SankeyAllocationProps {
  figureCaption?: string;
}

export interface SourceNode {
  id: "bpptn" | "non_bpptn";
  title: string;
  category: string;
  amount: string;
  pctFormatted: string;
  pct: number;
}

export interface DestinationNode {
  id: string;
  name: string;
  bpptnPct: number;
  nonBpptnPct: number;
  bpptnAmount: string;
  nonBpptnAmount: string;
}

export interface RibbonFlow {
  id: string;
  source: "bpptn" | "non_bpptn";
  destId: string;
  pct: number;
  pctFormatted: string;
  startY: number;
  endY: number;
  h: number;
  color: string;
}

export interface DestinationLayout extends DestinationNode {
  y: number;
  totalH: number;
  bpptnFlowH: number;
  nonBpptnFlowH: number;
  textHeight: number;
}

export interface PinConfig {
  flowId: string;
  destId: string;
  x: number;
  pctFormatted: string;
  label: string;
}
