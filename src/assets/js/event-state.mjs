const DAY = 24 * 60 * 60 * 1000;

function normalizedDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  return String(value || "").slice(0, 10);
}

function endOfUtcDay(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(normalizedDate(value));
  if (!match) return Number.NaN;
  return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 23, 59, 59, 999);
}

function startOfUtcDay(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(normalizedDate(value));
  if (!match) return Number.NaN;
  return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function engagementState(engagement, now = new Date()) {
  const start = startOfUtcDay(engagement.startDate);
  const end = endOfUtcDay(engagement.endDate || engagement.startDate);
  const instant = now.getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end)) return "invalid";
  if (instant < start) return "future";
  if (instant <= end + (7 * DAY)) return "recent";
  return "expired";
}

export function orderEngagements(engagements, now = new Date()) {
  const rank = { future: 0, recent: 1, expired: 2, invalid: 3 };
  return engagements
    .map((engagement) => ({ ...engagement, state: engagementState(engagement, now) }))
    .sort((a, b) => {
      const stateDifference = rank[a.state] - rank[b.state];
      if (stateDifference) return stateDifference;
      if (a.state === "recent") return normalizedDate(b.endDate || b.startDate).localeCompare(normalizedDate(a.endDate || a.startDate));
      return normalizedDate(a.startDate).localeCompare(normalizedDate(b.startDate));
    });
}
