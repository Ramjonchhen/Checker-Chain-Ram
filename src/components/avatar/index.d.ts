export interface AvatarProps {
  variant?: "default" | "nft";
  percentage?: number;
  level?: string;
  className?: string;
  image?: string;
  onClick?: () => void;
}
  