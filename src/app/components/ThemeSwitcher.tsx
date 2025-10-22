'use client';

import React, { useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Sun, Moon } from 'lucide-react';

// Utility: check real current theme
function getTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

// Utility: apply theme by setting/removing data-theme
function applyTheme(theme: 'light' | 'dark') {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
  }
}

export const ThemeSwitcher: React.FC = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>(getTheme());

  // Apply theme to DOM and save to storage
  const doApply = useCallback((newTheme: 'light' | 'dark') => {
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('app:theme-change', { detail: newTheme })
      );
    }
  }, []);

  // On mount, set initial theme (and if system prefers dark, use it)
  useEffect(() => {
    const current = getTheme();
    doApply(current);

    // Listen OS color scheme change if user never set manually
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const mediaListener = () => {
      const saved = localStorage.getItem('theme');
      if (!saved) {
        const sys = media.matches ? 'dark' : 'light';
        doApply(sys);
      }
    };
    media.addEventListener('change', mediaListener);

    return () => media.removeEventListener('change', mediaListener);
  }, [doApply]);

  // Toggle theme manually (and persist)
  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    doApply(next);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={theme === 'dark' ? 'secondary' : 'default'}
            size="sm"
            onClick={toggleTheme}
            className="min-w-[40px]"
            aria-label={
              theme === 'dark'
                ? 'ライトモードに切り替え'
                : 'ダークモードに切り替え'
            }
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {theme === 'dark'
              ? 'ライトモードに切り替え'
              : 'ダークモードに切り替え'}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
