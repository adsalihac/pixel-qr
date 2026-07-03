export function buildCalendarPayload(
  name: string,
  date: string,
  location: string,
  description: string,
): string {
  const now = new Date();
  const dateStr = date
    ? new Date(date).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    : now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const endDate = date
    ? new Date(
        new Date(date).getTime() + 60 * 60 * 1000,
      )
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0] + "Z"
    : new Date(now.getTime() + 60 * 60 * 1000)
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0] + "Z";

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `DTSTART:${dateStr}`,
    `DTEND:${endDate}`,
    `SUMMARY:${name || "Event"}`,
    location ? `LOCATION:${location}` : "",
    description ? `DESCRIPTION:${description}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.filter(Boolean).join("\n");
}
