'use client';

import React from 'react';
import { Theme } from '@radix-ui/themes';

type ThemeMode = 'light' | 'dark';

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export default function RadixThemeProvider({
  children,
  asChild,
}: {
  children: React.ReactNode;
  asChild?: boolean;
}) {
  const [appearance, setAppearance] = React.useState<ThemeMode>('light');
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    // Set the correct theme after hydration
    setIsHydrated(true);
    setAppearance(getInitialTheme());

    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as ThemeMode | undefined;
      if (detail === 'light' || detail === 'dark') {
        setAppearance(detail);
      } else {
        setAppearance(getInitialTheme());
      }
    };
    window.addEventListener('app:theme-change', handler as EventListener);
    return () =>
      window.removeEventListener('app:theme-change', handler as EventListener);
  }, []);

  return (
    <Theme
      accentColor="iris"
      radius="small"
      appearance={appearance}
      asChild={asChild}
      suppressHydrationWarning={!isHydrated}
    >
      {children}
    </Theme>
  );
}
