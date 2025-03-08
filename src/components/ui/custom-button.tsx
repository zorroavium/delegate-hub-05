
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  glass?: boolean;
  children: React.ReactNode;
}

export const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      isLoading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      glass = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Map custom variants to shadcn button variants
    const getVariantClass = () => {
      switch (variant) {
        case 'primary':
          return 'bg-primary text-primary-foreground hover:bg-primary/90';
        case 'success':
          return 'bg-status-completed text-white hover:bg-status-completed/90';
        case 'warning':
          return 'bg-status-pending text-white hover:bg-status-pending/90';
        case 'danger':
          return 'bg-status-delayed text-white hover:bg-status-delayed/90';
        default:
          return '';
      }
    };

    return (
      <Button
        className={cn(
          getVariantClass(),
          fullWidth && 'w-full',
          glass && 'backdrop-blur-sm bg-opacity-80 border border-white/20',
          'transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]',
          isLoading && 'opacity-90 pointer-events-none',
          className
        )}
        variant={
          ['primary', 'success', 'warning', 'danger'].includes(variant)
            ? 'default'
            : variant as any
        }
        size={size}
        disabled={isLoading || disabled}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          iconPosition === 'left' && icon && <span className="mr-2">{icon}</span>
        )}
        {children}
        {!isLoading && iconPosition === 'right' && icon && <span className="ml-2">{icon}</span>}
      </Button>
    );
  }
);

CustomButton.displayName = 'CustomButton';
