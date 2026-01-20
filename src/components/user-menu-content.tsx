import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { UserInfo } from "@/components/user-info";
import { logout } from "@/routes";
import { edit } from "@/routes/profile";
import { type User } from "@/types";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Settings } from "lucide-react";
import { useMobileNavigation } from "@/hooks/useMobileNavigation";

interface UserMenuContentProps {
  user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
  const cleanup = useMobileNavigation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    cleanup();
    navigate(logout());
  };

  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <UserInfo user={user} showEmail={true} />
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link className="block w-full" to={edit()} onClick={cleanup}>
            <Settings className="mr-2" />
            Settings
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <button
          className="flex w-full cursor-pointer items-center"
          onClick={handleLogout}
          data-test="logout-button"
        >
          <LogOut className="mr-2" />
          Log out
        </button>
      </DropdownMenuItem>
    </>
  );
}
