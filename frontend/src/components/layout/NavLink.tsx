import { NavLink as RouterLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  to: string;
  label: string;
  onClick?: () => void;
}

const NavLink = ({ to, label, onClick }: NavLinkProps) => {
  return (
    <RouterLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "transition-colors duration-200",
          isActive 
            ? "text-primary dark:text-secondary-fixed-dim border-b-2 border-secondary-container font-bold pb-1 hover:text-secondary dark:hover:text-secondary-fixed active:opacity-80 active:scale-95 transition-all" 
            : "text-on-surface-variant dark:text-surface-variant font-medium hover:text-secondary dark:hover:text-secondary-fixed"
        )
      }
    >
      {label}
    </RouterLink>
  );
};

export default NavLink;
