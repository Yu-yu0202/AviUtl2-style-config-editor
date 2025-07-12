"use client";

import React, { useState } from "react";
import { SettingsCard, SettingsCardProp } from "./components/SettingsCard";
import { Button, Box } from "@mui/material";
import { open } from '@tauri-apps/plugin-dialog';
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
  { label: "背景色", type: "color", internalID: "Background", internalGroup: "Color" },
  { label: "ウィンドウ枠線色", type: "color", internalID: "WindowBorder", internalGroup: "Color" },
  { label: "ウィンドウ間の背景色", type: "color", internalID: "WindowSeparator", internalGroup: "Color" },
  { label: "フッター背景色", type: "color", internalID: "Footer", internalGroup: "Color" },
  { label: "フッター進捗色", type: "color", internalID: "FooterProgress", internalGroup: "Color" },
  { label: "グループ色", type: "color", internalID: "Grouping", internalGroup: "Color" },
  { label: "グループホバー色", type: "color", internalID: "GroupingHover", internalGroup: "Color" },
  { label: "グループ選択色", type: "color", internalID: "GroupingSelect", internalGroup: "Color" },
  { label: "タイトルヘッダー背景色", type: "color", internalID: "TitleHeader", internalGroup: "Color" },
  { label: "選択枠線色", type: "color", internalID: "BorderSelect", internalGroup: "Color" },
  { label: "枠線色", type: "color", internalID: "Border", internalGroup: "Color" },
  { label: "フォーカス枠線色", type: "color", internalID: "BorderFocus", internalGroup: "Color" },
  { label: "テキスト色", type: "color", internalID: "Text", internalGroup: "Color" },
  { label: "テキスト無効色", type: "color", internalID: "TextDisable", internalGroup: "Color" },
  { label: "テキスト選択色", type: "color", internalID: "TextSelect", internalGroup: "Color" },
  { label: "ボタン背景色", type: "color", internalID: "ButtonBody", internalGroup: "Color" },
  { label: "ボタン背景色(ホバー)", type: "color", internalID: "ButtonBodyHover", internalGroup: "Color" },
  { label: "ボタン背景色(押下)", type: "color", internalID: "ButtonBodyPress", internalGroup: "Color" },
  { label: "ボタン背景色(無効)", type: "color", internalID: "ButtonBodyDisable", internalGroup: "Color" },
  { label: "ボタン背景色(選択)", type: "color", internalID: "ButtonBodySelect", internalGroup: "Color" },
  { label: "スライダーカラー", type: "color", internalID: "SliderCursor", internalGroup: "Color" },
  { label: "トラックバー範囲色", type: "color", internalID: "TrackBarRange", internalGroup: "Color" },
  { label: "ズームゲージ色", type: "color", internalID: "ZoomGauge", internalGroup: "Color" },
  { label: "ズームゲージホバー色", type: "color", internalID: "ZoomGaugeHover", internalGroup: "Color" },
  { label: "ズームゲージオフ色", type: "color", internalID: "ZoomGaugeOff", internalGroup: "Color" },
  { label: "ズームゲージオフホバー色", type: "color", internalID: "ZoomGaugeOffHover", internalGroup: "Color" },
  { label: "フレームカーソル色", type: "color", internalID: "FrameCursor", internalGroup: "Color" },
  { label: "フレームカーソルワイド色", type: "color", internalID: "FrameCursorWide", internalGroup: "Color" },
  { label: "プレイヤーカーソル色", type: "color", internalID: "PlayerCursor", internalGroup: "Color" },
  { label: "ガイドライン色", type: "color", internalID: "GuideLine", internalGroup: "Color" },
  { label: "レイヤー背景色", type: "color", internalID: "Layer", internalGroup: "Color" },
  { label: "レイヤーヘッダー背景色", type: "color", internalID: "LayerHeader", internalGroup: "Color" },
  { label: "レイヤーホバー色", type: "color", internalID: "LayerHover", internalGroup: "Color" },
  { label: "レイヤー無効色", type: "color", internalID: "LayerDisable", internalGroup: "Color" },
  { label: "レイヤー範囲背景色", type: "color", internalID: "LayerRange", internalGroup: "Color" },
  { label: "レイヤー範囲枠線色", type: "color", internalID: "LayerRangeFrame", internalGroup: "Color" },
  { label: "映像オブジェクト色", type: "color", internalID: "ObjectVideo", internalGroup: "Color" },
  { label: "映像オブジェクト色(選択)", type: "color", internalID: "ObjectVideoSelect", internalGroup: "Color" },
  { label: "音声オブジェクト色", type: "color", internalID: "ObjectAudio", internalGroup: "Color" },
  { label: "音声オブジェクト色(選択)", type: "color", internalID: "ObjectAudioSelect", internalGroup: "Color" },
  { label: "制御オブジェクト色", type: "color", internalID: "ObjectControl", internalGroup: "Color" },
  { label: "制御オブジェクト色(選択)", type: "color", internalID: "ObjectControlSelect", internalGroup: "Color" },
  { label: "映像フィルタオブジェクト色", type: "color", internalID: "ObjectVideoFilter", internalGroup: "Color" },
  { label: "映像フィルタオブジェクト色(選択)", type: "color", internalID: "ObjectVideoFilterSelect", internalGroup: "Color" },
  { label: "音声フィルタオブジェクト色", type: "color", internalID: "ObjectAudioFilter", internalGroup: "Color" },
  { label: "音声フィルタオブジェクト色(選択)", type: "color", internalID: "ObjectAudioFilterSelect", internalGroup: "Color" },
  { label: "オブジェクト枠色(ホバー)", type: "color", internalID: "ObjectHover", internalGroup: "Color" },
  { label: "オブジェクト枠色(フォーカス)", type: "color", internalID: "ObjectFocus", internalGroup: "Color" },
  { label: "オブジェクト中間点色", type: "color", internalID: "ObjectSection", internalGroup: "Color" },
  { label: "クリッピングオブジェクト色(下部)", type: "color", internalID: "ClippingObject", internalGroup: "Color" },
  { label: "クリッピングオブジェクトマスク色", type: "color", internalID: "ClippingObjectMask", internalGroup: "Color" },
  { label: "アンカー枠色", type: "color", internalID: "Anchor", internalGroup: "Color" },
  { label: "アンカー線色", type: "color", internalID: "AnchorLine", internalGroup: "Color" },
  { label: "アンカー枠色(開始)", type: "color", internalID: "AnchorIn", internalGroup: "Color" },
  { label: "アンカー枠色(終了)", type: "color", internalID: "AnchorOut", internalGroup: "Color" },
  { label: "アンカー枠色(ホバー)", type: "color", internalID: "AnchorHover", internalGroup: "Color" },
  { label: "アンカー枠色(選択)", type: "color", internalID: "AnchorSelect", internalGroup: "Color" },
  { label: "アンカー枠縁色", type: "color", internalID: "AnchorEdge", internalGroup: "Color" },
  { label: "中心点色(グループ)", type: "color", internalID: "CenterGroup", internalGroup: "Color" },
  { label: "HandleX", type: "color", internalID: "HandleX", internalGroup: "Color" },
  { label: "HandleY", type: "color", internalID: "HandleY", internalGroup: "Color" },
  { label: "HandleZ", type: "color", internalID: "HandleZ", internalGroup: "Color" },
  { label: "HandleX(ホバー)", type: "color", internalID: "HandleXHover", internalGroup: "Color" },
  { label: "HandleY(ホバー)", type: "color", internalID: "HandleYHover", internalGroup: "Color" },
  { label: "HandleZ(ホバー)", type: "color", internalID: "HandleZHover", internalGroup: "Color" },
  { label: "表示領域外色", type: "color", internalID: "OutsideDisplay", internalGroup: "Color" },
];

