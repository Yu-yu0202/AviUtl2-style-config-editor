"use client";

import React, { useState } from "react";
import { SettingsCard, SettingsCardProp } from "./components/SettingsCard";
import { 
  Button, 
  Box, 
  Menu, 
  MenuItem, 
  ButtonGroup, 
  Tooltip
} from "@mui/material";
import { open, save } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';
import pkg from '../../package.json' assert { type: 'json' };
const version = pkg.version;
import './globals.css';
import { useLanguage } from './contexts/LanguageContext';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import type { TranslationKey } from './i18n/translations';

const fontItemsDef = [
  { labelKey: "defaultFontName" as TranslationKey, type: "text", internalID: "DefaultFamily", internalGroup: "Font" },
  { labelKey: "controlFont" as TranslationKey, type: "number", internalID: "Control", internalGroup: "Font" },
  { labelKey: "editControlFont" as TranslationKey, type: "text", internalID: "EditControl", internalGroup: "Font" },
  { labelKey: "previewTimeFont" as TranslationKey, type: "number", internalID: "PreviewTime", internalGroup: "Font" },
  { labelKey: "layerObjectFont" as TranslationKey, type: "number", internalID: "LayerObject", internalGroup: "Font" },
  { labelKey: "timeGaugeFont" as TranslationKey, type: "number", internalID: "TimeGauge", internalGroup: "Font" },
  { labelKey: "footerFont" as TranslationKey, type: "number", internalID: "Footer", internalGroup: "Font" },
  { labelKey: "textEditFont" as TranslationKey, type: "text", internalID: "TextEdit", internalGroup: "Font" },
  { labelKey: "logFont" as TranslationKey, type: "text", internalID: "Log", internalGroup: "Font" },
];

