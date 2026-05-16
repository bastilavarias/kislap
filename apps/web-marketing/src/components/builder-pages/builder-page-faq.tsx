import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface BuilderPageFaqProps {
  items: Array<{
    question: string;
    answer: string;
  }>;
  slug: string;
}

export function BuilderPageFaq({ items, slug }: BuilderPageFaqProps) {
  return (
    <Accordion type="single" collapsible className="mt-12 w-full border-4 border-black bg-white">
      {items.map((item, index) => (
        <AccordionItem
          key={`${slug}-faq-${index}`}
          value={`${slug}-faq-${index}`}
          className="border-b-4 border-black px-5 last:border-b-0"
        >
          <AccordionTrigger className="text-left text-lg font-black uppercase text-black hover:no-underline">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-base font-semibold leading-relaxed text-zinc-700">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
