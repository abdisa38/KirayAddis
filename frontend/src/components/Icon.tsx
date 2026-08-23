import React from "react";

export type IconName =
  | "search"
  | "pin"
  | "heart"
  | "check"
  | "filter"
  | "close"
  | "spark"
  | "arrow"
  | "menu"
  | "map"
  | "sliders"
  | "bed"
  | "bath"
  | "area"
  | "play"
  | "calendar"
  | "message"
  | "share"
  | "home"
  | "bell"
  | "more"
  | "mail"
  | "lock"
  | "eye"
  | "copy"
  | "refresh"
  | "shield"
  | "flag"
  | "chart"
  | "file"
  | "users"
  | "grid"
  | "attach"
  | "send"
  | "photo";

const iconPaths: Record<string, React.ReactNode> = {
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15 15 5 5" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.2" />
    </>
  ),
  heart: (
    <path d="M20.8 5.7a5.6 5.6 0 0 0-7.9 0L12 6.6l-.9-.9a5.6 5.6 0 0 0-7.9 7.9L12 22l8.8-8.4a5.6 5.6 0 0 0 0-7.9Z" />
  ),
  check: <path d="m5 12 4.2 4.2L19 6.5" />,
  filter: <path d="M4 6h16M7 12h10m-7 6h4" />,
  close: <path d="m5 5 14 14M19 5 5 19" />,
  spark: (
    <path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Zm7 13 1 3.5 3.5 1-3.5 1-1 3.5-1-3.5-3.5-1 3.5-1 1-3.5Z" />
  ),
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  map: (
    <>
      <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
      <path d="M9 3v15M15 6v15" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 6h16M4 12h16M4 18h16" />
      <circle cx="9" cy="6" r="1.6" />
      <circle cx="15" cy="12" r="1.6" />
      <circle cx="11" cy="18" r="1.6" />
    </>
  ),
  bed: (
    <>
      <path d="M3 18v-6.5h18V18M5 11.5V8.2A2.2 2.2 0 0 1 7.2 6h3.3a2.2 2.2 0 0 1 2.2 2.2v3.3M3 18v2M21 18v2" />
    </>
  ),
  bath: <path d="M4 12h16v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-5Z" />,
  area: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="1" />
      <path d="M8 4v3M4 8h3M16 4v3M17 8h3M8 20v-3M4 16h3M16 20v-3M17 16h3" />
    </>
  ),
  play: <path d="m9 6 9 6-9 6V6Z" />,
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </>
  ),
  message: (
    <path d="M20 15a4 4 0 0 1-4 4H8l-4 3V7a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8Z" />
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" />
    </>
  ),
  home: (
    <path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9Z" />
  ),
  bell: (
    <>
      <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 22h4" />
    </>
  ),
  more: (
    <>
      <circle cx="5" cy="12" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="1" />
      <path d="M15 9V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h4" />
    </>
  ),
  refresh: <path d="M20 11a8 8 0 1 0 2 5.3M20 4v7h-7" />,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />,
  flag: <path d="M5 21V4m0 1h10l-1 4 1 4H5" />,
  chart: <path d="M4 19V5m0 14h16M8 16l3-4 3 2 5-7" />,
  file: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20v-1a6 6 0 0 1 12 0v1M16 4a3 3 0 0 1 0 6m3 10v-1a6 6 0 0 0-3-5.2" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </>
  ),
  attach: (
    <path d="m21.4 11.6-8.6 8.6a6 6 0 0 1-8.5-8.5l8.6-8.6a4 4 0 0 1 5.7 5.7l-8.7 8.6a2 2 0 1 1-2.8-2.8l8-8" />
  ),
  send: <path d="m22 2-7 20-4-9-9-4 20-7Z" />,
  photo: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="m3 17 5-5 3 3 3-3 7 7" />
    </>
  ),
};

export default function Icon({
  name,
  className = "i",
  style,
}: {
  name: IconName | string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const path = iconPaths[name];
  if (!path) return null;
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {path}
    </svg>
  );
}
