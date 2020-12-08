mod utils;

use wasm_bindgen::prelude::*;

extern crate web_sys;
use web_sys::{console};

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}
#[wasm_bindgen]
pub fn greet() {
    console::log_1(&JsValue::from_str("Hello, rust wasm!"));
}
