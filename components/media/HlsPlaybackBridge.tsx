"use client";

import Hls, { type ErrorData } from "hls.js";
import { useEffect } from "react";

const HLS_MIME_TYPE = "application/vnd.apple.mpegurl";

function isHlsSource(source: string | null): source is string {
  return Boolean(source && source.toLowerCase().includes(".m3u8"));
}

export default function HlsPlaybackBridge() {
  useEffect(() => {
    const activePlayers = new Map<HTMLVideoElement, Hls>();

    function attachPlayer(video: HTMLVideoElement) {
      if (activePlayers.has(video)) {
        return;
      }

      const source = video.getAttribute("src") || video.currentSrc;

      if (!isHlsSource(source)) {
        return;
      }

      if (video.canPlayType(HLS_MIME_TYPE)) {
        return;
      }

      if (!Hls.isSupported()) {
        return;
      }

      video.removeAttribute("src");
      video.load();

      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 30,
      });

      activePlayers.set(video, hls);

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(source);
      });

      hls.on(Hls.Events.ERROR, (_event, data: ErrorData) => {
        if (!data.fatal) {
          return;
        }

        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
          return;
        }

        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
          return;
        }

        hls.destroy();
        activePlayers.delete(video);
      });

      hls.attachMedia(video);
    }

    function scanForPlayers(root: ParentNode = document) {
      root.querySelectorAll<HTMLVideoElement>("video").forEach(attachPlayer);
    }

    scanForPlayers();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes") {
          const target = mutation.target;

          if (target instanceof HTMLVideoElement) {
            attachPlayer(target);
          }

          continue;
        }

        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) {
            return;
          }

          if (node instanceof HTMLVideoElement) {
            attachPlayer(node);
          }

          scanForPlayers(node);
        });
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src"],
    });

    return () => {
      observer.disconnect();
      activePlayers.forEach((hls) => hls.destroy());
      activePlayers.clear();
    };
  }, []);

  return null;
}
