(function () {
  "use strict";

  const IMAGE_ENDPOINT = "https://pixabay.com/api/";
  const VIDEO_ENDPOINT = "https://pixabay.com/api/videos/";

  const CHALLENGES = {
    rocket: {
      endpoint: VIDEO_ENDPOINT,
      params: {
        q: "Rocket Launch",
        category: "science",
        editors_choice: "true",
        per_page: "6",
      },
      kind: "video",
      label: "Rocket Launch",
    },
    basketball: {
      endpoint: VIDEO_ENDPOINT,
      params: {
        q: "Basketball",
        category: "sports",
        order: "latest",
        per_page: "6",
      },
      kind: "video",
      label: "Basketball",
    },
    forest: {
      endpoint: VIDEO_ENDPOINT,
      params: {
        q: "Forest",
        category: "background",
        editors_choice: "true",
        order: "latest",
        per_page: "6",
      },
      kind: "video",
      label: "Forest",
    },
    roadForest: {
      endpoint: IMAGE_ENDPOINT,
      params: {
        q: "Road Forest",
        image_type: "photo",
        category: "nature",
        editors_choice: "true",
        per_page: "6",
      },
      kind: "photo",
      label: "Road Forest",
    },
  };

  const form = document.getElementById("search-form");
  const searchInput = document.getElementById("search-term");
  const mediaTypeSelect = document.getElementById("media-type");
  const viewModeSelect = document.getElementById("view-mode");
  const statusEl = document.getElementById("status");
  const resultsEl = document.getElementById("results");
  const challengeButtons = document.querySelectorAll("[data-challenge]");

  function applyView(view) {
    resultsEl.dataset.view = view || "gallery";
  }

  applyView(viewModeSelect.value);

  viewModeSelect.addEventListener("change", function () {
    applyView(viewModeSelect.value);
  });

  function getApiKey() {
    const key = window.PIXABAY_API_KEY;
    if (!key || key === "YOUR_PIXABAY_API_KEY_HERE") {
      return null;
    }
    return key;
  }

  function setStatus(message, type) {
    statusEl.textContent = message || "";
    statusEl.classList.remove("is-error", "is-loading");
    if (type === "error") {
      statusEl.classList.add("is-error");
    } else if (type === "loading") {
      statusEl.classList.add("is-loading");
    }
  }

  function videoSrc(hit) {
    const videos = hit.videos || {};
    if (videos.medium && videos.medium.url) {
      return videos.medium.url;
    }
    if (videos.small && videos.small.url) {
      return videos.small.url;
    }
    if (videos.tiny && videos.tiny.url) {
      return videos.tiny.url;
    }
    return "";
  }

  function photoSrc(hit) {
    return hit.webformatURL || hit.largeImageURL || hit.previewURL || "";
  }

  function videoPoster(hit) {
    const videos = hit.videos || {};
    const sizes = [videos.large, videos.medium, videos.small, videos.tiny];
    for (let i = 0; i < sizes.length; i += 1) {
      if (sizes[i] && sizes[i].thumbnail) {
        return sizes[i].thumbnail;
      }
    }
    return hit.userImageURL || "";
  }

  function isPhotoHit(hit, kind) {
    if (photoSrc(hit) && !videoSrc(hit)) {
      return true;
    }
    if (kind === "photo" && photoSrc(hit)) {
      return true;
    }
    return false;
  }

  function appendBadge(frame, label) {
    const badge = document.createElement("span");
    badge.className = "media-badge";
    badge.textContent = label;
    frame.appendChild(badge);
  }

  function appendPhoto(card, hit) {
    const frame = document.createElement("div");
    frame.className = "media-frame";

    const img = document.createElement("img");
    img.src = photoSrc(hit);
    img.alt = hit.tags || "Pixabay photo";
    img.loading = "lazy";
    img.decoding = "async";
    frame.appendChild(img);
    appendBadge(frame, "Photo");
    card.appendChild(frame);
  }

  function appendVideo(card, hit) {
    const src = videoSrc(hit);
    if (!src) {
      return false;
    }

    const frame = document.createElement("div");
    frame.className = "media-frame";

    const video = document.createElement("video");
    video.controls = true;
    video.preload = "metadata";
    video.src = src;
    video.setAttribute("playsinline", "");
    const poster = videoPoster(hit);
    if (poster) {
      video.poster = poster;
    }
    frame.appendChild(video);
    appendBadge(frame, "Video");
    card.appendChild(frame);
    return true;
  }

  function renderResults(hits, kind) {
    resultsEl.innerHTML = "";
    resultsEl.dataset.kind = kind === "video" ? "video" : "photo";

    hits.forEach(function (hit) {
      const asPhoto = isPhotoHit(hit, kind);
      const card = document.createElement("article");
      card.className = "result-card is-" + (asPhoto ? "photo" : "video");

      if (asPhoto) {
        appendPhoto(card, hit);
      } else if (!appendVideo(card, hit)) {
        return;
      }

      const meta = document.createElement("div");
      meta.className = "result-meta";
      const link = document.createElement("a");
      link.href = hit.pageURL;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "by " + (hit.user || "Pixabay contributor");
      meta.appendChild(link);
      card.appendChild(meta);

      resultsEl.appendChild(card);
    });
  }

  async function requestPixabay(endpoint, params) {
    const apiKey = getApiKey();
    const query = new URLSearchParams({
      key: apiKey,
      ...params,
      per_page: "6",
    });
    const response = await fetch(endpoint + "?" + query.toString());
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(
        detail.trim() || "Request failed with status " + response.status + "."
      );
    }
    return response.json();
  }

  async function loadSixHits(endpoint, params) {
    const attempts = [{ ...params, per_page: "6" }];

    if (params.editors_choice) {
      const withoutEditors = { ...params, per_page: "6" };
      delete withoutEditors.editors_choice;
      attempts.push(withoutEditors);
    }

    if (params.category) {
      const looser = { ...params, per_page: "6" };
      delete looser.editors_choice;
      delete looser.category;
      attempts.push(looser);
    }

    let best = { hits: [], totalHits: 0 };
    for (let i = 0; i < attempts.length; i += 1) {
      const data = await requestPixabay(endpoint, attempts[i]);
      if (data.hits && data.hits.length > best.hits.length) {
        best = data;
      }
      if (best.hits.length >= 6) {
        break;
      }
    }

    if (best.hits.length > 6) {
      best.hits = best.hits.slice(0, 6);
    }
    return best;
  }

  async function searchPixabay(endpoint, params, kind, label) {
    const apiKey = getApiKey();
    if (!apiKey) {
      setStatus(
        "Missing API key. Copy config.sample.js to config.js and add your Pixabay key.",
        "error"
      );
      resultsEl.innerHTML = "";
      delete resultsEl.dataset.kind;
      return;
    }

    setStatus("Loading " + (label || "results") + "…", "loading");
    resultsEl.innerHTML = "";

    try {
      const data = await loadSixHits(endpoint, params);

      if (!data.hits || data.totalHits === 0 || data.hits.length === 0) {
        setStatus("No results found. Try a different search.", "error");
        return;
      }

      renderResults(data.hits, kind);
      setStatus(
        "Showing " + data.hits.length + " result(s) for “" + (label || params.q) + "”."
      );
    } catch (error) {
      const message =
        error && error.message
          ? error.message
          : "Network error. Check your connection and try again.";
      setStatus(message, "error");
      resultsEl.innerHTML = "";
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const term = searchInput.value.trim();
    if (!term) {
      setStatus("Please enter a search term.", "error");
      return;
    }

    const mediaType = mediaTypeSelect.value;
    if (mediaType === "video") {
      searchPixabay(
        VIDEO_ENDPOINT,
        { q: term, per_page: "6" },
        "video",
        term
      );
    } else {
      searchPixabay(
        IMAGE_ENDPOINT,
        { q: term, image_type: "photo", per_page: "6" },
        "photo",
        term
      );
    }
  });

  challengeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const id = button.getAttribute("data-challenge");
      const challenge = CHALLENGES[id];
      if (!challenge) {
        return;
      }
      searchPixabay(
        challenge.endpoint,
        challenge.params,
        challenge.kind,
        challenge.label
      );
    });
  });
})();
