import React, { useEffect, useState } from "react";
import { SettingsCard } from "./components/SettingsCard.js";

// 型定義
declare global {
  interface Window {
    electronAPI: {
      readConf: () => Record<string, Record<string, string>>;
      writeConf: (confJson: Record<string, Record<string, string>>) => void;
    };
  }
}

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

const App: React.FC = () => {
  const [fontItems, setFontItems] = useState<any[]>([]);
  const [colorItems, setColorItems] = useState<any[]>([]);
  const [layoutItems, setLayoutItems] = useState<any[]>([]);
  const [formatItems, setFormatItems] = useState<any[]>([]);

  useEffect(() => {
    const confJson = window.electronAPI.readConf();
    setFontItems(fontItemsDef.map(def => ({ ...def, value: confJson.Font?.[def.internalID] ?? "" })));
    setColorItems(colorItemsDef.map(def => ({ ...def, value: confJson.Color?.[def.internalID] ?? "" })));
    setLayoutItems(layoutItemsDef.map(def => ({ ...def, value: confJson.Layout?.[def.internalID] ?? "" })));
    setFormatItems(formatItemsDef.map(def => ({ ...def, value: confJson.Format?.[def.internalID] ?? "" })));
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold text-theme-primary mb-6 text-center">AviUtl2 Style.conf Editor</h1>
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
        {/* 1列目（左） */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <SettingsCard title="フォントの設定" items={fontItems} />
          <SettingsCard title="レイアウトの設定" items={layoutItems} />
          <SettingsCard title="フォーマットの設定" items={formatItems} />
        </div>
        {/* 2列目（右） */}
        <SettingsCard title="色の設定" items={colorItems} />
      </div>
    </>
  );
};

export default App; 