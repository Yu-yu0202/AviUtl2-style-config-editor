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

const fontItemsDef = [
  { label: "標準のフォント名", type: "text", internalID: "DefaultFamily", internalGroup: "Font" },
  { label: "標準のコントロールのフォント", type: "number", internalID: "Control", internalGroup: "Font" },
  { label: "エディットコントロールのフォント", type: "text", internalID: "EditControl", internalGroup: "Font" },
  { label: "プレビュー時間表示のフォント", type: "number", internalID: "PreviewTime", internalGroup: "Font" },
  { label: "レイヤー・オブジェクト編集部分のフォント", type: "number", internalID: "LayerObject", internalGroup: "Font" },
  { label: "フレーム時間ゲージのフォント", type: "number", internalID: "TimeGauge", internalGroup: "Font" },
  { label: "フッターのフォント", type: "number", internalID: "Footer", internalGroup: "Font" },
  { label: "テキスト編集のフォント", type: "text", internalID: "TextEdit", internalGroup: "Font" },
  { label: "ログのフォント", type: "text", internalID: "Log", internalGroup: "Font" },
];

const colorItemsDef = [
  { label: "背景の色", type: "color", internalID: "Background", internalGroup: "Color" },
  { label: "ウィンドウ枠線の色", type: "color", internalID: "WindowBorder", internalGroup: "Color" },
  { label: "ウィンドウ間の背景の色", type: "color", internalID: "WindowSeparator", internalGroup: "Color" },
  { label: "フッターの背景の色", type: "color", internalID: "Footer", internalGroup: "Color" },
  { label: "フッターの進捗の色", type: "color", internalID: "FooterProgress", internalGroup: "Color" },
  { label: "グループの色", type: "color", internalID: "Grouping", internalGroup: "Color" },
  { label: "グループの色 (ホバー時)", type: "color", internalID: "GroupingHover", internalGroup: "Color" },
  { label: "グループ選択時の色", type: "color", internalID: "GroupingSelect", internalGroup: "Color" },
  { label: "タイトルヘッダー背景の色", type: "color", internalID: "TitleHeader", internalGroup: "Color" },
  { label: "選択枠線の色", type: "color", internalID: "BorderSelect", internalGroup: "Color" },
  { label: "枠線の色", type: "color", internalID: "Border", internalGroup: "Color" },
  { label: "フォーカス枠線の色", type: "color", internalID: "BorderFocus", internalGroup: "Color" },
  { label: "テキストの色", type: "color", internalID: "Text", internalGroup: "Color" },
  { label: "テキスト無効の色", type: "color", internalID: "TextDisable", internalGroup: "Color" },
  { label: "テキスト選択の色", type: "color", internalID: "TextSelect", internalGroup: "Color" },
  { label: "ボタン背景の色", type: "color", internalID: "ButtonBody", internalGroup: "Color" },
  { label: "ボタン背景の色 (ホバー時)", type: "color", internalID: "ButtonBodyHover", internalGroup: "Color" },
  { label: "ボタン背景の色 (押下時)", type: "color", internalID: "ButtonBodyPress", internalGroup: "Color" },
  { label: "ボタン背景の色 (無効時)", type: "color", internalID: "ButtonBodyDisable", internalGroup: "Color" },
  { label: "ボタン背景の色 (選択時)", type: "color", internalID: "ButtonBodySelect", internalGroup: "Color" },
  { label: "スライダーの色", type: "color", internalID: "SliderCursor", internalGroup: "Color" },
  { label: "トラックバー範囲の色", type: "color", internalID: "TrackBarRange", internalGroup: "Color" },
  { label: "ズームゲージの色", type: "color", internalID: "ZoomGauge", internalGroup: "Color" },
  { label: "ズームゲージホバーの色", type: "color", internalID: "ZoomGaugeHover", internalGroup: "Color" },
  { label: "ズームゲージオフの色", type: "color", internalID: "ZoomGaugeOff", internalGroup: "Color" },
  { label: "ズームゲージオフホバーの色", type: "color", internalID: "ZoomGaugeOffHover", internalGroup: "Color" },
  { label: "フレーム選択範囲の色", type: "color", internalID: "FrameRangeSelect", internalGroup: "Color" },
  { label: "フレーム選択範囲外の色", type: "color", internalID: "FrameRangeOutside", internalGroup: "Color" },
  { label: "フレームカーソルの色", type: "color", internalID: "FrameCursor", internalGroup: "Color" },
  { label: "フレームカーソルワイドの色", type: "color", internalID: "FrameCursorWide", internalGroup: "Color" },
  { label: "プレイヤーカーソルの色", type: "color", internalID: "PlayerCursor", internalGroup: "Color" },
  { label: "ガイドラインの色", type: "color", internalID: "GuideLine", internalGroup: "Color" },
  { label: "レイヤー背景の色", type: "color", internalID: "Layer", internalGroup: "Color" },
  { label: "レイヤーヘッダー背景の色", type: "color", internalID: "LayerHeader", internalGroup: "Color" },
  { label: "レイヤーホバーの色", type: "color", internalID: "LayerHover", internalGroup: "Color" },
  { label: "レイヤー無効の色", type: "color", internalID: "LayerDisable", internalGroup: "Color" },
  { label: "レイヤー範囲背景の色", type: "color", internalID: "LayerRange", internalGroup: "Color" },
  { label: "レイヤー範囲枠線の色", type: "color", internalID: "LayerRangeFrame", internalGroup: "Color" },
  { label: "映像オブジェクトの色", type: "color", internalID: "ObjectVideo", internalGroup: "Color" },
  { label: "映像オブジェクトの色 (選択時)", type: "color", internalID: "ObjectVideoSelect", internalGroup: "Color" },
  { label: "音声オブジェクトの色", type: "color", internalID: "ObjectAudio", internalGroup: "Color" },
  { label: "音声オブジェクトの色 (選択時)", type: "color", internalID: "ObjectAudioSelect", internalGroup: "Color" },
  { label: "制御オブジェクトの色", type: "color", internalID: "ObjectControl", internalGroup: "Color" },
  { label: "制御オブジェクトの色 (選択時)", type: "color", internalID: "ObjectControlSelect", internalGroup: "Color" },
  { label: "映像フィルタオブジェクトの色", type: "color", internalID: "ObjectVideoFilter", internalGroup: "Color" },
  { label: "映像フィルタオブジェクトの色 (選択時)", type: "color", internalID: "ObjectVideoFilterSelect", internalGroup: "Color" },
  { label: "音声フィルタオブジェクトの色", type: "color", internalID: "ObjectAudioFilter", internalGroup: "Color" },
  { label: "音声フィルタオブジェクトの色 (選択時)", type: "color", internalID: "ObjectAudioFilterSelect", internalGroup: "Color" },
  { label: "オブジェクト枠の色 (ホバー時)", type: "color", internalID: "ObjectHover", internalGroup: "Color" },
  { label: "オブジェクト枠の色 (フォーカス時)", type: "color", internalID: "ObjectFocus", internalGroup: "Color" },
  { label: "オブジェクト中間点の色", type: "color", internalID: "ObjectSection", internalGroup: "Color" },
  { label: "オブジェクト音声波形の色", type: "color", internalID: "ObjectWaveform", internalGroup: "Color" },
  { label: "クリッピングオブジェクトの色 (下部)", type: "color", internalID: "ClippingObject", internalGroup: "Color" },
  { label: "クリッピングオブジェクトマスクの色", type: "color", internalID: "ClippingObjectMask", internalGroup: "Color" },
  { label: "アンカー枠の色", type: "color", internalID: "Anchor", internalGroup: "Color" },
  { label: "アンカー線の色", type: "color", internalID: "AnchorLine", internalGroup: "Color" },
  { label: "アンカー枠の色 (開始)", type: "color", internalID: "AnchorIn", internalGroup: "Color" },
  { label: "アンカー枠の色 (終了)", type: "color", internalID: "AnchorOut", internalGroup: "Color" },
  { label: "アンカー枠の色 (ホバー時)", type: "color", internalID: "AnchorHover", internalGroup: "Color" },
  { label: "アンカー枠の色 (選択時)", type: "color", internalID: "AnchorSelect", internalGroup: "Color" },
  { label: "アンカー枠縁の色", type: "color", internalID: "AnchorEdge", internalGroup: "Color" },
  { label: "中心点の色 (グループ)", type: "color", internalID: "CenterGroup", internalGroup: "Color" },
  { label: "ハンドル X", type: "color", internalID: "HandleX", internalGroup: "Color" },
  { label: "ハンドル Y", type: "color", internalID: "HandleY", internalGroup: "Color" },
  { label: "ハンドル Z", type: "color", internalID: "HandleZ", internalGroup: "Color" },
  { label: "ハンドル X (ホバー時)", type: "color", internalID: "HandleXHover", internalGroup: "Color" },
  { label: "ハンドル Y (ホバー時)", type: "color", internalID: "HandleYHover", internalGroup: "Color" },
  { label: "ハンドル Z (ホバー時)", type: "color", internalID: "HandleZHover", internalGroup: "Color" },
  { label: "表示領域外の色", type: "color", internalID: "OutsideDisplay", internalGroup: "Color" },
];

