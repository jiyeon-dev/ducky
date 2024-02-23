import { User } from "firebase/auth";
import { logout } from "@/actions/auth/logout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AvatarFallback, Avatar, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

interface NavAvatarProps {
  user: User | null;
}

export default function NavAvatar({ user }: NavAvatarProps) {
  const navigate = useNavigate();

  // 로그아웃
  const doLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* 자리 확보를 위해 user 정보 없어도 표시하도록 함. */}
        <Avatar className='cursor-pointer'>
          <AvatarImage
            src={user?.photoURL || ""}
            alt={user?.displayName || ""}
          />
          {user && (
            <AvatarFallback>
              {user?.displayName?.slice(0, 2) || "익명"}
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={doLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
