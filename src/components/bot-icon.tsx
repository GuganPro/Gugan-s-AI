import * as React from 'react';

export function BotIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      {...props}
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10Z" />
      <path d="M8 12.5h.01" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 12.5h.01" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M8.5 17.5c.667-1.333 2.333-2.5 3.5-2.5s2.833 1.167 3.5 2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
