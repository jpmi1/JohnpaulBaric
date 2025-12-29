/* =========================================================
   Landing interactions
   - Canvas reveal blob (IMAGE TWO) over IMAGE ONE
   - Speed-based fading trails
   - Wave lines (subtle) that respond to mouse position
   - Parallax on UI elements
   - UI color invert when blob overlaps UI elements

   Designed for "out-of-the-box" GitHub Pages hosting.
   ========================================================= */

(function () {
  "use strict";

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const hero = document.querySelector(".hero");
  const canvas = document.getElementById("heroCanvas");
  const ctx = canvas.getContext("2d", { alpha: true });

  const uiInner = document.querySelector(".hero__uiInner");
  const invertables = Array.from(document.querySelectorAll(".invertable"));
  const socialLinks = {
    instagram: document.querySelector('[data-social="instagram"]'),
    x: document.querySelector('[data-social="x"]'),
    youtube: document.querySelector('[data-social="youtube"]'),
    linkedin: document.querySelector('[data-social="linkedin"]')
  };

  // Populate from site-data.js (if present)
  if (window.SITE && window.SITE.social) {
    if (socialLinks.instagram) socialLinks.instagram.href = window.SITE.social.instagram || "#";
    if (socialLinks.x) socialLinks.x.href = window.SITE.social.x || "#";
    if (socialLinks.youtube) socialLinks.youtube.href = window.SITE.social.youtube || "#";
    if (socialLinks.linkedin) socialLinks.linkedin.href = window.SITE.social.linkedin || "#";
  }

  // Populate content sections (lists)
  function populate() {
    const s = window.SITE;
    if (!s) return;

    const personEl = document.getElementById("tagline");
    if (personEl && s.person && s.person.tagline) personEl.textContent = s.person.tagline;

    const projectsEl = document.getElementById("projects");
    if (projectsEl && s.portfolio && Array.isArray(s.portfolio.whatImBuilding)) {
      projectsEl.innerHTML = "";
      s.portfolio.whatImBuilding.forEach((p) => {
        const li = document.createElement("li");
        const title = document.createElement("strong");
        title.textContent = p.title || "Project";
        li.appendChild(title);

        if (p.description) {
          li.appendChild(document.createTextNode(" — " + p.description));
        }
        if (p.link && p.link !== "#") {
          const a = document.createElement("a");
          a.href = p.link;
          a.textContent = "  ↗";
          a.setAttribute("aria-label", "Open link for " + (p.title || "project"));
          a.style.marginLeft = "8px";
          li.appendChild(a);
        }
        projectsEl.appendChild(li);
      });
    }

    const milestonesEl = document.getElementById("milestones");
    if (milestonesEl && s.portfolio && Array.isArray(s.portfolio.milestones)) {
      milestonesEl.innerHTML = "";
      s.portfolio.milestones.forEach((m) => {
        const li = document.createElement("li");
        li.textContent = m;
        milestonesEl.appendChild(li);
      });
    }

    
    const countriesEl = document.getElementById("countries");
    const travelIntroEl = document.getElementById("travelIntro");
    if (travelIntroEl && s.travel && s.travel.intro) travelIntroEl.textContent = s.travel.intro;

    if (countriesEl && s.travel) {
      countriesEl.innerHTML = "";

      const addDivider = (label) => {
        const li = document.createElement("li");
        li.className = "list__divider";
        li.textContent = label;
        countriesEl.appendChild(li);
      };

      const addCountry = (name) => {
        const li = document.createElement("li");
        li.textContent = name;
        countriesEl.appendChild(li);
      };

      if (Array.isArray(s.travel.regions) && s.travel.regions.length) {
        s.travel.regions.forEach((r) => {
          if (r && r.name) addDivider(r.name);
          if (r && Array.isArray(r.countries)) r.countries.forEach(addCountry);
        });
      } else if (Array.isArray(s.travel.countries) && s.travel.countries.length) {
        s.travel.countries.forEach(addCountry);
      } else {
        const li = document.createElement("li");
        li.textContent = "Add your travel list in javascripts/site-data.js → SITE.travel.regions / SITE.travel.countries";
        countriesEl.appendChild(li);
      }
    }

    const booksIntroEl = document.getElementById("booksIntro");
    if (booksIntroEl && s.books && s.books.intro) booksIntroEl.textContent = s.books.intro;

    const booksExecEl = document.getElementById("booksExec");
    const booksTeamEl = document.getElementById("booksTeam");

    const bookHref = (b) => {
      if (b && b.url) return b.url;
      const q = encodeURIComponent(((b?.title || "") + " " + (b?.author || "")).trim());
      return "https://www.goodreads.com/search?q=" + q;
    };

    const renderBookList = (listEl, list, emptyMessage) => {
      if (!listEl) return;
      listEl.innerHTML = "";

      if (!Array.isArray(list) || list.length === 0) {
        const li = document.createElement("li");
        li.textContent = emptyMessage;
        listEl.appendChild(li);
        return;
      }

      list.forEach((b) => {
        const li = document.createElement("li");

        const hasDetails = !!(b.synopsis || b.takeaway || b.why);

        if (hasDetails) {
          const details = document.createElement("details");
          const summary = document.createElement("summary");

          const a = document.createElement("a");
          a.href = bookHref(b);
          a.target = "_blank";
          a.rel = "noreferrer";
          a.textContent = b.title || "Book";
          summary.appendChild(a);

          if (b.author) summary.appendChild(document.createTextNode(" — " + b.author));

          details.appendChild(summary);

          const meta = document.createElement("div");
          meta.className = "bookMeta";

          if (b.synopsis) {
            const p = document.createElement("p");
            const strong = document.createElement("strong");
            strong.textContent = "Synopsis:";
            p.appendChild(strong);
            p.appendChild(document.createTextNode(" " + b.synopsis));
            meta.appendChild(p);
          }

          if (b.takeaway) {
            const p = document.createElement("p");
            const strong = document.createElement("strong");
            strong.textContent = "Key takeaway:";
            p.appendChild(strong);
            p.appendChild(document.createTextNode(" " + b.takeaway));
            meta.appendChild(p);
          }

          if (b.why) {
            const p = document.createElement("p");
            const strong = document.createElement("strong");
            strong.textContent = "Why it matters:";
            p.appendChild(strong);
            p.appendChild(document.createTextNode(" " + b.why));
            meta.appendChild(p);
          }

          details.appendChild(meta);
          li.appendChild(details);
        } else {
          const a = document.createElement("a");
          a.href = bookHref(b);
          a.target = "_blank";
          a.rel = "noreferrer";
          a.textContent = b.title || "Book";
          li.appendChild(a);

          if (b.author) {
            const span = document.createElement("span");
            span.textContent = " — " + b.author;
            li.appendChild(span);
          }
        }

        listEl.appendChild(li);
      });
    };

    if (s.books) {
      renderBookList(
        booksExecEl,
        s.books.execTrack || s.books.executiveTrack || [],
        "Add books in javascripts/site-data.js → SITE.books.execTrack"
      );

      renderBookList(
        booksTeamEl,
        s.books.employeeLibrary || s.books.list || [],
        "Add books in javascripts/site-data.js → SITE.books.employeeLibrary"
      );
    }
const pressEl = document.getElementById("press");
    if (pressEl && Array.isArray(s.press)) {
      pressEl.innerHTML = "";
      if (s.press.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Add press links in javascripts/site-data.js → SITE.press";
        pressEl.appendChild(li);
      } else {
        s.press.forEach((p) => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = p.url || "#";
          a.target = "_blank";
          a.rel = "noreferrer";
          a.textContent = p.title || "Press";
          li.appendChild(a);

          const meta = [];
          if (p.outlet) meta.push(p.outlet);
          if (p.date) meta.push(p.date);
          if (meta.length) {
            const span = document.createElement("span");
            span.textContent = " — " + meta.join(" · ");
            li.appendChild(span);
          }
          pressEl.appendChild(li);
        });
      }
    }

    const emailEl = document.getElementById("emailLink");
    if (emailEl && s.contact && s.contact.email) {
      emailEl.href = "mailto:" + s.contact.email;
      emailEl.textContent = s.contact.email;
    }
  }


  function setupBookTabs() {
    const tabButtons = Array.from(document.querySelectorAll(".tabs .tab"));
    const panels = Array.from(document.querySelectorAll(".tabPanel"));
    if (!tabButtons.length || !panels.length) return;

    const activate = (key) => {
      tabButtons.forEach((btn) => {
        const isActive = btn.dataset.tab === key;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
      });

      panels.forEach((p) => {
        const isActive = p.dataset.panel === key;
        p.classList.toggle("is-active", isActive);
      });
    };

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => activate(btn.dataset.tab));
    });
  }
  populate();
  setupBookTabs();

  /* -------------------------
     Headgear widget
     ------------------------- */
  const overlayImg = document.getElementById("headgearOverlay");
  const gearButtons = Array.from(document.querySelectorAll("[data-gear]"));
  const gearMap = {
    none: "",
    miner: "images/overlays/miner-hat.svg",
    vibecoder: "images/overlays/vibecoder-headset.svg",
    ski: "images/overlays/ski-helmet.svg"
  };

  function setGear(key) {
    gearButtons.forEach((b) => b.classList.toggle("is-active", b.dataset.gear === key));
    if (!overlayImg) return;
    overlayImg.style.display = key === "none" ? "none" : "block";
    overlayImg.src = gearMap[key] || "";
    overlayImg.alt = key === "none" ? "" : key + " overlay";
  }

  setGear("miner");
  gearButtons.forEach((b) => b.addEventListener("click", () => setGear(b.dataset.gear)));

  /* -------------------------
     Hero reveal blob
     ------------------------- */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const imgA = new Image();
  const imgB = new Image();
  imgA.src = "images/hero-1.jpg";
  imgB.src = "images/hero-2.jpg";

  const state = {
    dpr: 1,
    w: 0,
    h: 0,

    pointer: { x: 0, y: 0, inside: false },
    blob: { x: 0, y: 0, r: 160, visibility: 0 },

    prevBlob: { x: 0, y: 0 },
    trails: [],

    t: 0,
    lastT: 0,
    imagesReady: false
  };

  function resize() {
    const rect = hero.getBoundingClientRect();
    state.dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    state.w = Math.floor(rect.width);
    state.h = Math.floor(rect.height);

    canvas.width = Math.floor(state.w * state.dpr);
    canvas.height = Math.floor(state.h * state.dpr);
    canvas.style.width = state.w + "px";
    canvas.style.height = state.h + "px";

    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

    // Initialize positions
    if (state.pointer.x === 0 && state.pointer.y === 0) {
      state.pointer.x = state.w * 0.5;
      state.pointer.y = state.h * 0.52;
      state.blob.x = state.pointer.x;
      state.blob.y = state.pointer.y;
      state.prevBlob.x = state.blob.x;
      state.prevBlob.y = state.blob.y;
    }
  }

  window.addEventListener("resize", () => {
    resize();
    if (state.imagesReady && (prefersReducedMotion || !hoverCapable)) {
      renderStatic();
    }
  }, { passive: true });
  resize();

  function drawCover(img, dx, dy, extraScale) {
    if (!img || !img.width || !img.height) return;

    const iw = img.width;
    const ih = img.height;

    const scale = Math.max(state.w / iw, state.h / ih) * (extraScale || 1);
    const dw = iw * scale;
    const dh = ih * scale;

    const x = (state.w - dw) * 0.5 + dx;
    const y = (state.h - dh) * 0.5 + dy;

    ctx.drawImage(img, x, y, dw, dh);
  }

  function blobPath(cx, cy, r, timeMs) {
    const points = 14;
    const wobble = 0.12; // higher = more organic
    const speed = 0.0025;

    const pts = [];
    for (let i = 0; i < points; i++) {
      const a = (i / points) * Math.PI * 2;
      const n =
        Math.sin(a * 3 + timeMs * speed) * 0.55 +
        Math.sin(a * 5 - timeMs * speed * 0.9) * 0.35 +
        Math.sin(a * 9 + timeMs * speed * 1.3) * 0.20;

      const rr = r * (1 + n * wobble);
      pts.push({
        x: cx + Math.cos(a) * rr,
        y: cy + Math.sin(a) * rr
      });
    }

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);

    for (let i = 0; i < pts.length; i++) {
      const p0 = pts[(i - 1 + pts.length) % pts.length];
      const p1 = pts[i];
      const p2 = pts[(i + 1) % pts.length];
      const p3 = pts[(i + 2) % pts.length];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }

    ctx.closePath();
  }

  function intersectsCircleRect(cx, cy, r, rect) {
    const nx = clamp(cx, rect.left, rect.right);
    const ny = clamp(cy, rect.top, rect.bottom);
    const dx = cx - nx;
    const dy = cy - ny;
    return dx * dx + dy * dy <= r * r;
  }

  function updateUIInversion() {
    const v = state.blob.visibility;
    if (v < 0.15) {
      invertables.forEach((el) => el.classList.remove("is-inverted"));
      return;
    }

    // Blob coordinates are relative to the hero; DOM rects are viewport-based.
    const heroRect = hero.getBoundingClientRect();
    const cx = heroRect.left + state.blob.x;
    const cy = heroRect.top + state.blob.y;
    const r = state.blob.r * v;

    invertables.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const hit = intersectsCircleRect(cx, cy, r, rect);
      el.classList.toggle("is-inverted", hit);
    });
  }

  function drawWaves(timeMs, intensity, nx, ny) {
    const lines = 7;
    const margin = 40;
    const ampBase = 7 + intensity * 9;
    const freq = 0.012;

    ctx.save();
    ctx.globalAlpha = 0.16;
    ctx.lineWidth = 1;

    // Slightly respond to cursor with gentle phase shift
    const phase = timeMs * 0.0012 + nx * 0.9;

    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    for (let i = 0; i < lines; i++) {
      const y0 = margin + ((state.h - margin * 2) * i) / (lines - 1);
      const amp = ampBase * (0.7 + i * 0.06) * (1 + Math.abs(ny) * 0.5);
      ctx.beginPath();

      const step = 16;
      for (let x = 0; x <= state.w + step; x += step) {
        const y =
          y0 +
          Math.sin(x * freq + phase + i * 0.6) * amp +
          Math.sin(x * freq * 0.6 - phase * 1.1 + i) * (amp * 0.35);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function renderStatic() {
    ctx.clearRect(0, 0, state.w, state.h);
    drawCover(imgA, 0, 0, 1);
  }

  function tick(t) {
    if (prefersReducedMotion || !hoverCapable) {
      // Static render: show IMAGE ONE only.
      renderStatic();
      return;
    }

    if (!state.imagesReady) {
      ctx.clearRect(0, 0, state.w, state.h);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, state.w, state.h);
      // Minimal loading text
      ctx.fillStyle = "rgba(11,11,12,0.55)";
      ctx.font = "14px ui-sans-serif, system-ui, -apple-system";
      ctx.fillText("Loading…", 24, 34);
      requestAnimationFrame(tick);
      return;
    }

    state.t = t;
    const dt = state.lastT ? Math.min(40, t - state.lastT) : 16.7;
    state.lastT = t;

    // Smooth-follow blob position
    const follow = 0.12;
    state.blob.x += (state.pointer.x - state.blob.x) * follow;
    state.blob.y += (state.pointer.y - state.blob.y) * follow;

    // Speed estimate
    const dx = state.blob.x - state.prevBlob.x;
    const dy = state.blob.y - state.prevBlob.y;
    const speed = Math.sqrt(dx * dx + dy * dy) / Math.max(1, dt); // px per ms
    state.prevBlob.x = state.blob.x;
    state.prevBlob.y = state.blob.y;

    // Visibility easing
    const targetVis = state.pointer.inside ? 1 : 0;
    state.blob.visibility += (targetVis - state.blob.visibility) * 0.08;

    // Blob size responds to speed (subtle)
    const baseR = 150;
    state.blob.r = clamp(baseR + speed * 800, 120, 230);

    // Spawn trails when moving fast
    if (state.pointer.inside && speed > 0.18) {
      const count = clamp(Math.round(speed * 6), 1, 3);
      for (let i = 0; i < count; i++) {
        state.trails.push({
          x: state.blob.x - dx * (0.8 + i * 0.25),
          y: state.blob.y - dy * (0.8 + i * 0.25),
          r: clamp(state.blob.r * (0.55 - i * 0.08), 40, 140),
          a: clamp(0.34 + speed * 0.35, 0.28, 0.62)
        });
      }
    }

    // Fade trails
    for (let i = state.trails.length - 1; i >= 0; i--) {
      const tr = state.trails[i];
      tr.a *= Math.pow(0.90, dt / 16.7);
      tr.r *= Math.pow(0.985, dt / 16.7);
      if (tr.a < 0.02 || tr.r < 10) state.trails.splice(i, 1);
    }

    // Parallax (opposite direction)
    const nx = (state.pointer.x / state.w - 0.5) * 2;
    const ny = (state.pointer.y / state.h - 0.5) * 2;
    const px = -nx * 10;
    const py = -ny * 10;
    hero.style.setProperty("--parallax-x", px.toFixed(2) + "px");
    hero.style.setProperty("--parallax-y", py.toFixed(2) + "px");

    // Draw base
    ctx.clearRect(0, 0, state.w, state.h);
    drawCover(imgA, px * 0.5, py * 0.5, 1);

    // Waves (subtle)
    drawWaves(t, clamp(speed * 2.5, 0, 1), nx, ny);

    // Reveal trails (fading)
    const vis = state.blob.visibility;
    if (vis > 0.01) {
      for (let i = 0; i < state.trails.length; i++) {
        const tr = state.trails[i];
        ctx.save();
        ctx.globalAlpha = tr.a * vis;
        ctx.beginPath();
        ctx.arc(tr.x, tr.y, tr.r, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        drawCover(imgB, px * 0.5, py * 0.5, 1);
        ctx.restore();
      }

      // Main blob (organic)
      ctx.save();
      ctx.globalAlpha = 1 * vis;
      blobPath(state.blob.x, state.blob.y, state.blob.r, t);
      ctx.clip();
      drawCover(imgB, px * 0.5, py * 0.5, 1);
      ctx.restore();

      // Optional faint outline for definition
      ctx.save();
      ctx.globalAlpha = 0.18 * vis;
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      blobPath(state.blob.x, state.blob.y, state.blob.r, t);
      ctx.stroke();
      ctx.restore();
    }

    updateUIInversion();

    requestAnimationFrame(tick);
  }

  function startWhenReady() {
    if (imgA.complete && imgB.complete && imgA.naturalWidth && imgB.naturalWidth) {
      state.imagesReady = true;

      // If we're not running the animation loop (mobile / reduced motion),
      // do one static render immediately.
      if (prefersReducedMotion || !hoverCapable) {
        renderStatic();
        return;
      }

      requestAnimationFrame(tick);
      return;
    }
    setTimeout(startWhenReady, 50);
  }
  startWhenReady();

  // Pointer handlers
  function setFromEvent(e) {
    const rect = hero.getBoundingClientRect();
    state.pointer.x = clamp(e.clientX - rect.left, 0, rect.width);
    state.pointer.y = clamp(e.clientY - rect.top, 0, rect.height);
  }

  hero.addEventListener(
    "pointerenter",
    (e) => {
      if (!hoverCapable || prefersReducedMotion) return;
      state.pointer.inside = true;
      setFromEvent(e);
    },
    { passive: true }
  );

  hero.addEventListener(
    "pointermove",
    (e) => {
      if (!hoverCapable || prefersReducedMotion) return;
      setFromEvent(e);
    },
    { passive: true }
  );

  hero.addEventListener(
    "pointerleave",
    () => {
      state.pointer.inside = false;
    },
    { passive: true }
  );

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href.length < 2) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();
