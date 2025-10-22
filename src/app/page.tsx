"use client";

import React, { useState } from "react";
import { SettingsCard, SettingsCardProp } from "./components/SettingsCard";
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { open, save } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';
import {
  Save,
  FolderOpen,
  MoreHorizontal,
  FileText,
  Download,
  Upload,
  RotateCcw,
  Archive,
  RefreshCw,
} from 'lucide-react';
import pkg from '../../package.json' assert { type: 'json' };
const version = pkg.version;
import './globals.css';
import { useLanguage } from './contexts/LanguageContext';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { ItemsDef } from './constants/ItemsDef';

const fontItemsDef = ItemsDef.fontItemsDef;
const colorItemsDef = ItemsDef.colorItemsDef;
const layoutItemsDef = ItemsDef.layoutItemsDef;
const formatItemsDef = ItemsDef.formatItemsDef;

function formatConfigForSave(
  confData: Record<string, Record<string, string>>
): string {
  const order = ['Font', 'Color', 'Layout', 'Format'];
  return order
    .map(group => {
      const groupData = confData[group];
      if (!groupData) return '';
      const section = `[${group}]`;
      const body = Object.entries(groupData)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');
      return `${section}\n${body}`;
    })
    .filter(Boolean)
    .join('\n\n');
}

