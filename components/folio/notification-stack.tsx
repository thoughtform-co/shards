import type { ReactNode } from "react";
import { fill, problem } from "@/content/folio-copy";

/*
 * What scattered invoices turn into: a lock screen that keeps filling up.
 * A missed call from the accountant; three emails from them, stacked the
 * way a phone groups mail from one sender; a calendar block that keeps
 * moving; a vendor saying the emailed link has expired; a reminder nobody
 * ticks off. Newest on top. Generic app glyphs, no brand marks.
 */

type App = "mail" | "calendar" | "reminders" | "phone";

const APP_NAME: Record<App, string> = { mail: "Mail", calendar: "Calendar", reminders: "Reminders", phone: "Phone" };

const ICON: Record<App, ReactNode> = {
  mail: (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <rect x="1.5" y="3" width="11" height="8" rx="1.5" fill="none" stroke="#fff" strokeWidth="1.4" />
      <path d="M2 3.8 7 7.6l5-3.8" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
  calendar: (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <rect x="1.8" y="2.6" width="10.4" height="9.6" rx="1.6" fill="none" stroke="#fff" strokeWidth="1.4" />
      <path d="M1.8 5.6h10.4M4.6 1.4v2.4M9.4 1.4v2.4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  reminders: (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <circle cx="3" cy="4" r="1.1" fill="#fff" />
      <circle cx="3" cy="7.2" r="1.1" fill="#fff" />
      <circle cx="3" cy="10.4" r="1.1" fill="#fff" />
      <path d="M5.6 4h6M5.6 7.2h6M5.6 10.4h6" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  phone: (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path
        d="M4.2 1.8 5.6 4.2c.2.4.1.9-.2 1.2l-.8.8a7.4 7.4 0 0 0 3.2 3.2l.8-.8c.3-.3.8-.4 1.2-.2l2.4 1.4c.4.2.6.7.4 1.1l-.4 1c-.3.7-1 1.1-1.8 1A10 10 0 0 1 1.1 3.6c-.1-.8.3-1.5 1-1.8l1-.4c.4-.2.9 0 1.1.4Z"
        fill="#fff"
      />
    </svg>
  ),
};

type Item = (typeof problem.notifications)[number];

function Notice({ n }: { n: Item }) {
  const app = n.app as App;
  const stacked = n.stack.length > 0;
  return (
    <li className={`fo-notif__item${stacked ? " is-stack" : ""}${app === "phone" ? " is-call" : ""}`}>
      <div className="fo-notif__card">
        <div className="fo-notif__meta">
          <span className={`fo-notif__icon fo-notif__icon--${app}`}>{ICON[app]}</span>
          <span className="fo-notif__app">{APP_NAME[app]}</span>
          <span className="fo-notif__when">{n.when}</span>
        </div>
        <strong className="fo-notif__title">{fill(n.title)}</strong>
        {n.subject && <span className="fo-notif__subject">{n.subject}</span>}
        <p className="fo-notif__body">{fill(n.body)}</p>
        {stacked && (
          <p className="fo-notif__more">
            {n.stack.length} more from {fill(n.title)}
          </p>
        )}
      </div>
    </li>
  );
}

export function NotificationStack({ max }: { max?: number }) {
  const shown = problem.notifications.slice(0, max ?? problem.notifications.length);

  return (
    <div className="fo-notif fo-mock" data-mock="notifications">
      <div className="fo-notif__wall">
        <ol className="fo-notif__list" aria-label="Notifications">
          {shown.map((n, i) => (
            <Notice n={n} key={i} />
          ))}
        </ol>
      </div>
    </div>
  );
}
