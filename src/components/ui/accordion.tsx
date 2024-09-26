import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border', className)}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Header>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Header> & {
    disabled?: boolean;
  }
>(({ className, children, disabled, ...props }, ref) => (
  <AccordionPrimitive.Header
    {...props}
    ref={ref}
    className={cn(
      'flex flex-1 p-0 h-12 items-center justify-start transition-all hover:bg-slate-100 [&[data-state=open]>svg]:rotate-180',
      className
    )}
  >
    <AccordionPrimitive.Trigger
      disabled={disabled}
      className={cn(
        'h-full flex items-center justify-center [&[data-state=open]>svg]:rotate-180',
        'text-slate-300 hover:text-slate-800 transition-colors',
        disabled ? 'opacity-0' : ''
      )}
    >
      <ChevronDown
        className={cn('h-4 w-8 shrink-0 transition-transform duration-200')}
      />
    </AccordionPrimitive.Trigger>
    {children}
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('', className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
