pub struct LanguageSwitcher {
    pub current_lang: String,
}

impl LanguageSwitcher {
    pub fn new() -> Self {
        Self { current_lang: "ja".to_string() }
    }
    pub fn set_language(&mut self, lang: &str) {
        self.current_lang = lang.to_string();
        // TODO: UI更新やリソース再読込処理
    }
    pub fn get_language(&self) -> &str {
        &self.current_lang
    }
}