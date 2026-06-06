(() => {
  // Toggle hiding home feed (feed2), sidebar (rcmd-tab), end screen feed (bpx-player-ending-wrap), and disable autoplay.
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
  const STYLE_ID_HIDE_FEED2 = "biliblocker-hide-feed2";
  const STYLE_ID_HIDE_SIDEBAR = "biliblocker-hide-sidebar";
  const STYLE_ID_HIDE_END_SCREEN_FEED = "biliblocker-hide-end-screen-feed";
  const STYLE_ID_HIDE_PLAYLIST = "biliblocker-hide-playlist";
  const STYLE_ID_HIDE_COMMENTS = "biliblocker-hide-comments";
  const STYLE_ID_HIDE_THUMBNAILS = "biliblocker-hide-thumbnails";
  const STYLE_ID_HIDE_VIDEO_INFO = "biliblocker-hide-video-info";
  const STYLE_ID_HIDE_CHANNEL_INFO = "biliblocker-hide-channel-info";
  const STYLE_ID_HIDE_ADS = "biliblocker-hide-ads";
  const STYLE_ID_HIDE_HEADER = "biliblocker-hide-header";
  let enabledHomeFeed = true;
  let enabledSidebar = true;
  let enabledEndScreenFeed = true;
  let enabledDisableAutoplay = true;
  let enabledHidePlaylist = true;
  let enabledHideComments = true;
  let enabledHideDanmaku = true;
  let danmakuObserver = null;
  let enabledHideThumbnails = true;
  let enabledHideVideoInfo = true;
  let enabledHideChannelInfo = true;
  let enabledHideAds = true;
  let enabledHideHeader = true;
  let autoplayObserver = null;

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

  function setFeed2Hidden(hidden) {
    const existing = document.getElementById(STYLE_ID_HIDE_FEED2);
    if (!hidden) {
      if (existing) existing.remove();
      return;
    }
    if (existing) return;
    const style = document.createElement("style");
    style.id = STYLE_ID_HIDE_FEED2;
    style.textContent = `.feed2 { display: none !important; }`;
    document.documentElement.appendChild(style);
  }

  function setSidebarHidden(hidden) {
    const existing = document.getElementById(STYLE_ID_HIDE_SIDEBAR);
    if (!hidden) {
      if (existing) existing.remove();
      return;
    }
    if (existing) return;
    const style = document.createElement("style");
    style.id = STYLE_ID_HIDE_SIDEBAR;
    style.textContent = `.right-container { display: none !important; }`;
    document.documentElement.appendChild(style);
  }

  function setEndScreenFeedHidden(hidden) {
    const existing = document.getElementById(STYLE_ID_HIDE_END_SCREEN_FEED);
    if (!hidden) {
      if (existing) existing.remove();
      return;
    }
    if (existing) return;
    const style = document.createElement("style");
    style.id = STYLE_ID_HIDE_END_SCREEN_FEED;
    style.textContent = `.bpx-player-ending-wrap { display: none !important; }`;
    document.documentElement.appendChild(style);
  }

  function setPlaylistHidden(hidden) {
    const existing = document.getElementById(STYLE_ID_HIDE_PLAYLIST);
    if (!hidden) {
      if (existing) existing.remove();
      return;
    }
    if (existing) return;
    const style = document.createElement("style");
    style.id = STYLE_ID_HIDE_PLAYLIST;
    style.textContent = `.video-pod { display: none !important; }`;
    document.documentElement.appendChild(style);
  }

  function setHeaderHidden(hidden) {
    const existing = document.getElementById(STYLE_ID_HIDE_HEADER);
    if (!hidden) {
      if (existing) existing.remove();
      return;
    }
    if (existing) return;
    const style = document.createElement("style");
    style.id = STYLE_ID_HIDE_HEADER;
    style.textContent = `.bili-header__bar { display: none !important; }`;
    document.documentElement.appendChild(style);
  }

  function setAdsHidden(hidden) {
    const existing = document.getElementById(STYLE_ID_HIDE_ADS);
    if (!hidden) {
      if (existing) existing.remove();
      return;
    }
    if (existing) return;
    const style = document.createElement("style");
    style.id = STYLE_ID_HIDE_ADS;
    style.textContent = `.ad-report { display: none !important; }`;
    document.documentElement.appendChild(style);
  }

  function setChannelInfoHidden(hidden) {
    const existing = document.getElementById(STYLE_ID_HIDE_CHANNEL_INFO);
    if (!hidden) {
      if (existing) existing.remove();
      return;
    }
    if (existing) return;
    const style = document.createElement("style");
    style.id = STYLE_ID_HIDE_CHANNEL_INFO;
    style.textContent = `.up-info-container { display: none !important; }`;
    document.documentElement.appendChild(style);
  }

  function setVideoInfoHidden(hidden) {
    const existing = document.getElementById(STYLE_ID_HIDE_VIDEO_INFO);
    if (!hidden) {
      if (existing) existing.remove();
      return;
    }
    if (existing) return;
    const style = document.createElement("style");
    style.id = STYLE_ID_HIDE_VIDEO_INFO;
    style.textContent = `#v_desc { display: none !important; }`;
    document.documentElement.appendChild(style);
  }

  function setThumbnailsHidden(hidden) {
    const existing = document.getElementById(STYLE_ID_HIDE_THUMBNAILS);
    if (!hidden) {
      if (existing) existing.remove();
      return;
    }
    if (existing) return;
    const style = document.createElement("style");
    style.id = STYLE_ID_HIDE_THUMBNAILS;
    style.textContent = `.bili-video-card__image--wrap { background: black !important; } .bili-video-card__cover img { visibility: hidden !important; }`;
    document.documentElement.appendChild(style);
  }

  function setCommentsHidden(hidden) {
    const existing = document.getElementById(STYLE_ID_HIDE_COMMENTS);
    if (!hidden) {
      if (existing) existing.remove();
      return;
    }
    if (existing) return;
    const style = document.createElement("style");
    style.id = STYLE_ID_HIDE_COMMENTS;
    style.textContent = `#commentapp { display: none !important; }`;
    document.documentElement.appendChild(style);
  }

  function toggleAutoplaySwitch(enabled) {
    // When enabled: find .switch-btn.on and remove "on" class
    // When disabled: find .switch-btn and add "on" class
    if (enabled) {
      const switches = document.querySelectorAll(".switch-btn.on");
      switches.forEach((el) => {
        el.classList.remove("on");
      });
    } else {
      const switches = document.querySelectorAll(".switch-btn:not(.on)");
      switches.forEach((el) => {
        el.classList.add("on");
      });
    }
  }

  function startObservingAutoplay() {
    if (autoplayObserver) return;
    autoplayObserver = new MutationObserver(() => {
      if (enabledDisableAutoplay) {
        toggleAutoplaySwitch(true);
      }
    });
    autoplayObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  function stopObservingAutoplay() {
    if (!autoplayObserver) return;
    autoplayObserver.disconnect();
    autoplayObserver = null;
  }

  async function initSettings() {
    const storedHomeFeed = await storageGet(KEY_HIDE_HOME_FEED);
    const storedSidebar = await storageGet(KEY_HIDE_SIDEBAR);
    const storedEndScreenFeed = await storageGet(KEY_HIDE_END_SCREEN_FEED);
    const storedDisableAutoplay = await storageGet(KEY_DISABLE_AUTOPLAY);
    const storedHidePlaylist = await storageGet(KEY_HIDE_PLAYLIST);
    const storedHideComments = await storageGet(KEY_HIDE_COMMENTS);
    const storedHideDanmaku = await storageGet(KEY_HIDE_DANMAKU);
    const storedHideThumbnails = await storageGet(KEY_HIDE_THUMBNAILS);
    const storedHideVideoInfo = await storageGet(KEY_HIDE_VIDEO_INFO);
    const storedHideChannelInfo = await storageGet(KEY_HIDE_CHANNEL_INFO);
    const storedHideAds = await storageGet(KEY_HIDE_ADS);
    const storedHideHeader = await storageGet(KEY_HIDE_HEADER);

    const enabledHomeFeedValue =
      typeof storedHomeFeed?.[KEY_HIDE_HOME_FEED] === "boolean"
        ? storedHomeFeed[KEY_HIDE_HOME_FEED]
        : true;

    const enabledSidebarValue =
      typeof storedSidebar?.[KEY_HIDE_SIDEBAR] === "boolean"
        ? storedSidebar[KEY_HIDE_SIDEBAR]
        : true;

    const enabledEndScreenFeedValue =
      typeof storedEndScreenFeed?.[KEY_HIDE_END_SCREEN_FEED] === "boolean"
        ? storedEndScreenFeed[KEY_HIDE_END_SCREEN_FEED]
        : true;

    const enabledDisableAutoplayValue =
      typeof storedDisableAutoplay?.[KEY_DISABLE_AUTOPLAY] === "boolean"
        ? storedDisableAutoplay[KEY_DISABLE_AUTOPLAY]
        : true;

    const enabledHidePlaylistValue =
      typeof storedHidePlaylist?.[KEY_HIDE_PLAYLIST] === "boolean"
        ? storedHidePlaylist[KEY_HIDE_PLAYLIST]
        : true;

    const enabledHideCommentsValue =
      typeof storedHideComments?.[KEY_HIDE_COMMENTS] === "boolean"
        ? storedHideComments[KEY_HIDE_COMMENTS]
        : true;

    const enabledHideDanmakuValue =
      typeof storedHideDanmaku?.[KEY_HIDE_DANMAKU] === "boolean"
        ? storedHideDanmaku[KEY_HIDE_DANMAKU]
        : true;

    const enabledHideThumbnailsValue =
      typeof storedHideThumbnails?.[KEY_HIDE_THUMBNAILS] === "boolean"
        ? storedHideThumbnails[KEY_HIDE_THUMBNAILS]
        : true;

    const enabledHideVideoInfoValue =
      typeof storedHideVideoInfo?.[KEY_HIDE_VIDEO_INFO] === "boolean"
        ? storedHideVideoInfo[KEY_HIDE_VIDEO_INFO]
        : true;

    const enabledHideChannelInfoValue =
      typeof storedHideChannelInfo?.[KEY_HIDE_CHANNEL_INFO] === "boolean"
        ? storedHideChannelInfo[KEY_HIDE_CHANNEL_INFO]
        : true;

    const enabledHideAdsValue =
      typeof storedHideAds?.[KEY_HIDE_ADS] === "boolean"
        ? storedHideAds[KEY_HIDE_ADS]
        : true;

    const enabledHideHeaderValue =
      typeof storedHideHeader?.[KEY_HIDE_HEADER] === "boolean"
        ? storedHideHeader[KEY_HIDE_HEADER]
        : true;

    applyHomeFeedEnabled(!!enabledHomeFeedValue);
    applySidebarEnabled(!!enabledSidebarValue);
    applyEndScreenFeedEnabled(!!enabledEndScreenFeedValue);
    applyDisableAutoplayEnabled(!!enabledDisableAutoplayValue);
    applyPlaylistEnabled(!!enabledHidePlaylistValue);
    applyCommentsEnabled(!!enabledHideCommentsValue);
    applyDanmakuEnabled(!!enabledHideDanmakuValue);
    applyThumbnailsEnabled(!!enabledHideThumbnailsValue);
    applyVideoInfoEnabled(!!enabledHideVideoInfoValue);
    applyChannelInfoEnabled(!!enabledHideChannelInfoValue);
    applyAdsEnabled(!!enabledHideAdsValue);
    applyHeaderEnabled(!!enabledHideHeaderValue);
  }

  function initMessageListener() {
    const api = getApi();
    if (!api?.runtime?.onMessage?.addListener) return;
    api.runtime.onMessage.addListener((msg) => {
      if (!msg || typeof msg !== "object") return;
      if (msg.type === "SET_HIDE_HOME_FEED") {
        applyHomeFeedEnabled(!!msg.enabled);
      } else if (msg.type === "SET_HIDE_SIDEBAR") {
        applySidebarEnabled(!!msg.enabled);
      } else if (msg.type === "SET_HIDE_END_SCREEN_FEED") {
        applyEndScreenFeedEnabled(!!msg.enabled);
      } else if (msg.type === "SET_DISABLE_AUTOPLAY") {
        applyDisableAutoplayEnabled(!!msg.enabled);
      } else if (msg.type === "SET_HIDE_PLAYLIST") {
        applyPlaylistEnabled(!!msg.enabled);
      } else if (msg.type === "SET_HIDE_COMMENTS") {
        applyCommentsEnabled(!!msg.enabled);
      } else if (msg.type === "SET_HIDE_DANMAKU") {
        applyDanmakuEnabled(!!msg.enabled);
      } else if (msg.type === "SET_HIDE_THUMBNAILS") {
        applyThumbnailsEnabled(!!msg.enabled);
      } else if (msg.type === "SET_HIDE_VIDEO_INFO") {
        applyVideoInfoEnabled(!!msg.enabled);
      } else if (msg.type === "SET_HIDE_CHANNEL_INFO") {
        applyChannelInfoEnabled(!!msg.enabled);
      } else if (msg.type === "SET_HIDE_ADS") {
        applyAdsEnabled(!!msg.enabled);
      } else if (msg.type === "SET_HIDE_HEADER") {
        applyHeaderEnabled(!!msg.enabled);
      }
    });
  }

  function applyHomeFeedEnabled(nextEnabled) {
    enabledHomeFeed = !!nextEnabled;
    setFeed2Hidden(enabledHomeFeed);
  }

  function applySidebarEnabled(nextEnabled) {
    enabledSidebar = !!nextEnabled;
    setSidebarHidden(enabledSidebar);
  }

  function applyEndScreenFeedEnabled(nextEnabled) {
    enabledEndScreenFeed = !!nextEnabled;
    setEndScreenFeedHidden(enabledEndScreenFeed);
  }

  function applyDisableAutoplayEnabled(nextEnabled) {
    enabledDisableAutoplay = !!nextEnabled;
    if (enabledDisableAutoplay) {
      toggleAutoplaySwitch(true);
      startObservingAutoplay();
    } else {
      toggleAutoplaySwitch(false);
      stopObservingAutoplay();
    }
  }

  function applyPlaylistEnabled(nextEnabled) {
    enabledHidePlaylist = !!nextEnabled;
    setPlaylistHidden(enabledHidePlaylist);
  }

  function applyCommentsEnabled(nextEnabled) {
    enabledHideComments = !!nextEnabled;
    setCommentsHidden(enabledHideComments);
  }

  function turnOffDanmaku() {
    const inputs = document.querySelectorAll(".bui-danmaku-switch-input:checked");
    inputs.forEach((el) => el.click());
  }

  function startObservingDanmaku() {
    if (danmakuObserver) return;
    danmakuObserver = new MutationObserver(() => {
      if (enabledHideDanmaku) turnOffDanmaku();
    });
    danmakuObserver.observe(document.documentElement, { childList: true, subtree: true });
  }

  function stopObservingDanmaku() {
    if (!danmakuObserver) return;
    danmakuObserver.disconnect();
    danmakuObserver = null;
  }

  function applyHeaderEnabled(nextEnabled) {
    enabledHideHeader = !!nextEnabled;
    setHeaderHidden(enabledHideHeader);
  }

  function applyAdsEnabled(nextEnabled) {
    enabledHideAds = !!nextEnabled;
    setAdsHidden(enabledHideAds);
  }

  function applyChannelInfoEnabled(nextEnabled) {
    enabledHideChannelInfo = !!nextEnabled;
    setChannelInfoHidden(enabledHideChannelInfo);
  }

  function applyVideoInfoEnabled(nextEnabled) {
    enabledHideVideoInfo = !!nextEnabled;
    setVideoInfoHidden(enabledHideVideoInfo);
  }

  function applyThumbnailsEnabled(nextEnabled) {
    enabledHideThumbnails = !!nextEnabled;
    setThumbnailsHidden(enabledHideThumbnails);
  }

  function applyDanmakuEnabled(nextEnabled) {
    enabledHideDanmaku = !!nextEnabled;
    if (enabledHideDanmaku) {
      turnOffDanmaku();
      startObservingDanmaku();
    } else {
      stopObservingDanmaku();
    }
  }

  function init() {
    initMessageListener();
    initSettings();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();