const layoutItemsDef = [
  { label: "ウィンドウ間のサイズ", type: "number", internalID: "WindowSeparatorSize", internalGroup: "Layout" },
  { label: "スクロールバーのサイズ", type: "number", internalID: "ScrollBarSize", internalGroup: "Layout" },
  { label: "フッターの高さ", type: "number", internalID: "FooterHeight", internalGroup: "Layout" },
  { label: "タイトルヘッダーのサイズ", type: "number", internalID: "TitleHeaderHeight", internalGroup: "Layout" },
  { label: "タイムゲージの高さ", type: "number", internalID: "TimeGaugeHeight", internalGroup: "Layout" },
  { label: "レイヤーの高さ", type: "number", internalID: "LayerHeight", internalGroup: "Layout" },
  { label: "レイヤー名の幅", type: "number", internalID: "LayerHeaderWidth", internalGroup: "Layout" },
  { label: "設定項目ヘッダーの幅", type: "number", internalID: "SettingItemHeaderWidth", internalGroup: "Layout" },
  { label: "設定項目高さ", type: "number", internalID: "SettingItemHeight", internalGroup: "Layout" },
  { label: "設定項目マージンの幅", type: "number", internalID: "SettingItemMarginWidth", internalGroup: "Layout" },
  { label: "設定ヘッダーの高さ", type: "number", internalID: "SettingHeaderHeight", internalGroup: "Layout" },
  { label: "プレイヤーコントローラーの高さ", type: "number", internalID: "PlayerControlHeight", internalGroup: "Layout" },
  { label: "メディアエクスプローラーヘッダーの高さ", type: "number", internalID: "ExplorerHeaderHeight", internalGroup: "Layout" },
  { label: "メディアエクスプローラーの数", type: "number", internalID: "ExplorerWindowNum", internalGroup: "Layout" },
  { label: "リスト選択項目の高さ", type: "number", internalID: "ListItemHeight", internalGroup: "Layout" },
];

