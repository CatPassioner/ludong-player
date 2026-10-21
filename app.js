const APP_NAME = "LudongPlayer";
let DEFAULT_PLAYLIST = [];

/** 本机桌面/127.0.0.1：完整功能；公网网站：登录 + 云端曲库 */
const IS_LOCAL_HOST = (() => {
  const host = String(location.hostname || "").toLowerCase();
  return (
    host === "127.0.0.1" ||
    host === "localhost" ||
    host === "::1" ||
    host === ""
  );
})();
const IS_WEB_SITE = !IS_LOCAL_HOST;

const audio = document.getElementById("audio");
const els = {
  playlist: document.getElementById("playlist"),
  songCount: document.getElementById("songCount"),
  newPlaylistBtn: document.getElementById("newPlaylistBtn"),
  playlistPickLayer: document.getElementById("playlistPickLayer"),
  playlistPickTitle: document.getElementById("playlistPickTitle"),
  playlistPickList: document.getElementById("playlistPickList"),
  playlistPickCancel: document.getElementById("playlistPickCancel"),
  title: document.getElementById("title"),
  artist: document.getElementById("artist"),
  cover: document.getElementById("cover"),
  disc: document.getElementById("disc"),
  stage: document.getElementById("stage"),
  discView: document.getElementById("discView"),
  lyricsView: document.getElementById("lyricsView"),
  lyricsArt: document.getElementById("lyricsArt"),
  lyricsSide: document.getElementById("lyricsSide"),
  lyricsBoard: document.getElementById("lyricsBoard"),
  lyricsWindow: document.getElementById("lyricsWindow"),
  lyricsTrack: document.getElementById("lyricsTrack"),
  lyricEmpty: document.getElementById("lyricEmpty"),
  lyricsBgImg: document.getElementById("lyricsBgImg"),
  lyricsAmbientImg: document.getElementById("lyricsAmbientImg"),
  playBtn: document.getElementById("playBtn"),
  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
  playerLike: document.getElementById("playerLike"),
  playerComment: document.getElementById("playerComment"),
  modes: document.getElementById("modes"),
  seek: document.getElementById("seek"),
  seekWrap: document.getElementById("seekWrap"),
  seekFill: document.getElementById("seekFill"),
  seekThumb: document.getElementById("seekThumb"),
  seekThumbGif: document.getElementById("seekThumbGif"),
  seekPanels: document.getElementById("seekPanels"),
  currentTime: document.getElementById("currentTime"),
  duration: document.getElementById("duration"),
  nowCard: document.getElementById("nowCard"),
  nowCover: document.getElementById("nowCover"),
  nowTitle: document.getElementById("nowTitle"),
  nowArtist: document.getElementById("nowArtist"),
  nowToggle: document.getElementById("nowToggle"),
  nowPrev: document.getElementById("nowPrev"),
  nowNext: document.getElementById("nowNext"),
  nowSeekWrap: document.getElementById("nowSeekWrap"),
  nowSeekFill: document.getElementById("nowSeekFill"),
  nowSeek: document.getElementById("nowSeek"),
  nowCurrentTime: document.getElementById("nowCurrentTime"),
  nowDuration: document.getElementById("nowDuration"),
  searchForm: document.getElementById("searchForm"),
  searchInput: document.getElementById("searchInput"),
  searchSuggest: document.getElementById("searchSuggest"),
  searchBtn: document.getElementById("searchBtn"),
  searchHint: document.getElementById("searchHint"),
  playerLayer: document.getElementById("playerLayer"),
  playerWindow: document.getElementById("playerWindow"),
  playerAmbientImg: document.getElementById("playerAmbientImg"),
  playerFit: document.getElementById("playerFit"),
  playerBoard: document.getElementById("playerBoard"),
  playerClose: document.getElementById("playerClose"),
  mvToggleBtn: document.getElementById("mvToggleBtn"),
  mvView: document.getElementById("mvView"),
  mvVideo: document.getElementById("mvVideo"),
  mvEmpty: document.getElementById("mvEmpty"),
  mvFrame: document.getElementById("mvFrame"),
  mvCcBtn: document.getElementById("mvCcBtn"),
  mvSourceBtn: document.getElementById("mvSourceBtn"),
  mvLyric: document.getElementById("mvLyric"),
  mvLyricCurrent: document.getElementById("mvLyricCurrent"),
  coverPickBtn: document.getElementById("coverPickBtn"),
  coverPickLayer: document.getElementById("coverPickLayer"),
  coverPickGrid: document.getElementById("coverPickGrid"),
  coverPickUploadBtn: document.getElementById("coverPickUploadBtn"),
  coverPickSongBtn: document.getElementById("coverPickSongBtn"),
  coverPickFile: document.getElementById("coverPickFile"),
  coverPickCancel: document.getElementById("coverPickCancel"),
  coverPickSave: document.getElementById("coverPickSave"),
  playerBackdrop: document.getElementById("playerBackdrop"),
  app: document.getElementById("app"),
  homeSettings: document.getElementById("homeSettings"),
  settingsBtn: document.getElementById("settingsBtn"),
  settingsPanel: document.getElementById("settingsPanel"),
  navRail: document.getElementById("navRail"),
  mainPane: document.getElementById("mainPane"),
  viewHome: document.getElementById("viewHome"),
  navAvatar: document.getElementById("navAvatar"),
  navName: document.getElementById("navName"),
  navUserNo: document.getElementById("navUserNo"),
  navUserBtn: document.getElementById("navUserBtn"),
  navHomeBtn: document.getElementById("navHomeBtn"),
  menuSettingsBackBtn: document.getElementById("menuSettingsBackBtn"),
  bgLightness: document.getElementById("bgLightness"),
  bgBlack: document.getElementById("bgBlack"),
  bgWhite: document.getElementById("bgWhite"),
  bgPreview: document.getElementById("bgPreview"),
  cloudUploadBtn: document.getElementById("cloudUploadBtn"),
  cloudUploadInput: document.getElementById("cloudUploadInput"),
  cloudUploadStatus: document.getElementById("cloudUploadStatus"),
  importMp3Btn: document.getElementById("importMp3Btn"),
  importLrcBtn: document.getElementById("importLrcBtn"),
  importVideoBtn: document.getElementById("importVideoBtn"),
  importAnyBtn: document.getElementById("importAnyBtn"),
  importMp3Input: document.getElementById("importMp3Input"),
  importLrcInput: document.getElementById("importLrcInput"),
  importVideoInput: document.getElementById("importVideoInput"),
  importAnyInput: document.getElementById("importAnyInput"),
  importStatus: document.getElementById("importStatus"),
  wallpaperScreenHint: document.getElementById("wallpaperScreenHint"),
  wallpaperLibrary: document.getElementById("wallpaperLibrary"),
  wallpaperLibraryEmpty: document.getElementById("wallpaperLibraryEmpty"),
  wallpaperLibraryGrid: document.getElementById("wallpaperLibraryGrid"),
  wallpaperPickBtn: document.getElementById("wallpaperPickBtn"),
  wallpaperApplyBtn: document.getElementById("wallpaperApplyBtn"),
  wallpaperRestoreBtn: document.getElementById("wallpaperRestoreBtn"),
  wallpaperFileInput: document.getElementById("wallpaperFileInput"),
  wallpaperStatus: document.getElementById("wallpaperStatus"),
  checkUpdateBtn: document.getElementById("checkUpdateBtn"),
  updateStatus: document.getElementById("updateStatus"),
  appVersionLabel: document.getElementById("appVersionLabel"),
  updateLayer: document.getElementById("updateLayer"),
  updateBackdrop: document.getElementById("updateBackdrop"),
  updateTitle: document.getElementById("updateTitle"),
  updateMsg: document.getElementById("updateMsg"),
  updateLaterBtn: document.getElementById("updateLaterBtn"),
  updateNowBtn: document.getElementById("updateNowBtn"),
  rankTrack: document.getElementById("rankTrack"),
  rankSub: document.getElementById("rankSub"),
  likesEntry: document.getElementById("likesEntry"),
  likesCountLabel: document.getElementById("likesCountLabel"),
  likesLayer: document.getElementById("likesLayer"),
  likesBackdrop: document.getElementById("likesBackdrop"),
  likesBack: document.getElementById("likesBack"),
  likesList: document.getElementById("likesList"),
  likesPanelCount: document.getElementById("likesPanelCount"),
  commentsLayer: document.getElementById("commentsLayer"),
  commentsBackdrop: document.getElementById("commentsBackdrop"),
  commentsBack: document.getElementById("commentsBack"),
  commentsList: document.getElementById("commentsList"),
  commentsForm: document.getElementById("commentsForm"),
  commentsInput: document.getElementById("commentsInput"),
  commentsSend: document.getElementById("commentsSend"),
  commentsHint: document.getElementById("commentsHint"),
  commentsReplyBar: document.getElementById("commentsReplyBar"),
  commentsReplyLabel: document.getElementById("commentsReplyLabel"),
  commentsReplyCancel: document.getElementById("commentsReplyCancel"),
  commentsSongLabel: document.getElementById("commentsSongLabel"),
  commentsCountLabel: document.getElementById("commentsCountLabel"),
  commentsSortTime: document.getElementById("commentsSortTime"),
  commentsSortLikes: document.getElementById("commentsSortLikes"),
  commentsEmojiBtn: document.getElementById("commentsEmojiBtn"),
  commentsEmojiPanel: document.getElementById("commentsEmojiPanel"),
  commentsEmojiBody: document.getElementById("commentsEmojiBody"),
  commentsStickerFile: document.getElementById("commentsStickerFile"),
  commentUserMenu: document.getElementById("commentUserMenu"),
  chatEntry: document.getElementById("chatEntry"),
  chatEntrySub: document.getElementById("chatEntrySub"),
  chatEntryBadge: document.getElementById("chatEntryBadge"),
  chatLayer: document.getElementById("chatLayer"),
  chatBackdrop: document.getElementById("chatBackdrop"),
  chatBack: document.getElementById("chatBack"),
  chatTitle: document.getElementById("chatTitle"),
  chatPeerStatus: document.getElementById("chatPeerStatus"),
  chatPeerCount: document.getElementById("chatPeerCount"),
  chatNewGroupBtn: document.getElementById("chatNewGroupBtn"),
  chatGroupLayer: document.getElementById("chatGroupLayer"),
  chatGroupModalTitle: document.getElementById("chatGroupModalTitle"),
  chatGroupNameInput: document.getElementById("chatGroupNameInput"),
  chatGroupPickHint: document.getElementById("chatGroupPickHint"),
  chatGroupPickList: document.getElementById("chatGroupPickList"),
  chatGroupError: document.getElementById("chatGroupError"),
  chatGroupCancel: document.getElementById("chatGroupCancel"),
  chatGroupConfirm: document.getElementById("chatGroupConfirm"),
  chatPeers: document.getElementById("chatPeers"),
  chatTabFriends: document.getElementById("chatTabFriends"),
  chatTabAdd: document.getElementById("chatTabAdd"),
  chatPanelFriends: document.getElementById("chatPanelFriends"),
  chatPanelAdd: document.getElementById("chatPanelAdd"),
  chatRequestBadge: document.getElementById("chatRequestBadge"),
  chatSearchForm: document.getElementById("chatSearchForm"),
  chatSearchInput: document.getElementById("chatSearchInput"),
  chatSearchBtn: document.getElementById("chatSearchBtn"),
  chatSearchResults: document.getElementById("chatSearchResults"),
  chatRequests: document.getElementById("chatRequests"),
  chatMessages: document.getElementById("chatMessages"),
  chatForm: document.getElementById("chatForm"),
  chatInput: document.getElementById("chatInput"),
  chatSend: document.getElementById("chatSend"),
  chatHint: document.getElementById("chatHint"),
  chatEmojiBtn: document.getElementById("chatEmojiBtn"),
  chatEmojiPanel: document.getElementById("chatEmojiPanel"),
  chatEmojiBody: document.getElementById("chatEmojiBody"),
  chatStickerFile: document.getElementById("chatStickerFile"),
  msgCtxMenu: document.getElementById("msgCtxMenu"),
  chatForwardLayer: document.getElementById("chatForwardLayer"),
  chatForwardList: document.getElementById("chatForwardList"),
  chatForwardCancel: document.getElementById("chatForwardCancel"),
  friendCtxMenu: document.getElementById("friendCtxMenu"),
  authLayer: document.getElementById("authLayer"),
  authForm: document.getElementById("authForm"),
  authTabLogin: document.getElementById("authTabLogin"),
  authTabRegister: document.getElementById("authTabRegister"),
  authDisplayName: document.getElementById("authDisplayName"),
  authEmail: document.getElementById("authEmail"),
  authEmailSuggest: document.getElementById("authEmailSuggest"),
  authPassword: document.getElementById("authPassword"),
  authHint: document.getElementById("authHint"),
  authSubmit: document.getElementById("authSubmit"),
  authLocalBtn: document.getElementById("authLocalBtn"),
  authFace: document.getElementById("authFace"),
  authFaceMeta: document.getElementById("authFaceMeta"),
  authAvatarField: document.getElementById("authAvatarField"),
  authAvatarPicker: document.getElementById("authAvatarPicker"),
  authAvatarUploadBtn: document.getElementById("authAvatarUploadBtn"),
  authAvatarFile: document.getElementById("authAvatarFile"),
  accountNameLabel: document.getElementById("accountNameLabel"),
  accountUserNo: document.getElementById("accountUserNo"),
  profileOpenBtn: document.getElementById("profileOpenBtn"),
  profileLayer: document.getElementById("profileLayer"),
  profileBackdrop: document.getElementById("profileBackdrop"),
  profileBackBtn: document.getElementById("profileBackBtn"),
  profileEditAvatar: document.getElementById("profileEditAvatar"),
  profileEditName: document.getElementById("profileEditName"),
  profileEditSub: document.getElementById("profileEditSub"),
  profileAvatarPicker: document.getElementById("profileAvatarPicker"),
  profileAvatarUploadBtn: document.getElementById("profileAvatarUploadBtn"),
  profileAvatarFile: document.getElementById("profileAvatarFile"),
  profileNameInput: document.getElementById("profileNameInput"),
  profileTitleField: document.getElementById("profileTitleField"),
  profileTitleInput: document.getElementById("profileTitleInput"),
  profileSaveBtn: document.getElementById("profileSaveBtn"),
  profileOldPassword: document.getElementById("profileOldPassword"),
  profileNewPassword: document.getElementById("profileNewPassword"),
  profileNewPassword2: document.getElementById("profileNewPassword2"),
  profilePasswordBtn: document.getElementById("profilePasswordBtn"),
  profileStatus: document.getElementById("profileStatus"),
  logoutBtn: document.getElementById("logoutBtn"),
  appRoot: document.getElementById("app"),
  confirmLayer: document.getElementById("confirmLayer"),
  confirmBackdrop: document.getElementById("confirmBackdrop"),
  confirmMsg: document.getElementById("confirmMsg"),
  confirmCancel: document.getElementById("confirmCancel"),
  confirmOk: document.getElementById("confirmOk")
};

let playlist = [];
let currentIndex = -1;
let playQueueKind = "";
let playQueueIds = [];
let mode = "list";
let seeking = false;
let seekPercent = 0;
let searchTimer = null;
let audiusHost = null;
let showLyrics = false;
let showMv = false;
let mvPreferSong = false;
const DEFAULT_MV_URL = "./mv/default.mp4?v=2k";
try {
  mvPreferSong = localStorage.getItem("ludong-mv-source") === "song";
} catch {
  mvPreferSong = false;
}
let showMvCaptions = true;
try {
  const savedCc = localStorage.getItem("ludong-mv-cc");
  if (savedCc === "0") showMvCaptions = false;
  if (savedCc === "1") showMvCaptions = true;
} catch {
  /* ignore */
}
let lyricLines = []; // { time, text }
let activeLyricIndex = -1;
let lyricsRaf = 0;
let lyricsManualUntil = 0;
let lyricsDetached = false;
let lyricsAutoScrolling = false;
const MV_EXTS = [".mp4", ".webm", ".mkv", ".mov", ".m4v", ".acc"];
const mvProbeCache = new Map(); // song.id -> url | ""
const lyricsCache = new Map();
/** 歌词解析版本：增强 LRC 逻辑变更时递增，避免沿用旧的一字一行缓存 */
const LYRICS_PARSE_VER = "w3";

function lyricsCacheKey(song) {
  if (!song) return "";
  return [
    song.id || playStatKey(song) || "",
    LYRICS_PARSE_VER,
    song.lrcUrl || song.lrcFile || ""
  ].join("::");
}
let lyricsBgList = [];
let playRanking = [];
let lastCountedPlayKey = "";
let likedSongs = {}; // key -> song meta
const LIKES_KEY_BASE = "ludong-likes-v1";
const COMMENTS_KEY_BASE = "ludong-comments-v1";
const PLAY_STATS_KEY_BASE = "ludong-play-stats-v1";

function currentLibraryUserId() {
  try {
    // 优先用登录时写入的活跃账号 ID（不依赖 isLoggedIn 时序）
    const active = window.LudongCloud?.getActiveUserId?.() || "";
    if (active) return active;
    const id = window.LudongCloud?.currentUserIdSync?.() || "";
    if (id) return id;
  } catch {
    /* ignore */
  }
  if (!window.LudongCloud?.enabled?.()) return "local";
  return "";
}

const PLAYLISTS_REV_KEY = "ludong-playlists-rev";
const LIKES_REV_KEY = "ludong-likes-rev";
const SYNC_SEEDED_KEY = "ludong-sync-seeded";
let userSyncing = false;
let userSyncTimer = 0;

function readSyncRev(key) {
  const n = Number(localStorage.getItem(scopedStorageKey(key)) || 0);
  return Number.isFinite(n) ? n : 0;
}

function bumpSyncRev(key) {
  const n = Date.now();
  try {
    localStorage.setItem(scopedStorageKey(key), String(n));
  } catch {
    /* ignore */
  }
  return n;
}

function scheduleUserSync() {
  if (userSyncing || !currentLibraryUserId()) return;
  clearTimeout(userSyncTimer);
  userSyncTimer = setTimeout(() => {
    pushUserSync().catch(() => {});
  }, 700);
}

function scopedStorageKey(base) {
  const uid = currentLibraryUserId();
  // 始终带账号后缀，避免未登录/切换瞬间写进公共桶导致串号
  return `${base}:${uid || "__guest__"}`;
}

function withUserQuery(url) {
  const uid = currentLibraryUserId();
  if (!uid) return url;
  const join = url.includes("?") ? "&" : "?";
  return `${url}${join}userId=${encodeURIComponent(uid)}`;
}

/** 切换/退出账号时清空与数字统计相关的界面状态 */
function resetAccountScopedUi() {
  playRanking = [];
  likedSongs = {};
  commentsCache = {};
  lastCountedPlayKey = "";
  chatUnreadByPeer = {};
  chatUnreadTotal = 0;
  chatPeerLastReadAt = {};
  chatActivePeerId = "";
  chatActiveKind = "dm";
  chatMessagesCache = [];
  chatLastMsgIso = "";
  chatLastReadPollIso = "";
  chatLastRecallPollIso = "";
  chatFriendsCache = [];
  chatGroupsCache = [];
  chatPeersCache = [];
  chatThreadByPeer.clear?.();
  chatLoadGen += 1;
  stopChatPoll();
  stopChatInboxPoll();
  stopPresenceHeartbeat();
  stopListenTogetherPoll();
  clearListenTogetherLocal();
  updateChatEntryBadge();
  updateChatPeerStatus();
  try {
    expandedCommentReplies.clear();
  } catch {
    /* 尚未初始化时忽略 */
  }
  try {
    clearCommentReplyTarget();
  } catch {
    /* ignore */
  }
  try {
    renderRankRow([]);
  } catch {
    /* ignore */
  }
  try {
    updateLikesCountLabel();
  } catch {
    /* ignore */
  }
  try {
    renderLikesList?.();
  } catch {
    /* ignore */
  }
  if (els.rankSub) els.rankSub.textContent = "播完才计 1 次";
  if (els.likesCountLabel) els.likesCountLabel.textContent = "0 首";
  if (els.likesPanelCount) els.likesPanelCount.textContent = "0 首";
  try {
    refreshDiaryEntrySub?.();
  } catch {
    /* ignore */
  }
  try {
    refreshMoodRadioCard?.();
  } catch {
    /* ignore */
  }
  try {
    hydrateShellBackground();
  } catch {
    /* 背景图函数尚未就绪时忽略 */
  }
}

let mediaCacheBust = String(Date.now());

function mediaFileUrl(base, relPath) {
  const cleaned = String(relPath || "")
    .replace(/^(\.\/)?music\//, "")
    .replace(/^(\.\/)?userdata\/[^/]+\/music\//, "")
    .replace(/^\/+/, "");
  const root = String(base || "music").replace(/^\/+|\/+$/g, "") || "music";
  const path =
    "./" +
    root
      .split("/")
      .filter(Boolean)
      .map((seg) => encodeURIComponent(seg))
      .join("/") +
    "/" +
    cleaned
      .split("/")
      .filter(Boolean)
      .map((seg) => encodeURIComponent(seg))
      .join("/");
  const bust = encodeURIComponent(mediaCacheBust || "1");
  return `${path}?v=${bust}`;
}

function musicFileUrl(relPath) {
  return mediaFileUrl("music", relPath);
}

function normalizeLocalSong(item) {
  const scope = item.scope === "user" ? "user" : "shared";
  const base =
    item.base ||
    (scope === "user" && currentLibraryUserId()
      ? `userdata/${currentLibraryUserId()}/music`
      : "music");
  const file = item.file || item.url || "";
  const rel = String(file)
    .replace(/^(\.\/)?music\//, "")
    .replace(/^(\.\/)?userdata\/[^/]+\/music\//, "");
  const name = rel.split("/").pop();
  // playlist.lrc 可能暂时为空（旧扫盘不认 srt），仍按 mp3 旁 .lrc/.srt 探测
  let lrcRel = String(item.lrc || "").trim();
  if (!lrcRel && rel) {
    lrcRel = rel.replace(/\.mp3$/i, ".lrc");
  }
  const coverRel = String(item.cover || "")
    .replace(/^(\.\/)?music\//, "")
    .replace(/^(\.\/)?userdata\/[^/]+\/music\//, "")
    .trim();
  let cover = coverRel;
  if (cover && !/^https?:\/\//i.test(cover)) {
    cover = mediaFileUrl(base, cover);
  }
  if (!cover) {
    cover = "./logo.jpg";
  }
  const videoRel = String(item.video || "")
    .replace(/^(\.\/)?music\//, "")
    .replace(/^(\.\/)?userdata\/[^/]+\/music\//, "")
    .trim();
  return {
    id: item.id || `${scope}-${rel}`,
    title: item.title || String(name).replace(/\.mp3$/i, ""),
    artist: item.artist || "未知歌手",
    cover,
    coverRel,
    fileRel: rel,
    videoRel,
    base,
    scope,
    url: mediaFileUrl(base, rel),
    lrcUrl: lrcRel ? mediaFileUrl(base, lrcRel) : "",
    lrcFile: lrcRel,
    videoUrl: videoRel ? mediaFileUrl(base, videoRel) : "",
    duration: item.duration || 0,
    local: true,
    cloud: false,
    canDelete: !!(rel && (scope === "user" || scope === "shared"))
  };
}

function normalizeCloudSong(row) {
  const api = window.LudongCloud;
  const audioPath = String(row?.audio_path || "");
  const coverPath = String(row?.cover_path || "");
  const lrcPath = String(row?.lrc_path || "");
  const videoPath = String(row?.video_path || "");
  const url = api?.storagePublicUrl?.(audioPath) || "";
  const cover = coverPath
    ? api?.storagePublicUrl?.(coverPath) || "./logo.jpg"
    : "./logo.jpg";
  const lrcUrl = lrcPath ? api?.storagePublicUrl?.(lrcPath) || "" : "";
  const videoUrl = videoPath ? api?.storagePublicUrl?.(videoPath) || "" : "";
  const me = api?.getActiveUserId?.() || api?.currentUserIdSync?.() || "";
  const uploaderId = String(row?.uploader_id || "");
  return {
    id: `cloud-${row.id}`,
    cloudId: String(row.id || ""),
    title: String(row.title || "未命名"),
    artist: String(row.artist || "未知歌手"),
    cover,
    coverRel: coverPath,
    fileRel: audioPath,
    videoRel: videoPath,
    base: "cloud",
    scope: "cloud",
    url,
    lrcUrl,
    lrcFile: lrcPath,
    videoUrl,
    duration: Number(row.duration) || 0,
    local: false,
    cloud: true,
    uploaderId,
    canDelete: !!(me && uploaderId && me === uploaderId)
  };
}

async function loadDiskPlaylist() {
  const api = withUserQuery("/api/playlist");
  try {
    const res = await fetch(api, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data?.ok && Array.isArray(data.songs)) {
        return data.songs.map(normalizeLocalSong);
      }
    }
  } catch {
    /* fallback below */
  }
  const res = await fetch("./music/playlist.json", { cache: "no-store" });
  if (!res.ok) throw new Error("playlist missing");
  const text = await res.text();
  const clean = text.replace(/^\uFEFF/, "");
  const data = JSON.parse(clean);
  return (Array.isArray(data) ? data : []).map((item) =>
    normalizeLocalSong({ ...item, scope: "shared", base: "music" })
  );
}

async function loadCloudPlaylist() {
  const api = window.LudongCloud;
  if (!api?.listCloudSongs) return [];
  if (typeof api.enabled === "function" && !api.enabled()) return [];
  try {
    const rows = await api.listCloudSongs();
    return (Array.isArray(rows) ? rows : []).map(normalizeCloudSong);
  } catch (err) {
    console.warn("loadCloudPlaylist", err);
    return [];
  }
}

async function loadLocalPlaylist() {
  if (IS_WEB_SITE) {
    return loadCloudPlaylist();
  }
  const [disk, cloud] = await Promise.all([
    loadDiskPlaylist().catch(() => []),
    loadCloudPlaylist()
  ]);
  const cloudKeys = new Set(cloud.map((s) => playStatKey(s)));
  const filteredDisk = disk.filter((s) => !cloudKeys.has(playStatKey(s)));
  return [...cloud, ...filteredDisk];
}

function applyWebSiteMode() {
  if (!IS_WEB_SITE) return;
  document.body.classList.add("is-web-site");
  if (els.authLocalBtn) {
    els.authLocalBtn.textContent = "先听云端歌（无需登录）";
  }
  const note = document.querySelector(".auth-local-note");
  if (note) {
    note.textContent =
      "网站版只播云端共同曲库；私人歌、壁纸和软件更新请用本机桌面版。";
  }
}

function formatTime(seconds) {
  const s = Math.max(0, Math.floor(seconds || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r < 10 ? "0" : ""}${r}`;
}

function setHint(text, isError = false) {
  els.searchHint.textContent = text || "";
  els.searchHint.classList.toggle("is-error", isError);
}

function playStatKey(song) {
  const title = String(song?.title || "").trim().toLowerCase();
  const artist = String(song?.artist || "").trim().toLowerCase();
  if (title || artist) return `${title}|${artist}`;
  return String(song?.id || "unknown");
}

function readLocalLikes() {
  try {
    const raw = localStorage.getItem(scopedStorageKey(LIKES_KEY_BASE));
    const data = raw ? JSON.parse(raw) : null;
    if (!data || typeof data !== "object") return {};
    return data.songs && typeof data.songs === "object" ? data.songs : {};
  } catch {
    return {};
  }
}

function writeLocalLikes(songs) {
  try {
    localStorage.setItem(
      scopedStorageKey(LIKES_KEY_BASE),
      JSON.stringify({ version: 1, songs })
    );
  } catch {
    /* ignore */
  }
  if (!userSyncing) {
    bumpSyncRev(LIKES_REV_KEY);
    scheduleUserSync();
  }
}

function isSongLiked(song) {
  if (!song) return false;
  const key = playStatKey(song);
  if (likedSongs[key]) return true;
  if (song.id) {
    return Object.values(likedSongs).some((s) => String(s.id) === String(song.id));
  }
  return false;
}

function likesCount() {
  return Object.keys(likedSongs).length;
}

function updateLikesCountLabel() {
  const n = likesCount();
  const text = `${n} 首`;
  if (els.likesCountLabel) els.likesCountLabel.textContent = text;
  if (els.likesPanelCount) els.likesPanelCount.textContent = text;
}

function songToLikePayload(song) {
  const coverRaw = String(song.cover || "");
  return {
    key: playStatKey(song),
    id: song.id || "",
    title: song.title || "",
    artist: song.artist || "",
    cover: coverRaw,
    coverRel: song.coverRel || normalizeCoverRel(coverRaw),
    fileRel: song.fileRel || "",
    lrcFile: song.lrcFile || "",
    url: song.url || "",
    base: song.base || "music",
    scope: song.scope || "shared",
    local: !!song.local,
    userId: currentLibraryUserId(),
    likedAt: Date.now()
  };
}

function coverUrlFromLike(item) {
  if (item?.cover && (/^https?:\/\//i.test(item.cover) || item.cover.startsWith("./") || item.cover.startsWith("blob:"))) {
    return item.cover;
  }
  const rel = normalizeCoverRel(item?.coverRel || item?.cover || "");
  if (!rel) return "./logo.jpg";
  if (/^https?:\/\//i.test(rel) || rel.startsWith("./")) return rel;
  return mediaFileUrl(item?.base || "music", rel);
}

function renderLikesList() {
  if (!els.likesList) return;
  updateLikesCountLabel();
  const rows = Object.entries(likedSongs)
    .map(([key, item]) => ({ key, ...item }))
    .sort(
      (a, b) =>
        (Number(b.likedAt) || 0) - (Number(a.likedAt) || 0) ||
        String(a.title).localeCompare(String(b.title), "zh")
    );
  if (!rows.length) {
    els.likesList.innerHTML =
      '<li class="empty-tip">还没有喜欢的歌<br/>在歌单里点小爱心即可收藏</li>';
    return;
  }
  els.likesList.innerHTML = rows
    .map(
      (item) => `
    <li class="likes-item" data-like-key="${escapeHtml(item.key || "")}" data-like-id="${escapeHtml(
        item.id || ""
      )}">
      <img src="${coverUrlFromLike(item)}" alt="" loading="lazy" />
      <div class="likes-item-meta">
        <div class="likes-item-title">${escapeHtml(item.title || "未知歌曲")}</div>
        <div class="likes-item-artist">${escapeHtml(item.artist || "未知歌手")}</div>
      </div>
      <span class="likes-item-heart" aria-hidden="true">♥</span>
    </li>`
    )
    .join("");
}

function openLikesLayer() {
  openPlaylistDetail({ kind: "likes" });
}

function closeLikesLayer() {
  if (playlistDetailState?.kind === "likes") closePlaylistDetail();
}

async function loadLikes() {
  if (window.LudongCloud?.enabled?.() && !currentLibraryUserId()) {
    likedSongs = {};
    updateLikesCountLabel();
    return;
  }
  likedSongs = readLocalLikes();
  try {
    const res = await fetch(withUserQuery("/api/likes"), { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const serverSongs = data.songs || {};
      likedSongs = { ...likedSongs, ...serverSongs };
      // local wins on conflict by keeping both merged; prefer newer likedAt
      for (const [key, item] of Object.entries(serverSongs)) {
        const local = likedSongs[key];
        if (
          local &&
          (Number(local.likedAt) || 0) >= (Number(item.likedAt) || 0)
        ) {
          likedSongs[key] = local;
        } else {
          likedSongs[key] = item;
        }
      }
      writeLocalLikes(likedSongs);
    }
  } catch {
    /* local only */
  }
  updateLikesCountLabel();
}

async function toggleLikeSong(song, forceLiked) {
  if (!song) return;
  if (window.LudongCloud?.enabled?.() && !currentLibraryUserId()) {
    setHint("请先登录后再收藏", true);
    return;
  }
  const key = playStatKey(song);
  const next =
    typeof forceLiked === "boolean" ? forceLiked : !isSongLiked(song);

  if (next) {
    likedSongs[key] = songToLikePayload(song);
  } else {
    delete likedSongs[key];
    if (song.id) {
      for (const [k, item] of Object.entries(likedSongs)) {
        if (String(item.id) === String(song.id)) delete likedSongs[k];
      }
    }
  }
  writeLocalLikes(likedSongs);
  updateLikesCountLabel();
  // 同步爱心按钮状态
  document.querySelectorAll(".song-like").forEach((btn) => {
    const idx = Number(btn.dataset.index);
    const s = playlist[idx];
    if (!s) return;
    const on = isSongLiked(s);
    btn.classList.toggle("is-liked", on);
    btn.setAttribute("aria-label", on ? "取消喜欢" : "喜欢");
    btn.title = on ? "取消喜欢" : "喜欢";
  });
  syncPlayerLikeButton(song);
  renderList();

  try {
    await fetch(withUserQuery("/api/likes"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...songToLikePayload(song), liked: next })
    });
  } catch {
    /* ignore */
  }
}

function syncPlayerLikeButton(song = playlist[currentIndex]) {
  if (!els.playerLike) return;
  const on = isSongLiked(song);
  els.playerLike.classList.toggle("is-liked", on);
  els.playerLike.setAttribute("aria-label", on ? "取消喜欢" : "喜欢");
  els.playerLike.title = on ? "取消喜欢" : "喜欢";
}

function formatCommentTime(ms) {
  const t = Number(ms) || Date.now();
  const d = new Date(t);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

const COMMENTS_KEY_LEGACY = "ludong-comments-v1";
let commentsCache = {};
let commentsSongKey = "";
let commentsLoading = false;

function readLocalCommentsMap() {
  try {
    const raw = localStorage.getItem(scopedStorageKey(COMMENTS_KEY_BASE));
    const data = raw ? JSON.parse(raw) : null;
    if (!data || typeof data !== "object") return {};
    return data.songs && typeof data.songs === "object" ? data.songs : {};
  } catch {
    return {};
  }
}

function writeLocalCommentsMap(songs) {
  try {
    localStorage.setItem(
      scopedStorageKey(COMMENTS_KEY_BASE),
      JSON.stringify({ version: 1, songs })
    );
  } catch {
    /* ignore */
  }
}

function persistCommentsForKey(key, rows) {
  commentsCache[key] = rows;
  const map = readLocalCommentsMap();
  map[key] = rows;
  writeLocalCommentsMap(map);
}

function normalizeCommentItem(item) {
  if (!item || !item.text) return null;
  const liked = !!item.liked;
  const hearted = !!item.hearted;
  return {
    id: String(item.id || ""),
    text: String(item.text || ""),
    author: String(item.author || item.author_name || ""),
    time: Number(item.time) || 0,
    likes: liked ? Math.max(1, Number(item.likes) || 1) : Number(item.likes) || 0,
    hearts: hearted
      ? Math.max(1, Number(item.hearts) || 1)
      : Number(item.hearts) || 0,
    liked,
    hearted,
    cloud: !!item.cloud,
    userId: String(item.userId || item.user_id || ""),
    parentId: String(item.parentId || item.parent_id || "")
  };
}

let commentsSortMode = "time"; // time | likes
let commentsEmojiTab = "emoji";

function buildCommentTree(rows) {
  const flat = (Array.isArray(rows) ? rows : [])
    .map(normalizeCommentItem)
    .filter(Boolean);
  const byId = new Map();
  flat.forEach((item) => {
    byId.set(item.id, { ...item, replies: [] });
  });
  const roots = [];
  byId.forEach((item) => {
    const pid = item.parentId;
    if (pid && byId.has(pid)) {
      // 只挂一层：若父评论本身也是回复，挂到顶层
      const parent = byId.get(pid);
      const rootId = parent.parentId && byId.has(parent.parentId) ? parent.parentId : pid;
      const root = byId.get(rootId) || parent;
      if (root && root.id !== item.id) {
        item.parentId = root.id;
        root.replies.push(item);
        return;
      }
    }
    if (!pid || !byId.has(pid)) roots.push(item);
  });
  if (commentsSortMode === "likes") {
    roots.sort((a, b) => {
      const la = Number(a.likes) || 0;
      const lb = Number(b.likes) || 0;
      if (lb !== la) return lb - la;
      return (Number(b.time) || 0) - (Number(a.time) || 0);
    });
  } else {
    roots.sort((a, b) => (Number(b.time) || 0) - (Number(a.time) || 0));
  }
  roots.forEach((r) => {
    r.replies.sort((a, b) => (Number(a.time) || 0) - (Number(b.time) || 0));
  });
  return { flat, roots };
}

function setCommentsSortMode(mode) {
  commentsSortMode = mode === "likes" ? "likes" : "time";
  els.commentsSortTime?.classList.toggle("is-active", commentsSortMode === "time");
  els.commentsSortLikes?.classList.toggle("is-active", commentsSortMode === "likes");
  const rows = commentsCache[commentsSongKey] || [];
  renderCommentsList(rows);
}

function formatCommentBodyHtml(text) {
  const raw = String(text || "");
  if (raw.startsWith("__STICKER__:")) {
    const url = raw.slice("__STICKER__:".length).trim();
    if (!url) return escapeHtml("[表情]");
    return `<img class="comment-sticker" src="${escapeHtml(url)}" alt="表情" loading="lazy" />`;
  }
  return escapeHtml(raw);
}

function vipToneClass(userNo) {
  return window.LudongCloud?.vipToneClass?.(userNo) || "";
}

function resolveHonorTitle(userNo, stored) {
  if (window.LudongCloud?.resolveHonorTitle) {
    return window.LudongCloud.resolveHonorTitle(userNo, stored);
  }
  const t = String(stored || "").trim();
  if (t) return t;
  return Number(userNo) === 0 ? "创世神" : "";
}

function isVipUserNo(userNo) {
  if (window.LudongCloud?.isVipUserNo) return window.LudongCloud.isVipUserNo(userNo);
  if (userNo == null || userNo === "") return false;
  const n = Number(userNo);
  return Number.isFinite(n) && n >= 0 && n <= 10;
}

/** 金色/黑金用户号 HTML */
function userNoSpanHtml(userNo, userNoLabel) {
  const label = userNoLabel || window.LudongCloud?.formatUserNo?.(userNo) || "";
  if (!label) return "";
  const tone = vipToneClass(userNo);
  return `<span class="user-no${tone ? ` ${tone}` : ""}">${escapeHtml(label)}</span>`;
}

function honorTitleSpanHtml(userNo, honorTitle) {
  const title = resolveHonorTitle(userNo, honorTitle);
  if (!title || !isVipUserNo(userNo)) return "";
  const tone = vipToneClass(userNo) || "is-gold";
  return `<span class="honor-title ${tone}">${escapeHtml(title)}</span>`;
}

function userIdentityHtml({ userNo, userNoLabel, honorTitle, sep = " · " } = {}) {
  const no = userNoSpanHtml(userNo, userNoLabel);
  const title = honorTitleSpanHtml(userNo, honorTitle);
  const bits = [];
  if (no) bits.push(no);
  if (title) bits.push(title);
  if (!bits.length) return "";
  return bits.join(sep);
}

function countComments(rows) {
  return (Array.isArray(rows) ? rows : []).map(normalizeCommentItem).filter(Boolean).length;
}

function setCommentsHint(text, isError = false) {
  if (!els.commentsHint) return;
  els.commentsHint.textContent = text || "";
  els.commentsHint.classList.toggle("is-error", !!isError);
}

let commentReplyTarget = null; // { id, author }
const expandedCommentReplies = new Set(); // 展开中的楼中楼 parentId

function clearCommentReplyTarget() {
  commentReplyTarget = null;
  if (els.commentsReplyBar) els.commentsReplyBar.hidden = true;
  if (els.commentsInput) els.commentsInput.placeholder = "写下你的想法…";
}

function setCommentReplyTarget(id, author) {
  const flat = commentsCache[commentsSongKey] || [];
  let rootId = id;
  let rootAuthor = author || "";
  const hit = flat.find((c) => String(c.id) === String(id));
  if (hit?.parentId) {
    rootId = hit.parentId;
    const root = flat.find((c) => String(c.id) === String(rootId));
    rootAuthor = root?.author || author || "";
  } else if (hit) {
    rootAuthor = hit.author || author || "";
  }
  commentReplyTarget = { id: String(rootId), author: rootAuthor || "用户" };
  expandedCommentReplies.add(String(rootId));
  if (els.commentsReplyBar) els.commentsReplyBar.hidden = false;
  if (els.commentsReplyLabel) {
    els.commentsReplyLabel.textContent = `回复 ${commentReplyTarget.author}`;
  }
  if (els.commentsInput) {
    els.commentsInput.placeholder = `回复 ${commentReplyTarget.author}…`;
    els.commentsInput.focus();
  }
  setCommentsHint(`回复将显示在「${commentReplyTarget.author}」的评论下`);
}

function toggleCommentReplies(parentId, forceOpen) {
  const id = String(parentId || "");
  if (!id) return;
  if (typeof forceOpen === "boolean") {
    if (forceOpen) expandedCommentReplies.add(id);
    else expandedCommentReplies.delete(id);
  } else if (expandedCommentReplies.has(id)) {
    expandedCommentReplies.delete(id);
  } else {
    expandedCommentReplies.add(id);
  }
  const rows = commentsCache[commentsSongKey] || [];
  renderCommentsList(rows);
}

function renderOneComment(item, { isReply = false } = {}) {
  const likeOn = item.liked ? " is-on" : "";
  const heartOn = item.hearted ? " is-on" : "";
  const myId = currentLibraryUserId();
  const isMine = !!(item.userId && myId && item.userId === myId);
  const av =
    window.LudongCloud?.avatarSrc?.(item.avatarUrl, item.author) || "./logo.jpg";
  const noHtml = userIdentityHtml({
    userNo: item.userNo,
    userNoLabel: item.userNoLabel,
    honorTitle: item.honorTitleDisplay || item.honorTitle
  });
  const author = item.author
    ? `<button type="button" class="comment-author${isMine ? " is-me" : ""}" data-act="author" data-user-id="${escapeHtml(item.userId || "")}" data-author="${escapeHtml(item.author)}" title="点击选择操作">${escapeHtml(item.author)}${noHtml ? ` · ${noHtml}` : ""}</button>`
    : "";
  const replyCount = !isReply && Array.isArray(item.replies) ? item.replies.length : 0;
  const expanded = replyCount > 0 && expandedCommentReplies.has(String(item.id));
  const repliesHtml =
    replyCount > 0 && expanded
      ? `<ul class="comment-replies">${item.replies
          .map((r) => renderOneComment(r, { isReply: true }))
          .join("")}</ul>`
      : "";
  const foldHtml =
    replyCount > 0
      ? `<button type="button" class="comment-fold${expanded ? " is-open" : ""}" data-act="fold" data-parent-id="${escapeHtml(item.id)}" aria-expanded="${expanded ? "true" : "false"}">
          ${
            expanded
              ? `收起 ${replyCount} 条回复`
              : `共${replyCount}条回复，点击查看`
          }
        </button>`
      : "";
  return `
    <li class="comment-item${isReply ? " is-reply" : ""}" data-comment-id="${escapeHtml(item.id)}" data-user-id="${escapeHtml(item.userId || "")}" data-author="${escapeHtml(item.author || "")}" data-parent-id="${escapeHtml(item.parentId || "")}">
      <div class="comment-head">
        <img class="comment-avatar" src="${escapeHtml(av)}" alt="" />
        <div class="comment-head-main">${author}</div>
      </div>
      <div class="comment-text${String(item.text || "").startsWith("__STICKER__:") ? " is-sticker" : ""}">${formatCommentBodyHtml(item.text)}</div>
      <div class="comment-footer">
        <div class="comment-time">${escapeHtml(formatCommentTime(item.time))}</div>
        <div class="comment-actions">
          <button type="button" class="comment-act${likeOn}" data-act="like" aria-label="点赞" title="点赞">
            <span aria-hidden="true">👍</span>
            <span class="comment-act-count">${item.likes || ""}</span>
          </button>
          <button type="button" class="comment-act comment-act-reply" data-act="reply" aria-label="回复" title="回复">回复</button>
          <button type="button" class="comment-act${heartOn}" data-act="heart" aria-label="爱心" title="爱心">
            <span aria-hidden="true">${item.hearted ? "♥" : "♡"}</span>
            <span class="comment-act-count">${item.hearts || ""}</span>
          </button>
          <button type="button" class="comment-act" data-act="delete" aria-label="删除评论" title="删除">
            <span aria-hidden="true">🗑</span>
          </button>
        </div>
      </div>
      ${foldHtml}
      ${repliesHtml}
    </li>`;
}

function renderCommentsList(rows) {
  if (!els.commentsList) return;
  hideCommentUserMenu();
  const { flat, roots } = buildCommentTree(rows);
  if (els.commentsCountLabel) {
    els.commentsCountLabel.textContent = `${flat.length} 条`;
  }
  if (!roots.length) {
    els.commentsList.innerHTML =
      '<li class="empty-tip">还没有人写</li>';
    return;
  }
  els.commentsList.innerHTML = roots.map((item) => renderOneComment(item)).join("");
}

let commentMenuTarget = { userId: "", author: "" };

function hideCommentUserMenu() {
  if (!els.commentUserMenu) return;
  els.commentUserMenu.hidden = true;
  commentMenuTarget = { userId: "", author: "" };
}

function showCommentUserMenu(anchorBtn, userId, author) {
  if (!els.commentUserMenu || !anchorBtn) return;
  const myId = currentLibraryUserId();
  if (userId && myId && userId === myId) {
    setCommentsHint("这是你自己");
    hideCommentUserMenu();
    return;
  }
  if (!userId) {
    setCommentsHint("该评论没有账号信息，无法加好友或私聊", true);
    hideCommentUserMenu();
    return;
  }
  commentMenuTarget = { userId, author: author || "" };
  const menu = els.commentUserMenu;
  menu.hidden = false;
  const panel = els.commentsList?.closest(".comments-panel") || document.body;
  const panelRect = panel.getBoundingClientRect();
  const btnRect = anchorBtn.getBoundingClientRect();
  let top = btnRect.bottom - panelRect.top + 6;
  let left = btnRect.left - panelRect.left;
  menu.style.top = `${Math.max(8, top)}px`;
  menu.style.left = `${Math.max(8, Math.min(left, panelRect.width - 132))}px`;
}

function replyToComment(commentId, author) {
  if (!commentId) {
    setCommentsHint("无法回复这条评论", true);
    return;
  }
  setCommentReplyTarget(commentId, author);
}

async function addFriendFromComment(userId, author) {
  if (!window.LudongCloud?.isLoggedIn?.()) {
    setCommentsHint("请先登录后再加好友", true);
    return;
  }
  if (!userId) {
    setCommentsHint("无法识别该用户", true);
    return;
  }
  setCommentsHint("正在发送好友申请…");
  try {
    await window.LudongCloud.sendFriendRequest(userId);
    setCommentsHint(`已向「${author || "用户"}」发送好友申请`);
  } catch (err) {
    setCommentsHint(err?.message || "申请失败", true);
  }
}

async function chatFromComment(userId, author) {
  if (!window.LudongCloud?.isLoggedIn?.()) {
    setCommentsHint("请先登录后再私聊", true);
    return;
  }
  if (!userId) {
    setCommentsHint("无法识别该用户", true);
    return;
  }
  hideCommentUserMenu();
  closeCommentsLayer();
  await openChatLayer();
  const friends = chatPeersCache || [];
  if (friends.some((f) => f.id === userId)) {
    await selectChatPeer(userId, "dm");
    return;
  }
  setChatTab("add");
  if (els.chatSearchInput) {
    els.chatSearchInput.value = author || "";
  }
  setChatHint(
    author
      ? `「${author}」还不是好友，可搜索后发送申请，通过后即可私聊`
      : "还不是好友，请先发送好友申请"
  );
  if ((author || "").trim().length >= 2) {
    await runChatSearch();
  }
}

function mergeCommentRows(a = [], b = []) {
  const map = new Map();
  for (const item of [...a, ...b]) {
    const norm = normalizeCommentItem(item);
    if (!norm) continue;
    const id = norm.id || `${norm.time}-${norm.text}`;
    const prev = map.get(id);
    if (!prev) {
      map.set(id, { ...norm, id });
      continue;
    }
    map.set(id, {
      ...prev,
      ...norm,
      id,
      parentId: norm.parentId || prev.parentId || "",
      likes: Math.max(prev.likes || 0, norm.likes || 0),
      hearts: Math.max(prev.hearts || 0, norm.hearts || 0),
      liked: prev.liked || norm.liked,
      hearted: prev.hearted || norm.hearted
    });
  }
  return Array.from(map.values()).sort(
    (x, y) => (Number(y.time) || 0) - (Number(x.time) || 0)
  );
}

async function loadCommentsForSong(song, { silent = false } = {}) {
  if (!song) {
    commentsSongKey = "";
    renderCommentsList([]);
    return [];
  }
  const key = playStatKey(song);
  commentsSongKey = key;
  const localMap = readLocalCommentsMap();
  let rows = Array.isArray(localMap[key]) ? localMap[key] : [];
  if (!silent) {
    commentsCache[key] = rows;
    renderCommentsList(rows);
  }

  // 优先拉云端（好友互相可见）
  if (window.LudongCloud?.enabled?.()) {
    try {
      await window.LudongCloud.ensureGuestSession();
      const cloudRows = await window.LudongCloud.listComments(key);
      rows = mergeCommentRows(cloudRows, []);
      persistCommentsForKey(key, rows);
      renderCommentsList(rows);
      if (!silent) setCommentsHint("已同步云端评论");
      return rows;
    } catch (err) {
      if (!silent) {
        setCommentsHint(err?.message || "云端暂不可用，显示本地评论", true);
      }
    }
  }

  try {
    const q = new URLSearchParams({
      key,
      title: song.title || "",
      artist: song.artist || "",
      id: song.id || ""
    });
    const res = await fetch(`/api/comments?${q}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.comments)) {
        rows = mergeCommentRows(rows, data.comments);
        persistCommentsForKey(key, rows);
        renderCommentsList(rows);
      }
    }
  } catch {
    /* keep local */
  }
  return rows;
}

async function openCommentsLayer() {
  const song = playlist[currentIndex];
  if (!song) {
    setHint("请先选择一首歌", true);
    return;
  }
  paintCommentsHeading(song);
  setCommentsHint("");
  clearCommentReplyTarget();
  // 切歌时收起展开状态，避免串楼
  expandedCommentReplies.clear();
  // 先开窗 + 本地缓存，后台再同步，减少卡顿感
  const key = playStatKey(song);
  commentsSongKey = key;
  const cached = commentsCache[key] || readLocalCommentsMap()[key] || [];
  renderCommentsList(cached);
  els.commentsLayer?.classList.add("is-open");
  els.commentsLayer?.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => {
    els.commentsInput?.focus();
  });
  if (!commentsLoading) {
    commentsLoading = true;
    try {
      await loadCommentsForSong(song, { silent: true });
    } finally {
      commentsLoading = false;
    }
  }
}

let commentsDocked = false;

function closeCommentsLayer() {
  if (commentsDocked) {
    setPlayerView("listen");
    return;
  }
  hideCommentUserMenu();
  clearCommentReplyTarget();
  closeCommentsEmojiPanel();
  els.commentsLayer?.classList.remove("is-open");
  els.commentsLayer?.setAttribute("aria-hidden", "true");
}

/* —— 私聊 / 群聊 —— */
let chatActivePeerId = "";
let chatActiveKind = "dm"; // dm | group
let chatPollTimer = null;
let chatInboxTimer = null;
let chatPresenceTimer = null;
let chatFriendsCache = [];
let chatGroupsCache = [];
let chatPeersCache = [];
let chatMessagesCache = [];
let chatLastMsgIso = "";
let chatLastReadPollIso = "";
let chatLastRecallPollIso = "";
let chatTab = "friends";
let chatSearchTimer = null;
let chatLoadGen = 0;
/** @type {Map<string, {messages: any[], lastMsgIso: string, lastReadPollIso: string, lastRecallPollIso: string}>} */
const chatThreadByPeer = new Map();
let chatUnreadByPeer = {};
let chatUnreadTotal = 0;
let chatPeerLastReadAt = {};
let chatPollTick = 0;
let chatGroupModalMode = "create"; // create | invite
let chatGroupModalTargetId = "";

const CHAT_ACTIVE_POLL_MS = 400;
const CHAT_INBOX_POLL_MS = 2000;
const CHAT_PRESENCE_MS = 25000;

function chatConvKey(kind = chatActiveKind, id = chatActivePeerId) {
  if (!id) return "";
  return kind === "group" ? `g:${id}` : String(id);
}

function isGroupChat() {
  return chatActiveKind === "group";
}

function findChatItem(kind, id) {
  if (kind === "group") {
    return chatGroupsCache.find((g) => g.id === id) || null;
  }
  return chatFriendsCache.find((p) => p.id === id) || null;
}

function setChatHint(msg, isError = false) {
  if (!els.chatHint) return;
  els.chatHint.textContent = msg || "";
  els.chatHint.classList.toggle("is-error", !!isError && !!msg);
}

function stopChatPoll() {
  if (chatPollTimer) {
    clearInterval(chatPollTimer);
    chatPollTimer = null;
  }
}

function stopChatInboxPoll() {
  if (chatInboxTimer) {
    clearInterval(chatInboxTimer);
    chatInboxTimer = null;
  }
}

function stopPresenceHeartbeat() {
  if (chatPresenceTimer) {
    clearInterval(chatPresenceTimer);
    chatPresenceTimer = null;
  }
}

function startPresenceHeartbeat() {
  stopPresenceHeartbeat();
  if (!window.LudongCloud?.enabled?.() || !window.LudongCloud?.isLoggedIn?.()) return;
  const beat = () => {
    window.LudongCloud?.touchPresence?.().catch(() => {});
  };
  beat();
  chatPresenceTimer = setInterval(beat, CHAT_PRESENCE_MS);
}

function startChatInboxPoll() {
  stopChatInboxPoll();
  if (!window.LudongCloud?.enabled?.() || !window.LudongCloud?.isLoggedIn?.()) return;
  startPresenceHeartbeat();
  refreshChatUnread({ silent: true });
  chatInboxTimer = setInterval(() => {
    refreshChatUnread({ silent: true });
  }, CHAT_INBOX_POLL_MS);
}

function peerIsOnline(peer) {
  if (!peer) return false;
  if (typeof peer.online === "boolean" && peer.lastSeenAt) {
    return window.LudongCloud?.isOnlineFromLastSeen
      ? window.LudongCloud.isOnlineFromLastSeen(peer.lastSeenAt)
      : peer.online;
  }
  if (peer.lastSeenAt && window.LudongCloud?.isOnlineFromLastSeen) {
    return window.LudongCloud.isOnlineFromLastSeen(peer.lastSeenAt);
  }
  return !!peer.online;
}

function updateChatPeerStatus() {
  if (!els.chatPeerStatus) return;
  if (!chatActivePeerId) {
    els.chatPeerStatus.hidden = true;
    els.chatPeerStatus.textContent = "";
    els.chatPeerStatus.classList.remove("is-online", "is-offline");
    return;
  }
  if (isGroupChat()) {
    const g = findChatItem("group", chatActivePeerId);
    const n = g?.memberCount || g?.members?.length || 0;
    els.chatPeerStatus.hidden = false;
    els.chatPeerStatus.textContent = n ? `${n} 人` : "群聊";
    els.chatPeerStatus.classList.remove("is-online", "is-offline");
    return;
  }
  const peer = findChatItem("dm", chatActivePeerId);
  const online = peerIsOnline(peer);
  els.chatPeerStatus.hidden = false;
  els.chatPeerStatus.textContent = online ? "在线" : "离线";
  els.chatPeerStatus.classList.toggle("is-online", online);
  els.chatPeerStatus.classList.toggle("is-offline", !online);
}

function saveActiveThreadCache() {
  const key = chatConvKey();
  if (!key) return;
  chatThreadByPeer.set(key, {
    messages: chatMessagesCache.map((m) => ({ ...m })),
    lastMsgIso: chatLastMsgIso || "",
    lastReadPollIso: chatLastReadPollIso || "",
    lastRecallPollIso: chatLastRecallPollIso || ""
  });
}

function restoreThreadCache(kind, id) {
  const cached = chatThreadByPeer.get(chatConvKey(kind, id));
  if (!cached) return false;
  chatMessagesCache = (cached.messages || []).map((m) => ({ ...m }));
  chatLastMsgIso = cached.lastMsgIso || "";
  chatLastReadPollIso = cached.lastReadPollIso || "";
  chatLastRecallPollIso = cached.lastRecallPollIso || "";
  return true;
}

async function refreshFriendsPresence({ silent = true } = {}) {
  if (!window.LudongCloud?.listFriendsPresence) return;
  if (!chatFriendsCache.length) return;
  try {
    const map = await window.LudongCloud.listFriendsPresence(
      chatFriendsCache.map((p) => p.id)
    );
    let changed = false;
    chatFriendsCache.forEach((p) => {
      const row = map[p.id];
      if (!row) return;
      const nextOnline = !!row.online;
      if (p.lastSeenAt !== row.lastSeenAt || p.online !== nextOnline) {
        p.lastSeenAt = row.lastSeenAt;
        p.online = nextOnline;
        changed = true;
      }
    });
    if (changed && els.chatLayer?.classList.contains("is-open")) {
      renderChatSideList();
      updateChatPeerStatus();
    }
  } catch (err) {
    if (!silent) setChatHint(err?.message || "在线状态刷新失败", true);
  }
}

function formatChatTime(ms, { withDate = false } = {}) {
  const d = new Date(ms || Date.now());
  if (Number.isNaN(d.getTime())) return "";
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const hm = `${hh}:${mm}`;
  if (!withDate) return hm;
  const month = d.getMonth() + 1;
  const day = d.getDate();
  if (d.getFullYear() === new Date().getFullYear()) {
    return `${month}月${day}日 ${hm}`;
  }
  return `${d.getFullYear()}年${month}月${day}日 ${hm}`;
}

function peerDisplayName(peer) {
  if (!peer) return "好友";
  if (peer.kind === "group") return peer.name || "群聊";
  const remark = String(peer.remark || "").trim();
  if (remark) return remark;
  return peer.name || "好友";
}

function peerTitleText(peer) {
  if (!peer) return "聊天";
  if (peer.kind === "group") return peer.name || "群聊";
  const remark = String(peer.remark || "").trim();
  if (remark && peer.name && remark !== peer.name) {
    return `${remark}（${peer.name}）`;
  }
  return peerDisplayName(peer);
}

function chatPartyForMessage(m) {
  if (m.mine) {
    let myProfile = null;
    try {
      const raw = localStorage.getItem("ludong-profile-cache-v1");
      myProfile = raw ? JSON.parse(raw) : null;
    } catch {
      myProfile = null;
    }
    return {
      name: window.LudongCloud?.getDisplayName?.() || "我",
      avatarUrl: window.LudongCloud?.getAvatar?.() || "preset:1",
      userNo: myProfile?.userNo,
      userNoLabel: myProfile?.userNoLabel || "",
      honorTitle: myProfile?.honorTitleDisplay || myProfile?.honorTitle || ""
    };
  }
  if (isGroupChat()) {
    const g = findChatItem("group", chatActivePeerId);
    const member = (g?.members || []).find((x) => x.id === m.senderId);
    if (member) {
      return {
        name: peerDisplayName(member),
        avatarUrl: member.avatarUrl || "",
        userNo: member.userNo,
        userNoLabel: member.userNoLabel || "",
        honorTitle: member.honorTitleDisplay || member.honorTitle || ""
      };
    }
  }
  const peer =
    chatFriendsCache.find((p) => p.id === (m.senderId || chatActivePeerId)) ||
    findChatItem("dm", chatActivePeerId);
  return {
    name: peerDisplayName(peer),
    avatarUrl: peer?.avatarUrl || "",
    userNo: peer?.userNo,
    userNoLabel: peer?.userNoLabel || "",
    honorTitle: peer?.honorTitleDisplay || peer?.honorTitle || ""
  };
}

function chatBubbleHtml(m) {
  const party = chatPartyForMessage(m);
  const showChatDate = !isGroupChat();
  const av = window.LudongCloud?.avatarSrc?.(party.avatarUrl, party.name) || "./logo.jpg";
  const rowCls = [
    "chat-row",
    m.mine ? "is-mine" : "is-peer",
    m.pending ? "is-pending" : "",
    m.failed ? "is-failed" : "",
    m.recalled ? "is-recalled" : "",
    m.msgType === "sticker" ? "is-sticker" : ""
  ]
    .filter(Boolean)
    .join(" ");
  let status = "";
  if (m.mine && !m.recalled) {
    if (m.failed) status = "发送失败";
    else if (m.pending) status = "发送中";
    else if (isGroupChat()) status = "";
    else if (m.read) status = "已读";
    else status = "未读";
  }
  let content = "";
  if (m.recalled) {
    content = `<div class="chat-bubble is-recalled"><span>撤回了一条消息</span></div>`;
  } else if (m.msgType === "sticker" && m.mediaUrl) {
    const isPaste = String(m.body || "") === "[图片]";
    content = `<div class="chat-bubble is-sticker-bubble ${m.mine ? "is-mine" : "is-peer"}">
      <img class="chat-sticker${isPaste ? " is-paste" : ""}" src="${escapeHtml(m.mediaUrl)}" alt="${isPaste ? "图片" : "表情"}" loading="lazy" />
      <span class="chat-bubble-meta">
        <span class="chat-bubble-time">${formatChatTime(m.time, { withDate: showChatDate })}</span>
        ${status ? `<span class="chat-bubble-status">${status}</span>` : ""}
      </span>
    </div>`;
  } else {
    content = `<div class="chat-bubble ${m.mine ? "is-mine" : "is-peer"}">
      <span class="chat-bubble-text">${escapeHtml(m.body)}</span>
      <span class="chat-bubble-meta">
        <span class="chat-bubble-time">${formatChatTime(m.time, { withDate: showChatDate })}</span>
        ${status ? `<span class="chat-bubble-status">${status}</span>` : ""}
      </span>
    </div>`;
  }
  return `<div class="${rowCls}" data-msg-id="${escapeHtml(m.id)}">
    <img class="chat-row-avatar" src="${escapeHtml(av)}" alt="" />
    <div class="chat-row-main">
      <div class="chat-row-name">${escapeHtml(party.name)}${(() => {
        const idHtml = userIdentityHtml({
          userNo: party.userNo,
          userNoLabel: party.userNoLabel,
          honorTitle: party.honorTitle
        });
        return idHtml ? ` · ${idHtml}` : "";
      })()}</div>
      ${content}
    </div>
  </div>`;
}

function applyPeerReadCutoff(peerId) {
  const cutoff = chatPeerLastReadAt[peerId];
  if (!cutoff || !chatMessagesCache.length) return false;
  const cutMs = Date.parse(cutoff) || 0;
  if (!cutMs) return false;
  let changed = false;
  chatMessagesCache.forEach((m) => {
    if (!m.mine || m.read || m.pending || m.failed) return;
    const t = m.time || (m.createdAt ? Date.parse(m.createdAt) : 0) || 0;
    if (t && t <= cutMs) {
      m.read = true;
      m.readAt = cutoff;
      changed = true;
    }
  });
  return changed;
}

function updateChatEntryBadge() {
  const n = Number(chatUnreadTotal) || 0;
  if (els.chatEntryBadge) {
    if (n > 0) {
      els.chatEntryBadge.hidden = false;
      els.chatEntryBadge.textContent = n > 99 ? "99+" : String(n);
    } else {
      els.chatEntryBadge.hidden = true;
    }
  }
  els.chatEntry?.classList.toggle("has-unread", n > 0);
  const chatSub =
    n > 0
      ? `${n} 条未读`
      : chatFriendsCache.length > 0
        ? `${chatFriendsCache.length} 位好友`
        : "搜索添加好友";
  if (els.chatEntrySub) els.chatEntrySub.textContent = chatSub;
}

async function refreshChatUnread({ silent = true } = {}) {
  if (!window.LudongCloud?.getUnreadSummary) return;
  if (!window.LudongCloud?.isLoggedIn?.()) {
    chatUnreadByPeer = {};
    chatUnreadTotal = 0;
    updateChatEntryBadge();
    return;
  }
  try {
    const [summary, groupSummary] = await Promise.all([
      window.LudongCloud.getUnreadSummary(),
      window.LudongCloud.getGroupUnreadSummary
        ? window.LudongCloud.getGroupUnreadSummary().catch(() => ({
            unreadTotal: 0,
            byGroup: {}
          }))
        : Promise.resolve({ unreadTotal: 0, byGroup: {} }),
      refreshFriendsPresence({ silent: true })
    ]);
    chatUnreadByPeer = {
      ...(summary.byPeer || {}),
      ...(groupSummary.byGroup || {})
    };
    chatUnreadTotal =
      (Number(summary.unreadTotal) || 0) + (Number(groupSummary.unreadTotal) || 0);
    chatPeerLastReadAt = {
      ...chatPeerLastReadAt,
      ...(summary.peerLastReadAt || {})
    };
    updateChatEntryBadge();
    if (els.chatLayer?.classList.contains("is-open")) {
      renderChatSideList();
      updateChatPeerStatus();
      if (chatActivePeerId && !isGroupChat() && applyPeerReadCutoff(chatActivePeerId)) {
        renderChatMessages(chatMessagesCache);
      }
    }
  } catch (err) {
    if (!silent) setChatHint(err?.message || "未读状态刷新失败", true);
  }
}

function setChatTab(tab) {
  chatTab = tab === "add" ? "add" : "friends";
  els.chatTabFriends?.classList.toggle("is-active", chatTab === "friends");
  els.chatTabAdd?.classList.toggle("is-active", chatTab === "add");
  if (els.chatPanelFriends) {
    els.chatPanelFriends.hidden = chatTab !== "friends";
    els.chatPanelFriends.classList.toggle("is-active", chatTab === "friends");
  }
  if (els.chatPanelAdd) {
    els.chatPanelAdd.hidden = chatTab !== "add";
    els.chatPanelAdd.classList.toggle("is-active", chatTab === "add");
  }
  if (chatTab === "add") {
    requestAnimationFrame(() => els.chatSearchInput?.focus());
  }
}

function renderChatSideList() {
  const friends = (chatFriendsCache || []).map((p) => ({
    ...p,
    kind: "dm"
  }));
  const groups = (chatGroupsCache || []).map((g) => ({
    ...g,
    kind: "group"
  }));
  chatPeersCache = [...groups, ...friends];

  if (els.chatPeerCount) {
    const fc = friends.length;
    const gc = groups.length;
    els.chatPeerCount.textContent =
      gc > 0 ? `${fc} 好友 · ${gc} 群` : `${fc} 好友`;
  }
  updateChatEntryBadge();
  if (!els.chatPeers) return;

  if (!friends.length && !groups.length) {
    els.chatPeers.innerHTML =
      '<div class="empty-tip" style="padding:12px">还没有好友。点「加好友」搜索，或先加好友再建群。</div>';
    return;
  }

  const sortItems = (list, unreadKeyFn) =>
    [...list].sort((a, b) => {
      // 好友严格按用户号（注册顺序）；群聊仍按未读优先
      if (a.kind === "group" || b.kind === "group") {
        const ua = unreadKeyFn(a);
        const ub = unreadKeyFn(b);
        if (ua !== ub) return ub - ua;
        return String(peerDisplayName(a) || "").localeCompare(
          String(peerDisplayName(b) || ""),
          "zh"
        );
      }
      const na = Number.isFinite(Number(a.userNo)) ? Number(a.userNo) : Number.POSITIVE_INFINITY;
      const nb = Number.isFinite(Number(b.userNo)) ? Number(b.userNo) : Number.POSITIVE_INFINITY;
      if (na !== nb) return na - nb;
      return String(peerDisplayName(a) || "").localeCompare(
        String(peerDisplayName(b) || ""),
        "zh"
      );
    });

  const sortedGroups = sortItems(groups, (g) => chatUnreadByPeer[`g:${g.id}`] || 0);
  const sortedFriends = sortItems(friends, (p) => chatUnreadByPeer[p.id] || 0);

  const blocks = [];
  if (sortedGroups.length) {
    blocks.push('<div class="chat-peer-section">群聊</div>');
    sortedGroups.forEach((g) => {
      const active =
        chatActiveKind === "group" && g.id === chatActivePeerId ? " is-active" : "";
      const unread = Number(chatUnreadByPeer[`g:${g.id}`]) || 0;
      const badge =
        unread > 0
          ? `<span class="chat-peer-badge">${unread > 99 ? "99+" : unread}</span>`
          : "";
      const sub = `${g.memberCount || g.members?.length || 0} 人`;
      blocks.push(`<button type="button" class="chat-peer is-group${active}${unread ? " has-unread" : ""}" data-kind="group" data-peer-id="${escapeHtml(g.id)}">
        <span class="chat-peer-avatar-wrap">
          <span class="chat-peer-avatar chat-group-avatar">群</span>
        </span>
        <span class="chat-peer-main">
          <span class="chat-peer-name">${escapeHtml(g.name || "群聊")}</span>
          <span class="chat-peer-email">${escapeHtml(sub)}</span>
        </span>
        ${badge}
      </button>`);
    });
  }
  if (sortedFriends.length) {
    blocks.push('<div class="chat-peer-section">好友</div>');
    sortedFriends.forEach((p) => {
      const active =
        chatActiveKind === "dm" && p.id === chatActivePeerId ? " is-active" : "";
      const unread = Number(chatUnreadByPeer[p.id]) || 0;
      const online = peerIsOnline(p);
      const email = p.email
        ? `<span class="chat-peer-email">${escapeHtml(p.email)}</span>`
        : "";
      const shown = peerDisplayName(p);
      const real =
        p.remark && p.name && p.remark !== p.name
          ? `<span class="chat-peer-email">${escapeHtml(p.name)}</span>`
          : email;
      const badge =
        unread > 0
          ? `<span class="chat-peer-badge">${unread > 99 ? "99+" : unread}</span>`
          : "";
      blocks.push(`<button type="button" class="chat-peer${active}${unread ? " has-unread" : ""}${online ? " is-online" : ""}" data-kind="dm" data-peer-id="${escapeHtml(p.id)}">
        <span class="chat-peer-avatar-wrap">
          <img class="chat-peer-avatar" src="${escapeHtml(window.LudongCloud?.avatarSrc?.(p.avatarUrl, p.name) || "./logo.jpg")}" alt="" />
          <span class="chat-peer-dot${online ? " is-on" : ""}" title="${online ? "在线" : "离线"}"></span>
        </span>
        <span class="chat-peer-main">
          <span class="chat-peer-name">${escapeHtml(shown)}${(() => {
            const idHtml = userIdentityHtml({
              userNo: p.userNo,
              userNoLabel: p.userNoLabel,
              honorTitle: p.honorTitleDisplay || p.honorTitle
            });
            return idHtml ? ` · ${idHtml}` : "";
          })()}</span>${real}
        </span>
        ${badge}
      </button>`);
    });
  }
  els.chatPeers.innerHTML = blocks.join("");
}

/** @deprecated 兼容旧调用，请用 renderChatSideList */
function renderChatPeers(peers) {
  if (Array.isArray(peers)) {
    chatFriendsCache = peers.map((p) => ({ ...p, kind: "dm" }));
  }
  renderChatSideList();
}

function renderChatMessages(messages, { append = false } = {}) {
  if (!els.chatMessages) return;
  if (!chatActivePeerId) {
    chatMessagesCache = [];
    chatLastMsgIso = "";
    els.chatMessages.innerHTML =
      '<div class="empty-tip">选择好友开始聊天</div>';
    return;
  }
  if (append && messages?.length) {
    chatMessagesCache = chatMessagesCache.concat(messages);
  } else if (!append) {
    chatMessagesCache = messages || [];
  }
  if (!isGroupChat()) applyPeerReadCutoff(chatActivePeerId);
  const nearBottom =
    els.chatMessages.scrollHeight - els.chatMessages.scrollTop - els.chatMessages.clientHeight < 80;
  if (!chatMessagesCache.length) {
    els.chatMessages.innerHTML =
      '<div class="empty-tip">还没有消息，打个招呼吧</div>';
    chatLastMsgIso = "";
    return;
  }
  els.chatMessages.innerHTML = chatMessagesCache.map(chatBubbleHtml).join("");
  const lastReal = [...chatMessagesCache].reverse().find((m) => !m.pending);
  chatLastMsgIso = lastReal?.createdAt || chatLastMsgIso || "";
  if (!append || nearBottom) {
    els.chatMessages.scrollTop = els.chatMessages.scrollHeight;
  }
}

function appendChatBubble(m) {
  if (!els.chatMessages || !m) return;
  if (chatMessagesCache.some((x) => x.id === m.id)) return;
  const wasEmpty = !chatMessagesCache.length;
  chatMessagesCache.push(m);
  if (wasEmpty) {
    renderChatMessages(chatMessagesCache);
    return;
  }
  els.chatMessages.insertAdjacentHTML("beforeend", chatBubbleHtml(m));
  if (!m.pending && m.createdAt) chatLastMsgIso = m.createdAt;
  els.chatMessages.scrollTop = els.chatMessages.scrollHeight;
}

function patchChatBubble(m) {
  if (!els.chatMessages || !m?.id) return;
  const node = els.chatMessages.querySelector(`[data-msg-id="${CSS.escape(m.id)}"]`);
  if (!node) {
    appendChatBubble(m);
    return;
  }
  node.outerHTML = chatBubbleHtml(m);
}

async function loadChatMessages({ silent = false, incremental = false } = {}) {
  if (!chatActivePeerId) return;
  const peerId = chatActivePeerId;
  const kind = chatActiveKind;
  const gen = chatLoadGen;
  const isGroup = kind === "group";
  if (isGroup && !window.LudongCloud?.listGroupMessages) return;
  if (!isGroup && !window.LudongCloud?.listMessagesWith) return;
  try {
    const afterIso = incremental && chatLastMsgIso ? chatLastMsgIso : undefined;
    const recallSince =
      incremental
        ? chatLastRecallPollIso ||
          new Date(Date.now() - CHAT_RECALL_MS - 10000).toISOString()
        : undefined;
    chatPollTick += 1;
    const wantMeta = !incremental || chatPollTick % 2 === 0;

    let list = [];
    let readUpdates = [];
    let recallUpdates = [];
    if (isGroup) {
      [list, recallUpdates] = await Promise.all([
        window.LudongCloud.listGroupMessages(peerId, { afterIso }),
        wantMeta && incremental && window.LudongCloud.listGroupRecallUpdates
          ? window.LudongCloud.listGroupRecallUpdates(peerId, {
              sinceIso: recallSince
            })
          : Promise.resolve([])
      ]);
    } else {
      [list, readUpdates, recallUpdates] = await Promise.all([
        window.LudongCloud.listMessagesWith(peerId, { afterIso }),
        wantMeta && incremental && window.LudongCloud.listReadUpdatesWith
          ? window.LudongCloud.listReadUpdatesWith(peerId, {
              sinceIso: chatLastReadPollIso || undefined
            })
          : Promise.resolve([]),
        wantMeta && incremental && window.LudongCloud.listRecallUpdatesWith
          ? window.LudongCloud.listRecallUpdatesWith(peerId, {
              sinceIso: recallSince
            })
          : Promise.resolve([])
      ]);
    }

    if (gen !== chatLoadGen || peerId !== chatActivePeerId || kind !== chatActiveKind) {
      return;
    }

    if (recallUpdates?.length) {
      recallUpdates.forEach((u) => {
        const m = chatMessagesCache.find((x) => x.id === u.id);
        if (m && !m.recalled) {
          m.recalled = true;
          m.recalledAt = u.recalledAt;
          patchChatBubble(m);
        }
        if (u.recalledAt) chatLastRecallPollIso = u.recalledAt;
      });
    }

    if (!isGroup && readUpdates?.length) {
      const map = new Map(readUpdates.map((u) => [u.id, u]));
      let changed = false;
      chatMessagesCache.forEach((m) => {
        const u = map.get(m.id);
        if (u && m.mine && !m.read) {
          m.read = true;
          m.readAt = u.readAt;
          changed = true;
        }
      });
      const last = readUpdates[readUpdates.length - 1];
      if (last?.readAt) chatLastReadPollIso = last.readAt;
      if (changed && !(incremental && list.length)) {
        renderChatMessages(chatMessagesCache);
      }
    }

    const unreadKey = chatConvKey(kind, peerId);
    if (incremental && afterIso) {
      if (list.length) {
        list.forEach((m) => appendChatBubble(m));
        const hasIncoming = list.some((m) => !m.mine);
        if (hasIncoming) {
          if (isGroup) {
            window.LudongCloud.markGroupMessagesRead?.(peerId).catch(() => {});
          } else {
            window.LudongCloud.markMessagesRead?.(peerId).catch(() => {});
          }
          chatUnreadByPeer[unreadKey] = 0;
          chatUnreadTotal = Object.values(chatUnreadByPeer).reduce((s, n) => s + n, 0);
          updateChatEntryBadge();
          renderChatSideList();
        }
      }
    } else {
      const pending = chatMessagesCache.filter((m) => m.pending);
      const merged = (list || []).slice();
      pending.forEach((p) => {
        if (!merged.some((m) => m.id === p.id || (m.body === p.body && m.mine))) {
          merged.push(p);
        }
      });
      const same =
        merged.length === chatMessagesCache.length &&
        merged.every(
          (m, i) =>
            m.id === chatMessagesCache[i]?.id &&
            !!m.read === !!chatMessagesCache[i]?.read &&
            !!m.recalled === !!chatMessagesCache[i]?.recalled
        );
      if (!same) renderChatMessages(merged);
      if (isGroup) {
        window.LudongCloud.markGroupMessagesRead?.(peerId).catch(() => {});
      } else {
        window.LudongCloud.markMessagesRead?.(peerId).catch(() => {});
      }
      if (chatUnreadByPeer[unreadKey]) {
        chatUnreadByPeer[unreadKey] = 0;
        chatUnreadTotal = Object.values(chatUnreadByPeer).reduce((s, n) => s + n, 0);
        updateChatEntryBadge();
        renderChatSideList();
      }
    }
    saveActiveThreadCache();
    if (!silent) setChatHint("");
  } catch (err) {
    if (gen !== chatLoadGen || peerId !== chatActivePeerId || kind !== chatActiveKind) {
      return;
    }
    if (!silent) setChatHint(err?.message || "加载消息失败", true);
  }
}

async function selectChatPeer(peerId, kind = "dm") {
  saveActiveThreadCache();
  chatLoadGen += 1;
  const gen = chatLoadGen;
  chatActivePeerId = peerId || "";
  chatActiveKind = kind === "group" ? "group" : "dm";
  chatPollTick = 0;
  hideFriendCtxMenu();
  const item = findChatItem(chatActiveKind, chatActivePeerId);
  if (els.chatTitle) {
    els.chatTitle.textContent = item ? peerTitleText(item) : chatActiveKind === "group" ? "群聊" : "私聊";
  }
  updateChatPeerStatus();
  setChatTab("friends");
  renderChatSideList();
  if (els.chatInput) els.chatInput.disabled = !chatActivePeerId;
  if (els.chatSend) els.chatSend.disabled = !chatActivePeerId;
  if (els.chatEmojiBtn) els.chatEmojiBtn.disabled = !chatActivePeerId;
  if (!chatActivePeerId) closeChatEmojiPanel();

  const hadCache = chatActivePeerId
    ? restoreThreadCache(chatActiveKind, chatActivePeerId)
    : false;
  if (!chatActivePeerId) {
    chatMessagesCache = [];
    chatLastMsgIso = "";
    chatLastReadPollIso = "";
    chatLastRecallPollIso = "";
    renderChatMessages([]);
  } else if (hadCache) {
    renderChatMessages(chatMessagesCache);
  } else {
    chatMessagesCache = [];
    chatLastMsgIso = "";
    chatLastReadPollIso = "";
    chatLastRecallPollIso = "";
    if (els.chatMessages) {
      els.chatMessages.innerHTML = '<div class="empty-tip">加载中…</div>';
    }
  }

  stopChatPoll();
  if (chatActivePeerId) {
    loadChatMessages({ silent: true, incremental: hadCache }).then(() => {
      if (gen !== chatLoadGen) return;
    });
    chatPollTimer = setInterval(() => {
      if (gen !== chatLoadGen) return;
      loadChatMessages({ silent: true, incremental: true });
    }, CHAT_ACTIVE_POLL_MS);
  }
  requestAnimationFrame(() => els.chatInput?.focus());
}

let friendCtxPeerId = "";
let friendCtxKind = "dm";

function hideFriendCtxMenu() {
  if (els.friendCtxMenu) els.friendCtxMenu.hidden = true;
  friendCtxPeerId = "";
  friendCtxKind = "dm";
}

function showFriendCtxMenu(peerId, clientX, clientY, kind = "dm") {
  if (!els.friendCtxMenu || !peerId) return;
  friendCtxPeerId = peerId;
  friendCtxKind = kind === "group" ? "group" : "dm";
  els.friendCtxMenu.hidden = false;
  const g =
    friendCtxKind === "group"
      ? chatGroupsCache.find((x) => x.id === peerId)
      : null;
  const me = window.LudongCloud?.currentUserIdSync?.() || "";
  els.friendCtxMenu.querySelectorAll("[data-for]").forEach((el) => {
    const forKind = el.getAttribute("data-for");
    let hide = forKind !== friendCtxKind;
    if (!hide && el.hasAttribute("data-owner-only")) {
      hide = !g || String(g.ownerId || "") !== me;
    }
    el.hidden = hide;
  });
  const menu = els.friendCtxMenu;
  const pad = 8;
  const w = menu.offsetWidth || 140;
  const h = menu.offsetHeight || 80;
  let left = clientX;
  let top = clientY;
  left = Math.min(left, window.innerWidth - w - pad);
  top = Math.min(top, window.innerHeight - h - pad);
  left = Math.max(pad, left);
  top = Math.max(pad, top);
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
}

async function editFriendRemark(peerId) {
  const peer = chatFriendsCache.find((p) => p.id === peerId);
  if (!peer) return;
  const current = String(peer.remark || "");
  const next = window.prompt(
    `给「${peer.name}」设置备注（留空清除）`,
    current
  );
  if (next == null) return;
  try {
    const remark = await window.LudongCloud.setFriendRemark(peerId, next);
    peer.remark = remark;
    renderChatSideList();
    if (chatActiveKind === "dm" && chatActivePeerId === peerId && els.chatTitle) {
      els.chatTitle.textContent = peerTitleText(peer);
    }
    if (chatActiveKind === "dm" && chatActivePeerId === peerId) {
      renderChatMessages(chatMessagesCache);
    }
    setChatHint(remark ? `已设置备注：${remark}` : "已清除备注");
  } catch (err) {
    setChatHint(err?.message || "设置备注失败", true);
  }
}

async function editGroupName(groupId) {
  const g = chatGroupsCache.find((x) => x.id === groupId);
  if (!g) return;
  const next = window.prompt("修改群名称", g.name || "群聊");
  if (next == null) return;
  const title = String(next).trim().slice(0, 24);
  if (!title) {
    setChatHint("群名不能为空", true);
    return;
  }
  try {
    const updated = await window.LudongCloud.renameChatGroup(groupId, title);
    const idx = chatGroupsCache.findIndex((x) => x.id === groupId);
    if (idx >= 0) chatGroupsCache[idx] = { ...chatGroupsCache[idx], ...updated };
    renderChatSideList();
    if (chatActiveKind === "group" && chatActivePeerId === groupId && els.chatTitle) {
      els.chatTitle.textContent = updated.name || title;
    }
    setChatHint(`群名已改为「${updated.name || title}」`);
  } catch (err) {
    setChatHint(err?.message || "改名失败", true);
  }
}

async function dissolveChatGroup(groupId) {
  const g = chatGroupsCache.find((x) => x.id === groupId);
  if (!g) return;
  const me = window.LudongCloud?.currentUserIdSync?.() || "";
  if (String(g.ownerId || "") !== me) {
    setChatHint("只有群主可以解散群聊", true);
    return;
  }
  const ok = await openConfirm(
    `确定解散群「${g.name || "群聊"}」？所有成员将无法再进入，群消息也会删除。`,
    "解散群聊？"
  );
  if (!ok) return;
  try {
    await window.LudongCloud.deleteChatGroup(groupId);
    chatGroupsCache = chatGroupsCache.filter((x) => x.id !== groupId);
    if (chatActiveKind === "group" && chatActivePeerId === groupId) {
      chatActivePeerId = "";
      chatActiveKind = "dm";
      chatMessagesCache = [];
      if (els.chatTitle) els.chatTitle.textContent = "私聊";
      if (els.chatMessages) {
        els.chatMessages.innerHTML = '<div class="empty-tip">选择好友开始聊天</div>';
      }
      if (els.chatInput) els.chatInput.disabled = true;
      if (els.chatSend) els.chatSend.disabled = true;
      if (els.chatEmojiBtn) els.chatEmojiBtn.disabled = true;
    }
    renderChatSideList();
    setChatHint("群聊已解散");
  } catch (err) {
    setChatHint(err?.message || "解散失败", true);
  }
}

function setChatGroupError(msg) {
  if (!els.chatGroupError) {
    if (msg) setChatHint(msg, true);
    return;
  }
  const text = String(msg || "").trim();
  if (!text) {
    els.chatGroupError.hidden = true;
    els.chatGroupError.textContent = "";
    return;
  }
  els.chatGroupError.hidden = false;
  els.chatGroupError.textContent = text;
}

function closeChatGroupModal() {
  if (els.chatGroupLayer) els.chatGroupLayer.hidden = true;
  chatGroupModalMode = "create";
  chatGroupModalTargetId = "";
  if (els.chatGroupNameInput) els.chatGroupNameInput.value = "";
  if (els.chatGroupPickList) els.chatGroupPickList.innerHTML = "";
  setChatGroupError("");
  if (els.chatGroupConfirm) els.chatGroupConfirm.disabled = false;
}

function openChatGroupModal(mode = "create", groupId = "") {
  if (!els.chatGroupLayer) return;
  if (!chatFriendsCache.length) {
    setChatHint("请先添加好友，再创建群聊", true);
    return;
  }
  chatGroupModalMode = mode === "invite" ? "invite" : "create";
  chatGroupModalTargetId = groupId || "";
  setChatGroupError("");
  if (els.chatGroupConfirm) {
    els.chatGroupConfirm.disabled = false;
    els.chatGroupConfirm.textContent = "创建";
  }
  const existing =
    chatGroupModalMode === "invite"
      ? new Set(
          (chatGroupsCache.find((g) => g.id === groupId)?.memberIds || []).map(String)
        )
      : new Set();
  const pickable = chatFriendsCache.filter((f) => !existing.has(f.id));
  if (chatGroupModalMode === "invite" && !pickable.length) {
    setChatHint("没有可邀请的新好友", true);
    return;
  }
  if (els.chatGroupModalTitle) {
    els.chatGroupModalTitle.textContent =
      chatGroupModalMode === "invite" ? "邀请好友进群" : "新建群聊";
  }
  if (els.chatGroupPickHint) {
    els.chatGroupPickHint.textContent =
      chatGroupModalMode === "invite" ? "勾选要邀请的好友" : "勾选要拉进群的好友";
  }
  if (els.chatGroupNameInput) {
    els.chatGroupNameInput.hidden = chatGroupModalMode === "invite";
    if (chatGroupModalMode === "create") {
      els.chatGroupNameInput.value = "";
      els.chatGroupNameInput.placeholder = "群名称（必填）";
    }
  }
  if (els.chatGroupPickList) {
    els.chatGroupPickList.innerHTML = pickable
      .map((p) => {
        const av =
          window.LudongCloud?.avatarSrc?.(p.avatarUrl, p.name) || "./logo.jpg";
        return `<label class="chat-group-pick-item">
          <input type="checkbox" value="${escapeHtml(p.id)}" />
          <img src="${escapeHtml(av)}" alt="" />
          <span>${escapeHtml(peerDisplayName(p))}</span>
        </label>`;
      })
      .join("");
  }
  els.chatGroupLayer.hidden = false;
  if (chatGroupModalMode === "create") {
    requestAnimationFrame(() => els.chatGroupNameInput?.focus());
  }
}

async function confirmChatGroupModal() {
  const checked = [
    ...(els.chatGroupPickList?.querySelectorAll('input[type="checkbox"]:checked') ||
      [])
  ].map((el) => el.value);
  setChatGroupError("");
  if (els.chatGroupConfirm) {
    els.chatGroupConfirm.disabled = true;
    els.chatGroupConfirm.textContent = "创建中…";
  }
  try {
    if (chatGroupModalMode === "invite") {
      if (!checked.length) {
        setChatGroupError("请先勾选好友");
        return;
      }
      const updated = await window.LudongCloud.addChatGroupMembers(
        chatGroupModalTargetId,
        checked
      );
      const idx = chatGroupsCache.findIndex((g) => g.id === chatGroupModalTargetId);
      if (idx >= 0) chatGroupsCache[idx] = { ...chatGroupsCache[idx], ...updated, kind: "group" };
      else chatGroupsCache.unshift({ ...updated, kind: "group" });
      closeChatGroupModal();
      renderChatSideList();
      updateChatPeerStatus();
      setChatHint(`已邀请 ${checked.length} 人进群`);
      return;
    }
    const name = String(els.chatGroupNameInput?.value || "").trim().slice(0, 24);
    if (!name) {
      setChatGroupError("请填写群名称");
      els.chatGroupNameInput?.focus();
      return;
    }
    if (!checked.length) {
      setChatGroupError("请至少勾选一位好友");
      return;
    }
    if (!window.LudongCloud?.createChatGroup) {
      setChatGroupError("当前版本不支持群聊，请更新后再试");
      return;
    }
    const group = await window.LudongCloud.createChatGroup(name, checked);
    if (!group?.id) throw new Error("创建失败：未返回群 ID");
    chatGroupsCache = [
      { ...group, kind: "group" },
      ...chatGroupsCache.filter((g) => g.id !== group.id)
    ];
    closeChatGroupModal();
    renderChatSideList();
    setChatHint(`已创建群聊「${group.name}」`);
    selectChatPeer(group.id, "group");
  } catch (err) {
    const msg = String(err?.message || "操作失败");
    setChatGroupError(msg);
    setChatHint(msg, true);
  } finally {
    if (els.chatGroupConfirm && els.chatGroupLayer && !els.chatGroupLayer.hidden) {
      els.chatGroupConfirm.disabled = false;
      els.chatGroupConfirm.textContent = "创建";
    }
  }
}

/* —— 聊天表情 / 右键菜单 —— */
const CHAT_RECALL_MS = 2 * 60 * 1000;
const SAVED_STICKERS_KEY = "ludong-saved-stickers-v1";
const CHAT_EMOJIS = [
  "😀","😁","😂","🤣","😊","😍","😘","😜","🤔","😅",
  "😭","😡","👍","👎","👏","🙏","🔥","✨","💯","🎉",
  "🐱","😺","😻","💤","🎵","🎶","❤️","💔","⭐","🌙"
];
const CHAT_KAOMOJI = [
  "(≧∇≦)ﾉ","(´・ω・`)","(｡•́︿•̀｡)","(づ￣ ³￣)づ","(๑•̀ㅂ•́)و✧",
  "Σ(°△°|||)︴","(￣▽￣)","(๑´ڡ`๑)","(ﾉ´ヮ`)ﾉ*:･ﾟ✧","( •̀ ω •́ )✧",
  "╮(╯▽╰)╭","(╯°□°）╯︵ ┻━┻","(￣ε(#￣)","(๑•̌.•̑๑)˖","♪(´▽｀)"
];
const CHAT_BUILTIN_STICKERS = [
  { id: "momo", url: "./emoji/momo.gif", label: "momo" },
  { id: "kaixin", url: "./emoji/kaixin.gif", label: "开心" }
];

let chatEmojiTab = "emoji";
let msgCtxId = "";
let forwardMsgId = "";

function closeChatEmojiPanel() {
  if (els.chatEmojiPanel) els.chatEmojiPanel.hidden = true;
}

function toggleChatEmojiPanel() {
  if (!chatActivePeerId) return;
  if (!els.chatEmojiPanel) return;
  const open = els.chatEmojiPanel.hidden;
  els.chatEmojiPanel.hidden = !open;
  if (open) renderChatEmojiPanel();
}

function loadSavedStickers() {
  try {
    const raw = localStorage.getItem(SAVED_STICKERS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter((x) => x && x.url).slice(0, 80) : [];
  } catch {
    return [];
  }
}

function saveSavedStickers(list) {
  try {
    localStorage.setItem(SAVED_STICKERS_KEY, JSON.stringify(list.slice(0, 80)));
  } catch {
    /* ignore quota */
  }
}

function addSavedSticker(url, label = "表情") {
  const u = String(url || "").trim();
  if (!u) return false;
  const list = loadSavedStickers().filter((x) => x.url !== u);
  list.unshift({ url: u, label: String(label || "表情").slice(0, 20), at: Date.now() });
  saveSavedStickers(list);
  return true;
}

function renderChatEmojiPanel() {
  if (!els.chatEmojiBody) return;
  els.chatEmojiPanel
    ?.querySelectorAll("[data-emoji-tab]")
    .forEach((btn) => btn.classList.toggle("is-active", btn.dataset.emojiTab === chatEmojiTab));

  if (chatEmojiTab === "emoji") {
    els.chatEmojiBody.innerHTML = `<div class="chat-emoji-grid">${CHAT_EMOJIS.map(
      (e) =>
        `<button type="button" class="chat-emoji-cell" data-insert="${escapeHtml(e)}">${e}</button>`
    ).join("")}</div>`;
    return;
  }
  if (chatEmojiTab === "kaomoji") {
    els.chatEmojiBody.innerHTML = `<div class="chat-kaomoji-list">${CHAT_KAOMOJI.map(
      (k) =>
        `<button type="button" class="chat-kaomoji-item" data-insert="${escapeHtml(k)}">${escapeHtml(k)}</button>`
    ).join("")}</div>`;
    return;
  }
  if (chatEmojiTab === "sticker") {
    els.chatEmojiBody.innerHTML = `<div class="chat-sticker-grid">${CHAT_BUILTIN_STICKERS.map(
      (s) =>
        `<button type="button" class="chat-sticker-cell" data-sticker-url="${escapeHtml(s.url)}" title="${escapeHtml(s.label)}">
          <img src="${escapeHtml(s.url)}" alt="${escapeHtml(s.label)}" />
        </button>`
    ).join("")}</div>
    <p class="chat-emoji-tip">点表情包即可发送；也可到「我的」上传动态/静态图</p>`;
    return;
  }
  const mine = loadSavedStickers();
  els.chatEmojiBody.innerHTML = `
    <div class="chat-sticker-actions">
      <button type="button" class="chat-mini-btn is-primary" id="chatUploadStickerBtn">上传表情包</button>
    </div>
    <div class="chat-sticker-grid">${
      mine.length
        ? mine
            .map(
              (s) =>
                `<button type="button" class="chat-sticker-cell" data-sticker-url="${escapeHtml(s.url)}" title="${escapeHtml(s.label || "表情")}">
                  <img src="${escapeHtml(s.url)}" alt="" />
                </button>`
            )
            .join("")
        : '<div class="empty-tip" style="padding:12px;grid-column:1/-1">还没有保存的表情，可上传或从聊天里右键保存</div>'
    }</div>`;
}

function insertChatText(piece) {
  if (!els.chatInput || els.chatInput.disabled) return;
  const start = els.chatInput.selectionStart ?? els.chatInput.value.length;
  const end = els.chatInput.selectionEnd ?? els.chatInput.value.length;
  const v = els.chatInput.value || "";
  els.chatInput.value = v.slice(0, start) + piece + v.slice(end);
  const pos = start + piece.length;
  els.chatInput.focus();
  try {
    els.chatInput.setSelectionRange(pos, pos);
  } catch {
    /* ignore */
  }
}

function closeCommentsEmojiPanel() {
  if (els.commentsEmojiPanel) els.commentsEmojiPanel.hidden = true;
}

function toggleCommentsEmojiPanel() {
  if (!els.commentsEmojiPanel) return;
  const open = els.commentsEmojiPanel.hidden;
  els.commentsEmojiPanel.hidden = !open;
  if (open) renderCommentsEmojiPanel();
}

function insertCommentsText(piece) {
  if (!els.commentsInput) return;
  const start = els.commentsInput.selectionStart ?? els.commentsInput.value.length;
  const end = els.commentsInput.selectionEnd ?? els.commentsInput.value.length;
  const v = els.commentsInput.value || "";
  const next = v.slice(0, start) + piece + v.slice(end);
  els.commentsInput.value = next.slice(0, 500);
  const pos = Math.min(start + piece.length, els.commentsInput.value.length);
  els.commentsInput.focus();
  try {
    els.commentsInput.setSelectionRange(pos, pos);
  } catch {
    /* ignore */
  }
}

function renderCommentsEmojiPanel() {
  if (!els.commentsEmojiBody) return;
  els.commentsEmojiPanel
    ?.querySelectorAll("[data-comments-emoji-tab]")
    .forEach((btn) =>
      btn.classList.toggle("is-active", btn.dataset.commentsEmojiTab === commentsEmojiTab)
    );

  if (commentsEmojiTab === "emoji") {
    els.commentsEmojiBody.innerHTML = `<div class="chat-emoji-grid">${CHAT_EMOJIS.map(
      (e) =>
        `<button type="button" class="chat-emoji-cell" data-comments-insert="${escapeHtml(e)}">${e}</button>`
    ).join("")}</div>`;
    return;
  }
  if (commentsEmojiTab === "kaomoji") {
    els.commentsEmojiBody.innerHTML = `<div class="chat-kaomoji-list">${CHAT_KAOMOJI.map(
      (k) =>
        `<button type="button" class="chat-kaomoji-item" data-comments-insert="${escapeHtml(k)}">${escapeHtml(k)}</button>`
    ).join("")}</div>`;
    return;
  }
  if (commentsEmojiTab === "sticker") {
    els.commentsEmojiBody.innerHTML = `<div class="chat-sticker-grid">${CHAT_BUILTIN_STICKERS.map(
      (s) =>
        `<button type="button" class="chat-sticker-cell" data-comments-sticker-url="${escapeHtml(s.url)}" title="${escapeHtml(s.label)}">
          <img src="${escapeHtml(s.url)}" alt="${escapeHtml(s.label)}" />
        </button>`
    ).join("")}</div>
    <p class="chat-emoji-tip">点表情包即可发到评论；也可到「我的」上传</p>`;
    return;
  }
  const mine = loadSavedStickers();
  els.commentsEmojiBody.innerHTML = `
    <div class="chat-sticker-actions">
      <button type="button" class="chat-mini-btn is-primary" id="commentsUploadStickerBtn">上传表情包</button>
    </div>
    <div class="chat-sticker-grid">${
      mine.length
        ? mine
            .map(
              (s) =>
                `<button type="button" class="chat-sticker-cell" data-comments-sticker-url="${escapeHtml(s.url)}" title="${escapeHtml(s.label || "表情")}">
                  <img src="${escapeHtml(s.url)}" alt="" />
                </button>`
            )
            .join("")
        : '<div class="empty-tip" style="padding:12px;grid-column:1/-1">还没有保存的表情，可上传</div>'
    }</div>`;
}

async function compressStickerFile(file) {
  if (!file || !String(file.type || "").startsWith("image/")) {
    throw new Error("请选择图片或 GIF");
  }
  if (file.size > 1.2 * 1024 * 1024) {
    throw new Error("表情包请小于约 1.2MB");
  }
  // 动态 GIF 尽量原样保留（否则会变成静态）
  if (/gif/i.test(file.type) || /\.gif$/i.test(file.name || "")) {
    if (file.size > 700 * 1024) throw new Error("动态表情请小于约 700KB");
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("读取失败"));
      reader.readAsDataURL(file);
    });
  }
  return compressAvatarFile(file).then((url) => {
    // compressAvatarFile uses jpeg 160; for stickers enlarge a bit
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 200;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        const s = Math.min(img.width, img.height) || 1;
        const sx = (img.width - s) / 2;
        const sy = (img.height - s) / 2;
        ctx.drawImage(img, sx, sy, s, s, 0, 0, size, size);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => reject(new Error("无法处理图片"));
      img.src = url;
    });
  });
}

/** 聊天粘贴截图：保留宽高比，压到适合 media_url 存储的体积 */
async function compressChatPasteImage(file) {
  if (!file || !String(file.type || "").startsWith("image/")) {
    throw new Error("剪贴板里没有图片");
  }
  if (file.size > 12 * 1024 * 1024) {
    throw new Error("截图太大，请换一张");
  }
  if (/gif/i.test(file.type) || /\.gif$/i.test(file.name || "")) {
    if (file.size > 700 * 1024) throw new Error("动图请小于约 700KB");
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("读取失败"));
      reader.readAsDataURL(file);
    });
  }
  const maxDataUrlLen = 380000;
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      try {
        const srcW = img.width || 1;
        const srcH = img.height || 1;
        let edge = 960;
        let quality = 0.82;
        let out = "";
        const encode = (maxEdge, q) => {
          const scale = Math.min(1, maxEdge / Math.max(srcW, srcH));
          const w = Math.max(1, Math.round(srcW * scale));
          const h = Math.max(1, Math.round(srcH * scale));
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);
          return canvas.toDataURL("image/jpeg", q);
        };
        out = encode(edge, quality);
        while (out.length > maxDataUrlLen && quality > 0.45) {
          quality -= 0.08;
          out = encode(edge, quality);
        }
        while (out.length > maxDataUrlLen && edge > 420) {
          edge = Math.round(edge * 0.75);
          quality = Math.min(quality, 0.72);
          out = encode(edge, quality);
        }
        if (!out || out.length > maxDataUrlLen) {
          reject(new Error("截图压缩后仍过大，请裁剪后再发"));
          return;
        }
        resolve(out);
      } catch (err) {
        reject(err instanceof Error ? err : new Error("无法处理截图"));
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("无法读取截图"));
    };
    img.src = url;
  });
}

let chatPasteBusy = false;

async function sendChatPastedImage(file) {
  if (!chatActivePeerId) {
    setChatHint(isGroupChat() ? "请先选择群聊" : "请先选择好友", true);
    return;
  }
  if (chatPasteBusy) {
    setChatHint("正在发送图片…");
    return;
  }
  chatPasteBusy = true;
  setChatHint("正在发送图片…");
  try {
    const mediaUrl = await compressChatPasteImage(file);
    await sendChatMessage({
      text: "[图片]",
      msgType: "sticker",
      mediaUrl
    });
    setChatHint("");
  } catch (err) {
    setChatHint(err?.message || "图片发送失败", true);
  } finally {
    chatPasteBusy = false;
  }
}

function onChatPaste(e) {
  const items = e.clipboardData?.items;
  if (!items?.length) return;
  for (const item of items) {
    if (!item?.type || !String(item.type).startsWith("image/")) continue;
    e.preventDefault();
    e.stopPropagation();
    const file = item.getAsFile?.();
    if (file) void sendChatPastedImage(file);
    return;
  }
}


function canRecallMessage(m) {
  if (!m?.mine || m.recalled || m.pending || m.failed) return false;
  if (String(m.id || "").startsWith("local-")) return false;
  const t = m.time || (m.createdAt ? Date.parse(m.createdAt) : 0) || 0;
  return t > 0 && Date.now() - t <= CHAT_RECALL_MS;
}

function hideMsgCtxMenu() {
  if (els.msgCtxMenu) els.msgCtxMenu.hidden = true;
  msgCtxId = "";
}

function showMsgCtxMenu(msgId, clientX, clientY) {
  const m = chatMessagesCache.find((x) => x.id === msgId);
  if (!m || !els.msgCtxMenu) return;
  msgCtxId = msgId;
  const recallBtn = els.msgCtxMenu.querySelector('[data-act="recall"]');
  const saveBtn = els.msgCtxMenu.querySelector('[data-act="save-sticker"]');
  if (recallBtn) recallBtn.hidden = !canRecallMessage(m);
  if (saveBtn) saveBtn.hidden = !(m.msgType === "sticker" && m.mediaUrl && !m.recalled);
  els.msgCtxMenu.hidden = false;
  const menu = els.msgCtxMenu;
  const pad = 8;
  const w = menu.offsetWidth || 140;
  const h = menu.offsetHeight || 120;
  let left = Math.min(clientX, window.innerWidth - w - pad);
  let top = Math.min(clientY, window.innerHeight - h - pad);
  left = Math.max(pad, left);
  top = Math.max(pad, top);
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
}

async function recallChatMessage(msgId) {
  const m = chatMessagesCache.find((x) => x.id === msgId);
  if (!canRecallMessage(m)) {
    setChatHint("超过 2 分钟无法撤回", true);
    return;
  }
  try {
    const updated = isGroupChat()
      ? await window.LudongCloud.recallGroupMessage(msgId)
      : await window.LudongCloud.recallDirectMessage(msgId);
    const idx = chatMessagesCache.findIndex((x) => x.id === msgId);
    if (idx >= 0) {
      chatMessagesCache[idx] = { ...chatMessagesCache[idx], ...updated, recalled: true };
      patchChatBubble(chatMessagesCache[idx]);
    }
    setChatHint("已撤回");
  } catch (err) {
    setChatHint(err?.message || "撤回失败", true);
  }
}

async function copyChatMessage(msgId) {
  const m = chatMessagesCache.find((x) => x.id === msgId);
  if (!m || m.recalled) return;
  const text =
    m.msgType === "sticker" ? m.mediaUrl || "[表情]" : m.body || "";
  try {
    await navigator.clipboard.writeText(text);
    setChatHint("已复制");
  } catch {
    setChatHint("复制失败", true);
  }
}

function openForwardPicker(msgId) {
  const m = chatMessagesCache.find((x) => x.id === msgId);
  if (!m || m.recalled) return;
  forwardMsgId = msgId;
  if (!els.chatForwardLayer || !els.chatForwardList) return;
  const friends = (chatFriendsCache || []).filter(
    (p) => !(chatActiveKind === "dm" && p.id === chatActivePeerId)
  );
  if (!friends.length) {
    setChatHint("没有可转发的其他好友", true);
    return;
  }
  els.chatForwardList.innerHTML = friends
    .map((p) => {
      const av = window.LudongCloud?.avatarSrc?.(p.avatarUrl, p.name) || "./logo.jpg";
      return `<button type="button" class="chat-forward-item" data-peer-id="${escapeHtml(p.id)}">
        <img src="${escapeHtml(av)}" alt="" />
        <span>${escapeHtml(peerDisplayName(p))}</span>
      </button>`;
    })
    .join("");
  els.chatForwardLayer.hidden = false;
}

function closeForwardPicker() {
  if (els.chatForwardLayer) els.chatForwardLayer.hidden = true;
  forwardMsgId = "";
}

async function forwardChatMessage(toPeerId) {
  const m = chatMessagesCache.find((x) => x.id === forwardMsgId);
  closeForwardPicker();
  if (!m || !toPeerId) return;
  try {
    if (m.msgType === "sticker" && m.mediaUrl) {
      await window.LudongCloud.sendDirectMessage(toPeerId, "[表情]", {
        msgType: "sticker",
        mediaUrl: m.mediaUrl
      });
    } else {
      await window.LudongCloud.sendDirectMessage(toPeerId, m.body || "", {
        msgType: "text"
      });
    }
    setChatHint(`已转发给 ${peerDisplayName(chatFriendsCache.find((p) => p.id === toPeerId))}`);
  } catch (err) {
    setChatHint(err?.message || "转发失败", true);
  }
}

function renderSearchResults(users) {
  if (!els.chatSearchResults) return;
  if (!users?.length) {
    els.chatSearchResults.innerHTML =
      '<div class="empty-tip" style="padding:8px">没有匹配用户（至少输入 2 个字）</div>';
    return;
  }
  const friendIds = new Set(chatFriendsCache.map((p) => p.id));
  const sorted = [...users].sort((a, b) => {
    const na = Number.isFinite(Number(a.userNo)) ? Number(a.userNo) : Number.POSITIVE_INFINITY;
    const nb = Number.isFinite(Number(b.userNo)) ? Number(b.userNo) : Number.POSITIVE_INFINITY;
    if (na !== nb) return na - nb;
    return String(a.name || "").localeCompare(String(b.name || ""), "zh");
  });
  els.chatSearchResults.innerHTML = sorted
    .map((u) => {
      const isFriend = friendIds.has(u.id);
      const email = u.email
        ? `<span class="chat-peer-email">${escapeHtml(u.email)}</span>`
        : "";
      const action = isFriend
        ? `<button type="button" class="chat-mini-btn" data-chat-id="${escapeHtml(u.id)}">聊天</button>`
        : `<button type="button" class="chat-mini-btn is-primary" data-add-id="${escapeHtml(u.id)}">加好友</button>`;
      const av = window.LudongCloud?.avatarSrc?.(u.avatarUrl, u.name) || "./logo.jpg";
      return `<div class="chat-search-row">
        <img class="chat-peer-avatar" src="${escapeHtml(av)}" alt="" />
        <div class="chat-search-meta">
          <span class="chat-peer-name">${escapeHtml(u.name)}${(() => {
            const idHtml = userIdentityHtml({
              userNo: u.userNo,
              userNoLabel: u.userNoLabel,
              honorTitle: u.honorTitleDisplay || u.honorTitle
            });
            return idHtml ? ` · ${idHtml}` : "";
          })()}</span>${email}
        </div>
        ${action}
      </div>`;
    })
    .join("");
}

function renderFriendRequests(list) {
  if (!els.chatRequests) return;
  const incoming = (list || []).filter((r) => r.incoming);
  const outgoing = (list || []).filter((r) => !r.incoming);
  if (els.chatRequestBadge) {
    if (incoming.length) {
      els.chatRequestBadge.hidden = false;
      els.chatRequestBadge.textContent = String(incoming.length);
    } else {
      els.chatRequestBadge.hidden = true;
    }
  }
  if (!list?.length) {
    els.chatRequests.innerHTML =
      '<div class="empty-tip" style="padding:8px">暂无待处理申请</div>';
    return;
  }
  const blocks = [];
  if (incoming.length) {
    blocks.push('<div class="chat-req-label">待我处理</div>');
    incoming.forEach((r) => {
      blocks.push(`<div class="chat-search-row">
        <div class="chat-search-meta">
          <span class="chat-peer-name">${escapeHtml(r.peer.name)}</span>
          ${r.peer.email ? `<span class="chat-peer-email">${escapeHtml(r.peer.email)}</span>` : ""}
        </div>
        <div class="chat-req-actions">
          <button type="button" class="chat-mini-btn is-primary" data-accept-id="${escapeHtml(r.id)}">同意</button>
          <button type="button" class="chat-mini-btn" data-reject-id="${escapeHtml(r.id)}">拒绝</button>
        </div>
      </div>`);
    });
  }
  if (outgoing.length) {
    blocks.push('<div class="chat-req-label">我发出的</div>');
    outgoing.forEach((r) => {
      blocks.push(`<div class="chat-search-row">
        <div class="chat-search-meta">
          <span class="chat-peer-name">${escapeHtml(r.peer.name)}</span>
          <span class="chat-peer-email">等待对方同意</span>
        </div>
        <button type="button" class="chat-mini-btn" data-cancel-id="${escapeHtml(r.id)}">撤销</button>
      </div>`);
    });
  }
  els.chatRequests.innerHTML = blocks.join("");
}

async function refreshFriendsAndRequests({ silent = false } = {}) {
  try {
    const [friends, requests, groups] = await Promise.all([
      window.LudongCloud.listFriends(),
      window.LudongCloud.listFriendRequests(),
      window.LudongCloud.listChatGroups
        ? window.LudongCloud.listChatGroups().catch((err) => {
            const msg = String(err?.message || "");
            if (!silent) {
              setChatHint(
                /supabase_groups/i.test(msg)
                  ? msg
                  : msg || "群聊加载失败",
                true
              );
            }
            return [];
          })
        : Promise.resolve([])
    ]);
    chatFriendsCache = (friends || []).map((p) => ({ ...p, kind: "dm" }));
    chatGroupsCache = (groups || []).map((g) => ({ ...g, kind: "group" }));
    renderChatSideList();
    renderFriendRequests(requests);
    if (!silent) {
      setChatHint(
        chatFriendsCache.length
          ? ""
          : "还没有好友。到「加好友」搜索对方昵称或邮箱并发申请。"
      );
    }
    return chatFriendsCache;
  } catch (err) {
    chatFriendsCache = [];
    chatGroupsCache = [];
    renderChatSideList();
    renderFriendRequests([]);
    if (!silent) {
      setChatHint(
        err?.message ||
          "加载失败：请在 Supabase 执行 supabase_friends.sql",
        true
      );
    }
    return [];
  }
}

async function openChatLayer() {
  if (!window.LudongCloud?.enabled?.() || !window.LudongCloud?.isLoggedIn?.()) {
    setHint("请先登录后再使用私聊", true);
    return;
  }
  mountMainViews();
  setChatHint("加载中…");
  setChatTab("friends");
  if (els.viewHome) els.viewHome.hidden = true;
  if (els.chatLayer) els.chatLayer.hidden = false;
  els.chatLayer?.classList.add("is-open");
  els.chatLayer?.setAttribute("aria-hidden", "false");
  currentMainView = "chat";
  syncNavActive("chat");
  if (els.chatInput) els.chatInput.disabled = true;
  if (els.chatSend) els.chatSend.disabled = true;
  if (els.chatEmojiBtn) els.chatEmojiBtn.disabled = true;
  closeChatEmojiPanel();
  hideMsgCtxMenu();
  closeForwardPicker();
  closeChatGroupModal();
  try {
    await window.LudongCloud.upsertMyProfile?.();
    window.LudongCloud?.touchPresence?.().catch(() => {});
    await refreshFriendsAndRequests();
    refreshChatUnread({ silent: true });
    if (chatActivePeerId) {
      const still =
        chatActiveKind === "group"
          ? chatGroupsCache.some((g) => g.id === chatActivePeerId)
          : chatFriendsCache.some((p) => p.id === chatActivePeerId);
      if (still) selectChatPeer(chatActivePeerId, chatActiveKind);
      else {
        chatActivePeerId = "";
        chatActiveKind = "dm";
        updateChatPeerStatus();
        renderChatMessages([]);
      }
    } else {
      updateChatPeerStatus();
      renderChatMessages([]);
    }
    setChatHint("");
  } catch (err) {
    setChatHint(err?.message || "无法打开私聊", true);
  }
}

function closeChatLayer() {
  stopChatPoll();
  if (chatSearchTimer) {
    clearTimeout(chatSearchTimer);
    chatSearchTimer = null;
  }
  closeChatEmojiPanel();
  hideMsgCtxMenu();
  closeForwardPicker();
  closeChatGroupModal();
  if (els.chatLayer) els.chatLayer.hidden = true;
  els.chatLayer?.classList.remove("is-open");
  els.chatLayer?.setAttribute("aria-hidden", "true");
  setChatHint("");
  refreshChatUnread({ silent: true });
  if (currentMainView === "chat") {
    currentMainView = "home";
    if (els.viewHome) els.viewHome.hidden = false;
    syncNavActive("home");
  }
}

async function runChatSearch() {
  const q = (els.chatSearchInput?.value || "").trim();
  if (q.length < 2) {
    if (els.chatSearchResults) {
      els.chatSearchResults.innerHTML =
        '<div class="empty-tip" style="padding:8px">输入至少 2 个字搜索</div>';
    }
    return;
  }
  if (els.chatSearchResults) {
    els.chatSearchResults.innerHTML =
      '<div class="empty-tip" style="padding:8px">搜索中…</div>';
  }
  try {
    const users = await window.LudongCloud.searchProfiles(q);
    renderSearchResults(users);
  } catch (err) {
    if (els.chatSearchResults) {
      els.chatSearchResults.innerHTML = `<div class="empty-tip" style="padding:8px">${escapeHtml(err?.message || "搜索失败")}</div>`;
    }
  }
}

async function sendChatMessage(override) {
  if (!chatActivePeerId) {
    setChatHint(isGroupChat() ? "请先选择群聊" : "请先选择好友", true);
    return;
  }
  const msgType = override?.msgType || "text";
  const mediaUrl = override?.mediaUrl || "";
  const text =
    override?.text != null
      ? String(override.text)
      : (els.chatInput?.value || "").trim();
  if (msgType === "sticker") {
    if (!mediaUrl) {
      setChatHint("表情包无效", true);
      return;
    }
  } else if (!text) {
    setChatHint("先写点内容再发送", true);
    return;
  }
  const peerId = chatActivePeerId;
  const kind = chatActiveKind;
  const convKey = chatConvKey(kind, peerId);
  const tempId = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const optimistic = {
    id: tempId,
    body: msgType === "sticker" ? text || "[表情]" : text,
    senderId: window.LudongCloud?.currentUserIdSync?.() || "",
    receiverId: peerId,
    groupId: kind === "group" ? peerId : "",
    mine: true,
    time: Date.now(),
    createdAt: null,
    read: false,
    pending: true,
    msgType,
    mediaUrl,
    recalled: false
  };
  if (!override && els.chatInput) els.chatInput.value = "";
  closeChatEmojiPanel();
  setChatHint("");
  appendChatBubble(optimistic);
  saveActiveThreadCache();
  try {
    const msg =
      kind === "group"
        ? await window.LudongCloud.sendGroupMessage(peerId, optimistic.body, {
            msgType,
            mediaUrl
          })
        : await window.LudongCloud.sendDirectMessage(peerId, optimistic.body, {
            msgType,
            mediaUrl
          });
    if (peerId !== chatActivePeerId || kind !== chatActiveKind) {
      const cached = chatThreadByPeer.get(convKey);
      if (cached?.messages) {
        const idx = cached.messages.findIndex((m) => m.id === tempId);
        if (idx >= 0) cached.messages[idx] = { ...msg, pending: false, failed: false };
        else cached.messages.push({ ...msg, pending: false });
        if (msg.createdAt) cached.lastMsgIso = msg.createdAt;
      }
      return;
    }
    const idx = chatMessagesCache.findIndex((m) => m.id === tempId);
    if (idx >= 0) {
      chatMessagesCache[idx] = { ...msg, pending: false, failed: false };
      patchChatBubble(chatMessagesCache[idx]);
    } else {
      appendChatBubble(msg);
    }
    if (msg.createdAt) chatLastMsgIso = msg.createdAt;
    saveActiveThreadCache();
  } catch (err) {
    if (peerId !== chatActivePeerId || kind !== chatActiveKind) {
      const cached = chatThreadByPeer.get(convKey);
      const m = cached?.messages?.find((x) => x.id === tempId);
      if (m) {
        m.pending = false;
        m.failed = true;
      }
      return;
    }
    const idx = chatMessagesCache.findIndex((m) => m.id === tempId);
    if (idx >= 0) {
      chatMessagesCache[idx].pending = false;
      chatMessagesCache[idx].failed = true;
      patchChatBubble(chatMessagesCache[idx]);
    }
    setChatHint(
      err?.message || (kind === "group" ? "群消息发送失败" : "发送失败（需先成为好友）"),
      true
    );
  }
}

function currentCommentSongPayload() {
  const song = playlist[currentIndex];
  if (!song) return null;
  return {
    key: playStatKey(song),
    id: song.id || "",
    title: song.title || "",
    artist: song.artist || ""
  };
}

async function postCommentAction(payload) {
  const res = await fetch("/api/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) {
    throw new Error(data.error || "操作失败");
  }
  return data;
}

async function sendComment(overrideText) {
  const base = currentCommentSongPayload();
  if (!base) return;
  const text =
    overrideText != null
      ? String(overrideText).trim()
      : (els.commentsInput?.value || "").trim();
  if (!text) {
    setCommentsHint("先写点内容再发送", true);
    return;
  }
  if (els.commentsSend) els.commentsSend.disabled = true;
  setCommentsHint("发送中…");
  closeCommentsEmojiPanel();
  const key = base.key;
  const parentId = commentReplyTarget?.id || "";
  const clearInput = overrideText == null;

  try {
    // 云端优先：好友可见
    if (window.LudongCloud?.enabled?.()) {
      try {
        const cloudItem = await window.LudongCloud.addComment({
          songKey: key,
          title: base.title,
          artist: base.artist,
          text,
          parentId
        });
        const rows = mergeCommentRows([cloudItem], commentsCache[key] || []);
        persistCommentsForKey(key, rows);
        if (parentId) expandedCommentReplies.add(String(parentId));
        renderCommentsList(rows);
        if (clearInput && els.commentsInput) els.commentsInput.value = "";
        clearCommentReplyTarget();
        setCommentsHint(parentId ? "回复已发送到云端" : "已发送到云端，好友可见");
        return;
      } catch (err) {
        setCommentsHint(err?.message || "云端发送失败，改存本地", true);
      }
    }

    const localItem = normalizeCommentItem({
      id: `local-${Date.now()}`,
      text,
      author: window.LudongCloud?.getGuestName?.() || "我",
      time: Date.now(),
      likes: 0,
      hearts: 0,
      liked: false,
      hearted: false,
      parentId,
      userId: currentLibraryUserId()
    });
    try {
      const data = await postCommentAction({
        ...base,
        action: "add",
        text,
        parentId,
        author: window.LudongCloud?.getGuestName?.() || "我",
        userId: currentLibraryUserId()
      });
      const rows = Array.isArray(data.comments)
        ? data.comments
        : mergeCommentRows([data.comment], commentsCache[key] || []);
      persistCommentsForKey(key, rows.map(normalizeCommentItem).filter(Boolean));
      if (parentId) expandedCommentReplies.add(String(parentId));
      renderCommentsList(commentsCache[key]);
      if (clearInput && els.commentsInput) els.commentsInput.value = "";
      clearCommentReplyTarget();
      setCommentsHint(parentId ? "回复已保存" : "已发送并保存到本机");
    } catch (err) {
      const rows = mergeCommentRows([localItem], commentsCache[key] || []);
      persistCommentsForKey(key, rows);
      if (parentId) expandedCommentReplies.add(String(parentId));
      renderCommentsList(rows);
      if (clearInput && els.commentsInput) els.commentsInput.value = "";
      clearCommentReplyTarget();
      setCommentsHint(err?.message || "已保存到本地", true);
    }
  } finally {
    if (els.commentsSend) els.commentsSend.disabled = false;
  }
}

async function deleteCommentById(commentId) {
  const base = currentCommentSongPayload();
  if (!base || !commentId) return;
  const ok = await openConfirm("确定删除这条评论吗？若有回复会一并删除。", "删除评论");
  if (!ok) return;
  const key = base.key;
  const prev = commentsCache[key] || readLocalCommentsMap()[key] || [];
  const optimistic = prev.filter(
    (c) =>
      String(c.id) !== String(commentId) &&
      String(c.parentId || "") !== String(commentId)
  );
  persistCommentsForKey(key, optimistic);
  renderCommentsList(optimistic);
  if (commentReplyTarget?.id === String(commentId)) clearCommentReplyTarget();

  if (window.LudongCloud?.enabled?.() && !String(commentId).startsWith("local-")) {
    try {
      await window.LudongCloud.deleteComment(commentId);
      setCommentsHint("云端评论已删除");
      return;
    } catch (err) {
      setCommentsHint(err?.message || "云端删除失败", true);
    }
  }

  try {
    const data = await postCommentAction({
      ...base,
      action: "delete",
      commentId
    });
    if (Array.isArray(data.comments)) {
      persistCommentsForKey(key, data.comments);
      renderCommentsList(data.comments);
    }
    setCommentsHint("评论已删除");
  } catch (err) {
    setCommentsHint(err?.message || "删除已记在本地", true);
  }
}

async function reactCommentById(commentId, act) {
  const base = currentCommentSongPayload();
  if (!base || !commentId) return;
  const key = base.key;
  const prev = [...(commentsCache[key] || readLocalCommentsMap()[key] || [])];
  const idx = prev.findIndex((c) => String(c.id) === String(commentId));
  if (idx < 0) return;
  const item = { ...normalizeCommentItem(prev[idx]) };
  if (act === "like") {
    item.liked = !item.liked;
    item.likes = item.liked ? Math.max(1, item.likes || 1) : Math.max(0, (item.likes || 1) - 1);
    if (!item.liked) item.likes = 0;
    else item.likes = Math.max(1, item.likes);
  } else if (act === "heart") {
    item.hearted = !item.hearted;
    if (!item.hearted) item.hearts = 0;
    else item.hearts = Math.max(1, item.hearts || 1);
  }
  prev[idx] = item;
  persistCommentsForKey(key, prev);
  renderCommentsList(prev);

  if (window.LudongCloud?.enabled?.() && item.cloud) {
    try {
      const updated = await window.LudongCloud.reactComment(commentId, {
        likes: item.likes,
        hearts: item.hearts
      });
      if (updated) {
        prev[idx] = { ...updated, liked: item.liked, hearted: item.hearted };
        persistCommentsForKey(key, prev);
        renderCommentsList(prev);
      }
      return;
    } catch {
      /* 本地已更新 */
    }
  }

  try {
    const data = await postCommentAction({
      ...base,
      action: act,
      commentId
    });
    if (Array.isArray(data.comments)) {
      persistCommentsForKey(key, data.comments);
      renderCommentsList(data.comments);
    }
  } catch {
    /* 本地已更新 */
  }
}

els.commentsList?.addEventListener("click", (e) => {
  const authorBtn = e.target.closest(".comment-author");
  if (authorBtn) {
    e.preventDefault();
    e.stopPropagation();
    showCommentUserMenu(
      authorBtn,
      authorBtn.dataset.userId || "",
      authorBtn.dataset.author || authorBtn.textContent || ""
    );
    return;
  }
  const foldBtn = e.target.closest(".comment-fold");
  if (foldBtn) {
    e.preventDefault();
    e.stopPropagation();
    hideCommentUserMenu();
    toggleCommentReplies(foldBtn.dataset.parentId || "");
    return;
  }
  const btn = e.target.closest(".comment-act");
  if (!btn) {
    hideCommentUserMenu();
    return;
  }
  e.preventDefault();
  e.stopPropagation();
  hideCommentUserMenu();
  const item = btn.closest(".comment-item");
  const commentId = item?.dataset.commentId || "";
  const act = btn.dataset.act;
  if (!act) return;
  if (act === "reply") {
    replyToComment(
      item?.dataset.commentId || "",
      item?.dataset.author || ""
    );
    // 进入回复时展开该楼，方便对照
    const rows = commentsCache[commentsSongKey] || [];
    renderCommentsList(rows);
    return;
  }
  if (!commentId) return;
  if (act === "delete") deleteCommentById(commentId);
  else if (act === "like" || act === "heart") reactCommentById(commentId, act);
});

els.commentUserMenu?.addEventListener("click", async (e) => {
  const item = e.target.closest("[data-menu]");
  if (!item) return;
  e.preventDefault();
  e.stopPropagation();
  const { userId, author } = commentMenuTarget;
  const action = item.dataset.menu;
  hideCommentUserMenu();
  if (action === "add") await addFriendFromComment(userId, author);
  else if (action === "chat") await chatFromComment(userId, author);
});

document.addEventListener("click", (e) => {
  if (!els.commentUserMenu || els.commentUserMenu.hidden) return;
  if (e.target.closest("#commentUserMenu") || e.target.closest(".comment-author")) {
    return;
  }
  hideCommentUserMenu();
});

async function playLikedItem(key, id) {
  let index = DEFAULT_PLAYLIST.findIndex(
    (s) => (id && String(s.id) === String(id)) || playStatKey(s) === key
  );
  if (index >= 0) {
    playlist = [...DEFAULT_PLAYLIST];
    if (els.searchInput) els.searchInput.value = "";
    renderList();
    closeLikesLayer();
    setPlayQueueForSong(playlist[index], "likes");
    openPlayerWindow();
    await playAt(index);
    return;
  }

  const meta = likedSongs[key];
  if (!meta) {
    setHint("这首喜欢的歌当前不在歌单中", true);
    return;
  }
  const song = {
    id: meta.id || `liked-${key}`,
    title: meta.title,
    artist: meta.artist,
    cover: coverUrlFromLike(meta),
    coverRel: meta.coverRel || "",
    fileRel: meta.fileRel || "",
    url: meta.url || (meta.fileRel ? musicFileUrl(meta.fileRel) : ""),
    lrcFile: meta.lrcFile || "",
    lrcUrl: meta.lrcFile ? musicFileUrl(meta.lrcFile) : "",
    duration: 0,
    local: !!meta.local
  };
  if (!song.url) {
    setHint("找不到可播放文件，可能已被删除", true);
    return;
  }
  playlist = [song, ...DEFAULT_PLAYLIST.filter((s) => playStatKey(s) !== key)];
  renderList();
  closeLikesLayer();
  setPlayQueueForSong(song, "likes");
  openPlayerWindow();
  await playAt(0);
}

const PLAY_STATS_KEEP_KEY = "ludong-rank-keep-v1";

function readStoredPlayBlob(keyBase) {
  try {
    const raw = localStorage.getItem(scopedStorageKey(keyBase));
    const data = raw ? JSON.parse(raw) : null;
    if (!data || typeof data !== "object") return { songs: {} };
    if (!data.songs || typeof data.songs !== "object") data.songs = {};
    return data;
  } catch {
    return { songs: {} };
  }
}

function readLocalPlayStats() {
  const primary = readStoredPlayBlob(PLAY_STATS_KEY_BASE);
  const kept = readStoredPlayBlob(PLAY_STATS_KEEP_KEY);
  return { version: 1, songs: mergePlaySongs(primary.songs, kept.songs) };
}

function writeLocalPlayStats(data) {
  const text = JSON.stringify(data);
  try {
    localStorage.setItem(scopedStorageKey(PLAY_STATS_KEY_BASE), text);
  } catch {
    /* ignore quota */
  }
  // 单独再存一份。旧版启动清理只删 ludong-play-stats-v1，不会碰到这个键。
  try {
    localStorage.setItem(scopedStorageKey(PLAY_STATS_KEEP_KEY), text);
  } catch {
    /* ignore quota */
  }
  if (!userSyncing) scheduleUserSync();
}


const RESUME_KEY = "ludong-resume-v1";
let resumeSavedAt = 0;

function readResume() {
  try {
    const data = JSON.parse(localStorage.getItem(RESUME_KEY) || "null");
    return data && typeof data === "object" ? data : null;
  } catch {
    return null;
  }
}

function resumeIndex() {
  const saved = readResume();
  if (!saved || !playlist.length) return 0;
  let idx = -1;
  if (saved.id) {
    idx = playlist.findIndex((song) => String(song.id) === String(saved.id));
  }
  if (idx < 0 && saved.key) {
    idx = playlist.findIndex((song) => playStatKey(song) === saved.key);
  }
  return idx >= 0 ? idx : 0;
}

function saveResume() {
  const song = playlist[currentIndex];
  if (!song || !audio) return;
  const bound = audio.getAttribute("data-id") || "";
  if (bound && String(song.id || "") !== bound) return;
  const time = Number(audio.currentTime);
  if (!Number.isFinite(time)) return;
  try {
    localStorage.setItem(
      RESUME_KEY,
      JSON.stringify({
        id: String(song.id || ""),
        key: playStatKey(song),
        time: Math.max(0, time)
      })
    );
  } catch {
    /* ignore */
  }
}

function chartRows() {
  const local = readLocalPlayStats();
  return rankingFromSongs(local.songs || {}, 16);
}

function renderRankChart() {
  const list = document.getElementById("rankChartList");
  const note = document.getElementById("rankChartNote");
  if (!list) return;
  const rows = chartRows();
  const top = rows[0]?.count || 1;
  const total = rows.reduce((n, row) => n + (Number(row.count) || 0), 0);
  if (note) note.textContent = rows.length ? `共 ${total} 次播放 · 移到歌名上可看次数` : "还没有播放记录";
  if (!rows.length) {
    list.innerHTML = '<li class="rank-chart-empty">播过歌之后会显示在这里</li>';
    return;
  }
  list.innerHTML = rows
    .map((item, i) => {
      const width = Math.max(8, Math.round((item.count / top) * 100));
      const label = `${item.title} · ${item.artist}`;
      return `<li class="rank-bar-row">
        <div class="rank-bar-top">
          <span class="rank-bar-no">${String(i + 1).padStart(2, "0")}</span>
          <span class="rank-bar-name">${escapeHtml(item.title)}</span>
          <span class="rank-bar-count">${escapeHtml(label)} · ${item.count} 次</span>
        </div>
        <span class="rank-bar-track"><span class="rank-bar-fill" style="width:${width}%"></span></span>
      </li>`;
    })
    .join("");
}

function setRankChartOpen(on) {
  const layer = document.getElementById("rankChartLayer");
  if (!layer) return;
  layer.hidden = !on;
  layer.setAttribute("aria-hidden", on ? "false" : "true");
  if (on) renderRankChart();
}

function rankingFromSongs(songs, limit = 8) {
  return Object.entries(songs || {})
    .map(([key, item]) => ({
      key,
      title: item?.title || "未知歌曲",
      artist: item?.artist || "未知歌手",
      cover: item?.cover || "",
      id: item?.id || "",
      count: Number(item?.count) || 0
    }))
    .filter((row) => row.count > 0)
    .sort(
      (a, b) =>
        b.count - a.count ||
        String(a.title).localeCompare(String(b.title), "zh")
    )
    .slice(0, limit);
}

/** 存相对路径（未编码）；兼容历史错误的 encode 结果 */
function normalizeCoverRel(cover) {
  let c = String(cover || "").trim();
  if (!c) return "";
  if (/^https?:\/\//i.test(c) || c.startsWith("blob:")) return c;
  c = c.replace(/^\.\/?music\//, "");
  for (let i = 0; i < 2; i++) {
    try {
      const decoded = decodeURIComponent(c);
      if (decoded === c) break;
      c = decoded;
    } catch {
      break;
    }
  }
  return c;
}

function coverUrlForRank(item) {
  const id = item?.id || "";
  if (id) {
    const hit =
      DEFAULT_PLAYLIST.find((s) => String(s.id) === String(id)) ||
      playlist.find((s) => String(s.id) === String(id));
    if (hit?.cover) return hit.cover;
  }
  const key = item?.key || "";
  if (key) {
    const hit =
      DEFAULT_PLAYLIST.find((s) => playStatKey(s) === key) ||
      playlist.find((s) => playStatKey(s) === key);
    if (hit?.cover) return hit.cover;
  }
  const rel = normalizeCoverRel(item?.cover || "");
  if (!rel) return "./logo.jpg";
  if (/^https?:\/\//i.test(rel) || rel.startsWith("blob:") || rel.startsWith("./")) {
    return rel;
  }
  return mediaFileUrl(item?.base || "music", rel);
}

function renderRankRow(rows = playRanking) {
  if (!els.rankTrack) return;
  playRanking = Array.isArray(rows) ? rows : [];
  if (els.rankSub) {
    const local = readLocalPlayStats();
    const total = Object.values(local.songs || {}).reduce(
      (n, r) => n + (Number(r?.count) || 0),
      0
    );
    const uid = currentLibraryUserId();
    const tag = uid ? ` · 本账号` : "";
    els.rankSub.textContent = total
      ? `累计 ${total} 次${tag} · 播完才计`
      : `播完才计 1 次${tag}`;
  }
  if (!playRanking.length) {
    els.rankTrack.innerHTML =
      '<div class="rank-empty" id="rankEmpty">完整听完一首会出现在这里</div>';
    return;
  }
  els.rankTrack.innerHTML = playRanking
    .map((item, i) => {
      const cover = coverUrlForRank(item);
      return `
      <button type="button" class="rank-item" data-rank-key="${escapeHtml(
        item.key || ""
      )}" data-rank-id="${escapeHtml(item.id || "")}" title="${escapeHtml(
        item.title
      )} · ${escapeHtml(item.artist)}">
        <span class="rank-badge">${i + 1}</span>
        <img class="rank-cover" src="${cover}" alt="" loading="lazy" onerror="this.src='./logo.jpg'" />
        <span class="rank-meta">
          <span class="rank-song">${escapeHtml(item.title)}</span>
          <span class="rank-count">听过 ${Number(item.count) || 0} 次</span>
        </span>
      </button>`;
    })
    .join("");
}

function mergePlaySongs(a = {}, b = {}) {
  const out = { ...a };
  for (const [key, item] of Object.entries(b || {})) {
    if (!item || typeof item !== "object") continue;
    const cur = out[key];
    const countB = Number(item.count) || 0;
    const countA = Number(cur?.count) || 0;
    if (!cur || countB >= countA) {
      out[key] = {
        title: item.title || cur?.title || "未知歌曲",
        artist: item.artist || cur?.artist || "未知歌手",
        cover: item.cover || cur?.cover || "",
        id: item.id || cur?.id || "",
        count: Math.max(countA, countB)
      };
    }
  }
  return out;
}

async function pushPlayStatsAhead(serverSongs, mergedSongs) {
  const uid = currentLibraryUserId();
  if (window.LudongCloud?.enabled?.() && !uid) return;
  const jobs = [];
  for (const [key, item] of Object.entries(mergedSongs || {})) {
    if (!item || typeof item !== "object") continue;
    const delta = (Number(item.count) || 0) - (Number(serverSongs?.[key]?.count) || 0);
    if (delta <= 0) continue;
    jobs.push(
      fetch(withUserQuery("/api/play-stats"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key,
          id: item.id || "",
          title: item.title || "",
          artist: item.artist || "",
          cover: normalizeCoverRel(item.cover || ""),
          delta,
          userId: uid
        })
      }).catch(() => {})
    );
  }
  if (jobs.length) await Promise.all(jobs);
}

async function readDesktopPlayStats() {
  if (typeof IS_WEB_SITE !== "undefined" && IS_WEB_SITE) return {};
  const uid = currentLibraryUserId();
  if (!uid) return {};
  try {
    const res = await fetch(withUserQuery("/api/play-stats"), { cache: "no-store" });
    if (!res.ok) return {};
    const data = await res.json();
    if (data?.userId && String(data.userId) !== String(uid)) return {};
    const songs = data?.songs && typeof data.songs === "object" ? data.songs : {};
    for (const item of Object.values(songs)) {
      if (item && item.cover) item.cover = normalizeCoverRel(item.cover);
    }
    return songs;
  } catch {
    return {};
  }
}

async function loadPlayStats() {
  const uid = currentLibraryUserId();
  // 云端模式下必须已登录且拿到账号 ID
  if (window.LudongCloud?.enabled?.() && !uid) {
    playRanking = [];
    renderRankRow([]);
    return;
  }
  // 只信「当前账号」本地桶 + 带 userId 的服务端，不读公共文件
  let local = readLocalPlayStats();
  let serverSongs = {};
  for (const item of Object.values(local.songs || {})) {
    if (item && item.cover) item.cover = normalizeCoverRel(item.cover);
  }
  serverSongs = await readDesktopPlayStats();
  if (Object.keys(serverSongs).length) {
    local.songs = mergePlaySongs(local.songs, serverSongs);
  }
  writeLocalPlayStats(local);
  if (Object.keys(serverSongs).length) await pushPlayStatsAhead(serverSongs, local.songs);
  renderRankRow(rankingFromSongs(local.songs));
}

async function recordPlayCount(song) {
  if (!song) return;
  const uid = currentLibraryUserId();
  if (window.LudongCloud?.enabled?.() && !uid) return;
  const key = playStatKey(song);
  if (key === lastCountedPlayKey && Date.now() - (recordPlayCount._at || 0) < 800) {
    return;
  }
  lastCountedPlayKey = key;
  recordPlayCount._at = Date.now();

  const cover = normalizeCoverRel(song.cover || "");

  const local = readLocalPlayStats();
  const prev = local.songs[key] || {};
  local.songs[key] = {
    title: song.title || prev.title || "未知歌曲",
    artist: song.artist || prev.artist || "未知歌手",
    cover: cover || prev.cover || "",
    id: song.id || prev.id || "",
    count: (Number(prev.count) || 0) + 1
  };
  writeLocalPlayStats(local);
  renderRankRow(rankingFromSongs(local.songs));
  appendListenDiary(song);

  try {
    await fetch(withUserQuery("/api/play-stats"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key,
        id: song.id || "",
        title: song.title || "",
        artist: song.artist || "",
        cover,
        delta: 1,
        userId: uid
      })
    });
  } catch {
    /* 本地已保存 */
  }
}

const LISTEN_DIARY_KEY = "ludong-listen-diary-v1";
const LISTEN_DIARY_META_KEY = "ludong-listen-diary-meta-v1";
const LISTEN_DIARY_GEO_KEY = "ludong-listen-diary-geo-v1";
const LISTEN_DIARY_MAX = 800;
const DIARY_FALLBACK_QUOTES = [
  "把今天也听完。",
  "好听的歌，值得再来一遍。",
  "声音落下来的时候，世界会慢一点。",
  "先听完这一首，再想别的事。",
  "有些心情，只适合用歌回答。",
  "今天的光，配得上一首对的歌。",
  "不必赶路，把音量放低一点也好。",
  "反复听的那首，多半说中了什么。",
  "日子平常，歌可以不平常。",
  "听完再睡，也算认真过完这一天。"
];

function diaryLocalDayKey(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function readListenDiary() {
  try {
    const raw = JSON.parse(localStorage.getItem(scopedStorageKey(LISTEN_DIARY_KEY)) || "null");
    const entries = Array.isArray(raw?.entries) ? raw.entries : Array.isArray(raw) ? raw : [];
    return entries
      .map((item) => ({
        at: String(item?.at || ""),
        key: String(item?.key || ""),
        id: String(item?.id || ""),
        title: String(item?.title || "未知歌曲"),
        artist: String(item?.artist || "未知歌手"),
        cover: String(item?.cover || "")
      }))
      .filter((item) => item.at);
  } catch {
    return [];
  }
}

function writeListenDiary(entries) {
  try {
    localStorage.setItem(
      scopedStorageKey(LISTEN_DIARY_KEY),
      JSON.stringify({ entries: entries.slice(0, LISTEN_DIARY_MAX) })
    );
  } catch {
    /* ignore */
  }
}

function readListenDiaryMeta() {
  try {
    const raw = JSON.parse(localStorage.getItem(scopedStorageKey(LISTEN_DIARY_META_KEY)) || "null");
    return raw && typeof raw === "object" && raw.days && typeof raw.days === "object" ? raw.days : {};
  } catch {
    return {};
  }
}

function writeListenDiaryMeta(days) {
  try {
    localStorage.setItem(scopedStorageKey(LISTEN_DIARY_META_KEY), JSON.stringify({ days }));
  } catch {
    /* ignore */
  }
}

function patchListenDiaryDayMeta(dayKey, patch) {
  if (!dayKey) return null;
  const days = readListenDiaryMeta();
  const prev = days[dayKey] && typeof days[dayKey] === "object" ? days[dayKey] : {};
  const next = { ...prev, ...patch };
  days[dayKey] = next;
  writeListenDiaryMeta(days);
  return next;
}

function appendListenDiary(song) {
  if (!song) return;
  const entries = readListenDiary();
  entries.unshift({
    at: new Date().toISOString(),
    key: playStatKey(song),
    id: String(song.id || ""),
    title: song.title || "未知歌曲",
    artist: song.artist || "未知歌手",
    cover: normalizeCoverRel(song.cover || "") || song.cover || ""
  });
  writeListenDiary(entries);
  refreshDiaryEntrySub();
  ensureDiaryWeatherForToday().catch(() => {});
  if (currentMainView === "diary") renderListenDiary();
}

function diaryDayLabel(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "某一天";
  const now = new Date();
  const start = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((start(now) - start(d)) / 86400000);
  const base = `${d.getMonth() + 1}月${d.getDate()}日`;
  if (diff === 0) return `今天 · ${base}`;
  if (diff === 1) return `昨天 · ${base}`;
  const week = ["日", "一", "二", "三", "四", "五", "六"][d.getDay()];
  return `周${week} · ${base}`;
}

function diarySeed(str) {
  let h = 2166136261;
  const s = String(str || "");
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function diaryWeatherFromCode(code) {
  const c = Number(code);
  if (!Number.isFinite(c)) return { icon: "🌤", label: "天气" };
  if (c === 0) return { icon: "☀️", label: "晴" };
  if (c <= 3) return { icon: "⛅", label: "多云" };
  if (c <= 48) return { icon: "🌫", label: "薄雾" };
  if (c <= 57) return { icon: "🌦", label: "毛毛雨" };
  if (c <= 67) return { icon: "🌧", label: "雨" };
  if (c <= 77) return { icon: "❄️", label: "雪" };
  if (c <= 82) return { icon: "🌧", label: "阵雨" };
  if (c <= 86) return { icon: "🌨", label: "阵雪" };
  if (c >= 95) return { icon: "⛈", label: "雷雨" };
  return { icon: "🌤", label: "天气" };
}

function readDiaryGeo() {
  try {
    const raw = JSON.parse(localStorage.getItem(LISTEN_DIARY_GEO_KEY) || "null");
    const lat = Number(raw?.lat);
    const lon = Number(raw?.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
    return { lat, lon };
  } catch {
    return null;
  }
}

function writeDiaryGeo(lat, lon) {
  try {
    localStorage.setItem(
      LISTEN_DIARY_GEO_KEY,
      JSON.stringify({ lat, lon, at: Date.now() })
    );
  } catch {
    /* ignore */
  }
}

function requestDiaryGeo() {
  const cached = readDiaryGeo();
  if (cached) return Promise.resolve(cached);
  if (!navigator.geolocation) return Promise.resolve(null);
  return new Promise((resolve) => {
    let settled = false;
    const done = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };
    const timer = setTimeout(() => done(null), 5000);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timer);
        const lat = pos?.coords?.latitude;
        const lon = pos?.coords?.longitude;
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
          done(null);
          return;
        }
        writeDiaryGeo(lat, lon);
        done({ lat, lon });
      },
      () => {
        clearTimeout(timer);
        done(null);
      },
      { enableHighAccuracy: false, maximumAge: 86400000, timeout: 4500 }
    );
  });
}

async function fetchDiaryWeather(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}` +
    `&longitude=${encodeURIComponent(lon)}` +
    `&current=weather_code,temperature_2m&timezone=auto`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("weather failed");
  const data = await res.json();
  const code = data?.current?.weather_code;
  const temp = data?.current?.temperature_2m;
  const mapped = diaryWeatherFromCode(code);
  return {
    wcode: Number(code),
    temp: Number.isFinite(Number(temp)) ? Math.round(Number(temp)) : null,
    icon: mapped.icon,
    label: mapped.label
  };
}

async function ensureDiaryWeatherForToday() {
  const dayKey = diaryLocalDayKey();
  if (!dayKey) return null;
  const meta = readListenDiaryMeta()[dayKey];
  if (meta && meta.icon && meta.label) return meta;
  const geo = await requestDiaryGeo();
  if (!geo) return meta || null;
  try {
    const weather = await fetchDiaryWeather(geo.lat, geo.lon);
    return patchListenDiaryDayMeta(dayKey, {
      icon: weather.icon,
      label: weather.label,
      temp: weather.temp,
      wcode: weather.wcode,
      weatherAt: new Date().toISOString()
    });
  } catch {
    return meta || null;
  }
}

function songFromDiaryItem(item) {
  if (!item) return null;
  const lib = librarySongs();
  return (
    lib.find((s) => item.key && playStatKey(s) === item.key) ||
    lib.find((s) => item.id && String(s.id) === String(item.id)) ||
    null
  );
}

function pickDiaryLyricCandidate(lines) {
  const list = (Array.isArray(lines) ? lines : [])
    .map((line) => String(line?.text || "").trim())
    .filter((text) => {
      if (!text || isCreditLyric(text)) return false;
      if (/^[♪🎵🎧\s\-–—_.]+$/.test(text)) return false;
      const len = [...text].length;
      return len >= 6 && len <= 28;
    });
  return list;
}

async function loadDiaryLyricLines(song) {
  if (!song) return [];
  const cacheId = lyricsCacheKey(song);
  if (cacheId && lyricsCache.has(cacheId)) {
    const cached = lyricsCache.get(cacheId);
    if (Array.isArray(cached) && cached.length) return cached;
  }
  let text = await fetchLocalLrc(song);
  if (!text) text = await fetchOnlineLrc(song);
  const lines = parseLyricText(text, song.lrcUrl || "");
  if (cacheId && lines.length) lyricsCache.set(cacheId, lines);
  return lines;
}

function fallbackDiaryQuote(dayKey, hero) {
  const idx = diarySeed(`${dayKey}:${hero?.key || hero?.title || ""}`) % DIARY_FALLBACK_QUOTES.length;
  return {
    quote: DIARY_FALLBACK_QUOTES[idx],
    quoteFrom: "",
    quoteKey: `fallback:${idx}`
  };
}

async function ensureDiaryQuoteForDay(dayKey, hero) {
  if (!dayKey || !hero) return fallbackDiaryQuote(dayKey, hero);
  const meta = readListenDiaryMeta()[dayKey];
  const lockedLyric =
    meta?.quote && meta?.quoteKey && String(meta.quoteKey).startsWith("lyric:");
  if (lockedLyric) {
    return {
      quote: String(meta.quote),
      quoteFrom: String(meta.quoteFrom || ""),
      quoteKey: String(meta.quoteKey)
    };
  }
  const song = songFromDiaryItem(hero);
  if (song) {
    try {
      const lines = await loadDiaryLyricLines(song);
      const candidates = pickDiaryLyricCandidate(lines);
      if (candidates.length) {
        const pick =
          candidates[diarySeed(`${dayKey}:${hero.key || hero.id}`) % candidates.length];
        const saved = patchListenDiaryDayMeta(dayKey, {
          quote: pick,
          quoteFrom: hero.title || song.title || "",
          quoteKey: `lyric:${hero.key || hero.id}`
        });
        return {
          quote: saved.quote,
          quoteFrom: saved.quoteFrom,
          quoteKey: saved.quoteKey
        };
      }
    } catch {
      /* fall through */
    }
  }
  const fb = fallbackDiaryQuote(dayKey, hero);
  patchListenDiaryDayMeta(dayKey, fb);
  return fb;
}

function aggregateDiaryDays(entries) {
  const groups = new Map();
  entries.forEach((item) => {
    const d = new Date(item.at);
    if (Number.isNaN(d.getTime())) return;
    const dayKey = diaryLocalDayKey(d);
    if (!groups.has(dayKey)) groups.set(dayKey, []);
    groups.get(dayKey).push(item);
  });
  return [...groups.entries()].map(([dayKey, rows]) => {
    const songMap = new Map();
    rows.forEach((item) => {
      const sk = item.key || item.id || `${item.title}|${item.artist}`;
      if (!songMap.has(sk)) {
        songMap.set(sk, {
          key: item.key,
          id: item.id,
          title: item.title,
          artist: item.artist,
          cover: item.cover,
          count: 0,
          firstAt: item.at,
          lastAt: item.at
        });
      }
      const row = songMap.get(sk);
      row.count += 1;
      if (item.at < row.firstAt) row.firstAt = item.at;
      if (item.at > row.lastAt) row.lastAt = item.at;
      if (!row.cover && item.cover) row.cover = item.cover;
    });
    const songs = [...songMap.values()].sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return String(b.lastAt).localeCompare(String(a.lastAt));
    });
    return {
      dayKey,
      label: diaryDayLabel(rows[0].at),
      totalPlays: rows.length,
      songs,
      hero: songs[0] || null
    };
  });
}

function diaryWeatherHtml(meta) {
  if (!meta?.icon || !meta?.label) {
    return `<span class="diary-weather is-empty" aria-hidden="true"></span>`;
  }
  const temp =
    meta.temp != null && Number.isFinite(Number(meta.temp))
      ? `<span class="diary-weather-temp">${escapeHtml(String(meta.temp))}°</span>`
      : "";
  return `<span class="diary-weather" title="${escapeHtml(meta.label)}">
    <span class="diary-weather-icon">${escapeHtml(meta.icon)}</span>
    <span class="diary-weather-label">${escapeHtml(meta.label)}</span>
    ${temp}
  </span>`;
}

function diarySongButtonHtml(item, { hero = false } = {}) {
  const cover = item.cover || "./logo.jpg";
  const countLabel = item.count > 1 ? `听了 ${item.count} 次` : "听过";
  return `<button type="button" class="diary-entry${hero ? " is-hero" : ""}" data-diary-id="${escapeHtml(
    item.id || ""
  )}" data-diary-key="${escapeHtml(item.key || "")}">
    <img src="${escapeHtml(cover)}" alt="" loading="lazy" />
    <span class="diary-entry-meta">
      ${hero ? `<span class="diary-hero-kicker">今日主角</span>` : ""}
      <span class="diary-entry-title">${escapeHtml(item.title)}</span>
      <span class="diary-entry-sub">${escapeHtml(item.artist)}</span>
    </span>
    <span class="diary-entry-count">${escapeHtml(countLabel)}</span>
  </button>`;
}

function renderDiaryDaySection(day, meta, quote) {
  const weather = diaryWeatherHtml(meta);
  const quoteText = quote?.quote || fallbackDiaryQuote(day.dayKey, day.hero).quote;
  const quoteFrom = quote?.quoteFrom || "";
  const rest = day.songs.slice(1);
  const restHtml = rest.map((item) => diarySongButtonHtml(item)).join("");
  const heroHtml = day.hero ? diarySongButtonHtml(day.hero, { hero: true }) : "";
  return `<section class="diary-day" data-day="${escapeHtml(day.dayKey)}">
    <header class="diary-day-card">
      <div class="diary-day-top">
        <span class="diary-day-title">${escapeHtml(day.label)}</span>
        ${weather}
      </div>
      <p class="diary-day-quote">「${escapeHtml(quoteText)}」</p>
      ${
        quoteFrom
          ? `<p class="diary-day-quote-from">—— ${escapeHtml(quoteFrom)}</p>`
          : ""
      }
      <p class="diary-day-stat">${day.songs.length} 首 · 共 ${day.totalPlays} 次</p>
    </header>
    ${heroHtml}
    ${restHtml ? `<div class="diary-song-list">${restHtml}</div>` : ""}
  </section>`;
}

function refreshDiaryEntrySub() {
  const el = document.getElementById("diaryEntrySub");
  if (!el) return;
  const todayKey = diaryLocalDayKey();
  const keys = new Set();
  readListenDiary().forEach((item) => {
    if (diaryLocalDayKey(item.at) !== todayKey) return;
    keys.add(item.key || item.id || `${item.title}|${item.artist}`);
  });
  el.textContent = keys.size ? `今天 ${keys.size} 首` : "今天听了什么";
}

async function enrichDiaryDaySections(days) {
  const body = document.getElementById("diaryBody");
  if (!body || !days.length) return;
  await ensureDiaryWeatherForToday().catch(() => null);
  const metas = readListenDiaryMeta();
  await Promise.all(
    days.slice(0, 5).map(async (day) => {
      const quote = await ensureDiaryQuoteForDay(day.dayKey, day.hero);
      const meta = readListenDiaryMeta()[day.dayKey] || metas[day.dayKey] || {};
      const section = [...body.querySelectorAll(".diary-day")].find(
        (el) => el.getAttribute("data-day") === day.dayKey
      );
      if (!section) return;
      const tmp = document.createElement("div");
      tmp.innerHTML = renderDiaryDaySection(day, meta, quote);
      const next = tmp.firstElementChild;
      if (next) section.replaceWith(next);
    })
  );
}

function renderListenDiary() {
  const body = document.getElementById("diaryBody");
  const countEl = document.getElementById("diaryPanelCount");
  if (!body) return;
  const entries = readListenDiary();
  const days = aggregateDiaryDays(entries);
  if (countEl) countEl.textContent = days.length ? `${days.length} 天` : "0 天";
  refreshDiaryEntrySub();
  if (!days.length) {
    body.innerHTML =
      `<p class="diary-empty" id="diaryEmpty">完整听完一首歌后，会按天写进日记：天气、一句歌词，还有今天的主角歌</p>`;
    return;
  }
  const metas = readListenDiaryMeta();
  body.innerHTML = days
    .map((day) => {
      const meta = metas[day.dayKey] || {};
      const quote =
        meta.quote
          ? { quote: meta.quote, quoteFrom: meta.quoteFrom || "", quoteKey: meta.quoteKey || "" }
          : fallbackDiaryQuote(day.dayKey, day.hero);
      return renderDiaryDaySection(day, meta, quote);
    })
    .join("");
  enrichDiaryDaySections(days).catch(() => {});
}

function openDiaryLayer() {
  const layer = document.getElementById("diaryLayer");
  if (!layer) return;
  if (els.viewHome) els.viewHome.hidden = true;
  closeEmbeddedView(document.getElementById("playlistDetailLayer"));
  playlistDetailState = null;
  closeEmbeddedView(els.likesLayer || document.getElementById("likesLayer"));
  openEmbeddedView(layer);
  renderListenDiary();
}

function currentMoodRadio() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 10) {
    return {
      id: "dawn",
      title: "晨光电台",
      sub: "刚醒来的一段路，轻一点也暖一点",
      pick: (songs) => songs
    };
  }
  if (hour >= 10 && hour < 14) {
    return {
      id: "noon",
      title: "清亮电台",
      sub: "白天听得清楚的歌，提提精神",
      pick: (songs) => songs
    };
  }
  if (hour >= 14 && hour < 18) {
    return {
      id: "afternoon",
      title: "午后电台",
      sub: "不赶路的时候，适合慢慢听",
      pick: (songs) => songs
    };
  }
  if (hour >= 18 && hour < 22) {
    return {
      id: "dusk",
      title: "晚风电台",
      sub: "天擦黑时，把音量放低一点",
      pick: (songs) => songs
    };
  }
  return {
    id: "night",
    title: "夜色电台",
    sub: "夜里适合陪着待一会的歌",
    pick: (songs) => songs
  };
}

function shuffleSongs(list) {
  const arr = list.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function refreshMoodRadioCard() {
  const mood = currentMoodRadio();
  const title = document.getElementById("moodRadioTitle");
  const sub = document.getElementById("moodRadioSub");
  if (title) title.textContent = mood.title;
  if (sub) sub.textContent = mood.sub;
}

async function startMoodRadio() {
  const mood = currentMoodRadio();
  const lib = librarySongs().filter((s) => s && (s.cloud || s.local || s.url));
  if (lib.length < 1) {
    setHint("曲库还是空的，先导入或听云端歌", true);
    return;
  }
  const pool = shuffleSongs(mood.pick(lib));
  const picked = pool.slice(0, Math.min(16, pool.length));
  const first = picked[0];
  let index = playlist.findIndex((s) => String(s.id) === String(first.id));
  if (index < 0) {
    playlist = librarySongs().slice();
    renderList();
    index = playlist.findIndex((s) => String(s.id) === String(first.id));
  }
  if (index < 0) {
    playlist = [first, ...playlist.filter((s) => String(s.id) !== String(first.id))];
    index = 0;
    renderList();
  }
  playQueueKind = "mood";
  playQueueIds = picked.map((s) => String(s.id));
  openPlayerWindow();
  await playAt(index);
  setHint(`${mood.title} · ${picked.length} 首`);
}

async function playFromRankItem(btn) {
  const id = btn.dataset.rankId || "";
  const key = btn.dataset.rankKey || "";
  const pools = [playlist, DEFAULT_PLAYLIST];
  let song = null;
  let index = -1;

  for (const list of pools) {
    index = list.findIndex(
      (s) =>
        (id && String(s.id) === String(id)) || playStatKey(s) === key
    );
    if (index >= 0) {
      song = list[index];
      if (list !== playlist) {
        playlist = [...DEFAULT_PLAYLIST];
        renderList();
        index = playlist.findIndex(
          (s) =>
            (id && String(s.id) === String(id)) || playStatKey(s) === key
        );
      }
      break;
    }
  }

  if (index < 0 || !song) {
    setHint("这首歌当前不在歌单里，可先搜索或导入", true);
    return;
  }
  openPlayerWindow();
  setPlayQueueForSong(song, "");
  await playAt(index);
}

const USER_PLAYLISTS_KEY = "ludong-user-playlists-v1";
let playlistPickResolver = null;

function readUserPlaylists() {
  try {
    const raw = localStorage.getItem(scopedStorageKey(USER_PLAYLISTS_KEY));
    const data = raw ? JSON.parse(raw) : null;
    const lists = Array.isArray(data?.lists) ? data.lists : [];
    return lists
      .map((p) => ({
        id: String(p.id || ""),
        name: String(p.name || "未命名歌单").slice(0, 24),
        songIds: [...new Set((p.songIds || []).map(String).filter(Boolean))],
        cover: String(p.cover || "").trim()
      }))
      .filter((p) => p.id);
  } catch {
    return [];
  }
}

function writeUserPlaylists(lists) {
  try {
    localStorage.setItem(
      scopedStorageKey(USER_PLAYLISTS_KEY),
      JSON.stringify({ version: 1, lists })
    );
  } catch {
    /* ignore */
  }
  if (!userSyncing) {
    bumpSyncRev(PLAYLISTS_REV_KEY);
    scheduleUserSync();
  }
}

function normalizePlaylistRows(lists) {
  return (Array.isArray(lists) ? lists : [])
    .map((p) => ({
      id: String(p?.id || ""),
      name: String(p?.name || "未命名歌单").slice(0, 24),
      songIds: [...new Set((p?.songIds || []).map(String).filter(Boolean))],
      cover: String(p?.cover || "").trim()
    }))
    .filter((p) => p.id);
}

function mergePlaylistRows(localLists, cloudLists) {
  const map = new Map();
  normalizePlaylistRows(cloudLists).forEach((p) => map.set(p.id, p));
  normalizePlaylistRows(localLists).forEach((p) => {
    const other = map.get(p.id);
    if (!other) {
      map.set(p.id, p);
      return;
    }
    const songIds = [...p.songIds];
    other.songIds.forEach((id) => {
      if (!songIds.includes(id)) songIds.push(id);
    });
    map.set(p.id, {
      id: p.id,
      name: p.name || other.name,
      songIds,
      cover: p.cover || other.cover || ""
    });
  });
  return [...map.values()];
}

function mergeLikeRows(localSongs, cloudSongs) {
  const out = { ...(cloudSongs || {}) };
  for (const [key, item] of Object.entries(localSongs || {})) {
    const other = out[key];
    if (!other || (Number(item?.likedAt) || 0) >= (Number(other.likedAt) || 0)) {
      out[key] = item;
    }
  }
  return out;
}

async function pushUserSync() {
  const cloud = window.LudongCloud;
  if (!cloud?.saveUserSync || !currentLibraryUserId() || userSyncing) return;
  let remote = null;
  try {
    remote = await cloud.fetchUserSync();
  } catch {
    return;
  }
  const local = readLocalPlayStats();
  local.songs = mergePlaySongs(local.songs, remote?.play_stats || {});
  local.songs = mergePlaySongs(local.songs, await readDesktopPlayStats());
  userSyncing = true;
  writeLocalPlayStats(local);
  userSyncing = false;
  renderRankRow(rankingFromSongs(local.songs));
  try {
    await cloud.saveUserSync({
      playStats: local.songs,
      playlists: readUserPlaylists(),
      playlistsRev: readSyncRev(PLAYLISTS_REV_KEY),
      likes: likedSongs,
      likesRev: readSyncRev(LIKES_REV_KEY)
    });
  } catch {
    /* 表未建时保持本地 */
  }
}

async function syncAccountLibrary() {
  const cloud = window.LudongCloud;
  if (!cloud?.fetchUserSync || !currentLibraryUserId()) return;
  let remote = null;
  try {
    remote = await cloud.fetchUserSync();
  } catch {
    return;
  }
  userSyncing = true;
  clearTimeout(userSyncTimer);
  try {
    const local = readLocalPlayStats();
    local.songs = mergePlaySongs(local.songs, remote?.play_stats || {});
    local.songs = mergePlaySongs(local.songs, await readDesktopPlayStats());
    writeLocalPlayStats(local);
    renderRankRow(rankingFromSongs(local.songs));

    const seeded = localStorage.getItem(scopedStorageKey(SYNC_SEEDED_KEY)) === "1";
    let lists = readUserPlaylists();
    let likes = readLocalLikes();
    let listsRev = readSyncRev(PLAYLISTS_REV_KEY);
    let likesRev = readSyncRev(LIKES_REV_KEY);
    const cloudListsRev = Number(remote?.playlists_rev) || 0;
    const cloudLikesRev = Number(remote?.likes_rev) || 0;
    if (!seeded) {
      lists = mergePlaylistRows(lists, remote?.playlists || []);
      likes = mergeLikeRows(likes, remote?.likes || {});
      listsRev = Math.max(listsRev, cloudListsRev, Date.now());
      likesRev = Math.max(likesRev, cloudLikesRev, Date.now());
      localStorage.setItem(scopedStorageKey(PLAYLISTS_REV_KEY), String(listsRev));
      localStorage.setItem(scopedStorageKey(LIKES_REV_KEY), String(likesRev));
      localStorage.setItem(scopedStorageKey(SYNC_SEEDED_KEY), "1");
    } else {
      if (cloudListsRev > listsRev) {
        lists = normalizePlaylistRows(remote?.playlists || []);
        listsRev = cloudListsRev;
        localStorage.setItem(scopedStorageKey(PLAYLISTS_REV_KEY), String(listsRev));
      }
      if (cloudLikesRev > likesRev) {
        likes = remote?.likes && typeof remote.likes === "object" ? remote.likes : {};
        likesRev = cloudLikesRev;
        localStorage.setItem(scopedStorageKey(LIKES_REV_KEY), String(likesRev));
      }
    }
    writeUserPlaylists(lists);
    likedSongs = likes;
    writeLocalLikes(likedSongs);
    updateLikesCountLabel();
    if (els.likesLayer?.classList.contains("is-open")) renderLikesList();
  } finally {
    userSyncing = false;
  }
  try {
    await window.LudongCloud.saveUserSync({
      playStats: readLocalPlayStats().songs,
      playlists: readUserPlaylists(),
      playlistsRev: readSyncRev(PLAYLISTS_REV_KEY),
      likes: likedSongs,
      likesRev: readSyncRev(LIKES_REV_KEY)
    });
  } catch {
    /* 表未建时保持本地 */
  }
  renderList();
}

function forgetSongFromUserPlaylists(song) {
  const id = String(song?.id || "");
  if (!id) return;
  const lists = readUserPlaylists().map((p) => ({
    ...p,
    songIds: p.songIds.filter((sid) => sid !== id)
  }));
  writeUserPlaylists(lists);
}

function addSongToUserPlaylist(listId, song) {
  const id = String(song?.id || "");
  if (!id) return false;
  const lists = readUserPlaylists();
  const target = lists.find((p) => p.id === listId);
  if (!target) return false;
  if (!target.songIds.includes(id)) target.songIds.push(id);
  writeUserPlaylists(lists);
  return true;
}

function removeSongFromUserPlaylist(listId, song) {
  const id = String(song?.id || "");
  const lists = readUserPlaylists();
  const target = lists.find((p) => p.id === listId);
  if (!target) return false;
  target.songIds = target.songIds.filter((sid) => sid !== id);
  writeUserPlaylists(lists);
  return true;
}

function closePlaylistPicker(result) {
  if (els.playlistPickLayer) els.playlistPickLayer.hidden = true;
  const resolve = playlistPickResolver;
  playlistPickResolver = null;
  if (resolve) resolve(result || null);
}

function pickUserPlaylist({ title = "选择歌单", excludeId = "" } = {}) {
  const lists = readUserPlaylists().filter((p) => p.id !== excludeId);
  if (!lists.length) {
    setHint(excludeId ? "没有其他歌单可转移" : "请先点「新建歌单」", true);
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    playlistPickResolver = resolve;
    if (els.playlistPickTitle) els.playlistPickTitle.textContent = title;
    if (els.playlistPickList) {
      els.playlistPickList.innerHTML = lists
        .map(
          (p) =>
            `<button type="button" class="playlist-pick-item" data-pick-id="${escapeHtml(p.id)}">${escapeHtml(p.name)} · ${p.songIds.length} 首</button>`
        )
        .join("");
    }
    if (els.playlistPickLayer) els.playlistPickLayer.hidden = false;
  });
}

function librarySongById(id) {
  const key = String(id || "");
  return (
    DEFAULT_PLAYLIST.find((s) => String(s.id) === key) ||
    playlist.find((s) => String(s.id) === key) ||
    null
  );
}

function songRowHtml(song, indexInPlaylist, { listId = "", queueId = "", displayIndex = 0 } = {}) {
  const i = indexInPlaylist;
  const canFileDelete = !!(
    (song.cloud && song.canDelete) ||
    (song.local && song.fileRel && song.canDelete !== false)
  );
  const liked = isSongLiked(song);
  const inCustom = !!listId;
  const playQueueId = queueId || listId || "";
  const menu = [];
  menu.push(
    `<button type="button" class="song-menu-item" data-action="save" data-index="${i}" data-list-id="${escapeHtml(listId)}">保存到歌单</button>`
  );
  if (inCustom) {
    menu.push(
      `<button type="button" class="song-menu-item" data-action="move" data-index="${i}" data-list-id="${escapeHtml(listId)}">转移到歌单</button>`
    );
    menu.push(
      `<button type="button" class="song-menu-item" data-action="remove" data-index="${i}" data-list-id="${escapeHtml(listId)}">从歌单移除</button>`
    );
  }
  if (!inCustom && canFileDelete) {
    menu.push(
      `<button type="button" class="song-menu-item is-danger" data-action="delete" data-index="${i}">删除</button>`
    );
  }
  return `
      <li class="song" data-index="${i}" data-song-id="${escapeHtml(song.id || "")}" data-list-id="${escapeHtml(listId)}" data-queue-id="${escapeHtml(playQueueId)}">
        <span class="idx">${String(displayIndex + 1).padStart(2, "0")}</span>
        <img src="${escapeHtml(song.cover || "./logo.jpg")}" alt="" loading="lazy" />
        <div class="song-meta">
          <div class="song-title">${escapeHtml(song.title)}</div>
          <div class="song-artist">${escapeHtml(song.artist)}${
            song.preview ? " · 试听" : ""
          }</div>
        </div>
        <div class="song-actions">
          <button type="button" class="song-like${
            liked ? " is-liked" : ""
          }" data-index="${i}" aria-label="${
            liked ? "取消喜欢" : "喜欢"
          }" title="${liked ? "取消喜欢" : "喜欢"}"></button>
          <div class="song-more-wrap">
            <button type="button" class="song-more" data-index="${i}" aria-label="更多操作" title="更多"></button>
            <div class="song-menu" hidden>
              ${menu.join("")}
            </div>
          </div>
        </div>
        <span class="song-duration">${formatTime(song.duration)}</span>
      </li>`;
}

const LIKES_COVER_KEY = "ludong-likes-cover-v1";
let playlistEditing = false;
let playlistSelectedIds = new Set();
let playlistDetailState = null;

function readLikesCover() {
  try {
    return localStorage.getItem(scopedStorageKey(LIKES_COVER_KEY)) || "";
  } catch {
    return "";
  }
}

function writeLikesCover(url) {
  try {
    if (url) localStorage.setItem(scopedStorageKey(LIKES_COVER_KEY), url);
    else localStorage.removeItem(scopedStorageKey(LIKES_COVER_KEY));
  } catch {
    /* ignore */
  }
}

function coverFromSongs(songs, fallback = "./logo.jpg") {
  const hit = (Array.isArray(songs) ? songs : []).find((s) => s?.cover);
  return hit?.cover || fallback;
}

function resolvePlaylistBundle(kind, listId = "") {
  const lib = librarySongs();
  if (kind === "likes") {
    const songs = likedSongsInOrder();
    return {
      kind: "likes",
      listId: "",
      queueId: "likes",
      title: "我喜欢",
      songs,
      cover: readLikesCover() || coverFromSongs(songs),
      coverEditable: true
    };
  }
  if (kind === "cloud") {
    const songs = lib.filter((s) => s.cloud);
    return {
      kind: "cloud",
      listId: "",
      queueId: "cloud",
      title: "云端",
      songs,
      cover: coverFromSongs(songs),
      coverEditable: false
    };
  }
  if (kind === "local") {
    const songs = lib.filter((s) => s.local && !s.cloud);
    return {
      kind: "local",
      listId: "",
      queueId: "local",
      title: "本地",
      songs,
      cover: coverFromSongs(songs),
      coverEditable: false
    };
  }
  const p = readUserPlaylists().find((item) => item.id === listId);
  if (!p) return null;
  const songs = p.songIds.map((id) => librarySongById(id)).filter(Boolean);
  return {
    kind: "custom",
    listId: p.id,
    queueId: p.id,
    title: p.name,
    songs,
    cover: p.cover || coverFromSongs(songs),
    coverEditable: true
  };
}

function playlistBlockHtml(name, {
  kind = "",
  listId = "",
  count = 0,
  openKind = "",
  cover = "./logo.jpg"
} = {}) {
  const checked = listId && playlistSelectedIds.has(listId);
  const check =
    playlistEditing && listId
      ? `<button type="button" class="playlist-check${
          checked ? " is-on" : ""
        }" data-pl-check="${escapeHtml(listId)}" aria-pressed="${
          checked ? "true" : "false"
        }" aria-label="选择歌单" title="选择"></button>`
      : "";
  return `<li class="playlist-block${kind ? ` is-${kind}` : ""}${
    checked ? " is-checked" : ""
  }">
    <div class="playlist-block-row">
      ${check}
      <button type="button" class="playlist-block-head" data-open-kind="${escapeHtml(
        openKind || kind
      )}" data-open-id="${escapeHtml(listId)}">
        <img class="playlist-block-cover" src="${escapeHtml(cover || "./logo.jpg")}" alt="" loading="lazy" />
        <span class="playlist-block-text">
          <span class="playlist-block-name">${escapeHtml(name)}</span>
          <span class="playlist-block-count">${count} 首</span>
        </span>
      </button>
    </div>
  </li>`;
}

function syncPlaylistEditBtn() {
  const btn = document.getElementById("playlistEditBtn");
  const delBtn = document.getElementById("playlistDeleteBtn");
  if (btn) {
    btn.classList.toggle("is-on", playlistEditing);
    btn.setAttribute("aria-pressed", playlistEditing ? "true" : "false");
    btn.textContent = playlistEditing ? "完成" : "编辑";
  }
  els.playlist?.classList.toggle("is-editing", playlistEditing);
  if (delBtn) {
    const n = playlistSelectedIds.size;
    delBtn.hidden = !(playlistEditing && n > 0);
    delBtn.textContent = n > 1 ? `删除(${n})` : "删除";
  }
}

function prunePlaylistSelection() {
  const valid = new Set(readUserPlaylists().map((p) => p.id));
  playlistSelectedIds = new Set(
    [...playlistSelectedIds].filter((id) => valid.has(id))
  );
}

function renderList() {
  prunePlaylistSelection();
  const cloud = librarySongs().filter((s) => s.cloud);
  const local = librarySongs().filter((s) => s.local && !s.cloud);
  const likes = likedSongsInOrder();
  const custom = readUserPlaylists().map((p) => {
    const songs = p.songIds.map((id) => librarySongById(id)).filter(Boolean);
    return { ...p, songs };
  });
  if (els.songCount) els.songCount.textContent = `${playlist.length} 首`;
  if (!playlist.length && !custom.length && !likes.length) {
    els.playlist.innerHTML =
      '<li class="empty-tip">暂无歌曲。可到设置上传云端共同曲库，或导入私人空间</li>';
    syncPlaylistEditBtn();
    return;
  }
  const blocks = [
    playlistBlockHtml("我喜欢", {
      kind: "likes",
      openKind: "likes",
      count: likes.length,
      cover: readLikesCover() || coverFromSongs(likes)
    }),
    playlistBlockHtml("云端", {
      kind: "cloud",
      openKind: "cloud",
      count: cloud.length,
      cover: coverFromSongs(cloud)
    }),
    playlistBlockHtml("本地", {
      kind: "local",
      openKind: "local",
      count: local.length,
      cover: coverFromSongs(local)
    })
  ];
  custom.forEach((p) => {
    blocks.push(
      playlistBlockHtml(p.name, {
        kind: "mine",
        openKind: "custom",
        listId: p.id,
        count: p.songs.length,
        cover: p.cover || coverFromSongs(p.songs)
      })
    );
  });
  els.playlist.innerHTML = blocks.join("");
  syncPlaylistEditBtn();
  updateActive();
  if (playlistDetailState) renderPlaylistDetail();
}

function compressPlaylistCoverFile(file) {
  return new Promise((resolve, reject) => {
    if (!file || !String(file.type || "").startsWith("image/")) {
      reject(new Error("请选择图片文件"));
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      reject(new Error("图片请小于 12MB"));
      return;
    }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const size = 320;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        const s = Math.min(img.width, img.height) || 1;
        const sx = (img.width - s) / 2;
        const sy = (img.height - s) / 2;
        ctx.drawImage(img, sx, sy, s, s, 0, 0, size, size);
        let quality = 0.82;
        let out = canvas.toDataURL("image/jpeg", quality);
        while (out.length > 220000 && quality > 0.45) {
          quality -= 0.08;
          out = canvas.toDataURL("image/jpeg", quality);
        }
        resolve(out);
      } catch (err) {
        reject(err);
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("无法读取图片"));
    };
    img.src = url;
  });
}

function renderPlaylistDetail() {
  const layer = document.getElementById("playlistDetailLayer");
  if (!layer || !playlistDetailState) return;
  const bundle = resolvePlaylistBundle(
    playlistDetailState.kind,
    playlistDetailState.listId || ""
  );
  if (!bundle) {
    closePlaylistDetail();
    return;
  }
  playlistDetailState = {
    kind: bundle.kind,
    listId: bundle.listId || ""
  };
  const titleEl = document.getElementById("playlistDetailTitle");
  const nameEl = document.getElementById("playlistDetailName");
  const countEl = document.getElementById("playlistDetailCount");
  const coverEl = document.getElementById("playlistDetailCover");
  const coverBtn = document.getElementById("playlistCoverBtn");
  const renameBtn = document.getElementById("playlistRenameBtn");
  const listEl = document.getElementById("playlistDetailList");
  if (titleEl) titleEl.textContent = bundle.title;
  if (nameEl) nameEl.textContent = bundle.title;
  if (countEl) countEl.textContent = `${bundle.songs.length} 首`;
  if (coverEl) coverEl.src = bundle.cover || "./logo.jpg";
  if (coverBtn) coverBtn.hidden = !bundle.coverEditable;
  if (renameBtn) renameBtn.hidden = bundle.kind !== "custom";
  if (listEl) {
    if (!bundle.songs.length) {
      listEl.innerHTML = '<li class="playlist-empty">这里还没有歌</li>';
    } else {
      listEl.innerHTML = bundle.songs
        .map((song, n) => {
          const i = playlistIndexOf(song);
          if (i < 0) return "";
          return songRowHtml(song, i, {
            listId: bundle.kind === "custom" ? bundle.listId : "",
            queueId: bundle.queueId,
            displayIndex: n
          });
        })
        .filter(Boolean)
        .join("");
    }
  }
  updateActive();
}

function openPlaylistDetail({ kind, listId = "" } = {}) {
  mountMainViews();
  const bundle = resolvePlaylistBundle(kind, listId);
  if (!bundle) {
    setHint("找不到这个歌单", true);
    return;
  }
  playlistDetailState = { kind: bundle.kind, listId: bundle.listId || "" };
  if (els.viewHome) els.viewHome.hidden = true;
  closeEmbeddedView(document.getElementById("diaryLayer"));
  closeEmbeddedView(els.likesLayer || document.getElementById("likesLayer"));
  closeEmbeddedView(els.chatLayer || document.getElementById("chatLayer"));
  closeEmbeddedView(document.getElementById("wishLayer"));
  closeEmbeddedView(els.profileLayer || document.getElementById("profileLayer"));
  closeEmbeddedView(els.settingsPanel || document.getElementById("settingsPanel"));
  closeEmbeddedView(document.getElementById("seekEmojiLayer"));
  const layer = document.getElementById("playlistDetailLayer");
  openEmbeddedView(layer);
  currentMainView = bundle.kind === "likes" ? "likes" : "playlistDetail";
  syncNavActive(bundle.kind === "likes" ? "likes" : "home");
  renderPlaylistDetail();
}

function closePlaylistDetail() {
  const layer = document.getElementById("playlistDetailLayer");
  closeEmbeddedView(layer);
  playlistDetailState = null;
  if (currentMainView === "playlistDetail" || currentMainView === "likes") {
    currentMainView = "home";
    if (els.viewHome) els.viewHome.hidden = false;
    syncNavActive("home");
  }
}

async function playPlaylistDetailAll() {
  if (!playlistDetailState) return;
  const bundle = resolvePlaylistBundle(
    playlistDetailState.kind,
    playlistDetailState.listId || ""
  );
  if (!bundle?.songs?.length) {
    setHint("这个歌单还没有歌", true);
    return;
  }
  const first = bundle.songs[0];
  let index = playlistIndexOf(first);
  if (index < 0) {
    playlist = [...DEFAULT_PLAYLIST];
    index = playlistIndexOf(first);
  }
  if (index < 0) {
    setHint("这首歌当前不在曲库里", true);
    return;
  }
  setPlayQueueForSong(first, bundle.queueId);
  openPlayerWindow();
  await playAt(index);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function updateActive() {
  const currentId = String(playlist[currentIndex]?.id || "");
  document.querySelectorAll(".song").forEach((el) => {
    el.classList.toggle("active", !!currentId && el.dataset.songId === currentId);
  });
}

function updateUI(song) {
  if (!song) return;
  renderPlayerQueue();
  els.title.textContent = song.title;
  els.artist.textContent = song.artist + (song.preview ? "（试听）" : "");
  els.cover.src = song.cover;
  els.duration.textContent = formatTime(song.duration);
  els.nowCard.hidden = false;
  els.nowCover.src = song.cover;
  els.nowTitle.textContent = song.title;
  els.nowArtist.textContent = song.artist;
  if (els.nowDuration && song.duration) {
    els.nowDuration.textContent = formatTime(song.duration);
  }
  updateActive();
  const atmosphereSrc = (showLyrics ? lyricsCoverUrl(null, song) : "") || song.cover;
  applyPlayerAtmosphere(atmosphereSrc);
  loadLyricsForSong(song);
  syncPlayerLikeButton(song);
  if (showLyrics) applyLyricsSideCover(song);
  if (showLyrics) applyMvForSong(song);
  if (commentsDocked) showPlayerComments();
}

let coverAccentToken = 0;

function vividCoverRgb(r, g, b, hueShift = 0, sat = 0.7, light = 0.58) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const d = max - min;
  if (d) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  h = (h + hueShift) % 1;
  const q = light < 0.5 ? light * (1 + sat) : light + sat - light * sat;
  const p = 2 * light - q;
  const hue = (t) => {
    let x = t;
    if (x < 0) x += 1;
    if (x > 1) x -= 1;
    if (x < 1 / 6) return p + (q - p) * 6 * x;
    if (x < 1 / 2) return q;
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
    return p;
  };
  return [hue(h + 1 / 3), hue(h), hue(h - 1 / 3)].map((c) => Math.round(c * 255));
}

function coverAccentTargets() {
  const list = [];
  if (els.playerWindow) list.push(els.playerWindow);
  list.push(document.documentElement);
  return list;
}

function clearPlayerAtmosphere() {
  for (const el of coverAccentTargets()) {
    el.style.removeProperty("--cover-accent");
    el.style.removeProperty("--cover-accent-deep");
    el.style.removeProperty("--cover-ink");
    el.style.removeProperty("--lyric-ink");
    el.style.removeProperty("--lyric-glow");
    el.style.removeProperty("--lyric-wash");
  }
  if (els.playerAmbientImg) {
    els.playerAmbientImg.removeAttribute("src");
    els.playerAmbientImg.hidden = true;
  }
}

function applyPlayerAtmosphere(src) {
  const url = String(src || "").trim();
  const win = els.playerWindow;
  if (!url || !win) {
    clearPlayerAtmosphere();
    return;
  }
  if (els.playerAmbientImg) {
    els.playerAmbientImg.hidden = false;
    if (els.playerAmbientImg.getAttribute("src") !== url) {
      els.playerAmbientImg.src = url;
    }
  }
  const token = ++coverAccentToken;
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    if (token !== coverAccentToken) return;
    try {
      const size = 28;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;
      let r = 0;
      let g = 0;
      let b = 0;
      let n = 0;
      for (let i = 0; i < data.length; i += 16) {
        const rr = data[i];
        const gg = data[i + 1];
        const bb = data[i + 2];
        const aa = data[i + 3];
        if (aa < 160) continue;
        const max = Math.max(rr, gg, bb);
        const min = Math.min(rr, gg, bb);
        if (max < 36 || max > 248 || max - min < 22) continue;
        r += rr;
        g += gg;
        b += bb;
        n += 1;
      }
      if (!n) throw new Error("flat cover");
      r = Math.round(r / n);
      g = Math.round(g / n);
      b = Math.round(b / n);
      const wash = [r, g, b].map((c) => Math.round(c * 0.62 + 10));
      const vivid = vividCoverRgb(r, g, b);
      const glow = vividCoverRgb(r, g, b, 0.08, 0.48, 0.78);
      const deep = vividCoverRgb(r, g, b, 0, 0.62, 0.4);
      const lum = 0.2126 * vivid[0] + 0.7152 * vivid[1] + 0.0722 * vivid[2];
      const washCss = `rgba(${wash[0]}, ${wash[1]}, ${wash[2]}, 0.5)`;
      for (const el of coverAccentTargets()) {
        el.style.setProperty("--cover-accent", `rgb(${vivid[0]}, ${vivid[1]}, ${vivid[2]})`);
        el.style.setProperty("--cover-accent-deep", `rgb(${deep[0]}, ${deep[1]}, ${deep[2]})`);
        el.style.setProperty("--cover-ink", lum > 176 ? "#1a1408" : "#fffaf3");
        el.style.setProperty("--lyric-ink", `rgb(${vivid[0]}, ${vivid[1]}, ${vivid[2]})`);
        el.style.setProperty("--lyric-glow", `rgb(${glow[0]}, ${glow[1]}, ${glow[2]})`);
        el.style.setProperty("--lyric-wash", washCss);
      }
    } catch {
      if (token === coverAccentToken) clearPlayerAtmosphere();
    }
  };
  img.onerror = () => {
    if (token !== coverAccentToken || !win) return;
    clearPlayerAtmosphere();
  };
  img.src = url;
}

function fitPlayerBoard() {
  if (els.playerBoard) els.playerBoard.style.transform = "";
}

const PLAYER_VIEW_KEY = "ludong-player-view";

function paintCommentsHeading(song) {
  if (els.commentsSongLabel) {
    els.commentsSongLabel.textContent = song ? `${song.title} · ${song.artist}` : "—";
  }
  const img = document.getElementById("commentsCover");
  if (!img) return;
  const src = song ? (showLyrics ? lyricsCoverUrl(null, song) : "") || song.cover || "" : "";
  if (!src) {
    img.hidden = true;
    img.removeAttribute("src");
    return;
  }
  img.hidden = false;
  if (img.getAttribute("src") !== src) img.src = src;
}

function dockCommentsPanel() {
  const host = document.getElementById("playerCommentsHost");
  const panel = document.querySelector(".comments-panel");
  if (!host || !panel) return;
  host.hidden = false;
  if (panel.parentElement !== host) host.appendChild(panel);
  panel.classList.add("is-docked");
  commentsDocked = true;
  els.commentsLayer?.classList.remove("is-open");
  els.commentsLayer?.setAttribute("aria-hidden", "true");
}

function undockCommentsPanel() {
  const layer = els.commentsLayer;
  const panel = document.querySelector(".comments-panel");
  const host = document.getElementById("playerCommentsHost");
  if (panel && layer && panel.parentElement !== layer) layer.appendChild(panel);
  panel?.classList.remove("is-docked");
  commentsDocked = false;
  if (host) host.hidden = true;
}

function showPlayerComments() {
  const wasDocked = commentsDocked;
  dockCommentsPanel();
  const song = playlist[currentIndex];
  if (!song) return;
  const key = playStatKey(song);
  paintCommentsHeading(song);
  if (wasDocked && commentsSongKey === key) return;
  commentsSongKey = key;
  expandedCommentReplies.clear();
  clearCommentReplyTarget();
  const cached = commentsCache[key] || readLocalCommentsMap()[key] || [];
  renderCommentsList(cached);
  if (commentsLoading) return;
  commentsLoading = true;
  loadCommentsForSong(song, { silent: true })
    .catch(() => {})
    .finally(() => {
      commentsLoading = false;
    });
}

function refreshSongFocus() {
  const meta = document.getElementById("songFocusMeta");
  const list = document.getElementById("songFocusList");
  const song = playlist[currentIndex];
  if (!song) {
    if (meta) meta.textContent = "先选一首歌";
    if (list) list.innerHTML = "";
    return;
  }
  const key = playStatKey(song);
  const rows = (commentsCache[key] || []).filter((item) => item && item.text && !String(item.text).startsWith("_"));
  if (meta) {
    meta.textContent = rows.length
      ? `${song.title} · ${rows.length} 条评论`
      : `${song.title} · 打开评论看看大家怎么说`;
  }
  if (!list) return;
  list.innerHTML = rows
    .slice(0, 3)
    .map((item) => {
      const author = String(item.author || "听众").replace(/[<>&]/g, "");
      const text = String(item.text || "").replace(/[<>&]/g, "");
      return `<li>${author}：${text}</li>`;
    })
    .join("");
}

let theaterRestoreLyrics = false;

function currentPlayerView() {
  const win = document.getElementById("playerWindow");
  if (win?.classList.contains("is-view-theater")) return "theater";
  if (win?.classList.contains("is-view-immerse")) return "immerse";
  if (win?.classList.contains("is-view-song")) return "song";
  return "listen";
}

function paintTheaterMotion(playing) {
  const on = !!playing;
  document.getElementById("theaterVinyl")?.classList.toggle("is-spinning", on);
  document.getElementById("theaterViz")?.classList.toggle("is-on", on);
}

// 必须在 clearCoverPlane / bindPlayerViews 之前声明：
// bindPlayerViews 会在脚本加载时恢复「剧场」，若此处仍 TDZ 会整页 JS 崩掉、登录全失效
let coverPlaneTimer = 0;
let switchAnim = "flip";

function clearCoverPlane() {
  const layer = document.getElementById("coverPlaneLayer");
  const outEl = document.getElementById("coverPlaneOut");
  const inEl = document.getElementById("coverPlaneIn");
  clearTimeout(coverPlaneTimer);
  coverPlaneTimer = 0;
  document.querySelector(".is-cover-held")?.classList.remove("is-cover-held");
  if (layer) {
    layer.classList.remove("is-next", "is-prev", "is-flip", "is-fade");
    layer.hidden = true;
  }
  if (outEl) outEl.removeAttribute("src");
  if (inEl) inEl.removeAttribute("src");
}

function dockTheaterChrome(on) {
  const dock = document.getElementById("theaterStageLeft");
  const progress = document.getElementById("playerProgress");
  const controls = document.getElementById("playerControls");
  const player = document.querySelector("#playerBoard .player");
  const modes = document.getElementById("modes");
  const lyricsView = document.getElementById("lyricsView");
  const lyricsSide = document.getElementById("lyricsSide");
  if (!dock || !progress || !controls || !player || !modes) return;
  if (on) {
    // 挂到 .player 下，才能按红框对齐左上/左中，不被歌词层挤歪
    if (dock.parentElement !== player) {
      player.insertBefore(dock, player.firstChild);
    }
    dock.appendChild(progress);
    dock.appendChild(controls);
    dock.classList.add("has-chrome");
  } else {
    if (progress.parentElement === dock || controls.parentElement === dock) {
      player.insertBefore(progress, modes);
      player.insertBefore(controls, modes.nextSibling);
    }
    if (lyricsView && dock.parentElement !== lyricsView) {
      lyricsView.insertBefore(dock, lyricsSide || null);
    }
    dock.classList.remove("has-chrome");
  }
  requestAnimationFrame(() => syncTheaterDockWidth());
}

function syncTheaterDockWidth() {
  const win = document.getElementById("playerWindow");
  const dock = document.getElementById("theaterStageLeft");
  const art = dock?.querySelector(".theater-art-row");
  if (!win?.classList.contains("is-view-theater") || !dock || !art) return;
  const w = Math.ceil(art.getBoundingClientRect().width);
  if (w > 0) {
    win.style.setProperty("--theater-dock-w", `${w}px`);
    dock.style.setProperty("--theater-dock-w", `${w}px`);
  }
}

/** 剧场独立常驻面：封面+歌词始终在，不走「点封面切换歌词」 */
function ensureTheaterSurface() {
  if (currentPlayerView() !== "theater") return;
  clearCoverPlane();
  els.stage?.classList.add("is-lyrics");
  els.stage?.classList.remove("is-mv");
  if (showMv) setMvMode(false);
  showLyrics = true;
  if (els.lyricsView) {
    els.lyricsView.hidden = false;
    els.lyricsView.removeAttribute("hidden");
  }
  if (els.lyricsSide) els.lyricsSide.hidden = false;
  if (els.lyricsArt) els.lyricsArt.hidden = false;
  dockTheaterChrome(true);
  const song = playlist[currentIndex];
  if (song) {
    applyLyricsSideCover(song);
    loadLyricsForSong(song);
  }
  startLyricsLoop();
  paintTheaterMotion(!audio.paused);
  requestAnimationFrame(() => {
    syncTheaterDockWidth();
    if (lyricLines.length) {
      const t = mediaClock().currentTime || 0;
      let idx = 0;
      for (let i = 0; i < lyricLines.length; i++) {
        if (lyricLines[i].time <= t + 0.28) idx = i;
        else break;
      }
      scrollToLyric(idx, { instant: true });
    }
    syncLyrics();
  });
}

function setPlayerView(view) {
  const win = document.getElementById("playerWindow");
  if (!win) return;
  const prev = currentPlayerView();
  const next =
    view === "immerse" || view === "song" || view === "theater" ? view : "listen";
  win.classList.remove("is-view-immerse", "is-view-listen", "is-view-song", "is-view-theater");
  win.classList.add(`is-view-${next}`);
  document.querySelectorAll("[data-player-view]").forEach((btn) => {
    const on = btn.dataset.playerView === next;
    btn.classList.toggle("is-active", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  });
  const focus = document.getElementById("songFocus");
  if (focus) focus.hidden = true;
  if (next === "theater") {
    if (prev !== "theater") theaterRestoreLyrics = showLyrics;
    ensureTheaterSurface();
  } else {
    if (prev === "theater") dockTheaterChrome(false);
    if (prev === "theater" && next === "listen" && !theaterRestoreLyrics) {
      setLyricsMode(false);
    }
  }
  if (next === "song") showPlayerComments();
  else if (commentsDocked) undockCommentsPanel();
  try {
    localStorage.setItem(PLAYER_VIEW_KEY, next);
  } catch {
    /* ignore */
  }
  requestAnimationFrame(() => {
    if (typeof fitPlayerBoard === "function") fitPlayerBoard();
    if (showLyrics) syncLyrics();
    syncTheaterDockWidth();
  });
}

function bindPlayerViews() {
  document.querySelectorAll("[data-player-view]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      setPlayerView(btn.dataset.playerView || "listen");
    });
  });
  document.getElementById("songFocusComments")?.addEventListener("click", (e) => {
    e.stopPropagation();
    openCommentsLayer();
  });
  let saved = "listen";
  try {
    saved = localStorage.getItem(PLAYER_VIEW_KEY) || "listen";
  } catch {
    saved = "listen";
  }
  try {
    setPlayerView(saved);
  } catch (err) {
    console.warn("restore player view failed", saved, err);
    try {
      setPlayerView("listen");
    } catch (err2) {
      console.warn("fallback listen view failed", err2);
    }
  }
  window.addEventListener("resize", () => {
    if (currentPlayerView() === "theater") syncTheaterDockWidth();
  });
}

bindPlayerViews();

let resumeMvOnOpen = false;

function openPlayerWindow() {
  if (!els.playerLayer) return;
  els.playerLayer.classList.add("is-open");
  els.playerLayer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  const win = document.getElementById("playerWindow");
  if (win?.classList.contains("is-view-song")) showPlayerComments();
  // 剧场是独立界面：重开播放器时直接恢复，不必再点封面
  if (currentPlayerView() === "theater") {
    ensureTheaterSurface();
  }
  requestAnimationFrame(() => {
    fitPlayerBoard();
    requestAnimationFrame(fitPlayerBoard);
    if (currentPlayerView() === "theater") syncTheaterDockWidth();
  });
  if (currentPlayerView() === "theater") {
    /* lyrics loop started in ensureTheaterSurface */
  } else if (showMv && els.mvVideo?.getAttribute("data-src")) {
    paintMvChrome();
    if (resumeMvOnOpen && els.mvVideo.paused) {
      els.mvVideo.play().catch(() => {});
    }
    resumeMvOnOpen = false;
    startLyricsLoop();
  } else if (showLyrics) startLyricsLoop();
  else syncLyrics();
}

function closePlayerWindow() {
  if (!els.playerLayer) return;
  const video = els.mvVideo;
  const keepVideo = !!(showMv && video?.getAttribute("data-src"));
  if (keepVideo) {
    // 返回主界面时留在视频上，进度和播放都不打断
    resumeMvOnOpen = !video.paused;
  } else {
    resumeMvOnOpen = false;
    // 剧场模式不要清歌词态，否则下次打开只剩封面、歌词没了
    if (currentPlayerView() !== "theater") {
      setLyricsMode(false);
    }
  }
  els.playerLayer.classList.remove("is-open");
  els.playerLayer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  stopLyricsLoop();
  closeCoverPicker();
  // 返回主界面时刷新排行（本地已记次数）
  renderRankRow(rankingFromSongs(readLocalPlayStats().songs));
}

function bgFileUrl(fileName) {
  return (
    "./lyrics-bg/" +
    String(fileName || "")
      .split("/")
      .filter(Boolean)
      .map((seg) => encodeURIComponent(seg))
      .join("/")
  );
}

async function loadLyricsBackgrounds() {
  try {
    const res = await fetch("./lyrics-bg/list.json", { cache: "no-store" });
    if (!res.ok) throw new Error("no bg list");
    const text = await res.text();
    const data = JSON.parse(text.replace(/^\uFEFF/, ""));
    lyricsBgList = (Array.isArray(data) ? data : [])
      .map((item) => item.file || item)
      .filter(Boolean);
  } catch {
    lyricsBgList = [];
  }
}

const LYRICS_COVER_KEY = "ludong-lyrics-cover-v1";
const LOCAL_COVER_DB = "ludong-cover-lib-idb";
const LOCAL_COVER_STORE = "covers";
let coverPickDraft = null;
let coverLibraryItems = [];
let localCoverItems = [];
let localCoverUrls = new Map();

function readLyricsCoverChoice() {
  try {
    const raw = localStorage.getItem(scopedStorageKey(LYRICS_COVER_KEY));
    const data = raw ? JSON.parse(raw) : null;
    if (data?.mode === "preset" && data.file) return { mode: "preset", file: String(data.file) };
    if (data?.mode === "library" && data.id) return { mode: "library", id: String(data.id) };
    if (data?.mode === "local" && data.id) return { mode: "local", id: String(data.id) };
    if (data?.mode === "custom" && data.dataUrl) return { mode: "custom", dataUrl: String(data.dataUrl) };
  } catch {
    /* ignore */
  }
  return { mode: "song" };
}

function writeLyricsCoverChoice(choice) {
  const next =
    choice?.mode === "preset"
      ? { mode: "preset", file: String(choice.file || "") }
      : choice?.mode === "library"
        ? { mode: "library", id: String(choice.id || "") }
        : choice?.mode === "local"
          ? { mode: "local", id: String(choice.id || "") }
          : choice?.mode === "custom"
            ? { mode: "custom", dataUrl: String(choice.dataUrl || "") }
            : { mode: "song" };
  localStorage.setItem(scopedStorageKey(LYRICS_COVER_KEY), JSON.stringify(next));
}

function openLocalCoverDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(LOCAL_COVER_DB, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(LOCAL_COVER_STORE)) {
        db.createObjectStore(LOCAL_COVER_STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error("无法打开本机封面库"));
  });
}

async function loadLocalCoverLibrary() {
  try {
    const db = await openLocalCoverDb();
    const rows = await new Promise((resolve, reject) => {
      const tx = db.transaction(LOCAL_COVER_STORE, "readonly");
      const req = tx.objectStore(LOCAL_COVER_STORE).getAll();
      req.onsuccess = () => resolve(Array.isArray(req.result) ? req.result : []);
      req.onerror = () => reject(req.error);
    });
    localCoverUrls.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {
        /* ignore */
      }
    });
    localCoverUrls = new Map();
    localCoverItems = rows
      .filter((row) => row && row.id && row.blob)
      .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0))
      .map((row) => {
        const url = URL.createObjectURL(row.blob);
        localCoverUrls.set(String(row.id), url);
        return {
          id: String(row.id),
          name: String(row.name || "封面"),
          previewUrl: url,
          local: true,
          createdAt: row.createdAt || 0
        };
      });
  } catch {
    localCoverItems = [];
  }
}

async function saveLocalCoverBlob(name, blob) {
  const id = `local_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const row = {
    id,
    name: String(name || "封面").slice(0, 40),
    blob,
    createdAt: Date.now()
  };
  const db = await openLocalCoverDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(LOCAL_COVER_STORE, "readwrite");
    tx.objectStore(LOCAL_COVER_STORE).put(row);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error("保存失败"));
  });
  await loadLocalCoverLibrary();
  return id;
}

async function deleteLocalCover(id) {
  const db = await openLocalCoverDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(LOCAL_COVER_STORE, "readwrite");
    tx.objectStore(LOCAL_COVER_STORE).delete(String(id || ""));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error("删除失败"));
  });
  const url = localCoverUrls.get(String(id));
  if (url) {
    try {
      URL.revokeObjectURL(url);
    } catch {
      /* ignore */
    }
    localCoverUrls.delete(String(id));
  }
  await loadLocalCoverLibrary();
}

function coverLibraryUrl(id) {
  const local = localCoverItems.find((x) => x.id === id);
  if (local?.previewUrl) return local.previewUrl;
  const item = coverLibraryItems.find((x) => x.id === id);
  if (item?.previewUrl) return item.previewUrl;
  return id ? `/api/cover-library/preview?id=${encodeURIComponent(id)}` : "";
}

function lyricsCoverUrl(choice, song) {
  const c = choice || readLyricsCoverChoice();
  if (c.mode === "preset" && c.file && lyricsBgList.includes(c.file)) return bgFileUrl(c.file);
  if ((c.mode === "library" || c.mode === "local") && c.id) return coverLibraryUrl(c.id);
  if (c.mode === "custom" && c.dataUrl) return c.dataUrl;
  return song?.cover || "";
}

async function compressCoverFile(file, maxSide = 1280, quality = 0.84) {
  let source = null;
  let closeBitmap = false;
  try {
    if (typeof createImageBitmap === "function") {
      source = await createImageBitmap(file);
      closeBitmap = true;
    }
  } catch {
    source = null;
  }
  if (!source) {
    source = await new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("无法读取图片"));
      };
      img.src = url;
    });
  }
  try {
    const sw = source.width || source.naturalWidth || 1;
    const sh = source.height || source.naturalHeight || 1;
    const scale = Math.min(1, maxSide / Math.max(sw, sh));
    const w = Math.max(1, Math.round(sw * scale));
    const h = Math.max(1, Math.round(sh * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(source, 0, 0, w, h);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (!blob) throw new Error("图片压缩失败");
    return blob;
  } finally {
    if (closeBitmap) {
      try {
        source.close();
      } catch {
        /* ignore */
      }
    }
  }
}

function applyLyricsSideCover(song) {
  const current = song || playlist[currentIndex];
  const choice = readLyricsCoverChoice();
  if (choice.mode === "local" && choice.id && !localCoverUrls.has(choice.id)) {
    loadLocalCoverLibrary()
      .then(() => applyLyricsSideCover(current))
      .catch(() => {});
    return;
  }
  const url = lyricsCoverUrl(choice, current);
  const paint = (img) => {
    if (!img) return;
    if (url) {
      img.hidden = false;
      if (img.getAttribute("src") !== url) img.src = url;
    } else {
      img.removeAttribute("src");
      img.hidden = true;
    }
  };
  paint(els.lyricsBgImg);
  paint(els.lyricsAmbientImg);
  paint(document.getElementById("theaterVinylCover"));
  if (url) applyPlayerAtmosphere(url);
  if (currentPlayerView() === "theater") {
    requestAnimationFrame(() => syncTheaterDockWidth());
  }
}

function closeCoverPicker() {
  if (els.coverPickLayer) els.coverPickLayer.hidden = true;
  coverPickDraft = null;
}

async function loadCoverLibrary() {
  await loadLocalCoverLibrary();
  try {
    const res = await fetch("/api/cover-library", { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) {
      coverLibraryItems = [];
      return;
    }
    coverLibraryItems = Array.isArray(data.items) ? data.items : [];
  } catch {
    coverLibraryItems = [];
  }
}

function coverPickItemHtml(item, { selected = false, local = false } = {}) {
  const id = escapeHtml(item.id || "");
  const src = escapeHtml(item.previewUrl || coverLibraryUrl(item.id));
  const kind = local ? "local" : "lib";
  return `<div class="cover-pick-cell">
    <button type="button" class="cover-pick-item${selected ? " is-selected" : ""}" data-cover-${kind}="${id}" title="${escapeHtml(item.name || "封面")}">
      <img src="${src}" alt="" loading="lazy" />
    </button>
    <button type="button" class="cover-pick-del" data-cover-del="${id}" data-cover-del-kind="${kind}" aria-label="删除封面" title="删除">×</button>
  </div>`;
}

function renderCoverPicker() {
  const draft = coverPickDraft || { mode: "song" };
  if (els.coverPickGrid) {
    const parts = [];
    const mine = [
      ...localCoverItems.map((item) => ({ ...item, local: true })),
      ...coverLibraryItems.map((item) => ({ ...item, local: false }))
    ];
    if (mine.length) {
      parts.push(`<p class="cover-pick-section-label">我上传的 · ${mine.length}</p>`);
      parts.push(`<div class="cover-pick-mine">`);
      for (const item of mine) {
        const selected =
          (item.local && draft.mode === "local" && draft.id === item.id) ||
          (!item.local && draft.mode === "library" && draft.id === item.id);
        parts.push(coverPickItemHtml(item, { selected, local: !!item.local }));
      }
      parts.push(`</div>`);
    }
    if (lyricsBgList.length) {
      parts.push(`<p class="cover-pick-section-label">内置</p>`);
      parts.push(`<div class="cover-pick-mine">`);
      for (const file of lyricsBgList) {
        const selected = draft.mode === "preset" && draft.file === file;
        parts.push(`<div class="cover-pick-cell">
          <button type="button" class="cover-pick-item${selected ? " is-selected" : ""}" data-cover-file="${escapeHtml(file)}">
            <img src="${escapeHtml(bgFileUrl(file))}" alt="" loading="lazy" />
          </button>
        </div>`);
      }
      parts.push(`</div>`);
    }
    if (draft.mode === "custom" && draft.dataUrl) {
      parts.unshift(`<div class="cover-pick-cell">
        <button type="button" class="cover-pick-item is-selected" data-cover-custom="1">
          <img src="${escapeHtml(draft.dataUrl)}" alt="" />
        </button>
      </div>`);
    }
    els.coverPickGrid.innerHTML = parts.length
      ? parts.join("")
      : `<p class="cover-pick-empty">还没有封面，点「上传封面」添加；上传后会保存在这里，可随时删除</p>`;
  }
  els.coverPickSongBtn?.classList.toggle("is-selected", draft.mode === "song");
  els.coverPickUploadBtn?.classList.toggle(
    "is-selected",
    draft.mode === "library" || draft.mode === "local" || draft.mode === "custom"
  );
}

async function openCoverPicker() {
  coverPickDraft = readLyricsCoverChoice();
  await loadCoverLibrary();
  renderCoverPicker();
  if (els.coverPickLayer) els.coverPickLayer.hidden = false;
}

async function applyCoverDraftAndPersist() {
  try {
    writeLyricsCoverChoice(coverPickDraft || { mode: "song" });
  } catch {
    setHint("封面设置保存失败，请重试", true);
    return false;
  }
  applyLyricsSideCover(playlist[currentIndex]);
  return true;
}

function mvCandidateRels(song) {
  const rel = String(song?.fileRel || "").replace(/^\/+/, "");
  if (!rel || song?.cloud) return [];
  const slash = rel.lastIndexOf("/");
  const folder = slash >= 0 ? rel.slice(0, slash + 1) : "";
  const fileName = slash >= 0 ? rel.slice(slash + 1) : rel;
  const stem = fileName.replace(/\.[^.]+$/, "");
  const names = [];
  for (const ext of MV_EXTS) {
    names.push(`${stem}${ext}`);
    names.push(`mv${ext}`);
    names.push(`MV${ext}`);
    names.push(`video${ext}`);
  }
  const out = [];
  const seen = new Set();
  for (const n of names) {
    const r = folder + n;
    if (seen.has(r)) continue;
    seen.add(r);
    out.push(r);
  }
  return out;
}

async function probeUrlExists(url) {
  try {
    const head = await fetch(url, { method: "HEAD" });
    if (head.ok) return true;
  } catch {
    /* ignore */
  }
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Range: "bytes=0-0" }
    });
    return res.ok || res.status === 206;
  } catch {
    return false;
  }
}

async function resolveOwnMvUrl(song) {
  if (!song) return "";
  if (song.videoUrl) return song.videoUrl;
  if (song.cloud) return "";
  if (mvProbeCache.has(song.id)) return mvProbeCache.get(song.id) || "";
  const base = song.base || "music";
  for (const rel of mvCandidateRels(song)) {
    const url = mediaFileUrl(base, rel);
    if (await probeUrlExists(url)) {
      song.videoRel = rel;
      song.videoUrl = url;
      mvProbeCache.set(song.id, url);
      return url;
    }
  }
  mvProbeCache.set(song.id, "");
  return "";
}

function songMvDrivesAudio() {
  const video = els.mvVideo;
  return !!(showMv && video && video.dataset.mvKind === "song" && video.getAttribute("data-src"));
}

function mvReady() {
  const video = els.mvVideo;
  return !!(
    songMvDrivesAudio() &&
    video &&
    !video.error &&
    !(els.mvEmpty && !els.mvEmpty.hidden)
  );
}

function paintMvSourceBtn(hasOwn) {
  const btn = els.mvSourceBtn;
  if (!btn) return;
  const show = !!(showMv && hasOwn);
  btn.hidden = !show;
  const usingSong = show && els.mvVideo?.dataset.mvKind === "song";
  btn.textContent = usingSong ? "默认视频" : "原本视频";
  btn.title = usingSong ? "改回循环的默认视频" : "切换到这首歌自己的视频";
}

function syncAmbientMv(playing) {
  const video = els.mvVideo;
  if (!video || !showMv || video.dataset.mvKind !== "default") return;
  video.muted = true;
  video.loop = true;
  if (playing) {
    const pending = video.play();
    if (pending && typeof pending.catch === "function") pending.catch(() => {});
  } else {
    try {
      video.pause();
    } catch {
      /* ignore */
    }
  }
}

function mediaClock() {
  return mvReady() ? els.mvVideo : audio;
}

function clearMvVideo() {
  const video = els.mvVideo;
  if (!video) return;
  try {
    video.pause();
  } catch {
    /* ignore */
  }
  video.removeAttribute("src");
  video.removeAttribute("data-src");
  try {
    video.load();
  } catch {
    /* ignore */
  }
}

function handoffToMv(wasPlaying) {
  const video = els.mvVideo;
  if (!video) return;
  const t = audio.currentTime || 0;
  try {
    audio.pause();
  } catch {
    /* ignore */
  }
  audio.muted = true;
  video.muted = false;
  video.volume = 1;
  const applyTime = () => {
    try {
      if (Math.abs((video.currentTime || 0) - t) > 0.2) video.currentTime = t;
    } catch {
      /* ignore */
    }
    if (wasPlaying) {
      video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      video.pause();
      setPlaying(false);
    }
  };
  if (video.readyState >= 1) applyTime();
  else video.addEventListener("loadedmetadata", applyTime, { once: true });
}

function handoffToAudio(wasPlaying) {
  const video = els.mvVideo;
  const t = video?.currentTime || audio.currentTime || 0;
  if (video) {
    try {
      video.pause();
    } catch {
      /* ignore */
    }
    video.muted = true;
  }
  audio.muted = false;
  try {
    if (Math.abs((audio.currentTime || 0) - t) > 0.2) audio.currentTime = t;
  } catch {
    /* ignore */
  }
  if (wasPlaying) {
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  } else {
    audio.pause();
    setPlaying(false);
  }
}

async function applyMvForSong(song) {
  const video = els.mvVideo;
  if (!video) return;
  const ownUrl = await resolveOwnMvUrl(song);
  const useSong = !!(mvPreferSong && ownUrl);
  const url = useSong ? ownUrl : DEFAULT_MV_URL;
  const kind = useSong ? "song" : "default";
  if (els.mvToggleBtn) {
    els.mvToggleBtn.hidden = !showLyrics;
    els.mvToggleBtn.disabled = false;
    els.mvToggleBtn.classList.toggle("is-on", showMv);
    els.mvToggleBtn.textContent = showMv ? "歌词" : "视频";
    els.mvToggleBtn.title = showMv ? "返回歌词" : "切换到视频";
  }
  paintMvSourceBtn(!!ownUrl);
  if (!showMv) {
    clearMvVideo();
    if (els.mvEmpty) els.mvEmpty.hidden = true;
    return;
  }
  if (els.mvEmpty) els.mvEmpty.hidden = true;
  if (video.dataset.mvKind === kind && video.getAttribute("data-src") === url) {
    if (kind === "default") syncAmbientMv(!audio.paused);
    paintMvSourceBtn(!!ownUrl);
    return;
  }
  const wasPlaying = !audio.paused || (!video.paused && !!video.getAttribute("data-src"));
  const previousKind = video.dataset.mvKind || "";
  video.controls = false;
  video.disablePictureInPicture = true;
  video.loop = kind === "default";
  video.dataset.mvKind = kind;
  video.setAttribute("data-src", url);
  video.src = url;
  try {
    video.load();
  } catch {
    /* ignore */
  }
  paintMvSourceBtn(!!ownUrl);
  if (kind === "default") {
    video.muted = true;
    video.volume = 0;
    const startLoop = () => {
      if (previousKind === "song") handoffToAudio(wasPlaying);
      else audio.muted = false;
      syncAmbientMv(wasPlaying || !audio.paused);
    };
    if (video.readyState >= 1) startLoop();
    else video.addEventListener("loadedmetadata", startLoop, { once: true });
    return;
  }
  video.muted = false;
  const ready = () => handoffToMv(!!wasPlaying || !audio.paused);
  if (video.readyState >= 1) ready();
  else video.addEventListener("loadedmetadata", ready, { once: true });
}

function paintMvCaptions() {
  els.mvFrame?.classList.toggle("is-cc-off", !showMvCaptions);
  if (els.mvCcBtn) {
    els.mvCcBtn.classList.toggle("is-on", showMvCaptions);
    els.mvCcBtn.setAttribute("aria-pressed", showMvCaptions ? "true" : "false");
    els.mvCcBtn.title = showMvCaptions ? "关闭字幕" : "打开字幕";
  }
  if (els.mvLyric) {
    els.mvLyric.classList.toggle("is-empty", !showMvCaptions || !lyricLines.length);
  }
}

function setMvCaptions(on) {
  showMvCaptions = !!on;
  try {
    localStorage.setItem("ludong-mv-cc", showMvCaptions ? "1" : "0");
  } catch {
    /* ignore */
  }
  paintMvCaptions();
  if (showMvCaptions) syncLyrics();
}

function paintMvChrome() {
  els.stage?.classList.toggle("is-mv", showMv);
  els.stage?.classList.toggle("is-lyrics", showLyrics || showMv);
  if (els.mvView) {
    if (showMv) els.mvView.removeAttribute("hidden");
    else els.mvView.setAttribute("hidden", "");
  }
  if (els.lyricsView) {
    if (showMv || !showLyrics) els.lyricsView.setAttribute("hidden", "");
    else els.lyricsView.removeAttribute("hidden");
  }
  if (els.mvToggleBtn) {
    els.mvToggleBtn.classList.toggle("is-on", showMv);
    els.mvToggleBtn.textContent = showMv ? "歌词" : "视频";
    els.mvToggleBtn.title = showMv ? "返回歌词" : "切换到 MV";
  }
  paintMvCaptions();
}

function setMvMode(on) {
  const next = !!on;
  const video = els.mvVideo;
  const kind = video?.dataset.mvKind || "";
  const wasPlaying = kind === "song" ? !video.paused : !audio.paused;
  if (!next && showMv) {
    showMv = false;
    paintMvChrome();
    if (els.lyricsSide) els.lyricsSide.hidden = false;
    if (els.lyricsArt) els.lyricsArt.hidden = false;
    if (kind === "song") handoffToAudio(wasPlaying);
    else if (video) {
      try {
        video.pause();
      } catch {
        /* ignore */
      }
      audio.muted = false;
    }
    clearMvVideo();
    if (els.mvSourceBtn) els.mvSourceBtn.hidden = true;
    return;
  }
  showMv = next;
  paintMvChrome();
  if (els.lyricsSide) els.lyricsSide.hidden = false;
  if (els.lyricsArt) els.lyricsArt.hidden = false;
  applyMvForSong(playlist[currentIndex]);
}

function setLyricsMode(on) {
  // 剧场不走「听歌页点封面切换歌词」；禁止在剧场里被关掉
  if (!on && currentPlayerView() === "theater") return;
  showLyrics = !!on;
  els.stage.classList.toggle("is-lyrics", showLyrics);
  if (showLyrics) {
    if (els.lyricsView) els.lyricsView.hidden = !!showMv;
    applyLyricsSideCover(playlist[currentIndex]);
    syncLyrics(true);
    startLyricsLoop();
    if (els.mvToggleBtn) els.mvToggleBtn.hidden = currentPlayerView() === "theater" ? true : false;
    if (showMv) applyMvForSong(playlist[currentIndex]);
    else paintMvChrome();
  } else {
    stopLyricsLoop();
    setMvMode(false);
    if (els.mvView) els.mvView.hidden = true;
    if (els.lyricsView) els.lyricsView.hidden = false;
    els.stage?.classList.remove("is-mv");
    if (els.mvToggleBtn) els.mvToggleBtn.hidden = true;
  }
}

function startLyricsLoop() {
  stopLyricsLoop();
  const tick = () => {
    if (!showLyrics) return;
    syncLyrics(false);
    lyricsRaf = requestAnimationFrame(tick);
  };
  lyricsRaf = requestAnimationFrame(tick);
}

function stopLyricsLoop() {
  if (lyricsRaf) {
    cancelAnimationFrame(lyricsRaf);
    lyricsRaf = 0;
  }
}

function isCreditLyric(text) {
  const t = String(text || "").trim();
  if (!t) return true;
  if (/^(作词|作曲|编曲|歌词|词\s*[:：]|曲\s*[:：])/i.test(t)) return true;
  if (/^(lyrics|composed|written|music)\s*by/i.test(t)) return true;
  if (/^(lyricist|composer)\s*[:：]/i.test(t)) return true;
  return false;
}

function finishTimedLyricLines(timedEvents) {
  const lines = [];
  for (const ev of timedEvents) {
    if (ev.text) {
      if (isCreditLyric(ev.text)) continue;
      lines.push({
        time: ev.time,
        text: ev.text,
        end: ev.end != null ? ev.end : null,
        endLocked: ev.end != null,
        words: Array.isArray(ev.words) && ev.words.length ? ev.words : null
      });
    } else if (lines.length) {
      const prev = lines[lines.length - 1];
      if (prev.end == null) {
        prev.end = ev.time;
        prev.endLocked = true;
      }
    }
  }
  for (let i = 0; i < lines.length; i++) {
    const nextTime = lines[i + 1]?.time;
    if (lines[i].end == null && nextTime != null) {
      lines[i].end = nextTime;
      lines[i].endLocked = false;
    }
  }
  return lines;
}

function parseLrcClock(min, sec, frac) {
  const ms = Number(String(frac || "0").padEnd(3, "0").slice(0, 3));
  return Number(min) * 60 + Number(sec) + ms / 1000;
}

/** 逐字/逐词增强 LRC：整句显示，用字级时间轴驱动高亮速度 */
function isEnhancedLrcSegments(segs) {
  const content = segs.filter((s) => String(s.text || "").length > 0);
  if (content.length < 2) return false;
  const shortN = content.filter((s) => String(s.text).trim().length <= 2).length;
  return shortN >= Math.ceil(content.length * 0.6);
}

/** LDDC / A2：`[句首]<00:01.00>字<00:01.20>字` */
function parseAngleWordSegments(row) {
  const re = /<(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?>([^<]*)/g;
  const words = [];
  let end = null;
  let m;
  while ((m = re.exec(row))) {
    const time = parseLrcClock(m[1], m[2], m[3]);
    const text = m[4] == null ? "" : String(m[4]);
    if (text.length) words.push({ time, text });
    else end = time;
  }
  if (words.length < 2) return null;
  return {
    time: words[0].time,
    text: words.map((w) => w.text).join(""),
    words,
    end: end != null ? end : undefined
  };
}

/**
 * 若文件被拆成「一字一行」，按字间隔收成整句，并保留 words 时间轴。
 */
function coalesceEnhancedCharEvents(events) {
  const items = (events || []).filter((e) => e && e.time >= 0 && e.text);
  if (items.length < 10) return events;
  if (items.some((e) => Array.isArray(e.words) && e.words.length >= 2)) {
    return events;
  }
  const shortN = items.filter((e) => [...String(e.text)].length <= 2).length;
  if (shortN < items.length * 0.8) return events;

  const gaps = [];
  for (let i = 1; i < items.length; i++) {
    gaps.push(items[i].time - items[i - 1].time);
  }
  gaps.sort((a, b) => a - b);
  const medianGap = gaps.length ? gaps[Math.floor(gaps.length / 2)] : 0.3;
  const breakGap = Math.max(0.95, medianGap * 2.8);

  const out = [];
  let cur = null;
  for (const ev of items) {
    const piece = String(ev.text);
    if (!cur) {
      cur = {
        time: ev.time,
        text: piece,
        words: [{ time: ev.time, text: piece }]
      };
      continue;
    }
    const prevT = cur.words[cur.words.length - 1].time;
    const gap = ev.time - prevT;
    if (gap >= breakGap) {
      cur.end = prevT + Math.min(Math.max(gap * 0.35, 0.25), 0.9);
      out.push(cur);
      cur = {
        time: ev.time,
        text: piece,
        words: [{ time: ev.time, text: piece }]
      };
    } else {
      cur.text += piece;
      cur.words.push({ time: ev.time, text: piece });
    }
  }
  if (cur) out.push(cur);
  return out.length ? out : events;
}

function parseSrt(text) {
  if (!text) return [];
  const blocks = String(text).replace(/^\uFEFF/, "").split(/\r?\n\r?\n+/);
  const timed = [];
  const ts =
    /(\d{1,2}):(\d{2}):(\d{2})[,.](\d{1,3})\s*-->\s*(\d{1,2}):(\d{2}):(\d{2})[,.](\d{1,3})/;
  for (const block of blocks) {
    const rows = block.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
    if (!rows.length) continue;
    let i = 0;
    if (/^\d+$/.test(rows[0])) i = 1;
    if (i >= rows.length) continue;
    const m = rows[i].match(ts);
    if (!m) continue;
    const toSec = (h, mi, s, ms) =>
      Number(h) * 3600 +
      Number(mi) * 60 +
      Number(s) +
      Number(String(ms).padEnd(3, "0").slice(0, 3)) / 1000;
    const start = toSec(m[1], m[2], m[3], m[4]);
    const end = toSec(m[5], m[6], m[7], m[8]);
    const body = rows
      .slice(i + 1)
      .join(" ")
      .replace(/<[^>]+>/g, "")
      .replace(/\{[^}]+\}/g, "")
      .trim();
    if (!body || isCreditLyric(body)) continue;
    timed.push({ time: start, text: body, end });
  }
  timed.sort((a, b) => a.time - b.time);
  return finishTimedLyricLines(timed);
}

function parseLrc(text) {
  if (!text) return [];
  const events = [];
  const re = /\[(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?\]([^\[]*)/g;
  String(text)
    .split(/\r?\n/)
    .forEach((raw) => {
      const row = raw.trim();
      if (!row) return;
      if (/^\[(ti|ar|al|by|offset|from|length|tool):/i.test(row)) return;

      // LDDC 增强格式：句首 [时间] + 逐字 <时间>
      if (/<\d{1,2}:\d{1,2}/.test(row)) {
        const enhanced = parseAngleWordSegments(row);
        if (enhanced) {
          events.push(enhanced);
          return;
        }
      }

      const segs = [];
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(row))) {
        segs.push({
          time: parseLrcClock(m[1], m[2], m[3]),
          text: m[4] == null ? "" : String(m[4])
        });
      }

      if (!segs.length) {
        if (!/^\[/.test(row)) {
          events.push({ time: -1, text: row });
        }
        return;
      }

      // 另一种逐字：一行里多个 [时间]字
      if (isEnhancedLrcSegments(segs)) {
        const words = segs
          .filter((s) => String(s.text || "").length > 0)
          .map((s) => ({
            time: s.time,
            text: String(s.text).replace(/<[^>]+>/g, "")
          }))
          .filter((w) => w.text.length);
        if (!words.length) return;
        const trailing = segs.filter((s) => !String(s.text || "").length);
        const end = trailing.length ? trailing[trailing.length - 1].time : null;
        events.push({
          time: words[0].time,
          text: words.map((w) => w.text).join(""),
          words,
          end: end != null ? end : undefined
        });
        return;
      }

      for (const s of segs) {
        const cleaned = String(s.text || "")
          .replace(/<[^>]+>/g, "")
          .trim();
        events.push({ time: s.time, text: cleaned });
      }
    });

  let timedEvents = events
    .filter((e) => e.time >= 0)
    .sort((a, b) => a.time - b.time);
  timedEvents = coalesceEnhancedCharEvents(timedEvents);
  if (timedEvents.length) return finishTimedLyricLines(timedEvents);

  const plain = events.filter((l) => l.text && !isCreditLyric(l.text));
  if (!plain.length) return [];
  const duration = getDuration() || plain.length * 4;
  const step = duration / plain.length;
  return plain.map((l, i) => ({
    time: i * step,
    text: l.text,
    end: (i + 1) * step,
    endLocked: true,
    words: null
  }));
}

function parseLyricText(text, hintUrl = "") {
  const raw = String(text || "");
  if (!raw.trim()) return [];
  const looksSrt =
    /\.srt(?:$|\?)/i.test(String(hintUrl || "")) ||
    /\d{1,2}:\d{2}:\d{2}[,.]\d{1,3}\s*-->\s*\d{1,2}:\d{2}:\d{2}[,.]\d{1,3}/.test(raw);
  if (looksSrt) {
    const srt = parseSrt(raw);
    if (srt.length) return srt;
  }
  return parseLrc(raw);
}

/** 歌词「音量」：中文按字，英文按近似音节 */
function lyricWeight(text) {
  const s = String(text || "");
  let cjk = 0;
  let letters = 0;
  for (const ch of s) {
    if (ch >= "\u4e00" && ch <= "\u9fff") cjk += 1;
    else if (/[a-zA-Z]/.test(ch)) letters += 1;
  }
  const unit = cjk + letters / 3.2;
  return Math.max(unit, 1);
}

/**
 * 用本首歌相邻句的真实间隔自校准语速。
 * 普通 LRC 只有句起点，没有逐字时间；对齐只能尽量贴合句间节奏。
 */
function calibrateKaraokeTempo(lines) {
  const spans = [];
  const rates = [];
  for (let i = 0; i < lines.length; i++) {
    const start = lines[i].time;
    const end = lines[i].end;
    if (end == null) continue;
    const span = end - start;
    if (span < 0.6) continue;
    // 未锁定的超长间隔多半是间奏，不参与校准
    if (!lines[i].endLocked && span > 7.5) continue;
    spans.push(span);
    rates.push(span / lyricWeight(lines[i].text));
  }
  spans.sort((a, b) => a - b);
  rates.sort((a, b) => a - b);
  const mid = (arr, fallback) =>
    arr.length ? arr[Math.floor(arr.length / 2)] : fallback;
  const secPerUnit = mid(rates, 0.34);
  const medianSpan = mid(spans, 4);
  return {
    secPerUnit,
    // 超过这个间隔视为「句间有停顿/间奏」
    normalSpanMax: Math.max(5.5, medianSpan * 1.75)
  };
}

let karaokeTempo = { secPerUnit: 0.34, normalSpanMax: 6.5 };

/** 按逐字时间轴算高亮进度（整句仍一次显示，光标按字走） */
function wordTimedFillProgress(line, nextLine, t) {
  const words = line?.words;
  if (!words?.length) return null;
  const n = words.length;
  const weights = words.map((w) => Math.max(lyricWeight(w.text), 0.35));
  const totalW = weights.reduce((a, b) => a + b, 0) || n;
  const lineEnd =
    line.end ??
    nextLine?.time ??
    words[n - 1].time + Math.max(0.35, weights[n - 1] * 0.35);

  if (t <= words[0].time) return 0;
  if (t >= lineEnd) return 1;

  let i = 0;
  for (let k = 0; k < n; k++) {
    if (words[k].time <= t) i = k;
    else break;
  }
  const wStart = words[i].time;
  const wEnd = i + 1 < n ? words[i + 1].time : lineEnd;
  const frac = Math.min(
    1,
    Math.max(0, (t - wStart) / Math.max(wEnd - wStart, 0.01))
  );
  let passed = 0;
  for (let k = 0; k < i; k++) passed += weights[k];
  passed += weights[i] * frac;
  return Math.min(1, Math.max(0, passed / totalW));
}

function lineFillProgress(line, nextLine, t) {
  const wordP = wordTimedFillProgress(line, nextLine, t);
  if (wordP != null) return wordP;

  const start = line?.time ?? 0;
  const nextT = nextLine?.time;
  const locked = !!line?.endLocked;
  const hardEnd =
    line?.end ??
    nextT ??
    Math.max(getDuration() || start + 3, start + 0.01);
  const toNext = nextT != null ? nextT - start : hardEnd - start;
  const toHard = Math.max(hardEnd - start, 0.01);

  let singDur;
  if (locked) {
    // 空时间戳句末：按 LRC 真实句末走完
    singDur = toHard;
  } else if (nextT != null && toNext <= karaokeTempo.normalSpanMax) {
    // 正常接句：渐变铺满到下一句起点（与换句节奏一致）
    singDur = Math.max(toNext, 0.01);
  } else {
    // 长间奏 / 无下一句：用本歌自校准语速，避免拖很久
    const estimated = lyricWeight(line?.text || "") * karaokeTempo.secPerUnit;
    singDur = Math.min(toHard * 0.96, Math.max(0.85, estimated));
  }

  return Math.min(1, Math.max(0, (t - start) / Math.max(singDur, 0.01)));
}

function markLyricsManual() {
  if (lyricsAutoScrolling) return;
  lyricsDetached = true;
  lyricsManualUntil = Date.now() + 1000;
}

function scrollToLyric(index, { instant = false } = {}) {
  const win = els.lyricsWindow;
  const track = els.lyricsTrack;
  const line = track?.children[index];
  if (!win || !line) return;

  const pad = win.clientHeight / 2 - line.offsetHeight / 2;
  const top = Math.max(0, line.offsetTop - pad);

  lyricsAutoScrolling = true;
  if (instant) {
    win.scrollTop = top;
  } else {
    win.scrollTo({ top, behavior: "smooth" });
  }
  window.setTimeout(
    () => {
      lyricsAutoScrolling = false;
    },
    instant ? 80 : 700
  );
}

function renderLyrics(lines, emptyMsg) {
  lyricLines = lines || [];
  activeLyricIndex = -1;
  lyricsManualUntil = 0;
  lyricsDetached = false;
  karaokeTempo = calibrateKaraokeTempo(lyricLines);
  const has = lyricLines.length > 0;
  if (els.lyricsBoard) els.lyricsBoard.hidden = !has;
  if (els.lyricEmpty) {
    els.lyricEmpty.hidden = has;
    if (!has) els.lyricEmpty.innerHTML = emptyMsg || "暂无歌词";
  }
  if (!els.lyricsTrack) return;
  if (!has) {
    els.lyricsTrack.innerHTML = "";
    return;
  }
  els.lyricsTrack.innerHTML = lyricLines
    .map(
      (line, i) =>
        `<div class="lyric-line" data-index="${i}">` +
        `<span class="lyric-karaoke">${escapeHtml(line.text)}</span>` +
        `</div>`
    )
    .join("");
  // 立刻亮出第一句，避免先空屏再跳入
  requestAnimationFrame(() => {
    scrollToLyric(0, { instant: true });
    syncLyrics();
  });
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function syncMvLyricOverlay(idx, waiting) {
  const box = els.mvLyric;
  const curEl = els.mvLyricCurrent;
  if (!box || !curEl) return;
  if (!showMvCaptions || !lyricLines.length) {
    box.classList.add("is-empty");
    curEl.textContent = "";
    return;
  }
  box.classList.remove("is-empty");
  curEl.textContent = lyricLines[idx]?.text || "";
}

function syncLyrics() {
  if (!lyricLines.length) {
    if (els.lyricsBoard) els.lyricsBoard.hidden = true;
    if (els.lyricEmpty) els.lyricEmpty.hidden = false;
    syncMvLyricOverlay(0, true);
    return;
  }
  if (els.lyricsBoard) els.lyricsBoard.hidden = false;
  if (els.lyricEmpty) els.lyricEmpty.hidden = true;

  const t = mediaClock().currentTime || 0;
  const firstTime = lyricLines[0]?.time ?? 0;
  // 略提前换句，滚动和字号变化来得及在开口时到位
  const lead = t + 0.28;
  const waiting = lead + 0.08 < firstTime;

  let idx = 0;
  if (!waiting) {
    for (let i = 0; i < lyricLines.length; i++) {
      if (lyricLines[i].time <= lead) idx = i;
      else break;
    }
  }

  const cur = lyricLines[idx];
  const nxt = lyricLines[idx + 1];
  const progress = waiting ? 0 : lineFillProgress(cur, nxt, t);

  syncMvLyricOverlay(idx, waiting);

  const track = els.lyricsTrack;

  if (!track) return;
  const nodes = track.children;
  const follow = Date.now() >= lyricsManualUntil;

  // 手动滑开后，停住再滚回正在唱的那句
  if (follow && (lyricsDetached || idx !== activeLyricIndex)) {
    scrollToLyric(idx, { instant: true });
    lyricsDetached = false;
  } else if (follow && waiting && activeLyricIndex < 0) {
    scrollToLyric(0, { instant: true });
  }
  activeLyricIndex = idx;

  const theater = document.getElementById("playerWindow")?.classList.contains("is-view-theater");
  for (let i = 0; i < nodes.length; i++) {
    const el = nodes[i];
    const dist = i - idx;
    const ad = Math.abs(dist);
    el.classList.toggle("is-active", i === idx);
    el.classList.toggle("is-near", ad === 1);
    el.classList.toggle("is-far", theater ? ad === 2 : ad > 1);
    el.classList.toggle("is-ghost", theater && ad > 2);
    el.classList.toggle("is-past", dist < 0);
    el.classList.toggle("is-soon", dist > 0);
    el.classList.toggle("is-waiting", waiting && i === idx);
    el.dataset.dist = String(dist);
    const ink = el.querySelector(".lyric-karaoke");
    if (!ink) continue;
    if (i === idx) {
      ink.style.setProperty("--p", progress.toFixed(4));
    } else if (i < idx) {
      ink.style.setProperty("--p", "1");
    } else {
      ink.style.setProperty("--p", "0");
    }
  }
}

async function fetchLocalLrc(song) {
  const tryUrl = async (url) => {
    if (!url) return "";
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return "";
      const text = await res.text();
      return text && text.trim() ? text : "";
    } catch {
      return "";
    }
  };
  const urls = [];
  const push = (u) => {
    if (u && !urls.includes(u)) urls.push(u);
  };
  push(song?.lrcUrl || "");
  const base = song?.base || "music";
  const rel = String(song?.fileRel || song?.lrcFile || "").replace(/^\/+/, "");
  if (rel) {
    const stem = rel.replace(/\.mp3$/i, "").replace(/\.lrc$/i, "").replace(/\.srt$/i, "");
    push(mediaFileUrl(base, `${stem}.lrc`));
    push(mediaFileUrl(base, `${stem}.srt`));
  }
  for (const url of urls) {
    const text = await tryUrl(url);
    if (text) {
      song.lrcUrl = url;
      return text;
    }
  }
  return "";
}

async function fetchOnlineLrc(song) {
  try {
    const tryParse = async (url) => {
      const res = await fetch(url);
      if (!res.ok) return "";
      const data = await res.json();
      if (Array.isArray(data)) {
        const hit =
          data.find((x) => x.syncedLyrics) ||
          data.find((x) => x.plainLyrics);
        return hit?.syncedLyrics || hit?.plainLyrics || "";
      }
      return data.syncedLyrics || data.plainLyrics || "";
    };

    const exact = new URLSearchParams({
      track_name: song.title,
      artist_name: song.artist
    });
    if (song.duration > 0) {
      exact.set("duration", String(Math.round(song.duration)));
    }

    let text = await tryParse(`https://lrclib.net/api/get?${exact}`);
    if (text) return text;

    text = await tryParse(`https://lrclib.net/api/search?${exact}`);
    if (text) return text;

    text = await tryParse(
      `https://lrclib.net/api/search?q=${encodeURIComponent(
        `${song.title} ${song.artist}`
      )}`
    );
    return text || "";
  } catch {
    return "";
  }
}

async function loadLyricsForSong(song) {
  if (!song) {
    renderLyrics([], "选择歌曲后可查看歌词");
    return;
  }

  const cacheId = lyricsCacheKey(song);
  if (cacheId && lyricsCache.has(cacheId)) {
    const cached = lyricsCache.get(cacheId);
    // 空缓存可能是导入 srt 前留下的，允许再拉一次
    if (cached && cached.length) {
      renderLyrics(cached);
      syncLyrics();
      return;
    }
    lyricsCache.delete(cacheId);
  }

  renderLyrics([], "歌词加载中…");

  let text = await fetchLocalLrc(song);
  if (!text) text = await fetchOnlineLrc(song);

  const lines = parseLyricText(text, song.lrcUrl || "");
  if (cacheId) lyricsCache.set(cacheId, lines);
  if (lines.length) {
    renderLyrics(lines);
  } else {
    renderLyrics(
      [],
      `暂无「${escapeHtml(song.title)}」歌词<br/>可把同名 .lrc / .srt 放到歌曲文件夹`
    );
  }
  syncLyrics();
}

function setPlaying(playing) {
  const on = !!playing;
  syncAmbientMv(on);
  els.disc.classList.toggle("spinning", on);
  paintTheaterMotion(on);
  els.nowToggle.classList.toggle("playing", on);
  els.playBtn.classList.toggle("is-playing", on);
  els.playBtn.setAttribute("aria-label", on ? "暂停播放" : "开始播放");
  els.playBtn.setAttribute("title", on ? "暂停播放" : "开始播放");
  // 进度条表情由设置里的选择决定
  refreshSeekThumbGif();
  if (on && showLyrics) startLyricsLoop();
  if (!on) {
    // 暂停时保留最后一帧高亮，停掉循环即可
    stopLyricsLoop();
    if (showLyrics) syncLyrics();
  }
}

function togglePlay() {
  // 未选中歌曲时，从第一首开始
  if (currentIndex < 0 || !audio.src) {
    playAt(Math.max(currentIndex, 0));
    return;
  }

  if (mvReady()) {
    const video = els.mvVideo;
    try {
      audio.pause();
    } catch {
      /* ignore */
    }
    if (video.paused) {
      const p = video.play();
      if (p && typeof p.then === "function") {
        p.then(() => setPlaying(true)).catch(() => setPlaying(false));
      } else {
        setPlaying(true);
      }
    } else {
      video.pause();
      setPlaying(false);
    }
    return;
  }

  if (audio.paused) {
    // 继续播放（不重头开始）
    const p = audio.play();
    if (p && typeof p.then === "function") {
      p.then(() => setPlaying(true)).catch(() => {
        playAt(currentIndex);
      });
    } else {
      setPlaying(true);
    }
  } else {
    audio.pause();
    setPlaying(false);
  }
}

function isLocalUrl(url) {
  return (
    typeof url === "string" &&
    (url.startsWith("./") || url.startsWith("/") || !/^https?:\/\//i.test(url))
  );
}

const blobCache = new Map();

async function resolvePlayUrl(song) {
  if (!song) return "";
  if (song.objectUrl) return song.objectUrl;
  const raw = String(song.url || "").trim();
  if (!raw) {
    throw new Error(song.cloud ? "云端音频地址无效" : "本地音频路径无效");
  }
  if (!isLocalUrl(raw)) return raw;

  if (blobCache.has(song.id)) {
    song.objectUrl = blobCache.get(song.id);
    return song.objectUrl;
  }

  const res = await fetch(raw);
  if (!res.ok) {
    throw new Error(`本地文件读取失败(${res.status})：${song.fileRel || song.title || ""}`);
  }
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  blobCache.set(song.id, objectUrl);
  song.objectUrl = objectUrl;
  return objectUrl;
}

function probeDuration(url) {
  return new Promise((resolve) => {
    if (!url) {
      resolve(0);
      return;
    }
    const probe = new Audio();
    let settled = false;
    const finish = (sec) => {
      if (settled) return;
      settled = true;
      probe.removeAttribute("src");
      try {
        probe.load();
      } catch {
        /* ignore */
      }
      resolve(sec && isFinite(sec) && sec > 0 ? Math.round(sec) : 0);
    };
    probe.preload = "metadata";
    probe.addEventListener("loadedmetadata", () => finish(probe.duration));
    probe.addEventListener("durationchange", () => {
      if (probe.duration && isFinite(probe.duration)) finish(probe.duration);
    });
    probe.addEventListener("error", () => finish(0));
    setTimeout(() => finish(0), 8000);
    probe.src = url;
  });
}

async function fillSongDuration(song) {
  if (!song || (song.duration && song.duration > 0)) return song;
  // 云端歌不在启动时探测：会同时打很多印度节点请求，拖垮真正播放
  if (song.cloud) return song;
  try {
    const url = await resolvePlayUrl(song);
    const sec = await probeDuration(url);
    if (sec > 0) song.duration = sec;
  } catch {
    /* ignore */
  }
  return song;
}

async function fillAllDurations(list) {
  const need = (list || []).filter((s) => s && !(s.duration > 0) && !s.cloud);
  const concurrency = 2;
  let i = 0;
  async function worker() {
    while (i < need.length) {
      const idx = i++;
      await fillSongDuration(need[idx]);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, need.length) }, () => worker())
  );
}

function waitForAudioReady(timeout = 12000) {
  return new Promise((resolve, reject) => {
    let done = false;
    const cleanup = () => {
      audio.removeEventListener("loadedmetadata", onOk);
      audio.removeEventListener("canplay", onOk);
      audio.removeEventListener("error", onErr);
    };
    const onOk = () => {
      if (done) return;
      done = true;
      cleanup();
      resolve();
    };
    const onErr = () => {
      if (done) return;
      done = true;
      cleanup();
      const code = audio.error?.code;
      reject(new Error(code ? `media-error-${code}` : "media-error"));
    };
    audio.addEventListener("loadedmetadata", onOk);
    audio.addEventListener("canplay", onOk);
    audio.addEventListener("error", onErr);
    setTimeout(() => {
      if (done) return;
      if (audio.readyState >= 1) {
        onOk();
        return;
      }
      done = true;
      cleanup();
      reject(new Error("timeout"));
    }, timeout);
  });
}

function playFailHint(song, err) {
  const msg = String(err?.message || err?.name || "");
  if (/NotAllowedError|not allowed|user.*denied/i.test(msg)) {
    return "浏览器拦截了自动播放，请再点一次播放";
  }
  if (song?.cloud) {
    if (/timeout|media-error|Failed to fetch|NetworkError|Load failed/i.test(msg)) {
      return "云端歌曲加载失败：网络较慢或文件不存在，请稍后重试";
    }
    if (/地址无效|empty/i.test(msg)) {
      return "云端歌曲地址无效，请让上传者重新上传";
    }
    return `云端播放失败：${msg || "请检查网络后重试"}`;
  }
  if (/读取失败|load failed|404|media-error/i.test(msg)) {
    return `本地播放失败：找不到「${song?.fileRel || song?.title || "音频"}」`;
  }
  return `播放失败：${msg || "请稍后重试"}`;
}

function librarySongs() {
  return DEFAULT_PLAYLIST.length ? DEFAULT_PLAYLIST : playlist;
}

function likedSongsInOrder() {
  const lib = librarySongs();
  return Object.entries(likedSongs)
    .map(([key, item]) => ({ key, ...item }))
    .sort(
      (a, b) =>
        (Number(b.likedAt) || 0) - (Number(a.likedAt) || 0) ||
        String(a.title).localeCompare(String(b.title), "zh")
    )
    .map((item) =>
      lib.find(
        (song) =>
          (item.id && String(song.id) === String(item.id)) ||
          playStatKey(song) === item.key
      ) ||
      playlist.find(
        (song) =>
          (item.id && String(song.id) === String(item.id)) ||
          playStatKey(song) === item.key
      )
    )
    .filter(Boolean);
}

function setPlayQueueForSong(song, listId) {
  const id = String(listId || "").trim();
  const lib = librarySongs();
  let ids = [];
  if (id === "likes") {
    playQueueKind = "likes";
    ids = likedSongsInOrder().map((item) => item.id);
  } else if (id === "cloud") {
    playQueueKind = "cloud";
    ids = lib.filter((item) => item.cloud).map((item) => item.id);
  } else if (id === "local") {
    playQueueKind = "local";
    ids = lib.filter((item) => item.local && !item.cloud).map((item) => item.id);
  } else if (id) {
    playQueueKind = id;
    const list = readUserPlaylists().find((p) => p.id === id);
    ids = list?.songIds ? list.songIds.slice() : [];
  } else if (song?.cloud) {
    playQueueKind = "cloud";
    ids = lib.filter((item) => item.cloud).map((item) => item.id);
  } else if (song?.local) {
    playQueueKind = "local";
    ids = lib.filter((item) => item.local && !item.cloud).map((item) => item.id);
  } else {
    playQueueKind = "";
    ids = lib.map((item) => item.id);
  }
  const songId = String(song?.id || "");
  if (songId && !ids.some((item) => String(item) === songId)) ids.unshift(songId);
  playQueueIds = ids.map((item) => String(item)).filter(Boolean);
}

function songByQueueId(id) {
  const key = String(id || "");
  if (!key) return null;
  return (
    librarySongs().find((song) => String(song.id) === key) ||
    playlist.find((song) => String(song.id) === key) ||
    null
  );
}

function currentPlayQueue() {
  if (playQueueKind === "mood" && playQueueIds.length) {
    const mood = playQueueIds.map((id) => songByQueueId(id)).filter(Boolean);
    if (mood.length) return mood;
  }
  const fromIds = playQueueIds.map((id) => songByQueueId(id)).filter(Boolean);
  if (fromIds.length) return fromIds;
  const song = playlist[currentIndex];
  if (song?.cloud) return librarySongs().filter((item) => item.cloud);
  if (song?.local) return librarySongs().filter((item) => item.local && !item.cloud);
  return librarySongs().slice();
}

function playlistIndexOf(song) {
  if (!song) return -1;
  return playlist.findIndex((item) => String(item.id) === String(song.id));
}

function indexInPlaylist(song) {
  if (!song) return -1;
  let index = playlistIndexOf(song);
  if (index >= 0) return index;
  const lib = librarySongs();
  if (playlist !== lib && lib.some((item) => String(item.id) === String(song.id))) {
    playlist = lib.slice();
    renderList();
    index = playlist.findIndex((item) => String(item.id) === String(song.id));
  }
  return index;
}

function playCoverPlane(dir, fromSrc, toSrc) {
  const layer = document.getElementById("coverPlaneLayer");
  const outEl = document.getElementById("coverPlaneOut");
  const inEl = document.getElementById("coverPlaneIn");
  const art = showLyrics ? document.getElementById("lyricsArt") : document.getElementById("cover");
  const hold = showLyrics ? document.getElementById("lyricsBgImg") : document.getElementById("cover");
  if (switchAnim === "off") return;
  if (!layer || !outEl || !inEl || !art || !els.playerLayer?.classList.contains("is-open")) return;
  if (!fromSrc || !toSrc) return;
  const rect = art.getBoundingClientRect();
  if (rect.width < 20) return;
  layer.hidden = false;
  layer.style.setProperty("--plane-x", `${rect.left}px`);
  layer.style.setProperty("--plane-y", `${rect.top}px`);
  layer.style.setProperty("--plane-w", `${rect.width}px`);
  layer.style.setProperty("--plane-h", `${rect.height}px`);
  outEl.src = fromSrc;
  inEl.src = toSrc;
  const fade = switchAnim === "fade";
  hold?.classList.add("is-cover-held");
  layer.classList.toggle("is-round", !showLyrics);
  layer.classList.remove("is-next", "is-prev", "is-flip", "is-fade");
  void layer.offsetWidth;
  layer.classList.add(dir < 0 ? "is-prev" : "is-next", fade ? "is-fade" : "is-flip");
  clearTimeout(coverPlaneTimer);
  coverPlaneTimer = setTimeout(() => {
    hold?.classList.remove("is-cover-held");
    layer.classList.remove("is-next", "is-prev", "is-flip", "is-fade");
    layer.hidden = true;
  }, fade ? 640 : 920);
}

async function playAt(index) {
  const song = playlist[index];
  if (!song) return;
  const changing = index !== currentIndex;
  const fromSrc = showLyrics ? els.lyricsBgImg?.src || "" : els.cover?.src || "";
  const dir = index > currentIndex ? 1 : -1;
  if (!playQueueKind) setPlayQueueForSong(song, "");

  currentIndex = index;
  updateUI(song);
  if (changing) {
    const toSrc = (showLyrics ? lyricsCoverUrl(null, song) : song.cover) || song.cover || "";
    playCoverPlane(dir, fromSrc, toSrc);
  }
  seeking = false;
  els.seekWrap?.classList.remove("is-dragging");
  els.nowSeekWrap?.classList.remove("is-dragging");

  try {
    const playUrl = await resolvePlayUrl(song);
    if (!playUrl) throw new Error(song.cloud ? "云端音频地址无效" : "本地音频路径无效");
    const sameSong = audio.getAttribute("data-id") === String(song.id);

    if (!sameSong || !audio.src) {
      audio.pause();
      audio.src = playUrl;
      audio.setAttribute("data-id", String(song.id));
      try {
        audio.load();
      } catch {
        /* ignore */
      }
      await waitForAudioReady(song.cloud ? 25000 : 12000);
    }

    if (song.duration <= 0 && getDuration()) {
      song.duration = Math.round(getDuration());
      renderList();
      updateActive();
    }

    await audio.play();
    setHint("");
    if (changing && listenTogetherActive && !listenTogetherApplying) {
      pushListenTogetherSongChange(song).catch(() => {});
    }
  } catch (err) {
    setPlaying(false);
    setHint(playFailHint(song, err), true);
    console.warn("playAt failed", song?.title, song?.url, err);
  }
}

function nextIndex() {
  const q = currentPlayQueue();
  if (!q.length) return 0;
  const curId = String(playlist[currentIndex]?.id || "");
  let i = q.findIndex((s) => String(s.id) === curId);
  if (i < 0) i = 0;
  if (mode === "shuffle") {
    if (q.length <= 1) return Math.max(0, indexInPlaylist(q[0]));
    let n = Math.floor(Math.random() * q.length);
    while (q.length > 1 && String(q[n].id) === curId) {
      n = Math.floor(Math.random() * q.length);
    }
    return Math.max(0, indexInPlaylist(q[n]));
  }
  return Math.max(0, indexInPlaylist(q[(i + 1) % q.length]));
}

function prevIndex() {
  const q = currentPlayQueue();
  if (!q.length) return 0;
  const curId = String(playlist[currentIndex]?.id || "");
  let i = q.findIndex((s) => String(s.id) === curId);
  if (i < 0) i = 0;
  const prev = q[i <= 0 ? q.length - 1 : i - 1];
  return Math.max(0, indexInPlaylist(prev));
}

function onEnded() {
  // 只有完整播完才计次；中途切歌不会走到这里
  const done = playlist[currentIndex];
  if (done) recordPlayCount(done);

  if (mode === "loop") {
    const media = mediaClock();
    try {
      media.currentTime = 0;
    } catch {
      /* ignore */
    }
    media.play().catch(() => {});
    if (media !== audio) {
      try {
        audio.currentTime = 0;
      } catch {
        /* ignore */
      }
    }
    return;
  }
  playAt(nextIndex());
}

function getDuration() {
  if (mvReady()) {
    const vd = els.mvVideo.duration;
    if (vd && isFinite(vd) && vd > 0) return vd;
  }
  const d = audio.duration;
  if (d && isFinite(d) && d > 0) return d;
  const fallback = playlist[currentIndex]?.duration || 0;
  return fallback > 0 ? fallback : 0;
}

const SEEK_PANEL_COUNT = 12;

function ensureSeekPanels() {
  const host = els.seekPanels;
  if (!host || host.childElementCount === SEEK_PANEL_COUNT) return;
  host.innerHTML = Array.from({ length: SEEK_PANEL_COUNT }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return `<div class="seek-panel" data-panel="${i}"><span class="seek-panel-no">${n}</span></div>`;
  }).join("");
}

function syncSeekPanels(percent) {
  const host = els.seekPanels;
  if (!host) return;
  ensureSeekPanels();
  const p = Math.max(0, Math.min(100, Number(percent) || 0));
  const filled = Math.min(
    SEEK_PANEL_COUNT,
    Math.max(0, Math.ceil((p / 100) * SEEK_PANEL_COUNT))
  );
  const current = p <= 0 ? -1 : Math.min(SEEK_PANEL_COUNT - 1, Math.max(0, filled - 1));
  host.querySelectorAll(".seek-panel").forEach((el, i) => {
    el.classList.toggle("is-filled", i < filled);
    el.classList.toggle("is-current", i === current);
  });
}

function setSeekVisual(percent) {
  const p = Math.max(0, Math.min(100, Number(percent) || 0));
  seekPercent = p;
  if (els.seek) els.seek.value = String(Math.round(p * 10));
  if (els.seekFill) els.seekFill.style.width = `${p}%`;
  if (els.seekThumb) els.seekThumb.style.left = `${p}%`;
  if (els.nowSeek) els.nowSeek.value = String(Math.round(p * 10));
  if (els.nowSeekFill) els.nowSeekFill.style.width = `${p}%`;
  syncSeekPanels(p);
}

function previewSeek(percent) {
  const duration = getDuration();
  setSeekVisual(percent);
  if (duration) {
    const text = formatTime((percent / 100) * duration);
    if (els.currentTime) els.currentTime.textContent = text;
    if (els.nowCurrentTime) els.nowCurrentTime.textContent = text;
  }
}

let seekUnlockTimer = null;

function unlockSeekUi() {
  seeking = false;
  els.seekWrap?.classList.remove("is-dragging");
  els.nowSeekWrap?.classList.remove("is-dragging");
  if (seekUnlockTimer) {
    clearTimeout(seekUnlockTimer);
    seekUnlockTimer = null;
  }
}

function commitSeek(percent) {
  const duration = getDuration();
  const p = Math.max(0, Math.min(100, percent));
  setSeekVisual(p);
  els.seekWrap?.classList.remove("is-dragging");
  els.nowSeekWrap?.classList.remove("is-dragging");

  if (!duration || !isFinite(duration)) {
    unlockSeekUi();
    return;
  }

  const media = mediaClock();

  // 还没准备好时，先记住目标，就绪后再跳
  if (media.readyState < 1) {
    seeking = true;
    const retry = () => {
      media.removeEventListener("loadedmetadata", retry);
      commitSeek(p);
    };
    media.addEventListener("loadedmetadata", retry);
    return;
  }

  const time = Math.min(Math.max(0, (p / 100) * duration), Math.max(duration - 0.05, 0));
  seeking = true;
  const timeText = formatTime(time);
  if (els.currentTime) els.currentTime.textContent = timeText;
  if (els.nowCurrentTime) els.nowCurrentTime.textContent = timeText;

  if (seekUnlockTimer) clearTimeout(seekUnlockTimer);

  const finish = () => {
    media.removeEventListener("seeked", finish);
    // 用目标进度钉住 UI，防止个别浏览器 seek 后短暂回报 0
    setSeekVisual(p);
    els.currentTime.textContent = formatTime(media.currentTime || time);
    unlockSeekUi();
    pushListenTogetherPlayback({ bumpSeek: true, transport: true });
  };

  media.addEventListener("seeked", finish);

  try {
    media.currentTime = time;
    if (media !== audio) {
      try {
        audio.currentTime = time;
      } catch {
        /* ignore */
      }
    }
  } catch {
    unlockSeekUi();
    return;
  }

  // 若 currentTime 已被接受，即使漏发 seeked 也解锁
  seekUnlockTimer = setTimeout(() => {
    const ok =
      Math.abs((media.currentTime || 0) - time) < 1 ||
      (media.currentTime || 0) > 0.5;
    if (ok) {
      setSeekVisual((media.currentTime / duration) * 100);
    } else {
      try {
        media.currentTime = time;
      } catch {
        /* ignore */
      }
      setSeekVisual(p);
      els.currentTime.textContent = formatTime(time);
    }
    media.removeEventListener("seeked", finish);
    unlockSeekUi();
  }, 350);
}

function syncProgress() {
  if (
    seeking ||
    els.seekWrap?.classList.contains("is-dragging") ||
    els.nowSeekWrap?.classList.contains("is-dragging")
  ) {
    return;
  }
  const duration = getDuration();
  const current = mediaClock().currentTime || 0;
  const percent = duration ? (current / duration) * 100 : 0;
  setSeekVisual(percent);
  const curText = formatTime(current);
  if (els.currentTime) els.currentTime.textContent = curText;
  if (els.nowCurrentTime) els.nowCurrentTime.textContent = curText;
  if (duration) {
    const durText = formatTime(duration);
    if (els.duration) els.duration.textContent = durText;
    if (els.nowDuration) els.nowDuration.textContent = durText;
    const song = playlist[currentIndex];
    if (song && (!song.duration || song.duration <= 0)) {
      song.duration = Math.round(duration);
    }
  }
  syncLyrics(false);
}

function percentFromPointer(clientX, wrapEl = els.seekWrap) {
  const rect = (wrapEl || els.seekWrap).getBoundingClientRect();
  if (!rect.width) return 0;
  return ((clientX - rect.left) / rect.width) * 100;
}

async function getAudiusHost() {
  if (audiusHost) return audiusHost;
  const res = await fetch("https://api.audius.co");
  const data = await res.json();
  audiusHost = data.data[0];
  return audiusHost;
}

async function searchAudius(query) {
  try {
    const host = await getAudiusHost();
    const url = `${host}/v1/tracks/search?query=${encodeURIComponent(
      query
    )}&app_name=${APP_NAME}&limit=20`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data || []).map((track) => ({
      id: `audius-${track.id}`,
      title: track.title,
      artist: track.user?.name || "未知艺人",
      cover:
        track.artwork?.["480x480"] ||
        track.artwork?.["150x150"] ||
        "https://picsum.photos/seed/audius/600/600",
      url: `${host}/v1/tracks/${track.id}/stream?app_name=${APP_NAME}`,
      duration: Math.round(track.duration || 0),
      preview: false
    }));
  } catch {
    return [];
  }
}

async function searchItunes(query) {
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
      query
    )}&media=music&entity=song&limit=25&country=cn`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || [])
      .filter((item) => item.previewUrl)
      .map((item) => ({
        id: `itunes-${item.trackId}`,
        title: item.trackName,
        artist: item.artistName,
        cover: (item.artworkUrl100 || "").replace("100x100bb", "600x600bb"),
        url: item.previewUrl,
        duration: 30,
        preview: true
      }));
  } catch {
    return [];
  }
}

function mergeResults(audiusList, itunesList) {
  const seen = new Set();
  const merged = [];

  for (const song of [...audiusList, ...itunesList]) {
    const key = `${song.title.toLowerCase()}|${song.artist.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(song);
  }
  return merged;
}

function highlightSearchText(text, query) {
  const raw = String(text || "");
  const q = String(query || "").trim();
  if (!q) return escapeHtml(raw);
  const lower = raw.toLowerCase();
  const ql = q.toLowerCase();
  let html = "";
  let from = 0;
  while (from < raw.length) {
    const at = lower.indexOf(ql, from);
    if (at < 0) {
      html += escapeHtml(raw.slice(from));
      break;
    }
    html += escapeHtml(raw.slice(from, at));
    html += `<mark class="search-hit">${escapeHtml(raw.slice(at, at + q.length))}</mark>`;
    from = at + q.length;
  }
  return html;
}

function songSearchPlaces(song) {
  const places = [];
  if (song.cloud) places.push("云端");
  else if (song.local) places.push("本地");
  readUserPlaylists().forEach((p) => {
    if (p.songIds.includes(String(song.id || ""))) places.push(p.name);
  });
  return places;
}

function findLibraryMatches(query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return [];
  const hits = [];
  const seen = new Set();
  DEFAULT_PLAYLIST.forEach((song) => {
    const id = String(song.id || "");
    if (!id || seen.has(id)) return;
    const title = String(song.title || "");
    const artist = String(song.artist || "");
    if (!title.toLowerCase().includes(q) && !artist.toLowerCase().includes(q)) return;
    const places = songSearchPlaces(song);
    if (!places.length) return;
    seen.add(id);
    hits.push({ song, places });
  });
  return hits.slice(0, 8);
}

function hideSearchSuggest() {
  if (els.searchSuggest) {
    els.searchSuggest.hidden = true;
    els.searchSuggest.innerHTML = "";
  }
}

function showSearchSuggest(query) {
  if (!els.searchSuggest) return;
  const q = String(query || "").trim();
  if (!q) {
    hideSearchSuggest();
    setHint("");
    return;
  }
  const hits = findLibraryMatches(q);
  if (!hits.length) {
    els.searchSuggest.hidden = false;
    els.searchSuggest.innerHTML =
      '<div class="search-suggest-empty">云端、本地和自建歌单里没有匹配</div>';
    setHint("");
    return;
  }
  els.searchSuggest.hidden = false;
  els.searchSuggest.innerHTML = hits
    .map((hit) => {
      const label = `${hit.song.title} - ${hit.song.artist}`;
      return `<button type="button" class="search-suggest-item" data-search-id="${escapeHtml(hit.song.id)}">
        <span class="search-suggest-text">${highlightSearchText(label, q)}</span>
        <span class="search-suggest-where">${escapeHtml(hit.places.join(" · "))}</span>
      </button>`;
    })
    .join("");
  setHint("");
}

function playSearchedSong(songId) {
  let index = playlist.findIndex((s) => String(s.id) === String(songId));
  if (index < 0) {
    playlist = [...DEFAULT_PLAYLIST];
    renderList();
    index = playlist.findIndex((s) => String(s.id) === String(songId));
  }
  if (index < 0) {
    setHint("这首歌当前不在歌单里", true);
    return;
  }
  hideSearchSuggest();
  setPlayQueueForSong(playlist[index], "");
  playAt(index);
}

function runSearch(rawQuery) {
  const query = String(rawQuery || "").trim();
  if (!query) {
    hideSearchSuggest();
    return;
  }
  showSearchSuggest(query);
}

renderList();
setHint("正在读取本地歌单…");

async function handleSongListClick(e) {
  const likeBtn = e.target.closest(".song-like");
  if (likeBtn) {
    e.stopPropagation();
    const index = Number(likeBtn.dataset.index);
    toggleLikeSong(playlist[index]);
    return true;
  }

  const moreBtn = e.target.closest(".song-more");
  if (moreBtn) {
    e.stopPropagation();
    const wrap = moreBtn.closest(".song-more-wrap");
    const menu = wrap?.querySelector(".song-menu");
    const wasOpen = menu && !menu.hidden;
    closeSongMenus();
    if (menu && !wasOpen) {
      menu.hidden = false;
      moreBtn.classList.add("is-open");
    }
    return true;
  }

  const menuItem = e.target.closest(".song-menu-item");
  if (menuItem) {
    e.stopPropagation();
    const index = Number(menuItem.dataset.index);
    const action = menuItem.dataset.action;
    const listId = menuItem.dataset.listId || "";
    const song = playlist[index];
    closeSongMenus();
    if (!song) return true;
    if (action === "delete") askDeleteSong(index);
    if (action === "remove") {
      removeSongFromUserPlaylist(listId, song);
      renderList();
      setHint(`已从歌单移除「${song.title}」`);
    }
    if (action === "save") {
      const picked = await pickUserPlaylist({
        title: `保存「${song.title}」到`,
        excludeId: listId
      });
      if (!picked) return true;
      const lists = readUserPlaylists();
      const dest = lists.find((p) => p.id === picked);
      if (dest?.songIds.includes(String(song.id))) {
        setHint("这首歌已经在该歌单里");
        return true;
      }
      addSongToUserPlaylist(picked, song);
      renderList();
      setHint("已保存到歌单");
    }
    if (action === "move") {
      const picked = await pickUserPlaylist({
        title: `转移「${song.title}」到`,
        excludeId: listId
      });
      if (!picked) return true;
      addSongToUserPlaylist(picked, song);
      if (listId) removeSongFromUserPlaylist(listId, song);
      renderList();
      setHint("已转移到歌单");
    }
    return true;
  }

  const item = e.target.closest(".song");
  if (!item) return false;
  const index = Number(item.dataset.index);
  const queueId = item.dataset.queueId || item.dataset.listId || "";
  setPlayQueueForSong(playlist[index], queueId);
  openPlayerWindow();
  playAt(index);
  return true;
}

els.playlist.addEventListener("click", async (e) => {
  const checkBtn = e.target.closest("[data-pl-check]");
  if (checkBtn) {
    e.stopPropagation();
    const listId = checkBtn.dataset.plCheck || "";
    if (!listId) return;
    if (playlistSelectedIds.has(listId)) playlistSelectedIds.delete(listId);
    else playlistSelectedIds.add(listId);
    const on = playlistSelectedIds.has(listId);
    checkBtn.classList.toggle("is-on", on);
    checkBtn.setAttribute("aria-pressed", on ? "true" : "false");
    checkBtn.closest(".playlist-block")?.classList.toggle("is-checked", on);
    syncPlaylistEditBtn();
    return;
  }

  const openBtn = e.target.closest("[data-open-kind]");
  if (openBtn) {
    e.stopPropagation();
    if (playlistEditing) return;
    openPlaylistDetail({
      kind: openBtn.dataset.openKind || "",
      listId: openBtn.dataset.openId || ""
    });
    return;
  }

  await handleSongListClick(e);
});

function closeSongMenus() {
  document.querySelectorAll(".song-menu").forEach((el) => {
    el.hidden = true;
  });
  document.querySelectorAll(".song-more.is-open").forEach((el) => {
    el.classList.remove("is-open");
  });
}

els.playlistPickCancel?.addEventListener("click", () => closePlaylistPicker(null));
els.playlistPickList?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-pick-id]");
  if (!btn) return;
  closePlaylistPicker(btn.dataset.pickId || "");
});
document.getElementById("playlistEditBtn")?.addEventListener("click", (e) => {
  e.stopPropagation();
  playlistEditing = !playlistEditing;
  if (!playlistEditing) playlistSelectedIds.clear();
  syncPlaylistEditBtn();
  renderList();
});

document.getElementById("playlistDeleteBtn")?.addEventListener("click", async (e) => {
  e.stopPropagation();
  prunePlaylistSelection();
  const ids = [...playlistSelectedIds];
  if (!ids.length) return;
  const lists = readUserPlaylists();
  const names = lists
    .filter((p) => ids.includes(p.id))
    .map((p) => p.name);
  const ok = await openConfirm(
    ids.length === 1
      ? `删除歌单「${names[0] || ""}」？里面的歌曲仍保留在云端或本地。`
      : `删除选中的 ${ids.length} 个歌单？里面的歌曲仍保留在云端或本地。`,
    "删除歌单？"
  );
  if (!ok) return;
  const remove = new Set(ids);
  writeUserPlaylists(lists.filter((p) => !remove.has(p.id)));
  if (
    playlistDetailState?.kind === "custom" &&
    remove.has(playlistDetailState.listId)
  ) {
    closePlaylistDetail();
  }
  playlistSelectedIds.clear();
  if (!readUserPlaylists().length) playlistEditing = false;
  renderList();
  setHint(ids.length === 1 ? "歌单已删除" : `已删除 ${ids.length} 个歌单`);
});

els.newPlaylistBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  const next = window.prompt("新建歌单名称", "我的歌单");
  if (next == null) return;
  const name = String(next).trim().slice(0, 24);
  if (!name) {
    setHint("歌单名不能为空", true);
    return;
  }
  const lists = readUserPlaylists();
  lists.push({
    id: `pl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    songIds: [],
    cover: ""
  });
  writeUserPlaylists(lists);
  playlistEditing = false;
  playlistSelectedIds.clear();
  renderList();
  setHint(`已新建歌单「${name}」`);
});

document.getElementById("playlistDetailBack")?.addEventListener("click", () => {
  closePlaylistDetail();
});

document.getElementById("playlistPlayAllBtn")?.addEventListener("click", () => {
  playPlaylistDetailAll().catch(() => {});
});

document.getElementById("playlistRenameBtn")?.addEventListener("click", () => {
  if (playlistDetailState?.kind !== "custom" || !playlistDetailState.listId) {
    return;
  }
  const lists = readUserPlaylists();
  const target = lists.find((p) => p.id === playlistDetailState.listId);
  if (!target) return;
  const next = window.prompt("重命名歌单", target.name);
  if (next == null) return;
  const name = String(next).trim().slice(0, 24);
  if (!name) {
    setHint("歌单名不能为空", true);
    return;
  }
  target.name = name;
  writeUserPlaylists(lists);
  renderList();
  setHint(`歌单已改为「${name}」`);
});

document.getElementById("playlistCoverBtn")?.addEventListener("click", () => {
  if (!playlistDetailState) return;
  const bundle = resolvePlaylistBundle(
    playlistDetailState.kind,
    playlistDetailState.listId || ""
  );
  if (!bundle?.coverEditable) return;
  document.getElementById("playlistCoverInput")?.click();
});

document.getElementById("playlistCoverInput")?.addEventListener("change", async (e) => {
  const input = e.target;
  const file = input?.files?.[0];
  if (input) input.value = "";
  if (!file || !playlistDetailState) return;
  const bundle = resolvePlaylistBundle(
    playlistDetailState.kind,
    playlistDetailState.listId || ""
  );
  if (!bundle?.coverEditable) return;
  try {
    const dataUrl = await compressPlaylistCoverFile(file);
    if (bundle.kind === "likes") {
      writeLikesCover(dataUrl);
    } else if (bundle.kind === "custom" && bundle.listId) {
      const lists = readUserPlaylists();
      const target = lists.find((p) => p.id === bundle.listId);
      if (!target) {
        setHint("找不到这个歌单", true);
        return;
      }
      target.cover = dataUrl;
      writeUserPlaylists(lists);
    }
    renderList();
    setHint("封面已更新");
  } catch (err) {
    setHint(err?.message || "封面上传失败", true);
  }
});

document.getElementById("playlistDetailList")?.addEventListener("click", async (e) => {
  await handleSongListClick(e);
});

document.addEventListener("click", () => closeSongMenus());

let pendingDeleteIndex = -1;
let confirmResolver = null;

function openConfirm(message, title = "确定删除？") {
  return new Promise((resolve) => {
    confirmResolver = resolve;
    const titleEl = document.getElementById("confirmTitle");
    if (titleEl) titleEl.textContent = title;
    if (els.confirmMsg) els.confirmMsg.textContent = message;
    if (els.confirmLayer) {
      els.confirmLayer.hidden = false;
      els.confirmLayer.setAttribute("aria-hidden", "false");
    }
  });
}

function closeConfirm(result) {
  if (els.confirmLayer) {
    els.confirmLayer.hidden = true;
    els.confirmLayer.setAttribute("aria-hidden", "true");
  }
  const resolve = confirmResolver;
  confirmResolver = null;
  if (resolve) resolve(!!result);
}

async function askDeleteSong(index) {
  const song = playlist[index];
  if (song?.cloud && song.cloudId) {
    if (!song.canDelete) {
      setHint("只能删除自己上传的云端歌曲", true);
      return;
    }
    pendingDeleteIndex = index;
    const ok = await openConfirm(
      `将从云端共同曲库删除「${song.title} - ${song.artist}」，所有人将无法再听，删除后无法恢复。`,
      "确定删除云端歌曲？"
    );
    pendingDeleteIndex = -1;
    if (!ok) return;
    await deleteCloudLibrarySong(song);
    return;
  }
  if (!song?.local || !song.fileRel) {
    setHint("只能删除本地或自己上传的云端歌曲", true);
    return;
  }
  pendingDeleteIndex = index;
  const scopeTip =
    song.scope === "shared"
      ? "（本机演示曲库：会从安装目录删除）"
      : "（你的私人空间）";
  const ok = await openConfirm(
    `将删除「${song.title} - ${song.artist}」的 MP3、歌词和封面文件${scopeTip}，删除后无法恢复。`,
    "确定删除这首歌？"
  );
  pendingDeleteIndex = -1;
  if (!ok) return;
  await deleteLocalSong(song);
}

async function deleteCloudLibrarySong(song) {
  setHint("正在从云端删除…");
  try {
    const api = window.LudongCloud;
    if (!api?.deleteCloudSong) throw new Error("云端未就绪");
    await api.deleteCloudSong(song.cloudId);
    forgetSongFromUserPlaylists(song);
    const key = playStatKey(song);
    DEFAULT_PLAYLIST = DEFAULT_PLAYLIST.filter((s) => playStatKey(s) !== key);
    playlist = playlist.filter((s) => playStatKey(s) !== key);
    if (currentIndex >= playlist.length) currentIndex = Math.max(0, playlist.length - 1);
    renderList();
    if (playlist[currentIndex]) {
      updateUI(playlist[currentIndex]);
    } else {
      els.title.textContent = "暂无歌曲";
      els.artist.textContent = "可到设置上传共同曲库或导入私人歌曲";
    }
    setHint("已从云端共同曲库删除");
  } catch (err) {
    setHint(err?.message || "删除失败", true);
  }
}

async function deleteLocalSong(song) {
  setHint("正在删除…");
  try {
    const res = await fetch(withUserQuery("/api/delete-song"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: song.id || "",
        title: song.title || "",
        artist: song.artist || "",
        file: song.fileRel || "",
        lrc: song.lrcFile || "",
        cover: song.coverRel || "",
        base: song.base || "",
        scope: song.scope || "user",
        userId: currentLibraryUserId()
      })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      throw new Error(data.error || `删除失败（${res.status}）`);
    }
    forgetSongFromUserPlaylists(song);

    if (blobCache.has(song.id)) {
      try {
        URL.revokeObjectURL(blobCache.get(song.id));
      } catch {
        /* ignore */
      }
      blobCache.delete(song.id);
    }
    for (const key of [...lyricsCache.keys()]) {
      if (
        key === song.id ||
        String(key).startsWith(`${song.id}::`) ||
        String(key).startsWith(`${playStatKey(song)}::`)
      ) {
        lyricsCache.delete(key);
      }
    }

    const wasCurrent = audio.getAttribute("data-id") === String(song.id);
    if (wasCurrent) {
      audio.pause();
      audio.removeAttribute("src");
      audio.removeAttribute("data-id");
      setPlaying(false);
      closePlayerWindow();
    }

    // 本地统计一并去掉
    try {
      const local = readLocalPlayStats();
      const key = playStatKey(song);
      if (local.songs[key]) {
        delete local.songs[key];
        writeLocalPlayStats(local);
        renderRankRow(rankingFromSongs(local.songs));
      }
    } catch {
      /* ignore */
    }

    // 喜欢列表里也移除
    await toggleLikeSong(song, false);

    DEFAULT_PLAYLIST = await loadLocalPlaylist();
    await fillAllDurations(DEFAULT_PLAYLIST);
    const query = (els.searchInput?.value || "").trim();
    if (query) {
      await runSearch(query);
    } else {
      playlist = [...DEFAULT_PLAYLIST];
      renderList();
    }

    if (!playlist.length) {
      currentIndex = -1;
      els.nowCard.hidden = true;
      els.title.textContent = "暂无歌曲";
      els.artist.textContent = "可在设置中导入 MP3";
      setHint("已删除，本地暂无歌曲", true);
      return;
    }

    if (wasCurrent || currentIndex < 0 || currentIndex >= playlist.length) {
      currentIndex = 0;
      updateUI(playlist[0]);
      const playUrl = await resolvePlayUrl(playlist[0]);
      audio.src = playUrl;
      audio.setAttribute("data-id", String(playlist[0].id));
      await waitForAudioReady();
      syncProgress();
    } else {
      updateActive();
    }
    setHint(`已删除「${song.title}」· 本地 ${DEFAULT_PLAYLIST.length} 首`);
  } catch (err) {
    setHint(err?.message || "删除失败，请重启播放器后再试", true);
  }
}

els.likesBack?.addEventListener("click", () => setMainView("home"));
els.likesBackdrop?.addEventListener("click", () => setMainView("home"));
document.getElementById("diaryBack")?.addEventListener("click", () => setMainView("home"));
document.getElementById("diaryBody")?.addEventListener("click", (e) => {
  const btn = e.target.closest?.(".diary-entry");
  if (!btn) return;
  playFromRankItem({
    dataset: {
      rankId: btn.dataset.diaryId || "",
      rankKey: btn.dataset.diaryKey || ""
    }
  }).catch((err) => setHint(err?.message || "播放失败", true));
});
document.getElementById("moodRadioStartBtn")?.addEventListener("click", () => {
  startMoodRadio().catch((err) => setHint(err?.message || "氛围电台开播失败", true));
});
refreshMoodRadioCard();
refreshDiaryEntrySub();
els.likesList?.addEventListener("click", (e) => {
  const item = e.target.closest(".likes-item");
  if (!item) return;
  playLikedItem(item.dataset.likeKey || "", item.dataset.likeId || "");
});

els.playerLike?.addEventListener("click", (e) => {
  e.stopPropagation();
  const song = playlist[currentIndex];
  if (!song) {
    setHint("请先选择一首歌", true);
    return;
  }
  toggleLikeSong(song);
});
els.playerComment?.addEventListener("click", (e) => {
  e.stopPropagation();
  openCommentsLayer();
});
els.commentsBack?.addEventListener("click", closeCommentsLayer);
els.commentsBackdrop?.addEventListener("click", closeCommentsLayer);
els.commentsForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  sendComment();
});
els.commentsSortTime?.addEventListener("click", () => setCommentsSortMode("time"));
els.commentsSortLikes?.addEventListener("click", () => setCommentsSortMode("likes"));
els.commentsEmojiBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  toggleCommentsEmojiPanel();
});
els.commentsEmojiPanel?.addEventListener("click", async (e) => {
  e.stopPropagation();
  const tab = e.target.closest("[data-comments-emoji-tab]");
  if (tab) {
    commentsEmojiTab = tab.dataset.commentsEmojiTab || "emoji";
    renderCommentsEmojiPanel();
    return;
  }
  const insertBtn = e.target.closest("[data-comments-insert]");
  if (insertBtn) {
    insertCommentsText(insertBtn.dataset.commentsInsert || "");
    return;
  }
  const stickerBtn = e.target.closest("[data-comments-sticker-url]");
  if (stickerBtn) {
    const url = stickerBtn.dataset.commentsStickerUrl || "";
    if (!url) return;
    const payload = `__STICKER__:${url}`;
    if (payload.length > 12000) {
      setCommentsHint("这个表情太大，评论请用内置表情包", true);
      return;
    }
    await sendComment(payload);
    return;
  }
  if (e.target.closest("#commentsUploadStickerBtn")) {
    els.commentsStickerFile?.click();
  }
});
els.commentsStickerFile?.addEventListener("change", async () => {
  const file = els.commentsStickerFile?.files?.[0];
  if (els.commentsStickerFile) els.commentsStickerFile.value = "";
  if (!file) return;
  try {
    setCommentsHint("处理表情包…");
    const url = await compressStickerFile(file);
    addSavedSticker(url, file.name || "自定义表情");
    commentsEmojiTab = "mine";
    renderCommentsEmojiPanel();
    const payload = `__STICKER__:${url}`;
    if (payload.length > 12000) {
      setCommentsHint("已保存到「我的」，但体积过大无法发评论，请用内置表情包", true);
      return;
    }
    await sendComment(payload);
  } catch (err) {
    setCommentsHint(err?.message || "表情包处理失败", true);
  }
});
els.commentsReplyCancel?.addEventListener("click", () => {
  clearCommentReplyTarget();
  setCommentsHint("");
});

els.chatBack?.addEventListener("click", () => setMainView("home"));
els.chatBackdrop?.addEventListener("click", () => setMainView("home"));
els.chatTabFriends?.addEventListener("click", () => setChatTab("friends"));
els.chatTabAdd?.addEventListener("click", () => setChatTab("add"));
els.chatNewGroupBtn?.addEventListener("click", () => openChatGroupModal("create"));
els.chatGroupCancel?.addEventListener("click", closeChatGroupModal);
els.chatGroupConfirm?.addEventListener("click", () => {
  confirmChatGroupModal();
});
els.chatGroupLayer?.addEventListener("click", (e) => {
  if (e.target === els.chatGroupLayer) closeChatGroupModal();
});
els.chatPeers?.addEventListener("click", (e) => {
  hideFriendCtxMenu();
  const btn = e.target.closest(".chat-peer");
  if (!btn) return;
  selectChatPeer(btn.dataset.peerId || "", btn.dataset.kind || "dm");
});
els.chatPeers?.addEventListener("contextmenu", (e) => {
  const btn = e.target.closest(".chat-peer");
  if (!btn) return;
  e.preventDefault();
  e.stopPropagation();
  showFriendCtxMenu(
    btn.dataset.peerId || "",
    e.clientX,
    e.clientY,
    btn.dataset.kind || "dm"
  );
});
els.friendCtxMenu?.addEventListener("click", async (e) => {
  const item = e.target.closest("[data-act]");
  if (!item || !friendCtxPeerId) return;
  const act = item.dataset.act;
  const pid = friendCtxPeerId;
  const kind = friendCtxKind;
  hideFriendCtxMenu();
  if (act === "remark") await editFriendRemark(pid);
  if (act === "rename-group") await editGroupName(pid);
  if (act === "invite-group") openChatGroupModal("invite", pid);
  if (act === "dissolve-group") await dissolveChatGroup(pid);
  if (act === "chat") await selectChatPeer(pid, kind);
});
els.chatSearchForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  runChatSearch();
});
els.chatSearchInput?.addEventListener("input", () => {
  if (chatSearchTimer) clearTimeout(chatSearchTimer);
  chatSearchTimer = setTimeout(() => runChatSearch(), 320);
});
els.chatSearchResults?.addEventListener("click", async (e) => {
  const addBtn = e.target.closest("[data-add-id]");
  const chatBtn = e.target.closest("[data-chat-id]");
  if (chatBtn) {
    setChatTab("friends");
    await selectChatPeer(chatBtn.dataset.chatId || "", "dm");
    return;
  }
  if (!addBtn) return;
  const id = addBtn.dataset.addId;
  addBtn.disabled = true;
  try {
    await window.LudongCloud.sendFriendRequest(id);
    setChatHint("申请已发送");
    await refreshFriendsAndRequests({ silent: true });
    await runChatSearch();
  } catch (err) {
    setChatHint(err?.message || "申请失败", true);
  } finally {
    addBtn.disabled = false;
  }
});
els.chatRequests?.addEventListener("click", async (e) => {
  const acceptBtn = e.target.closest("[data-accept-id]");
  const rejectBtn = e.target.closest("[data-reject-id]");
  const cancelBtn = e.target.closest("[data-cancel-id]");
  try {
    if (acceptBtn) {
      acceptBtn.disabled = true;
      await window.LudongCloud.respondFriendRequest(acceptBtn.dataset.acceptId, true);
      setChatHint("已加为好友");
      setChatTab("friends");
      await refreshFriendsAndRequests({ silent: true });
    } else if (rejectBtn) {
      rejectBtn.disabled = true;
      await window.LudongCloud.respondFriendRequest(rejectBtn.dataset.rejectId, false);
      setChatHint("已拒绝");
      await refreshFriendsAndRequests({ silent: true });
    } else if (cancelBtn) {
      cancelBtn.disabled = true;
      await window.LudongCloud.cancelFriendRequest(cancelBtn.dataset.cancelId);
      setChatHint("已撤销申请");
      await refreshFriendsAndRequests({ silent: true });
    }
  } catch (err) {
    setChatHint(err?.message || "操作失败", true);
  }
});
els.chatForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  sendChatMessage();
});

els.chatInput?.addEventListener("paste", onChatPaste);
els.chatForm?.addEventListener("paste", onChatPaste);

els.chatEmojiBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  toggleChatEmojiPanel();
});

els.chatEmojiPanel?.addEventListener("click", async (e) => {
  e.stopPropagation();
  const tab = e.target.closest("[data-emoji-tab]");
  if (tab) {
    chatEmojiTab = tab.dataset.emojiTab || "emoji";
    renderChatEmojiPanel();
    return;
  }
  const insertBtn = e.target.closest("[data-insert]");
  if (insertBtn) {
    insertChatText(insertBtn.dataset.insert || "");
    return;
  }
  const stickerBtn = e.target.closest("[data-sticker-url]");
  if (stickerBtn) {
    await sendChatMessage({
      msgType: "sticker",
      mediaUrl: stickerBtn.dataset.stickerUrl || "",
      text: "[表情]"
    });
    return;
  }
  if (e.target.closest("#chatUploadStickerBtn")) {
    els.chatStickerFile?.click();
  }
});

els.chatStickerFile?.addEventListener("change", async () => {
  const file = els.chatStickerFile?.files?.[0];
  if (!file) return;
  try {
    setChatHint("处理表情包…");
    const url = await compressStickerFile(file);
    addSavedSticker(url, file.name || "自定义表情");
    chatEmojiTab = "mine";
    renderChatEmojiPanel();
    await sendChatMessage({ msgType: "sticker", mediaUrl: url, text: "[表情]" });
    setChatHint("已发送并保存到「我的」");
  } catch (err) {
    setChatHint(err?.message || "上传失败", true);
  } finally {
    if (els.chatStickerFile) els.chatStickerFile.value = "";
  }
});

els.chatMessages?.addEventListener("contextmenu", (e) => {
  const row = e.target.closest(".chat-row[data-msg-id]");
  if (!row) return;
  e.preventDefault();
  e.stopPropagation();
  hideFriendCtxMenu();
  showMsgCtxMenu(row.dataset.msgId || "", e.clientX, e.clientY);
});

els.msgCtxMenu?.addEventListener("click", async (e) => {
  const item = e.target.closest("[data-act]");
  if (!item || !msgCtxId) return;
  const act = item.dataset.act;
  const id = msgCtxId;
  hideMsgCtxMenu();
  if (act === "recall") await recallChatMessage(id);
  if (act === "copy") await copyChatMessage(id);
  if (act === "forward") openForwardPicker(id);
  if (act === "save-sticker") {
    const m = chatMessagesCache.find((x) => x.id === id);
    if (m?.mediaUrl && addSavedSticker(m.mediaUrl)) setChatHint("表情已保存到「我的」");
    else setChatHint("保存失败", true);
  }
});

els.chatForwardCancel?.addEventListener("click", closeForwardPicker);
els.chatForwardList?.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-peer-id]");
  if (!btn) return;
  await forwardChatMessage(btn.dataset.peerId || "");
});

document.addEventListener("click", (e) => {
  if (!e.target.closest("#friendCtxMenu")) hideFriendCtxMenu();
  if (!e.target.closest("#msgCtxMenu")) hideMsgCtxMenu();
  if (
    !e.target.closest("#chatEmojiPanel") &&
    !e.target.closest("#chatEmojiBtn")
  ) {
    closeChatEmojiPanel();
  }
  if (
    !e.target.closest("#commentsEmojiPanel") &&
    !e.target.closest("#commentsEmojiBtn")
  ) {
    closeCommentsEmojiPanel();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (els.chatForwardLayer && !els.chatForwardLayer.hidden) {
    closeForwardPicker();
    return;
  }
  if (els.chatEmojiPanel && !els.chatEmojiPanel.hidden) {
    closeChatEmojiPanel();
    return;
  }
  if (els.commentsEmojiPanel && !els.commentsEmojiPanel.hidden) {
    closeCommentsEmojiPanel();
    return;
  }
  if (els.chatLayer?.classList.contains("is-open")) {
    closeChatLayer();
    return;
  }
  if (els.commentsLayer?.classList.contains("is-open")) {
    closeCommentsLayer();
    return;
  }
  const detailLayer = document.getElementById("playlistDetailLayer");
  if (detailLayer?.classList.contains("is-open") || playlistDetailState) {
    closePlaylistDetail();
    return;
  }
  if (els.likesLayer?.classList.contains("is-open")) {
    closeLikesLayer();
  }
});

els.confirmCancel?.addEventListener("click", () => closeConfirm(false));
els.confirmBackdrop?.addEventListener("click", () => closeConfirm(false));
els.confirmOk?.addEventListener("click", () => closeConfirm(true));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && els.confirmLayer && !els.confirmLayer.hidden) {
    closeConfirm(false);
  }
});

els.rankTrack?.addEventListener("click", (e) => {
  const btn = e.target.closest(".rank-item");
  if (!btn) return;
  playFromRankItem(btn);
});

els.nowCard.addEventListener("click", (e) => {
  if (e.target.closest(".now-toggle, .now-skip, .now-progress")) return;
  if (currentIndex < 0) return;
  openPlayerWindow();
});

els.nowPrev?.addEventListener("click", (e) => {
  e.stopPropagation();
  playAt(prevIndex());
});
els.nowNext?.addEventListener("click", (e) => {
  e.stopPropagation();
  playAt(nextIndex());
});

function beginSeek(clientX, wrapEl = els.seekWrap) {
  seeking = true;
  wrapEl?.classList.add("is-dragging");
  previewSeek(percentFromPointer(clientX, wrapEl));
}

function moveSeek(clientX, wrapEl = els.seekWrap) {
  if (!wrapEl?.classList.contains("is-dragging")) return;
  previewSeek(percentFromPointer(clientX, wrapEl));
}

function endSeek(wrapEl = els.seekWrap) {
  if (!wrapEl?.classList.contains("is-dragging")) return;
  wrapEl.classList.remove("is-dragging");
  commitSeek(seekPercent);
}

function bindSeekWrap(wrapEl) {
  if (!wrapEl) return;
  wrapEl.addEventListener("pointerdown", (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    wrapEl.setPointerCapture(e.pointerId);
    beginSeek(e.clientX, wrapEl);
  });
  wrapEl.addEventListener("pointermove", (e) => {
    if (!wrapEl.hasPointerCapture(e.pointerId)) return;
    moveSeek(e.clientX, wrapEl);
  });
  wrapEl.addEventListener("pointerup", (e) => {
    if (wrapEl.hasPointerCapture(e.pointerId)) {
      wrapEl.releasePointerCapture(e.pointerId);
    }
    endSeek(wrapEl);
  });
  wrapEl.addEventListener("pointercancel", () => endSeek(wrapEl));
}

els.playerClose?.addEventListener("click", closePlayerWindow);
els.coverPickBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  openCoverPicker();
});
els.coverPickCancel?.addEventListener("click", closeCoverPicker);
els.coverPickLayer?.addEventListener("click", (e) => {
  if (e.target === els.coverPickLayer) closeCoverPicker();
});
els.coverPickGrid?.addEventListener("click", (e) => {
  const delBtn = e.target.closest("[data-cover-del]");
  if (delBtn) {
    e.preventDefault();
    e.stopPropagation();
    const id = delBtn.dataset.coverDel || "";
    const kind = delBtn.dataset.coverDelKind || "lib";
    deleteCoverFromLibrary(id, kind).catch((err) =>
      setHint(err?.message || "删除失败", true)
    );
    return;
  }
  const libBtn = e.target.closest("[data-cover-lib]");
  if (libBtn) {
    coverPickDraft = { mode: "library", id: libBtn.dataset.coverLib || "" };
    renderCoverPicker();
    return;
  }
  const localBtn = e.target.closest("[data-cover-local]");
  if (localBtn) {
    coverPickDraft = { mode: "local", id: localBtn.dataset.coverLocal || "" };
    renderCoverPicker();
    return;
  }
  const presetBtn = e.target.closest("[data-cover-file]");
  if (presetBtn) {
    coverPickDraft = { mode: "preset", file: presetBtn.dataset.coverFile || "" };
    renderCoverPicker();
  }
});
els.coverPickSongBtn?.addEventListener("click", () => {
  coverPickDraft = { mode: "song" };
  renderCoverPicker();
});

async function deleteCoverFromLibrary(id, kind) {
  if (!id) return;
  const ok = await openConfirm("确定删除这张封面吗？删除后无法恢复。", "删除封面");
  if (!ok) return;
  if (kind === "local") {
    await deleteLocalCover(id);
  } else {
    const res = await fetch("/api/cover-library/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) {
      throw new Error(data.error || "删除失败");
    }
    coverLibraryItems = Array.isArray(data.items) ? data.items : coverLibraryItems.filter((x) => x.id !== id);
  }
  const cur = coverPickDraft || {};
  if ((cur.mode === "library" || cur.mode === "local") && cur.id === id) {
    coverPickDraft = { mode: "song" };
    await applyCoverDraftAndPersist();
  }
  renderCoverPicker();
  setHint("已删除封面");
}

els.coverPickUploadBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  els.coverPickFile?.click();
});
els.coverPickFile?.addEventListener("change", async () => {
  const file = els.coverPickFile?.files?.[0];
  if (els.coverPickFile) els.coverPickFile.value = "";
  if (!file) return;
  if (!String(file.type || "").startsWith("image/")) {
    setHint("请选择图片文件", true);
    return;
  }
  const uploadBtn = els.coverPickUploadBtn;
  if (uploadBtn) uploadBtn.disabled = true;
  try {
    setHint("正在压缩并保存封面…");
    const blob = await compressCoverFile(file);
    let saved = false;
    try {
      const fd = new FormData();
      fd.append("files", blob, (file.name || "cover").replace(/\.[^.]+$/, "") + ".jpg");
      const res = await fetch("/api/cover-library/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || (res.status === 404 ? "本地接口不可用" : "上传失败"));
      }
      coverLibraryItems = Array.isArray(data.items) ? data.items : coverLibraryItems;
      const newId = String(data.id || coverLibraryItems[0]?.id || "");
      if (!newId) throw new Error("上传成功但未返回封面编号");
      coverPickDraft = { mode: "library", id: newId };
      saved = true;
      setHint("已保存到封面库");
    } catch {
      const newId = await saveLocalCoverBlob(file.name || "封面", blob);
      coverPickDraft = { mode: "local", id: newId };
      saved = true;
      setHint("已保存到本机封面库（可删除）");
    }
    if (saved) {
      renderCoverPicker();
      await applyCoverDraftAndPersist();
    }
  } catch (err) {
    setHint(err?.message || "封面上传失败", true);
  } finally {
    if (uploadBtn) uploadBtn.disabled = false;
  }
});
els.coverPickSave?.addEventListener("click", async () => {
  const ok = await applyCoverDraftAndPersist();
  if (!ok) return;
  closeCoverPicker();
  setHint("封面已保存");
});
els.playerBackdrop?.addEventListener("click", closePlayerWindow);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && els.playerLayer?.classList.contains("is-open")) {
    closePlayerWindow();
  }
});

els.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearTimeout(searchTimer);
  const query = els.searchInput.value;
  const hits = findLibraryMatches(query);
  if (hits[0]) playSearchedSong(hits[0].song.id);
  else runSearch(query);
});

els.searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  const value = els.searchInput.value;
  if (!value.trim()) {
    hideSearchSuggest();
    return;
  }
  searchTimer = setTimeout(() => runSearch(value), 160);
});

els.searchSuggest?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-search-id]");
  if (!btn) return;
  e.preventDefault();
  playSearchedSong(btn.dataset.searchId || "");
});

document.addEventListener("click", (e) => {
  if (!e.target.closest("#searchForm")) hideSearchSuggest();
});

els.searchInput?.addEventListener("keydown", (e) => {
  if (e.key === "Escape") hideSearchSuggest();
});

els.playBtn.addEventListener("click", togglePlay);
els.nowToggle.addEventListener("click", togglePlay);
document.addEventListener("keydown", (e) => {
  if (e.code !== "Space" && e.key !== " ") return;
  if (e.repeat || e.altKey || e.ctrlKey || e.metaKey) return;
  if (document.body.classList.contains("is-auth-screen")) return;
  if (els.confirmLayer && !els.confirmLayer.hidden) return;
  const tag = e.target?.closest?.("input, textarea, select, button, a, [contenteditable='true']");
  if (tag) return;
  e.preventDefault();
  togglePlay();
});
els.prevBtn.addEventListener("click", () => playAt(prevIndex()));
els.nextBtn.addEventListener("click", () => playAt(nextIndex()));

els.disc.addEventListener("click", () => {
  if (currentPlayerView() === "theater") return;
  setLyricsMode(true);
});

// 听歌页：点封面/空白返回唱片；剧场：封面不切换，只允许点歌词句跳转
els.lyricsView?.addEventListener("click", (e) => {
  const line = e.target.closest(".lyric-line");
  if (line) {
    e.stopPropagation();
    const idx = Number(line.dataset.index);
    const item = lyricLines[idx];
    if (!item || item.time < 0) return;
    const duration = getDuration();
    if (!duration) return;
    lyricsManualUntil = 0;
    commitSeek((item.time / duration) * 100);
    syncLyrics();
    return;
  }
  if (currentPlayerView() === "theater") {
    e.stopPropagation();
    return;
  }
  if (e.target.closest(".lyrics-side")) return;
  setLyricsMode(false);
});

document.getElementById("theaterStageLeft")?.addEventListener("click", (e) => {
  if (currentPlayerView() !== "theater") return;
  // 剧场封面/控件区：不触发任何「切换歌词/唱片」
  if (!e.target.closest("button, a, input, .seek-wrap, .progress, .controls")) {
    e.stopPropagation();
  }
});

els.mvView?.addEventListener("click", (e) => {
  e.stopPropagation();
});

els.mvToggleBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  if (!showLyrics) setLyricsMode(true);
  setMvMode(!showMv);
});

els.mvSourceBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  mvPreferSong = els.mvVideo?.dataset.mvKind !== "song";
  try {
    localStorage.setItem("ludong-mv-source", mvPreferSong ? "song" : "default");
  } catch {
    /* ignore */
  }
  applyMvForSong(playlist[currentIndex]);
});

els.mvCcBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  setMvCaptions(!showMvCaptions);
});

els.lyricsWindow?.addEventListener(
  "wheel",
  (e) => {
    e.stopPropagation();
    markLyricsManual();
  },
  { passive: true }
);
els.lyricsWindow?.addEventListener(
  "touchstart",
  () => markLyricsManual(),
  { passive: true }
);
els.lyricsWindow?.addEventListener(
  "scroll",
  () => markLyricsManual(),
  { passive: true }
);

const PLAY_MODE_KEY = "ludong-play-mode";

function applyPlayMode(next, persist) {
  mode = next === "loop" || next === "shuffle" ? next : "list";
  els.modes?.querySelectorAll(".mode-btn").forEach((el) => {
    el.classList.toggle("is-active", el.dataset.mode === mode);
  });
  if (!persist) return;
  try {
    localStorage.setItem(PLAY_MODE_KEY, mode);
  } catch {
    /* ignore */
  }
}

function loadPlayMode() {
  let saved = "list";
  try {
    saved = localStorage.getItem(PLAY_MODE_KEY) || "list";
  } catch {
    saved = "list";
  }
  applyPlayMode(saved, false);
}

els.modes.addEventListener("click", (e) => {
  const btn = e.target.closest(".mode-btn");
  if (!btn) return;
  applyPlayMode(btn.dataset.mode, true);
});
loadPlayMode();

bindSeekWrap(els.seekWrap);
bindSeekWrap(els.nowSeekWrap);

function bindSeekKeyboard(inputEl) {
  if (!inputEl) return;
  inputEl.addEventListener("keydown", (e) => {
    const duration = getDuration();
    if (!duration) return;
    let next = seekPercent;
    if (e.key === "ArrowRight") next += 2;
    else if (e.key === "ArrowLeft") next -= 2;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 100;
    else return;
    e.preventDefault();
    commitSeek(next);
  });
  inputEl.addEventListener("click", (e) => e.preventDefault());
}

bindSeekKeyboard(els.seek);
bindSeekKeyboard(els.nowSeek);

audio.preload = "auto";
audio.addEventListener("play", () => {
  if (mvReady()) {
    try {
      audio.pause();
    } catch {
      /* ignore */
    }
    return;
  }
  setPlaying(true);
  pushListenTogetherPlayback({ transport: true });
});
audio.addEventListener("pause", () => {
  if (mvReady()) return;
  setPlaying(false);
  saveResume();
  pushListenTogetherPlayback({ transport: true });
});
audio.addEventListener("ended", () => {
  if (mvReady()) return;
  onEnded();
});
audio.addEventListener("timeupdate", () => {
  if (mvReady()) return;
  syncProgress();
  const now = Date.now();
  if (now - resumeSavedAt > 2000) {
    resumeSavedAt = now;
    saveResume();
  }
  if (
    listenTogetherActive &&
    !listenTogetherApplying &&
    !audio.paused &&
    now - listenTogetherLastPushAt > 8000
  ) {
    pushListenTogetherPlayback({ heartbeat: true });
  }
});
audio.addEventListener("loadedmetadata", syncProgress);
audio.addEventListener("durationchange", syncProgress);

if (els.mvVideo) {
  els.mvVideo.controls = false;
  els.mvVideo.disablePictureInPicture = true;
  els.mvVideo.addEventListener("timeupdate", () => {
    if (songMvDrivesAudio()) syncProgress();
  });
  els.mvVideo.addEventListener("play", () => {
    if (songMvDrivesAudio()) setPlaying(true);
  });
  els.mvVideo.addEventListener("pause", () => {
    if (songMvDrivesAudio()) setPlaying(false);
  });
  els.mvVideo.addEventListener("ended", () => {
    if (songMvDrivesAudio()) onEnded();
    else if (showMv && els.mvVideo?.dataset.mvKind === "default") syncAmbientMv(!audio.paused);
  });
  els.mvVideo.addEventListener("loadedmetadata", () => {
    if (songMvDrivesAudio()) syncProgress();
  });
}

async function initPlayer() {
  // 先拿到版本号做封面缓存戳，避免更新后本地封面被浏览器缓存成空白
  await refreshAppVersionLabel();
  setHint("正在加载曲库…");
  try {
    await loadLyricsBackgrounds();
    await loadPlayStats();
    await loadLikes();
    DEFAULT_PLAYLIST = await loadLocalPlaylist();
    playlist = [...DEFAULT_PLAYLIST];
    await syncAccountLibrary();
    renderList();

    if (!playlist.length) {
      setHint("还没有歌曲。可到设置上传共同曲库，或导入私人空间", true);
      els.title.textContent = "暂无歌曲";
      els.artist.textContent = "登录后可上传 / 导入";
      return;
    }

    currentIndex = resumeIndex();
    updateUI(playlist[currentIndex]);
    setHint("正在读取歌曲时长…");

    // 本地歌并发探测时长；云端跳过（避免启动时打爆 Storage）
    await fillAllDurations(DEFAULT_PLAYLIST);
    playlist = [...DEFAULT_PLAYLIST];
    renderList();
    updateUI(playlist[currentIndex] || playlist[0]);

    try {
      const first = playlist[currentIndex] || playlist[0];
      const playUrl = await resolvePlayUrl(first);
      audio.src = playUrl;
      audio.setAttribute("data-id", String(first.id));
      try {
        audio.load();
      } catch {
        /* ignore */
      }
      await waitForAudioReady(first.cloud ? 25000 : 12000);
      const savedResume = readResume();
      const sameResume =
        savedResume &&
        ((savedResume.id && String(savedResume.id) === String(first.id)) ||
          (savedResume.key && savedResume.key === playStatKey(first)));
      if (sameResume && Number(savedResume.time) > 1) {
        const dur = Number(audio.duration) || 0;
        const nextTime =
          dur > 3
            ? Math.min(Number(savedResume.time) || 0, Math.max(0, dur - 1.2))
            : Number(savedResume.time) || 0;
        try {
          audio.currentTime = nextTime;
        } catch {
          /* ignore */
        }
      }
      syncProgress();
      setHint(`公共+私人 ${playlist.length} 首 · 输入歌名可搜索`);
    } catch (err) {
      setHint(playFailHint(playlist[0], err), true);
    }
  } catch {
    setHint("请双击「打开播放器.bat」启动，不要直接打开 html", true);
  }
}

function setAuthHint(text, isError = false) {
  if (!els.authHint) return;
  els.authHint.textContent = text || "";
  els.authHint.classList.toggle("is-error", !!isError);
}

let selectedAuthAvatar = "preset:1";
let selectedProfileAvatar = "preset:1";
let loginPreviewTimer = null;

function compressAvatarFile(file) {
  return new Promise((resolve, reject) => {
    if (!file || !String(file.type || "").startsWith("image/")) {
      reject(new Error("请选择图片文件"));
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      reject(new Error("图片请小于 8MB"));
      return;
    }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        // 控制体积，便于写入资料表并在评论/私聊同步（不依赖 Storage 也能用）
        const size = 96;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        const s = Math.min(img.width, img.height) || 1;
        const sx = (img.width - s) / 2;
        const sy = (img.height - s) / 2;
        ctx.drawImage(img, sx, sy, s, s, 0, 0, size, size);
        let quality = 0.72;
        let out = canvas.toDataURL("image/jpeg", quality);
        while (out.length > 14000 && quality > 0.4) {
          quality -= 0.08;
          out = canvas.toDataURL("image/jpeg", quality);
        }
        resolve(out);
      } catch (err) {
        reject(err);
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("无法读取图片"));
    };
    img.src = url;
  });
}

function renderAvatarPicker(container, getSelected, setSelected) {
  if (!container) return;
  const presets = window.LudongCloud?.avatarPresets || [];
  const srcOf = window.LudongCloud?.avatarSrc || ((v) => v);
  const selected = typeof getSelected === "function" ? getSelected() : getSelected;

  if (!container.dataset.ready) {
    container.innerHTML = presets
      .map((p) => {
        return `<button type="button" class="avatar-pick" data-avatar-id="${escapeHtml(p.id)}" role="option" aria-selected="false">
          <img src="${escapeHtml(srcOf(p.id))}" alt="" draggable="false" />
        </button>`;
      })
      .join("");
    container.dataset.ready = "1";
    container.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const btn = e.target.closest("[data-avatar-id]");
      if (!btn) return;
      const id = btn.dataset.avatarId || "";
      if (typeof setSelected === "function") setSelected(id);
      syncAvatarPickerActive(container, id);
    });
  }
  syncAvatarPickerActive(container, selected);
}

function syncAvatarPickerActive(container, selected) {
  if (!container) return;
  container.querySelectorAll("[data-avatar-id]").forEach((btn) => {
    const on = btn.dataset.avatarId === selected;
    btn.classList.toggle("is-active", on);
    btn.setAttribute("aria-selected", on ? "true" : "false");
  });
}

function setAuthFace(src, metaText = "") {
  if (els.authFace) {
    els.authFace.src = src || "./logo.jpg";
    els.authFace.classList.toggle("is-user-face", !!metaText);
  }
  if (els.authFaceMeta) {
    if (metaText) {
      els.authFaceMeta.hidden = false;
      els.authFaceMeta.textContent = metaText;
    } else {
      els.authFaceMeta.hidden = true;
      els.authFaceMeta.textContent = "";
    }
  }
}

function refreshAuthAvatarPreview() {
  const src =
    window.LudongCloud?.avatarSrc?.(selectedAuthAvatar, els.authDisplayName?.value) ||
    "./logo.jpg";
  setAuthFace(src, "注册时选择的头像");
}

async function previewLoginByEmail() {
  const email = (els.authEmail?.value || "").trim();
  if (!window.LudongCloud?.lookupLoginPreview || email.length < 5) {
    setAuthFace("./logo.jpg", "");
    return;
  }
  const preview = await window.LudongCloud.lookupLoginPreview(email);
  if (!preview) {
    setAuthFace("./logo.jpg", "");
    return;
  }
  const src = window.LudongCloud.avatarSrc(preview.avatarUrl, preview.name);
  const bits = [];
  if (preview.name) bits.push(preview.name);
  if (preview.userNoLabel) bits.push(`用户号 ${preview.userNoLabel}`);
  setAuthFace(src, bits.join(" · ") || "已有账号");
}

function setAuthMode(mode) {
  const isRegister = mode === "register";
  els.authTabLogin?.classList.toggle("is-active", !isRegister);
  els.authTabRegister?.classList.toggle("is-active", isRegister);
  const nameField =
    document.getElementById("authNameField") ||
    els.authDisplayName?.closest(".auth-field");
  nameField?.classList.toggle("is-login-hidden", !isRegister);
  els.authAvatarField?.classList.toggle("is-login-hidden", !isRegister);
  if (els.authDisplayName) els.authDisplayName.required = isRegister;
  if (els.authSubmit) {
    els.authSubmit.textContent = isRegister ? "注册并进入" : "登录进入";
  }
  if (els.authPassword) {
    els.authPassword.autocomplete = isRegister ? "new-password" : "current-password";
  }
  setAuthHint("");
  setAppWindowSize(isRegister ? "auth-register" : "auth");
  if (isRegister) {
    if (!selectedAuthAvatar) selectedAuthAvatar = "preset:1";
    bindAuthAvatarPicker();
    refreshAuthAvatarPreview();
  } else {
    previewLoginByEmail();
  }
}

function bindAuthAvatarPicker() {
  renderAvatarPicker(
    els.authAvatarPicker,
    () => selectedAuthAvatar,
    (id) => {
      selectedAuthAvatar = id;
      refreshAuthAvatarPreview();
    }
  );
}

function setAppWindowSize(mode) {
  try {
    if (mode === "auth-register") {
      window.resizeTo(420, 820);
    } else if (mode === "auth") {
      window.resizeTo(420, 700);
    } else {
      window.resizeTo(1022, 720);
    }
  } catch {
    /* ignore */
  }
}

function setProfileStatus(text, kind = "") {
  if (!els.profileStatus) return;
  els.profileStatus.textContent = text || "";
  els.profileStatus.classList.toggle("is-error", kind === "error");
  els.profileStatus.classList.toggle("is-ok", kind === "ok");
}

function bindProfileAvatarPicker() {
  renderAvatarPicker(
    els.profileAvatarPicker,
    () => (String(selectedProfileAvatar || "").startsWith("preset:") ? selectedProfileAvatar : ""),
    (id) => {
      selectedProfileAvatar = id;
      if (els.profileEditAvatar) {
        els.profileEditAvatar.src =
          window.LudongCloud?.avatarSrc?.(id, els.profileNameInput?.value) || "./logo.jpg";
      }
    }
  );
}

function paintMenuIdentity({
  name = "未登录",
  avatarSrc = "./logo.jpg",
  userNoText = "用户号 —",
  honor = "",
  tone = ""
} = {}) {
  if (els.navName) els.navName.textContent = name;
  if (els.navAvatar) els.navAvatar.src = avatarSrc || "./logo.jpg";
  if (els.navUserNo) {
    const title = String(honor || "").trim();
    els.navUserNo.className = `nav-sub${tone ? ` ${tone}` : ""}`;
    els.navUserNo.textContent = title
      ? `${userNoText} · ${title}`
      : userNoText;
  }
  if (els.accountNameLabel) els.accountNameLabel.textContent = name;
  if (els.accountUserNo) {
    els.accountUserNo.className = `nav-item-sub${tone ? ` ${tone}` : ""}`;
    els.accountUserNo.textContent =
      userNoText === "用户号 —" ? "头像、昵称与密码" : userNoText;
  }
}

async function refreshProfileEditor() {
  if (!window.LudongCloud?.isLoggedIn?.()) {
    paintMenuIdentity();
    if (els.profileEditName) els.profileEditName.textContent = "未登录";
    if (els.profileEditSub) {
      els.profileEditSub.className = "profile-edit-sub";
      els.profileEditSub.textContent = "登录后可改头像、昵称、密码";
    }
    if (els.profileEditAvatar) els.profileEditAvatar.src = "./logo.jpg";
    if (els.profileTitleField) els.profileTitleField.hidden = true;
    return;
  }
  let profile = null;
  try {
    profile = await window.LudongCloud.getMyProfile?.();
  } catch {
    profile = null;
  }
  const name = profile?.name || window.LudongCloud.getDisplayName?.() || "用户";
  const avatar = profile?.avatarUrl || window.LudongCloud.getAvatar?.() || "preset:1";
  const noLabel = profile?.userNoLabel || "";
  const userNo = profile?.userNo;
  const vip = isVipUserNo(userNo);
  const tone = vipToneClass(userNo);
  const honor =
    profile?.honorTitleDisplay ||
    resolveHonorTitle(userNo, profile?.honorTitle) ||
    "";
  selectedProfileAvatar = avatar.startsWith("preset:") || avatar.startsWith("data:")
    ? avatar
    : avatar || "preset:1";
  const avatarUrl = window.LudongCloud.avatarSrc(avatar, name);
  paintMenuIdentity({
    name,
    avatarSrc: avatarUrl,
    userNoText: noLabel ? `用户号 ${noLabel}` : "用户号 —",
    honor,
    tone
  });
  if (els.profileEditName) els.profileEditName.textContent = name;
  if (els.profileEditSub) {
    if (noLabel) {
      const titleBit = honor
        ? ` · <span class="honor-title ${tone || "is-gold"}">${escapeHtml(honor)}</span>`
        : "";
      els.profileEditSub.className = "profile-edit-sub";
      els.profileEditSub.innerHTML = `用户号 <span class="user-no${tone ? ` ${tone}` : ""}">${escapeHtml(noLabel)}</span>${titleBit}`;
    } else {
      els.profileEditSub.className = "profile-edit-sub";
      els.profileEditSub.textContent = "昵称、邮箱、密码绑定本账号";
    }
  }
  if (els.profileNameInput) els.profileNameInput.value = name;
  if (els.profileTitleField) {
    els.profileTitleField.hidden = !vip;
    if (els.profileTitleInput) {
      els.profileTitleInput.value =
        String(profile?.honorTitle || "").trim() ||
        (Number(userNo) === 0 ? "创世神" : "");
      els.profileTitleInput.placeholder =
        Number(userNo) === 0 ? "创世神" : "为自己起个头衔";
    }
  }
  if (els.profileEditAvatar) {
    els.profileEditAvatar.src = avatarUrl;
  }
  bindProfileAvatarPicker();
  refreshCloudAclPanel().catch(() => {});
}

let cloudAclState = {
  restrictEnabled: true,
  friendIds: new Set(),
  isAdmin: false,
  canListenShared: false,
  friends: []
};

function setCloudAclStatus(text, isError = false) {
  const el = document.getElementById("cloudAclStatus");
  if (!el) return;
  el.textContent = text || "";
  el.classList.toggle("is-error", !!isError);
  el.classList.toggle("is-ok", !!text && !isError);
}

function syncCloudAclModeButtons() {
  const mode = cloudAclState.restrictEnabled ? "restrict" : "open";
  document.querySelectorAll("#cloudAclModeRow [data-cloud-acl-mode]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.cloudAclMode === mode);
  });
}

function renderCloudAclFriends() {
  const box = document.getElementById("cloudAclFriends");
  if (!box) return;
  const friends = cloudAclState.friends || [];
  if (!friends.length) {
    box.innerHTML = '<p class="cloud-acl-empty">还没有好友。先去私聊加好友，再勾选可听共同云端的人。</p>';
    return;
  }
  box.innerHTML = friends
    .map((f) => {
      const id = String(f.id || f.friendId || "");
      const on = cloudAclState.friendIds.has(id);
      const name = f.remark || f.name || f.displayName || "好友";
      const sub = f.userNoLabel ? `用户号 ${f.userNoLabel}` : "好友";
      const avatar = window.LudongCloud?.avatarSrc?.(f.avatarUrl || f.avatar || "preset:1", name) || "./logo.jpg";
      return `<button type="button" class="cloud-acl-friend${on ? " is-on" : ""}" data-cloud-acl-friend="${escapeHtml(id)}">
        <img src="${escapeHtml(avatar)}" alt="" />
        <span class="cloud-acl-friend-meta">
          <span class="cloud-acl-friend-name">${escapeHtml(name)}</span>
          <span class="cloud-acl-friend-sub">${escapeHtml(sub)}</span>
        </span>
        <span class="cloud-acl-check" aria-hidden="true"></span>
      </button>`;
    })
    .join("");
}

async function refreshCloudAclPanel() {
  const note = document.getElementById("cloudAclNote");
  const admin = document.getElementById("cloudAclAdmin");
  const hint = document.getElementById("cloudAclHint");
  if (!window.LudongCloud?.fetchCloudListenAcl) {
    if (note) note.textContent = "当前版本未接入云端权限接口。";
    if (admin) admin.hidden = true;
    return;
  }
  if (!window.LudongCloud?.isLoggedIn?.()) {
    if (note) note.textContent = "登录后可查看云端听歌权限。";
    if (admin) admin.hidden = true;
    if (hint) hint.textContent = "共同曲库";
    return;
  }
  try {
    const acl = await window.LudongCloud.fetchCloudListenAcl();
    cloudAclState.restrictEnabled = acl.restrictEnabled !== false;
    cloudAclState.isAdmin = !!acl.isAdmin;
    cloudAclState.canListenShared = !!acl.canListenShared;
    cloudAclState.friendIds = new Set(
      (Array.isArray(acl.friendIds) ? acl.friendIds : []).map(String)
    );
    if (cloudAclState.isAdmin && window.LudongCloud.listFriends) {
      const friends = await window.LudongCloud.listFriends();
      cloudAclState.friends = Array.isArray(friends) ? friends : [];
    } else {
      cloudAclState.friends = [];
    }
    if (admin) admin.hidden = !cloudAclState.isAdmin;
    if (hint) {
      hint.textContent = cloudAclState.canListenShared ? "可听共同云端" : "仅自己上传";
    }
    if (note) {
      if (cloudAclState.isAdmin) {
        note.textContent = cloudAclState.restrictEnabled
          ? "限制已开启：只有你和勾选的好友能听全部共同云端。"
          : "当前全员可听共同云端（旧行为）。";
      } else if (cloudAclState.canListenShared) {
        note.textContent = "你已被允许收听全部共同云端歌曲。";
      } else if (!cloudAclState.restrictEnabled) {
        note.textContent = "共同云端对全员开放，你可收听全部云端歌曲。";
      } else {
        note.textContent = "当前仅能听自己上传的云端歌，看不到其他人上传的歌。";
      }
    }
    syncCloudAclModeButtons();
    if (cloudAclState.isAdmin) renderCloudAclFriends();
  } catch (err) {
    if (note) note.textContent = err?.message || "云端权限加载失败";
    if (admin) admin.hidden = true;
  }
}

async function reloadLibraryAfterAcl() {
  try {
    const next = await loadLocalPlaylist();
    DEFAULT_PLAYLIST = Array.isArray(next) ? next : [];
    playlist = [...DEFAULT_PLAYLIST];
    renderList();
    renderRankRow(playRanking);
  } catch (err) {
    console.warn("reloadLibraryAfterAcl", err);
  }
}

function refreshAccountLabel() {
  if (window.LudongCloud?.isLoggedIn?.()) {
    const name = window.LudongCloud.getDisplayName?.() || "已登录";
    const avatar = window.LudongCloud.getAvatar?.() || "preset:1";
    paintMenuIdentity({
      name,
      avatarSrc: window.LudongCloud.avatarSrc?.(avatar, name) || "./logo.jpg"
    });
  } else {
    paintMenuIdentity();
  }
  refreshProfileEditor().catch(() => {});
}

function enterAppShell() {
  document.body.classList.remove("is-auth-screen");
  els.authLayer?.setAttribute("hidden", "");
  els.authLayer?.setAttribute("aria-hidden", "true");
  if (els.appRoot) els.appRoot.hidden = false;
  setAppWindowSize("app");
  try {
    audio.pause();
  } catch {
    /* ignore */
  }
  currentIndex = 0;
  DEFAULT_PLAYLIST = [];
  playlist = [];
  resetAccountScopedUi();
}

function enterAppAfterAuth() {
  enterAppShell();
  refreshAccountLabel();
  window.LudongCloud?.upsertMyProfile?.().catch(() => {});
  window.LudongCloud?.fetchMyProfile?.().then(() => refreshAccountLabel()).catch(() => {});
  initPlayer();
  startChatInboxPoll();
  startListenTogetherPoll();
  refreshMoodRadioCard();
  refreshDiaryEntrySub();
}

/** 断网或不想登录：直接进播放器听本机私人库 / 本地文件 */
function enterLocalOnlyMode() {
  enterAppShell();
  refreshAccountLabel();
  initPlayer().then(() => {
    const n = DEFAULT_PLAYLIST.filter((s) => s.local && !s.cloud).length;
    setHint(
      n
        ? `本地模式 · ${n} 首可离线播放（云端功能需登录联网）`
        : "本地模式：暂无私人歌曲，有网登录后可导入或听云端"
    );
  });
}

function showAuthGate() {
  document.body.classList.add("is-auth-screen");
  if (els.appRoot) els.appRoot.hidden = true;
  els.authLayer?.removeAttribute("hidden");
  els.authLayer?.setAttribute("aria-hidden", "false");
  setAuthMode("login");
  setAppWindowSize("auth");
  refreshAccountLabel();
}

async function bootstrapApp() {
  applyWebSiteMode();
  // 无云端配置时直接进播放器（本机模式）
  if (!window.LudongCloud?.enabled?.()) {
    document.body.classList.remove("is-auth-screen");
    if (els.authLayer) els.authLayer.hidden = true;
    if (els.appRoot) els.appRoot.hidden = false;
    setAppWindowSize("app");
    initPlayer();
    return;
  }
  try {
    await window.LudongCloud.ensureAuthSession();
  } catch {
    // 完全没会话：显示登录页
    showAuthGate();
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setAuthHint(
        IS_WEB_SITE
          ? "当前无网络：请联网后再登录或试听云端"
          : "当前无网络：可先听本地歌，联网后再登录",
        true
      );
    } else {
      setAuthHint(
        "登录云端失败时可先点下方「先听本地歌」；有网后再登录同步。",
        true
      );
    }
    return;
  }
  // 进播放器与鉴权分开：界面恢复报错不应把人踢回登录页
  try {
    enterAppAfterAuth();
  } catch (err) {
    console.warn("enterAppAfterAuth failed", err);
    enterAppShell();
    initPlayer().catch((e) => console.warn("initPlayer failed", e));
  }
}

els.authTabLogin?.addEventListener("click", () => setAuthMode("login"));
els.authTabRegister?.addEventListener("click", () => setAuthMode("register"));

const QQ_MAIL_DOMAINS = ["@qq.com", "@foxmail.com"];

function qqEmailCandidates(raw) {
  const v = String(raw || "").trim();
  if (!/^\d{5,11}$/.test(v)) return [];
  return QQ_MAIL_DOMAINS.map((d) => `${v}${d}`);
}

function hideEmailSuggest() {
  if (!els.authEmailSuggest) return;
  els.authEmailSuggest.hidden = true;
  els.authEmailSuggest.innerHTML = "";
}

function showEmailSuggest(emails) {
  if (!els.authEmailSuggest) return;
  if (!emails.length) {
    hideEmailSuggest();
    return;
  }
  els.authEmailSuggest.innerHTML = emails
    .map(
      (mail, i) => `<button type="button" class="auth-email-option${
        i === 0 ? " is-active" : ""
      }" role="option" data-email="${escapeHtml(mail)}">
        <span class="auth-email-option-mail">${escapeHtml(mail)}</span>
        <span class="auth-email-option-tip">${i === 0 ? "回车选用" : "点击选用"}</span>
      </button>`
    )
    .join("");
  els.authEmailSuggest.hidden = false;
}

function applyEmailSuggest(mail) {
  if (!els.authEmail || !mail) return;
  els.authEmail.value = mail;
  hideEmailSuggest();
  els.authEmail.focus();
  els.authEmail.dispatchEvent(new Event("input", { bubbles: true }));
}

function refreshEmailSuggest() {
  const list = qqEmailCandidates(els.authEmail?.value || "");
  showEmailSuggest(list);
}

els.authEmail?.addEventListener("input", () => {
  refreshEmailSuggest();
  if (!els.authTabLogin?.classList.contains("is-active")) return;
  if (loginPreviewTimer) clearTimeout(loginPreviewTimer);
  loginPreviewTimer = setTimeout(() => previewLoginByEmail(), 380);
});

els.authEmail?.addEventListener("keydown", (e) => {
  if (els.authEmailSuggest?.hidden) return;
  const options = [...(els.authEmailSuggest?.querySelectorAll(".auth-email-option") || [])];
  if (!options.length) return;
  const active = els.authEmailSuggest.querySelector(".auth-email-option.is-active");
  let idx = Math.max(0, options.indexOf(active));
  if (e.key === "ArrowDown") {
    e.preventDefault();
    idx = (idx + 1) % options.length;
    options.forEach((btn, i) => btn.classList.toggle("is-active", i === idx));
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    idx = (idx - 1 + options.length) % options.length;
    options.forEach((btn, i) => btn.classList.toggle("is-active", i === idx));
  } else if (e.key === "Enter" || e.key === "Tab") {
    const pick = options[idx]?.dataset?.email;
    if (pick && /^\d{5,11}$/.test(String(els.authEmail.value || "").trim())) {
      e.preventDefault();
      applyEmailSuggest(pick);
    }
  } else if (e.key === "Escape") {
    hideEmailSuggest();
  }
});

els.authEmailSuggest?.addEventListener("mousedown", (e) => {
  const btn = e.target.closest(".auth-email-option");
  if (!btn) return;
  e.preventDefault();
  applyEmailSuggest(btn.dataset.email || "");
});

els.authEmail?.addEventListener("blur", () => {
  setTimeout(() => hideEmailSuggest(), 120);
});

els.authAvatarUploadBtn?.addEventListener("click", () => els.authAvatarFile?.click());
els.authAvatarFile?.addEventListener("change", async () => {
  const file = els.authAvatarFile?.files?.[0];
  if (!file) return;
  try {
    selectedAuthAvatar = await compressAvatarFile(file);
    syncAvatarPickerActive(els.authAvatarPicker, "");
    refreshAuthAvatarPreview();
    setAuthHint("已选用自定义头像");
  } catch (err) {
    setAuthHint(err?.message || "头像上传失败", true);
  } finally {
    if (els.authAvatarFile) els.authAvatarFile.value = "";
  }
});
els.authForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!window.LudongCloud?.enabled?.()) return;
  const mode = els.authTabRegister?.classList.contains("is-active")
    ? "register"
    : "login";
  let email = String(els.authEmail?.value || "").trim();
  if (/^\d{5,11}$/.test(email)) {
    email = `${email}@qq.com`;
    if (els.authEmail) els.authEmail.value = email;
    hideEmailSuggest();
  }
  const password = els.authPassword?.value || "";
  const displayName = els.authDisplayName?.value || "";
  if (els.authSubmit) els.authSubmit.disabled = true;
  setAuthHint(mode === "register" ? "注册中…" : "登录中…");
  try {
    if (mode === "register") {
      if (!String(displayName).trim()) throw new Error("请填写昵称");
      await window.LudongCloud.signUp({
        email,
        password,
        displayName,
        avatarUrl: selectedAuthAvatar
      });
    } else {
      await window.LudongCloud.signIn({ email, password });
    }
    setAuthHint("成功，正在进入…");
    try {
      enterAppAfterAuth();
    } catch (enterErr) {
      console.warn("enterAppAfterAuth failed after login", enterErr);
      enterAppShell();
      initPlayer().catch((e) => console.warn("initPlayer failed", e));
    }
  } catch (err) {
    const msg = String(err?.message || "登录失败");
    setAuthHint(msg, true);
  } finally {
    if (els.authSubmit) els.authSubmit.disabled = false;
  }
});

els.authLocalBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  enterLocalOnlyMode();
});

els.profileAvatarUploadBtn?.addEventListener("click", () => els.profileAvatarFile?.click());
els.profileAvatarFile?.addEventListener("change", async () => {
  const file = els.profileAvatarFile?.files?.[0];
  if (!file) return;
  try {
    selectedProfileAvatar = await compressAvatarFile(file);
    syncAvatarPickerActive(els.profileAvatarPicker, "");
    if (els.profileEditAvatar) {
      els.profileEditAvatar.src =
        window.LudongCloud?.avatarSrc?.(selectedProfileAvatar) || "./logo.jpg";
    }
    setProfileStatus("已选用自定义头像，点「保存头像与昵称」生效", "ok");
  } catch (err) {
    setProfileStatus(err?.message || "头像上传失败", "error");
  } finally {
    if (els.profileAvatarFile) els.profileAvatarFile.value = "";
  }
});

document.getElementById("cloudAclModeRow")?.addEventListener("click", (e) => {
  const btn = e.target.closest?.("[data-cloud-acl-mode]");
  if (!btn || !cloudAclState.isAdmin) return;
  cloudAclState.restrictEnabled = btn.dataset.cloudAclMode !== "open";
  syncCloudAclModeButtons();
  const note = document.getElementById("cloudAclNote");
  if (note) {
    note.textContent = cloudAclState.restrictEnabled
      ? "限制已开启：只有你和勾选的好友能听全部共同云端。"
      : "当前全员可听共同云端（旧行为）。";
  }
});

document.getElementById("cloudAclFriends")?.addEventListener("click", (e) => {
  const btn = e.target.closest?.("[data-cloud-acl-friend]");
  if (!btn || !cloudAclState.isAdmin) return;
  const id = btn.dataset.cloudAclFriend || "";
  if (!id) return;
  if (cloudAclState.friendIds.has(id)) cloudAclState.friendIds.delete(id);
  else cloudAclState.friendIds.add(id);
  renderCloudAclFriends();
});

document.getElementById("cloudAclSaveBtn")?.addEventListener("click", async () => {
  if (!cloudAclState.isAdmin || !window.LudongCloud?.saveCloudListenAcl) return;
  setCloudAclStatus("正在保存…");
  try {
    const next = await window.LudongCloud.saveCloudListenAcl({
      restrictEnabled: cloudAclState.restrictEnabled,
      friendIds: [...cloudAclState.friendIds]
    });
    cloudAclState.restrictEnabled = next.restrictEnabled !== false;
    cloudAclState.canListenShared = !!next.canListenShared;
    cloudAclState.friendIds = new Set(
      (Array.isArray(next.friendIds) ? next.friendIds : []).map(String)
    );
    syncCloudAclModeButtons();
    renderCloudAclFriends();
    await reloadLibraryAfterAcl();
    setCloudAclStatus("云端权限已保存，曲库已刷新");
    setHint("云端听歌权限已更新");
  } catch (err) {
    setCloudAclStatus(err?.message || "保存失败", true);
  }
});

els.profileSaveBtn?.addEventListener("click", async () => {
  if (!window.LudongCloud?.isLoggedIn?.()) {
    setProfileStatus("请先登录", "error");
    return;
  }
  setProfileStatus("保存中…");
  try {
    const payload = {
      displayName: els.profileNameInput?.value || "",
      avatarUrl: selectedProfileAvatar
    };
    if (els.profileTitleField && !els.profileTitleField.hidden) {
      payload.honorTitle = els.profileTitleInput?.value || "";
    }
    await window.LudongCloud.updateMyProfile(payload);
    setProfileStatus("已保存", "ok");
    refreshAccountLabel();
    await refreshProfileEditor().catch(() => {});
    // 刷新评论缓存里自己的头像
    Object.keys(commentsCache).forEach((k) => {
      (commentsCache[k] || []).forEach((c) => {
        if (c && c.userId && c.userId === currentLibraryUserId()) {
          c.avatarUrl = window.LudongCloud?.getAvatar?.() || c.avatarUrl;
        }
      });
    });
    if (commentsSongKey && commentsCache[commentsSongKey]) {
      renderCommentsList(commentsCache[commentsSongKey]);
    }
    chatPeersCache = [];
  } catch (err) {
    setProfileStatus(err?.message || "保存失败", "error");
  }
});

els.profilePasswordBtn?.addEventListener("click", async () => {
  if (!window.LudongCloud?.isLoggedIn?.()) {
    setProfileStatus("请先登录", "error");
    return;
  }
  const a = els.profileOldPassword?.value || "";
  const b = els.profileNewPassword?.value || "";
  const c = els.profileNewPassword2?.value || "";
  if (b !== c) {
    setProfileStatus("两次新密码不一致", "error");
    return;
  }
  setProfileStatus("正在修改密码…");
  try {
    await window.LudongCloud.updatePassword(a, b);
    if (els.profileOldPassword) els.profileOldPassword.value = "";
    if (els.profileNewPassword) els.profileNewPassword.value = "";
    if (els.profileNewPassword2) els.profileNewPassword2.value = "";
    setProfileStatus("密码已修改", "ok");
  } catch (err) {
    setProfileStatus(err?.message || "修改密码失败", "error");
  }
});

// 登录页记住上次邮箱
try {
  const last = window.LudongCloud?.getLastEmail?.();
  if (last && els.authEmail && !els.authEmail.value) els.authEmail.value = last;
} catch {
  /* ignore */
}
bindAuthAvatarPicker();
setAuthMode("login");

els.logoutBtn?.addEventListener("click", () => {
  // 退出即中止：立刻停播并收起播放页
  try {
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  } catch {
    /* ignore */
  }
  setPlaying(false);
  stopLyricsLoop?.();
  stopChatPoll?.();
  stopChatInboxPoll?.();
  stopPresenceHeartbeat?.();
  stopListenTogetherPoll?.();
  window.LudongCloud?.signOut?.();
  resetAccountScopedUi();
  setHint("已退出登录");
  closeChatLayer();
  closeCommentsLayer();
  closeLikesLayer?.();
  closePlayerWindow?.();
  showAuthGate();
});

bootstrapApp();

window.addEventListener("resize", () => {
  if (els.playerLayer?.classList.contains("is-open")) fitPlayerBoard();
});

/* 应用窗口本质仍是网页：屏蔽浏览器右键菜单，更像桌面软件 */
document.addEventListener("contextmenu", (e) => {
  if (
    e.target.closest(".chat-peer") ||
    e.target.closest("#friendCtxMenu") ||
    e.target.closest(".chat-row") ||
    e.target.closest("#msgCtxMenu")
  ) {
    return;
  }
  e.preventDefault();
});

/* —— 首页设置：背景黑白自由调节 —— */
const THEME_KEY = "ludong-bg-lightness";
let bgHue = "neutral";
let bgLight = 0;

const BG_HUES = {
  neutral: ["#0c0f14", "#f7f4ee", "#141a22", "#efeae2", "#10151c", "#fbf8f3", "#090b10", "#f0ebe3"],
  orange: ["#2a1408", "#ffb15a", "#3a1c0c", "#ffc27a", "#33180a", "#ffd09a", "#241006", "#ffbf70"],
  pink: ["#2a1020", "#ff8fbe", "#3a1428", "#ffa3c8", "#30101c", "#ffd0e2", "#240c18", "#ff9ec4"],
  blue: ["#0c1830", "#7eb6ff", "#122038", "#9ac6ff", "#101c34", "#c5ddff", "#081428", "#8ec0ff"],
  green: ["#0c2418", "#6ed69a", "#12301e", "#8ee0b0", "#102818", "#c8f0d8", "#081810", "#7ed9a4"],
  purple: ["#1c1030", "#c49bff", "#28143c", "#d2b0ff", "#201438", "#e4d4ff", "#140c28", "#c9a6ff"]
};

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function mixChannel(a, b, t) {
  return Math.round(a + (b - a) * t);
}

function mixHex(darkHex, lightHex, t) {
  const parse = (h) => {
    const s = h.replace("#", "");
    return [
      parseInt(s.slice(0, 2), 16),
      parseInt(s.slice(2, 4), 16),
      parseInt(s.slice(4, 6), 16)
    ];
  };
  const d = parse(darkHex);
  const l = parse(lightHex);
  const r = mixChannel(d[0], l[0], t);
  const g = mixChannel(d[1], l[1], t);
  const b = mixChannel(d[2], l[2], t);
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

function syncWindowThemeColor() {
  const color = "#cce4fe";
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", color);
}

function applyMangaInkVars() {
  const root = document.documentElement;
  root.style.setProperty("--bg", "#f7f3ea");
  root.style.setProperty("--bg-soft", "#fffdf8");
  root.style.setProperty("--bg-top", "#f3eee4");
  root.style.setProperty("--bg-bottom", "#ebe4d6");
  root.style.setProperty("--text", "#1a1612");
  root.style.setProperty("--muted", "#5e574e");
  root.style.setProperty("--dim", "#8a8278");
  root.style.setProperty("--line", "#1a1612");
  root.style.setProperty("--accent", "#1a1612");
  root.style.setProperty("--accent-deep", "#1a1612");
  root.style.setProperty("--sidebar-bg", "transparent");
  root.style.setProperty("--now-card-bg", "#fffdf8");
  root.style.setProperty("--now-card-shadow", "3px 3px 0 #1a1612");
  root.style.setProperty("--now-skip-bg", "transparent");
  root.style.setProperty("--now-seek-track", "rgba(26, 22, 18, 0.16)");
  root.style.setProperty("--scroll-thumb", "rgba(26, 22, 18, 0.35)");
  root.style.setProperty("--glow-a", "transparent");
  root.style.setProperty("--glow-b", "transparent");
  root.dataset.bgLight = "1";
}

function applyBgLightness(value, hue) {
  if (document.documentElement.classList.contains("theme-manga")) {
    applyMangaInkVars();
    return;
  }
  if (hue && BG_HUES[hue]) bgHue = hue;
  const pair = BG_HUES[bgHue] || BG_HUES.neutral;
  const t = clamp(Number(value) || 0, 0, 100) / 100;
  bgLight = t;
  const root = document.documentElement;
  root.style.setProperty("--bg", mixHex(pair[0], pair[1], t));
  root.style.setProperty("--bg-soft", mixHex(pair[2], pair[3], t));
  root.style.setProperty("--bg-top", mixHex(pair[4], pair[5], t));
  root.style.setProperty("--bg-bottom", mixHex(pair[6], pair[7], t));
  root.style.setProperty("--text", mixHex("#f2efe8", "#1a1f28", t));
  root.style.setProperty("--muted", mixHex("#8b93a0", "#5a6472", t));
  root.style.setProperty("--dim", mixHex("#5a6270", "#8a93a0", t));
  root.style.setProperty(
    "--line",
    t < 0.5
      ? `rgba(255, 255, 255, ${0.06 + t * 0.04})`
      : `rgba(0, 0, 0, ${0.08 + (t - 0.5) * 0.1})`
  );
  root.style.setProperty(
    "--glow-a",
    `rgba(232, 165, 75, ${0.16 - t * 0.08})`
  );
  root.style.setProperty(
    "--glow-b",
    `rgba(72, 120, 160, ${0.12 - t * 0.06})`
  );
  root.style.setProperty(
    "--sidebar-bg",
    t < 0.5
      ? `rgba(0, 0, 0, ${0.15 - t * 0.08})`
      : `rgba(255, 255, 255, ${0.35 + (t - 0.5) * 0.4})`
  );
  if (t < 0.5) {
    root.style.setProperty(
      "--now-card-bg",
      "linear-gradient(135deg, rgba(26, 34, 45, 0.95), rgba(20, 26, 34, 0.75))"
    );
    root.style.setProperty("--now-card-shadow", "0 8px 20px rgba(0, 0, 0, 0.22)");
    root.style.setProperty("--now-skip-bg", "rgba(255, 255, 255, 0.04)");
    root.style.setProperty("--now-seek-track", "rgba(255, 255, 255, 0.12)");
  } else {
    const soft = 0.55 + (t - 0.5) * 0.7;
    root.style.setProperty(
      "--now-card-bg",
      `linear-gradient(135deg, rgba(255, 255, 255, ${0.88 + (t - 0.5) * 0.2}), rgba(245, 240, 232, ${soft}))`
    );
    root.style.setProperty(
      "--now-card-shadow",
      "0 8px 22px rgba(40, 36, 28, 0.1)"
    );
    root.style.setProperty("--now-skip-bg", "rgba(0, 0, 0, 0.04)");
    root.style.setProperty("--now-seek-track", "rgba(0, 0, 0, 0.1)");
  }
  root.dataset.bgLight = t >= 0.55 ? "1" : "0";
  root.style.setProperty(
    "--scroll-thumb",
    t < 0.5 ? "rgba(204, 228, 254, 0.45)" : "rgba(127, 168, 210, 0.4)"
  );
  root.style.removeProperty("--accent");
  root.style.removeProperty("--accent-deep");
  syncWindowThemeColor();
  if (els.bgLightness) els.bgLightness.value = String(Math.round(t * 100));
  if (els.bgPreview) {
    els.bgPreview.style.background = getComputedStyle(root).getPropertyValue("--bg");
  }
  const preset = bgHue !== "neutral" ? bgHue : t >= 0.5 ? "white" : "black";
  document.querySelectorAll("[data-bg-preset]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.bgPreset === preset);
  });
  try {
    localStorage.setItem(
      THEME_KEY,
      JSON.stringify({ l: Math.round(t * 100), h: bgHue })
    );
  } catch {
    /* ignore */
  }
  if (root.getAttribute("data-shell-bg") === "1") {
    applyShellLevel(readShellBackground().level);
  }
}

function loadBgLightness() {
  let v = 0;
  let hue = "neutral";
  try {
    const raw = localStorage.getItem(THEME_KEY) || "0";
    if (raw.trim().startsWith("{")) {
      const data = JSON.parse(raw);
      v = Number(data.l) || 0;
      hue = BG_HUES[data.h] ? data.h : "neutral";
    } else {
      v = Number(raw) || 0;
    }
  } catch {
    v = 0;
    hue = "neutral";
  }
  bgHue = hue;
  if (hue !== "neutral") v = 100;
  else v = v >= 50 ? 100 : 0;
  applyBgLightness(v, hue);
}

let currentMainView = "home";
let mainViewsMounted = false;

function mountMainViews() {
  const pane = els.mainPane || document.getElementById("mainPane");
  if (!pane || mainViewsMounted) return;
  const ids = [
    "likesLayer",
    "diaryLayer",
    "playlistDetailLayer",
    "chatLayer",
    "wishLayer",
    "profileLayer",
    "settingsPanel",
    "seekEmojiLayer"
  ];
  ids.forEach((id) => {
    const node = document.getElementById(id);
    if (node && node.parentElement !== pane) pane.appendChild(node);
  });
  mainViewsMounted = true;
}

function syncNavActive(view) {
  document.querySelectorAll("[data-nav]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.nav === view);
  });
  els.settingsBtn?.classList.toggle("is-active", view === "settings");
  els.settingsBtn?.classList.toggle("is-open", view === "settings");
}

function closeEmbeddedView(el) {
  if (!el) return;
  el.hidden = true;
  el.classList.remove("is-open");
  el.setAttribute("aria-hidden", "true");
}

function openEmbeddedView(el) {
  if (!el) return;
  el.hidden = false;
  el.classList.add("is-open");
  el.setAttribute("aria-hidden", "false");
}

function setMainView(view = "home") {
  mountMainViews();
  const next = String(view || "home");
  currentMainView = next;

  closeEmbeddedView(els.likesLayer || document.getElementById("likesLayer"));
  closeEmbeddedView(document.getElementById("diaryLayer"));
  closeEmbeddedView(document.getElementById("playlistDetailLayer"));
  if (next !== "likes" && next !== "playlistDetail") playlistDetailState = null;
  closeEmbeddedView(els.chatLayer || document.getElementById("chatLayer"));
  closeEmbeddedView(document.getElementById("wishLayer"));
  closeEmbeddedView(els.profileLayer || document.getElementById("profileLayer"));
  closeEmbeddedView(els.settingsPanel || document.getElementById("settingsPanel"));
  closeEmbeddedView(document.getElementById("seekEmojiLayer"));

  if (next === "likes") {
    openLikesLayer();
  } else if (next === "diary") {
    openDiaryLayer();
  } else {
    if (els.viewHome) els.viewHome.hidden = next !== "home";
    if (next === "home") refreshMoodRadioCard();
  }

  if (next === "chat") {
    if (!window.LudongCloud?.enabled?.() || !window.LudongCloud?.isLoggedIn?.()) {
      setHint("请先登录后再使用私聊", true);
      currentMainView = "home";
      if (els.viewHome) els.viewHome.hidden = false;
      syncNavActive("home");
      return;
    }
    openChatLayer().catch(() => setMainView("home"));
  } else if (next === "wish") {
    setWishLayerOpen(true);
  } else if (next === "profile") {
    setProfileLayerOpen(true);
  } else if (next === "settings") {
    openEmbeddedView(els.settingsPanel || document.getElementById("settingsPanel"));
    refreshAccountLabel();
  }

  syncNavActive(currentMainView);
}

function isMenuOpen() {
  return currentMainView === "settings";
}

function setMenuOpen(on, view = "settings") {
  if (on) setMainView(view === "home" ? "settings" : view);
  else setMainView("home");
}

function setSettingsOpen(on) {
  setMainView(on ? "settings" : "home");
}

function setProfileLayerOpen(on) {
  const layer = els.profileLayer || document.getElementById("profileLayer");
  if (!layer) return;
  els.profileLayer = layer;
  if (on) {
    if (els.viewHome) els.viewHome.hidden = true;
    openEmbeddedView(layer);
    currentMainView = "profile";
    syncNavActive("profile");
    refreshProfileEditor().catch(() => {});
    setProfileStatus("");
    return;
  }
  closeEmbeddedView(layer);
  if (currentMainView === "profile") setMainView("home");
}

window.__ludongOnProfileOpened = () => {
  if (els.viewHome) els.viewHome.hidden = true;
  currentMainView = "profile";
  syncNavActive("profile");
  refreshProfileEditor().catch(() => {});
  setProfileStatus("");
};

window.__ludongOnProfileClosed = () => {
  if (currentMainView === "profile") setMainView("home");
};

function openProfileFromSettings(e) {
  e?.preventDefault?.();
  e?.stopPropagation?.();
  setMainView("profile");
}

els.profileBackBtn?.addEventListener("click", () => setMainView("home"));
els.profileBackdrop?.addEventListener("click", () => setMainView("home"));
els.menuSettingsBackBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  setMainView("home");
});

function bindNavRail() {
  const go = (view) => setMainView(view);
  els.navHomeBtn?.addEventListener("click", () => go("home"));
  els.navHomeBtn?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      go("home");
    }
  });
  els.navRail?.addEventListener("click", (e) => {
    const btn = e.target.closest?.("[data-nav]");
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    go(btn.dataset.nav || "home");
  });
}
bindNavRail();
mountMainViews();


document.getElementById("rankOpenBtn")?.addEventListener("click", (e) => {
  e.stopPropagation();
  setRankChartOpen(true);
});
document.getElementById("rankChartClose")?.addEventListener("click", () => setRankChartOpen(false));
document.getElementById("rankChartBackdrop")?.addEventListener("click", () => setRankChartOpen(false));
window.addEventListener("beforeunload", () => saveResume());

document.getElementById("bgHueRow")?.addEventListener("click", (e) => {
  const btn = e.target.closest?.("[data-bg-preset]");
  if (!btn) return;
  e.stopPropagation();
  const preset = btn.dataset.bgPreset;
  if (preset === "black") applyBgLightness(0, "neutral");
  else if (preset === "white") applyBgLightness(100, "neutral");
  else applyBgLightness(100, preset);
});

const SWITCH_ANIM_KEY = "ludong-switch-anim";
const UI_STYLE_KEY = "ludong-ui-style";
const SEEK_EMOJI_KEY = "ludong-seek-emoji"; // 旧键，仅作暂停表情迁移
const SEEK_EMOJI_PLAY_KEY = "ludong-seek-emoji-play";
const SEEK_EMOJI_PAUSE_KEY = "ludong-seek-emoji-pause";
const SEEK_EMOJI_DIR = "./emoji/seek/";
let uiStyle = "default";
let seekEmojiPlayId = "kaixin";
let seekEmojiPauseId = "momo";
let seekEmojiList = [
  { id: "momo", file: "momo.gif", label: "momo" },
  { id: "kaixin", file: "kaixin.gif", label: "开心" }
];

function seekEmojiUrl(id) {
  const item =
    seekEmojiList.find((x) => x.id === id) ||
    seekEmojiList.find((x) => x.id === "momo") ||
    seekEmojiList[0];
  return SEEK_EMOJI_DIR + (item?.file || "momo.gif");
}

function isAudioPlaying() {
  return !!(els.playBtn && els.playBtn.classList.contains("is-playing"));
}

function refreshSeekThumbGif() {
  if (!els.seekThumbGif) return;
  const id = isAudioPlaying() ? seekEmojiPlayId : seekEmojiPauseId;
  const url = seekEmojiUrl(id);
  const cur = els.seekThumbGif.getAttribute("src") || "";
  if (cur !== url) els.seekThumbGif.src = url;
}

let seekEmojiPickedId = "";

function seekEmojiLabel(id) {
  return seekEmojiList.find((x) => x.id === id)?.label || id || "—";
}

function normalizeSeekEmojiId(id, fallback) {
  if (seekEmojiList.some((x) => x.id === id)) return id;
  if (seekEmojiList.some((x) => x.id === fallback)) return fallback;
  return seekEmojiList[0]?.id || "momo";
}

function updateSeekEmojiSummary() {
  const el = document.getElementById("seekEmojiSummary");
  if (!el) return;
  el.textContent = `播放 ${seekEmojiLabel(seekEmojiPlayId)} · 暂停 ${seekEmojiLabel(
    seekEmojiPauseId
  )}`;
}

function updateSeekEmojiPreviews() {
  const playImg = document.getElementById("seekEmojiPlayPreview");
  const pauseImg = document.getElementById("seekEmojiPausePreview");
  if (playImg) playImg.src = seekEmojiUrl(seekEmojiPlayId);
  if (pauseImg) pauseImg.src = seekEmojiUrl(seekEmojiPauseId);
}

function setSeekEmojiStatus(text, kind = "") {
  const el = document.getElementById("seekEmojiStatus");
  if (!el) return;
  el.textContent = text || "";
  el.classList.toggle("is-error", kind === "error");
  el.classList.toggle("is-ok", kind === "ok");
}

function renderSeekEmojiGrid() {
  const grid = document.getElementById("seekEmojiGrid");
  if (!grid) return;
  if (!seekEmojiPickedId) {
    seekEmojiPickedId = isAudioPlaying() ? seekEmojiPlayId : seekEmojiPauseId;
  }
  grid.innerHTML = seekEmojiList
    .map((item) => {
      const on = item.id === seekEmojiPickedId ? " is-active" : "";
      const badge =
        item.id === seekEmojiPlayId && item.id === seekEmojiPauseId
          ? '<span class="seek-emoji-badge">播/停</span>'
          : item.id === seekEmojiPlayId
            ? '<span class="seek-emoji-badge">播放</span>'
            : item.id === seekEmojiPauseId
              ? '<span class="seek-emoji-badge">暂停</span>'
              : "";
      return `<button type="button" class="seek-emoji-cell${on}" data-seek-emoji="${escapeHtml(
        item.id
      )}" title="${escapeHtml(item.label)}" role="option" aria-selected="${
        item.id === seekEmojiPickedId ? "true" : "false"
      }">${badge}<img src="${SEEK_EMOJI_DIR}${escapeHtml(
        item.file
      )}" alt="${escapeHtml(item.label)}" draggable="false" /></button>`;
    })
    .join("");
}

function setSeekEmoji(kind, id, persist = true) {
  const next = normalizeSeekEmojiId(id, kind === "play" ? "kaixin" : "momo");
  if (kind === "play") seekEmojiPlayId = next;
  else seekEmojiPauseId = next;
  if (persist) {
    try {
      localStorage.setItem(
        kind === "play" ? SEEK_EMOJI_PLAY_KEY : SEEK_EMOJI_PAUSE_KEY,
        next
      );
    } catch {
      /* ignore */
    }
  }
  refreshSeekThumbGif();
  updateSeekEmojiSummary();
  updateSeekEmojiPreviews();
  renderSeekEmojiGrid();
}

function setSeekEmojiLayerOpen(on) {
  mountMainViews();
  const layer = document.getElementById("seekEmojiLayer");
  if (!layer) return;
  const open = !!on;
  layer.hidden = !open;
  layer.classList.toggle("is-open", open);
  layer.setAttribute("aria-hidden", open ? "false" : "true");
  if (open) {
    if (els.viewHome) els.viewHome.hidden = true;
    seekEmojiPickedId = isAudioPlaying() ? seekEmojiPlayId : seekEmojiPauseId;
    updateSeekEmojiPreviews();
    renderSeekEmojiGrid();
    setSeekEmojiStatus("");
  } else {
    setMainView("settings");
  }
}

function bindSeekEmojiPage() {
  document.getElementById("seekEmojiOpenBtn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    setSeekEmojiLayerOpen(true);
  });
  document.getElementById("seekEmojiBackBtn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    setSeekEmojiLayerOpen(false);
  });
  document.getElementById("seekEmojiBackdrop")?.addEventListener("click", () => {
    setSeekEmojiLayerOpen(false);
  });
  const grid = document.getElementById("seekEmojiGrid");
  if (grid && !grid.dataset.bound) {
    grid.dataset.bound = "1";
    grid.addEventListener("click", (e) => {
      const btn = e.target.closest?.("[data-seek-emoji]");
      if (!btn) return;
      e.stopPropagation();
      seekEmojiPickedId = btn.dataset.seekEmoji || "";
      renderSeekEmojiGrid();
      setSeekEmojiStatus(`已选中：${seekEmojiLabel(seekEmojiPickedId)}`);
    });
  }
  document.getElementById("seekEmojiSetPlayBtn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!seekEmojiPickedId) {
      setSeekEmojiStatus("请先点选一个表情", "error");
      return;
    }
    setSeekEmoji("play", seekEmojiPickedId, true);
    setSeekEmojiStatus(`已设为播放：${seekEmojiLabel(seekEmojiPlayId)}`, "ok");
  });
  document.getElementById("seekEmojiSetPauseBtn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!seekEmojiPickedId) {
      setSeekEmojiStatus("请先点选一个表情", "error");
      return;
    }
    setSeekEmoji("pause", seekEmojiPickedId, true);
    setSeekEmojiStatus(`已设为暂停：${seekEmojiLabel(seekEmojiPauseId)}`, "ok");
  });
}

async function loadSeekEmojiPicker() {
  try {
    const res = await fetch(`${SEEK_EMOJI_DIR}manifest.json`, { cache: "no-store" });
    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length) {
        seekEmojiList = rows
          .map((row) => ({
            id: String(row.id || "").trim(),
            file: String(row.file || "").trim(),
            label: String(row.label || row.id || "").trim() || "表情"
          }))
          .filter((row) => row.id && row.file);
      }
    }
  } catch {
    /* keep fallback list */
  }

  let playId = "kaixin";
  let pauseId = "momo";
  try {
    playId = localStorage.getItem(SEEK_EMOJI_PLAY_KEY) || "";
    pauseId = localStorage.getItem(SEEK_EMOJI_PAUSE_KEY) || "";
    const legacy = localStorage.getItem(SEEK_EMOJI_KEY) || "";
    if (!pauseId && legacy) pauseId = legacy;
    if (!playId) playId = "kaixin";
    if (!pauseId) pauseId = "momo";
  } catch {
    playId = "kaixin";
    pauseId = "momo";
  }

  seekEmojiPlayId = normalizeSeekEmojiId(playId, "kaixin");
  seekEmojiPauseId = normalizeSeekEmojiId(pauseId, "momo");
  seekEmojiPickedId = seekEmojiPauseId;
  try {
    localStorage.setItem(SEEK_EMOJI_PLAY_KEY, seekEmojiPlayId);
    localStorage.setItem(SEEK_EMOJI_PAUSE_KEY, seekEmojiPauseId);
  } catch {
    /* ignore */
  }

  updateSeekEmojiSummary();
  updateSeekEmojiPreviews();
  refreshSeekThumbGif();
  bindSeekEmojiPage();
}

function syncSwitchAnimButtons() {
  document.querySelectorAll("[data-switch-anim]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.switchAnim === switchAnim);
  });
}

function setSwitchAnim(mode) {
  switchAnim = mode === "off" || mode === "fade" ? mode : "flip";
  try {
    localStorage.setItem(SWITCH_ANIM_KEY, switchAnim);
  } catch {
    /* ignore */
  }
  syncSwitchAnimButtons();
}

function loadSwitchAnim() {
  try {
    const raw = localStorage.getItem(SWITCH_ANIM_KEY) || "flip";
    switchAnim = raw === "off" || raw === "fade" ? raw : "flip";
  } catch {
    switchAnim = "flip";
  }
  syncSwitchAnimButtons();
}

document.getElementById("switchAnimRow")?.addEventListener("click", (e) => {
  const btn = e.target.closest?.("[data-switch-anim]");
  if (!btn) return;
  e.stopPropagation();
  setSwitchAnim(btn.dataset.switchAnim);
});

function syncUiStyleButtons() {
  document.querySelectorAll("[data-ui-style]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.uiStyle === uiStyle);
  });
}

function applyUiStyle(style, persist = true) {
  uiStyle = style === "manga" ? "manga" : "default";
  document.documentElement.classList.toggle("theme-manga", uiStyle === "manga");
  document.body?.classList.toggle("theme-manga", uiStyle === "manga");
  if (persist) {
    try {
      localStorage.setItem(UI_STYLE_KEY, uiStyle);
    } catch {
      /* ignore */
    }
  }
  syncUiStyleButtons();
  if (uiStyle === "manga") {
    applyMangaInkVars();
    ensureSeekPanels();
    syncSeekPanels(seekPercent);
  } else {
    applyBgLightness(Math.round((bgLight || 0) * 100), bgHue);
  }
  try {
    const song = playlist[currentIndex];
    const src =
      (showLyrics && song && (song.lyricsCoverUrl || song.cover)) ||
      song?.cover ||
      els.cover?.currentSrc ||
      els.cover?.src ||
      "";
    if (src) applyPlayerAtmosphere(src);
    else if (uiStyle !== "manga") clearPlayerAtmosphere();
  } catch {
    /* ignore */
  }
}

function loadUiStyle() {
  try {
    const raw = localStorage.getItem(UI_STYLE_KEY) || "default";
    uiStyle = raw === "manga" ? "manga" : "default";
  } catch {
    uiStyle = "default";
  }
  applyUiStyle(uiStyle, false);
}

document.getElementById("uiStyleRow")?.addEventListener("click", (e) => {
  const btn = e.target.closest?.("[data-ui-style]");
  if (!btn) return;
  e.stopPropagation();
  applyUiStyle(btn.dataset.uiStyle);
});

function queueText(value) {
  return String(value || "").replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
}

function renderPlayerQueue() {
  const panel = document.getElementById("playerQueue");
  const list = document.getElementById("playerQueueList");
  if (!panel || panel.hidden || !list) return;
  const queue = currentPlayQueue();
  if (!queue.length) {
    list.innerHTML = '<li class="player-queue-empty">暂无歌曲</li>';
    return;
  }
  const currentId = String(playlist[currentIndex]?.id || "");
  list.innerHTML = queue
    .map((song) => {
      const current = String(song.id) === currentId ? " is-current" : "";
      return `<li><button type="button" class="player-queue-item${current}" data-queue-id="${queueText(song.id)}"><span>${queueText(song.title)}</span><small>${queueText(song.artist)}</small></button></li>`;
    })
    .join("");
  list.querySelector(".is-current")?.scrollIntoView({ block: "nearest" });
}

function setPlayerQueueOpen(on) {
  const panel = document.getElementById("playerQueue");
  if (!panel) return;
  panel.hidden = !on;
  if (on) renderPlayerQueue();
}

document.getElementById("playerQueueBtn")?.addEventListener("click", (e) => {
  e.stopPropagation();
  const panel = document.getElementById("playerQueue");
  setPlayerQueueOpen(panel?.hidden !== false);
});

document.getElementById("playerQueueClose")?.addEventListener("click", (e) => {
  e.stopPropagation();
  setPlayerQueueOpen(false);
});

document.getElementById("playerQueueList")?.addEventListener("click", (e) => {
  const btn = e.target.closest?.("[data-queue-id]");
  if (!btn) return;
  e.stopPropagation();
  const song = songByQueueId(btn.dataset.queueId || "");
  const index = indexInPlaylist(song);
  if (index >= 0) playAt(index);
});

let listenTogetherTimer = 0;
let listenTogetherClockTimer = 0;
let listenTogetherActive = null;
let listenTogetherPending = [];
let listenTogetherShownInviteId = "";
let listenTogetherApplying = false;
let listenTogetherLastPushAt = 0;
let listenTogetherFriendCache = [];
let listenTogetherLastSeekSeq = -1;
let listenTogetherLastPlaying = null;
let listenTogetherClockOwner = "";
let listenTogetherMuteUntil = 0;
let listenTogetherStartedAtMs = 0;
let listenTogetherClockSessionId = "";

function clearListenTogetherLocal() {
  listenTogetherActive = null;
  listenTogetherPending = [];
  listenTogetherShownInviteId = "";
  listenTogetherLastSeekSeq = -1;
  listenTogetherLastPlaying = null;
  listenTogetherClockOwner = "";
  listenTogetherMuteUntil = 0;
  listenTogetherFriendCache = [];
  listenTogetherStartedAtMs = 0;
  listenTogetherClockSessionId = "";
  stopListenTogetherClock();
  const bar = document.getElementById("listenTogetherBar");
  if (bar) bar.hidden = true;
  document.getElementById("listenTogetherBtn")?.classList.remove("is-on");
  const inviteLayer = document.getElementById("listenTogetherInviteLayer");
  if (inviteLayer) {
    inviteLayer.hidden = true;
    inviteLayer.setAttribute("aria-hidden", "true");
  }
  const pick = document.getElementById("listenTogetherPickLayer");
  if (pick) pick.hidden = true;
}

function stopListenTogetherClock() {
  if (listenTogetherClockTimer) {
    clearInterval(listenTogetherClockTimer);
    listenTogetherClockTimer = 0;
  }
}

function formatListenTogetherElapsed(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function listenTogetherAvatarOf(userId) {
  const me = window.LudongCloud?.getActiveUserId?.() || "";
  if (userId && userId === me) {
    return els.navAvatar?.src || window.LudongCloud?.getAvatar?.() || "./logo.jpg";
  }
  const hit = listenTogetherFriendCache.find((f) => f.id === userId);
  return hit?.avatarUrl || "./logo.jpg";
}

function syncListenTogetherClock() {
  const el = document.getElementById("listenTogetherTime");
  if (!el) return;
  if (!listenTogetherActive || !listenTogetherStartedAtMs) {
    el.textContent = "已一起听 00:00";
    return;
  }
  el.textContent = `已一起听 ${formatListenTogetherElapsed(Date.now() - listenTogetherStartedAtMs)}`;
}

function startListenTogetherClock(session) {
  const id = String(session?.id || "");
  const fromServer = Date.parse(session?.startedAt || "");
  if (fromServer) {
    listenTogetherStartedAtMs = fromServer;
  } else if (!listenTogetherStartedAtMs || listenTogetherClockSessionId !== id) {
    listenTogetherStartedAtMs = Date.parse(session?.updatedAt || "") || Date.now();
  }
  listenTogetherClockSessionId = id;
  stopListenTogetherClock();
  syncListenTogetherClock();
  listenTogetherClockTimer = setInterval(syncListenTogetherClock, 1000);
}

function stopListenTogetherPoll() {
  if (listenTogetherTimer) {
    clearInterval(listenTogetherTimer);
    listenTogetherTimer = 0;
  }
}

function startListenTogetherPoll() {
  stopListenTogetherPoll();
  if (!window.LudongCloud?.enabled?.() || !window.LudongCloud?.isLoggedIn?.()) return;
  refreshListenTogetherInbox().catch(() => {});
  listenTogetherTimer = setInterval(() => {
    refreshListenTogetherInbox().catch(() => {});
  }, 1400);
}

function listenTogetherPeerName(session) {
  const me = window.LudongCloud?.getActiveUserId?.() || "";
  const peerId = me && session?.hostId === me ? session.guestId : session?.hostId;
  const hit = listenTogetherFriendCache.find((f) => f.id === peerId);
  return hit?.remark || hit?.name || "好友";
}

function updateListenTogetherBar() {
  const bar = document.getElementById("listenTogetherBar");
  const text = document.getElementById("listenTogetherBarText");
  const btn = document.getElementById("listenTogetherBtn");
  const avatarA = document.getElementById("listenTogetherAvatarA");
  const avatarB = document.getElementById("listenTogetherAvatarB");
  const active = listenTogetherActive;
  const me = window.LudongCloud?.getActiveUserId?.() || "";
  if (btn) {
    btn.classList.toggle(
      "is-on",
      !!(active || listenTogetherPending.some((s) => s.hostId === me))
    );
  }
  if (!bar || !text) return;
  if (!active) {
    bar.hidden = true;
    stopListenTogetherClock();
    listenTogetherStartedAtMs = 0;
    return;
  }
  bar.hidden = false;
  text.textContent = `和 ${listenTogetherPeerName(active)} · ${active.songTitle || "歌曲"}`;
  if (avatarA) avatarA.src = listenTogetherAvatarOf(active.hostId);
  if (avatarB) avatarB.src = listenTogetherAvatarOf(active.guestId);
  startListenTogetherClock(active);
  restoreListenTogetherChipPos();
  bindListenTogetherChipDrag();
}

async function ensureListenTogetherSong(session) {
  if (!session?.audioUrl) throw new Error("邀请里没有可播放地址");
  const key = session.songKey || (session.cloudSongId ? `cloud-${session.cloudSongId}` : `lt-${session.id}`);
  let idx = playlist.findIndex(
    (s) =>
      String(s.id) === key ||
      (session.cloudSongId && String(s.cloudId || "") === String(session.cloudSongId))
  );
  if (idx < 0) {
    const song = {
      id: key,
      cloudId: session.cloudSongId || "",
      title: session.songTitle || "未命名",
      artist: session.songArtist || "未知歌手",
      cover: session.songCover || "./logo.jpg",
      url: session.audioUrl,
      cloud: !!session.cloudSongId,
      local: false,
      duration: 0,
      listenTogether: true
    };
    playlist.push(song);
    idx = playlist.length - 1;
  } else if (!playlist[idx].url) {
    playlist[idx].url = session.audioUrl;
  }
  return idx;
}

function listenTogetherLocalPlaying() {
  return !audio.paused && !mvReady();
}

function softSeekListenTogether(targetSec) {
  if (!Number.isFinite(targetSec)) return false;
  const next = Math.max(0, targetSec);
  try {
    if (Math.abs((audio.currentTime || 0) - next) < 0.12) return false;
    audio.currentTime = next;
    return true;
  } catch {
    return false;
  }
}

async function applyListenTogetherSession(session, { forceSeek = false } = {}) {
  if (!session || session.status !== "active") return;
  const me = window.LudongCloud?.getActiveUserId?.() || "";
  if (Date.now() < listenTogetherMuteUntil && session.updatedBy === me) {
    listenTogetherActive = session;
    listenTogetherLastPlaying = session.playing;
    listenTogetherLastSeekSeq = session.seekSeq;
    updateListenTogetherBar();
    return;
  }
  if (session.updatedBy && session.updatedBy === me && !forceSeek) {
    listenTogetherActive = session;
    listenTogetherLastPlaying = session.playing;
    listenTogetherLastSeekSeq = session.seekSeq;
    if (session.updatedBy) listenTogetherClockOwner = session.updatedBy;
    updateListenTogetherBar();
    return;
  }
  const prev = listenTogetherActive;
  const songChanged =
    !prev ||
    session.songKey !== prev.songKey ||
    session.cloudSongId !== prev.cloudSongId;
  const seekBumped = forceSeek || session.seekSeq !== listenTogetherLastSeekSeq;
  const playChanged =
    listenTogetherLastPlaying === null
      ? session.playing !== listenTogetherLocalPlaying()
      : session.playing !== listenTogetherLastPlaying;
  const target = (session.positionMs || 0) / 1000;
  const drift = Math.abs((audio.currentTime || 0) - target);

  listenTogetherApplying = true;
  listenTogetherMuteUntil = Date.now() + 700;
  try {
    const idx = await ensureListenTogetherSong(session);
    const cur = playlist[currentIndex];
    const same =
      cur &&
      (String(cur.id) === String(playlist[idx].id) ||
        (session.cloudSongId && String(cur.cloudId || "") === String(session.cloudSongId)));
    if (!same || songChanged) {
      await playAt(idx);
      softSeekListenTogether(target);
      listenTogetherLastSeekSeq = session.seekSeq;
    } else if (seekBumped) {
      softSeekListenTogether(target);
      listenTogetherLastSeekSeq = session.seekSeq;
    } else if (playChanged) {
      // 播放/暂停优先对齐，只有明显错拍才拉进度，避免来回顿
      if (drift > 0.85) softSeekListenTogether(target + (session.playing ? 0.12 : 0));
    } else if (session.playing && listenTogetherLocalPlaying() && drift > 2.8) {
      // 心跳校正：偏差大才轻轻对齐一次
      softSeekListenTogether(target + 0.18);
    }

    if (session.playing) {
      if (audio.paused) await audio.play().catch(() => {});
      setPlaying(true);
    } else if (!audio.paused) {
      audio.pause();
      setPlaying(false);
    }

    listenTogetherActive = session;
    listenTogetherLastPlaying = session.playing;
    listenTogetherLastSeekSeq = session.seekSeq;
    if (session.updatedBy) listenTogetherClockOwner = session.updatedBy;
    updateListenTogetherBar();
  } finally {
    window.setTimeout(() => {
      listenTogetherApplying = false;
    }, 280);
  }
}

async function pushListenTogetherPlayback({ bumpSeek = false, transport = false, heartbeat = false } = {}) {
  const session = listenTogetherActive;
  if (!session || session.status !== "active" || listenTogetherApplying) return;
  if (!window.LudongCloud?.pushListenTogetherState) return;
  const me = window.LudongCloud?.getActiveUserId?.() || "";
  const now = Date.now();
  if (heartbeat) {
    const leader = listenTogetherClockOwner || session.hostId;
    if (me && leader && me !== leader) return;
    if (now - listenTogetherLastPushAt < 7000) return;
  } else if (!bumpSeek && !transport && now - listenTogetherLastPushAt < 900) {
    return;
  } else if (transport && now - listenTogetherLastPushAt < 180) {
    return;
  }
  listenTogetherLastPushAt = now;
  if (transport || bumpSeek) listenTogetherClockOwner = me;
  listenTogetherMuteUntil = now + 900;
  const playing = listenTogetherLocalPlaying();
  listenTogetherLastPlaying = playing;
  try {
    const next = await window.LudongCloud.pushListenTogetherState(session.id, {
      playing,
      positionMs: Math.round((audio.currentTime || 0) * 1000),
      bumpSeek,
      seekSeq: session.seekSeq
    });
    if (next) {
      listenTogetherActive = next;
      listenTogetherLastSeekSeq = next.seekSeq;
      listenTogetherLastPlaying = next.playing;
      if (next.updatedBy) listenTogetherClockOwner = next.updatedBy;
      updateListenTogetherBar();
    }
  } catch {
    /* 同步失败不打断本地播放 */
  }
}

async function pushListenTogetherSongChange(song) {
  const session = listenTogetherActive;
  if (!session || session.status !== "active" || listenTogetherApplying) return;
  if (!window.LudongCloud?.pushListenTogetherState) return;
  if (!song?.cloud || !song.cloudId) {
    setHint("一起听切歌请用云端歌曲，对方才能跟着听", true);
    return;
  }
  const audioUrl = (await resolvePlayUrl(song)) || song.url || "";
  if (!audioUrl || String(audioUrl).startsWith("blob:")) {
    setHint("这首歌没有可同步的地址", true);
    return;
  }
  const me = window.LudongCloud?.getActiveUserId?.() || "";
  listenTogetherLastPushAt = Date.now();
  listenTogetherClockOwner = me;
  listenTogetherMuteUntil = Date.now() + 1200;
  listenTogetherLastPlaying = true;
  try {
    const next = await window.LudongCloud.pushListenTogetherState(session.id, {
      songKey: song.id,
      cloudSongId: song.cloudId,
      songTitle: song.title,
      songArtist: song.artist,
      songCover: song.cover,
      audioUrl,
      playing: true,
      positionMs: 0,
      bumpSeek: true,
      seekSeq: session.seekSeq
    });
    if (next) {
      listenTogetherActive = next;
      listenTogetherLastSeekSeq = next.seekSeq;
      listenTogetherLastPlaying = next.playing;
      updateListenTogetherBar();
    }
  } catch (err) {
    setHint(err?.message || "切歌同步失败", true);
  }
}

const LISTEN_TOGETHER_POS_KEY = "ludong-listen-together-pos-v1";

function clampListenTogetherChip(chip, left, top) {
  const board = chip.offsetParent || chip.parentElement;
  const boardW = board?.clientWidth || window.innerWidth;
  const boardH = board?.clientHeight || window.innerHeight;
  const w = chip.offsetWidth || 220;
  const h = chip.offsetHeight || 48;
  return {
    left: Math.max(8, Math.min(left, boardW - w - 8)),
    top: Math.max(8, Math.min(top, boardH - h - 8))
  };
}

function restoreListenTogetherChipPos() {
  const chip = document.getElementById("listenTogetherBar");
  if (!chip) return;
  try {
    const raw = JSON.parse(localStorage.getItem(LISTEN_TOGETHER_POS_KEY) || "null");
    if (!raw || !Number.isFinite(raw.left) || !Number.isFinite(raw.top)) return;
    const pos = clampListenTogetherChip(chip, raw.left, raw.top);
    chip.style.left = `${pos.left}px`;
    chip.style.top = `${pos.top}px`;
    chip.style.right = "auto";
  } catch {
    /* ignore */
  }
}

function bindListenTogetherChipDrag() {
  const chip = document.getElementById("listenTogetherBar");
  if (!chip || chip.dataset.dragBound === "1") return;
  chip.dataset.dragBound = "1";
  let dragging = false;
  let moved = false;
  let grabX = 0;
  let grabY = 0;
  chip.addEventListener("pointerdown", (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    if (e.target.closest?.("button")) return;
    const board = chip.offsetParent || chip.parentElement;
    if (!board) return;
    const chipRect = chip.getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();
    dragging = true;
    moved = false;
    grabX = e.clientX - chipRect.left;
    grabY = e.clientY - chipRect.top;
    chip.classList.add("is-dragging");
    chip.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  });
  chip.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const board = chip.offsetParent || chip.parentElement;
    if (!board) return;
    const boardRect = board.getBoundingClientRect();
    const left = e.clientX - boardRect.left - grabX;
    const top = e.clientY - boardRect.top - grabY;
    const pos = clampListenTogetherChip(chip, left, top);
    if (Math.abs(pos.left - (parseFloat(chip.style.left) || 0)) > 1 || Math.abs(pos.top - (parseFloat(chip.style.top) || 0)) > 1) {
      moved = true;
    }
    chip.style.left = `${pos.left}px`;
    chip.style.top = `${pos.top}px`;
    chip.style.right = "auto";
  });
  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    chip.classList.remove("is-dragging");
    try {
      chip.releasePointerCapture?.(e.pointerId);
    } catch {
      /* ignore */
    }
    if (!moved) return;
    try {
      localStorage.setItem(
        LISTEN_TOGETHER_POS_KEY,
        JSON.stringify({
          left: parseFloat(chip.style.left) || 0,
          top: parseFloat(chip.style.top) || 0
        })
      );
    } catch {
      /* ignore */
    }
  };
  chip.addEventListener("pointerup", endDrag);
  chip.addEventListener("pointercancel", endDrag);
}

function showListenTogetherInvite(session) {
  const layer = document.getElementById("listenTogetherInviteLayer");
  const msg = document.getElementById("listenTogetherInviteMsg");
  if (!layer || !msg || !session) return;
  listenTogetherShownInviteId = session.id;
  const host = listenTogetherFriendCache.find((f) => f.id === session.hostId);
  const hostName = host?.remark || host?.name || "好友";
  msg.textContent = `${hostName} 邀请你一起听「${session.songTitle || "歌曲"}」${
    session.songArtist ? ` · ${session.songArtist}` : ""
  }`;
  layer.hidden = false;
  layer.setAttribute("aria-hidden", "false");
}

function hideListenTogetherInvite() {
  const layer = document.getElementById("listenTogetherInviteLayer");
  if (!layer) return;
  layer.hidden = true;
  layer.setAttribute("aria-hidden", "true");
}

async function refreshListenTogetherInbox() {
  if (!window.LudongCloud?.listListenTogetherSessions) return;
  if (!window.LudongCloud?.isLoggedIn?.()) return;
  const me = window.LudongCloud.getActiveUserId?.() || "";
  if (!me) return;
  if (!listenTogetherFriendCache.length && window.LudongCloud.listFriends) {
    try {
      listenTogetherFriendCache = await window.LudongCloud.listFriends();
    } catch {
      listenTogetherFriendCache = [];
    }
  }
  const rows = await window.LudongCloud.listListenTogetherSessions();
  const pendingToMe = rows.filter((s) => s.status === "pending" && s.guestId === me);
  const pendingFromMe = rows.filter((s) => s.status === "pending" && s.hostId === me);
  const active = rows.find((s) => s.status === "active") || null;
  listenTogetherPending = [...pendingFromMe, ...pendingToMe];
  if (active) {
    const prev = listenTogetherActive;
    const songChanged = !prev || active.songKey !== prev.songKey || active.cloudSongId !== prev.cloudSongId;
    const changed =
      songChanged ||
      active.id !== prev?.id ||
      active.seekSeq !== prev?.seekSeq ||
      active.playing !== prev?.playing ||
      Math.abs((active.positionMs || 0) - (prev?.positionMs || 0)) > 1200;
    if (changed && active.updatedBy !== me) {
      await applyListenTogetherSession(active, {
        forceSeek: songChanged || !prev || active.seekSeq !== listenTogetherLastSeekSeq
      });
    } else {
      listenTogetherActive = active;
      updateListenTogetherBar();
    }
  } else if (listenTogetherActive) {
    listenTogetherActive = null;
    listenTogetherLastSeekSeq = -1;
    updateListenTogetherBar();
  } else {
    updateListenTogetherBar();
  }
  const invite = pendingToMe[0];
  if (invite) {
    if (listenTogetherShownInviteId !== invite.id) showListenTogetherInvite(invite);
  } else if (listenTogetherShownInviteId) {
    listenTogetherShownInviteId = "";
    hideListenTogetherInvite();
  }
  const pick = document.getElementById("listenTogetherPickLayer");
  if (pick && !pick.hidden) renderListenTogetherFriendList();
}

async function buildListenTogetherSongPayload() {
  const song = playlist[currentIndex];
  if (!song) throw new Error("请先选一首歌");
  if (!song.cloud || !song.cloudId) {
    throw new Error("一起听目前只支持云端歌曲");
  }
  const audioUrl = (await resolvePlayUrl(song)) || song.url || "";
  if (!audioUrl || audioUrl.startsWith("blob:")) {
    throw new Error("这首歌没有可分享给好友的地址");
  }
  return {
    id: song.id,
    songKey: song.id,
    cloudSongId: song.cloudId,
    cloudId: song.cloudId,
    title: song.title,
    artist: song.artist,
    cover: song.cover,
    audioUrl,
    url: audioUrl,
    playing: !audio.paused && !mvReady(),
    positionMs: Math.round((audio.currentTime || 0) * 1000)
  };
}

function renderListenTogetherFriendList() {
  const list = document.getElementById("listenTogetherPickList");
  const note = document.getElementById("listenTogetherPickNote");
  if (!list) return;
  const me = window.LudongCloud?.getActiveUserId?.() || "";
  const friends = listenTogetherFriendCache || [];
  if (note) {
    note.textContent = friends.length
      ? "点邀请发送，点取消可收回；对方同意后开始同步"
      : "还没有好友，先去私聊里加好友";
  }
  if (!friends.length) {
    list.innerHTML = `<div class="playlist-empty">暂无好友</div>`;
    return;
  }
  list.innerHTML = friends
    .map((f) => {
      const pending = listenTogetherPending.find((s) => s.hostId === me && s.guestId === f.id);
      const active =
        listenTogetherActive &&
        ((listenTogetherActive.hostId === me && listenTogetherActive.guestId === f.id) ||
          (listenTogetherActive.guestId === me && listenTogetherActive.hostId === f.id));
      let action = "邀请";
      let kind = "invite";
      if (active) {
        action = "进行中";
        kind = "busy";
      } else if (pending) {
        action = "取消";
        kind = "cancel";
      }
      const name = escapeHtml(f.remark || f.name || "好友");
      const sub = escapeHtml(f.userNoLabel || f.userNo || "");
      return `<div class="listen-together-friend" data-friend-id="${escapeHtml(f.id)}">
        <img src="${escapeHtml(f.avatarUrl || "./logo.jpg")}" alt="" />
        <span class="listen-together-friend-meta">
          <span class="listen-together-friend-name">${name}</span>
          <span class="listen-together-friend-sub">${sub || "好友"}</span>
        </span>
        <button type="button" class="listen-together-friend-action${
          kind === "cancel" ? " is-cancel" : kind === "busy" ? " is-busy" : ""
        }" data-lt-action="${kind}" data-friend-id="${escapeHtml(f.id)}" ${
        kind === "busy" ? "disabled" : ""
      }>${action}</button>
      </div>`;
    })
    .join("");
}

async function openListenTogetherPicker() {
  if (!window.LudongCloud?.enabled?.() || !window.LudongCloud?.isLoggedIn?.()) {
    setHint("登录后才能一起听", true);
    return;
  }
  try {
    await buildListenTogetherSongPayload();
  } catch (err) {
    setHint(err?.message || "当前歌曲不能一起听", true);
    return;
  }
  try {
    listenTogetherFriendCache = (await window.LudongCloud.listFriends()) || [];
  } catch (err) {
    setHint(err?.message || "好友列表加载失败", true);
    return;
  }
  await refreshListenTogetherInbox().catch(() => {});
  renderListenTogetherFriendList();
  const layer = document.getElementById("listenTogetherPickLayer");
  if (layer) layer.hidden = false;
}

document.getElementById("listenTogetherBtn")?.addEventListener("click", (e) => {
  e.stopPropagation();
  openListenTogetherPicker().catch((err) => setHint(err?.message || "打不开一起听", true));
});

document.getElementById("listenTogetherPickCancel")?.addEventListener("click", () => {
  const layer = document.getElementById("listenTogetherPickLayer");
  if (layer) layer.hidden = true;
});

document.getElementById("listenTogetherPickList")?.addEventListener("click", async (e) => {
  const btn = e.target.closest?.("[data-lt-action]");
  if (!btn || btn.disabled) return;
  e.stopPropagation();
  const friendId = btn.dataset.friendId || "";
  const action = btn.dataset.ltAction || "";
  const me = window.LudongCloud?.getActiveUserId?.() || "";
  try {
    if (action === "invite") {
      const payload = await buildListenTogetherSongPayload();
      await window.LudongCloud.inviteListenTogether(friendId, payload);
      setHint("已发送一起听邀请");
    } else if (action === "cancel") {
      const pending = listenTogetherPending.find((s) => s.hostId === me && s.guestId === friendId);
      if (pending) await window.LudongCloud.cancelListenTogether(pending.id);
      setHint("已取消邀请");
    }
    await refreshListenTogetherInbox();
    renderListenTogetherFriendList();
  } catch (err) {
    setHint(err?.message || "操作失败", true);
  }
});

document.getElementById("listenTogetherEndBtn")?.addEventListener("click", async () => {
  const session = listenTogetherActive;
  if (!session) return;
  try {
    await window.LudongCloud.cancelListenTogether(session.id);
    listenTogetherActive = null;
    updateListenTogetherBar();
    setHint("已结束一起听");
    await refreshListenTogetherInbox();
  } catch (err) {
    setHint(err?.message || "结束失败", true);
  }
});

document.getElementById("listenTogetherAcceptBtn")?.addEventListener("click", async () => {
  const id = listenTogetherShownInviteId;
  if (!id) return;
  try {
    const session = await window.LudongCloud.respondListenTogether(id, true);
    hideListenTogetherInvite();
    listenTogetherShownInviteId = "";
    if (session) await applyListenTogetherSession(session, { forceSeek: true });
    setHint("已开始一起听");
    await refreshListenTogetherInbox();
  } catch (err) {
    setHint(err?.message || "接受失败", true);
  }
});

document.getElementById("listenTogetherRejectBtn")?.addEventListener("click", async () => {
  const id = listenTogetherShownInviteId;
  if (!id) return;
  try {
    await window.LudongCloud.respondListenTogether(id, false);
    hideListenTogetherInvite();
    listenTogetherShownInviteId = "";
    setHint("已拒绝一起听");
    await refreshListenTogetherInbox();
  } catch (err) {
    setHint(err?.message || "拒绝失败", true);
  }
});

document.getElementById("listenTogetherInviteBackdrop")?.addEventListener("click", () => {
  /* 点遮罩不自动拒绝，避免误触 */
});

let wishTab = "open";
let wishRows = [];

function parseWishText(raw) {
  const text = String(raw || "").trim();
  const parts = text.split(/\s*[-—–－]\s*/);
  if (parts.length < 2) return null;
  const title = parts[0].trim();
  const artist = parts.slice(1).join("-").trim();
  if (!title || !artist) return null;
  return { title, artist };
}

function cloudHasWishSong(title, artist) {
  const cloud = window.LudongCloud;
  const match = cloud?.wishMatchesSong;
  if (!match) return false;
  return playlist.some(
    (song) => song.scope === "cloud" && match(title, artist, song.title, song.artist)
  );
}

function setWishStatus(text, kind = "") {
  const el = document.getElementById("wishStatus");
  if (!el) return;
  el.textContent = text || "";
  el.classList.toggle("is-error", kind === "error");
  el.classList.toggle("is-ok", kind === "ok");
}

function renderWishList() {
  const list = document.getElementById("wishList");
  const page = document.querySelector(".wish-page");
  if (!list) return;
  page?.classList.toggle("is-done", wishTab === "done");
  document.querySelectorAll("[data-wish-tab]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.wishTab === wishTab);
  });
  const rows = wishRows.filter((row) =>
    wishTab === "done" ? row.status === "done" : row.status !== "done"
  );
  if (!rows.length) {
    list.innerHTML = `<li class="wish-empty">${
      wishTab === "done" ? "还没有完成的心愿" : "还没有想听的歌"
    }</li>`;
    return;
  }
  list.innerHTML = rows
    .map((row) => {
      const who = escapeHtml(row.author_name || "用户");
      const title = escapeHtml(row.title || "");
      const artist = escapeHtml(row.artist || "");
      return `<li class="wish-item">
        <div class="wish-item-title">${title} - ${artist}</div>
        <div class="wish-item-meta">${who}${wishTab === "done" ? " · 已完成" : ""}</div>
      </li>`;
    })
    .join("");
}

async function refreshWishes() {
  const cloud = window.LudongCloud;
  if (!cloud?.listSongWishes) throw new Error("心愿单还没接上");
  wishRows = cloud.syncOpenWishes
    ? await cloud.syncOpenWishes()
    : await cloud.listSongWishes();
  renderWishList();
}

function setWishLayerOpen(on) {
  mountMainViews();
  const layer = document.getElementById("wishLayer");
  if (!layer) return;
  const open = !!on;
  layer.hidden = !open;
  layer.classList.toggle("is-open", open);
  layer.setAttribute("aria-hidden", open ? "false" : "true");
  if (open) {
    if (els.viewHome) els.viewHome.hidden = true;
    currentMainView = "wish";
    syncNavActive("wish");
    setWishStatus("");
    refreshWishes().catch((err) => {
      wishRows = [];
      renderWishList();
      setWishStatus(err?.message || "心愿单打不开", "error");
    });
  } else if (currentMainView === "wish") {
    currentMainView = "home";
    if (els.viewHome) els.viewHome.hidden = false;
    syncNavActive("home");
  }
}

function bindWishPage() {
  document.getElementById("wishBackBtn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    setMainView("home");
  });
  document.getElementById("wishBackdrop")?.addEventListener("click", () => {
    setMainView("home");
  });
  document.querySelectorAll("[data-wish-tab]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      wishTab = btn.dataset.wishTab === "done" ? "done" : "open";
      setWishStatus("");
      renderWishList();
    });
  });
  document.getElementById("wishForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = document.getElementById("wishInput");
    const parsed = parseWishText(input?.value || "");
    if (!parsed) {
      setWishStatus("请按「歌曲-歌手」填写", "error");
      return;
    }
    if (cloudHasWishSong(parsed.title, parsed.artist)) {
      setWishStatus("曲库里已经有这首歌", "error");
      return;
    }
    const cloud = window.LudongCloud;
    if (!cloud?.addSongWish) {
      setWishStatus("心愿单还没接上", "error");
      return;
    }
    const btn = document.getElementById("wishSubmitBtn");
    if (btn) btn.disabled = true;
    try {
      await cloud.addSongWish(parsed);
      if (input) input.value = "";
      setWishStatus("已放到心愿单", "ok");
      wishTab = "open";
      await refreshWishes();
    } catch (err) {
      setWishStatus(err?.message || "写不进去", "error");
    } finally {
      if (btn) btn.disabled = false;
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (currentMainView && currentMainView !== "home") {
    const seekLayer = document.getElementById("seekEmojiLayer");
    if (seekLayer?.classList.contains("is-open")) {
      setSeekEmojiLayerOpen(false);
      return;
    }
    setMainView("home");
  }
});

loadBgLightness();
loadSwitchAnim();
loadUiStyle();

const SHELL_BG_KEY = "ludong-shell-bg-v1";
const SHELL_BG_MAX = 12;
const shellBgUrls = new Map();
let shellBgTimer = 0;
let shellShownId = "";
let shellFadeTimer = 0;

function setShellBgStatus(text, isError = false) {
  const el = document.getElementById("shellBgStatus");
  if (!el) return;
  el.textContent = text || "";
  el.classList.toggle("is-error", !!isError);
  el.classList.toggle("is-ok", !!text && !isError);
}

function openShellBgDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("ludong-shell-bg", 2);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("images")) db.createObjectStore("images");
      if (!db.objectStoreNames.contains("libraries")) db.createObjectStore("libraries");
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error("打不开背景库"));
  });
}

function shellOwnerId() {
  return currentLibraryUserId() || "__guest__";
}

let shellBgMemory = null;
let shellBgOwner = "";
let shellHydrateGen = 0;
let shellWriteSeq = 0;

function shellBlobKey(id) {
  return `${shellOwnerId()}:${id}`;
}

function shellDbPutLibrary(record, owner = shellOwnerId()) {
  const key = owner || "__guest__";
  return openShellBgDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction("libraries", "readwrite");
        tx.objectStore("libraries").put(record, key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error || new Error("背景库保存失败"));
      })
  );
}

function shellDbGetLibrary(owner = shellOwnerId()) {
  const key = owner || "__guest__";
  return openShellBgDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction("libraries", "readonly");
        const req = tx.objectStore("libraries").get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      })
  );
}

function shellDbPut(id, blob) {
  const key = shellBlobKey(id);
  return openShellBgDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction("images", "readwrite");
        tx.objectStore("images").put(blob, key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error || new Error("背景没能存进库"));
      })
  );
}

function shellDbGet(id, owner = shellOwnerId()) {
  const key = `${owner || "__guest__"}:${id}`;
  return openShellBgDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction("images", "readonly");
        const req = tx.objectStore("images").get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      })
  );
}

function shellDbDelete(id) {
  const key = shellBlobKey(id);
  return openShellBgDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction("images", "readwrite");
        tx.objectStore("images").delete(key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      })
  );
}

function rememberShellUrl(id, blob) {
  const prev = shellBgUrls.get(id);
  if (prev) URL.revokeObjectURL(prev);
  shellBgUrls.set(id, URL.createObjectURL(blob));
}

function dataUrlToBlob(dataUrl) {
  return fetch(dataUrl).then((res) => res.blob());
}

function shellLevelFromSaved(data) {
  const n = Number(data?.level);
  if (Number.isFinite(n)) return Math.max(0, Math.min(100, Math.round(n)));
  if (data?.strength === "soft") return 28;
  if (data?.strength === "strong") return 82;
  return 55;
}

function emptyShellBackground() {
  return { ids: [], images: {}, posters: {}, activeId: "", level: 55, rotate: "off", intervalMin: 5, transition: "fade" };
}

function isShellStill(src) {
  return String(src || "").startsWith("data:image/");
}

function isShellMotion(src) {
  return String(src || "").startsWith("data:video/");
}

function normalizeShellBackground(data) {
  const images = {};
  const posters = {};
  const incoming = data?.images && typeof data.images === "object" ? data.images : {};
  Object.entries(incoming).forEach(([id, image]) => {
    const src = String(image || "");
    if (id && (isShellStill(src) || isShellMotion(src))) images[id] = src;
  });
  const incomingPosters = data?.posters && typeof data.posters === "object" ? data.posters : {};
  Object.entries(incomingPosters).forEach(([id, image]) => {
    const src = String(image || "");
    if (id && isShellStill(src)) posters[id] = src;
  });
  if (Array.isArray(data?.items)) {
    data.items.forEach((item) => {
      const id = String(item?.id || "");
      const src = String(item?.image || "");
      if (id && src.startsWith("data:image/")) images[id] = src;
    });
  }
  const fromItems = (Array.isArray(data?.items) ? data.items : [])
    .map((item) => String(item?.id || ""))
    .filter(Boolean);
  const fromIds = (Array.isArray(data?.ids) ? data.ids : []).map((id) => String(id || "")).filter(Boolean);
  let ids = [...new Set(fromIds.length ? fromIds : fromItems)];
  Object.keys(images).forEach((id) => {
    if (!ids.includes(id)) ids.push(id);
  });
  if (!ids.length && String(data?.image || "").startsWith("data:image/")) {
    images["bg-legacy"] = String(data.image);
    ids = ["bg-legacy"];
  }
  ids = ids.filter((id) => images[id]).slice(0, SHELL_BG_MAX);
  Object.keys(posters).forEach((id) => {
    if (!ids.includes(id)) delete posters[id];
  });
  const activeId = ids.includes(data?.activeId) ? data.activeId : ids[0] || "";
  const rotate = ["off", "order", "random"].includes(data?.rotate) ? data.rotate : "off";
  const transition = ["fade", "veil", "drift"].includes(data?.transition) ? data.transition : "fade";
  let intervalMin = Number(data?.intervalMin);
  if (!Number.isFinite(intervalMin)) intervalMin = 5;
  intervalMin = Math.max(1, Math.min(180, Math.round(intervalMin)));
  return {
    ids,
    images,
    posters,
    activeId,
    level: shellLevelFromSaved(data || {}),
    rotate,
    intervalMin,
    transition
  };
}

function readShellBackground() {
  return shellBgMemory || emptyShellBackground();
}

function shellImageOf(state) {
  return state?.images?.[state.activeId] || "";
}

function shellPosterOf(state) {
  const src = shellImageOf(state);
  if (isShellStill(src)) return src;
  return state?.posters?.[state.activeId] || "";
}

function writeShellBackground(next) {
  shellWriteSeq += 1;
  const state = normalizeShellBackground(next);
  shellBgMemory = state;
  shellBgOwner = shellOwnerId();
  const owner = shellBgOwner;
  shellDbPutLibrary(state, owner).catch((err) => {
    console.warn("shell background save", owner, err);
    setShellBgStatus(err?.message || "背景库保存失败", true);
  });
  return state;
}

async function migrateShellImagesToDb(raw) {
  const jobs = [];
  if (Array.isArray(raw?.items)) {
    raw.items.forEach((item) => {
      const image = String(item?.image || "");
      const id = String(item?.id || "");
      if (id && image.startsWith("data:image/")) jobs.push({ id, image });
    });
  }
  const legacy = String(raw?.image || "");
  if (!jobs.length && legacy.startsWith("data:image/")) {
    jobs.push({ id: "bg-legacy", image: legacy });
  }
  for (const job of jobs) {
    const blob = await dataUrlToBlob(job.image);
    await shellDbPut(job.id, blob);
  }
  if (jobs.length) {
    const state = normalizeShellBackground(raw);
    localStorage.setItem(
      scopedStorageKey(SHELL_BG_KEY),
      JSON.stringify({
        ids: state.ids,
        activeId: state.activeId,
        level: state.level,
        rotate: state.rotate,
        intervalMin: state.intervalMin
      })
    );
  }
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("无法读取图片"));
    reader.readAsDataURL(blob);
  });
}

async function migrateLegacyShellLibrary(owner = shellOwnerId()) {
  const key = scopedStorageKey(SHELL_BG_KEY);
  let raw = null;
  try {
    raw = JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    raw = null;
  }
  if (!raw) return null;
  const images = {};
  const items = Array.isArray(raw.items) ? raw.items : [];
  for (const item of items) {
    const id = String(item?.id || "");
    const src = String(item?.image || "");
    if (id && src.startsWith("data:image/")) images[id] = src;
  }
  const ids = (Array.isArray(raw.ids) ? raw.ids : Object.keys(images)).map(String).filter(Boolean);
  for (const id of ids) {
    if (images[id]) continue;
    try {
      const blob = await shellDbGet(id, owner);
      if (!blob) continue;
      const url = await blobToDataUrl(blob);
      if (url.startsWith("data:image/")) images[id] = url;
    } catch {
      /* 旧图读不到就跳过 */
    }
  }
  const state = normalizeShellBackground({ ...raw, images, ids: Object.keys(images) });
  if (!state.ids.length) return null;
  await shellDbPutLibrary(state, owner);
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
  return state;
}

function shellHydrateStillCurrent(gen, owner, writes) {
  return gen === shellHydrateGen && owner === shellOwnerId() && writes === shellWriteSeq;
}

async function hydrateShellBackground() {
  const gen = ++shellHydrateGen;
  const writes = shellWriteSeq;
  const owner = shellOwnerId();
  if (shellBgOwner !== owner) {
    shellBgOwner = owner;
    shellBgMemory = emptyShellBackground();
    applyShellBackground();
  }
  let saved = null;
  try {
    saved = await shellDbGetLibrary(owner);
  } catch (err) {
    console.warn("hydrate shell background", owner, err);
  }
  if (!shellHydrateStillCurrent(gen, owner, writes)) return;
  if (saved) {
    shellBgMemory = normalizeShellBackground(saved);
    shellBgOwner = owner;
    applyShellBackground();
    return;
  }
  let migrated = null;
  try {
    migrated = await migrateLegacyShellLibrary(owner);
  } catch {
    migrated = null;
  }
  if (!shellHydrateStillCurrent(gen, owner, writes)) return;
  shellBgMemory = migrated || emptyShellBackground();
  shellBgOwner = owner;
  applyShellBackground();
}

let shellPaperBright = 0.45;

function sampleShellPaperBright(dataUrl) {
  if (!dataUrl || !String(dataUrl).startsWith("data:image/")) {
    shellPaperBright = 0.45;
    return Promise.resolve(shellPaperBright);
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 24;
        canvas.height = 24;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          shellPaperBright = 0.45;
          resolve(shellPaperBright);
          return;
        }
        ctx.drawImage(img, 0, 0, 24, 24);
        const data = ctx.getImageData(0, 0, 24, 24).data;
        let sum = 0;
        const n = data.length / 4;
        for (let i = 0; i < data.length; i += 4) {
          sum += (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
        }
        shellPaperBright = Math.max(0, Math.min(1, sum / Math.max(n, 1)));
      } catch {
        shellPaperBright = 0.45;
      }
      resolve(shellPaperBright);
    };
    img.onerror = () => {
      shellPaperBright = 0.45;
      resolve(shellPaperBright);
    };
    img.src = dataUrl;
  });
}

function applyShellLevel(level) {
  const t = Math.max(0, Math.min(100, Number(level) || 0)) / 100;
  const root = document.documentElement;
  const isLightUi = root.dataset.bgLight === "1";
  const paper = Number.isFinite(shellPaperBright) ? shellPaperBright : 0.45;
  const open = 1 - Math.pow(1 - t, 1.45);
  const tone = (from, to) => Math.round(from + (to - from) * open);
  // 整窗遮罩早点退开；拉满时外层不再叠一层，画面回到接近原亮度
  const dim = Math.round(8 + Math.pow(1 - t, 3) * 92);
  const rail = tone(84, 30);
  const pane = tone(70, 6);
  const view = tone(78, 28);
  const bar = tone(86, 32);
  root.style.setProperty("--shell-dim", `${dim}%`);
  root.style.setProperty("--shell-rail", `${rail}%`);
  root.style.setProperty("--shell-pane", `${pane}%`);
  root.style.setProperty("--shell-view", `${view}%`);
  root.style.setProperty("--shell-bar", `${bar}%`);
  root.style.setProperty("--shell-blur", `${Math.round((1 - t) * 16)}px`);
  const read = Math.min(1, 0.35 + t * 0.65);
  root.style.setProperty("--shell-read", String(read));
  if (read < 0.04) {
    root.style.setProperty("--shell-text-shadow", "none");
  } else if (isLightUi) {
    root.style.setProperty(
      "--shell-text-shadow",
      `0 1px 0 rgba(255,255,255,${(0.22 * read).toFixed(3)}), 0 0 10px rgba(255,253,248,${(0.4 * read).toFixed(3)})`
    );
  } else {
    root.style.setProperty(
      "--shell-text-shadow",
      `0 1px 2px rgba(0,0,0,${(0.42 + 0.4 * read).toFixed(3)}), 0 0 14px rgba(0,0,0,${(0.28 + 0.4 * read).toFixed(3)})`
    );
  }
  // 壁纸很亮且界面仍是浅色字时，局部改成深色字保证可读
  if (!isLightUi && paper > 0.58 && t > 0.48) {
    root.setAttribute("data-shell-ink", "dark");
  } else {
    root.removeAttribute("data-shell-ink");
  }
  if (typeof bgLight === "number" && !root.classList.contains("theme-manga")) {
    const uiT = clamp(bgLight, 0, 1);
    const textCol = mixHex("#f2efe8", "#1a1f28", uiT);
    const mutedBase = mixHex("#8b93a0", "#5a6472", uiT);
    const dimBase = mixHex("#5a6270", "#8a93a0", uiT);
    root.style.setProperty("--muted", mixHex(mutedBase, textCol, read * 0.58));
    root.style.setProperty("--dim", mixHex(dimBase, textCol, read * 0.42));
  }
  const slider = document.getElementById("shellBgLevel");
  if (slider && Number(slider.value) !== Math.round(t * 100)) {
    slider.value = String(Math.round(t * 100));
  }
}

function renderShellBackgroundPicker(state) {
  const grid = document.getElementById("shellBgGrid");
  const empty = document.getElementById("shellBgEmpty");
  if (empty) empty.hidden = state.ids.length > 0;
  if (grid) {
    grid.innerHTML = state.ids
      .map((id) => {
        const media = state.images?.[id] || "";
        const thumb = state.posters?.[id] || (isShellStill(media) ? media : "");
        if (!thumb) return "";
        const motion = isShellMotion(media) ? `<span class="wallpaper-library-motion">动</span>` : "";
        return `<button type="button" class="wallpaper-library-item${
          id === state.activeId ? " is-selected" : ""
        }" data-shell-id="${escapeHtml(id)}" title="设为当前背景">
          <img src="${thumb}" alt="" />
          ${motion}
          <span class="wallpaper-library-del" data-shell-del="${escapeHtml(id)}" title="删除">×</span>
        </button>`;
      })
      .join("");
  }
  document.querySelectorAll("#shellBgRotateRow [data-shell-rotate]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.shellRotate === state.rotate);
  });
  const wrap = document.getElementById("shellBgIntervalWrap");
  const interval = document.getElementById("shellBgInterval");
  if (wrap) wrap.hidden = state.rotate === "off" || state.ids.length < 2;
  if (interval && document.activeElement !== interval) {
    interval.value = String(state.intervalMin);
  }
  const canMove = state.ids.length >= 2;
  const motionRow = document.getElementById("shellBgMotionRow");
  const motionPick = document.getElementById("shellBgMotionPick");
  if (motionRow) motionRow.hidden = !canMove;
  if (motionPick) motionPick.hidden = !canMove;
  document.querySelectorAll("#shellBgMotionPick [data-shell-motion]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.shellMotion === (state.transition || "fade"));
  });
}

function scheduleShellBackgroundRotate(state = readShellBackground()) {
  clearInterval(shellBgTimer);
  shellBgTimer = 0;
  if (state.rotate === "off" || state.ids.length < 2) return;
  const ms = state.intervalMin * 60 * 1000;
  shellBgTimer = setInterval(() => {
    advanceShellBackground();
  }, ms);
}

function advanceShellBackground() {
  const state = readShellBackground();
  if (state.ids.length < 2 || state.rotate === "off") return;
  const index = state.ids.indexOf(state.activeId);
  let nextId = state.ids[0];
  if (state.rotate === "random") {
    const pool = state.ids.filter((id) => id !== state.activeId);
    nextId = pool[Math.floor(Math.random() * pool.length)] || nextId;
  } else {
    nextId = state.ids[(Math.max(index, 0) + 1) % state.ids.length];
  }
  if (nextId === state.activeId) return;
  writeShellBackground({ ...state, activeId: nextId });
  applyShellBackground({ motion: state.transition || "fade" });
}

function previewShellBackgroundSwitch(transition) {
  const state = readShellBackground();
  if (state.ids.length < 2) {
    setShellBgStatus("至少两张才能看切换", true);
    return;
  }
  const mode = ["fade", "veil", "drift"].includes(transition) ? transition : state.transition || "fade";
  const index = state.ids.indexOf(state.activeId);
  const nextId = state.ids[(Math.max(index, 0) + 1) % state.ids.length];
  writeShellBackground({ ...state, activeId: nextId, transition: mode });
  applyShellBackground({ motion: mode });
}

function clearShellReadabilityVars() {
  const root = document.documentElement;
  root.removeAttribute("data-shell-ink");
  root.style.removeProperty("--shell-dim");
  root.style.removeProperty("--shell-rail");
  root.style.removeProperty("--shell-pane");
  root.style.removeProperty("--shell-view");
  root.style.removeProperty("--shell-bar");
  root.style.removeProperty("--shell-blur");
  root.style.removeProperty("--shell-read");
  root.style.removeProperty("--shell-text-shadow");
  root.style.removeProperty("--shell-bg-image");
}

function paintShellFrame(frame, state, id) {
  if (!frame) return;
  const media = state?.images?.[id] || "";
  const poster = isShellStill(media) ? media : state?.posters?.[id] || "";
  const video = frame.querySelector("video");
  frame.style.backgroundImage = poster ? `url("${poster}")` : "";
  if (!video) return;
  if (isShellMotion(media)) {
    video.hidden = false;
    if (video.getAttribute("data-src") !== media) {
      video.src = media;
      video.setAttribute("data-src", media);
    }
    return;
  }
  video.pause();
  video.hidden = true;
}

function playShellFrame(frame, on) {
  const video = frame?.querySelector("video");
  if (!video || video.hidden || !video.getAttribute("data-src")) return;
  const can = on && !document.hidden && !document.body.classList.contains("is-auth-screen");
  if (can) video.play().catch(() => {});
  else video.pause();
}

function frontShellFrame() {
  return document.querySelector(".shell-bg-frame.is-front") || document.getElementById("shellBgFrameA");
}

function syncShellFramePlayback() {
  document.querySelectorAll(".shell-bg-frame").forEach((frame) => {
    const on = frame.classList.contains("is-front") && !frame.classList.contains("is-out") && !frame.classList.contains("is-leaving");
    playShellFrame(frame, on);
  });
}

function snapShellFrames(state) {
  const layer = document.getElementById("shellBgLayer");
  const front = document.getElementById("shellBgFrameA");
  const back = document.getElementById("shellBgFrameB");
  if (!layer || !front || !back) return;
  window.clearTimeout(shellFadeTimer);
  layer.classList.add("is-instant");
  layer.classList.remove("is-moving");
  layer.dataset.shellMove = state.transition || "fade";
  paintShellFrame(front, state, state.activeId);
  front.classList.add("is-front");
  front.classList.remove("is-out", "is-leaving");
  back.classList.remove("is-front", "is-out", "is-leaving");
  back.style.backgroundImage = "";
  playShellFrame(front, true);
  playShellFrame(back, false);
  shellShownId = state.activeId || "";
  window.requestAnimationFrame(() => layer.classList.remove("is-instant"));
}

function crossfadeShell(state, mode) {
  const layer = document.getElementById("shellBgLayer");
  const front = frontShellFrame();
  const back = front?.id === "shellBgFrameB"
    ? document.getElementById("shellBgFrameA")
    : document.getElementById("shellBgFrameB");
  if (!layer || !front || !back) {
    snapShellFrames(state);
    return;
  }
  window.clearTimeout(shellFadeTimer);
  const move = ["fade", "veil", "drift"].includes(mode) ? mode : "fade";
  paintShellFrame(back, state, state.activeId);
  layer.classList.add("is-instant");
  layer.classList.remove("is-moving");
  layer.dataset.shellMove = move;
  back.classList.remove("is-front", "is-out", "is-leaving");
  front.classList.remove("is-out", "is-leaving");
  void layer.offsetWidth;
  layer.classList.remove("is-instant");
  void back.offsetWidth;
  if (move === "veil") {
    front.classList.add("is-leaving");
    playShellFrame(front, false);
    shellFadeTimer = window.setTimeout(() => {
      back.classList.add("is-front");
      playShellFrame(back, true);
      shellFadeTimer = window.setTimeout(() => {
        front.classList.remove("is-front", "is-leaving");
        playShellFrame(front, false);
      }, 820);
    }, 760);
  } else {
    layer.classList.add("is-moving");
    front.classList.add("is-out");
    back.classList.add("is-front");
    playShellFrame(back, true);
    playShellFrame(front, false);
    shellFadeTimer = window.setTimeout(() => {
      front.classList.remove("is-front", "is-out");
      layer.classList.remove("is-moving");
      playShellFrame(front, false);
    }, 1150);
  }
  shellShownId = state.activeId || "";
}

function applyShellBackground(opts = {}) {
  const data = readShellBackground();
  const media = shellImageOf(data);
  const still = shellPosterOf(data);
  const root = document.documentElement;
  const layer = document.getElementById("shellBgLayer");
  const on = !!media;
  if (on) {
    root.setAttribute("data-shell-bg", "1");
    root.style.removeProperty("--shell-bg-image");
    if (layer) {
      layer.hidden = false;
      layer.setAttribute("aria-hidden", "false");
      layer.style.backgroundImage = "";
    }
    const motion = opts.motion || "";
    if (motion && shellShownId && shellShownId !== data.activeId) crossfadeShell(data, motion);
    else if (shellShownId !== data.activeId) snapShellFrames(data);
    else syncShellFramePlayback();
    const slider = document.getElementById("shellBgLevel");
    if (slider) slider.value = String(data.level);
    renderShellBackgroundPicker(data);
    scheduleShellBackgroundRotate(data);
    const sample = still || (isShellStill(media) ? media : "");
    if (sample) {
      sampleShellPaperBright(sample).then(() => {
        if (shellImageOf(readShellBackground()) !== media) return;
        applyShellLevel(data.level);
      });
    }
    applyShellLevel(data.level);
    return;
  }
  shellShownId = "";
  root.removeAttribute("data-shell-bg");
  root.removeAttribute("data-shell-strength");
  clearShellReadabilityVars();
  document.querySelectorAll(".shell-bg-frame").forEach((frame) => {
    frame.classList.remove("is-front", "is-out", "is-leaving");
    frame.style.backgroundImage = "";
    playShellFrame(frame, false);
  });
  if (layer) {
    layer.hidden = true;
    layer.setAttribute("aria-hidden", "true");
    layer.style.backgroundImage = "";
    layer.classList.remove("is-moving");
  }
  if (!root.classList.contains("theme-manga")) {
    applyBgLightness(Math.round((bgLight || 0) * 100), bgHue);
  }
  const slider = document.getElementById("shellBgLevel");
  if (slider) slider.value = String(data.level);
  renderShellBackgroundPicker(data);
  scheduleShellBackgroundRotate(data);
}

function isShellVideoFile(file) {
  const type = String(file?.type || "");
  return type.startsWith("video/") || /\.(mp4|webm|mov|m4v|mkv)$/i.test(file?.name || "");
}

function clipShellBackgroundVideo(file) {
  const CLIP_SEC = 6;
  return new Promise((resolve, reject) => {
    if (!file || !isShellVideoFile(file)) {
      reject(new Error("请选择视频"));
      return;
    }
    if (file.size > 80 * 1024 * 1024) {
      reject(new Error("视频请小于 80MB"));
      return;
    }
    if (typeof MediaRecorder === "undefined" || !HTMLCanvasElement.prototype.captureStream) {
      reject(new Error("当前浏览器不能裁动态背景"));
      return;
    }
    const mime = ["video/webm;codecs=vp8", "video/webm"].find((item) => MediaRecorder.isTypeSupported(item));
    if (!mime) {
      reject(new Error("当前浏览器不能裁动态背景"));
      return;
    }
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = url;
    let settled = false;
    const cleanup = () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
      URL.revokeObjectURL(url);
    };
    const fail = (err) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(err instanceof Error ? err : new Error("裁剪失败"));
    };
    video.onerror = () => fail(new Error("无法读取这段视频"));
    video.onloadedmetadata = () => {
      const width = video.videoWidth || 0;
      const height = video.videoHeight || 0;
      if (!width || !height) {
        fail(new Error("无法读取这段视频"));
        return;
      }
      const clip = Math.min(CLIP_SEC, Math.max(video.duration || CLIP_SEC, 0.8));
      const scale = Math.min(1, 1600 / Math.max(width, height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(2, Math.round(width * scale));
      canvas.height = Math.max(2, Math.round(height * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        fail(new Error("无法裁剪这段视频"));
        return;
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      const stream = canvas.captureStream(30);
      const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 2800000 });
      const chunks = [];
      rec.ondataavailable = (e) => {
        if (e.data && e.data.size) chunks.push(e.data);
      };
      const stopped = new Promise((res, rej) => {
        rec.onstop = () => res();
        rec.onerror = () => rej(new Error("裁剪失败"));
      });
      video.currentTime = 0;
      video.play().then(() => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const poster = canvas.toDataURL("image/jpeg", 0.9);
        rec.start(200);
        const started = performance.now();
        const tick = () => {
          const elapsed = (performance.now() - started) / 1000;
          if (video.ended || video.currentTime >= clip - 0.05 || elapsed >= clip + 0.4) {
            if (rec.state !== "inactive") rec.stop();
            return;
          }
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          requestAnimationFrame(tick);
        };
        tick();
        stopped.then(async () => {
          if (settled) return;
          cleanup();
          const blob = new Blob(chunks, { type: "video/webm" });
          if (blob.size < 800) {
            fail(new Error("裁出来的片段是空的"));
            return;
          }
          const dataUrl = await blobToDataUrl(blob);
          if (settled) return;
          if (!isShellMotion(dataUrl) || !isShellStill(poster)) {
            fail(new Error("无法保存这段动态背景"));
            return;
          }
          settled = true;
          resolve({ dataUrl, poster });
        }).catch(fail);
      }).catch(() => fail(new Error("无法播放这段视频")));
    };
  });
}

function compressShellBackgroundFile(file) {
  return new Promise((resolve, reject) => {
    const nameOk = /\.(jpe?g|png|webp|gif|bmp)$/i.test(file?.name || "");
    if (!file || (!String(file.type || "").startsWith("image/") && !nameOk)) {
      reject(new Error("请选择图片文件"));
      return;
    }
    if (file.size > 18 * 1024 * 1024) {
      reject(new Error("图片请小于 18MB"));
      return;
    }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const finish = (blob) => {
        URL.revokeObjectURL(url);
        if (!blob) {
          reject(new Error("无法压缩这张图"));
          return;
        }
        resolve(blob);
      };
      try {
        const maxEdge = 2560;
        const scale = Math.min(1, maxEdge / Math.max(img.width, img.height, 1));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => finish(blob), "image/jpeg", 0.92);
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("无法读取图片"));
    };
    img.src = url;
  });
}

document.getElementById("shellBgPickBtn")?.addEventListener("click", () => {
  document.getElementById("shellBgFile")?.click();
});

document.getElementById("shellBgFile")?.addEventListener("change", async (e) => {
  const input = e.target;
  const files = [...(input?.files || [])];
  if (input) input.value = "";
  if (!files.length) return;
  const prev = readShellBackground();
  const ids = prev.ids.slice();
  prev.images = { ...(prev.images || {}) };
  prev.posters = { ...(prev.posters || {}) };
  let activeId = prev.activeId;
  let added = 0;
  setShellBgStatus("正在加入背景库…");
  try {
    for (const file of files) {
      if (ids.length >= SHELL_BG_MAX) break;
      const id = `bg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
      if (isShellVideoFile(file)) {
        setShellBgStatus("正在裁成约 6 秒循环…");
        const clipped = await clipShellBackgroundVideo(file);
        prev.images[id] = clipped.dataUrl;
        prev.posters[id] = clipped.poster;
      } else {
        const blob = await compressShellBackgroundFile(file);
        const image = await blobToDataUrl(blob);
        if (!isShellStill(image)) throw new Error("无法保存这张图");
        prev.images[id] = image;
      }
      ids.push(id);
      if (!activeId) activeId = id;
      added += 1;
    }
    if (!added) {
      setShellBgStatus(`背景库最多 ${SHELL_BG_MAX} 张`, true);
      return;
    }
    writeShellBackground({ ...prev, ids, images: prev.images, posters: prev.posters, activeId });
    applyShellBackground();
    const skipped = files.length - added;
    setShellBgStatus(
      skipped > 0 ? `已加入 ${added} 张，库里最多 ${SHELL_BG_MAX} 张` : `已加入背景库 ${added} 张`
    );
  } catch (err) {
    if (added) {
      writeShellBackground({ ...prev, ids, images: prev.images, posters: prev.posters, activeId });
      applyShellBackground();
    }
    setShellBgStatus(err?.message || "背景上传失败", true);
  }
});

document.getElementById("shellBgGrid")?.addEventListener("click", async (e) => {
  const del = e.target.closest?.("[data-shell-del]");
  const state = readShellBackground();
  if (del) {
    e.stopPropagation();
    const id = del.dataset.shellDel || "";
    const images = { ...(state.images || {}) };
    const posters = { ...(state.posters || {}) };
    delete images[id];
    delete posters[id];
    const ids = state.ids.filter((item) => item !== id);
    const activeId = state.activeId === id ? ids[0] || "" : state.activeId;
    writeShellBackground({ ...state, ids, images, posters, activeId });
    applyShellBackground();
    setShellBgStatus(ids.length ? "已从背景库删除" : "背景库已清空");
    return;
  }
  const thumb = e.target.closest?.("[data-shell-id]");
  if (!thumb) return;
  const activeId = thumb.dataset.shellId || "";
  if (!activeId || activeId === state.activeId) return;
  writeShellBackground({ ...state, activeId });
  applyShellBackground();
  setShellBgStatus("已换成这张背景");
});

document.getElementById("shellBgMotionPick")?.addEventListener("click", (e) => {
  const btn = e.target.closest?.("[data-shell-motion]");
  if (!btn) return;
  const transition = btn.dataset.shellMotion || "fade";
  const state = readShellBackground();
  if (state.ids.length < 2) {
    setShellBgStatus("至少两张才能看切换", true);
    return;
  }
  writeShellBackground({ ...state, transition });
  previewShellBackgroundSwitch(transition);
  const label = transition === "veil" ? "淡过" : transition === "drift" ? "轻移" : "叠化";
  setShellBgStatus(`正在用「${label}」换到下一张`);
});

document.getElementById("shellBgRotateRow")?.addEventListener("click", (e) => {
  const btn = e.target.closest?.("[data-shell-rotate]");
  if (!btn) return;
  const rotate = btn.dataset.shellRotate || "off";
  const state = readShellBackground();
  if (rotate !== "off" && state.ids.length < 2) {
    setShellBgStatus("背景库至少两张才能自动切换", true);
    return;
  }
  writeShellBackground({ ...state, rotate });
  applyShellBackground();
});

document.getElementById("shellBgInterval")?.addEventListener("change", (e) => {
  let intervalMin = Number(e.target?.value);
  if (!Number.isFinite(intervalMin)) intervalMin = 5;
  intervalMin = Math.max(1, Math.min(180, Math.round(intervalMin)));
  if (e.target) e.target.value = String(intervalMin);
  const state = readShellBackground();
  writeShellBackground({ ...state, intervalMin });
  scheduleShellBackgroundRotate();
});

document.getElementById("shellBgClearBtn")?.addEventListener("click", async () => {
  writeShellBackground(null);
  applyShellBackground();
  setShellBgStatus("已恢复默认背景");
});

document.getElementById("shellBgLevel")?.addEventListener("input", (e) => {
  const level = Number(e.target?.value);
  const prev = readShellBackground();
  if (!shellImageOf(prev)) return;
  applyShellLevel(level);
});

document.getElementById("shellBgLevel")?.addEventListener("change", (e) => {
  const level = Number(e.target?.value);
  const prev = readShellBackground();
  if (!shellImageOf(prev)) {
    setShellBgStatus("请先上传到背景库", true);
    if (e.target) e.target.value = "55";
    return;
  }
  try {
    writeShellBackground({ ...prev, level });
  } catch (err) {
    setHint(err?.message || "保存失败", true);
  }
});
document.addEventListener("visibilitychange", () => {
  syncShellFramePlayback();
});
hydrateShellBackground();
loadSeekEmojiPicker();
bindWishPage();

function setImportStatus(text, kind = "") {
  if (!els.importStatus) return;
  els.importStatus.textContent = text || "";
  els.importStatus.classList.toggle("is-error", kind === "error");
  els.importStatus.classList.toggle("is-ok", kind === "ok");
}

function setImportBusy(busy) {
  [els.importMp3Btn, els.importLrcBtn, els.importVideoBtn, els.importAnyBtn].forEach((btn) => {
    if (btn) btn.disabled = !!busy;
  });
}

async function refreshAfterImport() {
  const keepId = playlist[currentIndex]?.id;
  const query = (els.searchInput?.value || "").trim();
  mediaCacheBust = String(Date.now());
  mvProbeCache.clear();
  lyricsCache.clear();
  DEFAULT_PLAYLIST = await loadLocalPlaylist();
  await fillAllDurations(DEFAULT_PLAYLIST);

  if (query) {
    await runSearch(query);
  } else {
    playlist = [...DEFAULT_PLAYLIST];
    renderList();
  }

  if (!playlist.length) {
    els.title.textContent = "暂无歌曲";
    els.artist.textContent = "可在设置中导入 MP3";
    return;
  }

  let idx = playlist.findIndex((s) => s.id === keepId);
  if (idx < 0) idx = 0;
  currentIndex = idx;
  const song = playlist[currentIndex];
  if (song) {
    song.videoUrl = "";
    song.videoRel = "";
  }
  updateUI(song);
  const playUrl = await resolvePlayUrl(song);
  const same = audio.getAttribute("data-id") === String(song.id);
  if (!same) {
    audio.src = playUrl;
    audio.setAttribute("data-id", String(song.id));
    await waitForAudioReady();
    syncProgress();
  }
  if (showMv) {
    clearMvVideo();
    await applyMvForSong(song);
  }
}

async function uploadImportFiles(fileList) {
  const files = Array.from(fileList || []).filter(Boolean);
  if (!files.length) return;
  const uid = currentLibraryUserId();
  if (!uid) {
    setImportStatus("请先登录后再导入（导入只进入你的私人空间）", "error");
    return;
  }

  setImportBusy(true);
  setImportStatus("正在导入到你的私人空间…");
  try {
    const fd = new FormData();
    for (const file of files) {
      fd.append("files", file, file.name);
    }
    const res = await fetch(withUserQuery("/api/import"), { method: "POST", body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      throw new Error(data.error || `导入失败（${res.status}）`);
    }

    const nMp3 = (data.mp3 || []).length;
    const nLrc = (data.lrc || []).length;
    const nCover = (data.cover || []).length;
    const nVideo = (data.video || []).length;
    const parts = [];
    if (nMp3) parts.push(`${nMp3} 首音频`);
    if (nLrc) parts.push(`${nLrc} 份歌词`);
    if (nCover) parts.push(`${nCover} 张封面`);
    if (nVideo) parts.push(`${nVideo} 个视频`);
    const summary = parts.length ? parts.join("、") : "未写入新文件";
    const skipped = Array.isArray(data.skipped) ? data.skipped : [];
    const skipNote = skipped.length ? `；跳过 ${skipped.length} 个` : "";
    const skipDetail = skipped.length
      ? ` ${skipped.slice(0, 2).join("；")}${skipped.length > 2 ? "…" : ""}`
      : "";

    await refreshAfterImport();
    const priv = data.privateCount != null ? ` · 私人 ${data.privateCount}` : "";
    const kind =
      nVideo === 0 && skipped.some((s) => /视频|不支持|\.acc|\.mp4|\.mkv|\.webm|\.mov|\.m4v/i.test(String(s)))
        ? "error"
        : "ok";
    setImportStatus(
      `已导入 ${summary}${skipNote}${skipDetail} · 可见 ${data.songCount || DEFAULT_PLAYLIST.length} 首${priv}`,
      kind
    );
    if (!els.searchInput?.value.trim()) {
      setHint(`公共+私人共 ${DEFAULT_PLAYLIST.length} 首 · 输入歌名可搜索`);
    }
  } catch (err) {
    setImportStatus(err?.message || "导入失败，请确认已通过播放器启动", "error");
  } finally {
    setImportBusy(false);
  }
}

function bindImportPicker(btn, input) {
  if (!btn || !input) return;
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    input.value = "";
    input.click();
  });
  input.addEventListener("change", () => {
    uploadImportFiles(input.files);
  });
}

bindImportPicker(els.importMp3Btn, els.importMp3Input);
bindImportPicker(els.importLrcBtn, els.importLrcInput);
bindImportPicker(els.importVideoBtn, els.importVideoInput);
bindImportPicker(els.importAnyBtn, els.importAnyInput);

function setCloudUploadStatus(text, kind = "") {
  if (!els.cloudUploadStatus) return;
  els.cloudUploadStatus.textContent = text || "";
  els.cloudUploadStatus.classList.toggle("is-error", kind === "error");
  els.cloudUploadStatus.classList.toggle("is-ok", kind === "ok");
}

function matchSideFile(files, stem, exts) {
  const key = String(stem || "").toLowerCase();
  const list = files.filter((f) =>
    exts.some((ext) => String(f.name || "").toLowerCase().endsWith(ext))
  );
  return (
    list.find((f) => {
      const name = String(f.name || "").replace(/\.[^.]+$/, "").toLowerCase();
      return name === key;
    }) || null
  );
}

async function uploadCloudLibraryFiles(fileList) {
  const files = Array.from(fileList || []).filter(Boolean);
  if (!files.length) return;
  const api = window.LudongCloud;
  if (!api?.uploadCloudSong) {
    setCloudUploadStatus("云端未就绪", "error");
    return;
  }
  if (typeof api.enabled === "function" && !api.enabled()) {
    setCloudUploadStatus("云端未配置", "error");
    return;
  }
  if (!api.isLoggedIn?.()) {
    setCloudUploadStatus("请先登录后再上传到共同曲库", "error");
    return;
  }

  const mp3s = files.filter((f) => /\.mp3$/i.test(f.name));
  const lrcs = files.filter((f) => /\.(lrc|srt)$/i.test(f.name));
  const covers = files.filter((f) => /\.(jpe?g|png|webp)$/i.test(f.name));
  const videos = files.filter((f) => /\.(mp4|webm|mov|mkv|m4v)$/i.test(f.name));
  if (!mp3s.length && !lrcs.length && !covers.length && !videos.length) {
    setCloudUploadStatus("请选择 MP3 / 歌词 / 封面 / 视频中的至少一种", "error");
    return;
  }

  const usedLrcs = new Set();
  const usedCovers = new Set();
  const usedVideos = new Set();
  const jobs = [];

  for (const audio of mp3s) {
    const stem = String(audio.name || "").replace(/\.mp3$/i, "");
    let lrcFile =
      matchSideFile(lrcs, stem, [".lrc", ".srt"]) ||
      matchSideFile(lrcs, "lyrics", [".lrc", ".srt"]);
    let coverFile = matchSideFile(covers, stem, [".jpg", ".jpeg", ".png", ".webp"]);
    let videoFile =
      matchSideFile(videos, stem, [".mp4", ".webm", ".mov", ".mkv", ".m4v"]) ||
      matchSideFile(videos, "mv", [".mp4", ".webm", ".mov", ".mkv", ".m4v"]) ||
      matchSideFile(videos, "video", [".mp4", ".webm", ".mov", ".mkv", ".m4v"]);
    if (!videoFile) {
      const soft = stem.replace(
        /[\s_\-]*(mv|official|official.?video|歌词版|高清|现场)$/i,
        ""
      );
      if (soft && soft !== stem) {
        videoFile = matchSideFile(videos, soft, [
          ".mp4",
          ".webm",
          ".mov",
          ".mkv",
          ".m4v"
        ]);
      }
    }
    if (mp3s.length === 1) {
      if (!lrcFile && lrcs[0]) lrcFile = lrcs[0];
      if (!coverFile && covers[0]) coverFile = covers[0];
      if (!videoFile && videos[0]) videoFile = videos[0];
    }
    if (lrcFile) usedLrcs.add(lrcFile);
    if (coverFile) usedCovers.add(coverFile);
    if (videoFile) usedVideos.add(videoFile);
    jobs.push({
      label: stem,
      audioFile: audio,
      lrcFile: lrcFile || undefined,
      coverFile: coverFile || undefined,
      videoFile: videoFile || undefined
    });
  }

  /** 未挂到 MP3 的侧车文件：按「歌名-歌手」分组后单独补传/替换 */
  const orphanGroups = new Map();
  const absorbOrphan = (file, kind) => {
    const parsed = api.parseSongFileName
      ? api.parseSongFileName(file.name)
      : { title: String(file.name || "").replace(/\.[^.]+$/, ""), artist: "未知歌手" };
    const title = String(parsed.title || "未命名").trim() || "未命名";
    const artist = String(parsed.artist || "未知歌手").trim() || "未知歌手";
    const key = `${String(title).toLowerCase()}|${String(artist).toLowerCase()}`;
    let group = orphanGroups.get(key);
    if (!group) {
      group = { label: `${title}-${artist}`, title, artist };
      orphanGroups.set(key, group);
    }
    if (kind === "lrc" && !group.lrcFile) group.lrcFile = file;
    if (kind === "cover" && !group.coverFile) group.coverFile = file;
    if (kind === "video" && !group.videoFile) group.videoFile = file;
  };
  for (const f of lrcs) if (!usedLrcs.has(f)) absorbOrphan(f, "lrc");
  for (const f of covers) if (!usedCovers.has(f)) absorbOrphan(f, "cover");
  for (const f of videos) if (!usedVideos.has(f)) absorbOrphan(f, "video");
  for (const group of orphanGroups.values()) {
    jobs.push({
      label: group.label,
      title: group.title,
      artist: group.artist,
      lrcFile: group.lrcFile,
      coverFile: group.coverFile,
      videoFile: group.videoFile
    });
  }

  if (!jobs.length) {
    setCloudUploadStatus("没有可上传的文件", "error");
    return;
  }

  if (els.cloudUploadBtn) els.cloudUploadBtn.disabled = true;
  const modeHint = mp3s.length
    ? `正在处理 ${jobs.length} 组到共同曲库…`
    : `正在按歌名匹配并补传 ${jobs.length} 组资产…`;
  setCloudUploadStatus(modeHint);
  let okCount = 0;
  let replaceCount = 0;
  const errors = [];
  try {
    for (const job of jobs) {
      try {
        const row = await api.uploadCloudSong({
          title: job.title,
          artist: job.artist,
          audioFile: job.audioFile,
          lrcFile: job.lrcFile,
          coverFile: job.coverFile,
          videoFile: job.videoFile
        });
        okCount += 1;
        if (row?.replaced) replaceCount += 1;
      } catch (err) {
        errors.push(`${job.label}: ${err?.message || "失败"}`);
      }
    }
    await refreshAfterImport();
    if (okCount && !errors.length) {
      const verb = replaceCount === okCount ? "已替换/补传" : replaceCount ? "已上传/补传" : "已上传";
      setCloudUploadStatus(
        `${verb} ${okCount} 组 · 当前可见 ${DEFAULT_PLAYLIST.length} 首`,
        "ok"
      );
    } else if (okCount) {
      setCloudUploadStatus(`成功 ${okCount} 组；${errors[0]}`, "error");
    } else {
      setCloudUploadStatus(errors[0] || "上传失败", "error");
    }
    if (!els.searchInput?.value.trim()) {
      const cloudN = DEFAULT_PLAYLIST.filter((s) => s.cloud).length;
      setHint(`云端 ${cloudN} · 合计 ${DEFAULT_PLAYLIST.length} 首 · 输入歌名可搜索`);
    }
  } catch (err) {
    setCloudUploadStatus(err?.message || "上传失败", "error");
  } finally {
    if (els.cloudUploadBtn) els.cloudUploadBtn.disabled = false;
  }
}

els.cloudUploadBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  if (!els.cloudUploadInput) return;
  els.cloudUploadInput.value = "";
  els.cloudUploadInput.click();
});

els.cloudUploadInput?.addEventListener("change", () => {
  uploadCloudLibraryFiles(els.cloudUploadInput.files);
});

const UPDATE_SKIP_KEY = "ludong-update-skip-v1";
let pendingUpdateInfo = null;

function setUpdateStatus(text, kind = "") {
  if (!els.updateStatus) return;
  els.updateStatus.textContent = text || "";
  els.updateStatus.classList.toggle("is-error", kind === "error");
  els.updateStatus.classList.toggle("is-ok", kind === "ok");
}

function setUpdateLayerOpen(on) {
  if (!els.updateLayer) return;
  els.updateLayer.hidden = !on;
  els.updateLayer.setAttribute("aria-hidden", on ? "false" : "true");
}

function skippedUpdateVersion() {
  try {
    return localStorage.getItem(UPDATE_SKIP_KEY) || "";
  } catch {
    return "";
  }
}

function skipUpdateVersion(ver) {
  try {
    if (ver) localStorage.setItem(UPDATE_SKIP_KEY, String(ver));
  } catch {
    /* ignore */
  }
}

function showUpdatePrompt(info, { force = false } = {}) {
  if (!info?.hasUpdate) return;
  const latest = String(info.latestVersion || "");
  if (!force && !info.mandatory && skippedUpdateVersion() === latest) return;
  pendingUpdateInfo = info;
  if (els.updateTitle) {
    els.updateTitle.textContent = `发现新版本 ${latest}`;
  }
  const cur = info.currentVersion || "";
  const notes = String(info.notes || "").trim() || "建议更新以获得最新功能与修复。";
  if (els.updateMsg) {
    els.updateMsg.textContent = `当前 ${cur} → ${latest}\n${notes}\n更新会覆盖程序文件，私人歌曲与账号数据会保留。`;
  }
  if (els.updateLaterBtn) {
    els.updateLaterBtn.hidden = !!info.mandatory;
  }
  setUpdateLayerOpen(true);
}

async function refreshAppVersionLabel() {
  try {
    const res = await fetch("/api/version", { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    if (data?.version) {
      mediaCacheBust = String(data.version);
      if (els.appVersionLabel) els.appVersionLabel.textContent = `v${data.version}`;
    }
  } catch {
    if (els.appVersionLabel) els.appVersionLabel.textContent = "版本 —";
  }
}

function shutdownUiForUpdateRestart() {
  try {
    setUpdateLayerOpen(false);
  } catch {
    /* ignore */
  }
  try {
    window.__ludongBc?.postMessage({ type: "shutdown" });
  } catch {
    /* ignore */
  }
  const tip = document.createElement("div");
  tip.setAttribute(
    "style",
    "position:fixed;inset:0;z-index:99999;display:grid;place-items:center;" +
      "background:#0c0f14;color:#f2efe8;font:600 16px/1.5 sans-serif;padding:24px;text-align:center;"
  );
  try {
    window.__ludongBc?.postMessage({
      type: "shutdown",
      from: window.__ludongWindowId || ""
    });
  } catch {
    /* ignore */
  }
  tip.textContent = "更新完成，正在关闭旧窗口并重启…";
  try {
    document.body.replaceChildren(tip);
  } catch {
    document.body.innerHTML = "";
    document.body.appendChild(tip);
  }
  try {
    window.close();
  } catch {
    /* ignore */
  }
  setTimeout(() => {
    try {
      window.close();
    } catch {
      /* ignore */
    }
    try {
      location.replace("about:blank");
    } catch {
      /* ignore */
    }
  }, 200);
}

function parseAppVersion(text) {
  const m = String(text || "").match(/(\d+)(?:\.(\d+))?(?:\.(\d+))?/);
  if (!m) return [0, 0, 0];
  return [Number(m[1] || 0), Number(m[2] || 0), Number(m[3] || 0)];
}

function appVersionGt(remote, local) {
  const a = parseAppVersion(remote);
  const b = parseAppVersion(local);
  for (let i = 0; i < 3; i += 1) {
    if (a[i] > b[i]) return true;
    if (a[i] < b[i]) return false;
  }
  return false;
}

function withCacheBust(url) {
  const raw = String(url || "").trim();
  if (!raw) return "";
  return `${raw}${raw.includes("?") ? "&" : "?"}t=${Date.now()}`;
}

async function checkAppUpdateViaBrowser() {
  const verRes = await fetch("/api/version", { cache: "no-store" });
  const verData = await verRes.json().catch(() => ({}));
  const current = String(verData.version || "").trim();
  const manifestUrl = String(verData.manifestUrl || "").trim();
  if (!manifestUrl) throw new Error("未配置更新地址");
  const res = await fetch(withCacheBust(manifestUrl), { cache: "no-store" });
  if (!res.ok) throw new Error(`更新清单读取失败(${res.status})`);
  const remote = await res.json().catch(() => ({}));
  const latest = String(remote.version || "").trim();
  const patch = String(remote.patchUrl || "").trim();
  const installer = String(remote.installerUrl || remote.url || "").trim();
  const has = !!(latest && appVersionGt(latest, current) && (patch || installer));
  return {
    ok: true,
    hasUpdate: has,
    currentVersion: current,
    latestVersion: latest,
    notes: String(remote.notes || remote.changelog || "").trim(),
    installerUrl: has ? installer : "",
    patchUrl: has ? patch : "",
    updateMode: has && patch ? "patch" : has ? "installer" : "",
    mandatory: has ? !!remote.mandatory : false,
    via: "browser"
  };
}

async function checkAppUpdate({ manual = false } = {}) {
  if (manual) setUpdateStatus("正在检查更新…");
  try {
    let data = null;
    // 优先浏览器拉清单（本机 Python 常被 WinError 10054 掐断）
    try {
      data = await checkAppUpdateViaBrowser();
    } catch (browserErr) {
      const res = await fetch("/api/update/check", { cache: "no-store" });
      data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        throw new Error(
          data.error || browserErr?.message || "检查失败"
        );
      }
    }
    await refreshAppVersionLabel();
    if (data.hasUpdate) {
      if (manual) setUpdateStatus(`发现新版本 ${data.latestVersion}`, "ok");
      showUpdatePrompt(data, { force: manual });
    } else if (manual) {
      setUpdateStatus(`已是最新（v${data.currentVersion || "?"}）`, "ok");
    }
    return data;
  } catch (err) {
    const msg = String(err?.message || "检查更新失败");
    if (manual) {
      setUpdateStatus(
        /10054|强迫关闭|Failed to fetch|NetworkError|连不上/i.test(msg)
          ? "连不上更新服务器，请换网络或关 VPN 后再试"
          : msg,
        "error"
      );
    }
    return null;
  }
}

async function applyAppUpdate() {
  if (!pendingUpdateInfo?.patchUrl && !pendingUpdateInfo?.installerUrl) {
    setUpdateStatus("缺少更新地址", "error");
    return;
  }
  if (els.updateNowBtn) els.updateNowBtn.disabled = true;
  if (els.updateLaterBtn) els.updateLaterBtn.disabled = true;
  const mode = pendingUpdateInfo.patchUrl ? "补丁" : "安装包";
  setUpdateStatus(`正在下载并安装${mode}更新，请稍候…`, "ok");
  if (els.updateMsg) {
    els.updateMsg.textContent = "正在下载更新并覆盖，完成后会自动重启。请勿关闭。";
  }
  try {
    let data = null;
    if (pendingUpdateInfo.patchUrl) {
      try {
        const dl = await fetch(withCacheBust(pendingUpdateInfo.patchUrl), {
          cache: "no-store"
        });
        if (!dl.ok) throw new Error(`下载补丁失败(${dl.status})`);
        const blob = await dl.blob();
        if (!blob || blob.size < 32) throw new Error("补丁文件无效");
        const fd = new FormData();
        fd.append("file", blob, "ludong-patch.zip");
        const latestQ = encodeURIComponent(
          String(pendingUpdateInfo.latestVersion || "")
        );
        const res = await fetch(
          `/api/update/apply-upload?latestVersion=${latestQ}`,
          { method: "POST", body: fd }
        );
        data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) {
          throw new Error(data.error || "应用补丁失败");
        }
      } catch (browserApplyErr) {
        // 回退：仍走本机 Python 下载
        const res = await fetch("/api/update/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patchUrl: pendingUpdateInfo.patchUrl || "",
            installerUrl: pendingUpdateInfo.installerUrl || ""
          })
        });
        data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) {
          throw new Error(
            data.error || browserApplyErr?.message || "更新失败"
          );
        }
      }
    } else {
      const res = await fetch("/api/update/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patchUrl: "",
          installerUrl: pendingUpdateInfo.installerUrl || ""
        })
      });
      data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "更新失败");
      }
    }
    setUpdateStatus(data.message || "正在重启…", "ok");
    shutdownUiForUpdateRestart();
  } catch (err) {
    const msg = String(err?.message || "更新失败");
    setUpdateStatus(
      /10054|强迫关闭|Failed to fetch|NetworkError/i.test(msg)
        ? "下载更新失败：网络被断开，请换网络后重试"
        : msg,
      "error"
    );
    if (els.updateNowBtn) els.updateNowBtn.disabled = false;
    if (els.updateLaterBtn) els.updateLaterBtn.disabled = false;
  }
}

let wallpaperSelectedId = "";

function setWallpaperStatus(text, kind = "") {
  if (!els.wallpaperStatus) return;
  els.wallpaperStatus.textContent = text || "";
  els.wallpaperStatus.classList.toggle("is-error", kind === "error");
  els.wallpaperStatus.classList.toggle("is-ok", kind === "ok");
}

function setWallpaperBusy(busy) {
  [els.wallpaperPickBtn, els.wallpaperApplyBtn, els.wallpaperRestoreBtn].forEach((btn) => {
    if (btn) btn.disabled = !!busy;
  });
}

function renderWallpaperLibrary(data) {
  const items = Array.isArray(data?.items) ? data.items : [];
  wallpaperSelectedId = String(data?.selectedId || wallpaperSelectedId || items[0]?.id || "");
  if (els.wallpaperLibraryEmpty) {
    els.wallpaperLibraryEmpty.hidden = items.length > 0;
  }
  if (!els.wallpaperLibraryGrid) return;
  els.wallpaperLibraryGrid.innerHTML = items
    .map((item) => {
      const selected = item.id === wallpaperSelectedId;
      return `<button type="button" class="wallpaper-library-item${selected ? " is-selected" : ""}" data-wall-id="${escapeHtml(item.id)}" title="${escapeHtml(item.name || "壁纸")}">
        <img src="${escapeHtml(item.previewUrl || "")}" alt="" />
        <span class="wallpaper-library-del" data-wall-del="${escapeHtml(item.id)}" title="删除">×</span>
      </button>`;
    })
    .join("");
  if (els.wallpaperApplyBtn) els.wallpaperApplyBtn.disabled = !wallpaperSelectedId;
  if (els.wallpaperRestoreBtn) els.wallpaperRestoreBtn.disabled = !data?.canRestore;
}

function applyWallpaperStatus(data) {
  if (!data) return;
  const w = data.screenWidth || 0;
  const h = data.screenHeight || 0;
  if (els.wallpaperScreenHint && w && h) {
    els.wallpaperScreenHint.textContent = `屏幕 ${w}×${h}`;
  }
  renderWallpaperLibrary(data);
}

async function refreshWallpaperStatus({ silent = true } = {}) {
  try {
    const res = await fetch("/api/wallpaper/status", { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) {
      throw new Error(data.error || "无法读取壁纸状态");
    }
    applyWallpaperStatus(data);
    return data;
  } catch (err) {
    if (!silent) {
      setWallpaperStatus(err?.message || "读取壁纸状态失败", "error");
    }
    return null;
  }
}

async function uploadWallpaperFile(file) {
  if (!file) return;
  setWallpaperBusy(true);
  setWallpaperStatus("正在加入壁纸库…");
  try {
    const probe = await fetch("/api/wallpaper/status", { cache: "no-store" });
    if (probe.status === 404) {
      throw new Error("当前程序还是旧服务，请完全退出后重新打开播放器再试");
    }
    const fd = new FormData();
    fd.append("files", file, file.name || "wallpaper.jpg");
    const res = await fetch("/api/wallpaper/upload", { method: "POST", body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      throw new Error(data.error || (res.status === 404 ? "壁纸接口不可用，请重启播放器" : "上传失败"));
    }
    applyWallpaperStatus(data);
    setWallpaperStatus(data.message || "已加入壁纸库，可选中后设为桌面壁纸", "ok");
  } catch (err) {
    setWallpaperStatus(err?.message || "上传失败", "error");
  } finally {
    setWallpaperBusy(false);
    await refreshWallpaperStatus({ silent: true });
  }
}

async function selectWallpaperItem(id) {
  if (!id) return;
  setWallpaperBusy(true);
  try {
    const res = await fetch("/api/wallpaper/select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) throw new Error(data.error || "选择失败");
    applyWallpaperStatus(data);
    setWallpaperStatus("已选中，可点「设为桌面壁纸」", "ok");
  } catch (err) {
    setWallpaperStatus(err?.message || "选择失败", "error");
  } finally {
    setWallpaperBusy(false);
  }
}

async function deleteWallpaperItem(id) {
  if (!id) return;
  setWallpaperBusy(true);
  try {
    const res = await fetch("/api/wallpaper/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) throw new Error(data.error || "删除失败");
    applyWallpaperStatus(data);
    setWallpaperStatus("已从壁纸库删除", "ok");
  } catch (err) {
    setWallpaperStatus(err?.message || "删除失败", "error");
  } finally {
    setWallpaperBusy(false);
  }
}

async function applyDesktopWallpaper() {
  if (!wallpaperSelectedId) {
    setWallpaperStatus("请先选中一张壁纸", "error");
    return;
  }
  setWallpaperBusy(true);
  setWallpaperStatus("正在设为桌面壁纸…");
  try {
    const res = await fetch("/api/wallpaper/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: wallpaperSelectedId })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      throw new Error(data.error || "设置失败");
    }
    applyWallpaperStatus(data);
    setWallpaperStatus(data.message || "已设为桌面壁纸", "ok");
  } catch (err) {
    setWallpaperStatus(err?.message || "设置失败", "error");
  } finally {
    setWallpaperBusy(false);
    await refreshWallpaperStatus({ silent: true });
  }
}

async function restoreDesktopWallpaper() {
  setWallpaperBusy(true);
  setWallpaperStatus("正在还原原壁纸…");
  try {
    const res = await fetch("/api/wallpaper/restore", { method: "POST", body: "{}" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      throw new Error(data.error || "还原失败");
    }
    applyWallpaperStatus(data);
    setWallpaperStatus(data.message || "已还原原壁纸", "ok");
  } catch (err) {
    setWallpaperStatus(err?.message || "还原失败", "error");
  } finally {
    setWallpaperBusy(false);
    await refreshWallpaperStatus({ silent: true });
  }
}

els.wallpaperPickBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  if (!els.wallpaperFileInput) return;
  els.wallpaperFileInput.value = "";
  els.wallpaperFileInput.click();
});

els.wallpaperFileInput?.addEventListener("change", () => {
  const file = els.wallpaperFileInput?.files?.[0];
  if (file) uploadWallpaperFile(file);
});

els.wallpaperLibraryGrid?.addEventListener("click", (e) => {
  const del = e.target.closest("[data-wall-del]");
  if (del) {
    e.preventDefault();
    e.stopPropagation();
    deleteWallpaperItem(del.dataset.wallDel || "");
    return;
  }
  const item = e.target.closest("[data-wall-id]");
  if (!item) return;
  selectWallpaperItem(item.dataset.wallId || "");
});

els.wallpaperApplyBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  applyDesktopWallpaper();
});

els.wallpaperRestoreBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  restoreDesktopWallpaper();
});

if (IS_LOCAL_HOST) {
  refreshWallpaperStatus({ silent: true });
}

els.checkUpdateBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  if (!IS_LOCAL_HOST) return;
  checkAppUpdate({ manual: true });
});

els.updateLaterBtn?.addEventListener("click", () => {
  if (pendingUpdateInfo?.latestVersion) {
    skipUpdateVersion(pendingUpdateInfo.latestVersion);
  }
  setUpdateLayerOpen(false);
});

els.updateNowBtn?.addEventListener("click", () => {
  applyAppUpdate();
});

els.updateBackdrop?.addEventListener("click", () => {
  if (pendingUpdateInfo?.mandatory) return;
  if (pendingUpdateInfo?.latestVersion) {
    skipUpdateVersion(pendingUpdateInfo.latestVersion);
  }
  setUpdateLayerOpen(false);
});

if (IS_LOCAL_HOST) {
  refreshAppVersionLabel();
  setTimeout(() => {
    checkAppUpdate({ manual: false });
  }, 2500);
}
