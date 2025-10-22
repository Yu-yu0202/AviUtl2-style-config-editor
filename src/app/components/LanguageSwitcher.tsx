"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLanguage } from '../contexts/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <TooltipProvider>
      <div className="flex gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={language === 'ja' ? 'secondary' : 'default'}
              size="sm"
              onClick={() => setLanguage('ja')}
              className="min-w-[60px]"
            >
              日本語
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('japanese')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={language === 'en' ? 'secondary' : 'default'}
              size="sm"
              onClick={() => setLanguage('en')}
              className="min-w-[60px]"
            >
              English
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('english')}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
