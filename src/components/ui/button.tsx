import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[color:var(--accent-9)] text-[color:var(--accent-contrast)] hover:bg-[color:var(--accent-10)]',
        destructive:
          'bg-[color:var(--tomato-9)] text-white hover:bg-[color:var(--tomato-10)]',
        outline:
          'border border-[color:var(--gray-6)] bg-[color:var(--gray-1)] hover:bg-[color:var(--accent-a3)] hover:text-[color:var(--accent-12)]',
        secondary:
          'bg-[color:var(--gray-4)] text-[color:var(--gray-12)] hover:bg-[color:var(--gray-5)]',
        ghost:
          'hover:bg-[color:var(--accent-a3)] hover:text-[color:var(--accent-12)]',
        link:
          'text-[color:var(--accent-11)] underline-offset-4 hover:text-[color:var(--accent-12)] hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
