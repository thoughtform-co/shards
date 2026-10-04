import { charges, dayMonth, persona, vendorById } from "@/content/folio";
import { fill, problem } from "@/content/folio-copy";

/*
 * What scattered invoices turn into: one reminder, snoozed every Friday,
 * while the pile grows. Each square is one document still to fetch,
 * coloured by the vendor it belongs to, in the order the charges posted.
 * Counts come from the dataset; nothing here is typed by hand.
 */

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const LINK_LIFETIME_DAYS = 30; // Stripe: emailed receipt links expire after 30 days

function weekday(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

function minusDays(iso: string, days: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d) - days * 86_400_000);
  return t.toISOString().slice(0, 10);
}

export function SnoozeStack() {
  const s = problem.snooze;
  const pile = [...charges].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  const slots = pile.length;
  const last = s.stops[s.stops.length - 1];

  const expiredCutoff = minusDays(last.date, LINK_LIFETIME_DAYS);
  const expiredDays = [...new Set(pile.filter((c) => c.date <= expiredCutoff).map((c) => c.date))];
  const firstLabel =
    expiredDays.length === 0
      ? ""
      : expiredDays.length === 1
        ? dayMonth(expiredDays[0])
        : `${expiredDays.slice(0, -1).map((d) => dayMonth(d).split(" ")[0]).join(", ")} and ${dayMonth(expiredDays[expiredDays.length - 1])}`;

  return (
    <div className="fo-snooze fo-mock" data-mock="snooze">
      <header className="fo-snooze__head">
        <span className="fo-snooze__bell" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path
              d="M7 1.5a3.6 3.6 0 0 0-3.6 3.6v2.2L2.2 9.6h9.6L10.6 7.3V5.1A3.6 3.6 0 0 0 7 1.5Zm-1.4 9.6a1.4 1.4 0 0 0 2.8 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <strong>{s.title}</strong>
        <span className="fo-snooze__badge">{s.badge.replace("{n}", String(s.stops.length))}</span>
      </header>

      <ol className="fo-snooze__rows">
        {s.stops.map((stop, i) => {
          const waiting = pile.filter((c) => c.date <= stop.date).length;
          const isLast = i === s.stops.length - 1;
          return (
            <li className={`fo-snooze__row${isLast ? " is-last" : ""}`} key={stop.date + i}>
              <div className="fo-snooze__top">
                <span className="fo-snooze__date">
                  {weekday(stop.date)} {dayMonth(stop.date)}
                </span>
                <span className="fo-snooze__chip">Snoozed: {stop.label}</span>
              </div>
              <div className="fo-snooze__bar">
                <span className="fo-snooze__docs" style={{ gridTemplateColumns: `repeat(${slots}, minmax(0, 1fr))` }} aria-hidden="true">
                  {pile.map((c, j) => (
                    <span
                      key={c.id}
                      className={j < waiting ? "is-on" : undefined}
                      style={j < waiting ? { background: vendorById(c.vendorId).tile.bg } : undefined}
                    />
                  ))}
                </span>
                <span className="fo-snooze__count">
                  <b>{waiting}</b> {s.waiting}
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="fo-snooze__fallout">
        <div className="fo-snooze__msg">
          <span className="fo-snooze__avatar" aria-hidden="true">
            BV
          </span>
          <span>
            <strong>
              {persona.accountant}
              <small>{s.accountantWhen}</small>
            </strong>
            <p>{fill(s.accountantText)}</p>
          </span>
        </div>
        {firstLabel && <p className="fo-snooze__expired">{s.expired.replace("{first}", firstLabel)}</p>}
      </div>
    </div>
  );
}
