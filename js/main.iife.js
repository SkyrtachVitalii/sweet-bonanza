(() => {
  // js/lang.js
  var FALLBACK = "eng";
  var SUPPORTED = ["eng", "por", "esp", "fra", "nor", "suo", "deu"];
  var URL_LANG_OPTIONS = {
    method: "replace",
    // або "push"
    cleanDefault: true,
    // якщо lang === fallback -> прибираємо ?lang
    fallback: FALLBACK,
    // що вважається дефолтною мовою
    param: "lang"
    // ім'я query-параметра
  };
  var HTML_LANG = {
    eng: "en",
    por: "pt",
    esp: "es",
    fra: "fr",
    nor: "no",
    suo: "fi",
    deu: "de"
  };
  var TRANSLATIONS = {
    eng: {
      title: "Try your luck in Sweet Bonanza",
      "langing-title-mobile": "Try your luck in",
      "langing-title1": "Try your",
      "langing-title2": "luck in",
      "landing-name1": "Sweet",
      "landing-name2": "Bonanza",
      "landing-name-mobile": "Sweet Bonanza",
      "landing-btn": "Spin the slot",
      "landing-popup-title": "Big win",
      "landing-popup-subtitle": "you have got up to",
      "landing-popup-btn": "Claim bonus"
    },
    esp: {
      title: "Prueba tu suerte en Sweet Bonanza",
      "langing-title-mobile": "Prueba tu suerte en",
      "langing-title1": "Prueba tu",
      "langing-title2": "suerte en",
      "landing-name1": "Sweet",
      "landing-name2": "Bonanza",
      "landing-name-mobile": "Sweet Bonanza",
      "landing-btn": "Girar",
      "landing-popup-title": "Gran victoria",
      "landing-popup-subtitle": "has conseguido hasta",
      "landing-popup-btn": "Reclama el bono"
    },
    por: {
      title: "Tente a sorte em Sweet Bonanza",
      "langing-title-mobile": "Tente a sorte em",
      "langing-title1": "Tente a",
      "langing-title2": "sorte em",
      "landing-name1": "Sweet",
      "landing-name2": "Bonanza",
      "landing-name-mobile": "Sweet Bonanza",
      "landing-btn": "Gire a slot",
      "landing-popup-title": "Grande vit\xF3ria",
      "landing-popup-subtitle": "voc\xEA ganhou at\xE9",
      "landing-popup-btn": "Resgatar b\xF4nus"
    },
    suo: {
      title: "Kokeile onneasi Sweet Bonanza",
      "langing-title-mobile": "Kokeile onneasi",
      "langing-title1": "Kokeile",
      "langing-title2": "onneasi",
      "landing-name1": "Sweet",
      "landing-name2": "Bonanza",
      "landing-name-mobile": "Sweet Bonanza",
      "landing-btn": "Py\xF6rit\xE4 slottia",
      "landing-popup-title": "Iso voitto",
      "landing-popup-subtitle": "sait jopa",
      "landing-popup-btn": "Lunasta bonus"
    },
    fra: {
      title: "Essayez votre chance dans Sweet Bonanza",
      "langing-title-mobile": "Essayez votre chance dans",
      "langing-title1": "Essayez votre",
      "langing-title2": "chance dans",
      "landing-name1": "Sweet",
      "landing-name2": "Bonanza",
      "landing-name-mobile": "Sweet Bonanza",
      "landing-btn": "Tourner",
      "landing-popup-title": "Gros gain",
      "landing-popup-subtitle": "vous avez obtenu jusqu\u2019\xE0",
      "landing-popup-btn": "R\xE9clamez le bonus"
    },
    nor: {
      title: "Pr\xF8v lykken i Sweet Bonanza",
      "langing-title-mobile": "Pr\xF8v lykken i",
      "langing-title1": "Pr\xF8v lykken",
      "langing-title2": "i",
      "landing-name1": "Sweet",
      "landing-name2": "Bonanza",
      "landing-name-mobile": "Sweet Bonanza",
      "landing-btn": "Spinn slotten",
      "landing-popup-title": "Stor gevinst",
      "landing-popup-subtitle": "du har f\xE5tt opptil",
      "landing-popup-btn": "Hent bonus"
    },
    deu: {
      title: "Versuche dein Gl\xFCck in Sweet Bonanza",
      "langing-title-mobile": "Versuche dein Gl\xFCck in ",
      "langing-title1": "Versuche dein",
      "langing-title2": "Gl\xFCck in",
      "landing-name1": "Sweet",
      "landing-name2": "Bonanza",
      "landing-name-mobile": "Sweet Bonanza",
      "landing-btn": "Drehe den Slot",
      "landing-popup-title": "Gro\xDFer Gewinn",
      "landing-popup-subtitle": "du hast bis zu",
      "landing-popup-btn": "Bonus einl\xF6sen"
    }
  };
  function detectLang() {
    const urlLang = new URLSearchParams(location.search).get("lang");
    if (urlLang && SUPPORTED.includes(urlLang)) return urlLang;
    const saved = localStorage.getItem("lang");
    if (saved && SUPPORTED.includes(saved)) return saved;
    return FALLBACK;
  }
  var SETTING_LANG = false;
  async function setLang(lang) {
    if (SETTING_LANG) return;
    SETTING_LANG = true;
    try {
      const effective = SUPPORTED.includes(lang) ? lang : FALLBACK;
      const dict = TRANSLATIONS == null ? void 0 : TRANSLATIONS[effective];
      if (!dict) throw new Error("No translations embedded");
      applyTranslations(dict);
      document.documentElement.lang = HTML_LANG[effective] || "en";
      localStorage.setItem("lang", effective);
      updateLangInUrl(effective, URL_LANG_OPTIONS);
      document.querySelectorAll(".navigationWrapper .navigation").forEach((nav) => syncOneMenuUI(nav, effective));
      window.dispatchEvent(
        new CustomEvent("langchange", { detail: { lang: effective } })
      );
    } catch (e) {
      console.error(e);
      const dictFB = TRANSLATIONS == null ? void 0 : TRANSLATIONS[FALLBACK];
      if (dictFB) {
        applyTranslations(dictFB);
        document.documentElement.lang = HTML_LANG[FALLBACK] || "en";
        localStorage.setItem("lang", FALLBACK);
        updateLangInUrl(FALLBACK, URL_LANG_OPTIONS);
        window.dispatchEvent(
          new CustomEvent("langchange", { detail: { lang: FALLBACK } })
        );
      }
    } finally {
      SETTING_LANG = false;
      closeAllNavs();
    }
  }
  function initLanguageMenus() {
    document.querySelectorAll(".navigationWrapper .navigation").forEach(setupOneMenu);
  }
  function applyTranslations(dict) {
    document.querySelectorAll("[data-translate]").forEach((el) => {
      const key = el.dataset.translate;
      if (dict[key] != null) el.textContent = dict[key];
    });
    document.querySelectorAll("[data-translate-attr]").forEach((el) => {
      var _a;
      const pairs = ((_a = el.getAttribute("data-translate-attr")) == null ? void 0 : _a.split(";").map((s) => s.trim()).filter(Boolean)) || [];
      for (const pair of pairs) {
        const [attr, key] = pair.split(":");
        if (attr && key && dict[key] != null) el.setAttribute(attr, dict[key]);
      }
    });
  }
  function syncOneMenuUI(nav, lang) {
    const menu = nav.querySelector(".navigation__items");
    if (!menu) return;
    menu.querySelectorAll(".navigation__item").forEach((item) => {
      const isActive = item.getAttribute("value") === lang;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", isActive ? "true" : "false");
      item.hidden = false;
      item.setAttribute("aria-hidden", "false");
      item.tabIndex = -1;
    });
    const activeItem = [...menu.querySelectorAll(".navigation__item")].find(
      (el) => el.getAttribute("value") === lang
    ) || menu.querySelector(".navigation__item.is-active");
    if (activeItem) {
      activeItem.hidden = true;
      activeItem.setAttribute("aria-hidden", "true");
    }
    const headImg = nav.querySelector(
      ".navigation__mainBlock .navigation__itemImg"
    );
    const headText = nav.querySelector(
      ".navigation__mainBlock .navigation__itemText"
    );
    if (headImg || headText) {
      const srcImg = activeItem == null ? void 0 : activeItem.querySelector(".navigation__itemImg");
      const srcTxt = activeItem == null ? void 0 : activeItem.querySelector(".navigation__itemText");
      if (headImg && srcImg) {
        headImg.src = srcImg.src;
        headImg.alt = srcImg.alt || "";
      }
      if (headText && srcTxt) headText.textContent = srcTxt.textContent;
    }
  }
  function setupOneMenu(nav) {
    var _a, _b;
    const menu = nav.querySelector(".navigation__items");
    if (!menu) return;
    nav.setAttribute("role", "button");
    nav.tabIndex = 0;
    nav.setAttribute("aria-haspopup", "listbox");
    if (!menu.id) menu.id = "lang-menu-" + Math.random().toString(36).slice(2);
    nav.setAttribute("aria-controls", menu.id);
    nav.setAttribute("aria-expanded", "false");
    menu.setAttribute("role", "listbox");
    menu.querySelectorAll(".navigation__item").forEach((item) => {
      item.setAttribute("role", "option");
      item.tabIndex = -1;
    });
    const currentText = (_b = (_a = nav.querySelector(".navigation__mainBlock .navigation__itemText")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim();
    if (currentText)
      menu.querySelectorAll(".navigation__itemText").forEach((t) => {
        if (t.textContent.trim() === currentText) {
          const item = t.closest(".navigation__item");
          if (item) {
            item.hidden = true;
            item.setAttribute("aria-hidden", "true");
          }
        }
      });
    const isOpen = () => nav.classList.contains("is-open");
    const open = () => {
      if (!isOpen()) {
        nav.classList.add("is-open");
        nav.setAttribute("aria-expanded", "true");
      }
    };
    const close = () => {
      if (isOpen()) {
        nav.classList.remove("is-open");
        nav.setAttribute("aria-expanded", "false");
      }
    };
    const toggle = () => isOpen() ? close() : open();
    nav.addEventListener(
      "pointerup",
      (e) => {
        if (e.pointerType === "mouse") return;
        if (menu.contains(e.target)) return;
        e.preventDefault();
        e.stopPropagation();
        toggle();
      },
      { passive: false }
    );
    document.addEventListener("pointerdown", (e) => {
      if (!nav.parentElement.contains(e.target)) close();
    });
    nav.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      } else if (e.key === "Escape") {
        if (isOpen()) {
          e.preventDefault();
          close();
          nav.focus();
        }
      } else if ((e.key === "ArrowDown" || e.key === "Down") && !isOpen()) {
        open();
        focusFirstItem(menu);
      }
    });
    function handleChooseLang(e) {
      const item = e.target.closest(".navigation__item");
      if (!item) return;
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
      const a = item.closest("a");
      if (a) {
        if (e.cancelable) e.preventDefault();
        a.setAttribute("href", "#");
      }
      const code = item.getAttribute("value");
      const finish = () => requestAnimationFrame(() => {
        var _a2, _b2;
        close();
        closeAllNavs();
        nav.blur();
        (_b2 = (_a2 = document.activeElement) == null ? void 0 : _a2.blur) == null ? void 0 : _b2.call(_a2);
      });
      if (SUPPORTED.includes(code))
        Promise.resolve(setLang(code)).finally(finish);
      else {
        const newImg = item.querySelector(".navigation__itemImg");
        const newText = item.querySelector(".navigation__itemText");
        const headImg = nav.querySelector(".navigation__itemImg");
        const headTxt = nav.querySelector(".navigation__itemText");
        if (newImg && headImg) {
          headImg.src = newImg.src;
          headImg.alt = newImg.alt || "";
        }
        if (newText && headTxt) headTxt.textContent = newText.textContent;
        finish();
      }
    }
    menu.addEventListener("click", handleChooseLang);
    menu.addEventListener("touchend", handleChooseLang, { passive: false });
    menu.addEventListener("pointerup", handleChooseLang, { passive: false });
    window.addEventListener("orientationchange", close);
    window.addEventListener("resize", close);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) close();
    });
    nav.style.touchAction = "manipulation";
    menu.style.touchAction = "manipulation";
  }
  function focusFirstItem(menu) {
    const first = [
      ...menu.querySelectorAll(".navigation__item:not([hidden])")
    ][0];
    if (first) first.focus();
  }
  function closeAllNavs() {
    document.querySelectorAll(".navigation.is-open").forEach((nav) => {
      nav.classList.remove("is-open");
      nav.setAttribute("aria-expanded", "false");
      const menu = nav.querySelector(".navigation__items");
      if (menu) {
        menu.setAttribute("aria-hidden", "true");
        menu.style.pointerEvents = "none";
        menu.style.visibility = "hidden";
        menu.style.opacity = "0";
        requestAnimationFrame(() => {
          menu.removeAttribute("aria-hidden");
          menu.style.pointerEvents = "";
          menu.style.visibility = "";
          menu.style.opacity = "";
        });
      }
    });
  }
  function killAllHovers() {
    try {
      document.querySelectorAll(":hover").forEach((el) => {
        var _a;
        return (_a = el.blur) == null ? void 0 : _a.call(el);
      });
    } catch (_) {
    }
  }
  function updateLangInUrl(lang, opts = URL_LANG_OPTIONS) {
    const {
      method = "replace",
      cleanDefault = false,
      fallback = FALLBACK,
      param = "lang"
    } = opts || {};
    try {
      const url = new URL(window.location.href);
      if (cleanDefault && lang === fallback) {
        url.searchParams.delete(param);
      } else {
        url.searchParams.set(param, lang);
      }
      const next = url.pathname + (url.search || "") + (url.hash || "");
      const current = location.pathname + location.search + location.hash;
      if (next === current) return;
      if (method === "push") {
        history.pushState(null, "", next);
      } else {
        history.replaceState(null, "", next);
      }
    } catch (e) {
      const params = new URLSearchParams(location.search);
      if (cleanDefault && lang === fallback) {
        params.delete(param);
      } else {
        params.set(param, lang);
      }
      const q = params.toString();
      const next = location.pathname + (q ? `?${q}` : "") + location.hash;
      const current = location.pathname + location.search + location.hash;
      if (next === current) return;
      history.replaceState(null, "", next);
    }
  }

  // js/game.js
  function initGame() {
    const btn = document.querySelector(".mainContent__btn");
    const game = document.querySelector(".game");
    const popup = document.getElementById("popup");
    if (!btn || !game || !popup) return;
    const VISIBLE_ROWS = 5;
    const COLUMNS = 6;
    const GAP_MS = 50;
    const DROP_MS = 3e3;
    const maxDiag = COLUMNS - 1 + (VISIBLE_ROWS - 1);
    const SYMBOLS = {
      1: {
        src: "./img/mainContainer/gameImg_1_1x.webp",
        src2x: "./img/mainContainer/gameImg_1_2x.webp"
      },
      2: {
        src: "./img/mainContainer/gameImg_2_1x.webp",
        src2x: "./img/mainContainer/gameImg_2_2x.webp"
      },
      3: {
        src: "./img/mainContainer/gameImg_3_1x.webp",
        src2x: "./img/mainContainer/gameImg_3_2x.webp"
      },
      4: {
        src: "./img/mainContainer/gameImg_4_1x.webp",
        src2x: "./img/mainContainer/gameImg_4_2x.webp"
      },
      5: {
        src: "./img/mainContainer/gameImg_5_1x.webp",
        src2x: "./img/mainContainer/gameImg_5_2x.webp"
      },
      6: {
        src: "./img/mainContainer/gameImg_6_1x.webp",
        src2x: "./img/mainContainer/gameImg_6_2x.webp"
      },
      7: {
        src: "./img/mainContainer/gameImg_7_1x.webp",
        src2x: "./img/mainContainer/gameImg_7_2x.webp"
      },
      8: {
        src: "./img/mainContainer/gameImg_8_1x.webp",
        src2x: "./img/mainContainer/gameImg_8_2x.webp"
      },
      9: {
        src: "./img/mainContainer/gameImg_9_1x.webp",
        src2x: "./img/mainContainer/gameImg_9_2x.webp"
      }
    };
    const WIN_GRID = [
      [9, 5, 4, 5, 7],
      [1, 2, 2, 5, 3],
      [4, 2, 7, 1, 5],
      [8, 2, 1, 3, 4],
      [2, 2, 4, 8, 6],
      [1, 5, 9, 7, 1]
    ];
    const getColumns = () => Array.from(game.querySelectorAll(".game__col"));
    function createImgEl(symbolId) {
      const { src, src2x } = SYMBOLS[symbolId];
      const picture = document.createElement("picture");
      const source = document.createElement("source");
      source.type = "image/webp";
      source.srcset = `${src} 1x, ${src2x} 2x`;
      const img = document.createElement("img");
      img.className = "game__colImg";
      img.src = src;
      img.alt = "";
      picture.appendChild(source);
      picture.appendChild(img);
      return { picture, img };
    }
    function dropInitialGrid() {
      game.classList.add("is-spinning");
      getColumns().forEach((col, cIdx) => {
        const imgs = Array.from(col.querySelectorAll(".game__colImg"));
        const rows = imgs.length;
        imgs.forEach((img, rTop) => {
          const fromBottom = rows - 1 - rTop;
          img.style.setProperty("--order", cIdx + fromBottom);
          img.classList.add("drop");
        });
      });
    }
    let rainStarted = false;
    function ensureOverlay(colEl) {
      let overlay = colEl.querySelector(".game__colOverlay");
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "game__colOverlay";
        colEl.appendChild(overlay);
      }
      return overlay;
    }
    function startRainOnce(winGrid) {
      if (rainStarted) return;
      rainStarted = true;
      const maxDiag2 = COLUMNS - 1 + (VISIBLE_ROWS - 1);
      let lastRainImg = null;
      const cols = Array.from(game.querySelectorAll(".game__col"));
      cols.forEach((col, cIdx) => {
        const overlay = ensureOverlay(col);
        overlay.innerHTML = "";
        const frag = document.createDocumentFragment();
        for (let rTop = 0; rTop < VISIBLE_ROWS; rTop++) {
          const symId = winGrid[cIdx][rTop];
          const { picture, img } = createImgEl(symId);
          const fromBottom = VISIBLE_ROWS - 1 - rTop;
          const order = cIdx + fromBottom;
          img.style.setProperty("--order", order);
          img.classList.add("rain-in");
          img.style.opacity = "0";
          if (order === maxDiag2) lastRainImg = img;
          frag.appendChild(picture);
        }
        overlay.appendChild(frag);
      });
      if (lastRainImg) {
        lastRainImg.addEventListener(
          "animationend",
          () => {
            triggerExplosions(winGrid).then(
              // openPopupAndLock
              setTimeout(() => {
                localStorage.setItem("game-spun", true);
                document.dispatchEvent(new CustomEvent("slot:bigwin"));
              }, 1300)
            );
          },
          { once: true }
        );
      } else {
        setTimeout(
          // openPopupAndLock,
          localStorage.setItem("game-spun", true),
          document.dispatchEvent(new CustomEvent("slot:bigwin")),
          parseFloat(getComputedStyle(game).getPropertyValue("--drop-dur")) * 1e3 || 350
        );
      }
    }
    function triggerExplosions(winGrid) {
      return new Promise((resolve) => {
        const overlays = getColumns().map(
          (col) => col.querySelector(".game__colOverlay")
        );
        const targets = [];
        for (let c = 0; c < COLUMNS; c++) {
          const overlay = overlays[c];
          if (!overlay) continue;
          const pictures = Array.from(
            overlay.querySelectorAll(":scope > picture")
          );
          for (let rTop = 0; rTop < VISIBLE_ROWS; rTop++) {
            if (winGrid[c][rTop] === 2) {
              const pic = pictures[rTop];
              if (!pic) continue;
              const img = pic.querySelector("img.game__colImg");
              if (img) targets.push(img);
            }
          }
        }
        if (!targets.length) {
          resolve();
          return;
        }
        let finished = 0;
        const total = targets.length;
        targets.forEach((img) => {
          img.classList.remove("rain-in");
          const hop = Math.floor(1 + Math.random() * 3);
          img.style.setProperty("--hop", hop + "px");
          img.addEventListener(
            "animationend",
            function onExplodeEnd(e) {
              if (e.animationName !== "explode") return;
              const boomSrc1x = "./img/mainContainer/gameImg_win_1x.webp";
              const boomSrc2x = "./img/mainContainer/gameImg_win_2x.webp";
              const picture = img.parentElement;
              const source = picture.querySelector("source");
              if (source) source.srcset = `${boomSrc1x} 1x, ${boomSrc2x} 2x`;
              img.src = boomSrc1x;
              img.classList.remove("explode");
              img.classList.add("boom");
              img.addEventListener("animationend", function onBoomEnd(ev) {
                if (ev.animationName !== "boomAppear") return;
                img.removeEventListener("animationend", onBoomEnd);
                finished++;
                if (finished === total) resolve();
              });
            },
            { once: true }
          );
          img.classList.add("explode");
        });
      });
    }
    function openPopupAndLock() {
      btn.classList.add("is-locked");
      btn.disabled = true;
      btn.setAttribute("aria-disabled", "true");
      btn.setAttribute("aria-busy", "true");
      popup.classList.add("is-open");
      popup.setAttribute("aria-hidden", "false");
      game.classList.remove("is-spinning");
    }
    function spinOnceToWin(winGrid) {
      if (btn.classList.contains("is-locked") || btn.disabled) return;
      btn.disabled = true;
      dropInitialGrid();
      setTimeout(() => startRainOnce(winGrid), GAP_MS * maxDiag);
    }
    btn.addEventListener("click", () => spinOnceToWin(WIN_GRID));
    if (localStorage.getItem("game-spun") === "true") {
      btn == null ? void 0 : btn.setAttribute("aria-disabled", "true");
      btn == null ? void 0 : btn.setAttribute("disabled", "");
      requestAnimationFrame(
        () => document.dispatchEvent(new CustomEvent("slot:bigwin"))
      );
    }
  }

  // js/popup.js
  function openPopup() {
    var _a;
    (_a = document.getElementById("popup")) == null ? void 0 : _a.classList.add("is-open");
  }
  function initPopup() {
    document.addEventListener("slot:bigwin", openPopup);
  }

  // js/payment.js
  var PAYMENT_SETS = {
    eng: [
      { src: "img/footer/interac.svg", alt: "Interac" },
      { src: "img/footer/visa.svg", alt: "Visa" },
      { src: "img/footer/applepay.svg", alt: "Apple Pay" },
      { src: "img/footer/googlepay.svg", alt: "Google Pay" },
      { src: "img/footer/tetherb.svg", alt: "Tether Bitcoin" },
      { src: "img/footer/age.svg", alt: "18+" }
    ],
    deu: [
      { src: "img/footer/klarna.svg", alt: "Klarna" },
      { src: "img/footer/visa.svg", alt: "Visa" },
      { src: "img/footer/applepay.svg", alt: "Apple Pay" },
      { src: "img/footer/googlepay.svg", alt: "Google Pay" },
      { src: "img/footer/union.svg", alt: "Union" },
      { src: "img/footer/tetherb.svg", alt: "Tether Bitcoin" },
      { src: "img/footer/neteller.svg", alt: "Neteller" },
      { src: "img/footer/scrill.svg", alt: "Scrill" },
      { src: "img/footer/rapid.svg", alt: "Rapid" },
      { src: "img/footer/vector.svg", alt: "Vector" },
      { src: "img/footer/openbanking.svg", alt: "Open banking" },
      { src: "img/footer/age.svg", alt: "18+" }
    ],
    general: [
      { src: "img/footer/visa.svg", alt: "Visa" },
      { src: "img/footer/applepay.svg", alt: "Apple Pay" },
      { src: "img/footer/googlepay.svg", alt: "Google Pay" },
      { src: "img/footer/tetherb.svg", alt: "Tether Bitcoin" },
      { src: "img/footer/age.svg", alt: "18+" }
    ]
  };
  function pickSetKey(lang) {
    if (lang === "eng") return "eng";
    if (lang === "deu") return "deu";
    return "general";
  }
  function renderFooterPayments(lang) {
    const setKey = pickSetKey(lang);
    const items = PAYMENT_SETS[setKey] || PAYMENT_SETS.general;
    const container = document.querySelector(".footer .footer__items");
    if (!container) return;
    container.innerHTML = "";
    for (const p of items) {
      const wrap = document.createElement("div");
      wrap.className = "footer__item";
      const img = document.createElement("img");
      img.decoding = "async";
      img.src = p.src;
      img.alt = p.alt || "";
      wrap.appendChild(img);
      container.appendChild(wrap);
    }
  }
  function initPaymentsOnce() {
    renderFooterPayments(detectLang());
  }

  // js/main.js
  function waitNextFrame() {
    return new Promise((r) => requestAnimationFrame(() => r()));
  }
  async function whenAllStylesLoaded() {
    const links = [...document.querySelectorAll('link[rel="stylesheet"]')];
    await Promise.all(
      links.map(
        (link) => new Promise((res) => {
          link.addEventListener("load", res, { once: true });
          link.addEventListener("error", res, { once: true });
          setTimeout(res, 0);
        })
      )
    );
    const sameOriginSheets = [...document.styleSheets].filter((s) => {
      try {
        const href = s.href || "";
        return !href || href.startsWith(location.origin) || href.startsWith("file:");
      } catch (e) {
        return false;
      }
    });
    const pollOnce = () => {
      for (const sheet of sameOriginSheets) {
        try {
          const _ = sheet.cssRules;
        } catch (e) {
        }
      }
    };
    for (let i = 0; i < 3; i++) {
      pollOnce();
      await new Promise((r) => requestAnimationFrame(r));
    }
  }
  function waitForFonts() {
    return "fonts" in document ? document.fonts.ready : Promise.resolve();
  }
  function waitImagesIn(el) {
    if (!el) return Promise.resolve();
    const imgs = [...el.querySelectorAll("img")];
    const promises = imgs.map(
      (img) => img.complete ? Promise.resolve() : new Promise((res) => {
        const cb = () => res();
        img.addEventListener("load", cb, { once: true });
        img.addEventListener("error", cb, { once: true });
      })
    );
    return Promise.all(promises);
  }
  async function bootstrap() {
    await whenAllStylesLoaded();
    await waitForFonts();
    initLanguageMenus();
    setLang(detectLang());
    initPopup();
    const gameRoot = document.querySelector(".game");
    await waitImagesIn(gameRoot);
    await waitCssBackgrounds([".game", ".popup__dialog"]);
    await waitNextFrame();
    initGame();
    document.documentElement.classList.remove("app-preparing");
    killAllHovers();
  }
  bootstrap().catch(console.error);
  function parseCssUrls(value) {
    const urls = [];
    value.replace(/url\(([^)]+)\)/g, (_, raw) => {
      const u = raw.trim().replace(/^['"]|['"]$/g, "");
      if (u && u !== "about:blank") urls.push(u);
    });
    return urls;
  }
  function waitCssBackgrounds(selectors) {
    const urls = /* @__PURE__ */ new Set();
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach((el) => {
        const bg = getComputedStyle(el).getPropertyValue("background-image");
        parseCssUrls(bg).forEach((u) => urls.add(u));
      });
    }
    if (urls.size === 0) return Promise.resolve();
    const tasks = [...urls].map(
      (src) => new Promise((res) => {
        const img = new Image();
        img.onload = img.onerror = () => res();
        img.src = src;
      })
    );
    return Promise.all(tasks);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPaymentsOnce, {
      once: true
    });
  } else {
    initPaymentsOnce();
  }
  window.addEventListener("langchange", (e) => {
    var _a;
    const lang = ((_a = e == null ? void 0 : e.detail) == null ? void 0 : _a.lang) || detectLang();
    renderFooterPayments(lang);
  });
  (function() {
    var url = new URL(window.location.href);
    if (url.searchParams.has("redirectUrl")) {
      var redirectUrl = new URL(url.searchParams.get("redirectUrl"));
      if (redirectUrl.href.match(/\//g).length === 4 && redirectUrl.searchParams.get("l")) {
        localStorage.setItem("redirectUrl", redirectUrl.href);
      }
    }
    var params = [
      "l",
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "param1",
      "param2"
    ];
    var linkParams = ["affid", "cpaid"];
    params.forEach(function(param) {
      if (url.searchParams.has(param))
        localStorage.setItem(param, url.searchParams.get(param));
    });
    linkParams.forEach(function(linkParam) {
      if (url.searchParams.has(linkParam))
        localStorage.setItem(linkParam, url.searchParams.get(linkParam));
    });
  })();
  window.addEventListener("click", function(e) {
    var t, o, cpaid, r = e.target.closest("a");
    r && "https://tds.claps.com" === r.getAttribute("href") && (e.preventDefault(), o = localStorage.getItem("affid"), cpaid = localStorage.getItem("cpaid"), localStorage.getItem("redirectUrl") ? t = new URL(localStorage.getItem("redirectUrl")) : (t = new URL(r.href), o && cpaid && (t.pathname = "/" + o + "/" + cpaid)), (function() {
      var n = new URL(window.location.href);
      var a = [
        "l",
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_term",
        "utm_content",
        "param1",
        "param2",
        "affid",
        "cpaid"
      ];
      a.forEach(function(e2) {
        n.searchParams.has(e2) && t.searchParams.set(e2, localStorage.getItem(e2));
      });
    })(), document.location.href = t);
  });
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibGFuZy5qcyIsICJnYW1lLmpzIiwgInBvcHVwLmpzIiwgInBheW1lbnQuanMiLCAibWFpbi5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgRkFMTEJBQ0sgPSBcImVuZ1wiO1xuY29uc3QgU1VQUE9SVEVEID0gW1wiZW5nXCIsIFwicG9yXCIsIFwiZXNwXCIsIFwiZnJhXCIsIFwibm9yXCIsIFwic3VvXCIsIFwiZGV1XCJdO1xuY29uc3QgVVJMX0xBTkdfT1BUSU9OUyA9IHtcbiAgbWV0aG9kOiBcInJlcGxhY2VcIiwgICAvLyBcdTA0MzBcdTA0MzFcdTA0M0UgXCJwdXNoXCJcbiAgY2xlYW5EZWZhdWx0OiB0cnVlLCAgLy8gXHUwNDRGXHUwNDNBXHUwNDQ5XHUwNDNFIGxhbmcgPT09IGZhbGxiYWNrIC0+IFx1MDQzRlx1MDQ0MFx1MDQzOFx1MDQzMVx1MDQzOFx1MDQ0MFx1MDQzMFx1MDQ1NFx1MDQzQ1x1MDQzRSA/bGFuZ1xuICBmYWxsYmFjazogRkFMTEJBQ0ssICAvLyBcdTA0NDlcdTA0M0UgXHUwNDMyXHUwNDMyXHUwNDMwXHUwNDM2XHUwNDMwXHUwNDU0XHUwNDQyXHUwNDRDXHUwNDQxXHUwNDRGIFx1MDQzNFx1MDQzNVx1MDQ0NFx1MDQzRVx1MDQzQlx1MDQ0Mlx1MDQzRFx1MDQzRVx1MDQ0RSBcdTA0M0NcdTA0M0VcdTA0MzJcdTA0M0VcdTA0NEVcbiAgcGFyYW06IFwibGFuZ1wiLCAgICAgICAvLyBcdTA0NTZcdTA0M0MnXHUwNDRGIHF1ZXJ5LVx1MDQzRlx1MDQzMFx1MDQ0MFx1MDQzMFx1MDQzQ1x1MDQzNVx1MDQ0Mlx1MDQ0MFx1MDQzMFxufTtcblxuY29uc3QgSFRNTF9MQU5HID0ge1xuICBlbmc6IFwiZW5cIixcbiAgcG9yOiBcInB0XCIsXG4gIGVzcDogXCJlc1wiLFxuICBmcmE6IFwiZnJcIixcbiAgbm9yOiBcIm5vXCIsXG4gIHN1bzogXCJmaVwiLFxuICBkZXU6IFwiZGVcIixcbn07XG5cbmNvbnN0IFRSQU5TTEFUSU9OUyA9IHtcbiAgZW5nOiB7XG4gICAgdGl0bGU6IFwiVHJ5IHlvdXIgbHVjayBpbiBTd2VldCBCb25hbnphXCIsXG4gICAgXCJsYW5naW5nLXRpdGxlLW1vYmlsZVwiOiBcIlRyeSB5b3VyIGx1Y2sgaW5cIixcbiAgICBcImxhbmdpbmctdGl0bGUxXCI6IFwiVHJ5IHlvdXJcIixcbiAgICBcImxhbmdpbmctdGl0bGUyXCI6IFwibHVjayBpblwiLFxuICAgIFwibGFuZGluZy1uYW1lMVwiOiBcIlN3ZWV0XCIsXG4gICAgXCJsYW5kaW5nLW5hbWUyXCI6IFwiQm9uYW56YVwiLFxuICAgIFwibGFuZGluZy1uYW1lLW1vYmlsZVwiOiBcIlN3ZWV0IEJvbmFuemFcIixcbiAgICBcImxhbmRpbmctYnRuXCI6IFwiU3BpbiB0aGUgc2xvdFwiLFxuICAgIFwibGFuZGluZy1wb3B1cC10aXRsZVwiOiBcIkJpZyB3aW5cIixcbiAgICBcImxhbmRpbmctcG9wdXAtc3VidGl0bGVcIjogXCJ5b3UgaGF2ZSBnb3QgdXAgdG9cIixcbiAgICBcImxhbmRpbmctcG9wdXAtYnRuXCI6IFwiQ2xhaW0gYm9udXNcIixcbiAgfSxcbiAgZXNwOiB7XG4gICAgdGl0bGU6IFwiUHJ1ZWJhIHR1IHN1ZXJ0ZSBlbiBTd2VldCBCb25hbnphXCIsXG4gICAgXCJsYW5naW5nLXRpdGxlLW1vYmlsZVwiOiBcIlBydWViYSB0dSBzdWVydGUgZW5cIixcbiAgICBcImxhbmdpbmctdGl0bGUxXCI6IFwiUHJ1ZWJhIHR1XCIsXG4gICAgXCJsYW5naW5nLXRpdGxlMlwiOiBcInN1ZXJ0ZSBlblwiLFxuICAgIFwibGFuZGluZy1uYW1lMVwiOiBcIlN3ZWV0XCIsXG4gICAgXCJsYW5kaW5nLW5hbWUyXCI6IFwiQm9uYW56YVwiLFxuICAgIFwibGFuZGluZy1uYW1lLW1vYmlsZVwiOiBcIlN3ZWV0IEJvbmFuemFcIixcbiAgICBcImxhbmRpbmctYnRuXCI6IFwiR2lyYXJcIixcbiAgICBcImxhbmRpbmctcG9wdXAtdGl0bGVcIjogXCJHcmFuIHZpY3RvcmlhXCIsXG4gICAgXCJsYW5kaW5nLXBvcHVwLXN1YnRpdGxlXCI6IFwiaGFzIGNvbnNlZ3VpZG8gaGFzdGFcIixcbiAgICBcImxhbmRpbmctcG9wdXAtYnRuXCI6IFwiUmVjbGFtYSBlbCBib25vXCIsXG4gIH0sXG4gIHBvcjoge1xuICAgIHRpdGxlOiBcIlRlbnRlIGEgc29ydGUgZW0gU3dlZXQgQm9uYW56YVwiLFxuICAgIFwibGFuZ2luZy10aXRsZS1tb2JpbGVcIjogXCJUZW50ZSBhIHNvcnRlIGVtXCIsXG4gICAgXCJsYW5naW5nLXRpdGxlMVwiOiBcIlRlbnRlIGFcIixcbiAgICBcImxhbmdpbmctdGl0bGUyXCI6IFwic29ydGUgZW1cIixcbiAgICBcImxhbmRpbmctbmFtZTFcIjogXCJTd2VldFwiLFxuICAgIFwibGFuZGluZy1uYW1lMlwiOiBcIkJvbmFuemFcIixcbiAgICBcImxhbmRpbmctbmFtZS1tb2JpbGVcIjogXCJTd2VldCBCb25hbnphXCIsXG4gICAgXCJsYW5kaW5nLWJ0blwiOiBcIkdpcmUgYSBzbG90XCIsXG4gICAgXCJsYW5kaW5nLXBvcHVwLXRpdGxlXCI6IFwiR3JhbmRlIHZpdFx1MDBGM3JpYVwiLFxuICAgIFwibGFuZGluZy1wb3B1cC1zdWJ0aXRsZVwiOiBcInZvY1x1MDBFQSBnYW5ob3UgYXRcdTAwRTlcIixcbiAgICBcImxhbmRpbmctcG9wdXAtYnRuXCI6IFwiUmVzZ2F0YXIgYlx1MDBGNG51c1wiLFxuICB9LFxuICBzdW86IHtcbiAgICB0aXRsZTogXCJLb2tlaWxlIG9ubmVhc2kgU3dlZXQgQm9uYW56YVwiLFxuICAgIFwibGFuZ2luZy10aXRsZS1tb2JpbGVcIjogXCJLb2tlaWxlIG9ubmVhc2lcIixcbiAgICBcImxhbmdpbmctdGl0bGUxXCI6IFwiS29rZWlsZVwiLFxuICAgIFwibGFuZ2luZy10aXRsZTJcIjogXCJvbm5lYXNpXCIsXG4gICAgXCJsYW5kaW5nLW5hbWUxXCI6IFwiU3dlZXRcIixcbiAgICBcImxhbmRpbmctbmFtZTJcIjogXCJCb25hbnphXCIsXG4gICAgXCJsYW5kaW5nLW5hbWUtbW9iaWxlXCI6IFwiU3dlZXQgQm9uYW56YVwiLFxuICAgIFwibGFuZGluZy1idG5cIjogXCJQeVx1MDBGNnJpdFx1MDBFNCBzbG90dGlhXCIsXG4gICAgXCJsYW5kaW5nLXBvcHVwLXRpdGxlXCI6IFwiSXNvIHZvaXR0b1wiLFxuICAgIFwibGFuZGluZy1wb3B1cC1zdWJ0aXRsZVwiOiBcInNhaXQgam9wYVwiLFxuICAgIFwibGFuZGluZy1wb3B1cC1idG5cIjogXCJMdW5hc3RhIGJvbnVzXCIsXG4gIH0sXG4gIGZyYToge1xuICAgIHRpdGxlOiBcIkVzc2F5ZXogdm90cmUgY2hhbmNlIGRhbnMgU3dlZXQgQm9uYW56YVwiLFxuICAgIFwibGFuZ2luZy10aXRsZS1tb2JpbGVcIjogXCJFc3NheWV6IHZvdHJlIGNoYW5jZSBkYW5zXCIsXG4gICAgXCJsYW5naW5nLXRpdGxlMVwiOiBcIkVzc2F5ZXogdm90cmVcIixcbiAgICBcImxhbmdpbmctdGl0bGUyXCI6IFwiY2hhbmNlIGRhbnNcIixcbiAgICBcImxhbmRpbmctbmFtZTFcIjogXCJTd2VldFwiLFxuICAgIFwibGFuZGluZy1uYW1lMlwiOiBcIkJvbmFuemFcIixcbiAgICBcImxhbmRpbmctbmFtZS1tb2JpbGVcIjogXCJTd2VldCBCb25hbnphXCIsXG4gICAgXCJsYW5kaW5nLWJ0blwiOiBcIlRvdXJuZXJcIixcbiAgICBcImxhbmRpbmctcG9wdXAtdGl0bGVcIjogXCJHcm9zIGdhaW5cIixcbiAgICBcImxhbmRpbmctcG9wdXAtc3VidGl0bGVcIjogXCJ2b3VzIGF2ZXogb2J0ZW51IGp1c3F1XHUyMDE5XHUwMEUwXCIsXG4gICAgXCJsYW5kaW5nLXBvcHVwLWJ0blwiOiBcIlJcdTAwRTljbGFtZXogbGUgYm9udXNcIixcbiAgfSxcbiAgbm9yOiB7XG4gICAgdGl0bGU6IFwiUHJcdTAwRjh2IGx5a2tlbiBpIFN3ZWV0IEJvbmFuemFcIixcbiAgICBcImxhbmdpbmctdGl0bGUtbW9iaWxlXCI6IFwiUHJcdTAwRjh2IGx5a2tlbiBpXCIsXG4gICAgXCJsYW5naW5nLXRpdGxlMVwiOiBcIlByXHUwMEY4diBseWtrZW5cIixcbiAgICBcImxhbmdpbmctdGl0bGUyXCI6IFwiaVwiLFxuICAgIFwibGFuZGluZy1uYW1lMVwiOiBcIlN3ZWV0XCIsXG4gICAgXCJsYW5kaW5nLW5hbWUyXCI6IFwiQm9uYW56YVwiLFxuICAgIFwibGFuZGluZy1uYW1lLW1vYmlsZVwiOiBcIlN3ZWV0IEJvbmFuemFcIixcbiAgICBcImxhbmRpbmctYnRuXCI6IFwiU3Bpbm4gc2xvdHRlblwiLFxuICAgIFwibGFuZGluZy1wb3B1cC10aXRsZVwiOiBcIlN0b3IgZ2V2aW5zdFwiLFxuICAgIFwibGFuZGluZy1wb3B1cC1zdWJ0aXRsZVwiOiBcImR1IGhhciBmXHUwMEU1dHQgb3BwdGlsXCIsXG4gICAgXCJsYW5kaW5nLXBvcHVwLWJ0blwiOiBcIkhlbnQgYm9udXNcIixcbiAgfSxcbiAgZGV1OiB7XG4gICAgdGl0bGU6IFwiVmVyc3VjaGUgZGVpbiBHbFx1MDBGQ2NrIGluIFN3ZWV0IEJvbmFuemFcIixcbiAgICBcImxhbmdpbmctdGl0bGUtbW9iaWxlXCI6IFwiVmVyc3VjaGUgZGVpbiBHbFx1MDBGQ2NrIGluIFwiLFxuICAgIFwibGFuZ2luZy10aXRsZTFcIjogXCJWZXJzdWNoZSBkZWluXCIsXG4gICAgXCJsYW5naW5nLXRpdGxlMlwiOiBcIkdsXHUwMEZDY2sgaW5cIixcbiAgICBcImxhbmRpbmctbmFtZTFcIjogXCJTd2VldFwiLFxuICAgIFwibGFuZGluZy1uYW1lMlwiOiBcIkJvbmFuemFcIixcbiAgICBcImxhbmRpbmctbmFtZS1tb2JpbGVcIjogXCJTd2VldCBCb25hbnphXCIsXG4gICAgXCJsYW5kaW5nLWJ0blwiOiBcIkRyZWhlIGRlbiBTbG90XCIsXG4gICAgXCJsYW5kaW5nLXBvcHVwLXRpdGxlXCI6IFwiR3JvXHUwMERGZXIgR2V3aW5uXCIsXG4gICAgXCJsYW5kaW5nLXBvcHVwLXN1YnRpdGxlXCI6IFwiZHUgaGFzdCBiaXMgenVcIixcbiAgICBcImxhbmRpbmctcG9wdXAtYnRuXCI6IFwiQm9udXMgZWlubFx1MDBGNnNlblwiLFxuICB9LFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGRldGVjdExhbmcoKSB7XG4gIGNvbnN0IHVybExhbmcgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKGxvY2F0aW9uLnNlYXJjaCkuZ2V0KFwibGFuZ1wiKTtcbiAgaWYgKHVybExhbmcgJiYgU1VQUE9SVEVELmluY2x1ZGVzKHVybExhbmcpKSByZXR1cm4gdXJsTGFuZztcbiAgY29uc3Qgc2F2ZWQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImxhbmdcIik7XG4gIGlmIChzYXZlZCAmJiBTVVBQT1JURUQuaW5jbHVkZXMoc2F2ZWQpKSByZXR1cm4gc2F2ZWQ7XG4gIHJldHVybiBGQUxMQkFDSztcbn1cblxubGV0IFNFVFRJTkdfTEFORyA9IGZhbHNlO1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldExhbmcobGFuZykge1xuICBpZiAoU0VUVElOR19MQU5HKSByZXR1cm47XG4gIFNFVFRJTkdfTEFORyA9IHRydWU7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBlZmZlY3RpdmUgPSBTVVBQT1JURUQuaW5jbHVkZXMobGFuZykgPyBsYW5nIDogRkFMTEJBQ0s7XG5cbiAgICBjb25zdCBkaWN0ID0gVFJBTlNMQVRJT05TPy5bZWZmZWN0aXZlXTtcbiAgICBpZiAoIWRpY3QpIHRocm93IG5ldyBFcnJvcihcIk5vIHRyYW5zbGF0aW9ucyBlbWJlZGRlZFwiKTtcbiAgICBhcHBseVRyYW5zbGF0aW9ucyhkaWN0KTtcblxuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5sYW5nID0gSFRNTF9MQU5HW2VmZmVjdGl2ZV0gfHwgXCJlblwiO1xuXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJsYW5nXCIsIGVmZmVjdGl2ZSk7XG5cbiAgICB1cGRhdGVMYW5nSW5VcmwoZWZmZWN0aXZlLCBVUkxfTEFOR19PUFRJT05TKTtcblxuICAgIGRvY3VtZW50XG4gICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5uYXZpZ2F0aW9uV3JhcHBlciAubmF2aWdhdGlvblwiKVxuICAgICAgLmZvckVhY2goKG5hdikgPT4gc3luY09uZU1lbnVVSShuYXYsIGVmZmVjdGl2ZSkpO1xuXG4gICAgd2luZG93LmRpc3BhdGNoRXZlbnQoXG4gICAgICBuZXcgQ3VzdG9tRXZlbnQoXCJsYW5nY2hhbmdlXCIsIHsgZGV0YWlsOiB7IGxhbmc6IGVmZmVjdGl2ZSB9IH0pXG4gICAgKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgY29uc3QgZGljdEZCID0gVFJBTlNMQVRJT05TPy5bRkFMTEJBQ0tdO1xuICAgIGlmIChkaWN0RkIpIHtcbiAgICAgIGFwcGx5VHJhbnNsYXRpb25zKGRpY3RGQik7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQubGFuZyA9IEhUTUxfTEFOR1tGQUxMQkFDS10gfHwgXCJlblwiO1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJsYW5nXCIsIEZBTExCQUNLKTtcbiAgICAgIHVwZGF0ZUxhbmdJblVybChGQUxMQkFDSywgVVJMX0xBTkdfT1BUSU9OUyk7XG5cbiAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KFxuICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoXCJsYW5nY2hhbmdlXCIsIHsgZGV0YWlsOiB7IGxhbmc6IEZBTExCQUNLIH0gfSlcbiAgICAgICk7XG4gICAgfVxuICB9IGZpbmFsbHkge1xuICAgIFNFVFRJTkdfTEFORyA9IGZhbHNlO1xuICAgIGNsb3NlQWxsTmF2cygpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0TGFuZ3VhZ2VNZW51cygpIHtcbiAgZG9jdW1lbnRcbiAgICAucXVlcnlTZWxlY3RvckFsbChcIi5uYXZpZ2F0aW9uV3JhcHBlciAubmF2aWdhdGlvblwiKVxuICAgIC5mb3JFYWNoKHNldHVwT25lTWVudSk7XG59XG5cbmZ1bmN0aW9uIGFwcGx5VHJhbnNsYXRpb25zKGRpY3QpIHtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLXRyYW5zbGF0ZV1cIikuZm9yRWFjaCgoZWwpID0+IHtcbiAgICBjb25zdCBrZXkgPSBlbC5kYXRhc2V0LnRyYW5zbGF0ZTtcbiAgICBpZiAoZGljdFtrZXldICE9IG51bGwpIGVsLnRleHRDb250ZW50ID0gZGljdFtrZXldO1xuICB9KTtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLXRyYW5zbGF0ZS1hdHRyXVwiKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgIGNvbnN0IHBhaXJzID1cbiAgICAgIGVsXG4gICAgICAgIC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRyYW5zbGF0ZS1hdHRyXCIpXG4gICAgICAgID8uc3BsaXQoXCI7XCIpXG4gICAgICAgIC5tYXAoKHMpID0+IHMudHJpbSgpKVxuICAgICAgICAuZmlsdGVyKEJvb2xlYW4pIHx8IFtdO1xuICAgIGZvciAoY29uc3QgcGFpciBvZiBwYWlycykge1xuICAgICAgY29uc3QgW2F0dHIsIGtleV0gPSBwYWlyLnNwbGl0KFwiOlwiKTtcbiAgICAgIGlmIChhdHRyICYmIGtleSAmJiBkaWN0W2tleV0gIT0gbnVsbCkgZWwuc2V0QXR0cmlidXRlKGF0dHIsIGRpY3Rba2V5XSk7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gc3luY09uZU1lbnVVSShuYXYsIGxhbmcpIHtcbiAgY29uc3QgbWVudSA9IG5hdi5xdWVyeVNlbGVjdG9yKFwiLm5hdmlnYXRpb25fX2l0ZW1zXCIpO1xuICBpZiAoIW1lbnUpIHJldHVybjtcbiAgbWVudS5xdWVyeVNlbGVjdG9yQWxsKFwiLm5hdmlnYXRpb25fX2l0ZW1cIikuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgIGNvbnN0IGlzQWN0aXZlID0gaXRlbS5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKSA9PT0gbGFuZztcbiAgICBpdGVtLmNsYXNzTGlzdC50b2dnbGUoXCJpcy1hY3RpdmVcIiwgaXNBY3RpdmUpO1xuICAgIGl0ZW0uc2V0QXR0cmlidXRlKFwiYXJpYS1zZWxlY3RlZFwiLCBpc0FjdGl2ZSA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiKTtcbiAgICBpdGVtLmhpZGRlbiA9IGZhbHNlO1xuICAgIGl0ZW0uc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJmYWxzZVwiKTtcbiAgICBpdGVtLnRhYkluZGV4ID0gLTE7XG4gIH0pO1xuICBjb25zdCBhY3RpdmVJdGVtID1cbiAgICBbLi4ubWVudS5xdWVyeVNlbGVjdG9yQWxsKFwiLm5hdmlnYXRpb25fX2l0ZW1cIildLmZpbmQoXG4gICAgICAoZWwpID0+IGVsLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpID09PSBsYW5nXG4gICAgKSB8fCBtZW51LnF1ZXJ5U2VsZWN0b3IoXCIubmF2aWdhdGlvbl9faXRlbS5pcy1hY3RpdmVcIik7XG4gIGlmIChhY3RpdmVJdGVtKSB7XG4gICAgYWN0aXZlSXRlbS5oaWRkZW4gPSB0cnVlO1xuICAgIGFjdGl2ZUl0ZW0uc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJ0cnVlXCIpO1xuICB9XG4gIGNvbnN0IGhlYWRJbWcgPSBuYXYucXVlcnlTZWxlY3RvcihcbiAgICBcIi5uYXZpZ2F0aW9uX19tYWluQmxvY2sgLm5hdmlnYXRpb25fX2l0ZW1JbWdcIlxuICApO1xuICBjb25zdCBoZWFkVGV4dCA9IG5hdi5xdWVyeVNlbGVjdG9yKFxuICAgIFwiLm5hdmlnYXRpb25fX21haW5CbG9jayAubmF2aWdhdGlvbl9faXRlbVRleHRcIlxuICApO1xuICBpZiAoaGVhZEltZyB8fCBoZWFkVGV4dCkge1xuICAgIGNvbnN0IHNyY0ltZyA9IGFjdGl2ZUl0ZW0/LnF1ZXJ5U2VsZWN0b3IoXCIubmF2aWdhdGlvbl9faXRlbUltZ1wiKTtcbiAgICBjb25zdCBzcmNUeHQgPSBhY3RpdmVJdGVtPy5xdWVyeVNlbGVjdG9yKFwiLm5hdmlnYXRpb25fX2l0ZW1UZXh0XCIpO1xuICAgIGlmIChoZWFkSW1nICYmIHNyY0ltZykge1xuICAgICAgaGVhZEltZy5zcmMgPSBzcmNJbWcuc3JjO1xuICAgICAgaGVhZEltZy5hbHQgPSBzcmNJbWcuYWx0IHx8IFwiXCI7XG4gICAgfVxuICAgIGlmIChoZWFkVGV4dCAmJiBzcmNUeHQpIGhlYWRUZXh0LnRleHRDb250ZW50ID0gc3JjVHh0LnRleHRDb250ZW50O1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldHVwT25lTWVudShuYXYpIHtcbiAgY29uc3QgbWVudSA9IG5hdi5xdWVyeVNlbGVjdG9yKFwiLm5hdmlnYXRpb25fX2l0ZW1zXCIpO1xuICBpZiAoIW1lbnUpIHJldHVybjtcbiAgbmF2LnNldEF0dHJpYnV0ZShcInJvbGVcIiwgXCJidXR0b25cIik7XG4gIG5hdi50YWJJbmRleCA9IDA7XG4gIG5hdi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhhc3BvcHVwXCIsIFwibGlzdGJveFwiKTtcbiAgaWYgKCFtZW51LmlkKSBtZW51LmlkID0gXCJsYW5nLW1lbnUtXCIgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGljZSgyKTtcbiAgbmF2LnNldEF0dHJpYnV0ZShcImFyaWEtY29udHJvbHNcIiwgbWVudS5pZCk7XG4gIG5hdi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIFwiZmFsc2VcIik7XG4gIG1lbnUuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcImxpc3Rib3hcIik7XG4gIG1lbnUucXVlcnlTZWxlY3RvckFsbChcIi5uYXZpZ2F0aW9uX19pdGVtXCIpLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICBpdGVtLnNldEF0dHJpYnV0ZShcInJvbGVcIiwgXCJvcHRpb25cIik7XG4gICAgaXRlbS50YWJJbmRleCA9IC0xO1xuICB9KTtcblxuICBjb25zdCBjdXJyZW50VGV4dCA9IG5hdlxuICAgIC5xdWVyeVNlbGVjdG9yKFwiLm5hdmlnYXRpb25fX21haW5CbG9jayAubmF2aWdhdGlvbl9faXRlbVRleHRcIilcbiAgICA/LnRleHRDb250ZW50Py50cmltKCk7XG4gIGlmIChjdXJyZW50VGV4dClcbiAgICBtZW51LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmF2aWdhdGlvbl9faXRlbVRleHRcIikuZm9yRWFjaCgodCkgPT4ge1xuICAgICAgaWYgKHQudGV4dENvbnRlbnQudHJpbSgpID09PSBjdXJyZW50VGV4dCkge1xuICAgICAgICBjb25zdCBpdGVtID0gdC5jbG9zZXN0KFwiLm5hdmlnYXRpb25fX2l0ZW1cIik7XG4gICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgaXRlbS5oaWRkZW4gPSB0cnVlO1xuICAgICAgICAgIGl0ZW0uc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJ0cnVlXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgY29uc3QgaXNPcGVuID0gKCkgPT4gbmF2LmNsYXNzTGlzdC5jb250YWlucyhcImlzLW9wZW5cIik7XG4gIGNvbnN0IG9wZW4gPSAoKSA9PiB7XG4gICAgaWYgKCFpc09wZW4oKSkge1xuICAgICAgbmF2LmNsYXNzTGlzdC5hZGQoXCJpcy1vcGVuXCIpO1xuICAgICAgbmF2LnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgXCJ0cnVlXCIpO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgY2xvc2UgPSAoKSA9PiB7XG4gICAgaWYgKGlzT3BlbigpKSB7XG4gICAgICBuYXYuY2xhc3NMaXN0LnJlbW92ZShcImlzLW9wZW5cIik7XG4gICAgICBuYXYuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCBcImZhbHNlXCIpO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgdG9nZ2xlID0gKCkgPT4gKGlzT3BlbigpID8gY2xvc2UoKSA6IG9wZW4oKSk7XG5cbiAgbmF2LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgXCJwb2ludGVydXBcIixcbiAgICAoZSkgPT4ge1xuICAgICAgaWYgKGUucG9pbnRlclR5cGUgPT09IFwibW91c2VcIikgcmV0dXJuO1xuICAgICAgaWYgKG1lbnUuY29udGFpbnMoZS50YXJnZXQpKSByZXR1cm47XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgdG9nZ2xlKCk7XG4gICAgfSxcbiAgICB7IHBhc3NpdmU6IGZhbHNlIH1cbiAgKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJkb3duXCIsIChlKSA9PiB7XG4gICAgaWYgKCFuYXYucGFyZW50RWxlbWVudC5jb250YWlucyhlLnRhcmdldCkpIGNsb3NlKCk7XG4gIH0pO1xuICBuYXYuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGUpID0+IHtcbiAgICBpZiAoZS5rZXkgPT09IFwiRW50ZXJcIiB8fCBlLmtleSA9PT0gXCIgXCIpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRvZ2dsZSgpO1xuICAgIH0gZWxzZSBpZiAoZS5rZXkgPT09IFwiRXNjYXBlXCIpIHtcbiAgICAgIGlmIChpc09wZW4oKSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNsb3NlKCk7XG4gICAgICAgIG5hdi5mb2N1cygpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoKGUua2V5ID09PSBcIkFycm93RG93blwiIHx8IGUua2V5ID09PSBcIkRvd25cIikgJiYgIWlzT3BlbigpKSB7XG4gICAgICBvcGVuKCk7XG4gICAgICBmb2N1c0ZpcnN0SXRlbShtZW51KTtcbiAgICB9XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUNob29zZUxhbmcoZSkge1xuICAgIGNvbnN0IGl0ZW0gPSBlLnRhcmdldC5jbG9zZXN0KFwiLm5hdmlnYXRpb25fX2l0ZW1cIik7XG4gICAgaWYgKCFpdGVtKSByZXR1cm47XG4gICAgaWYgKGUuY2FuY2VsYWJsZSkgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgY29uc3QgYSA9IGl0ZW0uY2xvc2VzdChcImFcIik7XG4gICAgaWYgKGEpIHtcbiAgICAgIGlmIChlLmNhbmNlbGFibGUpIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGEuc2V0QXR0cmlidXRlKFwiaHJlZlwiLCBcIiNcIik7XG4gICAgfVxuICAgIGNvbnN0IGNvZGUgPSBpdGVtLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpO1xuICAgIGNvbnN0IGZpbmlzaCA9ICgpID0+XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICBjbG9zZSgpO1xuICAgICAgICBjbG9zZUFsbE5hdnMoKTtcbiAgICAgICAgbmF2LmJsdXIoKTtcbiAgICAgICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudD8uYmx1cj8uKCk7XG4gICAgICB9KTtcbiAgICBpZiAoU1VQUE9SVEVELmluY2x1ZGVzKGNvZGUpKVxuICAgICAgUHJvbWlzZS5yZXNvbHZlKHNldExhbmcoY29kZSkpLmZpbmFsbHkoZmluaXNoKTtcbiAgICBlbHNlIHtcbiAgICAgIGNvbnN0IG5ld0ltZyA9IGl0ZW0ucXVlcnlTZWxlY3RvcihcIi5uYXZpZ2F0aW9uX19pdGVtSW1nXCIpO1xuICAgICAgY29uc3QgbmV3VGV4dCA9IGl0ZW0ucXVlcnlTZWxlY3RvcihcIi5uYXZpZ2F0aW9uX19pdGVtVGV4dFwiKTtcbiAgICAgIGNvbnN0IGhlYWRJbWcgPSBuYXYucXVlcnlTZWxlY3RvcihcIi5uYXZpZ2F0aW9uX19pdGVtSW1nXCIpO1xuICAgICAgY29uc3QgaGVhZFR4dCA9IG5hdi5xdWVyeVNlbGVjdG9yKFwiLm5hdmlnYXRpb25fX2l0ZW1UZXh0XCIpO1xuICAgICAgaWYgKG5ld0ltZyAmJiBoZWFkSW1nKSB7XG4gICAgICAgIGhlYWRJbWcuc3JjID0gbmV3SW1nLnNyYztcbiAgICAgICAgaGVhZEltZy5hbHQgPSBuZXdJbWcuYWx0IHx8IFwiXCI7XG4gICAgICB9XG4gICAgICBpZiAobmV3VGV4dCAmJiBoZWFkVHh0KSBoZWFkVHh0LnRleHRDb250ZW50ID0gbmV3VGV4dC50ZXh0Q29udGVudDtcbiAgICAgIGZpbmlzaCgpO1xuICAgIH1cbiAgfVxuICBtZW51LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVDaG9vc2VMYW5nKTtcbiAgbWVudS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgaGFuZGxlQ2hvb3NlTGFuZywgeyBwYXNzaXZlOiBmYWxzZSB9KTtcbiAgbWVudS5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcnVwXCIsIGhhbmRsZUNob29zZUxhbmcsIHsgcGFzc2l2ZTogZmFsc2UgfSk7XG5cbiAgLy8gY29uc3QgY2xvc2UgPSAoKSA9PiB7IGlmIChpc09wZW4oKSkgeyBuYXYuY2xhc3NMaXN0LnJlbW92ZShcImlzLW9wZW5cIik7IG5hdi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsXCJmYWxzZVwiKTsgfSB9O1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm9yaWVudGF0aW9uY2hhbmdlXCIsIGNsb3NlKTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgY2xvc2UpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidmlzaWJpbGl0eWNoYW5nZVwiLCAoKSA9PiB7XG4gICAgaWYgKGRvY3VtZW50LmhpZGRlbikgY2xvc2UoKTtcbiAgfSk7XG4gIG5hdi5zdHlsZS50b3VjaEFjdGlvbiA9IFwibWFuaXB1bGF0aW9uXCI7XG4gIG1lbnUuc3R5bGUudG91Y2hBY3Rpb24gPSBcIm1hbmlwdWxhdGlvblwiO1xufVxuXG5mdW5jdGlvbiBmb2N1c0ZpcnN0SXRlbShtZW51KSB7XG4gIGNvbnN0IGZpcnN0ID0gW1xuICAgIC4uLm1lbnUucXVlcnlTZWxlY3RvckFsbChcIi5uYXZpZ2F0aW9uX19pdGVtOm5vdChbaGlkZGVuXSlcIiksXG4gIF1bMF07XG4gIGlmIChmaXJzdCkgZmlyc3QuZm9jdXMoKTtcbn1cblxuZnVuY3Rpb24gY2xvc2VBbGxOYXZzKCkge1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5hdmlnYXRpb24uaXMtb3BlblwiKS5mb3JFYWNoKChuYXYpID0+IHtcbiAgICBuYXYuY2xhc3NMaXN0LnJlbW92ZShcImlzLW9wZW5cIik7XG4gICAgbmF2LnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgXCJmYWxzZVwiKTtcbiAgICBjb25zdCBtZW51ID0gbmF2LnF1ZXJ5U2VsZWN0b3IoXCIubmF2aWdhdGlvbl9faXRlbXNcIik7XG4gICAgaWYgKG1lbnUpIHtcbiAgICAgIG1lbnUuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJ0cnVlXCIpO1xuICAgICAgbWVudS5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJub25lXCI7XG4gICAgICBtZW51LnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgbWVudS5zdHlsZS5vcGFjaXR5ID0gXCIwXCI7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICBtZW51LnJlbW92ZUF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIpO1xuICAgICAgICBtZW51LnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcIlwiO1xuICAgICAgICBtZW51LnN0eWxlLnZpc2liaWxpdHkgPSBcIlwiO1xuICAgICAgICBtZW51LnN0eWxlLm9wYWNpdHkgPSBcIlwiO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGtpbGxBbGxIb3ZlcnMoKSB7XG4gIHRyeSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIjpob3ZlclwiKS5mb3JFYWNoKChlbCkgPT4gZWwuYmx1cj8uKCkpO1xuICB9IGNhdGNoIChfKSB7fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVMYW5nSW5VcmwobGFuZywgb3B0cyA9IFVSTF9MQU5HX09QVElPTlMpIHtcbiAgY29uc3Qge1xuICAgIG1ldGhvZCA9IFwicmVwbGFjZVwiLFxuICAgIGNsZWFuRGVmYXVsdCA9IGZhbHNlLFxuICAgIGZhbGxiYWNrID0gRkFMTEJBQ0ssXG4gICAgcGFyYW0gPSBcImxhbmdcIixcbiAgfSA9IG9wdHMgfHwge307XG5cbiAgdHJ5IHtcbiAgICBjb25zdCB1cmwgPSBuZXcgVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcblxuICAgIGlmIChjbGVhbkRlZmF1bHQgJiYgbGFuZyA9PT0gZmFsbGJhY2spIHtcbiAgICAgIHVybC5zZWFyY2hQYXJhbXMuZGVsZXRlKHBhcmFtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXJsLnNlYXJjaFBhcmFtcy5zZXQocGFyYW0sIGxhbmcpO1xuICAgIH1cblxuICAgIC8vIFx1MDQzMlx1MDQzOFx1MDQzQVx1MDQzRVx1MDQ0MFx1MDQzOFx1MDQ0MVx1MDQ0Mlx1MDQzRVx1MDQzMlx1MDQ0M1x1MDQ1NFx1MDQzQ1x1MDQzRSBcdTA0MzJcdTA0NTZcdTA0MzRcdTA0M0RcdTA0M0VcdTA0NDFcdTA0M0RcdTA0MzhcdTA0MzkgXHUwNDQ4XHUwNDNCXHUwNDRGXHUwNDQ1LCBcdTA0NDlcdTA0M0VcdTA0MzEgXHUwNDQzXHUwNDNEXHUwNDM4XHUwNDNBXHUwNDMwXHUwNDQyXHUwNDM4IFx1MDQzN1x1MDQzMFx1MDQzOVx1MDQzMlx1MDQzRVx1MDQzM1x1MDQzRSBvcmlnaW5cbiAgICBjb25zdCBuZXh0ID0gdXJsLnBhdGhuYW1lICsgKHVybC5zZWFyY2ggfHwgXCJcIikgKyAodXJsLmhhc2ggfHwgXCJcIik7XG4gICAgY29uc3QgY3VycmVudCA9IGxvY2F0aW9uLnBhdGhuYW1lICsgbG9jYXRpb24uc2VhcmNoICsgbG9jYXRpb24uaGFzaDtcblxuICAgIGlmIChuZXh0ID09PSBjdXJyZW50KSByZXR1cm47IC8vIFx1MDQzRFx1MDQ1Nlx1MDQ0N1x1MDQzRVx1MDQzM1x1MDQzRSBcdTA0M0RcdTA0MzUgXHUwNDM3XHUwNDNDXHUwNDU2XHUwNDNEXHUwNDM4XHUwNDNCXHUwNDNFXHUwNDQxXHUwNDRGXG5cbiAgICBpZiAobWV0aG9kID09PSBcInB1c2hcIikge1xuICAgICAgaGlzdG9yeS5wdXNoU3RhdGUobnVsbCwgXCJcIiwgbmV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKG51bGwsIFwiXCIsIG5leHQpO1xuICAgIH1cbiAgfSBjYXRjaCB7XG4gICAgLy8gXHUwNDM0XHUwNDQzXHUwNDM2XHUwNDM1IFx1MDQ0MFx1MDQ1Nlx1MDQzNFx1MDQzQVx1MDQ1Nlx1MDQ0MVx1MDQzRFx1MDQzOFx1MDQzOSBmYWxsYmFjayBcdTA0M0RcdTA0MzAgXHUwNDMyXHUwNDM4XHUwNDNGXHUwNDMwXHUwNDM0XHUwNDNFXHUwNDNBIFx1MDQzRlx1MDQ0MFx1MDQzRVx1MDQzMVx1MDQzQlx1MDQzNVx1MDQzQyBcdTA0NTZcdTA0MzcgVVJMKClcbiAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKGxvY2F0aW9uLnNlYXJjaCk7XG4gICAgaWYgKGNsZWFuRGVmYXVsdCAmJiBsYW5nID09PSBmYWxsYmFjaykge1xuICAgICAgcGFyYW1zLmRlbGV0ZShwYXJhbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmFtcy5zZXQocGFyYW0sIGxhbmcpO1xuICAgIH1cbiAgICBjb25zdCBxID0gcGFyYW1zLnRvU3RyaW5nKCk7XG4gICAgY29uc3QgbmV4dCA9IGxvY2F0aW9uLnBhdGhuYW1lICsgKHEgPyBgPyR7cX1gIDogXCJcIikgKyBsb2NhdGlvbi5oYXNoO1xuICAgIGNvbnN0IGN1cnJlbnQgPSBsb2NhdGlvbi5wYXRobmFtZSArIGxvY2F0aW9uLnNlYXJjaCArIGxvY2F0aW9uLmhhc2g7XG4gICAgaWYgKG5leHQgPT09IGN1cnJlbnQpIHJldHVybjtcbiAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZShudWxsLCBcIlwiLCBuZXh0KTtcbiAgfVxufSIsICIvKipcbiAqIFx1MDQxRlx1MDQ0M1x1MDQzMVx1MDQzQlx1MDQ1Nlx1MDQ0N1x1MDQzRFx1MDQzOFx1MDQzOSBBUEkgXHUwNDMzXHUwNDQwXHUwNDM4LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdEdhbWUoKSB7XG5jb25zdCBidG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1haW5Db250ZW50X19idG5cIik7XG4gIGNvbnN0IGdhbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVcIik7XG4gIGNvbnN0IHBvcHVwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb3B1cFwiKTtcblxuICBpZiAoIWJ0biB8fCAhZ2FtZSB8fCAhcG9wdXApIHJldHVybjtcblxuICAvLyBcdTA0MUFcdTA0M0VcdTA0M0RcdTA0NDFcdTA0NDJcdTA0MzBcdTA0M0RcdTA0NDJcdTA0MzggXHUwNDNGXHUwNDU2XHUwNDM0IFx1MDQ0Mlx1MDQzMlx1MDQzRVx1MDQ0RSBcdTA0NDFcdTA0NTZcdTA0NDJcdTA0M0FcdTA0NDNcbiAgY29uc3QgVklTSUJMRV9ST1dTID0gNTtcbiAgY29uc3QgQ09MVU1OUyA9IDY7XG4gIGNvbnN0IEdBUF9NUyA9IDUwOyAvLyBcdTA0MzJcdTA0NTZcdTA0MzRcdTA0M0ZcdTA0M0VcdTA0MzJcdTA0NTZcdTA0MzRcdTA0MzBcdTA0NTQgLS1nYXBcbiAgY29uc3QgRFJPUF9NUyA9IDMwMDA7IC8vIFx1MDQzMlx1MDQ1Nlx1MDQzNFx1MDQzRlx1MDQzRVx1MDQzMlx1MDQ1Nlx1MDQzNFx1MDQzMFx1MDQ1NCAtLWRyb3AtZHVyXG4gIGNvbnN0IG1heERpYWcgPSBDT0xVTU5TIC0gMSArIChWSVNJQkxFX1JPV1MgLSAxKTtcblxuICAvLyBcdTA0MjFcdTA0MThcdTA0MUNcdTA0MTJcdTA0MUVcdTA0MUJcdTA0MTggKFx1MDQzRlx1MDQ0MFx1MDQzOFx1MDQzQVx1MDQzQlx1MDQzMFx1MDQzNCkuIFx1MDQxRlx1MDQ1Nlx1MDQzNFx1MDQ0MVx1MDQ0Mlx1MDQzMFx1MDQzMiBcdTA0NDFcdTA0MzJcdTA0NTZcdTA0MzkgXHUwNDNEXHUwNDMwXHUwNDMxXHUwNDU2XHUwNDQwIC8gXHUwNDMwXHUwNDM5XHUwNDM0XHUwNDU2IFx1MDQzRlx1MDQzRVx1MDQ0Mlx1MDQ0MFx1MDQ1Nlx1MDQzMVx1MDQzRFx1MDQzRVx1MDQ1NyBcdTA0MzJcdTA0MzhcdTA0MzNcdTA0NDBcdTA0MzBcdTA0NDhcdTA0M0RcdTA0M0VcdTA0NTcgXHUwNDNBXHUwNDNFXHUwNDNDXHUwNDMxXHUwNDU2XHUwNDNEXHUwNDMwXHUwNDQ2XHUwNDU2XHUwNDU3OlxuICBjb25zdCBTWU1CT0xTID0ge1xuICAgIDE6IHtcbiAgICAgIHNyYzogXCIuL2ltZy9tYWluQ29udGFpbmVyL2dhbWVJbWdfMV8xeC53ZWJwXCIsXG4gICAgICBzcmMyeDogXCIuL2ltZy9tYWluQ29udGFpbmVyL2dhbWVJbWdfMV8yeC53ZWJwXCIsXG4gICAgfSxcbiAgICAyOiB7XG4gICAgICBzcmM6IFwiLi9pbWcvbWFpbkNvbnRhaW5lci9nYW1lSW1nXzJfMXgud2VicFwiLFxuICAgICAgc3JjMng6IFwiLi9pbWcvbWFpbkNvbnRhaW5lci9nYW1lSW1nXzJfMngud2VicFwiLFxuICAgIH0sXG4gICAgMzoge1xuICAgICAgc3JjOiBcIi4vaW1nL21haW5Db250YWluZXIvZ2FtZUltZ18zXzF4LndlYnBcIixcbiAgICAgIHNyYzJ4OiBcIi4vaW1nL21haW5Db250YWluZXIvZ2FtZUltZ18zXzJ4LndlYnBcIixcbiAgICB9LFxuICAgIDQ6IHtcbiAgICAgIHNyYzogXCIuL2ltZy9tYWluQ29udGFpbmVyL2dhbWVJbWdfNF8xeC53ZWJwXCIsXG4gICAgICBzcmMyeDogXCIuL2ltZy9tYWluQ29udGFpbmVyL2dhbWVJbWdfNF8yeC53ZWJwXCIsXG4gICAgfSxcbiAgICA1OiB7XG4gICAgICBzcmM6IFwiLi9pbWcvbWFpbkNvbnRhaW5lci9nYW1lSW1nXzVfMXgud2VicFwiLFxuICAgICAgc3JjMng6IFwiLi9pbWcvbWFpbkNvbnRhaW5lci9nYW1lSW1nXzVfMngud2VicFwiLFxuICAgIH0sXG4gICAgNjoge1xuICAgICAgc3JjOiBcIi4vaW1nL21haW5Db250YWluZXIvZ2FtZUltZ182XzF4LndlYnBcIixcbiAgICAgIHNyYzJ4OiBcIi4vaW1nL21haW5Db250YWluZXIvZ2FtZUltZ182XzJ4LndlYnBcIixcbiAgICB9LFxuICAgIDc6IHtcbiAgICAgIHNyYzogXCIuL2ltZy9tYWluQ29udGFpbmVyL2dhbWVJbWdfN18xeC53ZWJwXCIsXG4gICAgICBzcmMyeDogXCIuL2ltZy9tYWluQ29udGFpbmVyL2dhbWVJbWdfN18yeC53ZWJwXCIsXG4gICAgfSxcbiAgICA4OiB7XG4gICAgICBzcmM6IFwiLi9pbWcvbWFpbkNvbnRhaW5lci9nYW1lSW1nXzhfMXgud2VicFwiLFxuICAgICAgc3JjMng6IFwiLi9pbWcvbWFpbkNvbnRhaW5lci9nYW1lSW1nXzhfMngud2VicFwiLFxuICAgIH0sXG4gICAgOToge1xuICAgICAgc3JjOiBcIi4vaW1nL21haW5Db250YWluZXIvZ2FtZUltZ185XzF4LndlYnBcIixcbiAgICAgIHNyYzJ4OiBcIi4vaW1nL21haW5Db250YWluZXIvZ2FtZUltZ185XzJ4LndlYnBcIixcbiAgICB9LFxuICB9O1xuXG4gIC8vIFx1MDQxMlx1MDQxOFx1MDQxM1x1MDQyMFx1MDQxMFx1MDQyOFx1MDQxRFx1MDQxMCBcdTA0MjFcdTA0MDZcdTA0MjJcdTA0MUFcdTA0MTA6IFx1MDQzNFx1MDQzQlx1MDQ0RiBcdTA0M0FcdTA0M0VcdTA0MzZcdTA0M0RcdTA0M0VcdTA0NTcgXHUwNDNBXHUwNDNFXHUwNDNCXHUwNDNFXHUwNDNEXHUwNDNBXHUwNDM4IDUgXHUwNDQxXHUwNDM4XHUwNDNDXHUwNDMyXHUwNDNFXHUwNDNCXHUwNDU2XHUwNDMyICh0b3AgLT4gYm90dG9tKSwgXHUwNDRGXHUwNDNBXHUwNDU2IFx1MDQxQ1x1MDQxMFx1MDQyRVx1MDQyMlx1MDQyQyBcdTA0MTdcdTA0MTBcdTA0MUJcdTA0MThcdTA0MjhcdTA0MThcdTA0MjJcdTA0MThcdTA0MjFcdTA0MkMgXHUwNDQzIFx1MDQzRlx1MDQzRVx1MDQzQlx1MDQ1NlxuICAvLyBcdTA0MUZcdTA0MDZcdTA0MTRcdTA0MjFcdTA0MjJcdTA0MTBcdTA0MTIgXHUwNDQxXHUwNDMyXHUwNDNFXHUwNDU3IElEIFx1MDQ0Mlx1MDQ0M1x1MDQ0MjpcbiAgY29uc3QgV0lOX0dSSUQgPSBbXG4gICAgWzksIDUsIDQsIDUsIDddLFxuICAgIFsxLCAyLCAyLCA1LCAzXSxcbiAgICBbNCwgMiwgNywgMSwgNV0sXG4gICAgWzgsIDIsIDEsIDMsIDRdLFxuICAgIFsyLCAyLCA0LCA4LCA2XSxcbiAgICBbMSwgNSwgOSwgNywgMV0sXG4gIF07XG5cbiAgLy8gXHUwNDI1XHUwNDM1XHUwNDNCXHUwNDNGXHUwNDM1XHUwNDQwXHUwNDM4XG4gIGNvbnN0IGdldENvbHVtbnMgPSAoKSA9PiBBcnJheS5mcm9tKGdhbWUucXVlcnlTZWxlY3RvckFsbChcIi5nYW1lX19jb2xcIikpO1xuICBmdW5jdGlvbiBjcmVhdGVJbWdFbChzeW1ib2xJZCkge1xuICAgIGNvbnN0IHsgc3JjLCBzcmMyeCB9ID0gU1lNQk9MU1tzeW1ib2xJZF07XG4gICAgY29uc3QgcGljdHVyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwaWN0dXJlXCIpO1xuICAgIGNvbnN0IHNvdXJjZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzb3VyY2VcIik7XG4gICAgc291cmNlLnR5cGUgPSBcImltYWdlL3dlYnBcIjtcbiAgICBzb3VyY2Uuc3Jjc2V0ID0gYCR7c3JjfSAxeCwgJHtzcmMyeH0gMnhgO1xuICAgIGNvbnN0IGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgaW1nLmNsYXNzTmFtZSA9IFwiZ2FtZV9fY29sSW1nXCI7XG4gICAgaW1nLnNyYyA9IHNyYztcbiAgICBpbWcuYWx0ID0gXCJcIjtcbiAgICBwaWN0dXJlLmFwcGVuZENoaWxkKHNvdXJjZSk7XG4gICAgcGljdHVyZS5hcHBlbmRDaGlsZChpbWcpO1xuICAgIHJldHVybiB7IHBpY3R1cmUsIGltZyB9O1xuICB9XG5cbiAgLy8gMSkgXHUwNDIyXHUwNDM1XHUwNDMzXHUwNDQzXHUwNDU0XHUwNDNDXHUwNDNFIFx1MDQxRlx1MDQxRVx1MDQyMFx1MDQyRlx1MDQxNFx1MDQxRVx1MDQxQSBcdTA0MzRcdTA0M0JcdTA0NEYgXHUwNDNGXHUwNDNFXHUwNDQ3XHUwNDMwXHUwNDQyXHUwNDNBXHUwNDNFXHUwNDMyXHUwNDM4XHUwNDQ1IFx1MDQzQVx1MDQzMFx1MDQ0MFx1MDQ0Mlx1MDQzOFx1MDQzRFx1MDQzRVx1MDQzQSBcdTA0NTYgXHUwNDM3XHUwNDMwXHUwNDNGXHUwNDQzXHUwNDQxXHUwNDNBXHUwNDMwXHUwNDU0XHUwNDNDXHUwNDNFIFx1MDQ1N1x1MDQ0NVx1MDQzRFx1MDQ1NCBcdTA0M0ZcdTA0MzBcdTA0MzRcdTA0NTZcdTA0M0RcdTA0M0RcdTA0NEYgKGRyb3ApXG4gIGZ1bmN0aW9uIGRyb3BJbml0aWFsR3JpZCgpIHtcbiAgICBnYW1lLmNsYXNzTGlzdC5hZGQoXCJpcy1zcGlubmluZ1wiKTtcbiAgICAvLyBcdTA0MzJcdTA0MzhcdTA0NDFcdTA0NDJcdTA0MzBcdTA0MzJcdTA0M0JcdTA0NEZcdTA0NTRcdTA0M0NcdTA0M0UgLS1vcmRlciBcdTA0MzdcdTA0MzAgXHUwNDQ0XHUwNDNFXHUwNDQwXHUwNDNDXHUwNDQzXHUwNDNCXHUwNDNFXHUwNDRFIChcdTA0M0FcdTA0M0VcdTA0M0JcdTA0M0VcdTA0M0RcdTA0M0FcdTA0MzAgKyBcdTA0M0ZcdTA0M0VcdTA0MzdcdTA0MzhcdTA0NDZcdTA0NTZcdTA0NEYgXHUwNDMyXHUwNDU2XHUwNDM0XHUwNDNEXHUwNDM4XHUwNDM3XHUwNDQzKVxuICAgIGdldENvbHVtbnMoKS5mb3JFYWNoKChjb2wsIGNJZHgpID0+IHtcbiAgICAgIGNvbnN0IGltZ3MgPSBBcnJheS5mcm9tKGNvbC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdhbWVfX2NvbEltZ1wiKSk7XG4gICAgICBjb25zdCByb3dzID0gaW1ncy5sZW5ndGg7IC8vIDVcbiAgICAgIGltZ3MuZm9yRWFjaCgoaW1nLCByVG9wKSA9PiB7XG4gICAgICAgIGNvbnN0IGZyb21Cb3R0b20gPSByb3dzIC0gMSAtIHJUb3A7XG4gICAgICAgIGltZy5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tb3JkZXJcIiwgY0lkeCArIGZyb21Cb3R0b20pO1xuICAgICAgICBpbWcuY2xhc3NMaXN0LmFkZChcImRyb3BcIik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIDIpIFx1MDQxNFx1MDQxRVx1MDQyOTogXHUwNDQxXHUwNDQyXHUwNDMyXHUwNDNFXHUwNDQwXHUwNDRFXHUwNDU0XHUwNDNDXHUwNDNFIFx1MDQ0MFx1MDQ1Nlx1MDQzMlx1MDQzRFx1MDQzRSA1IFx1MDQzRFx1MDQzRVx1MDQzMlx1MDQzOFx1MDQ0NSBcdTA0M0FcdTA0MzBcdTA0NDBcdTA0NDJcdTA0MzhcdTA0M0RcdTA0M0VcdTA0M0EgXHUwNDQzIFx1MDQxQVx1MDQxRVx1MDQxNlx1MDQxRFx1MDQwNlx1MDQxOSBcdTA0M0FcdTA0M0VcdTA0M0JcdTA0M0VcdTA0M0RcdTA0NDZcdTA0NTYgKHdpbi1ncmlkKSwgXHUwNDQ5XHUwNDNFIFx1MDQzRlx1MDQzMFx1MDQzNFx1MDQzMFx1MDQ0RVx1MDQ0Mlx1MDQ0QyBcdTA0MTdcdTA0MTNcdTA0MUVcdTA0MjBcdTA0MTggXHUwNDQzIFx1MDQzRlx1MDQzRVx1MDQzQlx1MDQzNSBcdTA0NTYgXHUwNDE3XHUwNDEwXHUwNDFCXHUwNDE4XHUwNDI4XHUwNDEwXHUwNDJFXHUwNDIyXHUwNDJDXHUwNDIxXHUwNDJGIFx1MDQ0Mlx1MDQzMFx1MDQzQ1xuICBsZXQgcmFpblN0YXJ0ZWQgPSBmYWxzZTtcbiAgZnVuY3Rpb24gZW5zdXJlT3ZlcmxheShjb2xFbCkge1xuICAgIC8vIFx1MDQ0OFx1MDQ0M1x1MDQzQVx1MDQzMFx1MDQ1NFx1MDQzQ1x1MDQzRSBcdTA0NDdcdTA0MzggXHUwNDMyXHUwNDM2XHUwNDM1IFx1MDQ1NCBcdTA0M0VcdTA0MzJcdTA0MzVcdTA0NDBcdTA0M0JcdTA0MzVcdTA0MzlcbiAgICBsZXQgb3ZlcmxheSA9IGNvbEVsLnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZV9fY29sT3ZlcmxheVwiKTtcbiAgICBpZiAoIW92ZXJsYXkpIHtcbiAgICAgIG92ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgb3ZlcmxheS5jbGFzc05hbWUgPSBcImdhbWVfX2NvbE92ZXJsYXlcIjtcbiAgICAgIGNvbEVsLmFwcGVuZENoaWxkKG92ZXJsYXkpOyAvLyBcdTA0MUZcdTA0MUVcdTA0MTJcdTA0MTVcdTA0MjBcdTA0MjUgXHUwNDNBXHUwNDNFXHUwNDNCXHUwNDNFXHUwNDNEXHUwNDNBXHUwNDM4LCBcdTA0MzBcdTA0M0JcdTA0MzUgXHUwNDNEXHUwNDM1IFx1MDQzMlx1MDQzRlx1MDQzQlx1MDQzOFx1MDQzMlx1MDQzMFx1MDQ1NCBcdTA0M0RcdTA0MzAgXHUwNDU3XHUwNDU3IFx1MDQ0NFx1MDQzQlx1MDQzRVx1MDQ0M1xuICAgIH1cbiAgICByZXR1cm4gb3ZlcmxheTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YXJ0UmFpbk9uY2Uod2luR3JpZCkge1xuICAgIGlmIChyYWluU3RhcnRlZCkgcmV0dXJuO1xuICAgIHJhaW5TdGFydGVkID0gdHJ1ZTtcblxuICAgIGNvbnN0IG1heERpYWcgPSBDT0xVTU5TIC0gMSArIChWSVNJQkxFX1JPV1MgLSAxKTtcbiAgICBsZXQgbGFzdFJhaW5JbWcgPSBudWxsO1xuXG4gICAgY29uc3QgY29scyA9IEFycmF5LmZyb20oZ2FtZS5xdWVyeVNlbGVjdG9yQWxsKFwiLmdhbWVfX2NvbFwiKSk7XG4gICAgY29scy5mb3JFYWNoKChjb2wsIGNJZHgpID0+IHtcbiAgICAgIGNvbnN0IG92ZXJsYXkgPSBlbnN1cmVPdmVybGF5KGNvbCk7XG4gICAgICAvLyBcdTA0MUVcdTA0NDdcdTA0MzhcdTA0NDlcdTA0MzBcdTA0NTRcdTA0M0NcdTA0M0UgXHUwNDNFXHUwNDMyXHUwNDM1XHUwNDQwXHUwNDNCXHUwNDM1XHUwNDM5IFx1MDQzRFx1MDQzMCBcdTA0MzJcdTA0NDFcdTA0NEZcdTA0M0EgXHUwNDMyXHUwNDM4XHUwNDNGXHUwNDMwXHUwNDM0XHUwNDNFXHUwNDNBIChcdTA0NDBcdTA0MzBcdTA0MzdcdTA0M0VcdTA0MzJcdTA0MzhcdTA0MzkgXHUwNDQxXHUwNDQ2XHUwNDM1XHUwNDNEXHUwNDMwXHUwNDQwXHUwNDU2XHUwNDM5LCBcdTA0MzBcdTA0M0JcdTA0MzUgXHUwNDQ1XHUwNDMwXHUwNDM5IFx1MDQzMVx1MDQ0M1x1MDQzNFx1MDQzNSlcbiAgICAgIG92ZXJsYXkuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgICAgLy8gXHUwNDQxXHUwNDQyXHUwNDMyXHUwNDNFXHUwNDQwXHUwNDRFXHUwNDU0XHUwNDNDXHUwNDNFIFx1MDQ0MFx1MDQ1Nlx1MDQzMlx1MDQzRFx1MDQzRSA1IFx1MDQzRFx1MDQzRVx1MDQzMlx1MDQzOFx1MDQ0NSBcdTA0M0FcdTA0MzBcdTA0NDBcdTA0NDJcdTA0MzhcdTA0M0RcdTA0M0VcdTA0M0EsIFx1MDQ0Rlx1MDQzQVx1MDQ1NiBcdTA0NDFcdTA0NDJcdTA0MzBcdTA0M0RcdTA0NDNcdTA0NDJcdTA0NEMgXHUwNDQzIFx1MDQzMlx1MDQzOFx1MDQzNFx1MDQzOFx1MDQzQ1x1MDQ1NiBcdTA0NDFcdTA0M0JcdTA0M0VcdTA0NDJcdTA0MzggKHRvcC0+Ym90dG9tKVxuICAgICAgY29uc3QgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgIGZvciAobGV0IHJUb3AgPSAwOyByVG9wIDwgVklTSUJMRV9ST1dTOyByVG9wKyspIHtcbiAgICAgICAgY29uc3Qgc3ltSWQgPSB3aW5HcmlkW2NJZHhdW3JUb3BdO1xuICAgICAgICBjb25zdCB7IHBpY3R1cmUsIGltZyB9ID0gY3JlYXRlSW1nRWwoc3ltSWQpO1xuXG4gICAgICAgIC8vIFx1MDQxRlx1MDQzRVx1MDQ0MFx1MDQ0Rlx1MDQzNFx1MDQzRVx1MDQzQSBcdTA0M0FcdTA0MzBcdTA0NDFcdTA0M0FcdTA0MzBcdTA0MzRcdTA0NDMgXHUwMEFCXHUwNDM3IFx1MDQzRFx1MDQzOFx1MDQzNlx1MDQzRFx1MDQ0Q1x1MDQzRVx1MDQzM1x1MDQzRSBcdTA0M0JcdTA0NTZcdTA0MzJcdTA0M0VcdTA0MzNcdTA0M0VcdTAwQkI6XG4gICAgICAgIGNvbnN0IGZyb21Cb3R0b20gPSBWSVNJQkxFX1JPV1MgLSAxIC0gclRvcDsgLy8gNC4uMFxuICAgICAgICBjb25zdCBvcmRlciA9IGNJZHggKyBmcm9tQm90dG9tO1xuXG4gICAgICAgIGltZy5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tb3JkZXJcIiwgb3JkZXIpO1xuICAgICAgICBpbWcuY2xhc3NMaXN0LmFkZChcInJhaW4taW5cIik7XG4gICAgICAgIGltZy5zdHlsZS5vcGFjaXR5ID0gXCIwXCI7IC8vIFx1MDQ0MVx1MDQ0Mlx1MDQ0MFx1MDQzMFx1MDQ0NVx1MDQzRVx1MDQzMlx1MDQzQVx1MDQzMCBcdTA0MzJcdTA0NTZcdTA0MzQgXHUwNDNDXHUwNDU2XHUwNDNBXHUwNDQwXHUwNDNFLVx1MDQzMVx1MDQzQlx1MDQzOFx1MDQzQ1x1MDQ0MyBcdTA0MzRcdTA0M0UgXHUwNDM3XHUwNDMwXHUwNDQxXHUwNDQyXHUwNDNFXHUwNDQxXHUwNDQzXHUwNDMyXHUwNDMwXHUwNDNEXHUwNDNEXHUwNDRGIENTU1xuXG4gICAgICAgIGlmIChvcmRlciA9PT0gbWF4RGlhZykgbGFzdFJhaW5JbWcgPSBpbWc7XG5cbiAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChwaWN0dXJlKTtcbiAgICAgIH1cbiAgICAgIG92ZXJsYXkuYXBwZW5kQ2hpbGQoZnJhZyk7XG4gICAgfSk7XG5cbiAgICAvLyBcdTA0MUFcdTA0M0VcdTA0M0JcdTA0MzggXHUwNDMyXHUwNDU2XHUwNDM0XHUwNDNGXHUwNDQwXHUwNDMwXHUwNDQ2XHUwNDRFXHUwNDU0IFx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQzMFx1MDQzRFx1MDQzRFx1MDQ1Nlx1MDQzOSByYWluLVx1MDQzNVx1MDQzQlx1MDQzNVx1MDQzQ1x1MDQzNVx1MDQzRFx1MDQ0MiBcdTIwMTQgXHUwNDNGXHUwNDNFXHUwNDNGXHUwNDMwXHUwNDNGIFx1MDQ1NiBcdTA0M0JcdTA0M0VcdTA0M0FcbiAgICBpZiAobGFzdFJhaW5JbWcpIHtcbiAgICAgIGxhc3RSYWluSW1nLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgIFwiYW5pbWF0aW9uZW5kXCIsXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICB0cmlnZ2VyRXhwbG9zaW9ucyh3aW5HcmlkKS50aGVuKFxuICAgICAgICAgICAgLy8gb3BlblBvcHVwQW5kTG9ja1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIC8vIG9wZW5Qb3B1cEFuZExvY2soKTtcbiAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJnYW1lLXNwdW5cIiwgdHJ1ZSk7XG4gICAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KFwic2xvdDpiaWd3aW5cIikpO1xuICAgICAgICAgICAgfSwgMTMwMClcbiAgICAgICAgICApO1xuICAgICAgICB9LFxuICAgICAgICB7IG9uY2U6IHRydWUgfVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0VGltZW91dChcbiAgICAgICAgLy8gb3BlblBvcHVwQW5kTG9jayxcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJnYW1lLXNwdW5cIiwgdHJ1ZSksXG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KFwic2xvdDpiaWd3aW5cIikpLFxuICAgICAgICBwYXJzZUZsb2F0KGdldENvbXB1dGVkU3R5bGUoZ2FtZSkuZ2V0UHJvcGVydHlWYWx1ZShcIi0tZHJvcC1kdXJcIikpICpcbiAgICAgICAgICAxMDAwIHx8IDM1MFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB0cmlnZ2VyRXhwbG9zaW9ucyh3aW5HcmlkKSB7XG4gICAgLy8gXHUwNDFGXHUwNDNFXHUwNDMyXHUwNDM1XHUwNDQwXHUwNDQyXHUwNDMwXHUwNDU0XHUwNDNDXHUwNDNFIFx1MDQzRlx1MDQ0MFx1MDQzRVx1MDQzQ1x1MDQ1Nlx1MDQ0MSwgXHUwNDRGXHUwNDNBXHUwNDM4XHUwNDM5IFx1MDQzMlx1MDQzOFx1MDQzQVx1MDQzRVx1MDQzRFx1MDQzMFx1MDQ1NFx1MDQ0Mlx1MDQ0Q1x1MDQ0MVx1MDQ0RiwgXHUwNDNBXHUwNDNFXHUwNDNCXHUwNDM4IFx1MDQxMlx1MDQyMVx1MDQwNiBcdTA0MzJcdTA0MzhcdTA0MzFcdTA0NDNcdTA0NDVcdTA0MzggKFx1MDQzMlx1MDQzQVx1MDQzQlx1MDQ0RVx1MDQ0N1x1MDQzRFx1MDQzRSBcdTA0MzcgXHUwNDNGXHUwNDNFXHUwNDRGXHUwNDMyXHUwNDNFXHUwNDRFIFx1MDBBQmJvb21cdTAwQkIpIFx1MDQzN1x1MDQzMFx1MDQzQVx1MDQ1Nlx1MDQzRFx1MDQ0N1x1MDQzMFx1MDQ0Mlx1MDQ0Q1x1MDQ0MVx1MDQ0RlxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgY29uc3Qgb3ZlcmxheXMgPSBnZXRDb2x1bW5zKCkubWFwKChjb2wpID0+XG4gICAgICAgIGNvbC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVfX2NvbE92ZXJsYXlcIilcbiAgICAgICk7XG4gICAgICBjb25zdCB0YXJnZXRzID0gW107XG5cbiAgICAgIC8vIFx1MDQzN1x1MDQzRFx1MDQzMFx1MDQ0NVx1MDQzRVx1MDQzNFx1MDQzOFx1MDQzQ1x1MDQzRSBcdTA0MzVcdTA0M0JcdTA0MzVcdTA0M0NcdTA0MzVcdTA0M0RcdTA0NDJcdTA0MzgtXHUwNDQ2XHUwNDU2XHUwNDNCXHUwNDU2IChcdTA0MzRcdTA0MzUgXHUwNDQzIFdJTl9HUklEID09IDIpXG4gICAgICBmb3IgKGxldCBjID0gMDsgYyA8IENPTFVNTlM7IGMrKykge1xuICAgICAgICBjb25zdCBvdmVybGF5ID0gb3ZlcmxheXNbY107XG4gICAgICAgIGlmICghb3ZlcmxheSkgY29udGludWU7XG5cbiAgICAgICAgLy8gXHUwNDNGXHUwNDNFXHUwNDQwXHUwNDRGXHUwNDM0XHUwNDNFXHUwNDNBIFx1MDQ0MyBvdmVybGF5OiB0b3AuLmJvdHRvbSA9IFx1MDQ1Nlx1MDQzRFx1MDQzNFx1MDQzNVx1MDQzQVx1MDQ0MVx1MDQzOCAwLi5WSVNJQkxFX1JPV1MtMVxuICAgICAgICBjb25zdCBwaWN0dXJlcyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgb3ZlcmxheS5xdWVyeVNlbGVjdG9yQWxsKFwiOnNjb3BlID4gcGljdHVyZVwiKVxuICAgICAgICApO1xuICAgICAgICBmb3IgKGxldCByVG9wID0gMDsgclRvcCA8IFZJU0lCTEVfUk9XUzsgclRvcCsrKSB7XG4gICAgICAgICAgaWYgKHdpbkdyaWRbY11bclRvcF0gPT09IDIpIHtcbiAgICAgICAgICAgIGNvbnN0IHBpYyA9IHBpY3R1cmVzW3JUb3BdO1xuICAgICAgICAgICAgaWYgKCFwaWMpIGNvbnRpbnVlO1xuICAgICAgICAgICAgY29uc3QgaW1nID0gcGljLnF1ZXJ5U2VsZWN0b3IoXCJpbWcuZ2FtZV9fY29sSW1nXCIpO1xuICAgICAgICAgICAgaWYgKGltZykgdGFyZ2V0cy5wdXNoKGltZyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghdGFyZ2V0cy5sZW5ndGgpIHtcbiAgICAgICAgLy8gXHUwNDRGXHUwNDNBXHUwNDQ5XHUwNDNFIFx1MDBBQlx1MDQzNFx1MDQzMlx1MDQ1Nlx1MDQzOVx1MDQzRVx1MDQzQVx1MDBCQiBcdTA0M0RcdTA0MzVcdTA0M0NcdTA0MzBcdTA0NTQgXHUyMDE0IFx1MDQzRFx1MDQ1Nlx1MDQ0N1x1MDQzRVx1MDQzM1x1MDQzRSBcdTA0MzJcdTA0MzhcdTA0MzFcdTA0NDNcdTA0NDVcdTA0MzBcdTA0NDJcdTA0MzhcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxldCBmaW5pc2hlZCA9IDA7XG4gICAgICBjb25zdCB0b3RhbCA9IHRhcmdldHMubGVuZ3RoO1xuXG4gICAgICB0YXJnZXRzLmZvckVhY2goKGltZykgPT4ge1xuICAgICAgICAvLyBcdTA0MzJcdTA0MzBcdTA0MzZcdTA0M0JcdTA0MzhcdTA0MzJcdTA0M0U6IFx1MDQzN1x1MDQzRFx1MDQ0Rlx1MDQ0Mlx1MDQzOCBcdTA0M0NcdTA0M0VcdTA0MzZcdTA0M0JcdTA0MzhcdTA0MzJcdTA0MzhcdTA0MzkgcmFpbi1cdTA0M0FcdTA0M0JcdTA0MzBcdTA0NDEsIFx1MDQ0OVx1MDQzRVx1MDQzMSBcdTA0M0RcdTA0MzUgXHUwNDMxXHUwNDQzXHUwNDNCXHUwNDNFIFx1MDQzRFx1MDQzMFx1MDQzQVx1MDQzQlx1MDQzMFx1MDQzNFx1MDQzQVx1MDQzOCBcdTA0MzBcdTA0M0RcdTA0NTZcdTA0M0NcdTA0MzBcdTA0NDZcdTA0NTZcdTA0MzlcbiAgICAgICAgaW1nLmNsYXNzTGlzdC5yZW1vdmUoXCJyYWluLWluXCIpO1xuXG4gICAgICAgIC8vIFx1MDQzMlx1MDQzOFx1MDQzRlx1MDQzMFx1MDQzNFx1MDQzQVx1MDQzRVx1MDQzMlx1MDQzOFx1MDQzOSBcdTAwQUJcdTA0NDVcdTA0M0VcdTA0M0ZcdTAwQkIgMVx1MjAxMzNweFxuICAgICAgICBjb25zdCBob3AgPSBNYXRoLmZsb29yKDEgKyBNYXRoLnJhbmRvbSgpICogMyk7XG4gICAgICAgIGltZy5zdHlsZS5zZXRQcm9wZXJ0eShcIi0taG9wXCIsIGhvcCArIFwicHhcIik7XG5cbiAgICAgICAgLy8gXHUwNDNBXHUwNDNFXHUwNDNCXHUwNDM4IFx1MDQzN1x1MDQzMFx1MDQzQVx1MDQ1Nlx1MDQzRFx1MDQ0N1x1MDQzOFx1MDQ0Mlx1MDQ0Q1x1MDQ0MVx1MDQ0RiBcdTAwQUJleHBsb2RlXHUwMEJCIFx1MjAxNCBcdTA0MzdcdTA0MzBcdTA0M0NcdTA0NTZcdTA0M0RcdTA0MzhcdTA0M0NcdTA0M0UgXHUwNDNEXHUwNDMwIFx1MDQ0MVx1MDQzRlx1MDQ0MFx1MDQzMFx1MDQzOVx1MDQ0MiBcdTA0MzJcdTA0MzhcdTA0MzFcdTA0NDNcdTA0NDVcdTA0NDMgXHUwNDU2IFx1MDQzRlx1MDQ0MFx1MDQzRVx1MDQzM1x1MDQ0MFx1MDQzMFx1MDQ1NFx1MDQzQ1x1MDQzRSBib29tQXBwZWFyXG4gICAgICAgIGltZy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgIFwiYW5pbWF0aW9uZW5kXCIsXG4gICAgICAgICAgZnVuY3Rpb24gb25FeHBsb2RlRW5kKGUpIHtcbiAgICAgICAgICAgIGlmIChlLmFuaW1hdGlvbk5hbWUgIT09IFwiZXhwbG9kZVwiKSByZXR1cm47XG5cbiAgICAgICAgICAgIC8vIFx1MDQzRlx1MDQ1Nlx1MDQzNFx1MDQzQ1x1MDQ1Nlx1MDQzRFx1MDQzMCBcdTA0M0FcdTA0MzBcdTA0NDBcdTA0NDJcdTA0MzhcdTA0M0RcdTA0M0FcdTA0MzggXHUwNDNEXHUwNDMwIFx1MDQ0MVx1MDQzRlx1MDQ0MFx1MDQzMFx1MDQzOVx1MDQ0MiBcdTA0MzJcdTA0MzhcdTA0MzFcdTA0NDNcdTA0NDVcdTA0NDNcbiAgICAgICAgICAgIGNvbnN0IGJvb21TcmMxeCA9IFwiLi9pbWcvbWFpbkNvbnRhaW5lci9nYW1lSW1nX3dpbl8xeC53ZWJwXCI7XG4gICAgICAgICAgICBjb25zdCBib29tU3JjMnggPSBcIi4vaW1nL21haW5Db250YWluZXIvZ2FtZUltZ193aW5fMngud2VicFwiO1xuXG4gICAgICAgICAgICAvLyBcdTA0NDMgXHUwNDNEXHUwNDMwXHUwNDQxIHN0cnVjdHVyZSA8cGljdHVyZT48c291cmNlLz48aW1nLz48L3BpY3R1cmU+XG4gICAgICAgICAgICBjb25zdCBwaWN0dXJlID0gaW1nLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICBjb25zdCBzb3VyY2UgPSBwaWN0dXJlLnF1ZXJ5U2VsZWN0b3IoXCJzb3VyY2VcIik7XG5cbiAgICAgICAgICAgIGlmIChzb3VyY2UpIHNvdXJjZS5zcmNzZXQgPSBgJHtib29tU3JjMXh9IDF4LCAke2Jvb21TcmMyeH0gMnhgO1xuICAgICAgICAgICAgaW1nLnNyYyA9IGJvb21TcmMxeDtcblxuICAgICAgICAgICAgLy8gXHUwNDNGXHUwNDQwXHUwNDM4XHUwNDMxXHUwNDM1XHUwNDQwXHUwNDM1XHUwNDNDXHUwNDNFIFx1MDQzQVx1MDQzQlx1MDQzMFx1MDQ0MVx1MDQzOCBcdTA0MzJcdTA0MzhcdTA0MzFcdTA0NDNcdTA0NDVcdTA0NDMgXHUwNDU2IFx1MDQzNFx1MDQzMFx1MDQzQ1x1MDQzRSBcdTAwQUJcdTA0M0ZcdTA0M0VcdTA0NEZcdTA0MzJcdTA0NDNcdTAwQkIgXHUwNDQxXHUwNDNGXHUwNDQwXHUwNDMwXHUwNDM5XHUwNDQyXHUwNDQzXG4gICAgICAgICAgICBpbWcuY2xhc3NMaXN0LnJlbW92ZShcImV4cGxvZGVcIik7XG4gICAgICAgICAgICBpbWcuY2xhc3NMaXN0LmFkZChcImJvb21cIik7XG5cbiAgICAgICAgICAgIC8vIFx1MDQzQVx1MDQzRVx1MDQzQlx1MDQzOCBcdTAwQUJib29tQXBwZWFyXHUwMEJCIFx1MDQzN1x1MDQzMFx1MDQzQVx1MDQ1Nlx1MDQzRFx1MDQ0N1x1MDQzOFx1MDQ0Mlx1MDQ0Q1x1MDQ0MVx1MDQ0RiBcdTIwMTQgXHUwNDQwXHUwNDMwXHUwNDQ1XHUwNDQzXHUwNDU0XHUwNDNDXHUwNDNFIFx1MDQzN1x1MDQzMFx1MDQzMlx1MDQzNVx1MDQ0MFx1MDQ0OFx1MDQzNVx1MDQzRFx1MDQzRFx1MDQ0RlxuICAgICAgICAgICAgaW1nLmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgZnVuY3Rpb24gb25Cb29tRW5kKGV2KSB7XG4gICAgICAgICAgICAgIGlmIChldi5hbmltYXRpb25OYW1lICE9PSBcImJvb21BcHBlYXJcIikgcmV0dXJuO1xuICAgICAgICAgICAgICBpbWcucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCBvbkJvb21FbmQpO1xuXG4gICAgICAgICAgICAgIGZpbmlzaGVkKys7XG4gICAgICAgICAgICAgIGlmIChmaW5pc2hlZCA9PT0gdG90YWwpIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgeyBvbmNlOiB0cnVlIH1cbiAgICAgICAgKTtcblxuICAgICAgICAvLyBcdTA0NDFcdTA0NDJcdTA0MzBcdTA0NDBcdTA0NDJcdTA0NDNcdTA0NTRcdTA0M0NcdTA0M0UgXHUwMEFCZXhwbG9kZVx1MDBCQlxuICAgICAgICBpbWcuY2xhc3NMaXN0LmFkZChcImV4cGxvZGVcIik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9wZW5Qb3B1cEFuZExvY2soKSB7XG4gICAgLy8gXHUwNDExXHUwNDNCXHUwNDNFXHUwNDNBXHUwNDQzXHUwNDU0XHUwNDNDXHUwNDNFIFx1MDQzRFx1MDQzMFx1MDQzN1x1MDQzMFx1MDQzMlx1MDQzNlx1MDQzNFx1MDQzOFxuICAgIGJ0bi5jbGFzc0xpc3QuYWRkKFwiaXMtbG9ja2VkXCIpO1xuICAgIGJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgYnRuLnNldEF0dHJpYnV0ZShcImFyaWEtZGlzYWJsZWRcIiwgXCJ0cnVlXCIpO1xuICAgIGJ0bi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWJ1c3lcIiwgXCJ0cnVlXCIpO1xuXG4gICAgLy8gXHUwNDFGXHUwNDNFXHUwNDNGXHUwNDMwXHUwNDNGOiBcdTA0MzdcdTA0M0RcdTA0NTZcdTA0M0NcdTA0MzBcdTA0NTRcdTA0M0NcdTA0M0UgYXJpYS1oaWRkZW4gXHUwNDU2IFx1MDQzNFx1MDQzRVx1MDQzNFx1MDQzMFx1MDQ1NFx1MDQzQ1x1MDQzRSAuaXMtb3BlbiBcdTA0M0ZcdTA0NTZcdTA0MzQgXHUwNDQyXHUwNDMyXHUwNDNFXHUwNDU3IFx1MDQ0MVx1MDQ0Mlx1MDQzOFx1MDQzQlx1MDQ1NlxuICAgIHBvcHVwLmNsYXNzTGlzdC5hZGQoXCJpcy1vcGVuXCIpO1xuICAgIHBvcHVwLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwiZmFsc2VcIik7XG5cbiAgICAvLyAoXHUwNDNFXHUwNDNGXHUwNDQ2XHUwNDU2XHUwNDM5XHUwNDNEXHUwNDNFKSBcdTA0M0ZcdTA0NDBcdTA0MzhcdTA0MzFcdTA0MzhcdTA0NDBcdTA0MzBcdTA0NTRcdTA0M0NcdTA0M0UgXHUwNDQxXHUwNDQyXHUwNDMwXHUwNDNEIFx1MDQzM1x1MDQ0MFx1MDQzOFxuICAgIGdhbWUuY2xhc3NMaXN0LnJlbW92ZShcImlzLXNwaW5uaW5nXCIpO1xuICB9XG5cbiAgLy8gMykgXHUwNDFFXHUwNDQxXHUwNDNEXHUwNDNFXHUwNDMyXHUwNDNEXHUwNDM4XHUwNDM5IFx1MDQ0MVx1MDQ0Nlx1MDQzNVx1MDQzRFx1MDQzMFx1MDQ0MFx1MDQ1Nlx1MDQzOTogXHUwNDFFXHUwNDE0XHUwNDFEXHUwNDEwIFx1MDQ0NVx1MDQzMlx1MDQzOFx1MDQzQlx1MDQ0RiBkcm9wICsgXHUwNDFFXHUwNDE0XHUwNDFEXHUwNDEwIFx1MDQ0NVx1MDQzMlx1MDQzOFx1MDQzQlx1MDQ0RiByYWluLWluXG4gIGZ1bmN0aW9uIHNwaW5PbmNlVG9XaW4od2luR3JpZCkge1xuICAgIGlmIChidG4uY2xhc3NMaXN0LmNvbnRhaW5zKFwiaXMtbG9ja2VkXCIpIHx8IGJ0bi5kaXNhYmxlZCkgcmV0dXJuO1xuXG4gICAgYnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICBkcm9wSW5pdGlhbEdyaWQoKTtcblxuICAgIC8vIFx1MDQxN1x1MDQzMFx1MDQzRlx1MDQ0M1x1MDQ0MVx1MDQzQVx1MDQzMFx1MDQ1NFx1MDQzQ1x1MDQzRSBcdTA0MTRcdTA0MUVcdTA0MjkgXHUwNDQwXHUwNDU2XHUwNDMyXHUwNDNEXHUwNDNFIFx1MDQzMiBcdTA0NDJcdTA0M0VcdTA0MzkgXHUwNDNDXHUwNDNFXHUwNDNDXHUwNDM1XHUwNDNEXHUwNDQyLCBcdTA0M0FcdTA0M0VcdTA0M0JcdTA0MzggXHUwNDFGXHUwNDFFXHUwNDI3XHUwNDFEXHUwNDIzXHUwNDIyXHUwNDJDIFx1MDQzRlx1MDQzMFx1MDQzNFx1MDQzMFx1MDQ0Mlx1MDQzOCBcdTA0MzJcdTA0MzVcdTA0NDBcdTA0NDVcdTA0M0RcdTA0NENcdTA0M0UtXHUwNDNGXHUwNDQwXHUwNDMwXHUwNDMyXHUwNDU2IChcdTA0M0VcdTA0NDFcdTA0NDJcdTA0MzBcdTA0M0RcdTA0M0RcdTA0NTZcdTA0MzkgXHUwNDNBXHUwNDQwXHUwNDNFXHUwNDNBIFx1MDQzNFx1MDQ1Nlx1MDQzMFx1MDQzM1x1MDQzRVx1MDQzRFx1MDQzMFx1MDQzQlx1MDQ1Nik6XG4gICAgLy8gXHUwNDQ2XHUwNDM1IFx1MDQ0MVx1MDQ0Mlx1MDQzMFx1MDQzRFx1MDQzNVx1MDQ0Mlx1MDQ0Q1x1MDQ0MVx1MDQ0RiBcdTA0NDdcdTA0MzVcdTA0NDBcdTA0MzVcdTA0MzcgR0FQX01TICogbWF4RGlhZyBcdTA0MzJcdTA0NTZcdTA0MzQgXHUwNDQxXHUwNDQyXHUwNDMwXHUwNDQwXHUwNDQyXHUwNDQzIGRyb3BcbiAgICBzZXRUaW1lb3V0KCgpID0+IHN0YXJ0UmFpbk9uY2Uod2luR3JpZCksIEdBUF9NUyAqIG1heERpYWcpO1xuICB9XG5cbiAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBzcGluT25jZVRvV2luKFdJTl9HUklEKSk7XG5cbiAgLy8gNCkgXHUwNDJGXHUwNDNBXHUwNDQ5XHUwNDNFIFx1MDQzMlx1MDQzNlx1MDQzNSBcdTA0M0FcdTA0NDBcdTA0NDNcdTA0NDJcdTA0MzhcdTA0M0JcdTA0MzggXHUyMDE0IFx1MDQzRVx1MDQzNFx1MDQ0MFx1MDQzMFx1MDQzN1x1MDQ0MyBcdTA0NDFcdTA0MzhcdTA0MzNcdTA0M0RcdTA0MzBcdTA0M0JcdTA0NTZcdTA0MzdcdTA0NDNcdTA0NTRcdTA0M0NcdTA0M0UgKFx1MDQzMVx1MDQzNVx1MDQzNyBcdTA0MzdcdTA0MzBcdTA0M0JcdTA0MzVcdTA0MzZcdTA0M0RcdTA0M0VcdTA0NDFcdTA0NDJcdTA0NTYgXHUwNDMyXHUwNDU2XHUwNDM0IHBvcHVwLmpzKVxuICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJnYW1lLXNwdW5cIikgPT09IFwidHJ1ZVwiKSB7XG4gICAgYnRuPy5zZXRBdHRyaWJ1dGUoXCJhcmlhLWRpc2FibGVkXCIsIFwidHJ1ZVwiKTtcbiAgICBidG4/LnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PlxuICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCJzbG90OmJpZ3dpblwiKSlcbiAgICApO1xuICB9XG59XG5cbiIsICJleHBvcnQgZnVuY3Rpb24gb3BlblBvcHVwKCkge1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBvcHVwXCIpPy5jbGFzc0xpc3QuYWRkKFwiaXMtb3BlblwiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRQb3B1cCgpIHtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInNsb3Q6Ymlnd2luXCIsIG9wZW5Qb3B1cCk7XG59XG4iLCAiaW1wb3J0IHsgZGV0ZWN0TGFuZyB9IGZyb20gXCIuL2xhbmcuanNcIjtcblxuY29uc3QgUEFZTUVOVF9TRVRTID0ge1xuICBlbmc6IFtcbiAgICB7IHNyYzogXCJpbWcvZm9vdGVyL2ludGVyYWMuc3ZnXCIsIGFsdDogXCJJbnRlcmFjXCIgfSxcbiAgICB7IHNyYzogXCJpbWcvZm9vdGVyL3Zpc2Euc3ZnXCIsIGFsdDogXCJWaXNhXCIgfSxcbiAgICB7IHNyYzogXCJpbWcvZm9vdGVyL2FwcGxlcGF5LnN2Z1wiLCBhbHQ6IFwiQXBwbGUgUGF5XCIgfSxcbiAgICB7IHNyYzogXCJpbWcvZm9vdGVyL2dvb2dsZXBheS5zdmdcIiwgYWx0OiBcIkdvb2dsZSBQYXlcIiB9LFxuICAgIHsgc3JjOiBcImltZy9mb290ZXIvdGV0aGVyYi5zdmdcIiwgYWx0OiBcIlRldGhlciBCaXRjb2luXCIgfSxcbiAgICB7IHNyYzogXCJpbWcvZm9vdGVyL2FnZS5zdmdcIiwgYWx0OiBcIjE4K1wiIH0sXG4gIF0sXG4gIGRldTogW1xuICAgIHsgc3JjOiBcImltZy9mb290ZXIva2xhcm5hLnN2Z1wiLCBhbHQ6IFwiS2xhcm5hXCIgfSxcbiAgICB7IHNyYzogXCJpbWcvZm9vdGVyL3Zpc2Euc3ZnXCIsIGFsdDogXCJWaXNhXCIgfSxcbiAgICB7IHNyYzogXCJpbWcvZm9vdGVyL2FwcGxlcGF5LnN2Z1wiLCBhbHQ6IFwiQXBwbGUgUGF5XCIgfSxcbiAgICB7IHNyYzogXCJpbWcvZm9vdGVyL2dvb2dsZXBheS5zdmdcIiwgYWx0OiBcIkdvb2dsZSBQYXlcIiB9LFxuICAgIHsgc3JjOiBcImltZy9mb290ZXIvdW5pb24uc3ZnXCIsIGFsdDogXCJVbmlvblwiIH0sXG4gICAgeyBzcmM6IFwiaW1nL2Zvb3Rlci90ZXRoZXJiLnN2Z1wiLCBhbHQ6IFwiVGV0aGVyIEJpdGNvaW5cIiB9LFxuICAgIHsgc3JjOiBcImltZy9mb290ZXIvbmV0ZWxsZXIuc3ZnXCIsIGFsdDogXCJOZXRlbGxlclwiIH0sXG4gICAgeyBzcmM6IFwiaW1nL2Zvb3Rlci9zY3JpbGwuc3ZnXCIsIGFsdDogXCJTY3JpbGxcIiB9LFxuICAgIHsgc3JjOiBcImltZy9mb290ZXIvcmFwaWQuc3ZnXCIsIGFsdDogXCJSYXBpZFwiIH0sXG4gICAgeyBzcmM6IFwiaW1nL2Zvb3Rlci92ZWN0b3Iuc3ZnXCIsIGFsdDogXCJWZWN0b3JcIiB9LFxuICAgIHsgc3JjOiBcImltZy9mb290ZXIvb3BlbmJhbmtpbmcuc3ZnXCIsIGFsdDogXCJPcGVuIGJhbmtpbmdcIiB9LFxuICAgIHsgc3JjOiBcImltZy9mb290ZXIvYWdlLnN2Z1wiLCBhbHQ6IFwiMTgrXCIgfSxcbiAgXSxcbiAgZ2VuZXJhbDogW1xuICAgIHsgc3JjOiBcImltZy9mb290ZXIvdmlzYS5zdmdcIiwgYWx0OiBcIlZpc2FcIiB9LFxuICAgIHsgc3JjOiBcImltZy9mb290ZXIvYXBwbGVwYXkuc3ZnXCIsIGFsdDogXCJBcHBsZSBQYXlcIiB9LFxuICAgIHsgc3JjOiBcImltZy9mb290ZXIvZ29vZ2xlcGF5LnN2Z1wiLCBhbHQ6IFwiR29vZ2xlIFBheVwiIH0sXG4gICAgeyBzcmM6IFwiaW1nL2Zvb3Rlci90ZXRoZXJiLnN2Z1wiLCBhbHQ6IFwiVGV0aGVyIEJpdGNvaW5cIiB9LFxuICAgIHsgc3JjOiBcImltZy9mb290ZXIvYWdlLnN2Z1wiLCBhbHQ6IFwiMTgrXCIgfSxcbiAgXSxcbn07XG5cbi8qKlxuICogXHUwNDFDXHUwNDMwXHUwNDNGXHUwNDMwIFwiXHUwNDNDXHUwNDNFXHUwNDMyXHUwNDMwIC0+IFx1MDQzQVx1MDQzQlx1MDQ0RVx1MDQ0NyBcdTA0M0RcdTA0MzBcdTA0MzFcdTA0M0VcdTA0NDBcdTA0NDNcIi5cbiAqIFx1MDQxMlx1MDQ0MVx1MDQzNSBcdTA0M0RcdTA0MzUgXHUwNDNGXHUwNDM1XHUwNDQwXHUwNDM1XHUwNDNCXHUwNDU2XHUwNDQ3XHUwNDM1XHUwNDNEXHUwNDM1IFx1MDQ0Mlx1MDQ0M1x1MDQ0MiBcdTA0M0ZcdTA0NTZcdTA0MzRcdTA0MzUgXHUwNDQzICdnZW5lcmFsJy5cbiAqL1xuZnVuY3Rpb24gcGlja1NldEtleShsYW5nKSB7XG4gIGlmIChsYW5nID09PSBcImVuZ1wiKSByZXR1cm4gXCJlbmdcIjtcbiAgaWYgKGxhbmcgPT09IFwiZGV1XCIpIHJldHVybiBcImRldVwiO1xuICByZXR1cm4gXCJnZW5lcmFsXCI7XG59XG5cbi8qKlxuICogXHUwNDIwXHUwNDM1XHUwNDNEXHUwNDM0XHUwNDM1XHUwNDQwXHUwNDM4XHUwNDNDXHUwNDNFL1x1MDQzRVx1MDQzRFx1MDQzRVx1MDQzMlx1MDQzQlx1MDQ0RVx1MDQ1NFx1MDQzQ1x1MDQzRSBcdTA0M0FcdTA0MzBcdTA0NDBcdTA0NDJcdTA0MzhcdTA0M0RcdTA0M0FcdTA0MzggXHUwNDQzIFx1MDQ0NFx1MDQ0M1x1MDQ0Mlx1MDQzNVx1MDQ0MFx1MDQ1Ni5cbiAqIFx1MDQxRlx1MDQ0MFx1MDQzMFx1MDQ0Nlx1MDQ0RVx1MDQ1NFx1MDQzQ1x1MDQzRSBcdTA0MzJcdTA0NDFcdTA0MzVcdTA0NDBcdTA0MzVcdTA0MzRcdTA0MzhcdTA0M0RcdTA0NTYgLmZvb3Rlcl9faXRlbXM6IFx1MDQzMFx1MDQzMVx1MDQzRSBcdTA0M0VcdTA0M0RcdTA0M0VcdTA0MzJcdTA0M0JcdTA0NEVcdTA0NTRcdTA0M0NcdTA0M0UgXHUwNDU2XHUwNDQxXHUwNDNEXHUwNDQzXHUwNDRFXHUwNDQ3XHUwNDU2IDxpbWc+LCBcdTA0MzBcdTA0MzFcdTA0M0UgXHUwNDQxXHUwNDQyXHUwNDMyXHUwNDNFXHUwNDQwXHUwNDRFXHUwNDU0XHUwNDNDXHUwNDNFIFx1MDQzN1x1MDQzMFx1MDQzRFx1MDQzRVx1MDQzMlx1MDQzRS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckZvb3RlclBheW1lbnRzKGxhbmcpIHtcbiAgY29uc3Qgc2V0S2V5ID0gcGlja1NldEtleShsYW5nKTtcbiAgY29uc3QgaXRlbXMgPSBQQVlNRU5UX1NFVFNbc2V0S2V5XSB8fCBQQVlNRU5UX1NFVFMuZ2VuZXJhbDtcblxuICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZvb3RlciAuZm9vdGVyX19pdGVtc1wiKTtcbiAgaWYgKCFjb250YWluZXIpIHJldHVybjtcblxuICAvLyBcdTA0MjBcdTA0M0VcdTA0MzFcdTA0MzhcdTA0M0NcdTA0M0UgXHUwNDQxXHUwNDQyXHUwNDQwXHUwNDQzXHUwNDNBXHUwNDQyXHUwNDQzXHUwNDQwXHUwNDQzIFx1MDQzRlx1MDQ0MFx1MDQzNVx1MDQzNFx1MDQ0MVx1MDQzQVx1MDQzMFx1MDQzN1x1MDQ0M1x1MDQzMlx1MDQzMFx1MDQzRFx1MDQzRVx1MDQ0RTogXHUwNDNGXHUwNDNFXHUwNDMyXHUwNDNEXHUwNDU2XHUwNDQxXHUwNDQyXHUwNDRFIFx1MDQzRlx1MDQzNVx1MDQ0MFx1MDQzNVx1MDQzMVx1MDQ0M1x1MDQzNFx1MDQ0M1x1MDQ1NFx1MDQzQ1x1MDQzRSBcdTA0NDFcdTA0M0ZcdTA0MzhcdTA0NDFcdTA0M0VcdTA0M0EgKFx1MDQzRlx1MDQ0MFx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQ1Nlx1MDQ0OFx1MDQzNSBcdTA0NTYgXHUwNDNEXHUwNDMwXHUwNDM0XHUwNDU2XHUwNDM5XHUwNDNEXHUwNDU2XHUwNDQ4XHUwNDM1KS5cbiAgY29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7IC8vIFx1MDQ0Rlx1MDQzQVx1MDQ0OVx1MDQzRSBcdTA0NDVcdTA0M0VcdTA0NDdcdTA0MzVcdTA0NDggXHUwNDMxXHUwNDM1XHUwNDM3IFx1MDQzRlx1MDQzRVx1MDQzMlx1MDQzRFx1MDQzRVx1MDQzM1x1MDQzRSBcdTA0M0ZcdTA0MzVcdTA0NDBcdTA0MzVcdTA0NDBcdTA0MzVcdTA0M0RcdTA0MzRcdTA0MzVcdTA0NDBcdTA0NDMgXHUyMDE0IFx1MDQzQ1x1MDQzRVx1MDQzNlx1MDQzRFx1MDQzMCBcdTA0M0VcdTA0M0RcdTA0M0VcdTA0MzJcdTA0M0JcdTA0NEVcdTA0MzJcdTA0MzBcdTA0NDJcdTA0MzggXHUwNDNGXHUwNDNFIFx1MDQzQ1x1MDQ1Nlx1MDQ0MVx1MDQ0Nlx1MDQ0Rlx1MDQ0NVxuXG4gIGZvciAoY29uc3QgcCBvZiBpdGVtcykge1xuICAgIGNvbnN0IHdyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHdyYXAuY2xhc3NOYW1lID0gXCJmb290ZXJfX2l0ZW1cIjtcbiAgICBjb25zdCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgIGltZy5kZWNvZGluZyA9IFwiYXN5bmNcIjtcbiAgICBpbWcuc3JjID0gcC5zcmM7XG4gICAgaW1nLmFsdCA9IHAuYWx0IHx8IFwiXCI7XG4gICAgd3JhcC5hcHBlbmRDaGlsZChpbWcpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh3cmFwKTtcbiAgfVxufVxuXG4vLyAtLS0gXHUwNDEwXHUwNDMyXHUwNDQyXHUwNDNFXHUwNDU2XHUwNDNEXHUwNDU2XHUwNDQ2XHUwNDU2XHUwNDMwXHUwNDNCXHUwNDU2XHUwNDM3XHUwNDMwXHUwNDQ2XHUwNDU2XHUwNDRGIC0tLVxuIGV4cG9ydCBmdW5jdGlvbiBpbml0UGF5bWVudHNPbmNlKCkge1xuICByZW5kZXJGb290ZXJQYXltZW50cyhkZXRlY3RMYW5nKCkpO1xufVxuXG4iLCAiaW1wb3J0IHtcbiAgaW5pdExhbmd1YWdlTWVudXMsXG4gIGRldGVjdExhbmcsXG4gIHNldExhbmcsXG4gIGtpbGxBbGxIb3ZlcnMsXG59IGZyb20gXCIuL2xhbmcuanNcIjtcbmltcG9ydCB7IGluaXRHYW1lIH0gZnJvbSBcIi4vZ2FtZS5qc1wiO1xuaW1wb3J0IHsgaW5pdFBvcHVwIH0gZnJvbSBcIi4vcG9wdXAuanNcIjtcbmltcG9ydCB7IHJlbmRlckZvb3RlclBheW1lbnRzLCBpbml0UGF5bWVudHNPbmNlIH0gZnJvbSBcIi4vcGF5bWVudC5qc1wiO1xuXG5mdW5jdGlvbiB3YWl0TmV4dEZyYW1lKCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHIpID0+IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiByKCkpKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gd2hlbkFsbFN0eWxlc0xvYWRlZCgpIHtcbiAgY29uc3QgbGlua3MgPSBbLi4uZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGlua1tyZWw9XCJzdHlsZXNoZWV0XCJdJyldO1xuXG4gIGF3YWl0IFByb21pc2UuYWxsKFxuICAgIGxpbmtzLm1hcChcbiAgICAgIChsaW5rKSA9PlxuICAgICAgICBuZXcgUHJvbWlzZSgocmVzKSA9PiB7XG4gICAgICAgICAgbGluay5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCByZXMsIHsgb25jZTogdHJ1ZSB9KTtcbiAgICAgICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCByZXMsIHsgb25jZTogdHJ1ZSB9KTtcbiAgICAgICAgICBzZXRUaW1lb3V0KHJlcywgMCk7XG4gICAgICAgIH0pXG4gICAgKVxuICApO1xuXG4gIGNvbnN0IHNhbWVPcmlnaW5TaGVldHMgPSBbLi4uZG9jdW1lbnQuc3R5bGVTaGVldHNdLmZpbHRlcigocykgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBocmVmID0gcy5ocmVmIHx8IFwiXCI7XG4gICAgICByZXR1cm4gKFxuICAgICAgICAhaHJlZiB8fCBocmVmLnN0YXJ0c1dpdGgobG9jYXRpb24ub3JpZ2luKSB8fCBocmVmLnN0YXJ0c1dpdGgoXCJmaWxlOlwiKVxuICAgICAgKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0pO1xuXG4gIGNvbnN0IHBvbGxPbmNlID0gKCkgPT4ge1xuICAgIGZvciAoY29uc3Qgc2hlZXQgb2Ygc2FtZU9yaWdpblNoZWV0cykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgXyA9IHNoZWV0LmNzc1J1bGVzO1xuICAgICAgfSBjYXRjaCAoZSkge31cbiAgICB9XG4gIH07XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICBwb2xsT25jZSgpO1xuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyKSA9PiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocikpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHdhaXRGb3JGb250cygpIHtcbiAgcmV0dXJuIFwiZm9udHNcIiBpbiBkb2N1bWVudCA/IGRvY3VtZW50LmZvbnRzLnJlYWR5IDogUHJvbWlzZS5yZXNvbHZlKCk7XG59XG5cbmZ1bmN0aW9uIHdhaXRJbWFnZXNJbihlbCkge1xuICBpZiAoIWVsKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIGNvbnN0IGltZ3MgPSBbLi4uZWwucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKV07XG4gIGNvbnN0IHByb21pc2VzID0gaW1ncy5tYXAoKGltZykgPT5cbiAgICBpbWcuY29tcGxldGVcbiAgICAgID8gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgIDogbmV3IFByb21pc2UoKHJlcykgPT4ge1xuICAgICAgICAgIGNvbnN0IGNiID0gKCkgPT4gcmVzKCk7XG4gICAgICAgICAgaW1nLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGNiLCB7IG9uY2U6IHRydWUgfSk7XG4gICAgICAgICAgaW1nLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCBjYiwgeyBvbmNlOiB0cnVlIH0pO1xuICAgICAgICB9KVxuICApO1xuICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBib290c3RyYXAoKSB7XG4gIGF3YWl0IHdoZW5BbGxTdHlsZXNMb2FkZWQoKTtcbiAgYXdhaXQgd2FpdEZvckZvbnRzKCk7XG5cbiAgaW5pdExhbmd1YWdlTWVudXMoKTtcbiAgc2V0TGFuZyhkZXRlY3RMYW5nKCkpO1xuICBpbml0UG9wdXAoKTtcblxuICBjb25zdCBnYW1lUm9vdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZVwiKTtcbiAgYXdhaXQgd2FpdEltYWdlc0luKGdhbWVSb290KTtcbiAgYXdhaXQgd2FpdENzc0JhY2tncm91bmRzKFtcIi5nYW1lXCIsIFwiLnBvcHVwX19kaWFsb2dcIl0pO1xuICBhd2FpdCB3YWl0TmV4dEZyYW1lKCk7XG5cbiAgLy8gXHVEODNEXHVERkUyIFx1MDQ0Mlx1MDQzOFx1MDQzQ1x1MDQ0N1x1MDQzMFx1MDQ0MVx1MDQzRVx1MDQzMlx1MDQzOFx1MDQzOSBcImRldiBoYWNrXCIgLSBcdTA0MzJcdTA0MzhcdTA0MzRcdTA0MzBcdTA0M0JcdTA0MzhcdTA0NDJcdTA0MzggXHUwNDNGXHUwNDM1XHUwNDQwXHUwNDM1XHUwNDM0IFx1MDQzMlx1MDQ1Nlx1MDQzNFx1MDQzNFx1MDQzMFx1MDQ0N1x1MDQzNVx1MDQ0RSBcdTA0M0RcdTA0MzAgXHUwNDNGXHUwNDQwXHUwNDNFXHUwNDM0XG4gIC8vIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZ2FtZS1zcHVuXCIsIFwiZmFsc2VcIik7XG5cbiAgLy8gXHUwNDEzXHUwNDQwXHUwNDMwOiBcdTA0M0ZcdTA0NDNcdTA0MzFcdTA0M0JcdTA0NTZcdTA0NDdcdTA0M0RcdTA0MzhcdTA0MzkgXHUwNDU2XHUwNDNEXHUwNDQyXHUwNDM1XHUwNDQwXHUwNDQ0XHUwNDM1XHUwNDM5XHUwNDQxIFx1MDQ1Nlx1MDQzRFx1MDQ1Nlx1MDQ0Nlx1MDQ1Nlx1MDQzMFx1MDQzQlx1MDQ1Nlx1MDQzN1x1MDQzMFx1MDQ0Nlx1MDQ1Nlx1MDQ1Ny5cbiAgLy8gXHUwNDE0XHUwNDM1XHUwNDQyXHUwNDMwXHUwNDNCXHUwNDU2IFx1MDQ0MFx1MDQzNVx1MDQzMFx1MDQzQlx1MDQ1Nlx1MDQzN1x1MDQzMFx1MDQ0Nlx1MDQ1Nlx1MDQ1NyBcdTA0M0ZcdTA0NDBcdTA0MzhcdTA0NDVcdTA0M0VcdTA0MzJcdTA0MzBcdTA0M0RcdTA0NTYgXHUwNDMyIFx1MDQzQ1x1MDQzRVx1MDQzNFx1MDQ0M1x1MDQzQlx1MDQ1NiBgZ2FtZS5qc2AuXG4gIC8vIFx1MDQ0NFx1MDQ0M1x1MDQzRFx1MDQzQVx1MDQ0Nlx1MDQ1Nlx1MDQ0RiBcdTA0NTZcdTA0M0RcdTA0NTZcdTA0NDZcdTA0NTZcdTA0MzBcdTA0M0JcdTA0NTZcdTA0MzdcdTA0MzBcdTA0NDZcdTA0NTZcdTA0NTcgXHUwNDMzXHUwNDQwXHUwNDM4IFx1MDQ1NiBcdTA0NTdcdTA0NTcgXHUwNDM3XHUwNDMwXHUwNDNGXHUwNDQzXHUwNDQxXHUwNDNBXHUwNDQzLCBcdTA0NTZcdTA0M0NcdTA0M0ZcdTA0M0VcdTA0NDBcdTA0NDJcdTA0NDNcdTA0NTRcdTA0NDJcdTA0NENcdTA0NDFcdTA0NEYgXHUwNDM3XHUwNDNFXHUwNDMyXHUwNDNEXHUwNDU2LCBcdTA0NDlcdTA0M0UgXHUwNDMyIFx1MDQzRFx1MDQzNVx1MDQ1NyBcdTA0NDJcdTA0MzBcdTA0M0MgXHUwNDMyXHUwNDQxXHUwNDM1XHUwNDQwXHUwNDM1XHUwNDM0XHUwNDM4XHUwNDNEXHUwNDU2IFx1MDQzRlx1MDQzRSBcdTA0MzFcdTA0MzBcdTA0NDBcdTA0MzBcdTA0MzFcdTA0MzBcdTA0M0RcdTA0NDNcbiAgaW5pdEdhbWUoKTtcblxuICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImFwcC1wcmVwYXJpbmdcIik7XG4gIGtpbGxBbGxIb3ZlcnMoKTtcbn1cblxuYm9vdHN0cmFwKCkuY2F0Y2goY29uc29sZS5lcnJvcik7XG5cbmZ1bmN0aW9uIHBhcnNlQ3NzVXJscyh2YWx1ZSkge1xuICBjb25zdCB1cmxzID0gW107XG4gIHZhbHVlLnJlcGxhY2UoL3VybFxcKChbXildKylcXCkvZywgKF8sIHJhdykgPT4ge1xuICAgIGNvbnN0IHUgPSByYXcudHJpbSgpLnJlcGxhY2UoL15bJ1wiXXxbJ1wiXSQvZywgXCJcIik7XG4gICAgaWYgKHUgJiYgdSAhPT0gXCJhYm91dDpibGFua1wiKSB1cmxzLnB1c2godSk7XG4gIH0pO1xuICByZXR1cm4gdXJscztcbn1cblxuZnVuY3Rpb24gd2FpdENzc0JhY2tncm91bmRzKHNlbGVjdG9ycykge1xuICBjb25zdCB1cmxzID0gbmV3IFNldCgpO1xuICBmb3IgKGNvbnN0IHNlbCBvZiBzZWxlY3RvcnMpIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgIGNvbnN0IGJnID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCkuZ2V0UHJvcGVydHlWYWx1ZShcImJhY2tncm91bmQtaW1hZ2VcIik7XG4gICAgICBwYXJzZUNzc1VybHMoYmcpLmZvckVhY2goKHUpID0+IHVybHMuYWRkKHUpKTtcbiAgICB9KTtcbiAgfVxuICBpZiAodXJscy5zaXplID09PSAwKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIGNvbnN0IHRhc2tzID0gWy4uLnVybHNdLm1hcChcbiAgICAoc3JjKSA9PlxuICAgICAgbmV3IFByb21pc2UoKHJlcykgPT4ge1xuICAgICAgICBjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgaW1nLm9ubG9hZCA9IGltZy5vbmVycm9yID0gKCkgPT4gcmVzKCk7XG4gICAgICAgIGltZy5zcmMgPSBzcmM7XG4gICAgICB9KSBcbiAgKTtcbiAgcmV0dXJuIFByb21pc2UuYWxsKHRhc2tzKTtcbn1cblxuaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwibG9hZGluZ1wiKSB7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGluaXRQYXltZW50c09uY2UsIHtcbiAgICBvbmNlOiB0cnVlLFxuICB9KTtcbn0gZWxzZSB7XG4gIGluaXRQYXltZW50c09uY2UoKTtcbn1cblxuLy8gXHUwNDNFXHUwNDNEXHUwNDNFXHUwNDMyXHUwNDNCXHUwNDRFXHUwNDU0XHUwNDNDXHUwNDNFIFx1MDQzRFx1MDQzMCBcdTA0M0FcdTA0M0VcdTA0MzZcdTA0M0RcdTA0NDMgXHUwNDM3XHUwNDNDXHUwNDU2XHUwNDNEXHUwNDQzIFx1MDQzQ1x1MDQzRVx1MDQzMlx1MDQzOCBcdTA0MzcgbGFuZy5qc1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsYW5nY2hhbmdlXCIsIChlKSA9PiB7XG4gIGNvbnN0IGxhbmcgPSBlPy5kZXRhaWw/LmxhbmcgfHwgZGV0ZWN0TGFuZygpO1xuICByZW5kZXJGb290ZXJQYXltZW50cyhsYW5nKTtcbn0pO1xuXG4oZnVuY3Rpb24gKCkge1xuICB2YXIgdXJsID0gbmV3IFVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG4gIGlmICh1cmwuc2VhcmNoUGFyYW1zLmhhcyhcInJlZGlyZWN0VXJsXCIpKSB7XG4gICAgdmFyIHJlZGlyZWN0VXJsID0gbmV3IFVSTCh1cmwuc2VhcmNoUGFyYW1zLmdldChcInJlZGlyZWN0VXJsXCIpKTtcbiAgICBpZiAoXG4gICAgICByZWRpcmVjdFVybC5ocmVmLm1hdGNoKC9cXC8vZykubGVuZ3RoID09PSA0ICYmXG4gICAgICByZWRpcmVjdFVybC5zZWFyY2hQYXJhbXMuZ2V0KFwibFwiKVxuICAgICkge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJyZWRpcmVjdFVybFwiLCByZWRpcmVjdFVybC5ocmVmKTtcbiAgICB9XG4gIH1cbiAgdmFyIHBhcmFtcyA9IFtcbiAgICBcImxcIixcbiAgICBcInV0bV9zb3VyY2VcIixcbiAgICBcInV0bV9tZWRpdW1cIixcbiAgICBcInV0bV9jYW1wYWlnblwiLFxuICAgIFwidXRtX3Rlcm1cIixcbiAgICBcInV0bV9jb250ZW50XCIsXG4gICAgXCJwYXJhbTFcIixcbiAgICBcInBhcmFtMlwiLFxuICBdO1xuICB2YXIgbGlua1BhcmFtcyA9IFtcImFmZmlkXCIsIFwiY3BhaWRcIl07XG4gIHBhcmFtcy5mb3JFYWNoKGZ1bmN0aW9uIChwYXJhbSkge1xuICAgIGlmICh1cmwuc2VhcmNoUGFyYW1zLmhhcyhwYXJhbSkpXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShwYXJhbSwgdXJsLnNlYXJjaFBhcmFtcy5nZXQocGFyYW0pKTtcbiAgfSk7XG4gIGxpbmtQYXJhbXMuZm9yRWFjaChmdW5jdGlvbiAobGlua1BhcmFtKSB7XG4gICAgaWYgKHVybC5zZWFyY2hQYXJhbXMuaGFzKGxpbmtQYXJhbSkpXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShsaW5rUGFyYW0sIHVybC5zZWFyY2hQYXJhbXMuZ2V0KGxpbmtQYXJhbSkpO1xuICB9KTtcbn0pKCk7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XG4gIHZhciB0LFxuICAgIG8sXG4gICAgY3BhaWQsXG4gICAgciA9IGUudGFyZ2V0LmNsb3Nlc3QoXCJhXCIpO1xuICByICYmXG4gICAgXCJodHRwczovL3Rkcy5jbGFwcy5jb21cIiA9PT0gci5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpICYmXG4gICAgKGUucHJldmVudERlZmF1bHQoKSxcbiAgICAobyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWZmaWRcIikpLFxuICAgIChjcGFpZCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiY3BhaWRcIikpLFxuICAgIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicmVkaXJlY3RVcmxcIilcbiAgICAgID8gKHQgPSBuZXcgVVJMKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicmVkaXJlY3RVcmxcIikpKVxuICAgICAgOiAoKHQgPSBuZXcgVVJMKHIuaHJlZikpLFxuICAgICAgICBvICYmIGNwYWlkICYmICh0LnBhdGhuYW1lID0gXCIvXCIgKyBvICsgXCIvXCIgKyBjcGFpZCkpLFxuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbiA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuICAgICAgdmFyIGEgPSBbXG4gICAgICAgIFwibFwiLFxuICAgICAgICBcInV0bV9zb3VyY2VcIixcbiAgICAgICAgXCJ1dG1fbWVkaXVtXCIsXG4gICAgICAgIFwidXRtX2NhbXBhaWduXCIsXG4gICAgICAgIFwidXRtX3Rlcm1cIixcbiAgICAgICAgXCJ1dG1fY29udGVudFwiLFxuICAgICAgICBcInBhcmFtMVwiLFxuICAgICAgICBcInBhcmFtMlwiLFxuICAgICAgICBcImFmZmlkXCIsXG4gICAgICAgIFwiY3BhaWRcIixcbiAgICAgIF07XG4gICAgICBhLmZvckVhY2goZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgbi5zZWFyY2hQYXJhbXMuaGFzKGUpICYmIHQuc2VhcmNoUGFyYW1zLnNldChlLCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShlKSk7XG4gICAgICB9KTtcbiAgICB9KSgpLFxuICAgIChkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gdCkpO1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiOztBQUFBLE1BQU0sV0FBVztBQUNqQixNQUFNLFlBQVksQ0FBQyxPQUFPLE9BQU8sT0FBTyxPQUFPLE9BQU8sT0FBTyxLQUFLO0FBQ2xFLE1BQU0sbUJBQW1CO0FBQUEsSUFDdkIsUUFBUTtBQUFBO0FBQUEsSUFDUixjQUFjO0FBQUE7QUFBQSxJQUNkLFVBQVU7QUFBQTtBQUFBLElBQ1YsT0FBTztBQUFBO0FBQUEsRUFDVDtBQUVBLE1BQU0sWUFBWTtBQUFBLElBQ2hCLEtBQUs7QUFBQSxJQUNMLEtBQUs7QUFBQSxJQUNMLEtBQUs7QUFBQSxJQUNMLEtBQUs7QUFBQSxJQUNMLEtBQUs7QUFBQSxJQUNMLEtBQUs7QUFBQSxJQUNMLEtBQUs7QUFBQSxFQUNQO0FBRUEsTUFBTSxlQUFlO0FBQUEsSUFDbkIsS0FBSztBQUFBLE1BQ0gsT0FBTztBQUFBLE1BQ1Asd0JBQXdCO0FBQUEsTUFDeEIsa0JBQWtCO0FBQUEsTUFDbEIsa0JBQWtCO0FBQUEsTUFDbEIsaUJBQWlCO0FBQUEsTUFDakIsaUJBQWlCO0FBQUEsTUFDakIsdUJBQXVC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LEVBQUUsV0FBVyxLQUN6QyxZQUFZLGFBQWEsSUFBSSxHQUFHLEdBQ2hDO0FBQ0EscUJBQWEsUUFBUSxlQUFlLFlBQVksSUFBSTtBQUFBLE1BQ3REO0FBQUEsSUFDRjtBQUNBLFFBQUksU0FBUztBQUFBLE1BQ1g7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUNBLFFBQUksYUFBYSxDQUFDLFNBQVMsT0FBTztBQUNsQyxXQUFPLFFBQVEsU0FBVSxPQUFPO0FBQzlCLFVBQUksSUFBSSxhQUFhLElBQUksS0FBSztBQUM1QixxQkFBYSxRQUFRLE9BQU8sSUFBSSxhQUFhLElBQUksS0FBSyxDQUFDO0FBQUEsSUFDM0QsQ0FBQztBQUNELGVBQVcsUUFBUSxTQUFVLFdBQVc7QUFDdEMsVUFBSSxJQUFJLGFBQWEsSUFBSSxTQUFTO0FBQ2hDLHFCQUFhLFFBQVEsV0FBVyxJQUFJLGFBQWEsSUFBSSxTQUFTLENBQUM7QUFBQSxJQUNuRSxDQUFDO0FBQUEsRUFDSCxHQUFHO0FBQ0gsU0FBTyxpQkFBaUIsU0FBUyxTQUFVLEdBQUc7QUFDNUMsUUFBSSxHQUNGLEdBQ0EsT0FDQSxJQUFJLEVBQUUsT0FBTyxRQUFRLEdBQUc7QUFDMUIsU0FDRSw0QkFBNEIsRUFBRSxhQUFhLE1BQU0sTUFDaEQsRUFBRSxlQUFlLEdBQ2pCLElBQUksYUFBYSxRQUFRLE9BQU8sR0FDaEMsUUFBUSxhQUFhLFFBQVEsT0FBTyxHQUNyQyxhQUFhLFFBQVEsYUFBYSxJQUM3QixJQUFJLElBQUksSUFBSSxhQUFhLFFBQVEsYUFBYSxDQUFDLEtBQzlDLElBQUksSUFBSSxJQUFJLEVBQUUsSUFBSSxHQUNwQixLQUFLLFVBQVUsRUFBRSxXQUFXLE1BQU0sSUFBSSxNQUFNLFVBQy9DLFdBQVk7QUFDWCxVQUFJLElBQUksSUFBSSxJQUFJLE9BQU8sU0FBUyxJQUFJO0FBQ3BDLFVBQUksSUFBSTtBQUFBLFFBQ047QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQ0EsUUFBRSxRQUFRLFNBQVVDLElBQUc7QUFDckIsVUFBRSxhQUFhLElBQUlBLEVBQUMsS0FBSyxFQUFFLGFBQWEsSUFBSUEsSUFBRyxhQUFhLFFBQVFBLEVBQUMsQ0FBQztBQUFBLE1BQ3hFLENBQUM7QUFBQSxJQUNILEdBQUcsR0FDRixTQUFTLFNBQVMsT0FBTztBQUFBLEVBQzlCLENBQUM7IiwKICAibmFtZXMiOiBbIl9hIiwgIl9iIiwgIm1heERpYWciLCAiZSJdCn0K
