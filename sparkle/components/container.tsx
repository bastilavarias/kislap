export function Container({ children }: { children: React.ReactNode }) {
  return (
    <section className="px-4">
      <div className="container mx-auto text-center max-w-3xl">{children}</div>
    </section>
  );
}
