"use client";

import React from 'react';
import { Button, ButtonGroup, Tooltip } from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <ButtonGroup variant="outlined" size="small">
      <Tooltip title={t('japanese')}>
        <Button
          variant={language === 'ja' ? 'contained' : 'outlined'}
          onClick={() => setLanguage('ja')}
          sx={{ minWidth: '60px' }}
        >
          日本語
        </Button>
      </Tooltip>
      <Tooltip title={t('english')}>
        <Button
          variant={language === 'en' ? 'contained' : 'outlined'}
          onClick={() => setLanguage('en')}
          sx={{ minWidth: '60px' }}
        >
          English
        </Button>
      </Tooltip>
    </ButtonGroup>
  );
};
