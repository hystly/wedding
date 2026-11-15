const SUPABASE_URL =
  "https://pmhkpooixevbljjwgpga.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_LHeI9dqWn2qSkIXHDIlQJQ_LbZfMF0a";

const PHOTO_BUCKET = "wedding-photos";

const { createClient } = supabase;

const supabaseClient =
  createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

const JS_CONFIG = {
    MAX_NAME_LENGTH: 25,
    MAX_MESSAGE_LENGTH: 50,
    WISH_INTERVAL: 12000,
    LANE_COUNT: 5,
    SLIDESHOW_INTERVAL: 5000
};

const LANG = {

  en: {
    welcome: "Welcome",
    hs: "Hong Shiong",
    ly: "Li Yin",

    sendWish: "Send Wishes",
    uploadPhoto: "Upload Photo",
    backHome: "Back to Homepage",
    submitWish: "Submit Wish",
    submitPhoto: "Submit Photo",
    tabWish: "Wishes",
    tabPhoto: "Photos",

    blessings: "Blessings",
    memories: "Memories",

    wishesWall: "💌 Wishes Wall",
    guestMemories: "📸 Guest Memories",

    mostLovedWish: "⭐ MOST LOVED WISH",
    mostLovedPhoto: "⭐ MOST LOVED PHOTO",

    uploadedBy: "Uploaded by",
    likes: "Likes",

    continue: "Continue",

    weddingWishes: "💌 Wedding Wishes",
    blessingMsg: "Write your blessing",

    submitPhotoTitle: "📸 Share Your Memories",
    getMarried: "WE'RE GETTING MARRIED",
    date: "29 November 2026"


  },

  zh: {
    welcome: "欢迎您",
    hs: "鎽祥",
    ly: "麗瑩",

    sendWish: "送上祝福",
    uploadPhoto: "上传照片",
    backHome: "返回首页",
    submitWish: "提交祝福",
    submitPhoto: "提交照片",
    tabWish: "祝福",
    tabPhoto: "照片",

    blessings: "祝福",
    memories: "回忆",

    wishesWall: "💌 祝福墙",
    guestMemories: "📸 宾客回忆",

    mostLovedWish: "⭐ 最受欢迎祝福",
    mostLovedPhoto: "⭐ 最受欢迎照片",

    uploadedBy: "上传者",
    likes: "个赞",

    continue: "继续",

    weddingWishes: "💌 婚礼祝福",
    blessingMsg: "写下您的祝福",

    submitPhotoTitle: "📸 分享您的回憶",
    getMarried: "我們結婚啦",
    date: "農曆十月廿一"

  }

};