const colorItemsDef = [
  { labelKey: "backgroundColor" as TranslationKey, type: "color", internalID: "Background", internalGroup: "Color" },
  { labelKey: "windowBorderColor" as TranslationKey, type: "color", internalID: "WindowBorder", internalGroup: "Color" },
  { labelKey: "windowSeparatorColor" as TranslationKey, type: "color", internalID: "WindowSeparator", internalGroup: "Color" },
  { labelKey: "footerBackgroundColor" as TranslationKey, type: "color", internalID: "Footer", internalGroup: "Color" },
  { labelKey: "footerProgressColor" as TranslationKey, type: "color", internalID: "FooterProgress", internalGroup: "Color" },
  { labelKey: "groupingColor" as TranslationKey, type: "color", internalID: "Grouping", internalGroup: "Color" },
  { labelKey: "groupingHoverColor" as TranslationKey, type: "color", internalID: "GroupingHover", internalGroup: "Color" },
  { labelKey: "groupingSelectColor" as TranslationKey, type: "color", internalID: "GroupingSelect", internalGroup: "Color" },
  { labelKey: "titleHeaderColor" as TranslationKey, type: "color", internalID: "TitleHeader", internalGroup: "Color" },
  { labelKey: "borderSelectColor" as TranslationKey, type: "color", internalID: "BorderSelect", internalGroup: "Color" },
  { labelKey: "borderColor" as TranslationKey, type: "color", internalID: "Border", internalGroup: "Color" },
  { labelKey: "borderFocusColor" as TranslationKey, type: "color", internalID: "BorderFocus", internalGroup: "Color" },
  { labelKey: "textColor" as TranslationKey, type: "color", internalID: "Text", internalGroup: "Color" },
  { labelKey: "textDisableColor" as TranslationKey, type: "color", internalID: "TextDisable", internalGroup: "Color" },
  { labelKey: "textSelectColor" as TranslationKey, type: "color", internalID: "TextSelect", internalGroup: "Color" },
  { labelKey: "buttonBodyColor" as TranslationKey, type: "color", internalID: "ButtonBody", internalGroup: "Color" },
  { labelKey: "buttonBodyHoverColor" as TranslationKey, type: "color", internalID: "ButtonBodyHover", internalGroup: "Color" },
  { labelKey: "buttonBodyPressColor" as TranslationKey, type: "color", internalID: "ButtonBodyPress", internalGroup: "Color" },
  { labelKey: "buttonBodyDisableColor" as TranslationKey, type: "color", internalID: "ButtonBodyDisable", internalGroup: "Color" },
  { labelKey: "buttonBodySelectColor" as TranslationKey, type: "color", internalID: "ButtonBodySelect", internalGroup: "Color" },
  { labelKey: "sliderColor" as TranslationKey, type: "color", internalID: "SliderCursor", internalGroup: "Color" },
  { labelKey: "trackBarRangeColor" as TranslationKey, type: "color", internalID: "TrackBarRange", internalGroup: "Color" },
  { labelKey: "zoomGaugeColor" as TranslationKey, type: "color", internalID: "ZoomGauge", internalGroup: "Color" },
  { labelKey: "zoomGaugeHoverColor" as TranslationKey, type: "color", internalID: "ZoomGaugeHover", internalGroup: "Color" },
  { labelKey: "zoomGaugeOffColor" as TranslationKey, type: "color", internalID: "ZoomGaugeOff", internalGroup: "Color" },
  { labelKey: "zoomGaugeOffHoverColor" as TranslationKey, type: "color", internalID: "ZoomGaugeOffHover", internalGroup: "Color" },
  { labelKey: "frameRangeSelectColor" as TranslationKey, type: "color", internalID: "FrameRangeSelect", internalGroup: "Color" },
  { labelKey: "frameRangeOutsideColor" as TranslationKey, type: "color", internalID: "FrameRangeOutside", internalGroup: "Color" },
  { labelKey: "frameCursorColor" as TranslationKey, type: "color", internalID: "FrameCursor", internalGroup: "Color" },
  { labelKey: "frameCursorWideColor" as TranslationKey, type: "color", internalID: "FrameCursorWide", internalGroup: "Color" },
  { labelKey: "playerCursorColor" as TranslationKey, type: "color", internalID: "PlayerCursor", internalGroup: "Color" },
  { labelKey: "guideLineColor" as TranslationKey, type: "color", internalID: "GuideLine", internalGroup: "Color" },
  { labelKey: "layerBackgroundColor" as TranslationKey, type: "color", internalID: "Layer", internalGroup: "Color" },
  { labelKey: "layerHeaderBackgroundColor" as TranslationKey, type: "color", internalID: "LayerHeader", internalGroup: "Color" },
  { labelKey: "layerHoverColor" as TranslationKey, type: "color", internalID: "LayerHover", internalGroup: "Color" },
  { labelKey: "layerDisableColor" as TranslationKey, type: "color", internalID: "LayerDisable", internalGroup: "Color" },
  { labelKey: "layerRangeBackgroundColor" as TranslationKey, type: "color", internalID: "LayerRange", internalGroup: "Color" },
  { labelKey: "layerRangeFrameColor" as TranslationKey, type: "color", internalID: "LayerRangeFrame", internalGroup: "Color" },
  { labelKey: "objectVideoColor" as TranslationKey, type: "color", internalID: "ObjectVideo", internalGroup: "Color" },
  { labelKey: "objectVideoSelectColor" as TranslationKey, type: "color", internalID: "ObjectVideoSelect", internalGroup: "Color" },
  { labelKey: "objectAudioColor" as TranslationKey, type: "color", internalID: "ObjectAudio", internalGroup: "Color" },
  { labelKey: "objectAudioSelectColor" as TranslationKey, type: "color", internalID: "ObjectAudioSelect", internalGroup: "Color" },
  { labelKey: "objectControlColor" as TranslationKey, type: "color", internalID: "ObjectControl", internalGroup: "Color" },
  { labelKey: "objectControlSelectColor" as TranslationKey, type: "color", internalID: "ObjectControlSelect", internalGroup: "Color" },
  { labelKey: "objectVideoFilterColor" as TranslationKey, type: "color", internalID: "ObjectVideoFilter", internalGroup: "Color" },
  { labelKey: "objectVideoFilterSelectColor" as TranslationKey, type: "color", internalID: "ObjectVideoFilterSelect", internalGroup: "Color" },
  { labelKey: "objectAudioFilterColor" as TranslationKey, type: "color", internalID: "ObjectAudioFilter", internalGroup: "Color" },
  { labelKey: "objectAudioFilterSelectColor" as TranslationKey, type: "color", internalID: "ObjectAudioFilterSelect", internalGroup: "Color" },
  { labelKey: "objectHoverColor" as TranslationKey, type: "color", internalID: "ObjectHover", internalGroup: "Color" },
  { labelKey: "objectFocusColor" as TranslationKey, type: "color", internalID: "ObjectFocus", internalGroup: "Color" },
  { labelKey: "objectSectionColor" as TranslationKey, type: "color", internalID: "ObjectSection", internalGroup: "Color" },
  { labelKey: "objectWaveformColor" as TranslationKey, type: "color", internalID: "ObjectWaveform", internalGroup: "Color" },
  { labelKey: "clippingObjectColor" as TranslationKey, type: "color", internalID: "ClippingObject", internalGroup: "Color" },
  { labelKey: "clippingObjectMaskColor" as TranslationKey, type: "color", internalID: "ClippingObjectMask", internalGroup: "Color" },
  { labelKey: "anchorColor" as TranslationKey, type: "color", internalID: "Anchor", internalGroup: "Color" },
  { labelKey: "anchorLineColor" as TranslationKey, type: "color", internalID: "AnchorLine", internalGroup: "Color" },
  { labelKey: "anchorInColor" as TranslationKey, type: "color", internalID: "AnchorIn", internalGroup: "Color" },
  { labelKey: "anchorOutColor" as TranslationKey, type: "color", internalID: "AnchorOut", internalGroup: "Color" },
  { labelKey: "anchorHoverColor" as TranslationKey, type: "color", internalID: "AnchorHover", internalGroup: "Color" },
  { labelKey: "anchorSelectColor" as TranslationKey, type: "color", internalID: "AnchorSelect", internalGroup: "Color" },
  { labelKey: "anchorEdgeColor" as TranslationKey, type: "color", internalID: "AnchorEdge", internalGroup: "Color" },
  { labelKey: "centerGroupColor" as TranslationKey, type: "color", internalID: "CenterGroup", internalGroup: "Color" },
  { labelKey: "handleXColor" as TranslationKey, type: "color", internalID: "HandleX", internalGroup: "Color" },
  { labelKey: "handleYColor" as TranslationKey, type: "color", internalID: "HandleY", internalGroup: "Color" },
  { labelKey: "handleZColor" as TranslationKey, type: "color", internalID: "HandleZ", internalGroup: "Color" },
  { labelKey: "handleXHoverColor" as TranslationKey, type: "color", internalID: "HandleXHover", internalGroup: "Color" },
  { labelKey: "handleYHoverColor" as TranslationKey, type: "color", internalID: "HandleYHover", internalGroup: "Color" },
  { labelKey: "handleZHoverColor" as TranslationKey, type: "color", internalID: "HandleZHover", internalGroup: "Color" },
  { labelKey: "outsideDisplayColor" as TranslationKey, type: "color", internalID: "OutsideDisplay", internalGroup: "Color" },
];

