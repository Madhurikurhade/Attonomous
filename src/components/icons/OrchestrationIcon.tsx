import React from 'react';

interface OrchestrationIconProps {
  size?: number;
  className?: string;
}

/**
 * 4-square icon representing Use Case Orchestration
 * Faithfully crafted to match the user's uploaded Image 1
 */
export const OrchestrationIcon: React.FC<OrchestrationIconProps> = ({
  size = 24,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background dark rounded square */}
      <rect width="48" height="48" rx="10" fill="#13100E" />

      {/* 2x2 Grid of 4 rounded squares with warm-silver stroke */}
      {/* Top-left square */}
      <rect
        x="13"
        y="13"
        width="9.5"
        height="9.5"
        rx="2.5"
        fill="#1C1815"
        stroke="#D4CDC3"
        strokeWidth="2.2"
      />
      {/* Top-right square */}
      <rect
        x="25.5"
        y="13"
        width="9.5"
        height="9.5"
        rx="2.5"
        fill="#1C1815"
        stroke="#D4CDC3"
        strokeWidth="2.2"
      />
      {/* Bottom-left square */}
      <rect
        x="13"
        y="25.5"
        width="9.5"
        height="9.5"
        rx="2.5"
        fill="#1C1815"
        stroke="#D4CDC3"
        strokeWidth="2.2"
      />
      {/* Bottom-right square */}
      <rect
        x="25.5"
        y="25.5"
        width="9.5"
        height="9.5"
        rx="2.5"
        fill="#1C1815"
        stroke="#D4CDC3"
        strokeWidth="2.2"
      />
    </svg>
  );
};
