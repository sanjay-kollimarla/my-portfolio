"use client";

import dynamic from "next/dynamic";

// three.js + the avatar stay out of the initial bundle, so the page is interactive before they load
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export default HeroScene;
