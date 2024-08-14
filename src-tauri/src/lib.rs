use reqwest::{Client, Method};
use tauri::command;
use serde_json::{Value};

#[command]
async fn proxy_request(
    api_url: String,
    method: String,
    path: String,
    body: Option<String>,
) -> Result<String, String> {
    let url = format!("{}{}", api_url, path);

    // Convert method from String to reqwest::Method
    let method = Method::from_bytes(method.as_bytes()).map_err(|e| e.to_string())?;

    // Create the client and request
    let client = Client::new();
    let mut request_builder = client.request(method, &url);

    // Add the body if it exists
    if let Some(body) = body {
        let parsed: Value = serde_json::from_str(&body).unwrap();
        request_builder = request_builder.json(&parsed);
    }

    // Execute the request and process the response
    let response = request_builder.send().await.map_err(|e| e.to_string())?;
    let text = response.text().await.map_err(|e| e.to_string())?;

    Ok(text)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .invoke_handler(tauri::generate_handler![proxy_request])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
