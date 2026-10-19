import { iconFor } from "@/lib/techIcons";

export default function TechLogo({ name, className = "h-4 w-4", mono = false }: { name: string; className?: string; mono?: boolean }) {
  const icon = iconFor(name);
  if (!icon) return null;
  return (
    <svg viewBox="0 0 24 24" className={className} fill={mono ? "currentColor" : icon.color} aria-hidden>
      <path d={icon.path} />
    </svg>
  );
}
