import React from 'react';

export const Logo = ({ className }: { className?: string }) => (
    <svg
      width="480"
      height="120"
      viewBox="0 0 480 120"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block align-middle ${className}`}
    >
      <rect x="0" y="40" width="480" height="40" fill="#000000" />
      <text
        x="240"
        y="80"
        fontFamily="Arial, sans-serif"
        fontSize="72"
        fontWeight="bold"
        textAnchor="middle"
        fill="white"
      >
        boarder
      </text>
    </svg>
);