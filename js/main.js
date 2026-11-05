/*
 * Portfolio interactions — vanilla JS, no dependencies.
 * Every feature is progressive: the page is complete and usable without JS.
 */
(() => {
  "use strict";

  const root = document.documentElement;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const storage = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch {
        /* storage unavailable (private mode, blocked cookies) — ignore */
      }
    },
  };

  /* ---------- Notification banner ---------- */
  const toast = $("[data-toast]");
  let toastTimer;

  function notify(title, body) {
    if (!toast) return;
    clearTimeout(toastTimer);
    $("[data-toast-title]", toast).textContent = title;
    $("[data-toast-body]", toast).textContent = body;
    toast.classList.remove("is-leaving");
    toast.hidden = false;
    toastTimer = setTimeout(() => {
      toast.classList.add("is-leaving");
      toast.addEventListener("animationend", () => (toast.hidden = true), { once: true });
    }, 3200);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  /* ---------- Menu bar clock & footer year ---------- */
  const clock = $("[data-clock]");
  const clockFormat = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  function tick() {
    const now = new Date();
    clock.textContent = clockFormat.format(now).replace(/,/g, "");
    clock.dateTime = now.toISOString();
  }

  if (clock) {
    tick();
    setInterval(tick, 15_000);
  }

  $$("[data-year]").forEach((el) => (el.textContent = String(new Date().getFullYear())));

  /* ---------- Appearance (light / dark) ---------- */
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  function currentTheme() {
    return root.dataset.theme || (systemDark.matches ? "dark" : "light");
  }

  $("[data-action='toggle-theme']")?.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    storage.set("theme", next);
  });

  /* ---------- Window controls ---------- */
  const win = $("[data-window]");
  const zoomBtn = $("[data-action='zoom']");

  zoomBtn?.addEventListener("click", () => {
    const zoomed = win.classList.toggle("is-zoomed");
    zoomBtn.setAttribute("aria-pressed", String(zoomed));
  });

  function minimize() {
    win.classList.add("is-minimized");
    win.inert = true;
    notify("Portfolio minimized", "Click Portfolio in the Dock to bring it back.");
  }

  function restore() {
    if (!win.classList.contains("is-minimized")) return false;
    win.inert = false;
    win.classList.remove("is-minimized");
    return true;
  }

  $$("[data-action='minimize']").forEach((btn) => btn.addEventListener("click", minimize));

  $$("[data-action='restore']").forEach((link) =>
    link.addEventListener("click", (event) => {
      if (!restore()) return; // window already open: normal anchor navigation
      event.preventDefault();
      const target = $(link.hash);
      setTimeout(() => target?.scrollIntoView({ behavior: "smooth" }), 350);
    }),
  );

  /* ---------- Copy actions ---------- */
  $("[data-action='copy-link']")?.addEventListener("click", async () => {
    const url = location.href.split("#")[0];
    const ok = await copyText(url);
    notify(ok ? "Link copied" : "Copy this link", url);
  });

  $("[data-action='copy-email']")?.addEventListener("click", async (event) => {
    const email = event.currentTarget.dataset.email;
    const ok = await copyText(email);
    notify(ok ? "Email copied" : "Email", email);
  });

  /* ---------- Address bar: current section + reading progress ---------- */
  const addressPath = $("[data-address-path]");
  const progress = $("[data-progress]");
  let ticking = false;

  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    progress?.style.setProperty("--progress", ratio.toFixed(4));
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateProgress);
      }
    },
    { passive: true },
  );
  updateProgress();

  if (addressPath && "IntersectionObserver" in window) {
    const sections = $$("main section[id]");
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) addressPath.textContent = `/#${entry.target.id}`;
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => sectionObserver.observe(section));

    // Clear the path when back at the hero
    const hero = $(".hero");
    new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) addressPath.textContent = "";
      },
      { rootMargin: "-45% 0px -50% 0px" },
    ).observe(hero);
  }

  /* ---------- Project filter (segmented control) ---------- */
  const filterButtons = $$("[data-filter]");
  const cards = $$(".projects .card");

  filterButtons.forEach((btn) =>
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      filterButtons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      cards.forEach((card) => {
        card.hidden = filter !== "all" && card.dataset.category !== filter;
      });
    }),
  );

  /* ---------- Scroll reveal ---------- */
  const revealables = $$(".reveal");

  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    revealables.forEach((el) => revealObserver.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Terminal typing animation ---------- */
  const terminal = $("#terminal");
  const termBody = $("[data-terminal]");

  async function typeTerminal() {
    const lines = $$(":scope > p", termBody);
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    termBody.setAttribute("aria-busy", "true");
    terminal.classList.add("is-typing");
    lines.forEach((line) => line.classList.add("t-pending"));

    // Prepare commands: remember their text, then empty them
    const commands = new Map();
    $$(".t-cmd", termBody).forEach((cmd) => {
      commands.set(cmd, cmd.textContent);
      cmd.textContent = "";
    });

    await wait(500);

    for (const line of lines) {
      line.classList.remove("t-pending");
      const cmd = $(".t-cmd", line);
      if (cmd) {
        const text = commands.get(cmd);
        for (let i = 1; i <= text.length; i += 1) {
          cmd.textContent = text.slice(0, i);
          await wait(38 + Math.random() * 45);
        }
        await wait(220);
      } else {
        await wait(110);
      }
    }

    terminal.classList.remove("is-typing");
    termBody.removeAttribute("aria-busy");
  }

  if (terminal && termBody && !reducedMotion.matches) typeTerminal();
})();
