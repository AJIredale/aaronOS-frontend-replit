interface AaronIconProps {
  size?: number;
  className?: string;
}

export default function AaronIcon({ size = 24, className = "" }: AaronIconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Head silhouette */}
      <path 
        d="M50 15C40 15 32 25 32 35C32 40 34 44 36 47C36 47 38 50 40 52C42 54 44 58 44 62V70C44 75 48 80 54 80H66C72 80 76 75 76 70V62C76 58 78 54 80 52C82 50 84 47 84 47C86 44 88 40 88 35C88 25 80 15 70 15H50Z" 
        fill="currentColor"
      />
      {/* Eyes */}
      <circle cx="45" cy="38" r="3" fill="#1A1B23" />
      <circle cx="65" cy="38" r="3" fill="#1A1B23" />
      {/* Mouth */}
      <path 
        d="M45 48C45 48 50 52 55 48" 
        stroke="#1A1B23" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </svg>
  );
}