const layoutItemsDef = [
  { label: "ウィンドウ間のサイズ", type: "number", internalID: "WindowSeparatorSize", internalGroup: "Layout" },
  { label: "スクロールバーのサイズ", type: "number", internalID: "ScrollBarSize", internalGroup: "Layout" },
  { label: "フッターの高さ", type: "number", internalID: "FooterHeight", internalGroup: "Layout" },
  { label: "タイトルヘッダーのサイズ", type: "number", internalID: "TitleHeaderHeight", internalGroup: "Layout" },
  { label: "タイムゲージの高さ", type: "number", internalID: "TimeGaugeHeight", internalGroup: "Layout" },
  { label: "レイヤーの高さ", type: "number", internalID: "LayerHeight", internalGroup: "Layout" },
  { label: "レイヤー名の幅", type: "number", internalID: "LayerHeaderWidth", internalGroup: "Layout" },
  { label: "設定項目ヘッダー幅", type: "number", internalID: "SettingItemHeaderWidth", internalGroup: "Layout" },
  { label: "設定項目高さ", type: "number", internalID: "SettingItemHeight", internalGroup: "Layout" },
  { label: "設定項目マージン幅", type: "number", internalID: "SettingItemMarginWidth", internalGroup: "Layout" },
  { label: "設定ヘッダー高さ", type: "number", internalID: "SettingHeaderHeight", internalGroup: "Layout" },
  { label: "プレイヤーコントローラー高さ", type: "number", internalID: "PlayerControlHeight", internalGroup: "Layout" },
  { label: "メディアエクスプローラーヘッダー高さ", type: "number", internalID: "ExplorerHeaderHeight", internalGroup: "Layout" },
  { label: "メディアエクスプローラー数", type: "number", internalID: "ExplorerWindowNum", internalGroup: "Layout" },
  { label: "リスト選択項目の高さ", type: "number", internalID: "ListItemHeight", internalGroup: "Layout" },
];

const formatItemsDef = [
  { label: "フッター左表示フォーマット", type: "text", internalID: "FooterLeft", internalGroup: "Format" },
  { label: "フッター右表示フォーマット", type: "text", internalID: "FooterRight", internalGroup: "Format" },
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

  const saveConfig = async () => {
    if (!currentFilePath) {
      alert('ファイルが選択されていません。');
      return;
    }
    try {
      const content = `; style.conf 
; Last edited by AviUtl2 Style.conf Editor at ${new Date().toISOString()}
; AviUtl2 Style.conf Editor v${version} by Yu-yu0202

` + formatConfigForSave(confData);
      await invoke('write_config_file', { path: currentFilePath, content });
      alert('設定を保存しました！');
    } catch (error) {
      console.error('設定の保存に失敗しました:', error);
      alert('設定の保存に失敗しました。');
    }
  };

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
      console.error('ファイル選択に失敗しました:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' }}>AviUtl2 Style.conf Editor</h1>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, gap: 2 }}>
        <Button variant="contained" color="primary" onClick={saveConfig} size="large">
          設定を保存
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={selectFileAndLoad}
          id="select-file-button"
        >
          設定ファイルを選択
        </Button>
      </Box>
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
          <SettingsCard title="フォントの設定" items={fontItems} onItemChange={handleItemChange} />
          <SettingsCard title="レイアウトの設定" items={layoutItems} onItemChange={handleItemChange} />
          <SettingsCard title="フォーマットの設定" items={formatItems} onItemChange={handleItemChange} />
        </div>
        <SettingsCard title="色の設定" items={colorItems} onItemChange={handleItemChange} />
      </div>
    </Box>
  );
};

export default App;