import Link from "next/link";
import { BRAND } from "@/lib/brand";

export function BrandMark({ href }: { href: string }) {
  return (
    <Link href={href} className="group flex items-center gap-2.5">
      <span
        aria-hidden
        className="grid size-7 place-items-center rounded-full border-2 border-wax text-[0.55rem] font-semibold tracking-[0.12em] text-wax transition group-hover:bg-wax group-hover:text-paper"
      >
        TD
      </span>
      <span className="td-title text-[1.35rem] leading-none">{BRAND}</span>
    </Link>
  );
}
