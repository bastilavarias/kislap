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
    <Accordion type="single" collapsible className="mt-12 w-full">
      {items.map((item, index) => (
        <AccordionItem key={`${slug}-faq-${index}`} value={`${slug}-faq-${index}`}>
          <AccordionTrigger className="text-left text-lg font-medium text-foreground hover:no-underline">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-base leading-relaxed text-muted-foreground">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
