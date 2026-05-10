import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const cardVariants = cva('rounded-2xl border shadow-lg', {
  variants: {
    variant: {
      default: 'bg-brand-white text-brand-black border-brand-border-strong',
      dark: 'bg-brand-darkGrey text-brand-white border-brand-border-strong',
      subtle: 'bg-brand-surface-subtle text-brand-text-primary border-brand-border-subtle shadow-sm',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants({ variant }), className)}
    {...props}
  />
));
Card.displayName = 'Card';

export { Card, cardVariants };
