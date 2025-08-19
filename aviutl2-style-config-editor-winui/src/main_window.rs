use windows::core::*;
use windows::Win32::Foundation::*;
use windows::Win32::UI::WindowsAndMessaging::*;
use quick_xml::Reader;
use quick_xml::events::Event;
use std::collections::HashMap;
use std::fs::File;
use std::io::BufReader;
use once_cell::sync::Lazy;

static JA_RESW: Lazy<HashMap<String, String>> = Lazy::new(|| load_resw("src/i18n/ja.resw"));
static EN_RESW: Lazy<HashMap<String, String>> = Lazy::new(|| load_resw("src/i18n/en.resw"));

#[derive(Clone)]
pub enum SettingType {
    Text,
    Number,
    Color,
    Info,
}

#[derive(Clone)]
pub struct SettingItem {
    pub label_key: String,
    pub internal_group: String,
    pub internal_id: String,
    pub setting_type: SettingType,
    pub placeholder: Option<String>,
    pub value: String,
    pub is_selected: bool,
}

pub struct AppState {
    pub language: String,
    pub settings: Vec<SettingItem>,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            language: "ja".to_string(),
            settings: vec![
                SettingItem {
                    label_key: "FontSettings".to_string(),
                    internal_group: "font".to_string(),
                    internal_id: "defaultFont".to_string(),
                    setting_type: SettingType::Text,
                    placeholder: Some("MS UI Gothic".to_string()),
                    value: "".to_string(),
                    is_selected: false,
                },
                SettingItem {
                    label_key: "ColorSettings".to_string(),
                    internal_group: "color".to_string(),
                    internal_id: "backgroundColor".to_string(),
                    setting_type: SettingType::Color,
                    placeholder: None,
                    value: "#ffffff".to_string(),
                    is_selected: true,
                },
            ],
        }
    }
    pub fn t(&self, key: &str) -> String {
        let map = match self.language.as_str() {
            "ja" => &*JA_RESW,
            "en" => &*EN_RESW,
            _ => &*JA_RESW,
        };
        map.get(key).cloned().unwrap_or_else(|| key.to_string())
    }
    pub fn set_language(&mut self, lang: &str) {
        self.language = lang.to_string();
    }
}

fn load_resw(path: &str) -> HashMap<String, String> {
    let mut map = HashMap::new();
    let file = File::open(path);
    if file.is_err() { return map; }
    let file = file.unwrap();
    let mut reader = Reader::from_reader(BufReader::new(file));
    reader.trim_text(true);
    let mut buf = Vec::new();
    let mut key = String::new();
    let mut val = String::new();
    let mut in_data = false;
    let mut in_value = false;
    loop {
        match reader.read_event(&mut buf) {
            Ok(Event::Start(ref e)) if e.name() == b"data" => {
                in_data = true;
                key = e.attributes()
                    .filter_map(|a| a.ok())
                    .find(|a| a.key == b"name")
                    .and_then(|a| String::from_utf8(a.value.into_owned()).ok())
                    .unwrap_or_default();
            }
            Ok(Event::End(ref e)) if e.name() == b"data" => {
                in_data = false;
                map.insert(key.clone(), val.clone());
                key.clear();
                val.clear();
            }
            Ok(Event::Start(ref e)) if in_data && e.name() == b"value" => {
                in_value = true;
            }
            Ok(Event::End(ref e)) if in_data && e.name() == b"value" => {
                in_value = false;
            }
            Ok(Event::Text(e)) if in_value => {
                val = e.unescape().unwrap_or_default().to_string();
            }
            Ok(Event::Eof) => break,
            Err(_) => break,
            _ => {}
        }
        buf.clear();
    }
    map
}

pub fn run() -> windows::Result<()> {
    // 本来はWinUI 3アプリ起動・XAMLロード・コントロール取得・イベントバインドを行う
    // ここではRustのみで全ロジックを完結させる例
    let mut app_state = AppState::new();
    println!("=== {} ===", app_state.t("Settings"));
    for item in &app_state.settings {
        println!("{}: {}", app_state.t(&item.label_key), item.value);
    }
    // 言語切替例
    app_state.set_language("en");
    println!("\n=== {} ===", app_state.t("Settings"));
    for item in &app_state.settings {
        println!("{}: {}", app_state.t(&item.label_key), item.value);
    }
    Ok(())
}