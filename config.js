const SUPABASE_URL =
  "https://pmhkpooixevbljjwgpga.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_LHeI9dqWn2qSkIXHDIlQJQ_LbZfMF0a";

const { createClient } = supabase;

const supabaseClient =
  createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

const JS_CONFIG = {
    MAX_NAME_LENGTH: 20,
    MAX_MESSAGE_LENGTH: 50,
    WISH_INTERVAL: 12000,
    LANE_COUNT: 5
};