import Image from "next/image";
import { OrbitRing, Ripple } from "./Orbit";
import TechLogo from "./TechLogo";

const inner = ["Node.js", "TypeScript", "Redis", "MongoDB"];
const outer = ["Docker", "React", "AWS S3", "BullMQ", "Angular", "Git"];

/** Circular photo with an animated rainbow ring, ripples and orbiting tech logos. */
export default function ProfileOrbit({ size = 150, priority = false }: { size?: number; priority?: boolean }) {
  const box = size * 2.3;
  return (
    <div className="relative flex shrink-0 items-center justify-center" style={{ width: box, height: box }}>
      <Ripple base={size * 1.05} rings={4} />
      <OrbitRing radius={size * 0.78} duration={18}>
        {inner.map((n) => (
          <span key={n} title={n} className="glass flex h-9 w-9 items-center justify-center rounded-full shadow-[0_0_16px_rgba(168,85,247,0.4)]">
            <TechLogo name={n} className="h-[18px] w-[18px]" />
          </span>
        ))}
      </OrbitRing>
      <OrbitRing radius={size * 1.08} duration={28} reverse>
        {outer.map((n) => (
          <span key={n} title={n} className="glass flex h-8 w-8 items-center justify-center rounded-full">
            <TechLogo name={n} className="h-4 w-4" />
          </span>
        ))}
      </OrbitRing>

      <div className="relative rounded-full p-[3px]" style={{ width: size, height: size }}>
        <span className="orbit absolute inset-0 rounded-full bg-[conic-gradient(#a855f7,#22d3ee,#f472b6,#facc15,#34d399,#a855f7)] blur-[2px] [--orbit-duration:5s]" />
        <span className="absolute inset-[-12px] rounded-full bg-[conic-gradient(#a855f7,#22d3ee,#f472b6,#facc15,#a855f7)] opacity-40 blur-2xl" />
        <div className="relative h-full w-full overflow-hidden rounded-full bg-[#0d0a14]">
          <Image
            src="/me.webp"
            alt="Kollimarla Sai Sanjay"
            fill
            sizes={`${size}px`}
            priority={priority}
            className="scale-[1.55] object-cover object-[50%_22%] transition-transform duration-700 hover:scale-[1.7]"
          />
        </div>
      </div>
    </div>
  );
}
