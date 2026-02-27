(function () {
  document.documentElement.classList.add("js-enabled");
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector("[data-menu-button]");
  const menuPanel = document.querySelector("[data-menu-panel]");
  const supportsWebp = (function () {
    let cached = null;
    return function () {
      if (typeof cached === "boolean") return cached;
      try {
        const canvas = document.createElement("canvas");
        cached =
          canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
      } catch (_error) {
        cached = false;
      }
      return cached;
    };
  })();

  function updateHeaderState() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  function setupMenu() {
    if (!menuButton || !menuPanel) return;

    menuButton.addEventListener("click", function () {
      const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isExpanded));
      menuPanel.classList.toggle("is-open", !isExpanded);
    });

    menuPanel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menuButton.setAttribute("aria-expanded", "false");
        menuPanel.classList.remove("is-open");
      });
    });
  }

  function setupReveal() {
    const targets = document.querySelectorAll("[data-reveal]");
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (target) {
        target.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    targets.forEach(function (target) {
      observer.observe(target);
    });
  }

  function setupCurrentYear() {
    const currentYear = String(new Date().getFullYear());
    document.querySelectorAll("[data-current-year]").forEach(function (el) {
      el.textContent = currentYear;
    });
  }

  function setupWhatsappForms() {
    const forms = document.querySelectorAll("form[data-whatsapp-form]");
    if (!forms.length) return;

    forms.forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!form.reportValidity()) return;

        const phone = form.dataset.phone || "5512991420566";
        const intro =
          form.dataset.message ||
          "Ola, gostaria de mais informacoes comerciais.";
        const fields = Array.from(
          form.querySelectorAll("input, select, textarea")
        );

        const lines = fields
          .map(function (field) {
            const label = field.dataset.label;
            if (!label) return "";

            if (
              (field.type === "checkbox" || field.type === "radio") &&
              !field.checked
            ) {
              return "";
            }

            const value = field.value ? field.value.trim() : "";
            if (!value) return "";
            return label + ": " + value;
          })
          .filter(Boolean);

        const text = [intro, "", ...lines].join("\n");
        const url = "https://wa.me/" + phone + "?text=" + encodeURIComponent(text);
        window.open(url, "_blank", "noopener");
      });
    });
  }

  function setupLazyMedia() {
    const lazyMedia = document.querySelectorAll("img[data-lazy-media]");
    if (!lazyMedia.length) return;

    const loadMedia = function (img) {
      if (img.dataset.mediaReady === "true") return;
      img.dataset.mediaReady = "true";

      const markLoaded = function () {
        img.classList.add("is-loaded");
      };

      if (img.complete && img.naturalWidth > 0) {
        markLoaded();
        return;
      }

      img.addEventListener("load", markLoaded, { once: true });
      img.addEventListener("error", markLoaded, { once: true });
    };

    if (!("IntersectionObserver" in window)) {
      lazyMedia.forEach(function (img) {
        loadMedia(img);
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          loadMedia(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "220px 0px", threshold: 0.01 }
    );

    lazyMedia.forEach(function (img) {
      observer.observe(img);
    });
  }

  function setupFactoryCarousel() {
    const tracks = document.querySelectorAll("[data-factory-track]");
    if (!tracks.length) return;

    tracks.forEach(function (track) {
      if (track.dataset.ready === "true") return;
      track.dataset.ready = "true";

      const count = Number(track.dataset.count || "0");
      const folder = track.dataset.folder || "assets/img";
      const prefix = track.dataset.prefix || "fabrica_";
      const requestedExt = track.dataset.ext || ".jpg";
      const fallbackExt = track.dataset.fallbackExt || ".jpg";
      const ext =
        requestedExt === ".webp" && !supportsWebp() ? fallbackExt : requestedExt;
      const duration = Number(track.dataset.duration || "88");

      if (!count) return;
      track.style.setProperty("--carousel-duration", duration + "s");

      const imageNodes = [];
      const fragment = document.createDocumentFragment();

      for (let loop = 0; loop < 2; loop += 1) {
        for (let index = 1; index <= count; index += 1) {
          const figure = document.createElement("figure");
          figure.className = "factory-item";
          if (loop > 0) {
            figure.setAttribute("aria-hidden", "true");
          }

          const img = document.createElement("img");
          img.src = folder + "/" + prefix + index + ext;
          img.alt = "Estrutura industrial da Calegari Malhas - foto " + index;
          img.loading = loop === 0 && index <= 6 ? "eager" : "lazy";
          img.decoding = "async";
          img.setAttribute(
            "fetchpriority",
            loop === 0 && index <= 4 ? "high" : "low"
          );
          img.width = 640;
          img.height = 480;
          if (requestedExt === ".webp" && ext === ".webp" && fallbackExt) {
            img.addEventListener(
              "error",
              function () {
                img.src = folder + "/" + prefix + index + fallbackExt;
              },
              { once: true }
            );
          }

          figure.appendChild(img);
          fragment.appendChild(figure);
          imageNodes.push(img);
        }
      }

      track.appendChild(fragment);

      const updateDistance = function () {
        const fullWidth = track.scrollWidth;
        if (!fullWidth) return;
        track.style.setProperty("--carousel-distance", "-" + fullWidth / 2 + "px");
      };

      const restartAnimation = function () {
        track.style.animation = "none";
        track.offsetHeight;
        track.style.animation = "";
      };

      updateDistance();
      requestAnimationFrame(updateDistance);
      requestAnimationFrame(restartAnimation);

      window.addEventListener("resize", updateDistance, { passive: true });
      window.addEventListener("load", updateDistance, { once: true });
      imageNodes.forEach(function (img) {
        img.addEventListener("load", updateDistance, { once: true });
      });
    });
  }

  function setupPwaInstall() {
    const installButtons = document.querySelectorAll("[data-pwa-install]");
    if (!installButtons.length) return;

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    if (isStandalone) return;

    let deferredPrompt = null;

    const updateInstallVisibility = function (isVisible) {
      installButtons.forEach(function (button) {
        button.hidden = !isVisible;
      });
    };

    updateInstallVisibility(false);

    window.addEventListener("beforeinstallprompt", function (event) {
      event.preventDefault();
      deferredPrompt = event;
      updateInstallVisibility(true);
      console.info("[PWA] Instalacao disponivel para este dispositivo.");
    });

    installButtons.forEach(function (button) {
      button.addEventListener("click", async function () {
        if (!deferredPrompt) {
          console.info("[PWA] Prompt de instalacao indisponivel no momento.");
          return;
        }

        try {
          button.disabled = true;
          deferredPrompt.prompt();
          const choiceResult = await deferredPrompt.userChoice;
          console.info("[PWA] Resultado da instalacao:", choiceResult.outcome);
        } catch (error) {
          console.error("[PWA] Erro ao abrir prompt de instalacao:", error);
        } finally {
          deferredPrompt = null;
          updateInstallVisibility(false);
          button.disabled = false;
        }
      });
    });

    window.addEventListener("appinstalled", function () {
      deferredPrompt = null;
      updateInstallVisibility(false);
      console.info("[PWA] App instalado com sucesso.");
    });
  }

  function setupServiceWorker() {
    if (!("serviceWorker" in navigator)) {
      console.info("[PWA] Service Worker nao suportado neste navegador.");
      return;
    }

    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register("sw.js")
        .then(function (registration) {
          console.info("[PWA] Service Worker registrado em:", registration.scope);
          registration.addEventListener("updatefound", function () {
            console.info("[PWA] Atualizacao do Service Worker detectada.");
          });
        })
        .catch(function (error) {
          console.error("[PWA] Falha ao registrar Service Worker:", error);
        });
    });
  }

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
  setupMenu();
  setupReveal();
  setupCurrentYear();
  setupWhatsappForms();
  setupFactoryCarousel();
  setupLazyMedia();
  setupPwaInstall();
  setupServiceWorker();
})();
