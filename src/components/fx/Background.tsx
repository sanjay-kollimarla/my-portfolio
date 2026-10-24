"use client";

/** Warm paper page with a faint column grid, grain and two slow washes of colour for the glass to blur. */
export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-paper">
      <div
        className="absolute -left-[10vw] -top-[12vh] h-[55vw] w-[55vw] rounded-full opacity-80 blur-[110px] will-change-transform"
        style={{ background: "radial-gradient(circle, rgba(70,100,255,0.30), transparent 65%)", animation: "wash-a 24s ease-in-out infinite alternate" }}
      />
      <div
        className="absolute -bottom-[18vh] -right-[8vw] h-[50vw] w-[50vw] rounded-full opacity-70 blur-[110px] will-change-transform"
        style={{ background: "radial-gradient(circle, rgba(255,140,80,0.12), transparent 65%)", animation: "wash-b 30s ease-in-out infinite alternate" }}
      />
      {/* hairline column grid  */}
      <div
        className="absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "calc(100% / 12) 100%",
          maskImage: "linear-gradient(to bottom, #000 0%, #000 60%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 60%, transparent 100%)",
        }}
      />
      <div className="paper-grain absolute inset-0" />
    </div>
  );
}
