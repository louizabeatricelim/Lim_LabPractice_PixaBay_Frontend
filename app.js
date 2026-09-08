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
        per_page: "3",
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
        per_page: "3",
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
        per_page: "3",
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
        per_page: "3",
      },
      kind: "photo",
      label: "Road Forest",
    },
  };

  const form = document.getElementById("search-form");
  const searchInput = document.getElementById("search-term");
  const mediaTypeSelect = document.getElementById("media-type");
  const statusEl = document.getElementById("status");
  const resultsEl = document.getElementById("results");
  const challengeButtons = document.querySelectorAll("[data-challenge]");

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

  function renderResults(hits, kind) {
    resultsEl.innerHTML = "";

    hits.forEach(function (hit) {
      const card = document.createElement("article");
      card.className = "result-card";

      if (kind === "video") {
        const src = videoSrc(hit);
        if (!src) {
          return;
        }
        const video = document.createElement("video");
        video.controls = true;
        video.preload = "metadata";
        video.src = src;
        video.setAttribute("playsinline", "");
        card.appendChild(video);
      } else {
        const img = document.createElement("img");
        img.src = hit.webformatURL;
        img.alt = hit.tags || "Pixabay photo";
        img.loading = "lazy";
        card.appendChild(img);
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

  async function searchPixabay(endpoint, params, kind, label) {
    const apiKey = getApiKey();
    if (!apiKey) {
      setStatus(
        "Missing API key. Copy config.sample.js to config.js and add your Pixabay key.",
        "error"
      );
      resultsEl.innerHTML = "";
      return;
    }

    const query = new URLSearchParams({ key: apiKey, ...params });
    const url = endpoint + "?" + query.toString();

    setStatus("Loading " + (label || "results") + "…", "loading");
    resultsEl.innerHTML = "";

    try {
      const response = await fetch(url);

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(
          detail.trim() ||
            "Request failed with status " + response.status + "."
        );
      }

      const data = await response.json();

      if (!data.hits || data.totalHits === 0) {
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
        { q: term, per_page: "12" },
        "video",
        term
      );
    } else {
      searchPixabay(
        IMAGE_ENDPOINT,
        { q: term, image_type: "photo", per_page: "12" },
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
