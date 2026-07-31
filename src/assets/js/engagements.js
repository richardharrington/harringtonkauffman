import { orderEngagements } from "./event-state.mjs";

const region = document.querySelector("[data-engagements]");
if (region) {
  const cards = [...region.querySelectorAll("[data-engagement]")];
  const empty = region.querySelector("[data-no-engagements]");
  const details = cards.map((card) => ({
    card,
    startDate: card.dataset.startDate,
    endDate: card.dataset.endDate,
    status: card.dataset.status,
  }));
  const ordered = orderEngagements(details);
  const visible = ordered.filter((item) => item.state === "future" || item.state === "recent");

  cards.forEach((card) => {
    card.hidden = true;
    card.classList.remove("engagement--primary");
  });

  visible.forEach((item, index) => {
    const { card, state } = item;
    card.hidden = false;
    card.classList.toggle("engagement--primary", index === 0);
    const label = card.querySelector("[data-engagement-label]");
    if (label) label.textContent = state === "future" ? (index === 0 ? "Next show" : "Later") : "Most recent show";
    const ticket = card.querySelector("[data-ticket]");
    if (ticket) ticket.hidden = state !== "future" || item.status !== "scheduled";
    region.insertBefore(card, empty);
  });

  if (empty) empty.hidden = visible.length > 0;
}
