#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;

#[tauri::command]
fn read_config_file(path: String) -> Result<String, String> {
    match fs::read_to_string(&path) {
        Ok(content) => Ok(content),
        Err(e) => Err(format!("Failed to read file: {}", e)),
    }
}

#[tauri::command]
fn write_config_file(path: String, content: String) -> Result<(), String> {
    match fs::write(&path, content) {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("Failed to write file: {}", e)),
    }
}

#[tauri::command]
fn parse_config(content: String) -> Result<serde_json::Value, String> {
    let mut result = serde_json::Map::new();
    let mut current_section: Option<String> = None;
    
    for line in content.lines() {
        let trimmed = line.trim();
        if trimmed.is_empty() || trimmed.starts_with(';') {
            continue;
        }
        
        if let Some(section_match) = trimmed.strip_prefix('[').and_then(|s| s.strip_suffix(']')) {
            current_section = Some(section_match.to_string());
            result.insert(section_match.to_string(), serde_json::Value::Object(serde_json::Map::new()));
            continue;
        }
        
        if let Some(eq_pos) = trimmed.find('=') {
            if let Some(ref section) = current_section {
                let key = trimmed[..eq_pos].trim();
                let value = trimmed[eq_pos + 1..].trim();
                
                if let Some(section_obj) = result.get_mut(section).and_then(|v| v.as_object_mut()) {
                    section_obj.insert(key.to_string(), serde_json::Value::String(value.to_string()));
                }
            }
        }
    }
    
    Ok(serde_json::Value::Object(result))
}

#[tauri::command]
fn format_config(data: serde_json::Value) -> Result<String, String> {
    let mut result = String::new();
    
    if let Some(obj) = data.as_object() {
        for (section, values) in obj {
            result.push_str(&format!("[{}]\n", section));
            
            if let Some(section_obj) = values.as_object() {
                for (key, value) in section_obj {
                    if let Some(val_str) = value.as_str() {
                        result.push_str(&format!("{}={}\n", key, val_str));
                    }
                }
            }
            result.push('\n');
        }
    }
    
    Ok(result.trim().to_string())
}

#[tauri::command]
fn get_default_config() -> String {
    include_str!("../style.default.conf").to_string()
}

#[tauri::command]
fn get_program_data_path() -> String {
    std::env::var("PROGRAMDATA").unwrap_or_else(|_| "C:\\ProgramData".to_string())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            read_config_file,
            write_config_file,
            parse_config,
            format_config,
            get_default_config,
            get_program_data_path
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}