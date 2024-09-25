import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './components/ui/accordion';

export function App() {
  return (
    <div>
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>item 1</AccordionTrigger>
          <AccordionContent>test 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>item 2</AccordionTrigger>
          <AccordionContent>test 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
