export function SiteFooter({
  line,
  signature,
}: {
  line: string;
  signature: string;
}) {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__row">
        <div>
          <div className="site-footer__brand">Aether</div>
          <p className="site-footer__line">{line}</p>
        </div>
        <p className="site-footer__line">{signature}</p>
      </div>
    </footer>
  );
}
