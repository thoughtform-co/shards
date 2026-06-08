import styles from "@/experiments/video-studio/ui/video-studio.module.css";

export function WorkshopSection() {
  return (
    <section className={styles.vsWorkshop}>
      <h3>Workshop loop: agent as editor</h3>
      <p>
        This tool mirrors the creative-production briefing: AI as a speed layer on top of
        footage and assets you already have — not generative video from scratch. Keep both
        skills installed so agents can author new templates that drop into the gallery.
      </p>
      <ul>
        <li>
          HyperFrames: <code>npx skills add heygen-com/hyperframes</code> — HTML captions,
          footage overlays, warm-start from changelogs and brand kits.
        </li>
        <li>
          Remotion: install <code>remotion-dev/skills</code> — constants-first React
          compositions for templated variant sets the team maintains in code review.
        </li>
        <li>
          Templatize the best output: swap variables at render time instead of regenerating
          fresh compositions every run.
        </li>
        <li>
          Local render requires Node 22+ and FFmpeg. Cloud rendering is documented in{" "}
          <code>experiments/video-studio/docs/CLOUD_RENDER.md</code>.
        </li>
      </ul>
    </section>
  );
}
