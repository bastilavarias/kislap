import { bentoCards } from "@/components/landing/data";
import { PlaceholderMedia } from "@/components/landing/placeholder-media";

export function ProductBento() {
  return (
    <section className="border-b-4 border-black bg-zinc-100 px-4 py-28 md:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <h2 className="max-w-4xl text-5xl font-black uppercase leading-[0.9] md:text-7xl">
            See what your page can become.
          </h2>
          <p className="max-w-2xl text-xl font-semibold leading-relaxed text-zinc-700">
            Start with simple details, then publish something that feels ready
            to send to clients, employers, followers, or customers.
          </p>
        </div>

        <div className="mt-16 grid grid-flow-dense gap-6 lg:grid-cols-6 lg:auto-rows-[250px]">
          {bentoCards.map((card) => (
            <PlaceholderMedia
              key={card.title}
              title={card.title}
              size={card.size}
              note={card.copy}
              icon={card.icon}
              className={`${card.className} ${card.tone}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
