/**
 * Публічний API гри.
 */
export function initGame() {
const btn = document.querySelector(".mainContent__btn");
  const game = document.querySelector(".game");
  const popup = document.getElementById("popup");

  if (!btn || !game || !popup) return;

  // Константи під твою сітку
  const VISIBLE_ROWS = 5;
  const COLUMNS = 6;
  const GAP_MS = 50; // відповідає --gap
  const DROP_MS = 3000; // відповідає --drop-dur
  const maxDiag = COLUMNS - 1 + (VISIBLE_ROWS - 1);

  // СИМВОЛИ (приклад). Підстав свій набір / айді потрібної виграшної комбінації:
  const SYMBOLS = {
    1: {
      src: "./img/mainContainer/gameImg_1_1x.webp",
      src2x: "./img/mainContainer/gameImg_1_2x.webp",
    },
    2: {
      src: "./img/mainContainer/gameImg_2_1x.webp",
      src2x: "./img/mainContainer/gameImg_2_2x.webp",
    },
    3: {
      src: "./img/mainContainer/gameImg_3_1x.webp",
      src2x: "./img/mainContainer/gameImg_3_2x.webp",
    },
    4: {
      src: "./img/mainContainer/gameImg_4_1x.webp",
      src2x: "./img/mainContainer/gameImg_4_2x.webp",
    },
    5: {
      src: "./img/mainContainer/gameImg_5_1x.webp",
      src2x: "./img/mainContainer/gameImg_5_2x.webp",
    },
    6: {
      src: "./img/mainContainer/gameImg_6_1x.webp",
      src2x: "./img/mainContainer/gameImg_6_2x.webp",
    },
    7: {
      src: "./img/mainContainer/gameImg_7_1x.webp",
      src2x: "./img/mainContainer/gameImg_7_2x.webp",
    },
    8: {
      src: "./img/mainContainer/gameImg_8_1x.webp",
      src2x: "./img/mainContainer/gameImg_8_2x.webp",
    },
    9: {
      src: "./img/mainContainer/gameImg_9_1x.webp",
      src2x: "./img/mainContainer/gameImg_9_2x.webp",
    },
  };

  // ВИГРАШНА СІТКА: для кожної колонки 5 символів (top -> bottom), які МАЮТЬ ЗАЛИШИТИСЬ у полі
  // ПІДСТАВ свої ID тут:
  const WIN_GRID = [
    [9, 5, 4, 5, 7],
    [1, 2, 2, 5, 3],
    [4, 2, 7, 1, 5],
    [8, 2, 1, 3, 4],
    [2, 2, 4, 8, 6],
    [1, 5, 9, 7, 1],
  ];

  // Хелпери
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

  // 1) Тегуємо ПОРЯДОК для початкових картинок і запускаємо їхнє падіння (drop)
  function dropInitialGrid() {
    game.classList.add("is-spinning");
    // виставляємо --order за формулою (колонка + позиція віднизу)
    getColumns().forEach((col, cIdx) => {
      const imgs = Array.from(col.querySelectorAll(".game__colImg"));
      const rows = imgs.length; // 5
      imgs.forEach((img, rTop) => {
        const fromBottom = rows - 1 - rTop;
        img.style.setProperty("--order", cIdx + fromBottom);
        img.classList.add("drop");
      });
    });
  }

  // 2) ДОЩ: створюємо рівно 5 нових картинок у КОЖНІЙ колонці (win-grid), що падають ЗГОРИ у поле і ЗАЛИШАЮТЬСЯ там
  let rainStarted = false;
  function ensureOverlay(colEl) {
    // шукаємо чи вже є оверлей
    let overlay = colEl.querySelector(".game__colOverlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "game__colOverlay";
      colEl.appendChild(overlay); // ПОВЕРХ колонки, але не впливає на її флоу
    }
    return overlay;
  }

  function startRainOnce(winGrid) {
    if (rainStarted) return;
    rainStarted = true;

    const maxDiag = COLUMNS - 1 + (VISIBLE_ROWS - 1);
    let lastRainImg = null;

    const cols = Array.from(game.querySelectorAll(".game__col"));
    cols.forEach((col, cIdx) => {
      const overlay = ensureOverlay(col);
      // Очищаємо оверлей на всяк випадок (разовий сценарій, але хай буде)
      overlay.innerHTML = "";

      // створюємо рівно 5 нових картинок, які стануть у видимі слоти (top->bottom)
      const frag = document.createDocumentFragment();
      for (let rTop = 0; rTop < VISIBLE_ROWS; rTop++) {
        const symId = winGrid[cIdx][rTop];
        const { picture, img } = createImgEl(symId);

        // Порядок каскаду «з нижнього лівого»:
        const fromBottom = VISIBLE_ROWS - 1 - rTop; // 4..0
        const order = cIdx + fromBottom;

        img.style.setProperty("--order", order);
        img.classList.add("rain-in");
        img.style.opacity = "0"; // страховка від мікро-блиму до застосування CSS

        if (order === maxDiag) lastRainImg = img;

        frag.appendChild(picture);
      }
      overlay.appendChild(frag);
    });

    // Коли відпрацює останній rain-елемент — попап і лок
    if (lastRainImg) {
      lastRainImg.addEventListener(
        "animationend",
        () => {
          triggerExplosions(winGrid).then(
            // openPopupAndLock
            setTimeout(() => {
              // openPopupAndLock();
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
        parseFloat(getComputedStyle(game).getPropertyValue("--drop-dur")) *
          1000 || 350
      );
    }
  }

  function triggerExplosions(winGrid) {
    // Повертаємо проміс, який виконається, коли ВСІ вибухи (включно з появою «boom») закінчаться
    return new Promise((resolve) => {
      const overlays = getColumns().map((col) =>
        col.querySelector(".game__colOverlay")
      );
      const targets = [];

      // знаходимо елементи-цілі (де у WIN_GRID == 2)
      for (let c = 0; c < COLUMNS; c++) {
        const overlay = overlays[c];
        if (!overlay) continue;

        // порядок у overlay: top..bottom = індекси 0..VISIBLE_ROWS-1
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
        // якщо «двійок» немає — нічого вибухати
        resolve();
        return;
      }

      let finished = 0;
      const total = targets.length;

      targets.forEach((img) => {
        // важливо: зняти можливий rain-клас, щоб не було накладки анімацій
        img.classList.remove("rain-in");

        // випадковий «хоп» 1–3px
        const hop = Math.floor(1 + Math.random() * 3);
        img.style.setProperty("--hop", hop + "px");

        // коли закінчиться «explode» — замінимо на спрайт вибуху і програємо boomAppear
        img.addEventListener(
          "animationend",
          function onExplodeEnd(e) {
            if (e.animationName !== "explode") return;

            // підміна картинки на спрайт вибуху
            const boomSrc1x = "./img/mainContainer/gameImg_win_1x.webp";
            const boomSrc2x = "./img/mainContainer/gameImg_win_2x.webp";

            // у нас structure <picture><source/><img/></picture>
            const picture = img.parentElement;
            const source = picture.querySelector("source");

            if (source) source.srcset = `${boomSrc1x} 1x, ${boomSrc2x} 2x`;
            img.src = boomSrc1x;

            // приберемо класи вибуху і дамо «появу» спрайту
            img.classList.remove("explode");
            img.classList.add("boom");

            // коли «boomAppear» закінчиться — рахуємо завершення
            img.addEventListener("animationend", function onBoomEnd(ev) {
              if (ev.animationName !== "boomAppear") return;
              img.removeEventListener("animationend", onBoomEnd);

              finished++;
              if (finished === total) resolve();
            });
          },
          { once: true }
        );

        // стартуємо «explode»
        img.classList.add("explode");
      });
    });
  }

  function openPopupAndLock() {
    // Блокуємо назавжди
    btn.classList.add("is-locked");
    btn.disabled = true;
    btn.setAttribute("aria-disabled", "true");
    btn.setAttribute("aria-busy", "true");

    // Попап: знімаємо aria-hidden і додаємо .is-open під твої стилі
    popup.classList.add("is-open");
    popup.setAttribute("aria-hidden", "false");

    // (опційно) прибираємо стан гри
    game.classList.remove("is-spinning");
  }

  // 3) Основний сценарій: ОДНА хвиля drop + ОДНА хвиля rain-in
  function spinOnceToWin(winGrid) {
    if (btn.classList.contains("is-locked") || btn.disabled) return;

    btn.disabled = true;
    dropInitialGrid();

    // Запускаємо ДОЩ рівно в той момент, коли ПОЧНУТЬ падати верхньо-праві (останній крок діагоналі):
    // це станеться через GAP_MS * maxDiag від старту drop
    setTimeout(() => startRainOnce(winGrid), GAP_MS * maxDiag);
  }

  btn.addEventListener("click", () => spinOnceToWin(WIN_GRID));

  // 4) Якщо вже крутили — одразу сигналізуємо (без залежності від popup.js)
  if (localStorage.getItem("game-spun") === "true") {
    btn?.setAttribute("aria-disabled", "true");
    btn?.setAttribute("disabled", "");
    requestAnimationFrame(() =>
      document.dispatchEvent(new CustomEvent("slot:bigwin"))
    );
  }
}

