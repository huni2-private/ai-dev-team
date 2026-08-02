"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  href: string;
  exact?: boolean;
  children: React.ReactNode;
}

export function NavLink({ href, exact = false, children }: Props) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`text-nav-link transition-colors ${
        active ? "text-primary-on-dark" : "text-body-muted hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}
