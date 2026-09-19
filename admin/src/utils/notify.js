let audioCtx;

const getCtx = () => {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!audioCtx) audioCtx = new AC();
  return audioCtx;
};

// Call once at app start
export const initNotifications = () => {
  const events = ["click", "touchend", "keydown"];

  const unlock = async () => {
    try {
      const ctx = getCtx();
      await ctx?.resume();
      // stop listening only once audio is actually unlocked
      if (!ctx || ctx.state === "running") {
        events.forEach((e) => window.removeEventListener(e, unlock));
      }
    } catch {}
  };
  events.forEach((e) => window.addEventListener(e, unlock));

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }
};

const playSound = () => {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    [880, 1100].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      const t = ctx.currentTime + i * 0.2;
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.start(t);
      osc.stop(t + 0.18);
    });
  } catch {}
};

const showBanner = (title, body) => {
  try {
    const el = document.createElement("div");
    el.style.cssText =
      "position:fixed;top:16px;right:16px;z-index:99999;max-width:320px;padding:12px 16px;border-radius:12px;background:#4a1942;color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.25);font:14px system-ui,sans-serif;cursor:pointer";
    el.innerHTML = '<strong style="display:block;margin-bottom:2px"></strong><span></span>';
    el.children[0].textContent = title;
    el.children[1].textContent = body;
    el.onclick = () => el.remove();
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 6000);
  } catch {}
};

const showSystem = async (title, body) => {
  try {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    const opts = {
      body,
      icon: "/favicon.ico",
      tag: "new-order",
      renotify: true,
      vibrate: [200, 100, 200],
    };
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) await reg.showNotification(title, opts);
    else new Notification(title, opts);
  } catch {}
};

export const notifyNewOrder = (order) => {
  const title = "New order received";
  const body = order?.address?.name
    ? `${order.address.name} • ৳${order.amount ?? ""}`
    : "Check the Orders page";
  playSound();
  showBanner(title, body);
  showSystem(title, body);
  try { navigator.vibrate?.(200); } catch {}
};