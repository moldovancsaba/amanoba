/**
 * Logo Component
 * 
 * What: Displays the Amanoba logo
 * Why: Consistent branding across the platform
 */

import Image from 'next/image';
import { LocaleLink } from './LocaleLink';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  linkTo?: string;
}

/**
 * Logo Component
 * 
 * Why: Reusable logo with different sizes and optional text
 */
export default function Logo({ 
  size = 'md', 
  showText = false,
  className = '',
  linkTo = '/dashboard'
}: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-12 w-auto',
    lg: 'h-16 w-auto',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const logoContent = (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/AMANOBA.png"
        alt="Amanoba Logo"
        width={size === 'sm' ? 32 : size === 'md' ? 48 : 64}
        height={size === 'sm' ? 32 : size === 'md' ? 48 : 64}
        className={sizeClasses[size]}
        priority
      />
      {showText && (
        <span className={`font-bold text-brand-black dark:text-brand-white ${textSizeClasses[size]}`}>
          Amanoba
        </span>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <LocaleLink href={linkTo} className="inline-block">
        {logoContent}
      </LocaleLink>
    );
  }

  return logoContent;
}
