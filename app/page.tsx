import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { CelebrationMarqueeSection } from "@/components/home/CelebrationMarqueeSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { InteractivePreviewSection } from "@/components/home/InteractivePreviewSection";
import { WhyDifferentSection } from "@/components/home/WhyDifferentSection";
import { PopularTemplatesSection } from "@/components/home/PopularTemplatesSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Featured Experiences */}
      <FeaturedSection />

      {/* 2.5. Celebration Proof Marquee */}
      <CelebrationMarqueeSection />

      {/* 3. How It Works */}
      <HowItWorksSection />

      {/* 4. Interactive Experience Preview */}
      <InteractivePreviewSection />

      {/* 5. Why It's Different */}
      <WhyDifferentSection />

      {/* 6. Popular Templates */}
      <PopularTemplatesSection />

      {/* 7. Final CTA */}
      <FinalCtaSection />
    </div>
  );
}