const formatItemsDef = [
  { label: "フッター左表示形式", type: "text", internalID: "FooterLeft", internalGroup: "Format" },
  { label: "フッター右表示形式", type: "text", internalID: "FooterRight", internalGroup: "Format" },
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
      alert('ファイルが選択されていません。');
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
        alert('設定を保存しました！');
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
        alert('設定を保存しました！');
      }
    } catch (error) {
      console.error('設定の保存に失敗しました:', error);
      alert('設定の保存に失敗しました。');
    }
  };

  const saveConfigToProgramData = async () => {
    if (!currentFilePath) {
      alert('ファイルが選択されていません。');
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
      alert('設定を AviUtl2 の推奨ディレクトリに保存しました！');
    } catch(e: unknown) {
      console.error('設定の保存に失敗しました:', e);
      alert('設定の保存に失敗しました。');
    }
  }
  const createBackup = async () => {
    if (!currentFilePath) {
      alert('ファイルが選択されていません。');
      return;
    }
    try {
      const backupPath = currentFilePath + '.bak';
      const content = `; style.conf backup
; Last edited by AviUtl2 Style.conf Editor at ${new Date().toISOString()}
; AviUtl2 Style.conf Editor v${version} by Yu-yu0202
` + formatConfigForSave(confData);
      await invoke('write_config_file', { path: backupPath, content });
      alert('バックアップを作成しました！');
    } catch (error) {
      console.error('バックアップの作成に失敗しました:', error);
      alert('バックアップの作成に失敗しました。');
    }
  }
  const restoreBackup = async () => {
    if (!currentFilePath) {
      alert('ファイルが選択されていません。');
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
      alert('バックアップから復元しました！');
    } catch (error) {
      console.error('バックアップからの復元に失敗しました:', error);
      alert('バックアップからの復元に失敗しました。');
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
      alert('既定の設定を上書きしました！');
    } catch(e: unknown) {
      console.error('既定の設定の取得に失敗しました:', e);
      alert('既定の設定の取得に失敗しました。');
    }
  }

  const resetSelectedItems = async () => {
    if (!defaultConfig.Font) {
      alert('既定の設定が読み込まれていません。');
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
    alert('既定の設定を上書きしました！');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' }}>AviUtl2 Style.conf Editor</h1>
      
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
          <Tooltip title="現在の設定をファイルに保存します。">
            <Button
              color="primary"
              onClick={() => saveConfig()}
            >
              設定を保存
            </Button>
          </Tooltip>
          <Tooltip title="新しいファイル名で設定を保存します。">
            <Button
              color="primary"
              onClick={saveAsConfig}
            >
              名前を付けて保存
            </Button>
          </Tooltip>
          <Tooltip title="現在の設定を AviUtl2 で推奨されているディレクトリに保存します。">
            <Button
              color="primary"
              onClick={saveConfigToProgramData}
            >
              AviUtl2 のディレクトリに保存 (推奨)
            </Button>
          </Tooltip>
          <Tooltip title="現在の設定のバックアップを作成します (推奨)">
            <Button
              color="primary"
              onClick={createBackup}
            >
              バックアップを作成 (推奨)
            </Button>
          </Tooltip>
        </ButtonGroup>
        
        <ButtonGroup variant="contained">
          <Button
            color="primary"
            onClick={selectFileAndLoad}
            id="select-file-button"
          >
            ファイルを開く
          </Button>
          <Button
            color="primary"
            onClick={handleMenuOpen}
          >
            その他の操作
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
          現在のファイル: {currentFilePath}
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
          すべて既定の設定で上書き
        </MenuItem>
        <MenuItem onClick={() => { resetSelectedItems(); handleMenuClose(); }}>
          選択した項目を既定に復元
        </MenuItem>
        <MenuItem onClick={() => { restoreBackup(); handleMenuClose(); }}>
          バックアップから復元
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
            title="フォントの設定" 
            items={fontItems} 
            onItemChange={handleItemChange} 
            onItemSelect={handleItemSelect}
          />
          <SettingsCard 
            title="レイアウトの設定" 
            items={layoutItems} 
            onItemChange={handleItemChange} 
            onItemSelect={handleItemSelect}
          />
          <SettingsCard 
            title="形式の設定" 
            items={formatItems} 
            onItemChange={handleItemChange} 
            onItemSelect={handleItemSelect}
          />
        </div>
        <SettingsCard 
          title="色の設定" 
          items={colorItems} 
          onItemChange={handleItemChange} 
          onItemSelect={handleItemSelect}
        />
      </div>
    </Box>
  );
};

export default App;
