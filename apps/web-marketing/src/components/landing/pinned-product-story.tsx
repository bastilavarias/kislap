import { productStories } from "@/components/landing/data";
import { PlaceholderMedia } from "@/components/landing/placeholder-media";

export function PinnedProductStory() {
  return (
    <section className="landing-pin-section border-b-4 border-black bg-black py-28 text-white md:py-44">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 md:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="landing-pin-title h-fit lg:sticky lg:top-28">
          <h2 className="text-5xl font-black uppercase leading-[0.88] md:text-7xl">
            Three pages, one hard-working system.
          </h2>
          <p className="mt-8 max-w-lg text-xl font-semibold leading-relaxed text-zinc-300">
            Portfolio, link page, and menu are not generic templates. Each one
            gets its own structure, public behavior, and conversion path.
          </p>
        </div>

        <div className="space-y-10">
          {productStories.map((story) => {
            const Icon = story.icon;

            return (
              <article
                key={story.title}
                className="landing-story-card landing-pop-card group border-4 border-white bg-white p-5 text-black shadow-[12px_12px_0_var(--story-shadow,#ef4444)]"
              >
                <div className="grid gap-6 md:grid-cols-[0.92fr_1.08fr]">
                  <PlaceholderMedia
                    title={`${story.title} screen`}
                    size={story.imageSize}
                    icon={Icon}
                    imageSrc={story.imageSrc}
                    className="landing-scale-media landing-image-lift min-h-80 bg-zinc-300 shadow-none"
                  />
                  <div className="flex flex-col justify-between">
                    <div>
                      <div
                        className={`mb-5 inline-flex border-4 border-black ${story.accent} px-3 py-2 font-mono text-xs font-black uppercase text-black shadow-[4px_4px_0_#000]`}
                      >
                        {story.eyebrow}
                      </div>
                      <h3 className="text-5xl font-black uppercase leading-none">
                        {story.title}
                      </h3>
                      <p className="landing-scrub-text mt-5 text-lg font-semibold leading-relaxed text-zinc-700">
                        {story.copy}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
