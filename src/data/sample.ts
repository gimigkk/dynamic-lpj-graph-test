export interface I18nLabel {
  id: string;
  en: string;
}

export interface GrowthDataPoint {
  year: number;
  value: number;
}

export interface HorizontalBarItem {
  label: I18nLabel;
  value: number;
  percent?: number;
}

import type { DonutItem } from "@/components/charts/DonutCallouts";
export type { DonutItem };

export interface RadarItem {
  subject: I18nLabel;
  score: number;
  fullMark: number;
}

export interface SdgItem {
  goal: number;
  y2024: number;
  y2025: number;
}

// 1. Organization growth: 2021:114, 2022:114, 2023:169, 2024:173, 2025:184
export const orgGrowthData: GrowthDataPoint[] = [
  { year: 2021, value: 114 },
  { year: 2022, value: 114 },
  { year: 2023, value: 169 },
  { year: 2024, value: 173 },
  { year: 2025, value: 184 },
];

// 2. Typology 2025 (total 184): Wilayah 74, Komunitas 37, UKM 36, OMDA 27, Pusat 7, IOMS 3
export const orgTypologyData: DonutItem[] = [
  { id: "wilayah", label: { id: "Wilayah", en: "Regional" }, value: 74, dx: 10, dy: -5 },
  { id: "komunitas", label: { id: "Komunitas", en: "Community" }, value: 37, dx: 12, dy: 5 },
  { id: "ukm", label: { id: "UKM", en: "Student Activity Unit" }, value: 36, dx: -5, dy: 15 },
  { id: "omda", label: { id: "OMDA", en: "Regional Student Org" }, value: 27, dx: -15, dy: 0 },
  { id: "pusat", label: { id: "Pusat", en: "Central" }, value: 7, dx: -10, dy: -10 },
  { id: "ioms", label: { id: "IOMS", en: "Inter-Org Student Meeting" }, value: 3, dx: 0, dy: -15 },
];

// 3. Participation by org type: Wilayah 6721 (60.0%), UKM 2382 (21.3%), OMDA 762 (6.8%), Komunitas 741 (6.6%), Pusat 456 (4.1%), IOMS 137 (1.2%)
export const participationByOrgData: HorizontalBarItem[] = [
  { label: { id: "Wilayah", en: "Regional" }, value: 6721, percent: 60.0 },
  { label: { id: "UKM", en: "Student Activity Unit" }, value: 2382, percent: 21.3 },
  { label: { id: "OMDA", en: "Regional Student Org" }, value: 762, percent: 6.8 },
  { label: { id: "Komunitas", en: "Community" }, value: 741, percent: 6.6 },
  { label: { id: "Pusat", en: "Central" }, value: 456, percent: 4.1 },
  { label: { id: "IOMS", en: "Inter-Org Student Meeting" }, value: 137, percent: 1.2 },
];

// 4. Participation by faculty (percent, descending): 20.0, 10.8, 9.1, 7.8, 7.8, 7.3, 6.9, 6.9, 6.2, 6.0, 5.6, 3.5, 2.4
export const participationByFacultyData: HorizontalBarItem[] = [
  { label: { id: "Fakultas Pertanian", en: "Faculty of Agriculture" }, value: 20.0, percent: 20.0 },
  { label: { id: "FKH & Biomedis", en: "School of Vet Med & Biomed" }, value: 10.8, percent: 10.8 },
  { label: { id: "Perikanan & Ilmu Kelautan", en: "Fisheries & Marine Science" }, value: 9.1, percent: 9.1 },
  { label: { id: "Peternakan", en: "Animal Science" }, value: 7.8, percent: 7.8 },
  { label: { id: "Kehutanan & Lingkungan", en: "Forestry & Environment" }, value: 7.8, percent: 7.8 },
  { label: { id: "Teknologi Pertanian", en: "Agricultural Engineering" }, value: 7.3, percent: 7.3 },
  { label: { id: "Matematika & IPA", en: "Math & Natural Sciences" }, value: 6.9, percent: 6.9 },
  { label: { id: "Ekonomi & Manajemen", en: "Economics & Management" }, value: 6.9, percent: 6.9 },
  { label: { id: "Ekologi Manusia", en: "Human Ecology" }, value: 6.2, percent: 6.2 },
  { label: { id: "Sekolah Bisnis", en: "School of Business" }, value: 6.0, percent: 6.0 },
  { label: { id: "Sekolah Vokasi", en: "College of Vocational Studies" }, value: 5.6, percent: 5.6 },
  { label: { id: "Fakultas Kedokteran", en: "Faculty of Medicine" }, value: 3.5, percent: 3.5 },
  { label: { id: "Sekolah Pascasarjana", en: "Graduate School" }, value: 2.4, percent: 2.4 },
];

