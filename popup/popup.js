const KEY_HIDE_HOME_FEED = "hideHomeFeed";
const KEY_HIDE_SIDEBAR = "hideSidebar";
const KEY_HIDE_END_SCREEN_FEED = "hideEndScreenFeed";
const KEY_DISABLE_AUTOPLAY = "disableAutoplay";
const KEY_HIDE_PLAYLIST = "hidePlaylist";
const KEY_HIDE_COMMENTS = "hideComments";
const KEY_HIDE_DANMAKU = "hideDanmaku";
const KEY_HIDE_THUMBNAILS = "hideThumbnails";
const KEY_HIDE_VIDEO_INFO = "hideVideoInfo";
const KEY_HIDE_CHANNEL_INFO = "hideChannelInfo";
const KEY_HIDE_ADS = "hideAds";
const KEY_HIDE_HEADER = "hideHeader";

function getApi() {
  return globalThis.browser ?? globalThis.chrome;
}

async function storageGet(key) {
  const api = getApi();
  if (!api?.storage?.local?.get) return {};
  const res = api.storage.local.get(key);
  if (res && typeof res.then === "function") return await res;
  return await new Promise((resolve) => api.storage.local.get(key, resolve));
}

async function storageSet(obj) {
  const api = getApi();
  if (!api?.storage?.local?.set) return;
  const res = api.storage.local.set(obj);
  if (res && typeof res.then === "function") return await res;
  return await new Promise((resolve) => api.storage.local.set(obj, resolve));
}

async function getActiveTab() {
  const api = getApi();
  if (!api?.tabs?.query) return null;
  const res = api.tabs.query({ active: true, currentWindow: true });
  const tabs = res && typeof res.then === "function" ? await res : await new Promise((resolve) => api.tabs.query({ active: true, currentWindow: true }, resolve));
  return tabs?.[0] ?? null;
}

async function sendSettingToTab(type, enabled) {
  const api = getApi();
  const tab = await getActiveTab();
  if (!tab?.id || !api?.tabs?.sendMessage) return;
  try {
    const res = api.tabs.sendMessage(tab.id, { type, enabled });
    if (res && typeof res.then === "function") await res;
  } catch (_) {
    // Ignore: tab may not have our content script (non-bilibili pages).
  }
}

