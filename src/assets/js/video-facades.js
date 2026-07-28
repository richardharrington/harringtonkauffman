document.querySelectorAll("[data-video-facade]").forEach((facade) => {
  facade.addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.src = facade.dataset.videoSrc;
    iframe.title = facade.dataset.videoTitle;
    iframe.loading = "lazy";
    iframe.allow = "fullscreen; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    facade.replaceWith(iframe);
  }, { once: true });
});
