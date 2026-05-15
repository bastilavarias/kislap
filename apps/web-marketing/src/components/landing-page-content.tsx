import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { BuilderShowcase } from "@/components/landing/builder-showcase";
import { ExamplesRail } from "@/components/landing/examples-rail";
import { FinalCta } from "@/components/landing/final-cta";
import { Hero } from "@/components/landing/hero";
import { OpenSourceSection } from "@/components/landing/open-source-section";
import { PricingFree } from "@/components/landing/pricing-free";
import { VisibilitySection } from "@/components/landing/visibility-section";
import type { LandingBuildPaths } from "@/components/landing/data";

type LandingPageContentProps = {
  buildPaths: LandingBuildPaths;
};

export function LandingPageContent({ buildPaths }: LandingPageContentProps) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduceMotion) return;

      gsap.from(".landing-hero-copy > *", {
        y: 44,
        opacity: 0,
        duration: 0.85,
        ease: "back.out(1.35)",
        stagger: 0.09,
      });

      gsap.fromTo(
        ".landing-hero-panel",
        {
          y: 110,
          opacity: 0,
          rotateX: 16,
          rotateY: (index) => (index === 0 ? -14 : 14),
          rotateZ: (index) => (index === 0 ? -4 : 4),
          scale: 0.9,
          transformPerspective: 900,
          transformOrigin: "50% 70%",
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          scale: 1,
          duration: 1.15,
          ease: "expo.out",
          stagger: 0.16,
          delay: 0.18,
        }
      );

      gsap.to(".landing-hero-panel", {
        y: (index) => (index === 0 ? -14 : 14),
        rotateZ: (index) => (index === 0 ? -0.8 : 0.8),
        duration: 2.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.28,
      });

      gsap.utils.toArray<HTMLElement>(".landing-hero-panel").forEach((panel) => {
        panel.addEventListener("pointermove", (event) => {
          const rect = panel.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;

          gsap.to(panel, {
            rotateY: x * 8,
            rotateX: y * -8,
            scale: 1.018,
            duration: 0.28,
            ease: "power2.out",
            transformPerspective: 900,
          });
        });

        panel.addEventListener("pointerleave", () => {
          gsap.to(panel, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.5,
            ease: "elastic.out(1, 0.65)",
          });
        });
      });

      gsap.to(".landing-bounce", {
        y: -10,
        duration: 0.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.12,
      });

      gsap.to(".landing-wiggle", {
        rotate: 5,
        duration: 1.1,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        transformOrigin: "50% 50%",
        stagger: 0.16,
      });

      gsap.utils.toArray<HTMLElement>(".landing-reveal").forEach((item) => {
        gsap.from(item, {
          y: 52,
          opacity: 0,
          scale: 0.96,
          duration: 0.75,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: item,
            start: "top 84%",
            toggleActions: "play none none reverse",
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".landing-pop-card").forEach((card) => {
        gsap.from(card, {
          y: 72,
          opacity: 0,
          rotate: gsap.utils.random(-3, 3),
          scale: 0.92,
          duration: 0.8,
          ease: "elastic.out(1, 0.75)",
          scrollTrigger: {
            trigger: card,
            start: "top 86%",
            toggleActions: "play none none reverse",
          },
        });

        card.addEventListener("pointerenter", () => {
          gsap.to(card, {
            y: -10,
            rotate: gsap.utils.random(-1.5, 1.5),
            scale: 1.025,
            duration: 0.28,
            ease: "back.out(2)",
          });
        });

        card.addEventListener("pointerleave", () => {
          gsap.to(card, {
            y: 0,
            rotate: 0,
            scale: 1,
            duration: 0.34,
            ease: "power2.out",
          });
        });
      });

      gsap.from(".landing-benefit-card", {
        y: 46,
        scale: 0.96,
        rotate: (index) => [-1.5, 1.2, -0.8][index] ?? 0,
        duration: 0.7,
        ease: "back.out(1.6)",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".landing-benefit-grid",
          start: "top 86%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.utils
        .toArray<HTMLElement>(".landing-benefit-card")
        .forEach((card) => {
          card.addEventListener("pointerenter", () => {
            gsap.to(card, {
              y: -8,
              scale: 1.018,
              duration: 0.24,
              ease: "back.out(2)",
            });
          });

          card.addEventListener("pointerleave", () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
            });
          });
        });

      gsap.utils.toArray<HTMLElement>(".landing-image-lift").forEach((media) => {
        gsap.fromTo(
          media,
          { scale: 0.86, opacity: 0.55, filter: "contrast(0.85) saturate(0.8)" },
          {
            scale: 1,
            opacity: 1,
            filter: "contrast(1) saturate(1)",
            ease: "none",
            scrollTrigger: {
              trigger: media,
              start: "top 90%",
              end: "bottom 38%",
              scrub: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".landing-stack-card").forEach((card) => {
        gsap.fromTo(
          card,
          { y: 80, rotate: -2, scale: 0.94 },
          {
            y: 0,
            rotate: 0,
            scale: 1,
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

      gsap.utils.toArray<HTMLElement>(".landing-scrub-text").forEach((item) => {
        const words = item.innerText.split(" ");
        item.innerHTML = words
          .map((word) => `<span class="inline-block opacity-20">${word}</span>`)
          .join(" ");

        gsap.to(item.querySelectorAll("span"), {
          opacity: 1,
          y: -2,
          stagger: 0.04,
          ease: "none",
          scrollTrigger: {
            trigger: item,
            start: "top 78%",
            end: "bottom 48%",
            scrub: true,
          },
        });
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

      gsap.to(".landing-free-word", {
        xPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: ".landing-free-word",
          start: "top 82%",
          end: "bottom 20%",
          scrub: true,
        },
      });
    });

    return () => context.revert();
  }, []);

  return (
    <main className="w-full max-w-full overflow-x-hidden bg-white font-sans text-black">
      <Hero buildPaths={buildPaths} />
      <VisibilitySection buildPaths={buildPaths} />
      <BuilderShowcase />
      <ExamplesRail buildPaths={buildPaths} />
      <OpenSourceSection />
      <PricingFree buildPaths={buildPaths} />
      <FinalCta buildPaths={buildPaths} />
    </main>
  );
}
