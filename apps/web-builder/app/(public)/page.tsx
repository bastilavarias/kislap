import Image from 'next/image';

import Form from './components/form';

export default function Page() {
  return (
    <section className="min-h-[calc(100svh-5rem)] overflow-hidden bg-white px-5 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100svh-10rem)] max-w-7xl items-center">
        <div className="grid w-full gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="grid gap-8">
            <div className="max-w-2xl">
              <p className="font-mono text-sm font-black uppercase tracking-[0.22em] text-primary">
                Kislap builder
              </p>
              <h1 className="mt-5 text-5xl font-black uppercase leading-[0.9] tracking-normal text-black sm:text-6xl lg:text-7xl">
                Sign in and keep publishing.
              </h1>
              <p className="mt-6 max-w-xl text-lg font-semibold leading-relaxed text-zinc-700">
                Manage portfolios, link pages, and menus from one workspace. Kislap handles the public URL, code, database, and hosting details.
              </p>
            </div>

            <div className="relative -ml-4 aspect-[3/2] max-h-[34rem] overflow-hidden sm:-ml-8 lg:-ml-10">
              <Image
                src="/sign-in.png"
                alt="Neo-brutalist illustration of form inputs transforming into a published website"
                width={1536}
                height={1024}
                priority
                className="h-full w-full object-contain object-left"
              />
            </div>
          </div>

          <Form />
        </div>
      </div>
    </section>
  );
}