async function sendSettingToBackground(hideHomeFeed) {
  const api = getApi();
  if (!api?.runtime?.sendMessage) return;
  try {
    const res = api.runtime.sendMessage({ type: "SET_HIDE_HOME_FEED", enabled: hideHomeFeed });
    if (res && typeof res.then === "function") await res;
  } catch (_) {
    // no-op
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const checkboxHomeFeed = document.getElementById("hide-home-feed");
  const checkboxSidebar = document.getElementById("hide-sidebar");
  const checkboxEndScreenFeed = document.getElementById("hide-end-screen-feed");
  const checkboxDisableAutoplay = document.getElementById("disable-autoplay");
  const checkboxHidePlaylist = document.getElementById("hide-playlist");
  const checkboxHideComments = document.getElementById("hide-comments");
  const checkboxHideDanmaku = document.getElementById("hide-danmaku");
  const checkboxHideThumbnails = document.getElementById("hide-thumbnails");
  const checkboxHideVideoInfo = document.getElementById("hide-video-info");
  const checkboxHideChannelInfo = document.getElementById("hide-channel-info");
  const checkboxHideAds = document.getElementById("hide-ads");
  const checkboxHideHeader = document.getElementById("hide-header");

  if (!(checkboxHomeFeed instanceof HTMLInputElement) || !(checkboxSidebar instanceof HTMLInputElement) || !(checkboxEndScreenFeed instanceof HTMLInputElement) || !(checkboxDisableAutoplay instanceof HTMLInputElement) || !(checkboxHidePlaylist instanceof HTMLInputElement) || !(checkboxHideComments instanceof HTMLInputElement) || !(checkboxHideDanmaku instanceof HTMLInputElement) || !(checkboxHideThumbnails instanceof HTMLInputElement) || !(checkboxHideVideoInfo instanceof HTMLInputElement) || !(checkboxHideChannelInfo instanceof HTMLInputElement) || !(checkboxHideAds instanceof HTMLInputElement) || !(checkboxHideHeader instanceof HTMLInputElement)) return;

  // Load and initialize home feed setting
  const storedHomeFeed = await storageGet(KEY_HIDE_HOME_FEED);
  const initialHomeFeed = typeof storedHomeFeed?.[KEY_HIDE_HOME_FEED] === "boolean" ? storedHomeFeed[KEY_HIDE_HOME_FEED] : true;
  checkboxHomeFeed.checked = initialHomeFeed;
  if (typeof storedHomeFeed?.[KEY_HIDE_HOME_FEED] !== "boolean") {
    await storageSet({ [KEY_HIDE_HOME_FEED]: true });
  }

  // Load and initialize sidebar setting
  const storedSidebar = await storageGet(KEY_HIDE_SIDEBAR);
  const initialSidebar = typeof storedSidebar?.[KEY_HIDE_SIDEBAR] === "boolean" ? storedSidebar[KEY_HIDE_SIDEBAR] : true;
  checkboxSidebar.checked = initialSidebar;
  if (typeof storedSidebar?.[KEY_HIDE_SIDEBAR] !== "boolean") {
    await storageSet({ [KEY_HIDE_SIDEBAR]: true });
  }

  // Load and initialize end screen feed setting
  const storedEndScreenFeed = await storageGet(KEY_HIDE_END_SCREEN_FEED);
  const initialEndScreenFeed = typeof storedEndScreenFeed?.[KEY_HIDE_END_SCREEN_FEED] === "boolean" ? storedEndScreenFeed[KEY_HIDE_END_SCREEN_FEED] : true;
  checkboxEndScreenFeed.checked = initialEndScreenFeed;
  if (typeof storedEndScreenFeed?.[KEY_HIDE_END_SCREEN_FEED] !== "boolean") {
    await storageSet({ [KEY_HIDE_END_SCREEN_FEED]: true });
  }

  // Load and initialize disable autoplay setting
  const storedDisableAutoplay = await storageGet(KEY_DISABLE_AUTOPLAY);
  const initialDisableAutoplay = typeof storedDisableAutoplay?.[KEY_DISABLE_AUTOPLAY] === "boolean" ? storedDisableAutoplay[KEY_DISABLE_AUTOPLAY] : true;
  checkboxDisableAutoplay.checked = initialDisableAutoplay;
  if (typeof storedDisableAutoplay?.[KEY_DISABLE_AUTOPLAY] !== "boolean") {
    await storageSet({ [KEY_DISABLE_AUTOPLAY]: true });
  }

  // Load and initialize hide playlist setting
  const storedHidePlaylist = await storageGet(KEY_HIDE_PLAYLIST);
  const initialHidePlaylist = typeof storedHidePlaylist?.[KEY_HIDE_PLAYLIST] === "boolean" ? storedHidePlaylist[KEY_HIDE_PLAYLIST] : true;
  checkboxHidePlaylist.checked = initialHidePlaylist;
  if (typeof storedHidePlaylist?.[KEY_HIDE_PLAYLIST] !== "boolean") {
    await storageSet({ [KEY_HIDE_PLAYLIST]: true });
  }

  // Load and initialize hide comments setting
  const storedHideComments = await storageGet(KEY_HIDE_COMMENTS);
  const initialHideComments = typeof storedHideComments?.[KEY_HIDE_COMMENTS] === "boolean" ? storedHideComments[KEY_HIDE_COMMENTS] : true;
  checkboxHideComments.checked = initialHideComments;
  if (typeof storedHideComments?.[KEY_HIDE_COMMENTS] !== "boolean") {
    await storageSet({ [KEY_HIDE_COMMENTS]: true });
  }

  // Load and initialize hide danmaku setting
  const storedHideDanmaku = await storageGet(KEY_HIDE_DANMAKU);
  const initialHideDanmaku = typeof storedHideDanmaku?.[KEY_HIDE_DANMAKU] === "boolean" ? storedHideDanmaku[KEY_HIDE_DANMAKU] : true;
  checkboxHideDanmaku.checked = initialHideDanmaku;
  if (typeof storedHideDanmaku?.[KEY_HIDE_DANMAKU] !== "boolean") {
    await storageSet({ [KEY_HIDE_DANMAKU]: true });
  }

  // Load and initialize hide thumbnails setting
  const storedHideThumbnails = await storageGet(KEY_HIDE_THUMBNAILS);
  const initialHideThumbnails = typeof storedHideThumbnails?.[KEY_HIDE_THUMBNAILS] === "boolean" ? storedHideThumbnails[KEY_HIDE_THUMBNAILS] : true;
  checkboxHideThumbnails.checked = initialHideThumbnails;
  if (typeof storedHideThumbnails?.[KEY_HIDE_THUMBNAILS] !== "boolean") {
    await storageSet({ [KEY_HIDE_THUMBNAILS]: true });
  }

  // Load and initialize hide video info setting
  const storedHideVideoInfo = await storageGet(KEY_HIDE_VIDEO_INFO);
  const initialHideVideoInfo = typeof storedHideVideoInfo?.[KEY_HIDE_VIDEO_INFO] === "boolean" ? storedHideVideoInfo[KEY_HIDE_VIDEO_INFO] : true;
  checkboxHideVideoInfo.checked = initialHideVideoInfo;
  if (typeof storedHideVideoInfo?.[KEY_HIDE_VIDEO_INFO] !== "boolean") {
    await storageSet({ [KEY_HIDE_VIDEO_INFO]: true });
  }

  // Load and initialize hide channel info setting
  const storedHideChannelInfo = await storageGet(KEY_HIDE_CHANNEL_INFO);
  const initialHideChannelInfo = typeof storedHideChannelInfo?.[KEY_HIDE_CHANNEL_INFO] === "boolean" ? storedHideChannelInfo[KEY_HIDE_CHANNEL_INFO] : true;
  checkboxHideChannelInfo.checked = initialHideChannelInfo;
  if (typeof storedHideChannelInfo?.[KEY_HIDE_CHANNEL_INFO] !== "boolean") {
    await storageSet({ [KEY_HIDE_CHANNEL_INFO]: true });
  }

  // Load and initialize hide ads setting
  const storedHideAds = await storageGet(KEY_HIDE_ADS);
  const initialHideAds = typeof storedHideAds?.[KEY_HIDE_ADS] === "boolean" ? storedHideAds[KEY_HIDE_ADS] : true;
  checkboxHideAds.checked = initialHideAds;
  if (typeof storedHideAds?.[KEY_HIDE_ADS] !== "boolean") {
    await storageSet({ [KEY_HIDE_ADS]: true });
  }

  // Load and initialize hide header setting
  const storedHideHeader = await storageGet(KEY_HIDE_HEADER);
  const initialHideHeader = typeof storedHideHeader?.[KEY_HIDE_HEADER] === "boolean" ? storedHideHeader[KEY_HIDE_HEADER] : true;
  checkboxHideHeader.checked = initialHideHeader;
  if (typeof storedHideHeader?.[KEY_HIDE_HEADER] !== "boolean") {
    await storageSet({ [KEY_HIDE_HEADER]: true });
  }

  // Apply immediately on current tab (no refresh needed).
  await sendSettingToTab("SET_HIDE_HOME_FEED", checkboxHomeFeed.checked);
  await sendSettingToTab("SET_HIDE_SIDEBAR", checkboxSidebar.checked);
  await sendSettingToTab("SET_HIDE_END_SCREEN_FEED", checkboxEndScreenFeed.checked);
  await sendSettingToTab("SET_DISABLE_AUTOPLAY", checkboxDisableAutoplay.checked);
  await sendSettingToTab("SET_HIDE_PLAYLIST", checkboxHidePlaylist.checked);
  await sendSettingToTab("SET_HIDE_COMMENTS", checkboxHideComments.checked);
  await sendSettingToTab("SET_HIDE_DANMAKU", checkboxHideDanmaku.checked);
  await sendSettingToTab("SET_HIDE_THUMBNAILS", checkboxHideThumbnails.checked);
  await sendSettingToTab("SET_HIDE_VIDEO_INFO", checkboxHideVideoInfo.checked);
  await sendSettingToTab("SET_HIDE_CHANNEL_INFO", checkboxHideChannelInfo.checked);
  await sendSettingToTab("SET_HIDE_ADS", checkboxHideAds.checked);
  await sendSettingToTab("SET_HIDE_HEADER", checkboxHideHeader.checked);

  checkboxHomeFeed.addEventListener("change", async () => {
    await storageSet({ [KEY_HIDE_HOME_FEED]: checkboxHomeFeed.checked });
    await sendSettingToTab("SET_HIDE_HOME_FEED", checkboxHomeFeed.checked);
  });

  checkboxSidebar.addEventListener("change", async () => {
    await storageSet({ [KEY_HIDE_SIDEBAR]: checkboxSidebar.checked });
    await sendSettingToTab("SET_HIDE_SIDEBAR", checkboxSidebar.checked);
  });

  checkboxEndScreenFeed.addEventListener("change", async () => {
    await storageSet({ [KEY_HIDE_END_SCREEN_FEED]: checkboxEndScreenFeed.checked });
    await sendSettingToTab("SET_HIDE_END_SCREEN_FEED", checkboxEndScreenFeed.checked);
  });

  checkboxDisableAutoplay.addEventListener("change", async () => {
    await storageSet({ [KEY_DISABLE_AUTOPLAY]: checkboxDisableAutoplay.checked });
    await sendSettingToTab("SET_DISABLE_AUTOPLAY", checkboxDisableAutoplay.checked);
  });

  checkboxHidePlaylist.addEventListener("change", async () => {
    await storageSet({ [KEY_HIDE_PLAYLIST]: checkboxHidePlaylist.checked });
    await sendSettingToTab("SET_HIDE_PLAYLIST", checkboxHidePlaylist.checked);
  });

  checkboxHideComments.addEventListener("change", async () => {
    await storageSet({ [KEY_HIDE_COMMENTS]: checkboxHideComments.checked });
    await sendSettingToTab("SET_HIDE_COMMENTS", checkboxHideComments.checked);
  });

  checkboxHideDanmaku.addEventListener("change", async () => {
    await storageSet({ [KEY_HIDE_DANMAKU]: checkboxHideDanmaku.checked });
    await sendSettingToTab("SET_HIDE_DANMAKU", checkboxHideDanmaku.checked);
  });

  checkboxHideThumbnails.addEventListener("change", async () => {
    await storageSet({ [KEY_HIDE_THUMBNAILS]: checkboxHideThumbnails.checked });
    await sendSettingToTab("SET_HIDE_THUMBNAILS", checkboxHideThumbnails.checked);
  });

  checkboxHideVideoInfo.addEventListener("change", async () => {
    await storageSet({ [KEY_HIDE_VIDEO_INFO]: checkboxHideVideoInfo.checked });
    await sendSettingToTab("SET_HIDE_VIDEO_INFO", checkboxHideVideoInfo.checked);
  });

  checkboxHideChannelInfo.addEventListener("change", async () => {
    await storageSet({ [KEY_HIDE_CHANNEL_INFO]: checkboxHideChannelInfo.checked });
    await sendSettingToTab("SET_HIDE_CHANNEL_INFO", checkboxHideChannelInfo.checked);
  });

  checkboxHideAds.addEventListener("change", async () => {
    await storageSet({ [KEY_HIDE_ADS]: checkboxHideAds.checked });
    await sendSettingToTab("SET_HIDE_ADS", checkboxHideAds.checked);
  });

  checkboxHideHeader.addEventListener("change", async () => {
    await storageSet({ [KEY_HIDE_HEADER]: checkboxHideHeader.checked });
    await sendSettingToTab("SET_HIDE_HEADER", checkboxHideHeader.checked);
  });
});



