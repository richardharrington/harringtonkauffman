import test from "node:test";
import assert from "node:assert/strict";
import { dateAttribute, engagementState, orderEngagements } from "../src/assets/js/event-state.mjs";

const event = { startDate: "2026-05-09", endDate: "2026-05-10" };

test("CMS date objects serialize as browser-readable attributes", () => {
  assert.equal(dateAttribute(new Date("2026-07-29T00:00:00Z")), "2026-07-29T00:00:00.000Z");
});

test("future engagements remain available", () => {
  assert.equal(engagementState(event, new Date("2026-05-08T12:00:00Z")), "future");
});

test("engagements remain recent through the seven-day grace period", () => {
  assert.equal(engagementState(event, new Date("2026-05-17T23:59:59Z")), "recent");
});

test("engagements expire after the grace period", () => {
  assert.equal(engagementState(event, new Date("2026-05-18T00:00:00Z")), "expired");
});

test("the nearest future engagement precedes recent and later engagements", () => {
  const ordered = orderEngagements([
    { startDate: "2026-06-20", endDate: "2026-06-20" },
    { startDate: "2026-05-09", endDate: "2026-05-10" },
    { startDate: "2026-06-10", endDate: "2026-06-10" },
  ], new Date("2026-06-01T12:00:00Z"));
  assert.deepEqual(ordered.map((item) => item.startDate), ["2026-06-10", "2026-06-20", "2026-05-09"]);
});
