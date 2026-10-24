import { SourceNode, DestinationNode, PinConfig } from "./SankeyAllocation.types";

export const SVG_W = 1000;
export const SVG_H = 690;

export const SOURCE_X = 20;
export const SOURCE_W = 215;
export const GAP_SOURCE_RIBBON = 8;
export const GAP_RIBBON_TARGET = 8;

export const RIBBON_START_X = SOURCE_X + SOURCE_W + GAP_SOURCE_RIBBON; // 243
export const TARGET_START_X = 810;
export const RIBBON_END_X = TARGET_START_X - GAP_RIBBON_TARGET; // 802
export const TARGET_BAR_W = 18;

export const USABLE_H = 430;
export const PX_PER_PCT = USABLE_H / 100;
export const GAP_SOURCE = 10;

export const SOURCE_TOP = 60;
export const DESTINATION_TOP = 25;
export const PIN_BASELINE_Y = 645;

export const SOURCES: SourceNode[] = [
  {
    id: "bpptn",
    category: "Total Student Organization Budget",
    title: "BPPTN Fund",
    amount: "Rp 1.4M",
    pctFormatted: "11,7%",
    pct: 11.7,
  },
  {
    id: "non_bpptn",
    category: "Total Student Organization Budget",
    title: "Non-BPPTN Fund",
    amount: "Rp 10.6M",
    pctFormatted: "88,3%",
    pct: 88.3,
  },
];

export const DESTINATIONS: DestinationNode[] = [
  {
    id: "region",
    name: "Region",
    bpptnPct: 8.0,
    nonBpptnPct: 63.1,
    bpptnAmount: "BPPTN: Rp962.162.681",
    nonBpptnAmount: "Non-BPPTN: Rp7.582.788.192",
  },
  {
    id: "ukm",
    name: "UKM",
    bpptnPct: 1.7,
    nonBpptnPct: 12.4,
    bpptnAmount: "(1.7%) BPPTN: Rp203.607.674",
    nonBpptnAmount: "Non-BPPTN: Rp1.495.715.031",
  },
  {
    id: "community",
    name: "Community",
    bpptnPct: 0.1,
    nonBpptnPct: 6.6,
    bpptnAmount: "(0.1%) BPPTN: Rp203.607.674",
    nonBpptnAmount: "Non-BPPTN: Rp795.672.703",
  },
  {
    id: "center",
    name: "Center",
    bpptnPct: 1.9,
    nonBpptnPct: 4.2,
    bpptnAmount: "(1.9%) BPPTN: Rp223.307.755",
    nonBpptnAmount: "Non-BPPTN: Rp507.820.396",
  },
  {
    id: "omda",
    name: "OMDA",
    bpptnPct: 0.0,
    nonBpptnPct: 1.9,
    bpptnAmount: "",
    nonBpptnAmount: "Non-BPPTN: Rp231.816.274",
  },
  {
    id: "ioms",
    name: "IOMS",
    bpptnPct: 0.0,
    nonBpptnPct: 0.0002,
    bpptnAmount: "",
    nonBpptnAmount: "Non-BPPTN: Rp2.965.220",
  },
];

export const BPPTN_FLOW_DEFS = [
  { destId: "region", pct: 8.0 },
  { destId: "ukm", pct: 1.7 },
  { destId: "community", pct: 0.1 },
  { destId: "center", pct: 1.9 },
];

export const NON_BPPTN_FLOW_DEFS = [
  { destId: "region", pct: 63.1 },
  { destId: "ukm", pct: 12.4 },
  { destId: "community", pct: 6.6 },
  { destId: "center", pct: 4.2 },
  { destId: "omda", pct: 1.9 },
  { destId: "ioms", pct: 0.0002 },
];

export const DEST_TIMINGS: Record<string, { wipeDelay: string; arriveDelay: string }> = {
  region: { wipeDelay: "0.48s", arriveDelay: "1.30s" },
  ukm: { wipeDelay: "0.62s", arriveDelay: "1.44s" },
  community: { wipeDelay: "0.73s", arriveDelay: "1.55s" },
  center: { wipeDelay: "0.83s", arriveDelay: "1.65s" },
  omda: { wipeDelay: "0.91s", arriveDelay: "1.73s" },
  ioms: { wipeDelay: "0.99s", arriveDelay: "1.81s" },
};

export const PIN_CONFIGS: PinConfig[] = [
  { flowId: "non-bpptn-to-center", destId: "center", x: 570, pctFormatted: "4,2%", label: "Center" },
  { flowId: "non-bpptn-to-omda", destId: "omda", x: 650, pctFormatted: "1.9%", label: "OMDA" },
  { flowId: "non-bpptn-to-ioms", destId: "ioms", x: 730, pctFormatted: "0.0002%", label: "IOMS" },
];

export const PIN_DELAYS: Record<string, string> = {
  "non-bpptn-to-center": "1.35s",
  "non-bpptn-to-omda": "1.55s",
  "non-bpptn-to-ioms": "1.75s",
};
