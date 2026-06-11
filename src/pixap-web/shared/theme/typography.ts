export const typography = {
  logo: { fontSize: 28, fontWeight: 700, lineHeight: 34 },
  sectionTitle: { fontSize: 17, fontWeight: 600, lineHeight: 22 },
  cardTitle: { fontSize: 15, fontWeight: 600, lineHeight: 20 },
  body: { fontSize: 14, fontWeight: 400, lineHeight: 20 },
  meta: { fontSize: 12, fontWeight: 400, lineHeight: 16 },
} as const;

export type PixapTextStyle = keyof typeof typography;
