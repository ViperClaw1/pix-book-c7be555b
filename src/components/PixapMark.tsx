import { SVGProps } from "react";

/**
 * Pixap brand mark — a stylized location pin with a plane swooping around it.
 * Pure white silhouette, scales with `className` (use width/height utility classes).
 */
export const PixapMark = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 200 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    {/* Pin body with swooping tail — forms a teardrop with an "S" curve underneath */}
    <path
      d="M100 18
         C 58 18, 28 50, 28 92
         C 28 128, 56 158, 88 196
         C 92 201, 96 206, 100 210
         C 104 206, 108 201, 112 196
         C 144 158, 172 128, 172 92
         C 172 75, 167 60, 158 48
         C 178 80, 170 120, 130 140
         C 88 161, 50 175, 30 180
         C 60 175, 100 168, 138 148
         C 178 127, 188 82, 158 48
         C 145 30, 124 18, 100 18 Z"
      fill="currentColor"
    />
    {/* Inner negative-space circle */}
    <circle cx="100" cy="88" r="22" fill="hsl(0 0% 0% / 0)" />
    {/* Plane swooping in upper right */}
    <path
      d="M178 30
         L150 44
         L138 40
         L132 44
         L146 52
         L140 60
         L132 60
         L128 64
         L142 70
         L150 64
         L158 56
         L172 50
         C 180 46, 184 38, 178 30 Z"
      fill="currentColor"
    />
    {/* Motion arc behind the plane */}
    <path
      d="M70 60 C 100 40, 140 38, 168 50"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      opacity="0.85"
    />
  </svg>
);

export default PixapMark;
