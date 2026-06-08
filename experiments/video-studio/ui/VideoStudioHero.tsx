type VideoStudioHeroProps = {
  summary: string;
};

export function VideoStudioHero({ summary }: VideoStudioHeroProps) {
  return (
    <div className="cw-vs__toolbar-meta">
      <div className="cw-vs__toolbar-titles">
        <p className="cw-vs__toolbar-eyebrow">Monizze workshop</p>
        <h1 className="cw-vs__toolbar-title">Video Studio</h1>
      </div>
      <p className="cw-vs__toolbar-status">
        <span className="cw-vs__status-dot" aria-hidden="true" />
        {summary}
      </p>
    </div>
  );
}
