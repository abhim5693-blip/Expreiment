(() => {
  "use strict";
  const U = (id, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const inr = (n) => "₹" + n.toLocaleString("en-IN");

  /* Stand-in photography (Unsplash). Swap these ids for your own shoot. */
  const P = {
    silkClose: "1717585679395-bbe39b5fb6bc",
    store: "1761549924624-6a00e5dfabb7",
    palace: "1654764746242-7592b9c6ce2e",
    hangers: "1773218373348-34db6bb11662",
    market: "1760262492479-85a9832b9034",
    beach: "1727430228383-aa1fb59db8bf",
    purple: "1641699862936-be9f49b1c38d",
    pinkGold: "1617627143750-d86bc21e42bb",
    navyRed: "1610030469983-98e550d6193c",
    blueMulti: "1692992193981-d3d92fabd9cb",
    blueYellow: "1610189012906-4c0aa9b9781e",
    blueYellow2: "1610189013429-a703f4b245cf",
    trio: "1610189026205-27510cfc52f8",
    orange: "1597897545000-7c99a285f27e",
    whiteRed: "1756887957725-2111152d4e4f",
    cream: "1787753650891-c6e2625071df",
    cream2: "1787753650890-bae0eb536cf5",
    redJewel: "1731131368117-eb6b45f2b679",
    whiteDrape: "1742676971855-3d3658f32757",
    floral: "1693382507826-e1ee4140f6a7",
    redFlow: "1610189337543-1c5d8e64f574",
    bride: "1610047614256-023d7c028d0b",
    bride2: "1631549423688-6708c88f4672",
  };

  /* ---------------- toast + bag ---------------- */
  let bag = 0;
  const toastEl = $("#toast");
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add("is-show");
    clearTimeout(toast.t); toast.t = setTimeout(() => toastEl.classList.remove("is-show"), 2600);
  }
  function addToBag(n, label) {
    bag += n;
    const c = $("#bagCount");
    c.textContent = bag; c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump");
    $("#bagBtn").setAttribute("aria-label", `Bag, ${bag} items`);
    toast(label);
  }
  $("#bagBtn").addEventListener("click", () => toast(bag ? `${bag} piece${bag > 1 ? "s" : ""} in your bag` : "Your bag is empty"));

  /* ---------------- curtain intro ---------------- */
  const curtain = $("#curtain"), nav = $("#nav");
  function openCurtain() {
    if (curtain.classList.contains("is-open")) return;
    curtain.classList.add("is-open");
    document.body.classList.remove("is-locked");
    nav.classList.add("is-in");
    startHero();
    setTimeout(() => curtain.classList.add("is-gone"), 1700);
  }
  $("#curtainSkip").addEventListener("click", openCurtain);
  curtain.addEventListener("click", openCurtain);
  addEventListener("wheel", openCurtain, { once: true, passive: true });
  setTimeout(openCurtain, reduce ? 0 : 1900);

  /* ---------------- nav ---------------- */
  $("#burger").addEventListener("click", (e) => {
    const open = nav.classList.toggle("is-menu");
    e.currentTarget.setAttribute("aria-expanded", open);
  });
  $$(".nav__links a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("is-menu")));
  const spyLinks = $$("[data-spy]");
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const id = en.target.id === "hero" ? "top" : en.target.id;
      spyLinks.forEach((l) => l.classList.toggle("is-active", l.dataset.spy === id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["hero", "look", "pick", "rail", "drape", "motion", "bridal", "weave"].forEach((id) => spy.observe($("#" + id)));

  /* ---------------- hero slideshow ---------------- */
  const HERO = [
    { img: P.store, eyebrow: "Kanchipuram · Est. 1962", title: "Woven for the Divine.", sub: "Pure mulberry silk, real zari, three generations of hands." },
    { img: P.palace, eyebrow: "The temple collection", title: "Gold that catches temple light.", sub: "Silk and zari borders, woven to glow under lamp and sun." },
    { img: P.navyRed, eyebrow: "Heirloom weaves", title: "An heirloom from the first fold.", sub: "Woven once, kept for generations." },
    { img: P.hangers, eyebrow: "Six hundred on the floor", title: "Every colour the loom knows.", sub: "Walk the rail in store, or right here below." },
  ];
  const slidesEl = $("#heroSlides"), dotsEl = $("#heroDots"), copy = $(".hero__copy");
  HERO.forEach((h, i) => {
    slidesEl.insertAdjacentHTML("beforeend", `<div class="hero__slide"><img src="${U(h.img, 1800)}" alt="" ${i ? 'loading="lazy"' : ""}></div>`);
    const d = document.createElement("button");
    d.className = "hero__dot"; d.setAttribute("aria-label", `Slide ${i + 1}`); d.innerHTML = "<i></i>";
    d.addEventListener("click", () => showHero(i, true));
    dotsEl.appendChild(d);
  });
  let heroI = -1, heroT;
  function showHero(i, manual) {
    if (i === heroI) return;
    heroI = i;
    $$(".hero__slide").forEach((s, k) => s.classList.toggle("is-on", k === i));
    $$(".hero__dot").forEach((d, k) => { d.classList.remove("is-on"); d.classList.toggle("is-done", k < i); });
    const dot = dotsEl.children[i]; void dot.offsetWidth; dot.classList.add("is-on");
    copy.classList.add("is-out");
    setTimeout(() => {
      $("#heroEyebrow").textContent = HERO[i].eyebrow;
      $("#heroTitle").textContent = HERO[i].title;
      $("#heroSub").textContent = HERO[i].sub;
      copy.classList.remove("is-out");
    }, manual ? 250 : 500);
    clearTimeout(heroT);
    heroT = setTimeout(() => showHero((i + 1) % HERO.length), 6000);
  }
  function startHero() { if (heroI < 0) showHero(0); }

  /* ---------------- ribbon ---------------- */
  const words = ["Pure zari", "Handwoven", "Temple borders", "Bridal silk", "Kanchipuram", "Since 1962", "Silk mark certified"];
  $("#ribbonTrack").innerHTML = [...words, ...words, ...words, ...words].map((w) => `<span>${w}</span>`).join("");

  /* ---------------- try the look ---------------- */
  const LOOKS = [
    { name: "Temple Morning", img: P.orange, mood: "Festive", pieces: [["Saffron Kanchi saree", 18400, "#e8771e"], ["Maroon brocade blouse", 3200, "#7a1430"], ["Temple jhumkas", 2650, "#d9a93a"]] },
    { name: "Coastal Gold", img: P.beach, mood: "Wedding guest", pieces: [["Rose-gold tissue saree", 22900, "#d99a7c"], ["Antique zari blouse", 3900, "#b07a3a"], ["Layered haram", 5400, "#e2b84a"]] },
    { name: "Royal Violet", img: P.purple, mood: "Reception", pieces: [["Violet Banarasi saree", 26500, "#6b2a7a"], ["Gold tissue blouse", 4100, "#d8b25a"], ["Pearl chokers", 3800, "#efe6d4"]] },
    { name: "Garden Rose", img: P.pinkGold, mood: "Day function", pieces: [["Pink & mango silk", 16800, "#e2457a"], ["Mango silk blouse", 2900, "#f0a43a"], ["Kemp studs", 1900, "#b3122f"]] },
    { name: "Midnight Kanchi", img: P.navyRed, mood: "Evening", pieces: [["Navy Kanchi saree", 21500, "#232a5a"], ["Red contrast blouse", 3100, "#c1121f"], ["Gold kada pair", 4200, "#d4a640"]] },
    { name: "Peacock Pallu", img: P.blueYellow2, mood: "Pooja", pieces: [["Ink-blue silk saree", 15900, "#1f2a7a"], ["Yellow border blouse", 2700, "#f2c230"], ["Peacock earrings", 2400, "#1d8a7a"]] },
    { name: "Ivory & Red", img: P.whiteRed, mood: "Onam", pieces: [["Kasavu-red silk", 12800, "#f3eee2"], ["Red raw-silk blouse", 2600, "#b3122f"], ["Jasmine pin set", 900, "#f7f3ea"]] },
    { name: "Painted Garden", img: P.floral, mood: "Haldi", pieces: [["Multicolour paithani", 19600, "#e2408a"], ["Green silk blouse", 2800, "#2f8a3a"], ["Nath & bangles", 3300, "#d4a640"]] },
  ];
  const lookStage = $("#lookStage"), lookPieces = $("#lookPieces"), lookBack = $("#lookBack");
  const lifts = [40, 0, 26, -10, 18, -4, 30, 8];
  LOOKS.forEach((l, i) => {
    const f = document.createElement("figure");
    f.className = "look__fig"; f.tabIndex = 0; f.setAttribute("role", "button");
    f.setAttribute("aria-label", `See the pieces in ${l.name}`);
    f.style.setProperty("--i", i); f.style.setProperty("--lift", lifts[i]); f.style.setProperty("--d", Math.abs(i - 3.5) | 0);
    f.innerHTML = `<img src="${U(l.img, 700)}" alt="${l.name} look" loading="lazy"><figcaption>${l.name}<span>${l.mood}</span></figcaption>`;
    f.addEventListener("click", () => selectLook(i));
    f.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectLook(i); } });
    lookStage.appendChild(f);
  });
  function lookHint() {
    lookPieces.innerHTML = `<p class="look__hint"><b>Tap any look</b> to see its saree, blouse and jewellery laid out, with prices. Add the whole look in one go.</p>`;
  }
  let lookSel = -1;
  function selectLook(i) {
    lookSel = i;
    lookStage.classList.add("has-sel");
    $$(".look__fig").forEach((f, k) => f.classList.toggle("is-sel", k === i));
    const l = LOOKS[i];
    const total = l.pieces.reduce((s, p) => s + p[1], 0);
    lookPieces.innerHTML = l.pieces.map((p, k) =>
      `<div class="piece" style="--k:${k}"><span class="piece__sw" style="background:linear-gradient(135deg, ${p[2]}, ${p[2]}cc 60%, #d9a93a)"></span><div><b>${p[0]}</b><small>${inr(p[1])}</small></div></div>`
    ).join("") + `<div class="look__total"><span>Full look · <b>${inr(total)}</b></span><button class="pill pill--red" id="lookAdd">Add look</button></div>`;
    $("#lookAdd").addEventListener("click", () => addToBag(l.pieces.length, `${l.name}: ${l.pieces.length} pieces added to your bag`));
    lookBack.hidden = false;
  }
  function clearLook() {
    lookSel = -1;
    lookStage.classList.remove("has-sel");
    $$(".look__fig").forEach((f) => f.classList.remove("is-sel"));
    lookBack.hidden = true; lookHint();
  }
  lookBack.addEventListener("click", clearLook);
  lookHint();

  /* ---------------- pick a silk ---------------- */
  const SILKS = [
    { name: "Kanchi", sub: "Pattu", bg: "#c4122f", img: P.purple, note: "Kanchipuram, Tamil Nadu. Heavy mulberry silk with contrast temple borders, woven in three shuttles." },
    { name: "Koorai", sub: "Wedding check", bg: "#1f7a2e", img: P.blueYellow, note: "The nine-yard check worn at Tamil weddings. Small checks, deep borders, a ritual weave." },
    { name: "Murshidabad", sub: "Bengal silk", bg: "#e0144c", img: P.blueMulti, note: "Murshidabad, West Bengal. Light, fluid silk that takes block prints beautifully." },
    { name: "Monsoon", sub: "Tussar", bg: "#1e63d6", img: P.blueYellow2, note: "Wild tussar with a natural gold sheen. Textured, breathable, made for humid months." },
    { name: "Sindoori", sub: "Festive red", bg: "#b45309", img: P.redFlow, note: "Our festival red, dyed three times for depth. Gold butta scattered across the body." },
    { name: "Palace", sub: "Brocade", bg: "#6a2bd1", img: P.palace, note: "Brocade weaves from palace pattern books. Dense zari, heirloom weight." },
    { name: "Bengal", sub: "Garad", bg: "#8a6a0b", img: P.whiteRed, note: "Undyed garad silk with a red border. Worn for Durga Puja, and every day after." },
    { name: "Benaras", sub: "Katan", bg: "#a3123f", img: P.pinkGold, note: "Varanasi katan silk with kadhua brocade. Each motif is woven in by hand, one by one." },
  ];
  const deck = $("#pickDeck"), cap = $("#pickCaption");
  SILKS.forEach((s, i) => {
    const c = document.createElement("article");
    c.className = "silk"; c.style.setProperty("--bg", s.bg); c.tabIndex = 0;
    c.innerHTML = `<h3 class="silk__name"${s.name.length > 8 ? ' style="font-size:34px"' : ""}>${s.name}<span>${s.sub}</span></h3><span class="silk__badge">↗</span>
      <div class="silk__img"><img src="${U(s.img, 600)}" alt="" loading="lazy"><span>From ${inr(9800 + i * 2350)}</span></div>`;
    c.addEventListener("click", () => { if (!dragMoved) setPick(i); });
    c.addEventListener("keydown", (e) => { if (e.key === "Enter") setPick(i); });
    deck.appendChild(c);
  });
  let pickI = 2;
  function setPick(i) {
    pickI = Math.max(0, Math.min(SILKS.length - 1, i));
    $$(".silk", deck).forEach((c, k) => {
      const off = k - pickI;
      c.style.setProperty("--off", off); c.style.setProperty("--abs", Math.abs(off));
      c.classList.toggle("is-active", off === 0);
    });
    cap.style.opacity = 0;
    setTimeout(() => { cap.textContent = SILKS[pickI].note; cap.style.opacity = 1; }, 180);
  }
  $("#pickPrev").addEventListener("click", () => setPick(pickI - 1));
  $("#pickNext").addEventListener("click", () => setPick(pickI + 1));
  let dragX = null, dragMoved = false;
  deck.addEventListener("pointerdown", (e) => { dragX = e.clientX; dragMoved = false; deck.classList.add("is-drag"); });
  addEventListener("pointermove", (e) => {
    if (dragX === null) return;
    const dx = e.clientX - dragX;
    if (Math.abs(dx) > 90) { setPick(pickI + (dx < 0 ? 1 : -1)); dragX = e.clientX; dragMoved = true; }
  });
  addEventListener("pointerup", () => { dragX = null; deck.classList.remove("is-drag"); setTimeout(() => (dragMoved = false), 0); });
  setPick(pickI);

  /* ---------------- the wardrobe (rail) ---------------- */
  // Garment-only saree shots (no models). Colour = [name, body, border, file, family]
  const FAMS = [["all", "All sarees"], ["red", "Reds & pinks"], ["green", "Greens & blues"], ["gold", "Golds & ivory"], ["purple", "Purples"]];
  const PRODUCTS = [
    { name: "Kanchi Korvai Pattu", price: 18400, weave: "Kanchipuram, korvai border", desc: "Mulberry silk with a contrast black korvai border and a heavy zari pallu. The one to pass down.",
      colors: [["Rani magenta", "#c0177a", "#1b1b1b", "magenta", "red"], ["Temple red", "#c8202f", "#1b1b1b", "temple-red", "red"], ["Bottle green", "#1f5e3a", "#1b1b1b", "bottle-green", "green"],
        ["Mango yellow", "#e3a21a", "#1b1b1b", "mango", "gold"], ["Peacock", "#0f6a6b", "#1b1b1b", "peacock", "green"], ["Wine", "#6e1230", "#1b1b1b", "wine", "red"]] },
    { name: "Kanchi Zari Border Saree", price: 16900, weave: "Kanchipuram, zari border", desc: "Soft pastel silk edged in a broad gold zari border, with small woven buttas across the body.",
      colors: [["Lilac", "#9b6bb5", "#d9a93f", "lilac", "purple"], ["Rose pink", "#e07a9a", "#d9a93f", "rose", "red"], ["Parrot green", "#5aa83a", "#d9a93f", "parrot", "green"],
        ["Sky blue", "#6fa8d6", "#d9a93f", "sky", "green"], ["Coral", "#e8674f", "#d9a93f", "coral", "red"], ["Mint", "#7cc7a8", "#d9a93f", "mint", "green"]] },
    { name: "Kanchi Rettai Pettu", price: 19600, weave: "Kanchipuram, double wine border", desc: "Deep jewel-tone body with a wine double border. Heavier silk, made for the wedding itself.",
      colors: [["Midnight navy", "#22305f", "#7a1e57", "navy", "green"], ["Emerald", "#0f6b4a", "#7a1e57", "emerald", "green"], ["Plum", "#5a2160", "#7a1e57", "plum", "purple"]] },
    { name: "Temple Ivory Kanchi", price: 21500, weave: "Kanchipuram, temple border", desc: "Ivory silk with a gold temple border and pallu. Worn for temple days and the morning muhurtham.",
      colors: [["Temple ivory", "#efe3c4", "#c79a3a", "ivory", "gold"]] },
  ];
  const BLOUSE = ["Unstitched blouse", "Stitched blouse +₹1,200"];
  // one hanger per colourway, mixed so the rail never shows two of a kind side by side
  const HANG = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [3, 0], [0, 2], [1, 2], [2, 1], [0, 3], [1, 3], [0, 4], [1, 4], [2, 2], [0, 5], [1, 5]].map(([p, k]) => ({ p, k }));
  const imgOf = (p, k) => `img/rail/kanchi-${PRODUCTS[p].colors[k][3]}.webp`;
  const swBg = (c) => `linear-gradient(135deg, ${c[1]} 0 58%, ${c[2]} 58% 100%)`;
  const colOf = (h) => PRODUCTS[HANG[h].p].colors[HANG[h].k];

  const ward = $("#ward"), track = $("#wardTrack"), rack = $("#wardRack");
  const chips = $("#railChips");
  chips.innerHTML = FAMS.map(([k, label]) => `<button class="chip" role="tab" data-k="${k}" aria-selected="${k === "all"}">${label} <i></i></button>`).join("");
  const countChips = () => $$(".chip", chips).forEach((c) => { const k = c.dataset.k; $("i", c).textContent = k === "all" ? HANG.length : HANG.filter((_, h) => colOf(h)[4] === k).length; });

  HANG.forEach((hg, h) => {
    const p = PRODUCTS[hg.p], c = colOf(h);
    const el = document.createElement("button");
    el.className = "gar"; el.dataset.i = h;
    el.innerHTML = `<span class="gar__sway"><span class="gar__card"><img src="${imgOf(hg.p, hg.k)}" alt="" loading="lazy" draggable="false"></span></span>
      <span class="gar__tag"><b>${p.name}</b><small><i class="gar__dot"></i><span class="gar__col"></span> · ${inr(p.price)}</small></span>`;
    el.style.setProperty("--d", h);
    // nothing on a real rail hangs perfectly straight
    el.style.setProperty("--jy", ((h * 37) % 9) + "px");
    el.style.setProperty("--rz", (((h * 53) % 7) - 3) * 0.35 + "deg");
    rack.appendChild(el);
  });
  const gars = $$(".gar", rack);
  function paintHanger(h) {
    const g = gars[h], p = PRODUCTS[HANG[h].p], c = colOf(h);
    $(".gar__col", g).textContent = c[0];
    $(".gar__dot", g).style.background = swBg(c);
    g.dataset.fam = c[4];
    g.setAttribute("aria-label", `${p.name} in ${c[0]}, ${inr(p.price)}. Open details`);
  }
  gars.forEach((_, h) => paintHanger(h));
  countChips();

  let wardCat = "all", hov = -1, openI = -1, geo = null;
  const dims = () => {
    const w = innerWidth;
    return w < 720 ? { step: 42, cw: 197, pad: 100 } : w < 1100 ? { step: 48, cw: 231, pad: 120 } : { step: 54, cw: 258, pad: 136 };
  };
  function layoutWard() {
    const { step, cw } = dims();
    let { pad } = dims();
    const shift = Math.round((cw - step) / 2 + 6);
    let x = 0;
    const vis = [];
    gars.forEach((g) => {
      const on = wardCat === "all" || g.dataset.fam === wardCat;
      g.classList.toggle("is-out", !on);
      g.tabIndex = on ? 0 : -1;
      if (on) vis.push(g);
    });
    pad = Math.max(pad, (track.clientWidth - (vis.length - 1) * step) / 2);
    const hi = vis.indexOf(gars[hov]);
    vis.forEach((g, k) => {
      g.style.left = `${pad + k * step}px`;
      g.style.setProperty("--sx", hi < 0 || k === hi ? "0px" : k < hi ? `${-shift}px` : `${shift}px`);
      x = k;
    });
    gars.forEach((g, i) => g.classList.toggle("is-front", i === hov || i === openI));
    rack.style.width = `${pad * 2 + x * step + shift}px`;
    rack.style.setProperty("--cw", cw + "px");
    geo = { pad, step, cw, shift, vis };
  }
  const face = (i) => { if (hov === i) return; hov = i; layoutWard(); };
  const unface = (i) => {
    if (i >= 0) { const g = gars[i]; g.classList.remove("is-swing"); void g.offsetWidth; g.classList.add("is-swing"); }
    hov = -1; layoutWard();
  };
  /* Which saree is under the pointer? The sarees overlap, so DOM hit-testing picks the wrong one
     (and the spread on hover moves them under the cursor, which made the hover flicker).
     Work it out from the layout instead: the facing saree wins anywhere over its full width,
     otherwise the visible strip of each side-on saree (later ones hang in front). */
  function garAt(e) {
    if (!geo) return -1;
    const r = rack.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const top = 22, bottom = top + parseFloat(getComputedStyle(ward).getPropertyValue("--ch")) + 10;
    if (y < top || y > bottom) return -1;
    const { pad, step, cw, shift, vis } = geo;
    const hi = vis.indexOf(gars[hov]);
    // fabric spans about 33% left / 36% right of centre; turned 38deg it projects to about 24% / 30%
    if (hi >= 0) { const c = pad + hi * step; if (x >= c - cw * 0.4 && x <= c + cw * 0.42) return hov; }
    for (let k = vis.length - 1; k >= 0; k--) {
      const c = pad + k * step + (hi < 0 || k === hi ? 0 : k < hi ? -shift : shift);
      if (x >= c - cw * 0.24 && x <= c + cw * 0.3) return +vis[k].dataset.i;
    }
    return -1;
  }
  track.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse" || wDrag) return;
    const i = garAt(e);
    if (i === hov) return;
    if (i < 0) unface(hov); else face(i);
    track.classList.toggle("is-on", i >= 0);
  });
  track.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse" && hov >= 0) { unface(hov); track.classList.remove("is-on"); } });
  track.addEventListener("click", (e) => {
    if (wMoved) return;
    const i = e.pointerType === "mouse" && hov >= 0 ? hov : garAt(e);
    if (i >= 0) openProduct(i);
  });
  // keyboard: each saree is still a real button
  gars.forEach((g, i) => {
    g.addEventListener("focus", () => { if (g.matches(":focus-visible")) face(i); });
    g.addEventListener("blur", () => { if (hov === i) unface(i); });
    g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openProduct(i); } });
  });

  chips.addEventListener("click", (e) => {
    const c = e.target.closest(".chip"); if (!c) return;
    wardCat = c.dataset.k; hov = -1;
    $$(".chip", chips).forEach((x) => x.setAttribute("aria-selected", x === c));
    layoutWard(); track.scrollTo({ left: 0, behavior: "smooth" });
  });

  // drag / wheel to slide along the rod
  let wx = null, wsl = 0, wMoved = false, wDrag = false;
  track.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") return; wx = e.clientX; wsl = track.scrollLeft; wMoved = false; });
  addEventListener("pointermove", (e) => {
    if (wx === null) return;
    const dx = e.clientX - wx;
    if (Math.abs(dx) > 6) { wMoved = true; wDrag = true; track.classList.add("is-drag"); if (hov >= 0) unface(-1); }
    if (wMoved) track.scrollLeft = wsl - dx;
  });
  addEventListener("pointerup", () => { wx = null; wDrag = false; track.classList.remove("is-drag"); setTimeout(() => (wMoved = false), 0); });
  track.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || track.scrollWidth <= track.clientWidth) return;
    const atEnd = (e.deltaY > 0 && track.scrollLeft + track.clientWidth >= track.scrollWidth - 1) || (e.deltaY < 0 && track.scrollLeft <= 0);
    if (!atEnd && e.shiftKey) { e.preventDefault(); track.scrollLeft += e.deltaY; }
  }, { passive: false });

  // the rail slides in when it comes into view
  new IntersectionObserver((es, o) => es.forEach((en) => { if (en.isIntersecting) { ward.classList.add("is-open", "is-opening"); setTimeout(() => ward.classList.remove("is-opening"), 2600); o.disconnect(); } }), { threshold: 0.3 }).observe(ward);

  /* ---------------- product sheet ---------------- */
  const pd = $("#pd"), pdImg = $("#pdImg");
  let pdSize = 0;
  function swapImg(img, src) {
    if (img.getAttribute("src") === src) return;
    const pre = new Image();
    img.classList.add("is-swap");
    pre.onload = pre.onerror = () => { img.src = src; setTimeout(() => img.classList.remove("is-swap"), 40); };
    pre.src = src;
  }
  function setColor(h, k) {
    const hg = HANG[h], p = PRODUCTS[hg.p], c = p.colors[k];
    hg.k = k;
    $("#pdColName").textContent = c[0];
    $("#pdBadge").textContent = c[0];
    pdImg.alt = `${p.name} in ${c[0]}`;
    swapImg(pdImg, imgOf(hg.p, k));
    $$(".pd__sw", pd).forEach((b, j) => { b.setAttribute("aria-checked", j === k); b.tabIndex = j === k ? 0 : -1; });
    // the saree on the rail changes with it
    swapImg($(".gar__card img", gars[h]), imgOf(hg.p, k));
    paintHanger(h);
    countChips();
  }
  function openProduct(h) {
    const p = PRODUCTS[HANG[h].p];
    openI = h; layoutWard();
    $("#pdCat").textContent = "Kanchipuram silk saree";
    $("#pdName").textContent = p.name;
    $("#pdPrice").textContent = inr(p.price);
    $("#pdDesc").textContent = p.desc;
    const multi = p.colors.length > 1;
    $("#pdSw").innerHTML = p.colors.map((c) => `<button class="pd__sw" role="radio" aria-label="${c[0]}" title="${c[0]}" style="--sw:${swBg(c)}"></button>`).join("");
    $("#pdColGroup").classList.toggle("is-single", !multi);
    pdSize = 0;
    $("#pdSizeLabel").textContent = "Blouse";
    $("#pdSizes").innerHTML = BLOUSE.map((s, k) => `<button class="pd__size" role="radio" aria-checked="${k === 0}" tabindex="${k === 0 ? 0 : -1}">${s}</button>`).join("");
    $("#pdFacts").innerHTML = `<div><dt>Weave</dt><dd>${p.weave}</dd></div><div><dt>Colours</dt><dd>${p.colors.length} ${multi ? "options" : "option"}</dd></div><div><dt>Length</dt><dd>6.3 m with blouse piece</dd></div><div><dt>Ships</dt><dd>In 3–5 days, free</dd></div>`;
    pdImg.classList.remove("is-swap");
    pdImg.src = imgOf(HANG[h].p, HANG[h].k); // no fade on open: the saree is there straight away
    setColor(h, HANG[h].k);
    if (!pd.open) pd.showModal();
    // warm the other colourways so switching is instant
    p.colors.forEach((_, k) => { const im = new Image(); im.src = imgOf(HANG[h].p, k); });
  }
  function closeProduct() { if (pd.open) pd.close(); }
  pd.addEventListener("close", () => { const i = openI; openI = -1; layoutWard(); if (i >= 0) gars[i].focus({ preventScroll: true }); });
  pd.addEventListener("click", (e) => { if (e.target === pd) closeProduct(); });
  $("#pdClose").addEventListener("click", closeProduct);
  $("#pdBack").addEventListener("click", closeProduct);
  $("#pdSw").addEventListener("click", (e) => { const b = e.target.closest(".pd__sw"); if (b) setColor(openI, $$(".pd__sw", pd).indexOf(b)); });
  $("#pdSizes").addEventListener("click", (e) => {
    const b = e.target.closest(".pd__size"); if (!b) return;
    pdSize = $$(".pd__size", pd).indexOf(b);
    $$(".pd__size", pd).forEach((x, j) => { x.setAttribute("aria-checked", j === pdSize); x.tabIndex = j === pdSize ? 0 : -1; });
  });
  // arrow keys inside the radio groups
  pd.addEventListener("keydown", (e) => {
    const b = e.target.closest(".pd__sw, .pd__size"); if (!b || !["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) return;
    e.preventDefault();
    const list = $$(b.classList.contains("pd__sw") ? ".pd__sw" : ".pd__size", pd);
    const n = (list.indexOf(b) + (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1) + list.length) % list.length;
    list[n].click(); list[n].focus();
  });
  $("#pdAdd").addEventListener("click", () => {
    const p = PRODUCTS[HANG[openI].p];
    addToBag(1, `${p.name} · ${colOf(openI)[0]} added to your bag`);
    closeProduct();
  });
  addEventListener("resize", layoutWard);
  layoutWard();

  /* ---------------- woven in light ---------------- */
  const lt = $("#lightText");
  const hot = new Set(["devotion.", "light."]);
  lt.innerHTML = lt.textContent.split(" ").map((w) => `<span class="w${hot.has(w) ? " hot" : ""}">${w}</span>`).join(" ");
  const lw = $$(".w", lt);
  const LIGHT = [[P.redJewel, "Temple Red"], [P.whiteDrape, "Ivory Drape"], [P.trio, "Sister Set"], [P.cream, "Cream Zari"], [P.bride2, "Rose Bridal"], [P.blueYellow, "Peacock Day"], [P.orange, "Saffron"], [P.cream2, "Curtain Call"]];
  $("#lightTrack").innerHTML = [...LIGHT, ...LIGHT].map(([id, t]) => `<div class="light__card"><img src="${U(id, 500)}" alt="" loading="lazy"><span>${t}</span></div>`).join("");

  /* ---------------- feel the drape ---------------- */
  const DRAPE = [[P.trio, "Three sisters, three silks"], [P.redFlow, "Sindoori, mid-twirl"], [P.cream2, "Embroidered tissue, curtain light"], [P.whiteDrape, "Ivory pleats, morning"], [P.redJewel, "Temple red, close up"], [P.bride, "The bridal fold"]];
  const dl = $(".drape__col--l"), dr = $(".drape__col--r"), dImg = $("#drapeImg"), dCap = $("#drapeCap");
  DRAPE.forEach(([id, t], i) => {
    const th = document.createElement("button");
    th.className = "drape__thumb"; th.setAttribute("aria-label", t);
    th.innerHTML = `<img src="${U(id, 500)}" alt="" loading="lazy">`;
    th.addEventListener("click", () => setDrape(i));
    (i < 3 ? dl : dr).appendChild(th);
  });
  let drapeI = -1, drapeT;
  function setDrape(i) {
    if (i === drapeI) return;
    drapeI = i;
    $$(".drape__thumb").forEach((t, k) => t.classList.toggle("is-on", k === i));
    dImg.classList.add("is-swap");
    setTimeout(() => { dImg.src = U(DRAPE[i][0], 1400); dCap.textContent = DRAPE[i][1]; dImg.onload = () => dImg.classList.remove("is-swap"); }, 300);
    clearTimeout(drapeT); drapeT = setTimeout(() => setDrape((i + 1) % DRAPE.length), 5000);
  }
  setDrape(0);

  /* ---------------- silk in motion + story ---------------- */
  const REELS = [
    [P.cream, "Marine morning", "Ivory zari, shot at the Shore Temple"],
    [P.redJewel, "Kaali Benarasi", "Red katan in temple light"],
    [P.cream2, "Marine evening", "Embroidered tissue, golden hour"],
    [P.floral, "Paithani pop", "Painted borders on the move"],
    [P.bride2, "Ponni Kanjivaram", "Rose bridal, first look"],
    [P.whiteDrape, "Garad pleats", "Pleating a Bengal garad in 30s"],
    [P.pinkGold, "Garden walk", "Pink & mango through the trees"],
    [P.blueMulti, "Murshidabad", "Block prints in the breeze"],
  ];
  const reels = $("#reels");
  const ys = [0, 30, 10, 44, 6, 36, 14, 40];
  REELS.forEach(([id, t, s], i) => {
    const r = document.createElement("button");
    r.className = "reel"; r.style.setProperty("--y", ys[i]); r.style.setProperty("--n", i);
    r.setAttribute("aria-label", `Watch ${t}`);
    r.innerHTML = `<img src="${U(id, 500)}" alt="" loading="lazy"><span class="reel__play">▶</span><span class="reel__meta"><b>${t}</b><small>${s}</small></span>`;
    r.addEventListener("click", () => openStory(i));
    reels.appendChild(r);
  });
  const story = $("#story"), bars = $("#storyBars");
  bars.innerHTML = REELS.map(() => "<span><i></i></span>").join("");
  let storyI = 0, storyT, lastFocus;
  function renderStory() {
    const [id, t, s] = REELS[storyI];
    const img = $("#storyImg");
    img.src = U(id, 900); img.style.animation = "none"; void img.offsetWidth; img.style.animation = "";
    $("#storyBg").style.backgroundImage = `url(${U(id, 300)})`;
    $("#storyTitle").textContent = t;
    $("#storyCaption").textContent = s;
    const p = REELS[(storyI - 1 + REELS.length) % REELS.length][0], n = REELS[(storyI + 1) % REELS.length][0];
    $("#storyPrevCard").style.backgroundImage = `url(${U(p, 300)})`;
    $("#storyNextCard").style.backgroundImage = `url(${U(n, 300)})`;
    $$("span", bars).forEach((b, k) => { b.className = k < storyI ? "is-done" : ""; });
    const cur = bars.children[storyI]; void cur.offsetWidth; cur.classList.add("is-on");
    clearTimeout(storyT); storyT = setTimeout(() => stepStory(1), 6000);
  }
  function stepStory(d) {
    if (storyI + d >= REELS.length) return closeStory();
    storyI = Math.max(0, storyI + d); renderStory();
  }
  function openStory(i) {
    lastFocus = document.activeElement;
    storyI = i; story.hidden = false; document.body.classList.add("is-locked");
    renderStory(); $("#storyClose").focus();
  }
  function closeStory() {
    clearTimeout(storyT); story.hidden = true; document.body.classList.remove("is-locked");
    lastFocus && lastFocus.focus();
  }
  $("#storyClose").addEventListener("click", closeStory);
  $("#storyTapL").addEventListener("click", () => stepStory(-1));
  $("#storyTapR").addEventListener("click", () => stepStory(1));
  $("#storyPrevCard").addEventListener("click", () => stepStory(-1));
  $("#storyNextCard").addEventListener("click", () => stepStory(1));
  $("#storyMute").addEventListener("click", (e) => { e.currentTarget.textContent = e.currentTarget.textContent === "🔊" ? "🔇" : "🔊"; });
  $("#storyShop").addEventListener("click", () => addToBag(1, `${REELS[storyI][1]} added to your bag`));
  $("#storyBg").addEventListener("click", closeStory);
  const card = $("#storyCard");
  card.addEventListener("pointerdown", () => { story.classList.add("is-paused"); clearTimeout(storyT); });
  card.addEventListener("pointerup", () => { story.classList.remove("is-paused"); clearTimeout(storyT); storyT = setTimeout(() => stepStory(1), 3000); });
  addEventListener("keydown", (e) => {
    if (story.hidden) return;
    if (e.key === "Escape") closeStory();
    if (e.key === "ArrowRight") stepStory(1);
    if (e.key === "ArrowLeft") stepStory(-1);
  });

  /* ---------------- bridal arc ---------------- */
  const BRIDAL = [[P.bride, "Ruby Kanchi"], [P.bride2, "Rose Bridal Tissue"], [P.palace, "Palace Red Lehenga"], [P.redJewel, "Temple Red Kanchi"], [P.whiteRed, "Ivory & Ruby Garad"], [P.purple, "Royal Violet Banarasi"], [P.beach, "Coastal Gold Tissue"], [P.cream, "Cream Zari Reception"], [P.orange, "Saffron Muhurtham"]];
  const arc = $("#bridalArc");
  BRIDAL.forEach(([id, t], i) => {
    const c = document.createElement("button");
    c.className = "bcard"; c.setAttribute("aria-label", t);
    c.innerHTML = `<img src="${U(id, 500)}" alt="" loading="lazy">`;
    c.addEventListener("click", () => { if (!bDragged) setBridal(i); });
    arc.appendChild(c);
  });
  let bI = 3, bT;
  function setBridal(i) {
    bI = (i + BRIDAL.length) % BRIDAL.length;
    $$(".bcard", arc).forEach((c, k) => {
      let off = k - bI;
      if (off > BRIDAL.length / 2) off -= BRIDAL.length;
      if (off < -BRIDAL.length / 2) off += BRIDAL.length;
      c.style.setProperty("--a", off * 14);
      c.style.zIndex = 10 - Math.abs(off);
      c.classList.toggle("is-active", off === 0);
    });
    const nm = $("#bridalName");
    nm.style.opacity = 0; setTimeout(() => { nm.textContent = BRIDAL[bI][1]; nm.style.opacity = 1; }, 200);
    clearTimeout(bT); bT = setTimeout(() => setBridal(bI + 1), 3800);
  }
  let bx = null, bDragged = false;
  arc.addEventListener("pointerdown", (e) => { bx = e.clientX; bDragged = false; });
  addEventListener("pointermove", (e) => { if (bx === null) return; const dx = e.clientX - bx; if (Math.abs(dx) > 70) { setBridal(bI + (dx < 0 ? 1 : -1)); bx = e.clientX; bDragged = true; } });
  addEventListener("pointerup", () => { bx = null; setTimeout(() => (bDragged = false), 0); });
  setBridal(bI);

  /* ---------------- three silks, one weave ---------------- */
  const WEAVE = [
    { label: "Body silk", opts: [["Temple red", "#c4122f", 14200], ["Mango", "#f2a33a", 13600], ["Peacock", "#1f3a93", 14900], ["Parrot", "#3e9b3a", 13900]] },
    { label: "Border", opts: [["Antique gold", "#d4a640", 9800], ["Silver zari", "#c9ccd6", 9200], ["Copper", "#c46a3a", 8900], ["Rani pink", "#e2457a", 8600]] },
    { label: "Pallu", opts: [["Rani pink", "#e2457a", 13350], ["Violet", "#6b2a7a", 13900], ["Ivory", "#efe6d4", 12400], ["Teal", "#13857a", 12900]] },
  ];
  const wsel = [0, 0, 0];
  const wc = $("#weaveCtrl");
  WEAVE.forEach((g, gi) => {
    const box = document.createElement("div");
    box.className = "wgroup";
    box.innerHTML = `<p>${g.label}<b>${g.opts[0][0]}</b></p><div>${g.opts.map((o, oi) => `<button class="wsw" style="--c:${o[1]}" aria-label="${g.label}: ${o[0]}" aria-pressed="${oi === 0}"></button>`).join("")}</div>`;
    $$(".wsw", box).forEach((b, oi) => b.addEventListener("click", () => {
      wsel[gi] = oi;
      $$(".wsw", box).forEach((x, k) => x.setAttribute("aria-pressed", k === oi));
      $("b", box).textContent = g.opts[oi][0];
      targetCols[gi] = hex(g.opts[oi][1]);
      updatePrice();
    }));
    wc.appendChild(box);
  });
  function weaveTotal() { return WEAVE.reduce((s, g, i) => s + g.opts[wsel[i]][2], 0); }
  function updatePrice() {
    const el = $("#weavePrice");
    el.textContent = inr(weaveTotal());
    el.animate([{ transform: "translateY(-4px)", opacity: .3 }, { transform: "none", opacity: 1 }], { duration: 350, easing: "ease-out" });
  }
  $("#weaveAdd").addEventListener("click", () => {
    addToBag(1, `Woven and added to bag: ${WEAVE.map((g, i) => g.opts[wsel[i]][0]).join(" · ")} (${inr(weaveTotal())})`);
    burst = 1;
  });
  updatePrice();

  const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const cols = WEAVE.map((g) => hex(g.opts[0][1]));
  const targetCols = cols.map((c) => c.slice());
  const cv = $("#weaveCanvas"), cx = cv.getContext("2d");
  let W = 0, H = 0, dpr = 1, burst = 0, weaveVisible = false;
  function sizeCanvas() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  addEventListener("resize", sizeCanvas); sizeCanvas();
  new IntersectionObserver(([e]) => (weaveVisible = e.isIntersecting)).observe(cv);
  let mouseY = 0.5;
  cv.addEventListener("pointermove", (e) => { const r = cv.getBoundingClientRect(); mouseY = (e.clientY - r.top) / r.height; });
  function shade(c, k) { return `rgb(${c.map((v) => Math.max(0, Math.min(255, v * k))) .map(Math.round).join(",")})`; }
  function drawWeave(t) {
    requestAnimationFrame(drawWeave);
    if (!weaveVisible) return;
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) cols[i][j] += (targetCols[i][j] - cols[i][j]) * 0.08;
    burst *= 0.96;
    cx.clearRect(0, 0, W, H);
    const time = t * 0.0006, mid = H / 2, amp = H * (0.18 + 0.06 * Math.sin(time * 0.7) + burst * 0.12) * (0.8 + mouseY * 0.4);
    const k = (Math.PI * 2) / Math.max(520, W * 0.42), step = 3, base = 34 + burst * 18;
    const pts = (i, x) => {
      const ph = k * x - time * 2.2 + (i * Math.PI * 2) / 3;
      return { y: mid + amp * Math.sin(ph) * Math.sin(x / W * Math.PI), z: Math.cos(ph), tw: Math.abs(Math.cos(ph * 1.5 + time)) };
    };
    for (let x = -step; x < W + step; x += step) {
      const segs = [0, 1, 2].map((i) => ({ i, a: pts(i, x), b: pts(i, x + step) }));
      segs.sort((p, q) => p.a.z - q.a.z);
      for (const s of segs) {
        const wA = base * (0.25 + 0.75 * s.a.tw), wB = base * (0.25 + 0.75 * s.b.tw);
        const light = 0.55 + 0.5 * s.a.tw + 0.15 * s.a.z;
        cx.fillStyle = shade(cols[s.i], light);
        cx.beginPath();
        cx.moveTo(x, s.a.y - wA / 2); cx.lineTo(x + step + 0.6, s.b.y - wB / 2);
        cx.lineTo(x + step + 0.6, s.b.y + wB / 2); cx.lineTo(x, s.a.y + wA / 2);
        cx.closePath(); cx.fill();
        if (s.a.tw > 0.55 && ((x / step) | 0) % 6 < 3) { // woven zari glints
          cx.fillStyle = `rgba(255,230,160,${(s.a.tw - 0.55) * 1.2})`;
          cx.fillRect(x, s.a.y - 1, step, 2);
        }
      }
    }
  }
  requestAnimationFrame(drawWeave);

  /* ---------------- scroll effects ---------------- */
  const media = $("#drapeMedia");
  function onScroll() {
    const vh = innerHeight;
    // light text word reveal
    const r = lt.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
    const lit = Math.round(p * lw.length);
    lw.forEach((w, i) => w.classList.toggle("is-lit", i < lit));
    // drape media grows as it centres
    const m = media.getBoundingClientRect();
    const c = 1 - Math.min(1, Math.abs(m.top + m.height / 2 - vh / 2) / vh);
    media.style.setProperty("--grow", (0.84 + 0.16 * c).toFixed(3));
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const rev = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); rev.unobserve(e.target); } }), { threshold: 0.15 });
  $$(".section-head, .look__wrap, .pick__deck, .rail__head, .ward, .drape__grid, .reels, .bridal__arc, .weave__canvas, .footer__top").forEach((el) => { el.classList.add("reveal"); rev.observe(el); });

  $("#newsForm").addEventListener("submit", (e) => { e.preventDefault(); e.target.reset(); toast("You're on the list. First letter arrives with the next weave."); });
})();
