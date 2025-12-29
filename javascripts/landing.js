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

  /* -------------------------
     Populate from site-data.js
     ------------------------- */
  function populate() {
    const s = window.SITE;
    if (!s) return;

    // Social
    if (s.social) {
      if (socialLinks.instagram) socialLinks.instagram.href = s.social.instagram || "#";
      if (socialLinks.x) socialLinks.x.href = s.social.x || "#";
      if (socialLinks.youtube) socialLinks.youtube.href = s.social.youtube || "#";
      if (socialLinks.linkedin) socialLinks.linkedin.href = s.social.linkedin || "#";
    }

    // Tagline
    const taglineEl = document.getElementById("tagline");
    if (taglineEl && s.person && s.person.tagline) taglineEl.textContent = s.person.tagline;

    // BAITA
    const baita = s.baita || {};
    const baitaTitle = document.getElementById("baitaTitle");
    const baitaSubtitle = document.getElementById("baitaSubtitle");
    const baitaBlurb = document.getElementById("baitaBlurb");
    const baitaDiff = document.getElementById("baitaDifferentiators");
    const baitaProd = document.getElementById("baitaProduct");
    const baitaDeck = document.getElementById("baitaDeck");
    const baitaEmail = document.getElementById("baitaEmail");
    const baitaLinkedIn = document.getElementById("baitaLinkedIn");
    const baitaRaise = document.getElementById("baitaRaise");

    if (baitaTitle) baitaTitle.textContent = baita.title || "BAITA AI";
    if (baitaSubtitle) baitaSubtitle.textContent = baita.subtitle || "";
    if (baitaBlurb) baitaBlurb.textContent = baita.blurb || "";

    if (baitaDiff && Array.isArray(baita.differentiators)) {
      baitaDiff.innerHTML = "";
      baita.differentiators.forEach((x) => {
        const li = document.createElement("li");
        li.textContent = x;
        baitaDiff.appendChild(li);
      });
    }

    if (baitaProd && Array.isArray(baita.product)) {
      baitaProd.innerHTML = "";
      baita.product.forEach((x) => {
        const li = document.createElement("li");
        li.textContent = x;
        baitaProd.appendChild(li);
      });
    }

    if (baitaRaise && baita.fundraising) {
      const pills = [];
      if (baita.fundraising.round) pills.push(baita.fundraising.round);
      if (baita.fundraising.valuationCap) pills.push(baita.fundraising.valuationCap);
      if (baita.fundraising.discount) pills.push(baita.fundraising.discount);
      baitaRaise.innerHTML = "";
      pills.forEach((p) => {
        const span = document.createElement("span");
        span.className = "pill";
        span.textContent = p;
        baitaRaise.appendChild(span);
      });
    }

    if (baitaDeck && baita.deckUrl) baitaDeck.href = baita.deckUrl;
    if (baitaEmail && baita.investorEmail) {
      const subj = encodeURIComponent("BAITA Investor Inquiry");
      baitaEmail.href = "mailto:" + baita.investorEmail + "?subject=" + subj;
    }

    if (baitaLinkedIn) {
      const li = (baita.investorLinkedIn) || (s.social && s.social.linkedin) || "#";
      baitaLinkedIn.href = li;
    }

    // Podcast
    const pod = s.podcast || {};
    const podName = document.getElementById("podcastName");
    const podDesc = document.getElementById("podcastDesc");
    const podLinks = document.getElementById("podcastLinks");
    if (podName) podName.textContent = pod.name || "Digital Gold";
    if (podDesc) podDesc.textContent = pod.description || "";
    if (podLinks && Array.isArray(pod.links)) {
      podLinks.innerHTML = "";
      pod.links.forEach((l) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = l.url || "#";
        a.target = "_blank";
        a.rel = "noreferrer";
        a.textContent = l.label || "Link";
        li.appendChild(a);
        podLinks.appendChild(li);
      });
    }

    // Social Proof
    const sp = s.socialProof || {};
    const spFollowers = document.getElementById("spFollowers");
    const spViews = document.getElementById("spViews");
    const spPlatforms = document.getElementById("spPlatforms");
    const spViral = document.getElementById("spViral");
    const spDrPhil = document.getElementById("spDrPhil");
    const spImg = document.getElementById("spImg");
    const spNotes = document.getElementById("spNotes");

    if (spFollowers) spFollowers.textContent = sp.tiktokFollowers || "—";
    if (spViews) spViews.textContent = sp.viralViews || "—";
    if (spPlatforms) spPlatforms.textContent = sp.platforms || "";
    if (spViral && sp.viralUrl) spViral.href = sp.viralUrl;
    if (spDrPhil && sp.drPhilUrl) spDrPhil.href = sp.drPhilUrl;
    if (spImg && sp.screenshot) spImg.src = sp.screenshot;

    if (spNotes && Array.isArray(sp.notes)) {
      spNotes.innerHTML = "";
      sp.notes.forEach((n) => {
        const li = document.createElement("li");
        li.textContent = n;
        spNotes.appendChild(li);
      });
    }

    // Travel
    const travelIntro = document.getElementById("travelIntro");
    const travelWrap = document.getElementById("travelRegions");
    if (travelIntro && s.travel && s.travel.intro) travelIntro.textContent = s.travel.intro;

    if (travelWrap && s.travel && Array.isArray(s.travel.regions)) {
      travelWrap.innerHTML = "";
      s.travel.regions.forEach((r) => {
        const card = document.createElement("div");
        card.className = "card";
        const h3 = document.createElement("h3");
        h3.textContent = r.name;
        const ul = document.createElement("ul");
        ul.className = "list";
        (r.countries || []).forEach((c) => {
          const li = document.createElement("li");
          li.textContent = c;
          ul.appendChild(li);
        });
        card.appendChild(h3);
        card.appendChild(ul);
        travelWrap.appendChild(card);
      });
    }

    // Speaking
    const speakIntro = document.getElementById("speakingIntro");
    const speakGallery = document.getElementById("speakingGallery");
    if (speakIntro && s.speaking && s.speaking.intro) speakIntro.textContent = s.speaking.intro;
    if (speakGallery && s.speaking && Array.isArray(s.speaking.photos)) {
      speakGallery.innerHTML = "";
      s.speaking.photos.forEach((p) => {
        const a = document.createElement("a");
        a.href = p.src;
        a.target = "_blank";
        a.rel = "noreferrer";

        const fig = document.createElement("figure");
        fig.style.margin = "0";

        const img = document.createElement("img");
        img.src = p.src;
        img.alt = p.caption || "Speaking photo";

        const cap = document.createElement("figcaption");
        cap.textContent = p.caption || "";

        fig.appendChild(img);
        fig.appendChild(cap);
        a.appendChild(fig);
        speakGallery.appendChild(a);
      });
    }

    // Books
    const booksIntro = document.getElementById("booksIntro");
    if (booksIntro && s.books && s.books.intro) booksIntro.textContent = s.books.intro;

    const bookTabBtns = Array.from(document.querySelectorAll("[data-booktab]"));
    const bookList = document.getElementById("bookList");

    function renderBooks(which) {
      if (!bookList || !s.books) return;

      const list = which === "executive" ? s.books.executive : s.books.employee;
      bookList.innerHTML = "";

      (list || []).forEach((b) => {
        const li = document.createElement("li");

        const a = document.createElement("a");
        a.href = b.url || "#";
        a.target = "_blank";
        a.rel = "noreferrer";
        a.textContent = b.title || "Book";
        li.appendChild(a);

        const meta = document.createElement("div");
        meta.className = "bookMeta";
        const bits = [];
        if (b.author) bits.push(b.author);
        if (b.synopsis) bits.push(b.synopsis);
        if (b.takeaway) bits.push("Key takeaway: " + b.takeaway);
        if (b.why) bits.push("Why: " + b.why);
        meta.textContent = bits.join(" — ");
        li.appendChild(meta);

        bookList.appendChild(li);
      });
    }

    function setTab(which) {
      bookTabBtns.forEach((b) => b.classList.toggle("is-active", b.dataset.booktab === which));
      renderBooks(which);
    }

    bookTabBtns.forEach((b) => b.addEventListener("click", () => setTab(b.dataset.booktab)));
    setTab("executive");

    // Press
    const pressEl = document.getElementById("press");
    if (pressEl && Array.isArray(s.press)) {
      pressEl.innerHTML = "";
      s.press.forEach((p) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = p.url || "#";
        a.target = "_blank";
        a.rel = "noreferrer";
        a.textContent = p.title || "Link";
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

    // Contact
    const emailEl = document.getElementById("emailLink");
    if (emailEl && s.contact && s.contact.email) {
      emailEl.href = "mailto:" + s.contact.email;
      emailEl.textContent = s.contact.email;
    }
  }
  populate();

  /* -------------------------
     Headgear widget
     ------------------------- */
  const overlayImg = document.getElementById("headgearOverlay");
  const gearButtons = Array.from(document.querySelectorAll("[data-gear]"));
  const gearMap = {
    none: "",
    miner: "images/overlays/miner-hat.svg",
    vibecoder: "images/overlays/vibecoder-headset.svg",
    ski: "images/overlays/ski-helmet.svg",
    space: "images/overlays/space-helmet.svg"
  };

  function setGear(key) {
    gearButtons.forEach((b) => b.classList.toggle("is-active", b.dataset.gear === key));
    if (!overlayImg) return;
    overlayImg.style.display = key === "none" ? "none" : "block";
    overlayImg.src = gearMap[key] || "";
    overlayImg.alt = key === "none" ? "" : key + " overlay";
  }

  setGear("space");
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

    if (state.pointer.x === 0 && state.pointer.y === 0) {
      state.pointer.x = state.w * 0.5;
      state.pointer.y = state.h * 0.52;
      state.blob.x = state.pointer.x;
      state.blob.y = state.pointer.y;
      state.prevBlob.x = state.blob.x;
      state.prevBlob.y = state.blob.y;
    }
  }

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

    // darken overlay for readability (subtle)
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0, 0, state.w, state.h);
    ctx.restore();
  }

  function blobPath(cx, cy, r, timeMs) {
    const points = 14;
    const wobble = 0.12;
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

    const phase = timeMs * 0.0012 + nx * 0.9;

    ctx.strokeStyle = "rgba(167,139,250,0.28)";
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
      renderStatic();
      return;
    }

    if (!state.imagesReady) {
      ctx.clearRect(0, 0, state.w, state.h);
      ctx.fillStyle = "#05030a";
      ctx.fillRect(0, 0, state.w, state.h);
      ctx.fillStyle = "rgba(217,204,255,0.65)";
      ctx.font = "14px ui-sans-serif, system-ui, -apple-system";
      ctx.fillText("Loading…", 24, 34);
      requestAnimationFrame(tick);
      return;
    }

    state.t = t;
    const dt = state.lastT ? Math.min(40, t - state.lastT) : 16.7;
    state.lastT = t;

    const follow = 0.12;
    state.blob.x += (state.pointer.x - state.blob.x) * follow;
    state.blob.y += (state.pointer.y - state.blob.y) * follow;

    const dx = state.blob.x - state.prevBlob.x;
    const dy = state.blob.y - state.prevBlob.y;
    const speed = Math.sqrt(dx * dx + dy * dy) / Math.max(1, dt);
    state.prevBlob.x = state.blob.x;
    state.prevBlob.y = state.blob.y;

    const targetVis = state.pointer.inside ? 1 : 0;
    state.blob.visibility += (targetVis - state.blob.visibility) * 0.08;

    const baseR = 150;
    state.blob.r = clamp(baseR + speed * 800, 120, 230);

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

    for (let i = state.trails.length - 1; i >= 0; i--) {
      const tr = state.trails[i];
      tr.a *= Math.pow(0.90, dt / 16.7);
      tr.r *= Math.pow(0.985, dt / 16.7);
      if (tr.a < 0.02 || tr.r < 10) state.trails.splice(i, 1);
    }

    const nx = (state.pointer.x / state.w - 0.5) * 2;
    const ny = (state.pointer.y / state.h - 0.5) * 2;
    const px = -nx * 10;
    const py = -ny * 10;
    hero.style.setProperty("--parallax-x", px.toFixed(2) + "px");
    hero.style.setProperty("--parallax-y", py.toFixed(2) + "px");

    ctx.clearRect(0, 0, state.w, state.h);
    drawCover(imgA, px * 0.5, py * 0.5, 1);

    drawWaves(t, clamp(speed * 2.5, 0, 1), nx, ny);

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

      ctx.save();
      ctx.globalAlpha = 1 * vis;
      blobPath(state.blob.x, state.blob.y, state.blob.r, t);
      ctx.clip();
      drawCover(imgB, px * 0.5, py * 0.5, 1);
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = 0.24 * vis;
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = "rgba(167,139,250,0.85)";
      blobPath(state.blob.x, state.blob.y, state.blob.r, t);
      ctx.stroke();
      ctx.restore();
    }

    updateUIInversion();

    requestAnimationFrame(tick);
  }

  window.addEventListener(
    "resize",
    () => {
      resize();
      if (state.imagesReady && (prefersReducedMotion || !hoverCapable)) renderStatic();
    },
    { passive: true }
  );
  resize();

  function startWhenReady() {
    if (imgA.complete && imgB.complete && imgA.naturalWidth && imgB.naturalWidth) {
      state.imagesReady = true;
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
