import test from "node:test";
import assert from "node:assert/strict";
import { videoSource } from "../src/assets/js/video-facades.js";

test("YouTube embeds do not force captions on", () => {
  const source = videoSource("https://www.youtube.com/embed/example?cc_load_policy=1", "youtube");
  assert.equal(new URL(source).searchParams.has("cc_load_policy"), false);
});

test("Vimeo embeds request captions off initially", () => {
  const source = videoSource("https://player.vimeo.com/video/123", "vimeo");
  assert.equal(new URL(source).searchParams.get("texttrack"), "false");
});
