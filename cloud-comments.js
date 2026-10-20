/* 猫耳律动 · 云端账号与评论（邮箱登录，无需匿名游客） */
(function (global) {
  const SESSION_KEY = "ludong-sb-session-v1";
  const DISPLAY_NAME_KEY = "ludong-display-name-v1";
  const ACTIVE_UID_KEY = "ludong-active-user-id-v1";
  const AVATAR_KEY = "ludong-avatar-v1";
  const LAST_EMAIL_KEY = "ludong-last-email-v1";
  const PROFILE_CACHE_KEY = "ludong-profile-cache-v1";

  const AVATAR_PRESETS = [
    { id: "preset:1", bg: "#e8a54b", inner: "#fff6e8", mark: "猫" },
    { id: "preset:2", bg: "#d97884", inner: "#fff0f2", mark: "耳" },
    { id: "preset:3", bg: "#6fa7c2", inner: "#eef7fb", mark: "律" },
    { id: "preset:4", bg: "#7db58a", inner: "#eef8f0", mark: "动" },
    { id: "preset:5", bg: "#b894d4", inner: "#f6eefc", mark: "月" },
    { id: "preset:6", bg: "#d4a06a", inner: "#fff4e6", mark: "星" },
    { id: "preset:7", bg: "#5f9aa8", inner: "#e8f5f7", mark: "夜" },
    { id: "preset:8", bg: "#c98b8b", inner: "#fbeeee", mark: "眠" }
  ];

  function avatarKeyFor(uid) {
    const id = String(uid || "").trim();
    return id ? `${AVATAR_KEY}:${id}` : AVATAR_KEY;
  }

  function formatUserNo(n) {
    if (n == null || n === "") return "";
    const num = Number(n);
    // 允许 000000（第一个注册用户）
    if (!Number.isFinite(num) || num < 0) return "";
    return String(Math.floor(num)).padStart(6, "0");
  }

  function parseUserNo(n) {
    if (n == null || n === "") return null;
    const num = Number(n);
    if (!Number.isFinite(num) || num < 0) return null;
    return Math.floor(num);
  }

  /** 用户号是否在 000000–000010（可设专属头衔 / 金色） */
  function isVipUserNo(n) {
    const num = parseUserNo(n);
    return num != null && num <= 10;
  }

  function isCreatorUserNo(n) {
    return parseUserNo(n) === 0;
  }

  function resolveHonorTitle(userNo, stored) {
    const t = String(stored || "").trim().slice(0, 12);
    if (t) return t;
    if (isCreatorUserNo(userNo)) return "创世神";
    return "";
  }

  function vipToneClass(userNo) {
    if (isCreatorUserNo(userNo)) return "is-obsidian";
    if (isVipUserNo(userNo)) return "is-gold";
    return "";
  }

  function presetSvg(preset) {
    const p = preset || AVATAR_PRESETS[0];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
      <rect width="80" height="80" rx="22" fill="${p.bg}"/>
      <polygon points="18,32 22,8 38,26" fill="${p.inner}"/>
      <polygon points="62,32 58,8 42,26" fill="${p.inner}"/>
      <circle cx="40" cy="46" r="22" fill="${p.inner}"/>
      <circle cx="32" cy="44" r="3.2" fill="${p.bg}"/>
      <circle cx="48" cy="44" r="3.2" fill="${p.bg}"/>
      <path d="M34 54 Q40 58 46 54" fill="none" stroke="${p.bg}" stroke-width="2.2" stroke-linecap="round"/>
    </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  function avatarSrc(avatarUrl, name) {
    const raw = String(avatarUrl || "").trim();
    if (raw.startsWith("data:") || /^https?:\/\//i.test(raw)) return raw;
    const preset = AVATAR_PRESETS.find((p) => p.id === raw);
    if (preset) return presetSvg(preset);
    const ch = String(name || "猫").trim().charAt(0) || "猫";
    const fallback = AVATAR_PRESETS[(ch.charCodeAt(0) || 1) % AVATAR_PRESETS.length];
    return presetSvg(fallback);
  }

  function getAvatar() {
    const uid = getActiveUserId();
    try {
      const v = localStorage.getItem(avatarKeyFor(uid));
      if (v && v.trim()) return v.trim();
    } catch {
      /* ignore */
    }
    const session = readSession();
    const meta = session?.user?.user_metadata || {};
    if (meta.avatar_url) return String(meta.avatar_url);
    const cached = readProfileCache();
    if (cached?.avatarUrl) return cached.avatarUrl;
    return AVATAR_PRESETS[0].id;
  }

  function setAvatar(url) {
    const v = String(url || "").trim() || AVATAR_PRESETS[0].id;
    const uid = getActiveUserId();
    try {
      localStorage.setItem(avatarKeyFor(uid), v);
    } catch {
      /* ignore */
    }
    return v;
  }

  function readProfileCache() {
    try {
      const raw = localStorage.getItem(PROFILE_CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function writeProfileCache(profile) {
    try {
      if (!profile) localStorage.removeItem(PROFILE_CACHE_KEY);
      else localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profile));
    } catch {
      /* ignore */
    }
    return profile;
  }

  function getLastEmail() {
    try {
      return localStorage.getItem(LAST_EMAIL_KEY) || "";
    } catch {
      return "";
    }
  }

  function setLastEmail(email) {
    try {
      const v = String(email || "").trim();
      if (v) localStorage.setItem(LAST_EMAIL_KEY, v);
    } catch {
      /* ignore */
    }
  }

  function cfg() {
    return global.LUDONG_CLOUD || null;
  }

  function cloudEnabled() {
    const c = cfg();
    return !!(c && c.enabled && c.url && c.anonKey);
  }

  function setActiveUserId(uid) {
    const id = String(uid || "").trim();
    try {
      if (id) localStorage.setItem(ACTIVE_UID_KEY, id);
      else localStorage.removeItem(ACTIVE_UID_KEY);
    } catch {
      /* ignore */
    }
    return id;
  }

  function getActiveUserId() {
    try {
      const id = localStorage.getItem(ACTIVE_UID_KEY);
      if (id && id.trim()) return id.trim();
    } catch {
      /* ignore */
    }
    return currentUserIdSync();
  }

  function displayNameKeyFor(uid) {
    const id = String(uid || "").trim();
    return id ? `${DISPLAY_NAME_KEY}:${id}` : DISPLAY_NAME_KEY;
  }

  function getDisplayName() {
    const uid = getActiveUserId();
    try {
      const name = localStorage.getItem(displayNameKeyFor(uid));
      if (name && name.trim()) return name.trim().slice(0, 24);
      // 兼容旧的未分账号昵称
      const legacy = localStorage.getItem(DISPLAY_NAME_KEY);
      if (legacy && legacy.trim()) return legacy.trim().slice(0, 24);
    } catch {
      /* ignore */
    }
    const session = readSession();
    const meta = session?.user?.user_metadata || {};
    if (meta.display_name) return String(meta.display_name).slice(0, 24);
    const email = session?.user?.email || "";
    if (email.includes("@")) return email.split("@")[0].slice(0, 24);
    return "用户";
  }

  function setDisplayName(name) {
    const n = String(name || "").trim().slice(0, 24);
    const uid = getActiveUserId();
    try {
      if (n) {
        localStorage.setItem(displayNameKeyFor(uid), n);
        localStorage.setItem(DISPLAY_NAME_KEY, n); // 兼容旧读取
      }
    } catch {
      /* ignore */
    }
    return n || getDisplayName();
  }

  function readSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function writeSession(session) {
    try {
      if (!session) localStorage.removeItem(SESSION_KEY);
      else localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      /* ignore */
    }
  }

  function sessionValid(session) {
    if (!session || !session.access_token) return false;
    const exp = Number(session.expires_at) || 0;
    const ms = exp > 1e12 ? exp : exp * 1000;
    return ms > Date.now() + 30_000;
  }

  function decodeJwtPayload(token) {
    try {
      const part = String(token || "").split(".")[1];
      if (!part) return null;
      const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
      const pad = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
      const raw = atob(pad);
      // 兼容中文 email 等
      try {
        return JSON.parse(decodeURIComponent(escape(raw)));
      } catch {
        return JSON.parse(raw);
      }
    } catch {
      return null;
    }
  }

  function userFromAuthData(data) {
    let user = data?.user || null;
    if (user?.id) return user;
    const payload = decodeJwtPayload(data?.access_token);
    if (payload?.sub) {
      return {
        ...(user || {}),
        id: String(payload.sub),
        email: user?.email || payload.email || ""
      };
    }
    return user;
  }

  function normalizeSession(data) {
    const user = userFromAuthData(data);
    const session = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at:
        data.expires_at ||
        Math.floor(Date.now() / 1000) + Number(data.expires_in || 3600),
      user
    };
    if (!session.access_token) throw new Error("登录失败：无 access_token");
    if (!session.user?.id) {
      throw new Error("登录失败：无法识别账号 ID，请重试");
    }
    writeSession(session);
    setActiveUserId(session.user.id);
    return session;
  }

  function isNetworkAuthError(err) {
    const raw = String(err?.message || err || "");
    const lower = raw.toLowerCase();
    return (
      lower.includes("failed to fetch") ||
      lower.includes("networkerror") ||
      lower.includes("load failed") ||
      lower.includes("network request failed") ||
      lower.includes("connection") ||
      lower.includes("连接") ||
      lower.includes("timeout") ||
      lower.includes("aborted") ||
      lower.includes("连不上云端") ||
      err?.name === "AbortError" ||
      err?.name === "TypeError"
    );
  }

  function friendlyAuthError(err) {
    const raw = String(err?.message || err || "");
    if (isNetworkAuthError(err)) {
      return "连不上云端（网络不稳或访问不了 supabase.co）。可先点「先听本地歌」，有网后再登录。";
    }
    return raw;
  }

  async function fetchWithRetry(url, options, retries = 2, timeoutMs = 18000) {
    let lastErr;
    for (let i = 0; i <= retries; i += 1) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), timeoutMs);
      try {
        const res = await fetch(url, { ...options, signal: ctrl.signal });
        clearTimeout(timer);
        return res;
      } catch (err) {
        clearTimeout(timer);
        lastErr = err;
        if (i < retries) {
          await new Promise((r) => setTimeout(r, 400 * (i + 1)));
        }
      }
    }
    throw lastErr;
  }

  async function authRequest(path, { method = "POST", body, token } = {}) {
    const c = cfg();
    const headers = {
      apikey: c.anonKey
    };
    if (method !== "GET" && method !== "HEAD") {
      headers["Content-Type"] = "application/json";
    }
    // 新版 publishable key 不是 JWT，未登录时不要塞进 Authorization
    if (token) headers.Authorization = `Bearer ${token}`;
    // 登录/刷新：快速失败，避免按钮转圈几十秒像「卡死」
    const isAuthToken = String(path || "").includes("/auth/v1/token");
    let res;
    try {
      res = await fetchWithRetry(
        `${c.url}${path}`,
        {
          method,
          headers,
          body:
            body == null || method === "GET" || method === "HEAD"
              ? undefined
              : JSON.stringify(body)
        },
        isAuthToken ? 1 : 2,
        isAuthToken ? 8000 : 18000
      );
    } catch (err) {
      throw new Error(friendlyAuthError(err));
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg =
        data?.error_description ||
        data?.msg ||
        data?.error ||
        data?.message ||
        `认证失败(${res.status})`;
      throw new Error(String(msg));
    }
    return data;
  }

  async function refreshSession() {
    const old = readSession();
    if (!old?.refresh_token) return null;
    try {
      const data = await authRequest("/auth/v1/token?grant_type=refresh_token", {
        method: "POST",
        body: { refresh_token: old.refresh_token }
      });
      return normalizeSession({ ...data, user: data.user || old.user });
    } catch (err) {
      // 断网 / 超时：必须保留本地会话，否则一刷新就卡死在登录页
      // 即便 refresh_token 作废，也留下 access_token + user，至少能进本地私人库
      if (!isNetworkAuthError(err)) {
        const kept = hydrateSessionUser(readSession());
        if (kept?.user?.id) {
          try {
            writeSession({
              ...kept,
              refresh_token: "",
              _refreshFailedAt: Date.now()
            });
          } catch {
            /* ignore */
          }
        }
      }
      return null;
    }
  }

  function hydrateSessionUser(session) {
    if (!session) return session;
    if (!session.user?.id && session.access_token) {
      const payload = decodeJwtPayload(session.access_token);
      if (payload?.sub) {
        session.user = {
          ...(session.user || {}),
          id: String(payload.sub),
          email: session.user?.email || payload.email || ""
        };
        writeSession(session);
      }
    }
    return session;
  }

  async function ensureAuthSession() {
    if (!cloudEnabled()) throw new Error("云端未配置");
    let session = hydrateSessionUser(readSession());
    // 本地已有账号：立刻放行，不要同步死等 supabase（国内常被重置，一刷就卡登录页）
    if (session?.user?.id) {
      setActiveUserId(session.user.id);
      if (!sessionValid(session) && session.refresh_token) {
        refreshSession().catch(() => {});
      }
      return session;
    }
    if (session?.refresh_token) {
      const refreshed = await refreshSession();
      if (sessionValid(refreshed) && refreshed.user?.id) {
        setActiveUserId(refreshed.user.id);
        return refreshed;
      }
    }
    session = hydrateSessionUser(readSession());
    if (session?.user?.id) {
      setActiveUserId(session.user.id);
      return session;
    }
    throw new Error("请先登录账号");
  }

  function isLoggedIn() {
    return sessionValid(readSession());
  }

  async function signUp({ email, password, displayName, avatarUrl }) {
    if (!cloudEnabled()) throw new Error("云端未配置");
    const mail = String(email || "").trim();
    const pass = String(password || "");
    const name = String(displayName || "").trim();
    if (!name) throw new Error("请填写昵称");
    if (name.length < 2) throw new Error("昵称至少 2 个字");
    if (!mail) throw new Error("请填写邮箱");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) throw new Error("邮箱格式不正确");
    if (!pass) throw new Error("请填写密码");
    if (pass.length < 6) throw new Error("密码至少 6 位");
    const avatar = setAvatar(avatarUrl || AVATAR_PRESETS[0].id);
    setDisplayName(name);

    const data = await authRequest("/auth/v1/signup", {
      method: "POST",
      body: {
        email: mail,
        password: pass,
        data: { display_name: name, avatar_url: metaSafeAvatar(avatar) }
      }
    });

    // 若开启了邮箱确认，可能没有 session
    if (data.access_token) {
      const session = normalizeSession(data);
      setLastEmail(mail);
      await upsertMyProfile({ avatarUrl: avatar, displayName: name }).catch(() => {});
      await fetchMyProfile().catch(() => {});
      return session;
    }
    if (data.user && !data.access_token) {
      throw new Error(
        "注册成功，但需要邮箱确认。请到 Supabase → Authentication → Providers → Email，关闭 Confirm email 后再试登录"
      );
    }
    // 有的环境 signup 后需立刻 password grant
    return signIn({ email: mail, password: pass, avatarUrl: avatar });
  }

  async function signIn({ email, password, avatarUrl }) {
    if (!cloudEnabled()) throw new Error("云端未配置");
    const mail = String(email || "").trim();
    const pass = String(password || "");
    if (!mail || !pass) throw new Error("请填写邮箱和密码");
    const data = await authRequest("/auth/v1/token?grant_type=password", {
      method: "POST",
      body: { email: mail, password: pass }
    });
    // 有的环境 token 接口不带 user，再拉一次 /auth/v1/user
    if (!data.user && data.access_token) {
      try {
        const me = await authRequest("/auth/v1/user", {
          method: "GET",
          token: data.access_token
        });
        if (me?.id) data.user = me;
      } catch {
        /* JWT sub 兜底 */
      }
    }
    const session = normalizeSession(data);
    setLastEmail(mail);
    const meta = session.user?.user_metadata || {};
    if (meta.display_name) setDisplayName(meta.display_name);
    if (meta.avatar_url) setAvatar(meta.avatar_url);
    else if (avatarUrl) setAvatar(avatarUrl);
    await upsertMyProfile().catch(() => {});
    await fetchMyProfile().catch(() => {});
    return session;
  }

  function signOut() {
    writeSession(null);
    setActiveUserId("");
    writeProfileCache(null);
  }

  async function currentUserId() {
    const session = await ensureAuthSession();
    return session.user?.id || "";
  }

  async function upsertMyProfile({ avatarUrl, displayName } = {}) {
    const session = await ensureAuthSession();
    const id = session.user?.id;
    if (!id) return;
    const email = session.user?.email || "";
    const display_name = String(displayName || getDisplayName()).trim().slice(0, 24);
    let avatar = String(avatarUrl || getAvatar() || "").trim();
    avatar = await resolveCloudAvatar(avatar);
    const body = {
      id,
      display_name,
      email,
      updated_at: new Date().toISOString()
    };
    if (avatar) body.avatar_url = avatar;
    await rest("profiles?on_conflict=id", {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=minimal",
      body
    });
    if (display_name) setDisplayName(display_name);
    if (avatar) setAvatar(avatar);
  }

  async function fetchMyProfile() {
    const me = await currentUserId();
    let rows;
    try {
      rows = await rest(
        `profiles?id=eq.${encodeURIComponent(me)}&select=id,display_name,email,avatar_url,user_no,honor_title,created_at`
      );
    } catch {
      try {
        rows = await rest(
          `profiles?id=eq.${encodeURIComponent(me)}&select=id,display_name,email,avatar_url,user_no,created_at`
        );
      } catch {
        rows = await rest(
          `profiles?id=eq.${encodeURIComponent(me)}&select=id,display_name,email`
        );
      }
    }
    const row = Array.isArray(rows) ? rows[0] : rows;
    if (!row) return readProfileCache();
    let avatarUrl = String(row.avatar_url || getAvatar() || "");
    // 过大的旧 base64 或需迁到更短形式
    if (avatarUrl.startsWith("data:image/") && avatarUrl.length > 14000) {
      try {
        avatarUrl = await resolveCloudAvatar(avatarUrl);
        await rest(`profiles?id=eq.${encodeURIComponent(me)}`, {
          method: "PATCH",
          prefer: "return=minimal",
          body: { avatar_url: avatarUrl, updated_at: new Date().toISOString() }
        });
      } catch {
        /* 保留原值 */
      }
    }
    const userNo = parseUserNo(row.user_no);
    const honorRaw = row.honor_title != null ? String(row.honor_title) : "";
    const profile = {
      id: String(row.id || me),
      name: String(row.display_name || getDisplayName()),
      email: String(row.email || ""),
      avatarUrl,
      userNo: userNo == null ? null : userNo,
      userNoLabel: formatUserNo(row.user_no),
      honorTitle: honorRaw,
      honorTitleDisplay: resolveHonorTitle(row.user_no, honorRaw)
    };
    if (profile.name) setDisplayName(profile.name);
    if (profile.avatarUrl) setAvatar(profile.avatarUrl);
    return writeProfileCache(profile);
  }

  async function getMyProfile() {
    const cached = readProfileCache();
    if (
      cached?.id &&
      cached.id === getActiveUserId() &&
      cached.avatarUrl &&
      !String(cached.avatarUrl).startsWith("data:")
    ) {
      return cached;
    }
    try {
      return await fetchMyProfile();
    } catch {
      return cached;
    }
  }

  async function updateMyProfile({ displayName, avatarUrl, honorTitle } = {}) {
    const session = await ensureAuthSession();
    const id = session.user?.id;
    if (!id) throw new Error("请先登录");
    const name = displayName != null ? String(displayName).trim().slice(0, 24) : getDisplayName();
    if (!name || name.length < 2) throw new Error("昵称至少 2 个字");
    let avatar = avatarUrl != null ? String(avatarUrl).trim() : getAvatar();
    avatar = await resolveCloudAvatar(avatar);
    const cached = readProfileCache();
    let userNo = cached?.userNo;
    if (userNo == null || !cached?.userNoLabel) {
      try {
        const fresh = await fetchMyProfile();
        userNo = fresh?.userNo;
      } catch {
        /* ignore */
      }
    }
    const body = {
      display_name: name,
      avatar_url: avatar,
      updated_at: new Date().toISOString()
    };
    if (honorTitle != null) {
      if (!isVipUserNo(userNo)) {
        throw new Error("当前账号无法设置专属头衔");
      }
      body.honor_title = String(honorTitle || "").trim().slice(0, 12);
    }
    try {
      await rest(`profiles?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        prefer: "return=minimal",
        body
      });
    } catch (err) {
      if (body.honor_title != null && /honor_title|column|schema cache/i.test(String(err?.message || ""))) {
        const { honor_title: _drop, ...restBody } = body;
        await rest(`profiles?id=eq.${encodeURIComponent(id)}`, {
          method: "PATCH",
          prefer: "return=minimal",
          body: restBody
        });
      } else {
        throw err;
      }
    }
    setDisplayName(name);
    if (avatar) setAvatar(avatar);
    try {
      await authRequest("/auth/v1/user", {
        method: "PUT",
        token: session.access_token,
        body: { data: { display_name: name, avatar_url: metaSafeAvatar(avatar) } }
      });
    } catch {
      /* metadata 失败不影响资料表 */
    }
    return fetchMyProfile();
  }

  async function updatePassword(currentPassword, newPassword) {
    const session = await ensureAuthSession();
    const email = session.user?.email || "";
    const cur = String(currentPassword || "");
    const next = String(newPassword || "");
    if (!cur) throw new Error("请填写当前密码");
    if (next.length < 6) throw new Error("新密码至少 6 位");
    if (cur === next) throw new Error("新密码不能和当前密码相同");
    await authRequest("/auth/v1/token?grant_type=password", {
      method: "POST",
      body: { email, password: cur }
    });
    await authRequest("/auth/v1/user", {
      method: "PUT",
      token: session.access_token,
      body: { password: next }
    });
    return true;
  }

  async function lookupLoginPreview(email) {
    const mail = String(email || "").trim();
    if (!cloudEnabled() || mail.length < 5) return null;
    const c = cfg();
    try {
      const res = await fetch(`${c.url}/rest/v1/rpc/lookup_login_preview`, {
        method: "POST",
        headers: {
          apikey: c.anonKey,
          Authorization: `Bearer ${c.anonKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ p_email: mail })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) return null;
      const row = Array.isArray(data) ? data[0] : data;
      if (!row) return null;
      return {
        name: String(row.display_name || ""),
        avatarUrl: String(row.avatar_url || ""),
        userNo: parseUserNo(row.user_no),
        userNoLabel: formatUserNo(row.user_no)
      };
    } catch {
      return null;
    }
  }

  async function rest(pathQuery, { method = "GET", body, prefer } = {}) {
    const c = cfg();
    const session = await ensureAuthSession();
    const headers = {
      apikey: c.anonKey,
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json"
    };
    if (prefer) headers.Prefer = prefer;
    const res = await fetch(`${c.url}/rest/v1/${pathQuery}`, {
      method,
      headers,
      body: body == null ? undefined : JSON.stringify(body)
    });
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    if (!res.ok) {
      const msg =
        (data && (data.message || data.error || data.hint)) ||
        `云端请求失败(${res.status})`;
      if (res.status === 401) writeSession(null);
      throw new Error(String(msg));
    }
    return data;
  }

  function mapRow(row) {
    if (!row) return null;
    const userNoRaw = row.user_no != null ? row.user_no : row._userNo;
    const honorRaw =
      row.honor_title != null
        ? String(row.honor_title)
        : row._honorTitle != null
          ? String(row._honorTitle)
          : "";
    return {
      id: String(row.id || ""),
      text: String(row.body || ""),
      author: String(row.author_name || "用户"),
      time: row.created_at ? Date.parse(row.created_at) || Date.now() : Date.now(),
      likes: Number(row.likes) || 0,
      hearts: Number(row.hearts) || 0,
      liked: false,
      hearted: false,
      userId: row.user_id || "",
      parentId: row.parent_id ? String(row.parent_id) : "",
      avatarUrl: String(row.avatar_url || row._avatarUrl || ""),
      userNo: parseUserNo(userNoRaw),
      userNoLabel: formatUserNo(userNoRaw),
      honorTitle: honorRaw,
      honorTitleDisplay: resolveHonorTitle(userNoRaw, honorRaw),
      cloud: true
    };
  }

  async function attachProfileMeta(rows) {
    const list = Array.isArray(rows) ? rows : [];
    const ids = [
      ...new Set(list.map((r) => r && r.user_id).filter(Boolean).map(String))
    ];
    if (!ids.length) return list.map(mapRow).filter(Boolean);
    let map = new Map();
    try {
      let profiles;
      try {
        profiles = await rest(
          `profiles?id=in.(${ids.map(encodeURIComponent).join(",")})&select=id,avatar_url,display_name,user_no,honor_title`
        );
      } catch {
        profiles = await rest(
          `profiles?id=in.(${ids.map(encodeURIComponent).join(",")})&select=id,avatar_url,display_name,user_no`
        );
      }
      map = new Map(
        (Array.isArray(profiles) ? profiles : []).map((p) => [String(p.id), p])
      );
    } catch {
      /* 资料扩展未跑也能看评论 */
    }
    return list
      .map((row) => {
        const p = map.get(String(row.user_id || ""));
        return mapRow({
          ...row,
          _avatarUrl: p?.avatar_url || "",
          _userNo: p?.user_no,
          _honorTitle: p?.honor_title || "",
          author_name: row.author_name || p?.display_name || "用户"
        });
      })
      .filter(Boolean);
  }

  async function listComments(songKey) {
    const key = encodeURIComponent(songKey);
    const rows = await rest(
      `song_comments?song_key=eq.${key}&select=*&order=created_at.asc`
    );
    return attachProfileMeta(rows);
  }

  async function addComment({ songKey, title, artist, text, parentId }) {
    const session = await ensureAuthSession();
    const userId = session.user?.id;
    if (!userId) throw new Error("登录状态无效，请重新登录");
    await upsertMyProfile().catch(() => {});
    const body = {
      song_key: songKey,
      song_title: title || "",
      song_artist: artist || "",
      author_name: getDisplayName(),
      body: text,
      user_id: userId,
      likes: 0,
      hearts: 0
    };
    const pid = String(parentId || "").trim();
    if (pid) body.parent_id = pid;
    const rows = await rest("song_comments", {
      method: "POST",
      prefer: "return=representation",
      body
    });
    const row = Array.isArray(rows) ? rows[0] : rows;
    const mapped = mapRow(row);
    if (mapped) {
      mapped.avatarUrl = getAvatar();
      mapped.userNoLabel = readProfileCache()?.userNoLabel || "";
    }
    return mapped;
  }

  async function deleteComment(commentId) {
    const id = encodeURIComponent(commentId);
    await rest(`song_comments?id=eq.${id}`, { method: "DELETE" });
    return true;
  }

  async function reactComment(commentId, { likes, hearts }) {
    const id = encodeURIComponent(commentId);
    const rows = await rest(`song_comments?id=eq.${id}`, {
      method: "PATCH",
      prefer: "return=representation",
      body: {
        likes: Math.max(0, Number(likes) || 0),
        hearts: Math.max(0, Number(hearts) || 0)
      }
    });
    const row = Array.isArray(rows) ? rows[0] : rows;
    return mapRow(row);
  }

  /** 最近心跳多久内算在线（与前端保持一致） */
  const PRESENCE_ONLINE_MS = 90_000;

  function isOnlineFromLastSeen(lastSeenAt) {
    if (!lastSeenAt) return false;
    const t = Date.parse(lastSeenAt);
    return Number.isFinite(t) && Date.now() - t < PRESENCE_ONLINE_MS;
  }

  function mapProfile(p) {
    if (!p) return null;
    const lastSeenAt = p.last_seen_at || p.lastSeenAt || null;
    const honorRaw = p.honor_title != null ? String(p.honor_title) : "";
    return {
      id: String(p.id),
      name: String(p.display_name || p.email || "用户"),
      email: String(p.email || ""),
      avatarUrl: String(p.avatar_url || ""),
      userNo: parseUserNo(p.user_no),
      userNoLabel: formatUserNo(p.user_no),
      honorTitle: honorRaw,
      honorTitleDisplay: resolveHonorTitle(p.user_no, honorRaw),
      remark: String(p.remark || ""),
      lastSeenAt,
      online: isOnlineFromLastSeen(lastSeenAt)
    };
  }

  /** 上报自己在线；需先执行 supabase_presence.sql */
  async function touchPresence() {
    const me = await currentUserId();
    if (!me) return false;
    try {
      await rest("rpc/touch_presence", { method: "POST", body: {} });
      return true;
    } catch {
      try {
        await rest(`profiles?id=eq.${encodeURIComponent(me)}`, {
          method: "PATCH",
          prefer: "return=minimal",
          body: { last_seen_at: new Date().toISOString() }
        });
        return true;
      } catch {
        return false;
      }
    }
  }

  /** 批量查好友 last_seen（轻量） */
  async function listFriendsPresence(ids) {
    const list = [...new Set((ids || []).map(String).filter(Boolean))];
    if (!list.length) return {};
    try {
      const rows = await rest(
        `profiles?id=in.(${list.map(encodeURIComponent).join(",")})&select=id,last_seen_at`
      );
      const out = {};
      (Array.isArray(rows) ? rows : []).forEach((r) => {
        if (!r?.id) return;
        out[String(r.id)] = {
          lastSeenAt: r.last_seen_at || null,
          online: isOnlineFromLastSeen(r.last_seen_at)
        };
      });
      return out;
    } catch {
      return {};
    }
  }

  function escapeIlike(q) {
    return String(q || "")
      .trim()
      .slice(0, 40)
      .replace(/[%_,]/g, "")
      .replace(/,/g, "");
  }

  /** 按昵称/邮箱搜索（最多 15 条，避免全表） */
  async function searchProfiles(query) {
    const me = await currentUserId();
    const q = escapeIlike(query);
    if (q.length < 2) return [];
    const enc = encodeURIComponent(`*${q}*`);
    let rows;
    try {
      rows = await rest(
        `profiles?or=(display_name.ilike.${enc},email.ilike.${enc})&select=id,display_name,email,avatar_url,user_no,honor_title&limit=15`
      );
    } catch {
      rows = await rest(
        `profiles?or=(display_name.ilike.${enc},email.ilike.${enc})&select=id,display_name,email,avatar_url,user_no&limit=15`
      );
    }
    return (Array.isArray(rows) ? rows : [])
      .filter((p) => p && p.id && p.id !== me)
      .map(mapProfile)
      .filter(Boolean);
  }

  /** 仅已通过的好友 */
  async function listFriends() {
    const me = await currentUserId();
    let rows;
    try {
      rows = await rest(
        `friendships?user_id=eq.${encodeURIComponent(me)}&select=friend_id,remark,friend:profiles!friend_id(id,display_name,email,avatar_url,user_no,honor_title,last_seen_at)&order=created_at.desc&limit=200`
      );
    } catch {
      try {
        rows = await rest(
          `friendships?user_id=eq.${encodeURIComponent(me)}&select=friend_id,remark,friend:profiles!friend_id(id,display_name,email,avatar_url,user_no,last_seen_at)&order=created_at.desc&limit=200`
        );
      } catch {
        try {
          rows = await rest(
            `friendships?user_id=eq.${encodeURIComponent(me)}&select=friend_id,remark,friend:profiles!friend_id(id,display_name,email,avatar_url,user_no)&order=created_at.desc&limit=200`
          );
        } catch {
          try {
            rows = await rest(
              `friendships?user_id=eq.${encodeURIComponent(me)}&select=friend_id,friend:profiles!friend_id(id,display_name,email,avatar_url,user_no)&order=created_at.desc&limit=200`
            );
          } catch {
            rows = await rest(
              `friendships?user_id=eq.${encodeURIComponent(me)}&select=friend_id&order=created_at.desc&limit=200`
            );
            const ids = (Array.isArray(rows) ? rows : [])
              .map((r) => r.friend_id)
              .filter(Boolean);
            if (!ids.length) return [];
            let profiles;
            try {
              profiles = await rest(
                `profiles?id=in.(${ids.map(encodeURIComponent).join(",")})&select=id,display_name,email,avatar_url,user_no,honor_title,last_seen_at`
              );
            } catch {
              try {
                profiles = await rest(
                  `profiles?id=in.(${ids.map(encodeURIComponent).join(",")})&select=id,display_name,email,avatar_url,user_no,last_seen_at`
                );
              } catch {
                profiles = await rest(
                  `profiles?id=in.(${ids.map(encodeURIComponent).join(",")})&select=id,display_name,email,avatar_url,user_no`
                );
              }
            }
            const map = new Map(
              (Array.isArray(profiles) ? profiles : []).map((p) => [p.id, p])
            );
            return ids.map((id) => mapProfile(map.get(id) || { id })).filter(Boolean);
          }
        }
      }
    }
    return (Array.isArray(rows) ? rows : [])
      .map((r) => {
        const p = mapProfile(r.friend || { id: r.friend_id });
        if (p) p.remark = String(r.remark || "");
        return p;
      })
      .filter(Boolean);
  }

  async function setFriendRemark(friendId, remark) {
    const me = await currentUserId();
    const id = String(friendId || "").trim();
    if (!id) throw new Error("无效好友");
    const text = String(remark || "").trim().slice(0, 24);
    try {
      await rest(
        `friendships?user_id=eq.${encodeURIComponent(me)}&friend_id=eq.${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          prefer: "return=minimal",
          body: { remark: text }
        }
      );
    } catch (err) {
      const msg = String(err?.message || "");
      if (/remark|column|schema cache/i.test(msg)) {
        throw new Error("请先在 Supabase 执行 supabase_friend_remarks.sql");
      }
      throw err;
    }
    return text;
  }

  async function listFriendRequests() {
    const me = await currentUserId();
    let rows;
    try {
      rows = await rest(
        `friend_requests?or=(from_id.eq.${encodeURIComponent(me)},to_id.eq.${encodeURIComponent(me)})&status=eq.pending&select=id,from_id,to_id,status,created_at,from_profile:profiles!from_id(id,display_name,email,avatar_url,user_no),to_profile:profiles!to_id(id,display_name,email,avatar_url,user_no)&order=created_at.desc&limit=50`
      );
    } catch {
      rows = await rest(
        `friend_requests?or=(from_id.eq.${encodeURIComponent(me)},to_id.eq.${encodeURIComponent(me)})&status=eq.pending&select=id,from_id,to_id,status,created_at&order=created_at.desc&limit=50`
      );
      const list = Array.isArray(rows) ? rows : [];
      const ids = [
        ...new Set(list.flatMap((r) => [r.from_id, r.to_id]).filter(Boolean))
      ];
      let map = new Map();
      if (ids.length) {
        const profiles = await rest(
          `profiles?id=in.(${ids.map(encodeURIComponent).join(",")})&select=id,display_name,email,avatar_url,user_no`
        );
        map = new Map(
          (Array.isArray(profiles) ? profiles : []).map((p) => [p.id, p])
        );
      }
      return list.map((r) => {
        const incoming = String(r.to_id) === me;
        const otherId = incoming ? r.from_id : r.to_id;
        return {
          id: String(r.id),
          incoming,
          status: r.status,
          peer: mapProfile(map.get(otherId) || { id: otherId }),
          time: r.created_at ? Date.parse(r.created_at) || Date.now() : Date.now()
        };
      });
    }
    return (Array.isArray(rows) ? rows : []).map((r) => {
      const incoming = String(r.to_id) === me;
      const other = incoming ? r.from_profile : r.to_profile;
      return {
        id: String(r.id),
        incoming,
        status: r.status,
        peer: mapProfile(other) || {
          id: String(incoming ? r.from_id : r.to_id),
          name: "用户",
          email: ""
        },
        time: r.created_at ? Date.parse(r.created_at) || Date.now() : Date.now()
      };
    });
  }

  async function sendFriendRequest(peerId) {
    const me = await currentUserId();
    const to = String(peerId || "");
    if (!to || to === me) throw new Error("无效的用户");

    // 已是好友
    const existingFriend = await rest(
      `friendships?user_id=eq.${encodeURIComponent(me)}&friend_id=eq.${encodeURIComponent(to)}&select=friend_id&limit=1`
    );
    if (Array.isArray(existingFriend) && existingFriend.length) {
      throw new Error("已经是好友了");
    }

    // 对方是否已向我发过申请 → 直接同意
    const reverse = await rest(
      `friend_requests?from_id=eq.${encodeURIComponent(to)}&to_id=eq.${encodeURIComponent(me)}&status=eq.pending&select=id&limit=1`
    );
    if (Array.isArray(reverse) && reverse[0]?.id) {
      return respondFriendRequest(reverse[0].id, true);
    }

    // 已有自己发出的记录：pending 提示；rejected 重新打开
    const mine = await rest(
      `friend_requests?from_id=eq.${encodeURIComponent(me)}&to_id=eq.${encodeURIComponent(to)}&select=id,status&limit=1`
    );
    if (Array.isArray(mine) && mine[0]) {
      if (mine[0].status === "pending") throw new Error("申请已发送，等待对方同意");
      if (mine[0].status === "accepted") throw new Error("已经是好友了");
      const rows = await rest(
        `friend_requests?id=eq.${encodeURIComponent(mine[0].id)}`,
        {
          method: "PATCH",
          prefer: "return=representation",
          body: { status: "pending", updated_at: new Date().toISOString() }
        }
      );
      return Array.isArray(rows) ? rows[0] : rows;
    }

    const rows = await rest("friend_requests", {
      method: "POST",
      prefer: "return=representation",
      body: { from_id: me, to_id: to, status: "pending" }
    });
    return Array.isArray(rows) ? rows[0] : rows;
  }

  async function respondFriendRequest(requestId, accept) {
    const me = await currentUserId();
    const id = encodeURIComponent(requestId);
    const rows = await rest(`friend_requests?id=eq.${id}&to_id=eq.${encodeURIComponent(me)}`, {
      method: "PATCH",
      prefer: "return=representation",
      body: {
        status: accept ? "accepted" : "rejected",
        updated_at: new Date().toISOString()
      }
    });
    const row = Array.isArray(rows) ? rows[0] : rows;
    if (!row) throw new Error(accept ? "同意失败（申请不存在）" : "已忽略");
    return row;
  }

  async function cancelFriendRequest(requestId) {
    const me = await currentUserId();
    const id = encodeURIComponent(requestId);
    await rest(
      `friend_requests?id=eq.${id}&from_id=eq.${encodeURIComponent(me)}&status=eq.pending`,
      { method: "DELETE" }
    );
    return true;
  }

  /** @deprecated 全量用户列表已废弃，请用 listFriends / searchProfiles */
  async function listProfiles() {
    return listFriends();
  }

  async function listMessagesWith(peerId, { afterIso } = {}) {
    const me = await currentUserId();
    const a = encodeURIComponent(me);
    const b = encodeURIComponent(peerId);
    const filter = `or=(and(sender_id.eq.${a},receiver_id.eq.${b}),and(sender_id.eq.${b},receiver_id.eq.${a}))`;
    let path = `dm_messages?${filter}&select=*&order=created_at.asc&limit=200`;
    if (afterIso) {
      path += `&created_at=gt.${encodeURIComponent(afterIso)}`;
    }
    const rows = await rest(path);
    return (Array.isArray(rows) ? rows : []).map((m) => mapDm(m, me));
  }

  function mapDm(m, me) {
    const readAt = m.read_at || null;
    const recalledAt = m.recalled_at || null;
    let body = String(m.body || "");
    let msgType = String(m.msg_type || "text");
    let mediaUrl = String(m.media_url || "");
    if ((!msgType || msgType === "text") && body.startsWith("__STICKER__:")) {
      msgType = "sticker";
      mediaUrl = body.slice("__STICKER__:".length);
      body = "[表情]";
    }
    return {
      id: String(m.id),
      body,
      senderId: String(m.sender_id || ""),
      receiverId: String(m.receiver_id || ""),
      mine: String(m.sender_id) === me,
      time: m.created_at ? Date.parse(m.created_at) || Date.now() : Date.now(),
      createdAt: m.created_at || null,
      readAt,
      read: !!readAt,
      msgType,
      mediaUrl,
      recalledAt,
      recalled: !!recalledAt
    };
  }

  async function sendDirectMessage(peerId, text, { msgType = "text", mediaUrl = "" } = {}) {
    const me = await currentUserId();
    const type = ["text", "sticker", "kaomoji"].includes(msgType) ? msgType : "text";
    const media = String(mediaUrl || "").trim();
    let body = String(text || "").trim();
    if (type === "sticker") {
      if (!media) throw new Error("表情包无效");
      body = body || "[表情]";
    } else if (!body) {
      throw new Error("消息不能为空");
    }
    if (body.length > 2000) throw new Error("消息太长");
    if (!peerId) throw new Error("请先选择好友");
    const payload = {
      sender_id: me,
      receiver_id: peerId,
      body
    };
    // 兼容未跑扩展 SQL 的库：只发 body
    try {
      payload.msg_type = type;
      payload.media_url = media;
      const rows = await rest("dm_messages", {
        method: "POST",
        prefer: "return=representation",
        body: payload
      });
      const m = Array.isArray(rows) ? rows[0] : rows;
      return mapDm(m, me);
    } catch (err) {
      const msg = String(err?.message || "");
      if (/msg_type|media_url|column|schema cache/i.test(msg) && type === "sticker") {
        // 退化为把表情编码进正文
        const encoded = `__STICKER__:${media}`;
        const rows = await rest("dm_messages", {
          method: "POST",
          prefer: "return=representation",
          body: {
            sender_id: me,
            receiver_id: peerId,
            body: encoded.slice(0, 1000)
          }
        });
        const m = Array.isArray(rows) ? rows[0] : rows;
        const mapped = mapDm(m, me);
        mapped.msgType = "sticker";
        mapped.mediaUrl = media;
        mapped.body = "[表情]";
        return mapped;
      }
      if (/msg_type|media_url|column|schema cache/i.test(msg)) {
        const rows = await rest("dm_messages", {
          method: "POST",
          prefer: "return=representation",
          body: {
            sender_id: me,
            receiver_id: peerId,
            body
          }
        });
        const m = Array.isArray(rows) ? rows[0] : rows;
        return mapDm(m, me);
      }
      throw err;
    }
  }

  async function listRecallUpdatesWith(peerId, { sinceIso } = {}) {
    const me = await currentUserId();
    const a = encodeURIComponent(me);
    const b = encodeURIComponent(peerId);
    const filter = `or=(and(sender_id.eq.${a},receiver_id.eq.${b}),and(sender_id.eq.${b},receiver_id.eq.${a}))`;
    let path =
      `dm_messages?${filter}&recalled_at=not.is.null&select=id,recalled_at&order=recalled_at.asc&limit=50`;
    if (sinceIso) {
      path += `&recalled_at=gt.${encodeURIComponent(sinceIso)}`;
    }
    try {
      const rows = await rest(path);
      return (Array.isArray(rows) ? rows : []).map((m) => ({
        id: String(m.id),
        recalledAt: m.recalled_at || null,
        recalled: true
      }));
    } catch {
      return [];
    }
  }

  async function recallDirectMessage(messageId) {
    const me = await currentUserId();
    const id = encodeURIComponent(messageId);
    const now = new Date().toISOString();
    try {
      const rows = await rest(
        `dm_messages?id=eq.${id}&sender_id=eq.${encodeURIComponent(me)}`,
        {
          method: "PATCH",
          prefer: "return=representation",
          body: { recalled_at: now }
        }
      );
      const m = Array.isArray(rows) ? rows[0] : rows;
      if (!m) throw new Error("撤回失败：消息不存在或无权撤回");
      return mapDm(m, me);
    } catch (err) {
      const msg = String(err?.message || "");
      if (/recalled_at|column|schema cache/i.test(msg)) {
        throw new Error("请先在 Supabase 执行 supabase_dm_stickers.sql");
      }
      throw err;
    }
  }

  /** 打开会话时：把对方发给我的未读标成已读 */
  async function markMessagesRead(peerId) {
    const me = await currentUserId();
    const a = encodeURIComponent(me);
    const b = encodeURIComponent(peerId);
    const now = new Date().toISOString();
    try {
      await rest(
        `dm_messages?receiver_id=eq.${a}&sender_id=eq.${b}&read_at=is.null`,
        {
          method: "PATCH",
          prefer: "return=minimal",
          body: { read_at: now }
        }
      );
      return true;
    } catch (err) {
      const msg = String(err?.message || "");
      if (/read_at|column|schema cache/i.test(msg)) {
        throw new Error("请先在 Supabase 执行 supabase_dm_read.sql");
      }
      throw err;
    }
  }

  /**
   * 未读汇总：
   * - unreadTotal: 别人发给我、尚未读的总数
   * - byPeer: { peerId: count }
   * - peerLastReadAt: 对方已读我消息的最新时间（用于气泡「已读」）
   */
  async function getUnreadSummary() {
    const me = await currentUserId();
    const a = encodeURIComponent(me);
    const empty = { unreadTotal: 0, byPeer: {}, peerLastReadAt: {} };
    try {
      const [incoming, mySent] = await Promise.all([
        rest(
          `dm_messages?receiver_id=eq.${a}&read_at=is.null&select=id,sender_id&order=created_at.desc&limit=500`
        ),
        rest(
          `dm_messages?sender_id=eq.${a}&read_at=not.is.null&select=receiver_id,read_at&order=read_at.desc&limit=200`
        )
      ]);
      const byPeer = {};
      (Array.isArray(incoming) ? incoming : []).forEach((m) => {
        const pid = String(m.sender_id || "");
        if (!pid) return;
        byPeer[pid] = (byPeer[pid] || 0) + 1;
      });
      const peerLastReadAt = {};
      (Array.isArray(mySent) ? mySent : []).forEach((m) => {
        const pid = String(m.receiver_id || "");
        if (!pid || peerLastReadAt[pid]) return;
        peerLastReadAt[pid] = m.read_at || null;
      });
      const unreadTotal = Object.values(byPeer).reduce((s, n) => s + n, 0);
      return { unreadTotal, byPeer, peerLastReadAt };
    } catch (err) {
      const msg = String(err?.message || "");
      if (/read_at|column|schema cache/i.test(msg)) {
        return empty;
      }
      throw err;
    }
  }

  /** 拉取会话里「已读状态」变化（对方读了我的消息） */
  async function listReadUpdatesWith(peerId, { sinceIso } = {}) {
    const me = await currentUserId();
    const a = encodeURIComponent(me);
    const b = encodeURIComponent(peerId);
    let path =
      `dm_messages?sender_id=eq.${a}&receiver_id=eq.${b}&read_at=not.is.null` +
      `&select=id,read_at&order=read_at.asc&limit=200`;
    if (sinceIso) {
      path += `&read_at=gt.${encodeURIComponent(sinceIso)}`;
    }
    try {
      const rows = await rest(path);
      return (Array.isArray(rows) ? rows : []).map((m) => ({
        id: String(m.id),
        readAt: m.read_at || null,
        read: true
      }));
    } catch {
      return [];
    }
  }

  function mapGroupRow(g, members = []) {
    if (!g) return null;
    const list = Array.isArray(members) ? members : [];
    return {
      kind: "group",
      id: String(g.id),
      name: String(g.name || "群聊").trim() || "群聊",
      ownerId: String(g.owner_id || ""),
      createdAt: g.created_at || null,
      updatedAt: g.updated_at || null,
      members: list,
      memberIds: list.map((m) => m.id).filter(Boolean),
      memberCount: list.length
    };
  }

  function mapGroupMessage(m, me) {
    const recalledAt = m.recalled_at || null;
    let body = String(m.body || "");
    let msgType = String(m.msg_type || "text");
    let mediaUrl = String(m.media_url || "");
    if ((!msgType || msgType === "text") && body.startsWith("__STICKER__:")) {
      msgType = "sticker";
      mediaUrl = body.slice("__STICKER__:".length);
      body = "[表情]";
    }
    return {
      id: String(m.id),
      groupId: String(m.group_id || ""),
      body,
      senderId: String(m.sender_id || ""),
      mine: String(m.sender_id) === me,
      time: m.created_at ? Date.parse(m.created_at) || Date.now() : Date.now(),
      createdAt: m.created_at || null,
      read: false,
      msgType,
      mediaUrl,
      recalledAt,
      recalled: !!recalledAt
    };
  }

  async function loadGroupMembers(groupId) {
    const gid = String(groupId || "").trim();
    if (!gid) return [];
    let rows;
    try {
      rows = await rest(
        `chat_group_members?group_id=eq.${encodeURIComponent(gid)}&select=user_id,joined_at,profile:profiles!user_id(id,display_name,email,avatar_url,user_no,honor_title,last_seen_at)`
      );
    } catch {
      try {
        rows = await rest(
          `chat_group_members?group_id=eq.${encodeURIComponent(gid)}&select=user_id,joined_at,profile:profiles!user_id(id,display_name,email,avatar_url,user_no,last_seen_at)`
        );
      } catch {
        rows = await rest(
          `chat_group_members?group_id=eq.${encodeURIComponent(gid)}&select=user_id,joined_at`
        );
        const ids = (Array.isArray(rows) ? rows : []).map((r) => r.user_id).filter(Boolean);
        if (!ids.length) return [];
        let profiles;
        try {
          profiles = await rest(
            `profiles?id=in.(${ids.map(encodeURIComponent).join(",")})&select=id,display_name,email,avatar_url,user_no,honor_title,last_seen_at`
          );
        } catch {
          profiles = await rest(
            `profiles?id=in.(${ids.map(encodeURIComponent).join(",")})&select=id,display_name,email,avatar_url,user_no,last_seen_at`
          );
        }
        const map = new Map(
          (Array.isArray(profiles) ? profiles : []).map((p) => [String(p.id), p])
        );
        return ids.map((id) => mapProfile(map.get(id) || { id })).filter(Boolean);
      }
    }
    return (Array.isArray(rows) ? rows : [])
      .map((r) => mapProfile(r.profile || { id: r.user_id }))
      .filter(Boolean);
  }

  async function listChatGroups() {
    const me = await currentUserId();
    let memberRows;
    try {
      memberRows = await rest(
        `chat_group_members?user_id=eq.${encodeURIComponent(me)}&select=group_id,last_read_at&order=joined_at.desc&limit=100`
      );
    } catch (err) {
      const msg = String(err?.message || "");
      if (/chat_group|schema cache|relation|does not exist/i.test(msg)) {
        throw new Error("请先在 Supabase 执行 supabase_groups.sql");
      }
      throw err;
    }
    const rows = Array.isArray(memberRows) ? memberRows : [];
    const ids = [...new Set(rows.map((r) => r.group_id).filter(Boolean).map(String))];
    if (!ids.length) return [];

    let groupRows = [];
    try {
      groupRows = await rest(
        `chat_groups?id=in.(${ids.map(encodeURIComponent).join(",")})&select=id,name,owner_id,created_at,updated_at`
      );
    } catch (err) {
      const msg = String(err?.message || "");
      if (/chat_group|schema cache|relation|does not exist/i.test(msg)) {
        throw new Error("请先在 Supabase 执行 supabase_groups.sql");
      }
      throw err;
    }
    const gmap = new Map(
      (Array.isArray(groupRows) ? groupRows : []).map((g) => [String(g.id), g])
    );
    const readMap = new Map(
      rows.map((r) => [String(r.group_id), r.last_read_at || null])
    );
    const groups = [];
    for (const id of ids) {
      const g = gmap.get(id) || { id };
      const members = await loadGroupMembers(id);
      const mapped = mapGroupRow(g, members);
      mapped.lastReadAt = readMap.get(id) || null;
      groups.push(mapped);
    }
    return groups;
  }

  async function createChatGroup(name, memberIds = []) {
    const me = await currentUserId();
    const title = String(name || "").trim().slice(0, 24) || "群聊";
    const friends = await listFriends();
    const friendSet = new Set(friends.map((f) => String(f.id)));
    const invite = [...new Set((memberIds || []).map(String).filter(Boolean))]
      .filter((id) => id !== me && friendSet.has(id))
      .slice(0, 40);
    if (!invite.length) {
      throw new Error(
        friendSet.size
          ? "请至少选择一位好友进群"
          : "还没有好友，请先加好友再建群"
      );
    }

    let group;
    try {
      const rows = await rest("chat_groups", {
        method: "POST",
        prefer: "return=representation",
        body: { name: title, owner_id: me }
      });
      group = Array.isArray(rows) ? rows[0] : rows;
    } catch (err) {
      const msg = String(err?.message || "");
      if (/chat_group|schema cache|relation|does not exist/i.test(msg)) {
        throw new Error("请先在 Supabase 执行 supabase_groups.sql");
      }
      if (/row-level security|RLS|policy/i.test(msg)) {
        throw new Error("没有建群权限，请确认已执行 supabase_groups.sql");
      }
      throw err;
    }
    if (!group?.id) throw new Error("创建群聊失败");

    // 先加自己，再逐个加好友，避免批量插入被 RLS 整批拒绝
    const addMember = async (uid, extra = {}) => {
      await rest("chat_group_members", {
        method: "POST",
        prefer: "return=minimal",
        body: { group_id: group.id, user_id: uid, ...extra }
      });
    };
    try {
      await addMember(me, { last_read_at: new Date().toISOString() });
      for (const uid of invite) {
        await addMember(uid);
      }
    } catch (err) {
      try {
        await rest(`chat_groups?id=eq.${encodeURIComponent(group.id)}`, {
          method: "DELETE"
        });
      } catch {
        /* ignore */
      }
      const msg = String(err?.message || "");
      if (/row-level security|RLS|policy/i.test(msg)) {
        throw new Error("拉人进群失败：请重新执行 supabase_groups.sql");
      }
      throw err;
    }
    const members = await loadGroupMembers(group.id);
    return mapGroupRow(group, members);
  }

  async function renameChatGroup(groupId, name) {
    const gid = String(groupId || "").trim();
    const title = String(name || "").trim().slice(0, 24);
    if (!gid) throw new Error("无效群聊");
    if (!title) throw new Error("群名不能为空");
    const rows = await rest(`chat_groups?id=eq.${encodeURIComponent(gid)}`, {
      method: "PATCH",
      prefer: "return=representation",
      body: { name: title, updated_at: new Date().toISOString() }
    });
    const g = Array.isArray(rows) ? rows[0] : rows;
    if (!g) throw new Error("改名失败（可能不在群内）");
    const members = await loadGroupMembers(gid);
    return mapGroupRow(g, members);
  }

  async function deleteChatGroup(groupId) {
    const me = await currentUserId();
    const gid = String(groupId || "").trim();
    if (!gid) throw new Error("无效群聊");
    let g;
    try {
      const rows = await rest(
        `chat_groups?id=eq.${encodeURIComponent(gid)}&select=id,name,owner_id&limit=1`
      );
      g = Array.isArray(rows) ? rows[0] : rows;
    } catch (err) {
      if (/chat_groups|schema cache|relation|does not exist/i.test(String(err?.message || ""))) {
        throw new Error("请先在 Supabase 执行 supabase_groups.sql");
      }
      throw err;
    }
    if (!g) throw new Error("群不存在或你已不在群内");
    if (String(g.owner_id || "") !== me) {
      throw new Error("只有群主可以解散群聊");
    }
    try {
      await rest(`chat_groups?id=eq.${encodeURIComponent(gid)}`, {
        method: "DELETE",
        prefer: "return=minimal"
      });
    } catch (err) {
      const msg = String(err?.message || "");
      if (/row-level security|RLS|policy/i.test(msg)) {
        throw new Error("解散失败：没有权限（需为群主）");
      }
      throw err;
    }
    return true;
  }

  async function addChatGroupMembers(groupId, memberIds = []) {
    const me = await currentUserId();
    const gid = String(groupId || "").trim();
    if (!gid) throw new Error("无效群聊");
    const existing = await loadGroupMembers(gid);
    const existSet = new Set(existing.map((m) => m.id));
    const friends = await listFriends();
    const friendSet = new Set(friends.map((f) => f.id));
    const invite = [...new Set((memberIds || []).map(String).filter(Boolean))]
      .filter((id) => id !== me && friendSet.has(id) && !existSet.has(id))
      .slice(0, 40);
    if (!invite.length) throw new Error("没有可邀请的新好友");
    await rest("chat_group_members", {
      method: "POST",
      prefer: "return=minimal",
      body: invite.map((uid) => ({ group_id: gid, user_id: uid }))
    });
    const members = await loadGroupMembers(gid);
    const gRows = await rest(
      `chat_groups?id=eq.${encodeURIComponent(gid)}&select=id,name,owner_id,created_at,updated_at&limit=1`
    );
    const g = Array.isArray(gRows) ? gRows[0] : gRows;
    return mapGroupRow(g || { id: gid }, members);
  }

  async function listGroupMessages(groupId, { afterIso } = {}) {
    const me = await currentUserId();
    const gid = encodeURIComponent(groupId);
    let path = `group_messages?group_id=eq.${gid}&select=*&order=created_at.asc&limit=200`;
    if (afterIso) path += `&created_at=gt.${encodeURIComponent(afterIso)}`;
    const rows = await rest(path);
    return (Array.isArray(rows) ? rows : []).map((m) => mapGroupMessage(m, me));
  }

  async function sendGroupMessage(groupId, text, { msgType = "text", mediaUrl = "" } = {}) {
    const me = await currentUserId();
    const type = ["text", "sticker", "kaomoji"].includes(msgType) ? msgType : "text";
    const media = String(mediaUrl || "").trim();
    let body = String(text || "").trim();
    if (type === "sticker") {
      if (!media) throw new Error("表情包无效");
      body = body || "[表情]";
    } else if (!body) {
      throw new Error("消息不能为空");
    }
    try {
      const rows = await rest("group_messages", {
        method: "POST",
        prefer: "return=representation",
        body: {
          group_id: groupId,
          sender_id: me,
          body: body.slice(0, 1000),
          msg_type: type,
          media_url: type === "sticker" ? media : ""
        }
      });
      const m = Array.isArray(rows) ? rows[0] : rows;
      return mapGroupMessage(m, me);
    } catch (err) {
      const msg = String(err?.message || "");
      if (/group_messages|schema cache|relation|does not exist/i.test(msg)) {
        throw new Error("请先在 Supabase 执行 supabase_groups.sql");
      }
      throw err;
    }
  }

  async function markGroupMessagesRead(groupId) {
    const me = await currentUserId();
    const gid = String(groupId || "").trim();
    if (!gid) return false;
    try {
      await rest(
        `chat_group_members?group_id=eq.${encodeURIComponent(gid)}&user_id=eq.${encodeURIComponent(me)}`,
        {
          method: "PATCH",
          prefer: "return=minimal",
          body: { last_read_at: new Date().toISOString() }
        }
      );
      return true;
    } catch {
      return false;
    }
  }

  async function listGroupRecallUpdates(groupId, { sinceIso } = {}) {
    const gid = encodeURIComponent(groupId);
    let path =
      `group_messages?group_id=eq.${gid}&recalled_at=not.is.null&select=id,recalled_at&order=recalled_at.asc&limit=50`;
    if (sinceIso) path += `&recalled_at=gt.${encodeURIComponent(sinceIso)}`;
    try {
      const rows = await rest(path);
      return (Array.isArray(rows) ? rows : []).map((m) => ({
        id: String(m.id),
        recalledAt: m.recalled_at || null,
        recalled: true
      }));
    } catch {
      return [];
    }
  }

  async function recallGroupMessage(messageId) {
    const me = await currentUserId();
    const id = encodeURIComponent(messageId);
    const now = new Date().toISOString();
    const rows = await rest(
      `group_messages?id=eq.${id}&sender_id=eq.${encodeURIComponent(me)}`,
      {
        method: "PATCH",
        prefer: "return=representation",
        body: { recalled_at: now }
      }
    );
    const m = Array.isArray(rows) ? rows[0] : rows;
    if (!m) throw new Error("撤回失败：消息不存在或无权撤回");
    return mapGroupMessage(m, me);
  }

  /** 群未读：成员 last_read_at 之后、别人发的消息 */
  async function getGroupUnreadSummary() {
    const me = await currentUserId();
    const empty = { unreadTotal: 0, byGroup: {} };
    let memberRows;
    try {
      memberRows = await rest(
        `chat_group_members?user_id=eq.${encodeURIComponent(me)}&select=group_id,last_read_at&limit=100`
      );
    } catch {
      return empty;
    }
    const rows = Array.isArray(memberRows) ? memberRows : [];
    const byGroup = {};
    await Promise.all(
      rows.map(async (row) => {
        const gid = String(row.group_id || "");
        if (!gid) return;
        const since = row.last_read_at
          ? `&created_at=gt.${encodeURIComponent(row.last_read_at)}`
          : "";
        try {
          const msgs = await rest(
            `group_messages?group_id=eq.${encodeURIComponent(gid)}&sender_id=neq.${encodeURIComponent(me)}&recalled_at=is.null${since}&select=id&limit=200`
          );
          const n = Array.isArray(msgs) ? msgs.length : 0;
          if (n > 0) byGroup[`g:${gid}`] = n;
        } catch {
          /* ignore one group */
        }
      })
    );
    const unreadTotal = Object.values(byGroup).reduce((s, n) => s + n, 0);
    return { unreadTotal, byGroup };
  }

  function currentUserIdSync() {
    try {
      const cached = localStorage.getItem(ACTIVE_UID_KEY);
      if (cached && cached.trim()) return cached.trim();
    } catch {
      /* ignore */
    }
    const session = readSession();
    if (session?.user?.id) return String(session.user.id);
    const payload = decodeJwtPayload(session?.access_token);
    if (payload?.sub) return String(payload.sub);
    return "";
  }

  const CLOUD_MUSIC_BUCKET = "ludong-music";
  const CLOUD_AVATAR_BUCKET = "ludong-avatars";
  const MAX_AUDIO_BYTES = 40 * 1024 * 1024;
  const MAX_COVER_BYTES = 5 * 1024 * 1024;
  const MAX_LRC_BYTES = 1 * 1024 * 1024;
  const MAX_VIDEO_BYTES = 180 * 1024 * 1024;

  function userSyncMissing(err) {
    const msg = String(err?.message || "");
    if (/user_sync|schema cache|relation|does not exist/i.test(msg)) {
      return "账号同步还没开通：请在 Supabase 执行 supabase_user_sync.sql";
    }
    return msg || "账号同步失败";
  }

  async function fetchUserSync() {
    if (!cloudEnabled()) return null;
    const me = await currentUserId();
    try {
      const rows = await rest(
        `user_sync?user_id=eq.${encodeURIComponent(me)}&select=play_stats,playlists,playlists_rev,likes,likes_rev&limit=1`
      );
      return Array.isArray(rows) && rows[0] ? rows[0] : null;
    } catch (err) {
      throw new Error(userSyncMissing(err));
    }
  }

  async function saveUserSync({
    playStats,
    playlists,
    playlistsRev,
    likes,
    likesRev
  } = {}) {
    if (!cloudEnabled()) return;
    const me = await currentUserId();
    try {
      await rest("user_sync?on_conflict=user_id", {
        method: "POST",
        prefer: "resolution=merge-duplicates,return=minimal",
        body: {
          user_id: me,
          play_stats: playStats && typeof playStats === "object" ? playStats : {},
          playlists: Array.isArray(playlists) ? playlists : [],
          playlists_rev: Number(playlistsRev) || 0,
          likes: likes && typeof likes === "object" ? likes : {},
          likes_rev: Number(likesRev) || 0,
          updated_at: new Date().toISOString()
        }
      });
    } catch (err) {
      throw new Error(userSyncMissing(err));
    }
  }

  function makeSongKey(title, artist) {
    return `${String(title || "").trim().toLowerCase()}|${String(artist || "")
      .trim()
      .toLowerCase()}`;
  }

  function normWishTitle(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function normWishArtist(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[\s·•・.。,，/\\|_\-—–－'"“”‘’`~!！?？:：;；（）()\[\]【】]/g, "");
  }

  function artistEditDistance(a, b) {
    const rows = a.length + 1;
    const cols = b.length + 1;
    const dp = new Array(cols);
    for (let j = 0; j < cols; j++) dp[j] = j;
    for (let i = 1; i < rows; i++) {
      let prev = dp[0];
      dp[0] = i;
      for (let j = 1; j < cols; j++) {
        const cur = dp[j];
        const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
        dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + cost);
        prev = cur;
      }
    }
    return dp[cols - 1];
  }

  function artistsClose(left, right) {
    const a = normWishArtist(left);
    const b = normWishArtist(right);
    if (!a || !b) return false;
    if (a === b) return true;
    const shorter = a.length <= b.length ? a : b;
    const longer = a.length <= b.length ? b : a;
    if (
      shorter.length >= 3 &&
      longer.includes(shorter) &&
      shorter.length / longer.length >= 0.55
    ) {
      return true;
    }
    const dist = artistEditDistance(a, b);
    return 1 - dist / Math.max(a.length, b.length) >= 0.72;
  }

  function wishMatchesSong(wishTitle, wishArtist, songTitle, songArtist) {
    const titleOk = normWishTitle(wishTitle) && normWishTitle(wishTitle) === normWishTitle(songTitle);
    return titleOk && artistsClose(wishArtist, songArtist);
  }

  function isUnknownArtist(value) {
    const a = normWishArtist(value);
    return !a || a === normWishArtist("未知歌手") || a === "unknown";
  }

  /** 云端补传匹配：歌名必须一致；歌手可相似；文件无歌手时仅按歌名（多首同名则报错） */
  function cloudMetaMatches(fileTitle, fileArtist, songTitle, songArtist) {
    if (
      !normWishTitle(fileTitle) ||
      normWishTitle(fileTitle) !== normWishTitle(songTitle)
    ) {
      return false;
    }
    if (isUnknownArtist(fileArtist) || isUnknownArtist(songArtist)) return true;
    return artistsClose(fileArtist, songArtist);
  }

  async function findCloudSongByTitleArtist(title, artist) {
    const t = String(title || "").trim();
    const a = String(artist || "").trim() || "未知歌手";
    if (!normWishTitle(t)) return null;

    const songKey = makeSongKey(t, a);
    try {
      const exact = await rest(
        `cloud_songs?song_key=eq.${encodeURIComponent(songKey)}&select=id,uploader_id,title,artist,song_key,audio_path,cover_path,lrc_path,video_path,duration,file_size&limit=1`
      );
      if (Array.isArray(exact) && exact[0]) return exact[0];
    } catch {
      /* 再走模糊匹配 */
    }

    const songs = await listCloudSongs();
    const hits = songs.filter((s) => cloudMetaMatches(t, a, s.title, s.artist));
    if (!hits.length) return null;
    if (hits.length === 1) return hits[0];

    const na = normWishArtist(a);
    if (!isUnknownArtist(a)) {
      const ranked = hits.slice().sort((x, y) => {
        const xe = normWishArtist(x.artist) === na ? 0 : artistsClose(a, x.artist) ? 1 : 2;
        const ye = normWishArtist(y.artist) === na ? 0 : artistsClose(a, y.artist) ? 1 : 2;
        return xe - ye;
      });
      const best = ranked[0];
      const bestScore =
        normWishArtist(best.artist) === na ? 0 : artistsClose(a, best.artist) ? 1 : 2;
      const tied = ranked.filter((s) => {
        const sc =
          normWishArtist(s.artist) === na ? 0 : artistsClose(a, s.artist) ? 1 : 2;
        return sc === bestScore;
      });
      if (tied.length > 1) {
        const err = new Error(
          `曲库有多首「${t}」与歌手相近，请把文件命名为「${t}-${tied[0].artist}」后再传`
        );
        err.code = "AMBIGUOUS_CLOUD_MATCH";
        throw err;
      }
      return best;
    }

    const err = new Error(
      `曲库有多首「${t}」，请用「歌名-歌手」命名文件后再传`
    );
    err.code = "AMBIGUOUS_CLOUD_MATCH";
    throw err;
  }

  function assertCloudAssetSizes({ audioFile, coverFile, lrcFile, videoFile } = {}) {
    if (audioFile) {
      const name = String(audioFile.name || "").toLowerCase();
      if (
        !name.endsWith(".mp3") &&
        audioFile.type &&
        !/audio\/(mpeg|mp3)/i.test(audioFile.type)
      ) {
        throw new Error("仅支持 MP3 音频");
      }
      if (audioFile.size > MAX_AUDIO_BYTES) {
        throw new Error("音频不能超过 40MB");
      }
    }
    if (coverFile && coverFile.size > MAX_COVER_BYTES) {
      throw new Error("封面不能超过 5MB");
    }
    if (lrcFile && lrcFile.size > MAX_LRC_BYTES) {
      throw new Error("歌词不能超过 1MB");
    }
    if (videoFile) {
      const vName = String(videoFile.name || "").toLowerCase();
      if (!/\.(mp4|webm|mov|mkv|m4v)$/i.test(vName)) {
        throw new Error("视频仅支持 MP4 / WebM / MOV / MKV");
      }
      if (videoFile.size > MAX_VIDEO_BYTES) {
        throw new Error("视频不能超过 180MB");
      }
    }
  }

  async function patchCloudSongAssets(
    existing,
    { audioFile, coverFile, lrcFile, videoFile, duration } = {}
  ) {
    if (!existing?.id) throw new Error("缺少曲库记录");
    if (!audioFile && !coverFile && !lrcFile && !videoFile) {
      throw new Error("请选择要上传或替换的文件");
    }
    assertCloudAssetSizes({ audioFile, coverFile, lrcFile, videoFile });

    const me = await currentUserId();
    const songId = String(existing.id);
    // Storage 只能写自己的目录；路径写入后全员可读
    const base = `${me}/${songId}`;
    const patch = {};
    const uploaded = [];

    try {
      if (audioFile) {
        const audioPath = `${base}/audio.mp3`;
        await storageUpload(audioPath, audioFile, audioFile.type || "audio/mpeg");
        uploaded.push(audioPath);
        patch.audio_path = audioPath;
        patch.file_size = Number(audioFile.size) || 0;
        if (duration != null && Number(duration) > 0) {
          patch.duration = Math.max(0, Math.round(Number(duration) || 0));
        }
      }

      if (coverFile) {
        const ext = (String(coverFile.name || "").match(/\.(\w+)$/) || [])[1] || "jpg";
        const safeExt = /^(jpe?g|png|webp)$/i.test(ext) ? ext.toLowerCase() : "jpg";
        const outExt = safeExt === "jpeg" ? "jpg" : safeExt;
        const coverPath = `${base}/cover.${outExt}`;
        await storageUpload(
          coverPath,
          coverFile,
          coverFile.type || `image/${outExt === "jpg" ? "jpeg" : outExt}`
        );
        uploaded.push(coverPath);
        patch.cover_path = coverPath;
      }

      if (lrcFile) {
        const lyricExt = /\.srt$/i.test(String(lrcFile.name || "")) ? "srt" : "lrc";
        const lrcPath = `${base}/lyrics.${lyricExt}`;
        await storageUpload(lrcPath, lrcFile, "text/plain");
        uploaded.push(lrcPath);
        patch.lrc_path = lrcPath;
      }

      if (videoFile) {
        const vExt = (String(videoFile.name || "").match(/\.(\w+)$/) || [])[1] || "mp4";
        const safeV = /^(mp4|webm|mov|mkv|m4v)$/i.test(vExt)
          ? vExt.toLowerCase()
          : "mp4";
        const videoPath = `${base}/video.${safeV}`;
        const mime =
          videoFile.type ||
          (safeV === "webm"
            ? "video/webm"
            : safeV === "mov"
              ? "video/quicktime"
              : safeV === "mkv"
                ? "video/x-matroska"
                : "video/mp4");
        await storageUpload(videoPath, videoFile, mime);
        uploaded.push(videoPath);
        patch.video_path = videoPath;
      }

      let rows;
      try {
        rows = await rest(`cloud_songs?id=eq.${encodeURIComponent(songId)}`, {
          method: "PATCH",
          prefer: "return=representation",
          body: patch
        });
      } catch (err) {
        const msg = String(err?.message || "");
        if (patch.video_path && /video_path|schema cache|Could not find/i.test(msg)) {
          throw new Error(
            "云端尚未开通 MV 字段：请在 Supabase 执行 supabase_cloud_songs_video.sql"
          );
        }
        if (/row-level security|policy|42501/i.test(msg)) {
          const mine = String(existing.uploader_id) === String(me);
          throw new Error(
            mine
              ? "无权限更新曲库记录"
              : `「${existing.title}」由他人上传。补传/替换需在 Supabase 执行 supabase_cloud_songs_asset_patch.sql，或请原上传者操作`
          );
        }
        throw err;
      }
      const row = Array.isArray(rows) ? rows[0] : rows;
      if (!row?.id) throw new Error("更新曲库失败");
      try {
        await completeWishesForSong(existing.title, existing.artist);
      } catch {
        /* ignore */
      }
      return { ...row, replaced: true };
    } catch (err) {
      try {
        await storageRemove(uploaded);
      } catch {
        /* ignore cleanup */
      }
      const msg = String(err?.message || "");
      if (/mime|not allowed|file size|maximum/i.test(msg) && patch.video_path) {
        throw new Error(
          "视频上传被桶限制拦截：请执行 supabase_cloud_songs_video.sql 后重试"
        );
      }
      throw err;
    }
  }

  async function markWishesDone(rows) {
    if (!rows?.length) return;
    const doneAt = new Date().toISOString();
    await Promise.all(
      rows.map((row) =>
        rest(`song_wishes?id=eq.${encodeURIComponent(row.id)}`, {
          method: "PATCH",
          prefer: "return=minimal",
          body: { status: "done", done_at: doneAt }
        })
      )
    );
  }

  function wishMissingMessage(err) {
    const msg = String(err?.message || "");
    if (/song_wishes|schema cache|relation|does not exist/i.test(msg)) {
      return "心愿单还没开通：请在 Supabase 执行 supabase_wishes.sql";
    }
    return msg || "心愿单请求失败";
  }

  async function listSongWishes() {
    if (!cloudEnabled()) throw new Error("云端未配置");
    try {
      const rows = await rest(
        "song_wishes?select=id,author_id,author_name,title,artist,song_key,status,created_at,done_at&order=created_at.desc&limit=500"
      );
      return Array.isArray(rows) ? rows : [];
    } catch (err) {
      throw new Error(wishMissingMessage(err));
    }
  }

  async function addSongWish({ title, artist } = {}) {
    if (!cloudEnabled()) throw new Error("云端未配置");
    const t = String(title || "").trim().slice(0, 120);
    const a = String(artist || "").trim().slice(0, 120);
    if (!t || !a) throw new Error("请按「歌曲-歌手」填写");
    const songKey = makeSongKey(t, a);
    const me = await currentUserId();
    const name = String(getDisplayName() || "").trim().slice(0, 24);
    const songs = await listCloudSongs();
    if (songs.some((song) => wishMatchesSong(t, a, song.title, song.artist))) {
      throw new Error("曲库里已经有这首歌");
    }
    const openRows = await listSongWishes();
    if (
      openRows.some(
        (row) => row.status !== "done" && wishMatchesSong(t, a, row.title, row.artist)
      )
    ) {
      throw new Error("这首已经在心愿单里了");
    }
    try {
      const rows = await rest("song_wishes", {
        method: "POST",
        prefer: "return=representation",
        body: {
          author_id: me,
          author_name: name,
          title: t,
          artist: a,
          song_key: songKey,
          status: "open"
        }
      });
      const row = Array.isArray(rows) ? rows[0] : rows;
      if (!row?.id) throw new Error("写入心愿失败");
      return row;
    } catch (err) {
      const msg = String(err?.message || "");
      if (/duplicate|unique|song_wishes_open_key/i.test(msg)) {
        throw new Error("这首已经在心愿单里了");
      }
      throw new Error(wishMissingMessage(err));
    }
  }

  async function completeWishesForSong(title, artist) {
    if (!normWishTitle(title)) return;
    let rows = [];
    try {
      const data = await rest(
        "song_wishes?status=eq.open&select=id,title,artist&limit=500"
      );
      rows = Array.isArray(data) ? data : [];
    } catch {
      return;
    }
    const hits = rows.filter((row) =>
      wishMatchesSong(row.title, row.artist, title, artist)
    );
    await markWishesDone(hits);
  }

  async function syncOpenWishes() {
    const wishes = await listSongWishes();
    const open = wishes.filter((row) => row.status !== "done");
    if (!open.length) return wishes;
    const songs = await listCloudSongs();
    const hits = open.filter((row) =>
      songs.some((song) => wishMatchesSong(row.title, row.artist, song.title, song.artist))
    );
    if (!hits.length) return wishes;
    await markWishesDone(hits);
    return listSongWishes();
  }

  function parseSongFileName(filename) {
    const stem = String(filename || "")
      .replace(/\.[^.]+$/, "")
      .trim();
    let parts = stem
      .split(/\s+-\s+/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length === 1 && stem.includes("-")) {
      parts = stem
        .split("-")
        .map((p) => p.trim())
        .filter(Boolean);
      if (parts.length > 2) {
        parts = [parts[0], parts.slice(1).join("-")];
      }
    }
    if (!parts.length) return { title: stem || "未命名", artist: "未知歌手" };
    if (parts.length === 1) return { title: parts[0], artist: "未知歌手" };
    return { title: parts[0], artist: parts[1] };
  }

  function storagePublicUrlIn(bucket, objectPath) {
    const c = cfg();
    if (!c?.url || !objectPath) return "";
    const encoded = String(objectPath)
      .replace(/^\/+/, "")
      .split("/")
      .filter(Boolean)
      .map((seg) => encodeURIComponent(seg))
      .join("/");
    return `${c.url}/storage/v1/object/public/${bucket}/${encoded}`;
  }

  function storagePublicUrl(objectPath) {
    return storagePublicUrlIn(CLOUD_MUSIC_BUCKET, objectPath);
  }

  function dataUrlToBlob(dataUrl) {
    const raw = String(dataUrl || "");
    const comma = raw.indexOf(",");
    if (comma < 0) throw new Error("头像数据无效");
    const header = raw.slice(0, comma);
    const b64 = raw.slice(comma + 1);
    const mime = (header.match(/:(.*?);/) || [])[1] || "image/jpeg";
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  }

  function asyncCompactAvatar(dataUrl, maxLen = 14000) {
    return new Promise((resolve) => {
      const raw = String(dataUrl || "");
      if (!raw.startsWith("data:image/") || raw.length <= maxLen) {
        resolve(raw);
        return;
      }
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          let size = 96;
          let quality = 0.7;
          let out = raw;
          for (let i = 0; i < 8; i++) {
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, size, size);
            const s = Math.min(img.width, img.height) || 1;
            const sx = (img.width - s) / 2;
            const sy = (img.height - s) / 2;
            ctx.drawImage(img, sx, sy, s, s, 0, 0, size, size);
            out = canvas.toDataURL("image/jpeg", quality);
            if (out.length <= maxLen) break;
            if (quality > 0.42) quality -= 0.08;
            else size = Math.max(48, Math.floor(size * 0.85));
          }
          resolve(out);
        } catch {
          resolve(raw.slice(0, maxLen));
        }
      };
      img.onerror = () => resolve(AVATAR_PRESETS[0].id);
      img.src = raw;
    });
  }

  async function restWithToken(pathQuery, token, { method = "GET", body, prefer } = {}) {
    const c = cfg();
    if (!c?.url || !c?.anonKey) throw new Error("云端未配置");
    const headers = {
      apikey: c.anonKey,
      Authorization: `Bearer ${token || c.anonKey}`,
      "Content-Type": "application/json"
    };
    if (prefer) headers.Prefer = prefer;
    const res = await fetch(`${c.url}/rest/v1/${pathQuery}`, {
      method,
      headers,
      body: body == null ? undefined : JSON.stringify(body)
    });
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    if (!res.ok) {
      const msg =
        (data && (data.message || data.error || data.hint || data.error_description)) ||
        `云端请求失败(${res.status})`;
      throw new Error(String(msg));
    }
    return data;
  }

  async function storageUploadTo(bucket, objectPath, blob, contentType) {
    const c = cfg();
    const session = await ensureAuthSession();
    const path = String(objectPath || "")
      .replace(/^\/+/, "")
      .split("/")
      .filter(Boolean)
      .map((seg) => encodeURIComponent(seg))
      .join("/");
    const res = await fetch(`${c.url}/storage/v1/object/${bucket}/${path}`, {
      method: "POST",
      headers: {
        apikey: c.anonKey,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": contentType || blob.type || "application/octet-stream",
        "x-upsert": "true"
      },
      body: blob
    });
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    if (!res.ok) {
      const msg =
        (data && (data.message || data.error || data.msg)) ||
        `上传失败(${res.status})`;
      if (/row-level security|policy|bucket|not found/i.test(String(msg))) {
        throw new Error(
          bucket === CLOUD_AVATAR_BUCKET
            ? "头像云存储未配置：请在 Supabase 执行 supabase_avatars.sql"
            : "云端曲库未配置：请在 Supabase 执行 supabase_cloud_songs.sql"
        );
      }
      throw new Error(String(msg));
    }
    return data;
  }

  async function storageUpload(objectPath, blob, contentType) {
    return storageUploadTo(CLOUD_MUSIC_BUCKET, objectPath, blob, contentType);
  }

  /** 自定义头像：优先 Storage 公开链；桶不存在时写入压缩 dataURL，评论/私聊仍可同步 */
  async function resolveCloudAvatar(avatarUrl) {
    const raw = String(avatarUrl || "").trim();
    if (!raw) return AVATAR_PRESETS[0].id;
    if (raw.startsWith("preset:")) return raw;
    if (/^https?:\/\//i.test(raw)) return raw;
    if (!raw.startsWith("data:image/")) return raw;

    const compact = await asyncCompactAvatar(raw);
    try {
      const me = await currentUserId();
      if (!me) return compact;
      const blob = dataUrlToBlob(compact);
      const path = `${me}/avatar.jpg`;
      const buckets = [CLOUD_AVATAR_BUCKET, CLOUD_MUSIC_BUCKET];
      let lastErr = null;
      for (const bucket of buckets) {
        try {
          await storageUploadTo(bucket, path, blob, "image/jpeg");
          return `${storagePublicUrlIn(bucket, path)}?v=${Date.now()}`;
        } catch (err) {
          lastErr = err;
        }
      }
      console.warn("[LudongCloud] avatar storage unavailable, use compact dataURL", lastErr);
      return compact;
    } catch (err) {
      console.warn("[LudongCloud] resolveCloudAvatar", err);
      return compact;
    }
  }

  function metaSafeAvatar(avatar) {
    const v = String(avatar || "").trim();
    if (!v || v.startsWith("data:")) return "";
    return v.slice(0, 500);
  }

  async function storageRemove(paths) {
    const list = (Array.isArray(paths) ? paths : []).filter(Boolean);
    if (!list.length) return;
    const c = cfg();
    const session = await ensureAuthSession();
    const res = await fetch(`${c.url}/storage/v1/object/${CLOUD_MUSIC_BUCKET}`, {
      method: "DELETE",
      headers: {
        apikey: c.anonKey,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(list)
    });
    if (!res.ok) {
      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }
      const msg =
        (data && (data.message || data.error || data.msg)) ||
        `删除文件失败(${res.status})`;
      throw new Error(String(msg));
    }
  }

  async function fetchCloudListenAcl() {
    const empty = {
      restrictEnabled: true,
      friendIds: [],
      canListenShared: false,
      isAdmin: false
    };
    if (!cloudEnabled()) return empty;
    try {
      const me = await currentUserId();
      let myNo = null;
      try {
        const prof = await fetchMyProfile();
        myNo = parseUserNo(prof?.userNo ?? prof?.user_no);
      } catch {
        /* ignore */
      }
      const isAdmin = isCreatorUserNo(myNo);
      let restrictEnabled = true;
      try {
        const rows = await rest(
          "cloud_listen_settings?id=eq.1&select=restrict_enabled&limit=1"
        );
        if (Array.isArray(rows) && rows[0]) {
          restrictEnabled = rows[0].restrict_enabled !== false;
        }
      } catch (err) {
        const msg = String(err?.message || "");
        if (/cloud_listen_settings|schema cache|relation|does not exist/i.test(msg)) {
          return { ...empty, isAdmin, canListenShared: !restrictEnabled || isAdmin };
        }
        throw err;
      }
      let friendIds = [];
      try {
        if (isAdmin) {
          const rows = await rest(
            "cloud_listen_allowlist?select=friend_id&order=created_at.asc"
          );
          friendIds = (Array.isArray(rows) ? rows : [])
            .map((r) => String(r.friend_id || ""))
            .filter(Boolean);
        } else if (me) {
          const rows = await rest(
            `cloud_listen_allowlist?friend_id=eq.${encodeURIComponent(me)}&select=friend_id&limit=1`
          );
          if (Array.isArray(rows) && rows.length) friendIds = [me];
        }
      } catch {
        friendIds = [];
      }
      const onAllowlist = !!(me && friendIds.includes(me));
      const canListenShared = !restrictEnabled || isAdmin || onAllowlist;
      return { restrictEnabled, friendIds, canListenShared, isAdmin };
    } catch (err) {
      console.warn("[LudongCloud] fetchCloudListenAcl", err);
      return empty;
    }
  }

  async function saveCloudListenAcl({ restrictEnabled, friendIds } = {}) {
    if (!cloudEnabled()) throw new Error("云端未配置");
    const me = await currentUserId();
    if (!me) throw new Error("请先登录");
    const prof = await fetchMyProfile();
    if (!isCreatorUserNo(prof?.userNo ?? prof?.user_no)) {
      throw new Error("仅管理员可设置云端听歌权限");
    }
    const enabled = !!restrictEnabled;
    const ids = [
      ...new Set(
        (Array.isArray(friendIds) ? friendIds : [])
          .map((id) => String(id || "").trim())
          .filter(Boolean)
      )
    ].filter((id) => id !== me);

    await rest("cloud_listen_settings?id=eq.1", {
      method: "PATCH",
      body: {
        restrict_enabled: enabled,
        updated_by: me,
        updated_at: new Date().toISOString()
      },
      prefer: "return=minimal"
    });

    const existing = await rest("cloud_listen_allowlist?select=friend_id");
    const oldIds = (Array.isArray(existing) ? existing : [])
      .map((r) => String(r.friend_id || ""))
      .filter(Boolean);
    const want = new Set(ids);
    const old = new Set(oldIds);
    const toAdd = ids.filter((id) => !old.has(id));
    const toRemove = oldIds.filter((id) => !want.has(id));

    for (const id of toRemove) {
      await rest(
        `cloud_listen_allowlist?friend_id=eq.${encodeURIComponent(id)}`,
        { method: "DELETE", prefer: "return=minimal" }
      );
    }
    if (toAdd.length) {
      await rest("cloud_listen_allowlist", {
        method: "POST",
        body: toAdd.map((friend_id) => ({ friend_id, added_by: me })),
        prefer: "return=minimal"
      });
    }
    return fetchCloudListenAcl();
  }

  async function listCloudSongs() {
    if (!cloudEnabled()) return [];
    const c = cfg();
    let token = c.anonKey;
    try {
      const session = await ensureAuthSession();
      if (session?.access_token) token = session.access_token;
    } catch {
      /* 游客用 anon；限制开启时 RLS 会返回空列表 */
    }
    try {
      const rows = await restWithToken(
        "cloud_songs?select=id,uploader_id,title,artist,song_key,audio_path,cover_path,lrc_path,video_path,duration,file_size,created_at&order=created_at.desc&limit=500",
        token
      );
      return Array.isArray(rows) ? rows : [];
    } catch (err) {
      const msg = String(err?.message || "");
      if (/video_path|Could not find/i.test(msg)) {
        try {
          const rows = await restWithToken(
            "cloud_songs?select=id,uploader_id,title,artist,song_key,audio_path,cover_path,lrc_path,duration,file_size,created_at&order=created_at.desc&limit=500",
            token
          );
          return Array.isArray(rows) ? rows : [];
        } catch {
          /* fall through */
        }
      }
      if (/cloud_songs|schema cache|relation|does not exist/i.test(msg)) {
        return [];
      }
      console.warn("[LudongCloud] listCloudSongs", err);
      return [];
    }
  }

  async function uploadCloudSong({
    title,
    artist,
    audioFile,
    coverFile,
    lrcFile,
    videoFile,
    duration
  } = {}) {
    if (!cloudEnabled()) throw new Error("云端未配置");
    if (!audioFile && !coverFile && !lrcFile && !videoFile) {
      throw new Error("请选择 MP3 / 歌词 / 封面 / 视频中的至少一种");
    }
    assertCloudAssetSizes({ audioFile, coverFile, lrcFile, videoFile });

    const nameSource = audioFile || lrcFile || coverFile || videoFile;
    const parsed = parseSongFileName(nameSource?.name || "");
    const t =
      String(title || parsed.title || "未命名").trim().slice(0, 120) || "未命名";
    const a =
      String(artist || parsed.artist || "未知歌手").trim().slice(0, 120) ||
      "未知歌手";
    const songKey = makeSongKey(t, a);
    if (!songKey || songKey === "|") throw new Error("歌名无效");

    let existing = null;
    try {
      existing = await findCloudSongByTitleArtist(t, a);
    } catch (err) {
      if (err?.code === "AMBIGUOUS_CLOUD_MATCH") throw err;
      const msg = String(err?.message || "");
      if (/cloud_songs|schema cache|relation|does not exist/i.test(msg)) {
        throw new Error("云端曲库未配置：请在 Supabase 执行 supabase_cloud_songs.sql");
      }
      throw err;
    }

    if (existing) {
      return patchCloudSongAssets(existing, {
        audioFile,
        coverFile,
        lrcFile,
        videoFile,
        duration
      });
    }

    if (!audioFile) {
      const label = isUnknownArtist(a) ? t : `${t} - ${a}`;
      throw new Error(
        `共同曲库没有匹配「${label}」的歌；补传歌词/封面/视频前请先上传该曲 MP3，并确保文件名为「歌名-歌手」`
      );
    }

    const me = await currentUserId();
    const songId =
      (global.crypto && crypto.randomUUID && crypto.randomUUID()) ||
      `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const base = `${me}/${songId}`;
    const audioPath = `${base}/audio.mp3`;
    let coverPath = "";
    let lrcPath = "";
    let videoPath = "";
    const uploaded = [audioPath];

    try {
      await storageUpload(audioPath, audioFile, audioFile.type || "audio/mpeg");

      if (coverFile) {
        const ext = (String(coverFile.name || "").match(/\.(\w+)$/) || [])[1] || "jpg";
        const safeExt = /^(jpe?g|png|webp)$/i.test(ext) ? ext.toLowerCase() : "jpg";
        const outExt = safeExt === "jpeg" ? "jpg" : safeExt;
        coverPath = `${base}/cover.${outExt}`;
        await storageUpload(
          coverPath,
          coverFile,
          coverFile.type || `image/${outExt === "jpg" ? "jpeg" : outExt}`
        );
        uploaded.push(coverPath);
      }

      if (lrcFile) {
        const lyricExt = /\.srt$/i.test(String(lrcFile.name || "")) ? "srt" : "lrc";
        lrcPath = `${base}/lyrics.${lyricExt}`;
        await storageUpload(lrcPath, lrcFile, "text/plain");
        uploaded.push(lrcPath);
      }

      if (videoFile) {
        const vExt = (String(videoFile.name || "").match(/\.(\w+)$/) || [])[1] || "mp4";
        const safeV = /^(mp4|webm|mov|mkv|m4v)$/i.test(vExt)
          ? vExt.toLowerCase()
          : "mp4";
        videoPath = `${base}/video.${safeV}`;
        const mime =
          videoFile.type ||
          (safeV === "webm"
            ? "video/webm"
            : safeV === "mov"
              ? "video/quicktime"
              : safeV === "mkv"
                ? "video/x-matroska"
                : "video/mp4");
        await storageUpload(videoPath, videoFile, mime);
        uploaded.push(videoPath);
      }

      const body = {
        uploader_id: me,
        title: t,
        artist: a,
        song_key: songKey,
        audio_path: audioPath,
        cover_path: coverPath,
        lrc_path: lrcPath,
        duration: Math.max(0, Math.round(Number(duration) || 0)),
        file_size: Number(audioFile.size) || 0
      };
      if (videoPath) body.video_path = videoPath;

      let rows;
      try {
        rows = await rest("cloud_songs", {
          method: "POST",
          prefer: "return=representation",
          body
        });
      } catch (err) {
        const msg = String(err?.message || "");
        if (videoPath && /video_path|schema cache|Could not find/i.test(msg)) {
          throw new Error(
            "云端尚未开通 MV 字段：请在 Supabase 执行 supabase_cloud_songs_video.sql"
          );
        }
        throw err;
      }
      const row = Array.isArray(rows) ? rows[0] : rows;
      if (!row?.id) throw new Error("写入曲库失败");
      try {
        await completeWishesForSong(t, a);
      } catch {
        /* 心愿单表未建时不影响上传 */
      }
      return row;
    } catch (err) {
      try {
        await storageRemove(uploaded);
      } catch {
        /* ignore cleanup */
      }
      const msg = String(err?.message || "");
      if (/duplicate|unique|cloud_songs_song_key/i.test(msg)) {
        try {
          const again = await findCloudSongByTitleArtist(t, a);
          if (again) {
            return patchCloudSongAssets(again, {
              audioFile,
              coverFile,
              lrcFile,
              videoFile,
              duration
            });
          }
        } catch {
          /* fall through */
        }
        throw new Error(`共同曲库已有「${t} - ${a}」，请直接选中要替换的文件重传`);
      }
      if (/cloud_songs|schema cache|relation|does not exist/i.test(msg)) {
        throw new Error("云端曲库未配置：请在 Supabase 执行 supabase_cloud_songs.sql");
      }
      if (/mime|not allowed|file size|maximum/i.test(msg) && videoPath) {
        throw new Error(
          "视频上传被桶限制拦截：请执行 supabase_cloud_songs_video.sql 后重试"
        );
      }
      throw err;
    }
  }

  async function deleteCloudSong(songId) {
    if (!songId) throw new Error("缺少歌曲 id");
    const me = await currentUserId();
    let rows;
    try {
      rows = await rest(
        `cloud_songs?id=eq.${encodeURIComponent(songId)}&select=id,uploader_id,audio_path,cover_path,lrc_path,video_path`
      );
    } catch {
      rows = await rest(
        `cloud_songs?id=eq.${encodeURIComponent(songId)}&select=id,uploader_id,audio_path,cover_path,lrc_path`
      );
    }
    const row = Array.isArray(rows) ? rows[0] : rows;
    if (!row) throw new Error("歌曲不存在或已删除");
    if (String(row.uploader_id) !== String(me)) {
      throw new Error("只能删除自己上传的云端歌曲");
    }
    const paths = [row.audio_path, row.cover_path, row.lrc_path, row.video_path].filter(
      Boolean
    );
    await rest(`cloud_songs?id=eq.${encodeURIComponent(songId)}`, {
      method: "DELETE",
      prefer: "return=minimal"
    });
    try {
      await storageRemove(paths);
    } catch {
      /* 元数据已删，文件清理失败不阻断 */
    }
    return { ok: true };
  }

  function mapListenTogetherSession(row) {
    if (!row) return null;
    return {
      id: String(row.id || ""),
      hostId: String(row.host_id || ""),
      guestId: String(row.guest_id || ""),
      status: String(row.status || ""),
      songKey: String(row.song_key || ""),
      cloudSongId: row.cloud_song_id ? String(row.cloud_song_id) : "",
      songTitle: String(row.song_title || ""),
      songArtist: String(row.song_artist || ""),
      songCover: String(row.song_cover || ""),
      audioUrl: String(row.audio_url || ""),
      playing: !!row.playing,
      positionMs: Math.max(0, Math.round(Number(row.position_ms) || 0)),
      seekSeq: Math.max(0, Math.round(Number(row.seek_seq) || 0)),
      startedAt: row.started_at || "",
      updatedBy: String(row.updated_by || ""),
      createdAt: row.created_at || "",
      updatedAt: row.updated_at || ""
    };
  }

  function listenTogetherMissingHint(err) {
    const msg = String(err?.message || "");
    if (/listen_together|schema cache|relation|does not exist/i.test(msg)) {
      return "一起听还没开通：请在 Supabase 执行 supabase_listen_together.sql";
    }
    return msg || "一起听请求失败";
  }

  async function listListenTogetherSessions() {
    const me = await currentUserId();
    try {
      const rows = await rest(
        `listen_together_sessions?or=(host_id.eq.${encodeURIComponent(me)},guest_id.eq.${encodeURIComponent(me)})&status=in.(pending,active)&select=*&order=updated_at.desc&limit=40`
      );
      return (Array.isArray(rows) ? rows : []).map(mapListenTogetherSession).filter(Boolean);
    } catch (err) {
      throw new Error(listenTogetherMissingHint(err));
    }
  }

  async function inviteListenTogether(guestId, song) {
    const me = await currentUserId();
    const guest = String(guestId || "");
    if (!guest || guest === me) throw new Error("请选择好友");
    const audioUrl = String(song?.audioUrl || song?.url || "");
    if (!audioUrl) throw new Error("这首歌没有可同步的播放地址");
    const payload = {
      host_id: me,
      guest_id: guest,
      status: "pending",
      song_key: String(song?.songKey || song?.id || ""),
      cloud_song_id: song?.cloudSongId || song?.cloudId || null,
      song_title: String(song?.title || "未命名").slice(0, 120),
      song_artist: String(song?.artist || "未知歌手").slice(0, 120),
      song_cover: String(song?.cover || "").slice(0, 2000),
      audio_url: audioUrl.slice(0, 2000),
      playing: !!song?.playing,
      position_ms: Math.max(0, Math.round(Number(song?.positionMs) || 0)),
      seek_seq: 0,
      updated_by: me,
      updated_at: new Date().toISOString()
    };
    try {
      const open = await rest(
        `listen_together_sessions?host_id=eq.${encodeURIComponent(me)}&guest_id=eq.${encodeURIComponent(guest)}&status=in.(pending,active)&select=id,status&limit=5`
      );
      for (const row of Array.isArray(open) ? open : []) {
        await rest(`listen_together_sessions?id=eq.${encodeURIComponent(row.id)}`, {
          method: "PATCH",
          body: {
            status: row.status === "active" ? "ended" : "cancelled",
            updated_by: me,
            updated_at: new Date().toISOString()
          },
          prefer: "return=minimal"
        });
      }
      const rows = await rest("listen_together_sessions", {
        method: "POST",
        body: payload,
        prefer: "return=representation"
      });
      const row = Array.isArray(rows) ? rows[0] : rows;
      return mapListenTogetherSession(row);
    } catch (err) {
      throw new Error(listenTogetherMissingHint(err));
    }
  }

  async function cancelListenTogether(sessionId) {
    const me = await currentUserId();
    const id = String(sessionId || "");
    if (!id) throw new Error("缺少会话");
    try {
      const rows = await rest(
        `listen_together_sessions?id=eq.${encodeURIComponent(id)}&or=(host_id.eq.${encodeURIComponent(me)},guest_id.eq.${encodeURIComponent(me)})&select=id,host_id,guest_id,status&limit=1`
      );
      const row = Array.isArray(rows) ? rows[0] : rows;
      if (!row) throw new Error("会话不存在");
      const next =
        row.status === "active" ? "ended" : row.status === "pending" ? "cancelled" : row.status;
      await rest(`listen_together_sessions?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: {
          status: next,
          playing: false,
          updated_by: me,
          updated_at: new Date().toISOString()
        },
        prefer: "return=minimal"
      });
      return { ok: true, status: next };
    } catch (err) {
      throw new Error(listenTogetherMissingHint(err));
    }
  }

  async function respondListenTogether(sessionId, accept) {
    const me = await currentUserId();
    const id = String(sessionId || "");
    if (!id) throw new Error("缺少邀请");
    try {
      const rows = await rest(
        `listen_together_sessions?id=eq.${encodeURIComponent(id)}&guest_id=eq.${encodeURIComponent(me)}&status=eq.pending&select=*&limit=1`
      );
      const row = Array.isArray(rows) ? rows[0] : rows;
      if (!row) throw new Error("邀请已失效");
      if (accept) {
        const mine = await rest(
          `listen_together_sessions?or=(host_id.eq.${encodeURIComponent(me)},guest_id.eq.${encodeURIComponent(me)})&status=eq.active&select=id&limit=20`
        );
        for (const old of Array.isArray(mine) ? mine : []) {
          if (String(old.id) === id) continue;
          await rest(`listen_together_sessions?id=eq.${encodeURIComponent(old.id)}`, {
            method: "PATCH",
            body: {
              status: "ended",
              playing: false,
              updated_by: me,
              updated_at: new Date().toISOString()
            },
            prefer: "return=minimal"
          });
        }
      }
      const body = {
        status: accept ? "active" : "rejected",
        updated_by: me,
        updated_at: new Date().toISOString()
      };
      if (accept) body.started_at = new Date().toISOString();
      let patched;
      try {
        patched = await rest(`listen_together_sessions?id=eq.${encodeURIComponent(id)}`, {
          method: "PATCH",
          body,
          prefer: "return=representation"
        });
      } catch (err) {
        if (accept && /started_at/i.test(String(err?.message || ""))) {
          delete body.started_at;
          patched = await rest(`listen_together_sessions?id=eq.${encodeURIComponent(id)}`, {
            method: "PATCH",
            body,
            prefer: "return=representation"
          });
        } else {
          throw err;
        }
      }
      const next = Array.isArray(patched) ? patched[0] : patched;
      return mapListenTogetherSession(next);
    } catch (err) {
      throw new Error(listenTogetherMissingHint(err));
    }
  }

  async function pushListenTogetherState(sessionId, state = {}) {
    const me = await currentUserId();
    const id = String(sessionId || "");
    if (!id) throw new Error("缺少会话");
    const body = {
      updated_by: me,
      updated_at: new Date().toISOString()
    };
    if (typeof state.playing === "boolean") body.playing = state.playing;
    if (Number.isFinite(Number(state.positionMs))) {
      body.position_ms = Math.max(0, Math.round(Number(state.positionMs)));
    }
    if (state.bumpSeek) {
      body.seek_seq = Math.max(0, Math.round(Number(state.seekSeq) || 0)) + 1;
    } else if (Number.isFinite(Number(state.seekSeq))) {
      body.seek_seq = Math.max(0, Math.round(Number(state.seekSeq)));
    }
    if (state.songTitle != null) body.song_title = String(state.songTitle).slice(0, 120);
    if (state.songArtist != null) body.song_artist = String(state.songArtist).slice(0, 120);
    if (state.songCover != null) body.song_cover = String(state.songCover).slice(0, 2000);
    if (state.audioUrl != null) body.audio_url = String(state.audioUrl).slice(0, 2000);
    if (state.songKey != null) body.song_key = String(state.songKey);
    if (state.cloudSongId != null) body.cloud_song_id = state.cloudSongId || null;
    try {
      const patched = await rest(
        `listen_together_sessions?id=eq.${encodeURIComponent(id)}&status=eq.active&or=(host_id.eq.${encodeURIComponent(me)},guest_id.eq.${encodeURIComponent(me)})`,
        {
          method: "PATCH",
          body,
          prefer: "return=representation"
        }
      );
      const row = Array.isArray(patched) ? patched[0] : patched;
      return mapListenTogetherSession(row);
    } catch (err) {
      throw new Error(listenTogetherMissingHint(err));
    }
  }

  global.LudongCloud = {
    enabled: cloudEnabled,
    avatarPresets: AVATAR_PRESETS,
    avatarSrc,
    formatUserNo,
    parseUserNo,
    isVipUserNo,
    isCreatorUserNo,
    resolveHonorTitle,
    vipToneClass,
    getAvatar,
    setAvatar,
    getLastEmail,
    setLastEmail,
    getGuestName: getDisplayName,
    getDisplayName,
    setDisplayName,
    isLoggedIn,
    ensureGuestSession: ensureAuthSession,
    ensureAuthSession,
    currentUserId,
    currentUserIdSync,
    getActiveUserId,
    setActiveUserId,
    upsertMyProfile,
    fetchMyProfile,
    getMyProfile,
    updateMyProfile,
    updatePassword,
    lookupLoginPreview,
    signUp,
    signIn,
    signOut,
    listComments,
    addComment,
    deleteComment,
    reactComment,
    listProfiles,
    listFriends,
    setFriendRemark,
    searchProfiles,
    listFriendRequests,
    sendFriendRequest,
    respondFriendRequest,
    cancelFriendRequest,
    touchPresence,
    listFriendsPresence,
    isOnlineFromLastSeen,
    PRESENCE_ONLINE_MS,
    listMessagesWith,
    sendDirectMessage,
    recallDirectMessage,
    listRecallUpdatesWith,
    markMessagesRead,
    getUnreadSummary,
    listReadUpdatesWith,
    listChatGroups,
    createChatGroup,
    renameChatGroup,
    deleteChatGroup,
    addChatGroupMembers,
    listGroupMessages,
    sendGroupMessage,
    markGroupMessagesRead,
    listGroupRecallUpdates,
    recallGroupMessage,
    getGroupUnreadSummary,
    fetchUserSync,
    saveUserSync,
    makeSongKey,
    wishMatchesSong,
    parseSongFileName,
    listSongWishes,
    addSongWish,
    completeWishesForSong,
    syncOpenWishes,
    storagePublicUrl,
    listCloudSongs,
    uploadCloudSong,
    deleteCloudSong,
    fetchCloudListenAcl,
    saveCloudListenAcl,
    listListenTogetherSessions,
    inviteListenTogether,
    cancelListenTogether,
    respondListenTogether,
    pushListenTogetherState
  };
})(window);
