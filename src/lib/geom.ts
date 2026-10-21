export const r2 = (n: number): number => Math.round(n * 100) / 100;

export interface Point {
  x: number;
  y: number;
}

export const polar = (
  cx: number,
  cy: number,
  radius: number,
  angleRad: number
): Point => ({
  x: r2(cx + radius * Math.cos(angleRad)),
  y: r2(cy + radius * Math.sin(angleRad)),
});
