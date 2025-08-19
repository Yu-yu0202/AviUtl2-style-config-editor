use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize)]
pub enum SettingType {
    Text,
    Number,
    Color,
    Info,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct SettingItem {
    pub label: String,
    pub label_key: Option<String>,
    pub internal_group: String,
    pub internal_id: String,
    pub setting_type: SettingType,
    pub placeholder: Option<String>,
    pub value: Option<String>,
    pub is_selected: bool,
}

pub struct SettingsCard {
    pub title: String,
    pub items: Vec<SettingItem>,
}

impl SettingsCard {
    pub fn new(title: &str, items: Vec<SettingItem>) -> Self {
        Self {
            title: title.to_string(),
            items,
        }
    }
    pub fn on_item_change(&mut self, group: &str, id: &str, value: &str) {
        for item in &mut self.items {
            if item.internal_group == group && item.internal_id == id {
                item.value = Some(value.to_string());
            }
        }
    }
    pub fn on_item_select(&mut self, group: &str, id: &str, selected: bool) {
        for item in &mut self.items {
            if item.internal_group == group && item.internal_id == id {
                item.is_selected = selected;
            }
        }
    }
    pub fn get_label(&self, key: &str, t: &dyn Fn(&str) -> String) -> String {
        t(key)
    }
}