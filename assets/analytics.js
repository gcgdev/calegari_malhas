(function () {
  "use strict";

  // EDITAVEL ANALYTICS:
  // Preencha os IDs/labels reais para ativar o rastreamento em produção.
  var cfg = window.CALEGARI_ANALYTICS || {
    ga4Id: "G-XXXXXXXXXX",
    adsId: "AW-XXXXXXXXXX",
    adsConversions: {
      whatsapp_click: "AW-XXXXXXXXXX/WHATSAPP_CLICK_LABEL",
      quote_submit: "AW-XXXXXXXXXX/QUOTE_SUBMIT_LABEL",
    },
    enableApiForward: false,
    apiEndpoint: "/api/analytics/events",
  };

  function isValidId(value, prefix) {
    return (
      typeof value === "string" &&
      value.trim().length > prefix.length &&
      value.indexOf(prefix) === 0 &&
      value.indexOf("X") === -1
    );
  }

  function getAttribution() {
    var url = new URL(window.location.href);
    var keys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "gclid",
      "gbraid",
      "wbraid",
    ];
    var out = {};

    keys.forEach(function (key) {
      var val = url.searchParams.get(key);
      if (val) out[key] = val;
    });

    if (Object.keys(out).length) {
      try {
        sessionStorage.setItem("calegari_attribution", JSON.stringify(out));
      } catch (_err) {
        // ignore storage failures
      }
      return out;
    }

    try {
      var stored = sessionStorage.getItem("calegari_attribution");
      if (stored) return JSON.parse(stored);
    } catch (_err) {
      // ignore storage failures
    }

    return {};
  }

  function ensureGtagLoaded(primaryId) {
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtag() {
        window.dataLayer.push(arguments);
      };

    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(primaryId);
    document.head.appendChild(s);
  }

  var hasGa4 = isValidId(cfg.ga4Id, "G-");
  var hasAds = isValidId(cfg.adsId, "AW-");
  var primaryId = cfg.ga4Id || cfg.adsId;

  if (!primaryId || (!hasGa4 && !hasAds)) {
    return;
  }

  ensureGtagLoaded(primaryId);
  window.gtag("js", new Date());

  if (hasGa4) {
    window.gtag("config", cfg.ga4Id, {
      anonymize_ip: true,
      send_page_view: false,
    });
  }

  if (hasAds) {
    window.gtag("config", cfg.adsId);
  }

  function track(eventName, params) {
    var payload = Object.assign({}, params || {}, getAttribution());
    window.gtag("event", eventName, payload);

    if (cfg.enableApiForward && cfg.apiEndpoint) {
      try {
        var body = JSON.stringify({
          event: eventName,
          url: window.location.href,
          referrer: document.referrer || "",
          ts: new Date().toISOString(),
          payload: payload,
        });
        if (navigator.sendBeacon) {
          navigator.sendBeacon(
            cfg.apiEndpoint,
            new Blob([body], { type: "application/json" })
          );
        } else {
          fetch(cfg.apiEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: body,
            keepalive: true,
          }).catch(function () {});
        }
      } catch (_err) {
        // ignore API forwarding failures
      }
    }
  }

  function trackAdsConversion(labelKey) {
    if (!hasAds || !cfg.adsConversions) return;
    var sendTo = cfg.adsConversions[labelKey];
    if (!sendTo || sendTo.indexOf("X") !== -1) return;
    window.gtag("event", "conversion", { send_to: sendTo });
  }

  track("page_view", {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname + window.location.search,
  });

  document.addEventListener(
    "click",
    function (event) {
      var target = event.target.closest("a[href*='wa.me']");
      if (!target) return;

      track("click_whatsapp", {
        link_url: target.href,
        link_text: (target.textContent || "").trim().slice(0, 120),
        location_path: window.location.pathname,
      });
      trackAdsConversion("whatsapp_click");
    },
    { passive: true }
  );

  document.querySelectorAll("form[data-whatsapp-form]").forEach(function (form) {
    form.addEventListener(
      "submit",
      function () {
        track("generate_lead", {
          method: "whatsapp_form",
          location_path: window.location.pathname,
          form_id: form.id || "quote-form",
        });
        trackAdsConversion("quote_submit");
      },
      { capture: true }
    );
  });
})();
