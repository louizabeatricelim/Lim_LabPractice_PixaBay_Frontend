(function () {
  "use strict";

  const IMAGE_ENDPOINT = "https://pixabay.com/api/";
  const VIDEO_ENDPOINT = "https://pixabay.com/api/videos/";

  const CHALLENGES = {
    rocket: {
      q: "Rocket Launch",
      category: "science",
      editors_choice: "true",
      label: "Rocket Launch",
    },
    basketball: {
      q: "Basketball",
      category: "sports",
      order: "latest",
      label: "Basketball",
    },
    forest: {
      q: "Forest",
      category: "nature",
      editors_choice: "true",
      order: "latest",
      label: "Forest",
    },
    roadForest: {
      q: "Road Forest",
      category: "nature",
      editors_choice: "true",
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
  const searchButton = form.querySelector('button[type="submit"]');

  function selectedKind() {
    return mediaTypeSelect.value === "video" ? "video" : "photo";
  }

  function challengeQuery(challenge) {
    const kind = selectedKind();
    const params = {
      q: challenge.q,
      per_page: "6",
    };
    if (challenge.category) {
      params.category = challenge.category;
    }
    if (challenge.editors_choice) {
      params.editors_choice = challenge.editors_choice;
    }
    if (challenge.order) {
      params.order = challenge.order;
    }
    if (kind === "photo") {
      params.image_type = "photo";
      return { endpoint: IMAGE_ENDPOINT, params: params, kind: "photo" };
    }
    return { endpoint: VIDEO_ENDPOINT, params: params, kind: "video" };
  }

  function applyView(view) {
    resultsEl.dataset.view = view || "gallery";
  }

  applyView(viewModeSelect.value);

  viewModeSelect.addEventListener("change", function () {
    applyView(viewModeSelect.value);
  });

  function setBusy(isBusy) {
    searchInput.disabled = isBusy;
    mediaTypeSelect.disabled = isBusy;
    searchButton.disabled = isBusy;
    challengeButtons.forEach(function (button) {
      button.disabled = isBusy;
    });
    resultsEl.setAttribute("aria-busy", isBusy ? "true" : "false");
  }

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

  function matchesKind(hit, kind) {
    if (kind === "photo") {
      return Boolean(photoSrc(hit) && !videoSrc(hit));
    }
    return Boolean(videoSrc(hit));
  }

  function filterHits(hits, kind) {
    return (hits || []).filter(function (hit) {
      return matchesKind(hit, kind);
    });
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
    card.appendChild(frame);
    return true;
  }

  function renderResults(hits, kind) {
    resultsEl.innerHTML = "";
    resultsEl.dataset.kind = kind === "video" ? "video" : "photo";

    filterHits(hits, kind).forEach(function (hit) {
      const card = document.createElement("article");
      card.className = "result-card is-" + kind;

      if (kind === "photo") {
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
    const query = new URLSearchParams({ key: apiKey, ...params });
    const response = await fetch(endpoint + "?" + query.toString());

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(
        detail.trim() ||
          "Request failed with status " + response.status + "."
      );
    }

    try {
      return await response.json();
    } catch (parseError) {
      throw new Error("Invalid response from Pixabay. Please try again.");
    }
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

    setBusy(true);
    setStatus("Loading " + (label || "results") + "…", "loading");
    resultsEl.innerHTML = "";

    try {
      const data = await requestPixabay(endpoint, params);
      const hits = filterHits(data.hits, kind);

      if (!hits.length) {
        setStatus(
          "No " +
            (kind === "video" ? "videos" : "photos") +
            " found. Try a different search.",
          "error"
        );
        return;
      }

      const noun = kind === "video" ? "videos" : "photos";
      renderResults(hits, kind);
      setStatus(
        "Showing " + hits.length + " " + noun + " for “" + (label || params.q) + "”."
      );
    } catch (error) {
      const raw = error && error.message ? error.message : "";
      const message =
        !raw || raw === "Failed to fetch"
          ? "Network error. Check your connection and try again."
          : raw;
      setStatus(message, "error");
      resultsEl.innerHTML = "";
    } finally {
      setBusy(false);
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
      const request = challengeQuery(challenge);
      searchPixabay(
        request.endpoint,
        request.params,
        request.kind,
        challenge.label
      );
    });
  });
})();
