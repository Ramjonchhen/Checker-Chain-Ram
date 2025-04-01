export interface UserRowProps {
  profileImage: string;
  followed: boolean;
  name: string;
  description: string;
  onClick?: () => void;
  className?: string;
  badges?: string[];
  bio?: string;
  id: string;
  username: string;
}