const layoutItemsDef = [
  { labelKey: "windowSeparatorSize" as TranslationKey, type: "number", internalID: "WindowSeparatorSize", internalGroup: "Layout" },
  { labelKey: "scrollBarSize" as TranslationKey, type: "number", internalID: "ScrollBarSize", internalGroup: "Layout" },
  { labelKey: "footerHeight" as TranslationKey, type: "number", internalID: "FooterHeight", internalGroup: "Layout" },
  { labelKey: "titleHeaderHeight" as TranslationKey, type: "number", internalID: "TitleHeaderHeight", internalGroup: "Layout" },
  { labelKey: "timeGaugeHeight" as TranslationKey, type: "number", internalID: "TimeGaugeHeight", internalGroup: "Layout" },
  { labelKey: "layerHeight" as TranslationKey, type: "number", internalID: "LayerHeight", internalGroup: "Layout" },
  { labelKey: "layerHeaderWidth" as TranslationKey, type: "number", internalID: "LayerHeaderWidth", internalGroup: "Layout" },
  { labelKey: "settingItemHeaderWidth" as TranslationKey, type: "number", internalID: "SettingItemHeaderWidth", internalGroup: "Layout" },
  { labelKey: "settingItemHeight" as TranslationKey, type: "number", internalID: "SettingItemHeight", internalGroup: "Layout" },
  { labelKey: "settingItemMarginWidth" as TranslationKey, type: "number", internalID: "SettingItemMarginWidth", internalGroup: "Layout" },
  { labelKey: "settingHeaderHeight" as TranslationKey, type: "number", internalID: "SettingHeaderHeight", internalGroup: "Layout" },
  { labelKey: "playerControlHeight" as TranslationKey, type: "number", internalID: "PlayerControlHeight", internalGroup: "Layout" },
  { labelKey: "explorerHeaderHeight" as TranslationKey, type: "number", internalID: "ExplorerHeaderHeight", internalGroup: "Layout" },
  { labelKey: "explorerWindowNum" as TranslationKey, type: "number", internalID: "ExplorerWindowNum", internalGroup: "Layout" },
  { labelKey: "listItemHeight" as TranslationKey, type: "number", internalID: "ListItemHeight", internalGroup: "Layout" },
];

