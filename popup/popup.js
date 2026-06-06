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

const ALL_KEYS = [
  KEY_HIDE_HOME_FEED, KEY_HIDE_SIDEBAR, KEY_HIDE_END_SCREEN_FEED,
  KEY_DISABLE_AUTOPLAY, KEY_HIDE_PLAYLIST, KEY_HIDE_COMMENTS,
  KEY_HIDE_DANMAKU, KEY_HIDE_THUMBNAILS, KEY_HIDE_VIDEO_INFO,
  KEY_HIDE_CHANNEL_INFO, KEY_HIDE_ADS, KEY_HIDE_HEADER,
];

function getApi() {
  return globalThis.browser ?? globalThis.chrome;
}

async function storageGet(keys) {
  const api = getApi();
  if (!api?.storage?.local?.get) return {};
  const res = api.storage.local.get(keys);
  if (res && typeof res.then === "function") return await res;
  return await new Promise((resolve) => api.storage.local.get(keys, resolve));
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

  if (
    !(checkboxHomeFeed instanceof HTMLInputElement) ||
    !(checkboxSidebar instanceof HTMLInputElement) ||
    !(checkboxEndScreenFeed instanceof HTMLInputElement) ||
    !(checkboxDisableAutoplay instanceof HTMLInputElement) ||
    !(checkboxHidePlaylist instanceof HTMLInputElement) ||
    !(checkboxHideComments instanceof HTMLInputElement) ||
    !(checkboxHideDanmaku instanceof HTMLInputElement) ||
    !(checkboxHideThumbnails instanceof HTMLInputElement) ||
    !(checkboxHideVideoInfo instanceof HTMLInputElement) ||
    !(checkboxHideChannelInfo instanceof HTMLInputElement) ||
    !(checkboxHideAds instanceof HTMLInputElement) ||
    !(checkboxHideHeader instanceof HTMLInputElement)
  ) return;

  // Load all settings in one batch read.
  const stored = await storageGet(ALL_KEYS);
  const val = (key) => typeof stored?.[key] === "boolean" ? stored[key] : true;

  // Set checkbox states from storage (default true).
  checkboxHomeFeed.checked = val(KEY_HIDE_HOME_FEED);
  checkboxSidebar.checked = val(KEY_HIDE_SIDEBAR);
  checkboxEndScreenFeed.checked = val(KEY_HIDE_END_SCREEN_FEED);
  checkboxDisableAutoplay.checked = val(KEY_DISABLE_AUTOPLAY);
  checkboxHidePlaylist.checked = val(KEY_HIDE_PLAYLIST);
  checkboxHideComments.checked = val(KEY_HIDE_COMMENTS);
  checkboxHideDanmaku.checked = val(KEY_HIDE_DANMAKU);
  checkboxHideThumbnails.checked = val(KEY_HIDE_THUMBNAILS);
  checkboxHideVideoInfo.checked = val(KEY_HIDE_VIDEO_INFO);
  checkboxHideChannelInfo.checked = val(KEY_HIDE_CHANNEL_INFO);
  checkboxHideAds.checked = val(KEY_HIDE_ADS);
  checkboxHideHeader.checked = val(KEY_HIDE_HEADER);

  // Write defaults for any keys not yet in storage (one batch write).
  const defaults = {};
  for (const key of ALL_KEYS) {
    if (typeof stored?.[key] !== "boolean") defaults[key] = true;
  }
  if (Object.keys(defaults).length > 0) await storageSet(defaults);

  // Apply current state to the active tab immediately.
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
