import aaronLogoDark from "@assets/aaron logo dark@2x_1754410255295.png";
import aaronLogoLight from "@assets/aaron logo light@2x_1754410255295.png";

interface AaronIconProps {
  size?: number;
  className?: string;
  variant?: "head" | "logo";
  theme?: "light" | "dark";
}

export default function AaronIcon({ size = 24, className = "", variant = "head", theme = "dark" }: AaronIconProps) {
  if (variant === "logo") {
    return (
      <img 
        src={theme === "dark" ? aaronLogoDark : aaronLogoLight}
        alt="Aaron"
        width={size * 3} // Logo is wider
        height={size}
        className={className}
      />
    );
  }

  // Head icon - simplified version of your logo's head
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Simplified head silhouette based on your logo */}
      <path 
        d="M25 45C25 25 40 15 50 15C60 15 75 25 75 45C75 50 73 55 70 58C70 60 68 65 65 70C60 75 55 80 50 80C45 80 40 75 35 70C32 65 30 60 30 58C27 55 25 50 25 45Z" 
        fill="currentColor"
      />
      {/* Curved detail like in your logo */}
      <path 
        d="M20 35C20 30 25 25 30 25C35 25 40 30 40 35C40 40 35 45 30 45C25 45 20 40 20 35Z" 
        fill="currentColor"
        opacity="0.8"
      />
    </svg>
  );
}