const formatItemsDef = [
  { labelKey: "footerLeftFormat" as TranslationKey, type: "text", internalID: "FooterLeft", internalGroup: "Format" },
  { labelKey: "footerRightFormat" as TranslationKey, type: "text", internalID: "FooterRight", internalGroup: "Format" },
];

function formatConfigForSave(confData: Record<string, Record<string, string>>): string {
  const order = ["Font", "Color", "Layout", "Format"];
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
  const [confData, setConfData] = useState<Record<string, Record<string, string>>>({});
  const [fontItems, setFontItems] = useState<SettingsCardProp[]>([]);
  const [colorItems, setColorItems] = useState<SettingsCardProp[]>([]);
  const [layoutItems, setLayoutItems] = useState<SettingsCardProp[]>([]);
  const [formatItems, setFormatItems] = useState<SettingsCardProp[]>([]);
  const [currentFilePath, setCurrentFilePath] = useState<string>("");
  const [defaultConfig, setDefaultConfig] = useState<Record<string, Record<string, string>>>({});
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const loadConfig = async (filePath?: string) => {
    if (!filePath) return;
    try {
      const content = await invoke<string>('read_config_file', { path: filePath });
      const confJson = await invoke('parse_config', { content });
      setConfData(confJson as Record<string, Record<string, string>>);
      const data = confJson as Record<string, Record<string, string>>;
      setFontItems(fontItemsDef.map(def => ({ ...def, value: data.Font?.[def.internalID] ?? "", type: def.type as "number" | "text" | "color" | "info" })));
      setColorItems(colorItemsDef.map(def => ({ ...def, value: data.Color?.[def.internalID] ?? "", type: def.type as "number" | "text" | "color" | "info" })));
      setLayoutItems(layoutItemsDef.map(def => ({ ...def, value: data.Layout?.[def.internalID] ?? "", type: def.type as "number" | "text" | "color" | "info" })));
      setFormatItems(formatItemsDef.map(def => ({ ...def, value: data.Format?.[def.internalID] ?? "", type: def.type as "number" | "text" | "color" | "info" })));

      if (!defaultConfig.Font) {
        const defaultConfigStr = await invoke<string>('get_default_config');
        const defaultConfJson = await invoke('parse_config', { content: defaultConfigStr });
        setDefaultConfig(defaultConfJson as Record<string, Record<string, string>>);
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
        [id]: value
      }
    }));

    const updateItems = (
      _items: SettingsCardProp[],
      setItems: React.Dispatch<React.SetStateAction<SettingsCardProp[]>>
    ) => {
      setItems(prev => prev.map(item => 
        item.internalGroup === group && item.internalID === id 
          ? { ...item, value } 
          : item
      ));
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
      setItems(prev => prev.map(item => 
        item.internalGroup === group && item.internalID === id 
          ? { ...item, isSelected: selected } 
          : item
      ));
    };

    if (group === 'Font') updateItems(setFontItems);
    else if (group === 'Color') updateItems(setColorItems);
    else if (group === 'Layout') updateItems(setLayoutItems);
    else if (group === 'Format') updateItems(setFormatItems);
  };

  const saveConfig = async (showAlert: boolean = true, data?: Record<string, Record<string, string>>) => {
    if (!currentFilePath) {
      alert(t('noFileSelected'));
      return;
    }
    try {
      const configData = data || confData;
      const content = `; style.conf 
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
        filters: [{ name: 'Config', extensions: ['conf'] }]
      });
      if (filePath) {
        const content = `; style.conf 
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
      const content = `; style.conf
; Last edited by AviUtl2 Style.conf Editor at ${new Date().toISOString()}
; AviUtl2 Style.conf Editor v${version} by Yu-yu0202
` + formatConfigForSave(confData);
      const programDataPath = await invoke('get_program_data_path');
      const targetPath = `${programDataPath}\\aviutl2\\style.conf`;
      await invoke('write_config_file', { path: targetPath, content });
      alert(t('configSaved'));
    } catch(e: unknown) {
      console.error('設定の保存に失敗しました:', e);
      alert(t('configSaveFailed'));
    }
  }
  const createBackup = async () => {
    if (!currentFilePath) {
      alert(t('noFileSelected'));
      return;
    }
    try {
      const backupPath = currentFilePath + '.bak';
      const content = `; style.conf backup
; Last edited by AviUtl2 Style.conf Editor at ${new Date().toISOString()}
; AviUtl2 Style.conf Editor v${version} by Yu-yu0202
` + formatConfigForSave(confData);
      await invoke('write_config_file', { path: backupPath, content });
      alert(t('backupCreated'));
    } catch (error) {
      console.error('バックアップの作成に失敗しました:', error);
      alert(t('backupCreateFailed'));
    }
  }
  const restoreBackup = async () => {
    if (!currentFilePath) {
      alert(t('noFileSelected'));
      return;
    }
    try {
      const backupPath = currentFilePath + '.bak';
      const content = await invoke<string>('read_config_file', { path: backupPath });
      const confJson = await invoke('parse_config', { content });
      setConfData(confJson as Record<string, Record<string, string>>);
      const data = confJson as Record<string, Record<string, string>>;
      setFontItems(fontItemsDef.map(def => ({ ...def, value: data.Font?.[def.internalID] ?? "", type: def.type as "number" | "text" | "color" | "info" })));
      setColorItems(colorItemsDef.map(def => ({ ...def, value: data.Color?.[def.internalID] ?? "", type: def.type as "number" | "text" | "color" | "info" })));
      setLayoutItems(layoutItemsDef.map(def => ({ ...def, value: data.Layout?.[def.internalID] ?? "", type: def.type as "number" | "text" | "color" | "info" })));
      setFormatItems(formatItemsDef.map(def => ({ ...def, value: data.Format?.[def.internalID] ?? "", type: def.type as "number" | "text" | "color" | "info" })));
      await invoke('write_config_file', { path: currentFilePath, content });
      setCurrentFilePath(currentFilePath);
      alert(t('backupRestored'));
    } catch (error) {
      console.error('バックアップからの復元に失敗しました:', error);
      alert(t('backupRestoreFailed'));
    }
  }

  const selectFileAndLoad = async () => {
    try {
      const filePath = await open({
        multiple: false,
        filters: [{ name: 'Config', extensions: ['conf'] }]
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
      const defaultConfig = `; style.conf default setting\n; Last edited by AviUtl2 Style.conf Editor at ${new Date().toISOString()}\n; AviUtl2 Style.conf Editor v${version} by Yu-yu0202\n\n` + await invoke<string>('get_default_config');
      const defaultConfJson = await invoke('parse_config', { content: defaultConfig });
      await invoke('write_config_file', { path: currentFilePath, content: defaultConfig });
      setConfData(defaultConfJson as Record<string, Record<string, string>>);
      const data = defaultConfJson as Record<string, Record<string, string>>;
      setFontItems(fontItemsDef.map(def => ({ ...def, value: data.Font?.[def.internalID] ?? "", type: def.type as "number" | "text" | "color" | "info" })));
      setColorItems(colorItemsDef.map(def => ({ ...def, value: data.Color?.[def.internalID] ?? "", type: def.type as "number" | "text" | "color" | "info" })));
      setLayoutItems(layoutItemsDef.map(def => ({ ...def, value: data.Layout?.[def.internalID] ?? "", type: def.type as "number" | "text" | "color" | "info" })));
      setFormatItems(formatItemsDef.map(def => ({ ...def, value: data.Format?.[def.internalID] ?? "", type: def.type as "number" | "text" | "color" | "info" })));
      alert(t('defaultConfigOverwritten'));
    } catch(e: unknown) {
      console.error('既定の設定の取得に失敗しました:', e);
      alert(t('defaultConfigFailed'));
    }
  }

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
          const defaultValue = defaultConfig[group]?.[item.internalID] ?? "";
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' }}>{t('title')}</h1>
      
      {/* 言語切り替え */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mb: 2, 
        gap: 2,
        alignItems: 'center'
      }}>
        <LanguageSwitcher />
      </Box>
      
      {/* メインボタングループ */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mb: 3, 
        gap: 2,
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center'
      }}>
        <ButtonGroup variant="contained" size="large">
          <Tooltip title={t('saveConfigTooltip')}>
            <Button
              color="primary"
              onClick={() => saveConfig()}
            >
              {t('saveConfig')}
            </Button>
          </Tooltip>
          <Tooltip title={t('saveAsTooltip')}>
            <Button
              color="primary"
              onClick={saveAsConfig}
            >
              {t('saveAs')}
            </Button>
          </Tooltip>
          <Tooltip title={t('saveToProgramDataTooltip')}>
            <Button
              color="primary"
              onClick={saveConfigToProgramData}
            >
              {t('saveToProgramData')}
            </Button>
          </Tooltip>
          <Tooltip title={t('createBackupTooltip')}>
            <Button
              color="primary"
              onClick={createBackup}
            >
              {t('createBackup')}
            </Button>
          </Tooltip>
        </ButtonGroup>
        
        <ButtonGroup variant="contained">
          <Button
            color="primary"
            onClick={selectFileAndLoad}
            id="select-file-button"
          >
            {t('openFile')}
          </Button>
          <Button
            color="primary"
            onClick={handleMenuOpen}
          >
            {t('otherOperations')}
          </Button>
        </ButtonGroup>
      </Box>

      {/* 現在のファイルパス表示 */}
      {currentFilePath && (
        <Box
          sx={{
            textAlign: 'center',
            mb: 2,
            p: 1,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            boxShadow: 1,
            color: 'text.primary',
            wordBreak: 'break-all',
            fontSize: '0.9rem',
          }}
        >
          {t('currentFile')} {currentFilePath}
        </Box>
      )}

      {/* ドロップダウンメニュー */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => { overwriteDefaultConfig(); handleMenuClose(); }}>
          {t('overwriteDefaultConfig')}
        </MenuItem>
        <MenuItem onClick={() => { resetSelectedItems(); handleMenuClose(); }}>
          {t('resetSelectedItems')}
        </MenuItem>
        <MenuItem onClick={() => { restoreBackup(); handleMenuClose(); }}>
          {t('restoreBackup')}
        </MenuItem>
      </Menu>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px",
          justifyItems: "center",
          alignItems: "start",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
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
        <SettingsCard 
          title={t('colorSettings')} 
          items={colorItems} 
          onItemChange={handleItemChange} 
          onItemSelect={handleItemSelect}
          getLabel={t}
        />
      </div>
    </Box>
  );
};

export default App;
