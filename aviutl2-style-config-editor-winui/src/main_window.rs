use windows::Win32::Foundation::*;
use crate::components::language_switcher::LanguageSwitcher;
use crate::components::settings_card::{SettingsCard, SettingItem, SettingType};
use std::collections::HashMap;

pub struct AppState {
    pub language: String,
    pub settings: Vec<SettingItem>,
    pub translations: HashMap<String, HashMap<String, String>>, // lang -> key -> value
}

impl AppState {
    pub fn new() -> Self {
        let mut translations = HashMap::new();
        translations.insert("ja".to_string(), load_resw("src/i18n/ja.resw"));
        translations.insert("en".to_string(), load_resw("src/i18n/en.resw"));
        Self {
            language: "ja".to_string(),
            settings: vec![
                SettingItem {
                    label: "Font Settings".to_string(),
                    label_key: Some("FontSettings".to_string()),
                    internal_group: "font".to_string(),
                    internal_id: "defaultFont".to_string(),
                    setting_type: SettingType::Text,
                    placeholder: Some("MS UI Gothic".to_string()),
                    value: Some("".to_string()),
                    is_selected: false,
                },
                SettingItem {
                    label: "Color Settings".to_string(),
                    label_key: Some("ColorSettings".to_string()),
                    internal_group: "color".to_string(),
                    internal_id: "backgroundColor".to_string(),
                    setting_type: SettingType::Color,
                    placeholder: None,
                    value: Some("#ffffff".to_string()),
                    is_selected: true,
                },
            ],
            translations,
        }
    }
    pub fn t(&self, key: &str) -> String {
        self.translations
            .get(&self.language)
            .and_then(|map| map.get(key))
            .cloned()
            .unwrap_or_else(|| key.to_string())
    }
    pub fn set_language(&mut self, lang: &str) {
        self.language = lang.to_string();
    }
}

fn load_resw(path: &str) -> HashMap<String, String> {
    // 本来はXMLパースするが、ここでは簡易的に空で返す
    HashMap::new()
}

pub fn run() -> windows::Result<()> {
    let mut app_state = AppState::new();
    let mut lang_switcher = LanguageSwitcher::new();
    let mut settings_card = SettingsCard::new(
        &app_state.t("Settings"),
        app_state.settings.clone(),
    );
    // TODO: WinUI 3ウィンドウ生成・XAMLバインド・イベント連携
    println!("[{}] {}", app_state.language, app_state.t("Settings"));
    Ok(())
}