import fs from "node:fs";
import path from "node:path";
import LoadState from "@/components/fx/LoadState";
import SmoothScroll from "@/components/fx/SmoothScroll";
import Cursor from "@/components/fx/Cursor";
import Background from "@/components/fx/Background";
import ScrollProgress from "@/components/fx/ScrollProgress";
import ScrollBuddy from "@/components/fx/ScrollBuddy";
import Header from "@/components/layout/Header";
import HeroScene from "@/components/three/HeroScene";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import WhatIDo from "@/components/sections/WhatIDo";
import Career from "@/components/sections/Career";
import Work from "@/components/sections/Work";
import TechStack from "@/components/sections/TechStack";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";

export default function Home() {
  // Drop a resume.pdf into /public and the RESUME link appears automatically.
  const hasResume = fs.existsSync(path.join(process.cwd(), "public", "resume.pdf"));
  // Drop a sculpted avatar at public/models/avatar.glb and it replaces the built-in character.
  const avatarUrl = fs.existsSync(path.join(process.cwd(), "public", "models", "avatar.glb")) ? "/models/avatar.glb" : null;

  return (
    <>
      <SmoothScroll />
      <LoadState>
        <Background />
        <HeroScene avatarUrl={avatarUrl} />
        <ScrollProgress />
        <Cursor />
        <ScrollBuddy />
        <Header hasResume={hasResume} />
        <main className="relative">
          <Hero />
          <About />
          <WhatIDo />
          <Career />
          <Work />
          <TechStack />
          <Education />
          <Contact />
        </main>
      </LoadState>
    </>
  );
}