// 5. Gauge value: 94.6
export const gaugeScore = 94.6;

// 6. Activity scale: IPB University 91.3, Nasional 7.84, Internasional 0.91
export const activityScaleData: DonutItem[] = [
  { id: "ipb", label: { id: "IPB University", en: "IPB University" }, value: 91.3, dx: 10, dy: 0 },
  { id: "nasional", label: { id: "Nasional", en: "National" }, value: 7.84, dx: -10, dy: 10 },
  { id: "internasional", label: { id: "Internasional", en: "International" }, value: 0.91, dx: -15, dy: -10 },
];

// 7. Activity categories (total 3612):
// Ordered clockwise to match designer reference layout:
// 1. Competence (top-right: starts 0deg / 12 o'clock)
// 2. Interest & Talents (mid-right)
// 3. Competition (bottom-right)
// 4. Community Services (bottom)
// 5. Entrepreneurship (mid-left)
// 6. Leadership (top-left)
export const activityCategoriesData: DonutItem[] = [
  {
    id: "competence",
    label: { id: "Competence", en: "Competence" },
    value: 1070,
    delta: 890,
    pctDisplay: "20,2%",
  },
  {
    id: "interest_talents",
    label: { id: "Interest & Talents", en: "Interest & Talents" },
    value: 246,
    delta: 160,
    pctDisplay: "53,8%",
  },
  {
    id: "competition",
    label: { id: "Competition", en: "Competition" },
    value: 250,
    delta: 353,
    pctDisplay: "29,2%",
  },
  {
    id: "community_services",
    label: { id: "Community Sevices", en: "Community Services" },
    value: 439,
    delta: 178,
    pctDisplay: "146,6%",
  },
  {
    id: "entrepreneurship",
    label: { id: "Entrepreneurship", en: "Entrepreneurship" },
    value: 686,
    delta: 85,
    pctDisplay: "707,1%",
  },
  {
    id: "leadership",
    label: { id: "Leadership", en: "Leadership" },
    value: 921,
    delta: 880,
    pctDisplay: "4,7%",
  },
];

// 8. Radar axes: Program Quality, Competence of Administrators, Public Exposure, Effectiveness, Human Resources, Network
export const radarImpactData: RadarItem[] = [
  { subject: { id: "Kualitas Program", en: "Program Quality" }, score: 4.85, fullMark: 5 },
  { subject: { id: "Kompetensi Pengurus", en: "Competence of Administrators" }, score: 3.4, fullMark: 5 },
  { subject: { id: "Eksposur Publik", en: "Public Exposure" }, score: 3.1, fullMark: 5 },
  { subject: { id: "Efektivitas", en: "Effectiveness" }, score: 3.4, fullMark: 5 },
  { subject: { id: "SDM", en: "Human Resources" }, score: 3.6, fullMark: 5 },
  { subject: { id: "Jejaring", en: "Network" }, score: 3.65, fullMark: 5 },
];

export const radarBenchmarkAverage = 3.29;

// 9. SDG 2024 vs 2025
export const sdgData: SdgItem[] = [
  { goal: 1, y2024: 99, y2025: 110 },
  { goal: 2, y2024: 113, y2025: 128 },
  { goal: 3, y2024: 335, y2025: 377 },
  { goal: 4, y2024: 1011, y2025: 1136 },
  { goal: 5, y2024: 141, y2025: 185 },
  { goal: 6, y2024: 47, y2025: 38 },
  { goal: 7, y2024: 39, y2025: 51 },
  { goal: 8, y2024: 257, y2025: 309 },
  { goal: 9, y2024: 213, y2025: 252 },
  { goal: 10, y2024: 224, y2025: 294 },
  { goal: 11, y2024: 180, y2025: 230 },
  { goal: 12, y2024: 140, y2025: 150 },
  { goal: 13, y2024: 135, y2025: 125 },
  { goal: 14, y2024: 55, y2025: 70 },
  { goal: 15, y2024: 110, y2025: 100 },
  { goal: 16, y2024: 293, y2025: 400 },
  { goal: 17, y2024: 121, y2025: 971 },
];

export const bigNumberSample = {
  participants: 701983,
  organizations: 184,
  activities: 3612,
};
