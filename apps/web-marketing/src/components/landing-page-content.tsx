import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ExamplesRail } from "@/components/landing/examples-rail";
import { FinalCta } from "@/components/landing/final-cta";
import { Hero } from "@/components/landing/hero";
import { OpenSourceSection } from "@/components/landing/open-source-section";
import { PinnedProductStory } from "@/components/landing/pinned-product-story";
import { ProductBento } from "@/components/landing/product-bento";

export function LandingPageContent() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      ScrollTrigger.matchMedia({
        "(min-width: 1024px)": () => {
          ScrollTrigger.create({
            trigger: ".landing-pin-section",
            start: "top top",
            end: "bottom bottom",
            pin: ".landing-pin-title",
            pinSpacing: false,
          });
        },
      });

      gsap.fromTo(
        ".landing-scale-media",
        { scale: 0.9, opacity: 0.7 },
        {
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".landing-pin-section",
            start: "top 80%",
            end: "bottom 30%",
            scrub: true,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>(".landing-stack-card").forEach((card) => {
        gsap.fromTo(
          card,
          { y: 64, rotate: -2 },
          {
            y: 0,
            rotate: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              end: "top 42%",
              scrub: true,
            },
          }
        );
      });

      gsap.to(".landing-horizontal-rail", {
        xPercent: -38,
        ease: "none",
        scrollTrigger: {
          trigger: ".landing-horizontal-rail",
          start: "top 78%",
          end: "bottom 20%",
          scrub: true,
        },
      });
    });

    return () => context.revert();
  }, []);

  return (
    <main className="w-full max-w-full overflow-x-hidden bg-white font-sans text-black">
      <Hero />
      <ProductBento />
      <PinnedProductStory />
      <ExamplesRail />
      <OpenSourceSection />
      <FinalCta />
    </main>
  );
}
