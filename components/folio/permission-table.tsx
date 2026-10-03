import { permission } from "@/content/folio-copy";

/* What an agent can do today, against what it could do with one more,
   narrower permission. */
export function PermissionTable() {
  const [c1, c2, c3] = permission.columns;
  return (
    <div className="fo-mock" data-mock="permission">
      <div className="fo-perm" role="table" aria-label="What an agent can do today and with Folio">
        <div className="fo-perm__row fo-perm__row--head" role="row">
          <span role="columnheader">{c1}</span>
          <span role="columnheader">{c2}</span>
          <span role="columnheader">{c3}</span>
        </div>
        {permission.rows.map((r) => (
          <div className="fo-perm__row" role="row" key={r.task}>
            <span className="fo-perm__task" role="cell">
              {r.task}
            </span>
            <span className="fo-perm__cell" role="cell">
              <span className={`fo-perm__mark fo-perm__mark--${r.todayOk ? "yes" : "no"}`} aria-label={r.todayOk ? "Yes" : "No"}>
                {r.todayOk ? "✓" : "×"}
              </span>
              <span>{r.today}</span>
            </span>
            <span className="fo-perm__cell fo-perm__cell--folio" role="cell">
              <span className="fo-perm__mark fo-perm__mark--yes" aria-label="Yes">
                ✓
              </span>
              <span>{r.folio}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