const App: React.FC = () => {
  const { t } = useLanguage();
  const [confData, setConfData] = useState<
    Record<string, Record<string, string>>
  >({});
  const [fontItems, setFontItems] = useState<SettingsCardProp[]>([]);
  const [colorItems, setColorItems] = useState<SettingsCardProp[]>([]);
  const [layoutItems, setLayoutItems] = useState<SettingsCardProp[]>([]);
  const [formatItems, setFormatItems] = useState<SettingsCardProp[]>([]);
  const [currentFilePath, setCurrentFilePath] = useState<string>('');
  const [defaultConfig, setDefaultConfig] = useState<
    Record<string, Record<string, string>>
  >({});

  const loadConfig = async (filePath?: string) => {
    if (!filePath) return;
    try {
      const content = await invoke<string>('read_config_file', {
        path: filePath,
      });
      const confJson = await invoke('parse_config', { content });
      setConfData(confJson as Record<string, Record<string, string>>);
      const data = confJson as Record<string, Record<string, string>>;
      setFontItems(
        fontItemsDef.map(def => ({
          ...def,
          value: data.Font?.[def.internalID] ?? '',
          type: def.type as 'number' | 'text' | 'color' | 'info',
        }))
      );
      setColorItems(
        colorItemsDef.map(def => ({
          ...def,
          value: data.Color?.[def.internalID] ?? '',
          type: def.type as 'number' | 'text' | 'color' | 'info',
        }))
      );
      setLayoutItems(
        layoutItemsDef.map(def => ({
          ...def,
          value: data.Layout?.[def.internalID] ?? '',
          type: def.type as 'number' | 'text' | 'color' | 'info',
        }))
      );
      setFormatItems(
        formatItemsDef.map(def => ({
          ...def,
          value: data.Format?.[def.internalID] ?? '',
          type: def.type as 'number' | 'text' | 'color' | 'info',
        }))
      );

      if (!defaultConfig.Font) {
        const defaultConfigStr = await invoke<string>('get_default_config');
        const defaultConfJson = await invoke('parse_config', {
          content: defaultConfigStr,
        });
        setDefaultConfig(
          defaultConfJson as Record<string, Record<string, string>>
        );
      }
    } catch (error) {
      console.error('設定の読み込みに失敗しました:', error);
    }
  };

  const handleItemChange = (group: string, id: string, value: string) => {
    setConfData(prev => ({
      ...prev,
      [group]: {
        ...prev[group],
        [id]: value,
      },
    }));

    const updateItems = (
      _items: SettingsCardProp[],
      setItems: React.Dispatch<React.SetStateAction<SettingsCardProp[]>>
    ) => {
      setItems(prev =>
        prev.map(item =>
          item.internalGroup === group && item.internalID === id
            ? { ...item, value }
            : item
        )
      );
    };

    if (group === 'Font') updateItems(fontItems, setFontItems);
    else if (group === 'Color') updateItems(colorItems, setColorItems);
    else if (group === 'Layout') updateItems(layoutItems, setLayoutItems);
    else if (group === 'Format') updateItems(formatItems, setFormatItems);
  };

  const handleItemSelect = (group: string, id: string, selected: boolean) => {
    const updateItems = (
      setItems: React.Dispatch<React.SetStateAction<SettingsCardProp[]>>
    ) => {
      setItems(prev =>
        prev.map(item =>
          item.internalGroup === group && item.internalID === id
            ? { ...item, isSelected: selected }
            : item
        )
      );
    };

    if (group === 'Font') updateItems(setFontItems);
    else if (group === 'Color') updateItems(setColorItems);
    else if (group === 'Layout') updateItems(setLayoutItems);
    else if (group === 'Format') updateItems(setFormatItems);
  };

  const saveConfig = async (
    showAlert: boolean = true,
    data?: Record<string, Record<string, string>>
  ) => {
    if (!currentFilePath) {
      alert(t('noFileSelected'));
      return;
    }
    try {
      const configData = data || confData;
      const content =
        `; style.conf 
; Last edited by AviUtl2 Style.conf Editor at ${new Date().toISOString()}
; AviUtl2 Style.conf Editor v${version} by Yu-yu0202

` + formatConfigForSave(configData);

      await invoke('write_config_file', { path: currentFilePath, content });
      if (showAlert) {
        alert(t('configSaved'));
      }
    } catch (error) {
      console.error('設定の保存に失敗しました:', error);
      alert('設定の保存に失敗しました。');
    }
  };

  const saveAsConfig = async () => {
    try {
      const filePath = await save({
        filters: [{ name: 'Config', extensions: ['conf'] }],
      });
      if (filePath) {
        const content =
          `; style.conf 
; Last edited by AviUtl2 Style.conf Editor at ${new Date().toISOString()}
; AviUtl2 Style.conf Editor v${version} by Yu-yu0202

` + formatConfigForSave(confData);

        await invoke('write_config_file', { path: filePath, content });
        setCurrentFilePath(filePath);
        alert(t('configSaved'));
      }
    } catch (error) {
      console.error('設定の保存に失敗しました:', error);
      alert(t('configSaveFailed'));
    }
  };

  const saveConfigToProgramData = async () => {
    if (!currentFilePath) {
      alert(t('noFileSelected'));
      return;
    }
    try {
      const content =
        `; style.conf
; Last edited by AviUtl2 Style.conf Editor at ${new Date().toISOString()}
; AviUtl2 Style.conf Editor v${version} by Yu-yu0202
` + formatConfigForSave(confData);
      const programDataPath = await invoke('get_program_data_path');
      const targetPath = `${programDataPath}\\aviutl2\\style.conf`;
      await invoke('write_config_file', { path: targetPath, content });
      alert(t('configSaved'));
    } catch (e: unknown) {
      console.error('設定の保存に失敗しました:', e);
      alert(t('configSaveFailed'));
    }
  };
  const createBackup = async () => {
    if (!currentFilePath) {
      alert(t('noFileSelected'));
      return;
    }
    try {
      const backupPath = currentFilePath + '.bak';
      const content =
        `; style.conf backup
; Last edited by AviUtl2 Style.conf Editor at ${new Date().toISOString()}
; AviUtl2 Style.conf Editor v${version} by Yu-yu0202
` + formatConfigForSave(confData);
      await invoke('write_config_file', { path: backupPath, content });
      alert(t('backupCreated'));
    } catch (error) {
      console.error('バックアップの作成に失敗しました:', error);
      alert(t('backupCreateFailed'));
    }
  };
  const restoreBackup = async () => {
    if (!currentFilePath) {
      alert(t('noFileSelected'));
      return;
    }
    try {
      const backupPath = currentFilePath + '.bak';
      const content = await invoke<string>('read_config_file', {
        path: backupPath,
      });
      const confJson = await invoke('parse_config', { content });
      setConfData(confJson as Record<string, Record<string, string>>);
      const data = confJson as Record<string, Record<string, string>>;
      setFontItems(
        fontItemsDef.map(def => ({
          ...def,
          value: data.Font?.[def.internalID] ?? '',
          type: def.type as 'number' | 'text' | 'color' | 'info',
        }))
      );
      setColorItems(
        colorItemsDef.map(def => ({
          ...def,
          value: data.Color?.[def.internalID] ?? '',
          type: def.type as 'number' | 'text' | 'color' | 'info',
        }))
      );
      setLayoutItems(
        layoutItemsDef.map(def => ({
          ...def,
          value: data.Layout?.[def.internalID] ?? '',
          type: def.type as 'number' | 'text' | 'color' | 'info',
        }))
      );
      setFormatItems(
        formatItemsDef.map(def => ({
          ...def,
          value: data.Format?.[def.internalID] ?? '',
          type: def.type as 'number' | 'text' | 'color' | 'info',
        }))
      );
      await invoke('write_config_file', { path: currentFilePath, content });
      setCurrentFilePath(currentFilePath);
      alert(t('backupRestored'));
    } catch (error) {
      console.error('バックアップからの復元に失敗しました:', error);
      alert(t('backupRestoreFailed'));
    }
  };

  const selectFileAndLoad = async () => {
    try {
      const filePath = await open({
        multiple: false,
        filters: [{ name: 'Config', extensions: ['conf'] }],
      });
      if (filePath) {
        setCurrentFilePath(filePath as string);
        await loadConfig(filePath as string);
      }
    } catch (error) {
      console.error('ファイルの選択に失敗しました:', error);
    }
  };

  const overwriteDefaultConfig = async () => {
    try {
      const defaultConfig =
        `; style.conf default setting\n; Last edited by AviUtl2 Style.conf Editor at ${new Date().toISOString()}\n; AviUtl2 Style.conf Editor v${version} by Yu-yu0202\n\n` +
        (await invoke<string>('get_default_config'));
      const defaultConfJson = await invoke('parse_config', {
        content: defaultConfig,
      });
      await invoke('write_config_file', {
        path: currentFilePath,
        content: defaultConfig,
      });
      setConfData(defaultConfJson as Record<string, Record<string, string>>);
      const data = defaultConfJson as Record<string, Record<string, string>>;
      setFontItems(
        fontItemsDef.map(def => ({
          ...def,
          value: data.Font?.[def.internalID] ?? '',
          type: def.type as 'number' | 'text' | 'color' | 'info',
        }))
      );
      setColorItems(
        colorItemsDef.map(def => ({
          ...def,
          value: data.Color?.[def.internalID] ?? '',
          type: def.type as 'number' | 'text' | 'color' | 'info',
        }))
      );
      setLayoutItems(
        layoutItemsDef.map(def => ({
          ...def,
          value: data.Layout?.[def.internalID] ?? '',
          type: def.type as 'number' | 'text' | 'color' | 'info',
        }))
      );
      setFormatItems(
        formatItemsDef.map(def => ({
          ...def,
          value: data.Format?.[def.internalID] ?? '',
          type: def.type as 'number' | 'text' | 'color' | 'info',
        }))
      );
      alert(t('defaultConfigOverwritten'));
    } catch (e: unknown) {
      console.error('既定の設定の取得に失敗しました:', e);
      alert(t('defaultConfigFailed'));
    }
  };

  const resetSelectedItems = async () => {
    if (!defaultConfig.Font) {
      alert(t('defaultConfigNotLoaded'));
      return;
    }

    const newConfData = { ...confData };

    const updateSelectedItems = (
      items: SettingsCardProp[],
      setItems: React.Dispatch<React.SetStateAction<SettingsCardProp[]>>,
      group: string
    ) => {
      const newItems = items.map(item => {
        if (item.isSelected) {
          const defaultValue = defaultConfig[group]?.[item.internalID] ?? '';
          if (!newConfData[group]) {
            newConfData[group] = {};
          }
          newConfData[group][item.internalID] = defaultValue;
          return { ...item, value: defaultValue };
        }
        return item;
      });
      setItems(newItems);
    };

    updateSelectedItems(fontItems, setFontItems, 'Font');
    updateSelectedItems(colorItems, setColorItems, 'Color');
    updateSelectedItems(layoutItems, setLayoutItems, 'Layout');
    updateSelectedItems(formatItems, setFormatItems, 'Format');

    setConfData(newConfData);

    await saveConfig(false, newConfData);
    alert(t('defaultConfigOverwritten'));
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* ヘッダー */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col items-center space-y-4">
              <h1 className="text-3xl font-bold text-center text-primary">
                {t('title')}
              </h1>

              {/* 言語切り替えとテーマ切り替え */}
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="container mx-auto px-6 py-8">
          {/* アクションバー */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  onClick={() => saveConfig()}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {t('saveConfig')}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('saveConfigTooltip')}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={saveAsConfig}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {t('saveAs')}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('saveAsTooltip')}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={saveConfigToProgramData}
                  className="flex items-center gap-2 bg-primary"
                >
                  <FileText className="h-4 w-4" />
                  {t('saveToProgramData')}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('saveToProgramDataTooltip')}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={createBackup}
                  className="flex items-center gap-2 bg-primary"
                >
                  <Archive className="h-4 w-4" />
                  {t('createBackup')}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('createBackupTooltip')}</p>
              </TooltipContent>
            </Tooltip>

            <Button
              variant="secondary"
              onClick={selectFileAndLoad}
              className="flex items-center gap-2 bg-primary"
            >
              <FolderOpen className="h-4 w-4" />
              {t('openFile')}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="flex items-center gap-2">
                  <MoreHorizontal className="h-4 w-4" />
                  {t('otherOperations')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={overwriteDefaultConfig}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t('overwriteDefaultConfig')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={resetSelectedItems}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {t('resetSelectedItems')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={restoreBackup}>
                  <Upload className="h-4 w-4 mr-2" />
                  {t('restoreBackup')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 現在のファイルパス表示 */}
          {currentFilePath && (
            <div className="mb-8 p-4 bg-card border rounded-lg shadow-sm">
              <p className="text-sm text-muted-foreground break-all">
                <span className="font-medium">{t('currentFile')}</span>{' '}
                {currentFilePath}
              </p>
            </div>
          )}

          {/* 設定カード */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <SettingsCard
                title={t('fontSettings')}
                items={fontItems}
                onItemChange={handleItemChange}
                onItemSelect={handleItemSelect}
                getLabel={t}
              />
              <SettingsCard
                title={t('layoutSettings')}
                items={layoutItems}
                onItemChange={handleItemChange}
                onItemSelect={handleItemSelect}
                getLabel={t}
              />
              <SettingsCard
                title={t('formatSettings')}
                items={formatItems}
                onItemChange={handleItemChange}
                onItemSelect={handleItemSelect}
                getLabel={t}
              />
            </div>
            <div className="flex justify-center">
              <SettingsCard
                title={t('colorSettings')}
                items={colorItems}
                onItemChange={handleItemChange}
                onItemSelect={handleItemSelect}
                getLabel={t}
              />
            </div>
          </div>
        </main>

        {/* フッター */}
        <footer className="border-t bg-card mt-16">
          <div className="container mx-auto px-6 py-4">
            <p className="text-center text-sm text-muted-foreground">
              AviUtl2 Style.conf Editor v{version} by Yu-yu0202
            </p>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
};

export default App;
