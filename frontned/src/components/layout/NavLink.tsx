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
          "text-sm font-medium transition-colors animated-underline",
          isActive ? "text-primary" : "text-foreground/70 hover:text-foreground"
        )
      }
    >
      {label}
    </RouterLink>
  );
};

export default NavLink;
