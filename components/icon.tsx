import type { ReactNode, SVGProps } from "react";

const paths = {
  store: <><path d="M3 10v10h18V10M2 10l2-7h16l2 7" /><path d="M2 10a3.3 3.3 0 0 0 5 2 3.4 3.4 0 0 0 5 0 3.4 3.4 0 0 0 5 0 3.3 3.3 0 0 0 5-2M9 20v-6h6v6M8 3l-1 7M16 3l1 7" /></>,
  bag: <><path d="M5 7h14l1 14H4L5 7Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
  dine: <><circle cx="13" cy="12" r="6" /><path d="M2 3v5c0 2 4 2 4 0V3M4 3v18M22 3v18" /></>,
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  trash: <><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" /></>,
  cash: <><rect x="2" y="5" width="20" height="14" rx="2" /><circle cx="12" cy="12" r="3" /><path d="M6 12h.01M18 12h.01" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  refresh: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M6 6a8 8 0 0 1 13 2M5 16a8 8 0 0 0 13 2" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>,
  receipt: <><path d="M5 3v18l3-2 4 2 4-2 3 2V3H5Z" /><path d="M9 7h6M9 11h6M9 15h3" /></>,
} satisfies Record<string, ReactNode>;

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: keyof typeof paths }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
