export function videoSource(source, provider) {
  const url = new URL(source);
  if (String(provider).toLowerCase() === "youtube") url.searchParams.delete("cc_load_policy");
  if (String(provider).toLowerCase() === "vimeo") url.searchParams.set("texttrack", "false");
  return url.href;
}

if (typeof document !== "undefined") document.querySelectorAll("[data-video-facade]").forEach((facade) => {
  facade.addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.src = videoSource(facade.dataset.videoSrc, facade.dataset.videoProvider);
    iframe.title = facade.dataset.videoTitle;
    iframe.loading = "lazy";
    iframe.allow = "fullscreen; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    facade.replaceWith(iframe);
  }, { once: true });
});
