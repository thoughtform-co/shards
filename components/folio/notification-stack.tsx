import type { ReactNode } from "react";
import { fill, problem } from "@/content/folio-copy";

/*
 * What scattered invoices turn into: a lock screen that keeps filling up.
 * Mail from the accountant, getting shorter each time; a calendar block
 * that keeps moving; a vendor telling you the emailed link has expired; a
 * reminder nobody ticks off. Newest on top, the first polite request
 * collapsed into a pile at the bottom. Generic app glyphs, no brand marks.
 */

type App = "mail" | "calendar" | "reminders";

const APP_NAME: Record<App, string> = { mail: "Mail", calendar: "Calendar", reminders: "Reminders" };

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
};

function Notice({ n, pile = false }: { n: (typeof problem.notifications)[number]; pile?: boolean }) {
  const app = n.app as App;
  return (
    <li className={`fo-notif__item${pile ? " is-pile" : ""}`}>
      <div className="fo-notif__card">
        <div className="fo-notif__meta">
          <span className={`fo-notif__icon fo-notif__icon--${app}`}>{ICON[app]}</span>
          <span className="fo-notif__app">{APP_NAME[app]}</span>
          <span className="fo-notif__when">{n.when}</span>
        </div>
        <strong className="fo-notif__title">{fill(n.title)}</strong>
        {n.subject && <span className="fo-notif__subject">{n.subject}</span>}
        <p className="fo-notif__body">{fill(n.body)}</p>
      </div>
    </li>
  );
}

export function NotificationStack({ max }: { max?: number }) {
  const all = problem.notifications;
  const top = all.slice(0, -1).slice(0, max ?? all.length);
  const first = all[all.length - 1];

  return (
    <div className="fo-notif fo-mock" data-mock="notifications">
      <div className="fo-notif__wall">
        <ol className="fo-notif__list" aria-label="Notifications">
          {top.map((n, i) => (
            <Notice n={n} key={i} />
          ))}
          <Notice n={first} pile />
        </ol>
      </div>
    </div>
  );
}
