'use client';

import React from 'react';
import { worldTheme } from '../../../lib/world/theme';

type WorldButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: keyof typeof worldTheme.buttonSizes;
  variant?: keyof typeof worldTheme.buttonVariants;
};

export default function WorldButton({
  size = 'md',
  variant = 'ghost',
  className = '',
  children,
  ...props
}: WorldButtonProps) {
  return (
    <button
      className={[
        worldTheme.buttonBase,
        worldTheme.buttonSizes[size],
        worldTheme.buttonVariants[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
