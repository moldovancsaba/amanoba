import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none',
  {
    variants: {
      variant: {
        default: 'bg-brand-accent text-brand-black shadow-lg hover:bg-primary-400',
        secondary: 'bg-brand-darkGrey text-brand-white border border-brand-border-subtle hover:bg-brand-secondary-700',
        outline: 'border border-brand-border-subtle bg-brand-white text-brand-black hover:bg-brand-surface-subtle',
        ghost: 'text-brand-text-muted hover:bg-brand-surface-subtle hover:text-brand-text-primary',
        destructive: 'bg-semantic-error text-brand-white hover:brightness-95',
        link: 'h-auto rounded-none px-0 py-0 text-brand-accent underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
