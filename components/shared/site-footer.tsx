/*
 * `brand` defaults to "Aether" so every route that predates this prop
 * keeps rendering exactly as before. Thoughtform-branded forks (e.g.
 * /ai-adoption) pass their own wordmark rather than closing a
 * portfolio page under the Aether name.
 */
export function SiteFooter({
  line,
  signature,
  brand = "Aether",
}: {
  line: string;
  signature: string;
  brand?: string;
}) {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__row">
        <div>
          <div className="site-footer__brand">{brand}</div>
          <p className="site-footer__line">{line}</p>
        </div>
        <p className="site-footer__line">{signature}</p>
      </div>
    </footer>
  );
}
