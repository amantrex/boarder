export function GeometricPattern() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
    >
      <defs>
        <pattern
          id="geom"
          patternUnits="userSpaceOnUse"
          width="40"
          height="40"
          patternTransform="rotate(45)"
        >
          <rect width="100%" height="100%" fill="hsl(var(--foreground))" />
          <path
            d="M0 10h10V0m10 20h10V10m10 20h10V20M10 40h10V30"
            strokeWidth="2"
            stroke="hsl(var(--background))"
            fill="none"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#geom)" />
    </svg>
  );
}
