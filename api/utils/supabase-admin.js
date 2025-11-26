"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseAdmin = void 0;
var supabase_js_1 = require("@supabase/supabase-js");
// Use VITE_ prefix vars if that's what is set in Vercel, 
// or standard SUPABASE_URL if you set those.
var SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
var SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_KEY || process.env.SUPABASE_SERVICE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.warn('Missing Supabase Environment Variables in API');
}
// Create a single instance
exports.supabaseAdmin = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_SERVICE_KEY);
