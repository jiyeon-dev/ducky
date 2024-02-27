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
import { useAction } from "@/hooks/useAction";
import { deleteUser } from "@/actions/auth/deleteUser";
import { LoadingSpinner } from "../LoadingSpinner";
import { toast } from "sonner";

interface NavAvatarProps {
  user: User | null;
}

export default function NavAvatar({ user }: NavAvatarProps) {
  const navigate = useNavigate();

  const { execute, isLoading } = useAction(deleteUser, {
    onSuccess: () => {
      toast.success("Good Bye!");
      navigate("/");
    },
    onError(error) {
      toast.error(error);
    },
  });

  // 로그아웃
  const doLogout = () => {
    logout(true);
    navigate("/login");
  };

  // 회원 탈퇴
  const doWithdrawal = () => {
    execute({});
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
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
          <DropdownMenuItem onClick={doWithdrawal}>
            Delete Account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
