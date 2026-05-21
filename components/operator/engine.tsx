"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  ENGINE_FOOTNOTE,
  ENGINE_PROMPT_CHIPS,
  ENGINE_SKILLS_BY_ID,
  type EngineSkillId,
} from "@/content/engine-skills";
import { EngineOntology } from "./engine-ontology";

/*
 * Engine — full-viewport, three-column workbench on `/`.
 *
 * Anatomy:
 *
 *   01 Header           Eyebrow + Bodoni title + sub. Same
 *                       chrome rhythm as the Vision and
 *                       EnginePattern heads.
 *
 *   02 Status strip     Slim mono-caps row above the bench:
 *                         Idle · ready · auto-route
 *                         Routing · 5 lenses
 *                         Composed · 5 Skills · 14 sources · 5.4s
 *                       The first cell carries a small status dot
 *                       whose colour reflects the run state.
 *
 *   03 Bench grid       Three columns at desktop; collapses to
 *                       2-up at <1180px (Lens trace drops below as
 *                       a full-width row) and 1-up at <760px:
 *
 *                       Question   textarea + reading-scope register
 *                                  + quick-pick chips + Compose.
 *
 *                       Synthesis  three states share the pane —
 *                                  empty (Bodoni italic title +
 *                                  body paragraph), running (same
 *                                  chrome plus a row of progress
 *                                  dots), done (Bodoni "Composed
 *                                  answer" head + streamed prose
 *                                  with inline `[Skill: ...]` chips
 *                                  + mono-caps trace footer).
 *
 *                       Lens trace one row per Skill the router
 *                                  fired. Each row carries a status
 *                                  pill (waiting / streaming /
 *                                  done / skipped) and a chevron
 *                                  that expands the row to show the
 *                                  streamed fragment + citations.
 *                                  Streaming caret blinks on
 *                                  whichever row is currently
 *                                  streaming.
 *
 *   04 Ontology band    Full-width band beneath the bench. Same
 *                       <EngineOntology /> SVG as before — just
 *                       relocated from the right column of the
 *                       legacy stacked layout to a footer row so
 *                       the bench above reads at one horizontal
 *                       scan first. Trace = runtime, graph = memory.
 *
 *   05 Footnote         "Eight Skills wired into the runtime.
 *                       Seven more in build."
 *
 * The runtime is unchanged: a single SSE stream from
 * /api/engine/compose folds events into one flat ComposeState
 * object. The `scope` value (default `auto`) is sent in the POST
 * body and the router uses it as one steering line on top of its
 * existing system prompt.
 *
 * No persistence; compositions are session-only. A future plan
 * will add an `engine_compositions` Supabase table so the graph
 * accumulates real nodes over time.
 */

export type EngineScopeOption = {
  id: string;
  label: string;
  caption: string;
  bias: string;
};

export type EngineSection = {
  /* DOM anchor + aria. Matches the `#engine` nav link in
     `content/intelligence-layer.ts → pageMeta.links`. */
  id: string;
  ariaLabel: string;
  /* Mono-caps eyebrow above the title. */
  eyebrow: string;
  /* Header copy. Pattern follows the rest of the section heads:
     plain leading word(s), Bodoni-italic em pivot, optional
     trailing fragment. */
  title: string;
  titleEm: string;
  titleAfter?: string;
  sub: string;
  /* Question pane labels. */
  askLabel: string;
  askHint: string;
  placeholder: string;
  composeLabel: string;
  composingLabel: string;
  chipsLabel: string;
  /* Reading-scope register. Optional so older content shapes still
     resolve; when missing the component falls back to a single
     "Auto-route" pill. */
  scopeLabel?: string;
  scopeHint?: string;
  scopeOptions?: readonly EngineScopeOption[];
  /* Lens trace pane labels. */
  traceColumnLabel?: string;
  traceColumnHint?: string;
  traceEmptyTitle?: string;
  traceEmptyBody?: string;
  /* Synthesis pane head + states. */
  synthEyebrow: string;
  synthTitle: string;
  synthEmptyTitle?: string;
  synthEmptyBody?: string;
  synthRunningTitle?: string;
  synthRunningBody?: string;
  /* Empty-state copy. Kept for back-compat with legacy callers. */
  emptyCaption: string;
};

type SkillTrace = {
  id: EngineSkillId;
  name: string;
  team: string;
  lens: string;
  sources: readonly string[];
  rationale: string;
  status: "pending" | "streaming" | "done" | "failed";
  text: string;
  citations: string[];
};

type ComposeStatus = "idle" | "running" | "done" | "error";

type ComposeEvent =
  | { type: "router"; picks: { skillId: EngineSkillId; rationale: string }[] }
  | { type: "skill_start"; skillId: EngineSkillId }
  | { type: "skill_delta"; skillId: EngineSkillId; text: string }
  | {
      type: "skill_end";
      skillId: EngineSkillId;
      citations: string[];
      failed?: boolean;
    }
  | { type: "synth_start" }
  | { type: "synth_delta"; text: string }
  | {
      type: "done";
      trace: {
        skills: EngineSkillId[];
        sources: string[];
        durationMs: number;
      };
    }
  | { type: "error"; message: string };

type ComposeState = {
  status: ComposeStatus;
  question: string;
  /* True once the router event has landed. Drives the trace pane
     mount: we don't render the lens-row list until the picks come
     back, to avoid showing a half-empty list before the router
     decides anything. */
  picksReceived: boolean;
  skills: SkillTrace[];
  synthStarted: boolean;
  synthText: string;
  trace: {
    skills: EngineSkillId[];
    sources: string[];
    durationMs: number;
  } | null;
  errorMessage: string | null;
};

const INITIAL_STATE: ComposeState = {
  status: "idle",
  question: "",
  picksReceived: false,
  skills: [],
  synthStarted: false,
  synthText: "",
  trace: null,
  errorMessage: null,
};

/* Default scope when the section content omits the register. The
   value is only used when the page-level content doesn't provide
   `scopeOptions`; in practice the homepage `pageEngineSection`
   ships the full five-option list. */
const FALLBACK_SCOPE_OPTIONS: readonly EngineScopeOption[] = [
  {
    id: "auto",
    label: "Auto-route",
    caption: "Let the router pick the lenses.",
    bias: "",
  },
];

export function Engine({ section }: { section: EngineSection }) {
  const [state, setState] = useState<ComposeState>(INITIAL_STATE);
  const [input, setInput] = useState("");
  const [scope, setScope] = useState<string>("auto");
  const [expandedSkill, setExpandedSkill] = useState<EngineSkillId | null>(
    null,
  );
  const abortRef = useRef<AbortController | null>(null);
  const benchRef = useRef<HTMLDivElement>(null);

  const scopeOptions = section.scopeOptions ?? FALLBACK_SCOPE_OPTIONS;

  /* Cancel any in-flight composition on unmount so the stream
     doesn't keep pushing events into stale state. */
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleEvent = useCallback((evt: ComposeEvent) => {
    setState((prev) => {
      switch (evt.type) {
        case "router": {
          const skills: SkillTrace[] = evt.picks
            .map((pick): SkillTrace | null => {
              const skill = ENGINE_SKILLS_BY_ID.get(pick.skillId);
              if (!skill) return null;
              return {
                id: skill.id,
                name: skill.name,
                team: skill.team,
                lens: skill.lens,
                sources: skill.sources,
                rationale: pick.rationale,
                status: "pending",
                text: "",
                citations: [],
              };
            })
            .filter((s): s is SkillTrace => s !== null);
          return { ...prev, picksReceived: true, skills };
        }
        case "skill_start": {
          return {
            ...prev,
            skills: prev.skills.map((s) =>
              s.id === evt.skillId ? { ...s, status: "streaming" } : s,
            ),
          };
        }
        case "skill_delta": {
          return {
            ...prev,
            skills: prev.skills.map((s) =>
              s.id === evt.skillId
                ? { ...s, text: s.text + evt.text, status: "streaming" }
                : s,
            ),
          };
        }
        case "skill_end": {
          return {
            ...prev,
            skills: prev.skills.map((s) =>
              s.id === evt.skillId
                ? {
                    ...s,
                    status: evt.failed ? "failed" : "done",
                    citations: evt.citations,
                    text: stripCitationsLine(s.text),
                  }
                : s,
            ),
          };
        }
        case "synth_start": {
          return { ...prev, synthStarted: true };
        }
        case "synth_delta": {
          return { ...prev, synthText: prev.synthText + evt.text };
        }
        case "done": {
          return {
            ...prev,
            status: "done",
            trace: evt.trace,
          };
        }
        case "error": {
          return {
            ...prev,
            status: "error",
            errorMessage: evt.message,
          };
        }
        default:
          return prev;
      }
    });
  }, []);

  const compose = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed) return;

      /* Cancel any in-flight composition before kicking a new one
         so the user can re-submit without doubling streams. */
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setState({
        ...INITIAL_STATE,
        status: "running",
        question: trimmed,
      });
      setExpandedSkill(null);

      try {
        const res = await fetch("/api/engine/compose", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: trimmed, scope }),
          signal: controller.signal,
        });

        if (res.status === 429) {
          const data = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          setState((prev) => ({
            ...prev,
            status: "error",
            errorMessage:
              data.error ||
              "Rate limit reached. Try again in a moment.",
          }));
          return;
        }

        if (!res.ok || !res.body) {
          const data = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(
            data.error || `Compose failed (${res.status}).`,
          );
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          /* SSE-style: events delimited by double newline; each
             event is a single `data: <json>` line. */
          let split: number;
          while ((split = buffer.indexOf("\n\n")) >= 0) {
            const raw = buffer.slice(0, split);
            buffer = buffer.slice(split + 2);
            const line = raw
              .split("\n")
              .find((l) => l.startsWith("data:"));
            if (!line) continue;
            try {
              const evt = JSON.parse(line.slice(5).trim()) as ComposeEvent;
              handleEvent(evt);
            } catch {
              /* Malformed event line. Skip silently — surface in
                 error state below if everything fails. */
            }
          }
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        setState((prev) => ({
          ...prev,
          status: "error",
          errorMessage:
            err instanceof Error
              ? err.message
              : "Composition failed.",
        }));
      }
    },
    [handleEvent, scope],
  );

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      void compose(input);
    },
    [compose, input],
  );

  const onChipClick = useCallback(
    (question: string) => {
      setInput(question);
      void compose(question);
    },
    [compose],
  );

  const running = state.status === "running";
  const hasRun =
    state.picksReceived || state.synthStarted || state.status !== "idle";

  /* Once the bench mounts and the first run kicks off, scroll the
     workbench into view so the user follows the run as the trace
     fills. Skipped on reduced-motion. */
  useEffect(() => {
    if (!state.picksReceived) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;
    const node = benchRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    if (rect.top < 0 || rect.top > window.innerHeight * 0.4) {
      node.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [state.picksReceived]);

  /* Status strip cells. The first is the state itself
     (idle/running/done/error); subsequent cells are run details
     when there's something meaningful to show. */
  const statusCells = useMemo(() => {
    const activeScope = scopeOptions.find((o) => o.id === scope);
    const scopeLabel = activeScope ? activeScope.label.toLowerCase() : "auto";
    if (state.status === "running") {
      const cells: string[] = ["Routing"];
      if (state.skills.length > 0) {
        cells.push(
          `${state.skills.length} lens${state.skills.length === 1 ? "" : "es"}`,
        );
      }
      cells.push(scopeLabel);
      return { state: "running" as const, label: "Composing", cells };
    }
    if (state.status === "done" && state.trace) {
      const t = state.trace;
      return {
        state: "done" as const,
        label: "Composed",
        cells: [
          `${t.skills.length} Skill${t.skills.length === 1 ? "" : "s"} fired`,
          `${t.sources.length} source${t.sources.length === 1 ? "" : "s"} read`,
          `${(t.durationMs / 1000).toFixed(1)}s`,
        ],
      };
    }
    if (state.status === "error") {
      return {
        state: "error" as const,
        label: "Error",
        cells: ["See message below"],
      };
    }
    return {
      state: "idle" as const,
      label: "Idle",
      cells: ["ready", scopeLabel],
    };
  }, [state, scope, scopeOptions]);

  /* When a run finishes, auto-expand the first done-or-failed Skill
     so the user lands on something to read. The synthesis is the
     primary surface; the lens trace expansion is secondary. */
  useEffect(() => {
    if (state.status !== "done") return;
    if (expandedSkill !== null) return;
    const first = state.skills.find(
      (s) => s.status === "done" || s.status === "failed",
    );
    if (first) setExpandedSkill(first.id);
  }, [state.status, state.skills, expandedSkill]);

  return (
    <section
      className="aiop-engine"
      id={section.id}
      aria-label={section.ariaLabel}
    >
      <div className="aiop-wrap aiop-engine__shell">
        {/* ─── Header ────────────────────────────────────────── */}
        <header className="aiop-section-head aiop-engine__head aiop-reveal">
          <p className="aiop-engine__eyebrow">{section.eyebrow}</p>
          <h2 className="aiop-section-title aiop-engine__title">
            {section.title} <em>{section.titleEm}</em>
            {section.titleAfter ? ` ${section.titleAfter}` : ""}
          </h2>
          <p className="aiop-section-head__sub aiop-engine__sub">
            {section.sub}
          </p>
        </header>

        {/* ─── Status strip ──────────────────────────────────── */}
        <div
          className="aiop-engine__status-strip aiop-reveal"
          data-state={statusCells.state}
          aria-live="polite"
          aria-label="Engine run status"
        >
          <span className="aiop-engine__status-cell aiop-engine__status-cell--state">
            <span className="aiop-engine__status-dot" aria-hidden="true" />
            {statusCells.label}
          </span>
          {statusCells.cells.map((cell) => (
            <span key={cell} className="aiop-engine__status-cell">
              {cell}
            </span>
          ))}
        </div>

        {/* ─── Bench grid ────────────────────────────────────── */}
        <div
          className="aiop-engine__bench aiop-reveal"
          ref={benchRef}
          role="group"
          aria-label="Engine workbench"
        >
          {/* ── Column 1 · Question ──────────────────────────── */}
          <form
            className="aiop-engine__pane aiop-engine__pane--question"
            onSubmit={onSubmit}
            aria-label={section.askLabel}
          >
            <header className="aiop-engine__pane-head">
              <span className="aiop-engine__pane-label">01 · Question</span>
              <span className="aiop-engine__pane-sub">{section.askHint}</span>
            </header>
            <div className="aiop-engine__pane-body">
              <label className="aiop-engine__field">
                <span className="aiop-engine__field-legend">
                  {section.askLabel}
                </span>
                <textarea
                  className="aiop-engine__textarea"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={section.placeholder}
                  rows={5}
                  disabled={running}
                  maxLength={2000}
                  aria-label={section.askLabel}
                />
              </label>

              {scopeOptions.length > 1 ? (
                <fieldset
                  className="aiop-engine__field aiop-engine__scope"
                  role="radiogroup"
                  aria-label={section.scopeLabel ?? "Reading scope"}
                >
                  <legend className="aiop-engine__field-legend">
                    {section.scopeLabel ?? "Reading scope"}
                    {section.scopeHint ? (
                      <span className="aiop-engine__field-hint">
                        {section.scopeHint}
                      </span>
                    ) : null}
                  </legend>
                  <div className="aiop-engine__scope-options">
                    {scopeOptions.map((option) => {
                      const active = scope === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          disabled={running}
                          className="aiop-engine__scope-option"
                          onClick={() => setScope(option.id)}
                          title={option.caption}
                        >
                          <span className="aiop-engine__scope-option-label">
                            {option.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ) : null}

              <div className="aiop-engine__field">
                <span className="aiop-engine__field-legend">Quick picks</span>
                <ul
                  className="aiop-engine__chips"
                  role="list"
                  aria-label={section.chipsLabel}
                >
                  {ENGINE_PROMPT_CHIPS.map((chip) => (
                    <li key={chip.id}>
                      <button
                        type="button"
                        className="aiop-engine__chip"
                        onClick={() => onChipClick(chip.question)}
                        disabled={running}
                      >
                        {chip.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="aiop-engine__cta-row">
                <button
                  type="submit"
                  className="aiop-button aiop-engine__cta"
                  disabled={running || !input.trim()}
                >
                  {running ? section.composingLabel : section.composeLabel}
                  <span className="aiop-button__arrow" aria-hidden="true">
                    {running ? "·" : "→"}
                  </span>
                </button>

                {!hasRun ? (
                  <p className="aiop-engine__caption">
                    {section.emptyCaption}
                  </p>
                ) : null}

                {state.status === "error" && state.errorMessage ? (
                  <p className="aiop-engine__error" role="alert">
                    {state.errorMessage}
                  </p>
                ) : null}
              </div>
            </div>
          </form>

          {/* ── Column 2 · Synthesis ─────────────────────────── */}
          <div className="aiop-engine__pane aiop-engine__pane--synthesis">
            <header className="aiop-engine__pane-head">
              <span className="aiop-engine__pane-label">02 · Synthesis</span>
              <span className="aiop-engine__pane-sub">
                {state.status === "done"
                  ? section.synthEyebrow
                  : state.status === "running"
                    ? "Composing across the lenses"
                    : "Awaiting question"}
              </span>
            </header>
            <div className="aiop-engine__pane-body">
              <article className="aiop-engine__synth">
                {!hasRun ? (
                  <div className="aiop-engine__synth-empty">
                    <h3 className="aiop-engine__synth-empty-title">
                      {section.synthEmptyTitle ?? "Awaiting question."}
                    </h3>
                    <p className="aiop-engine__synth-empty-body">
                      {section.synthEmptyBody ?? section.emptyCaption}
                    </p>
                  </div>
                ) : null}

                {hasRun &&
                !state.synthStarted &&
                !state.synthText &&
                state.status !== "error" ? (
                  <div className="aiop-engine__synth-running">
                    <h3 className="aiop-engine__synth-running-title">
                      {section.synthRunningTitle ??
                        "Composing across the lenses."}
                    </h3>
                    <p className="aiop-engine__synth-running-body">
                      {section.synthRunningBody ??
                        "Each Skill is streaming its read in the trace column. The synthesis lands here when the router finishes routing and the fragments come together."}
                    </p>
                    <span
                      className="aiop-engine__synth-running-dots"
                      aria-hidden="true"
                    >
                      <span className="aiop-engine__synth-running-dot" />
                      <span className="aiop-engine__synth-running-dot" />
                      <span className="aiop-engine__synth-running-dot" />
                      <span className="aiop-engine__synth-running-dot" />
                    </span>
                  </div>
                ) : null}

                {state.synthStarted || state.synthText ? (
                  <>
                    <header className="aiop-engine__synth-head">
                      <span className="aiop-engine__eyebrow">
                        {section.synthEyebrow}
                      </span>
                      <h3 className="aiop-engine__synth-title">
                        {section.synthTitle}
                      </h3>
                    </header>
                    <p className="aiop-engine__synth-prose">
                      {renderSynthText(state.synthText)}
                      {running && state.synthStarted ? (
                        <span
                          className="aiop-engine__caret"
                          aria-hidden="true"
                        />
                      ) : null}
                    </p>
                  </>
                ) : null}

                {state.trace ? (
                  <footer className="aiop-engine__trace-foot">
                    <span className="aiop-engine__trace-line">
                      {state.trace.skills.length} Skill
                      {state.trace.skills.length === 1 ? "" : "s"} fired
                      &nbsp;&middot;&nbsp;
                      {state.trace.sources.length} source
                      {state.trace.sources.length === 1 ? "" : "s"} read
                      &nbsp;&middot;&nbsp;1 graph node logged
                    </span>
                    <span
                      className="aiop-engine__trace-duration"
                      aria-label="Composition duration"
                    >
                      {(state.trace.durationMs / 1000).toFixed(1)}s
                    </span>
                  </footer>
                ) : null}
              </article>
            </div>
          </div>

          {/* ── Column 3 · Lens trace ────────────────────────── */}
          <aside className="aiop-engine__pane aiop-engine__pane--trace">
            <header className="aiop-engine__pane-head">
              <span className="aiop-engine__pane-label">
                03 · {section.traceColumnLabel ?? "Lens trace"}
              </span>
              <span className="aiop-engine__pane-sub">
                {state.picksReceived
                  ? `${state.skills.length} lens${state.skills.length === 1 ? "" : "es"} fired`
                  : (section.traceColumnHint ?? "One row per Skill")}
              </span>
            </header>
            <div className="aiop-engine__pane-body">
              {!state.picksReceived ? (
                <div className="aiop-engine__lens-empty">
                  <h3 className="aiop-engine__lens-empty-title">
                    {section.traceEmptyTitle ??
                      "Trace will fill as the router fires."}
                  </h3>
                  <p className="aiop-engine__lens-empty-body">
                    {section.traceEmptyBody ??
                      "The router picks 3 to 6 lenses for your question. Each one streams a fragment here as it reads."}
                  </p>
                </div>
              ) : (
                <ol
                  className="aiop-engine__lens-list"
                  role="list"
                  aria-label="Lens trace · one row per Skill the router fired"
                >
                  {state.skills.map((skill, idx) => {
                    const expanded = expandedSkill === skill.id;
                    return (
                      <li
                        key={skill.id}
                        className="aiop-engine__lens-row"
                        data-expanded={expanded ? "true" : "false"}
                        style={{ animationDelay: `${idx * 70}ms` }}
                      >
                        <button
                          type="button"
                          className="aiop-engine__lens-row-head"
                          aria-expanded={expanded}
                          onClick={() =>
                            setExpandedSkill(expanded ? null : skill.id)
                          }
                        >
                          <span className="aiop-engine__lens-row-meta">
                            <span className="aiop-engine__lens-row-name">
                              {skill.name}
                            </span>
                            <span className="aiop-engine__lens-row-tag">
                              {skill.lens}
                            </span>
                          </span>
                          <span className="aiop-engine__lens-row-actions">
                            <span
                              className="aiop-engine__lens-status-pill"
                              data-status={statusFor(skill.status)}
                            >
                              <span
                                className="aiop-engine__lens-status-dot"
                                aria-hidden="true"
                              />
                              {statusLabel(skill.status)}
                            </span>
                            <span
                              className="aiop-engine__lens-expand"
                              aria-hidden="true"
                            >
                              ▾
                            </span>
                          </span>
                        </button>

                        {expanded ? (
                          <div className="aiop-engine__lens-body">
                            {skill.rationale ? (
                              <p className="aiop-engine__lens-rationale">
                                {skill.rationale}
                              </p>
                            ) : null}
                            <p className="aiop-engine__lens-text">
                              {skill.text || (
                                <span className="aiop-engine__lens-pending">
                                  Picking up the lens…
                                </span>
                              )}
                              {skill.status === "streaming" ? (
                                <span
                                  className="aiop-engine__caret"
                                  aria-hidden="true"
                                />
                              ) : null}
                            </p>
                            {skill.citations.length > 0 ? (
                              <ul
                                className="aiop-engine__citations"
                                role="list"
                                aria-label="Sources this Skill read"
                              >
                                {skill.citations.map((c) => (
                                  <li
                                    key={c}
                                    className="aiop-engine__citation"
                                  >
                                    {c}
                                  </li>
                                ))}
                              </ul>
                            ) : skill.status === "done" ? (
                              <ul
                                className="aiop-engine__citations aiop-engine__citations--fallback"
                                role="list"
                                aria-label="Default sources for this Skill"
                              >
                                {skill.sources.map((src) => (
                                  <li
                                    key={src}
                                    className="aiop-engine__citation"
                                  >
                                    {src}
                                  </li>
                                ))}
                              </ul>
                            ) : null}
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          </aside>
        </div>

        {/* ─── Ontology band ─────────────────────────────────── */}
        {state.picksReceived ? (
          <aside
            className="aiop-engine__ontology-band aiop-reveal"
            aria-label="Ontology view of the run"
          >
            <header className="aiop-engine__ontology-band-head">
              <span className="aiop-engine__ontology-band-label">
                Ontology · graph
              </span>
              <span className="aiop-engine__ontology-band-sub">
                Same run, read as nodes. Trace is the runtime; the graph
                is the memory.
              </span>
            </header>
            <EngineOntology
              question={state.question}
              skills={state.skills}
              synthDone={Boolean(state.trace)}
            />
          </aside>
        ) : null}

        {/* ─── Honest footnote ───────────────────────────────── */}
        <p className="aiop-engine__footnote">{ENGINE_FOOTNOTE}</p>
      </div>
    </section>
  );
}

/* ─── Helpers ──────────────────────────────────────────────────── */

/* Maps the runtime SkillTrace status onto the data-status that
   styles the lens-row pill. The CSS already understands waiting /
   streaming / done / skipped — `pending` and `failed` map onto
   `waiting` and `skipped` respectively. */
function statusFor(s: SkillTrace["status"]): string {
  if (s === "pending") return "waiting";
  if (s === "failed") return "skipped";
  return s;
}

function statusLabel(s: SkillTrace["status"]): string {
  switch (s) {
    case "pending":
      return "waiting";
    case "streaming":
      return "streaming";
    case "done":
      return "done";
    case "failed":
      return "skipped";
    default:
      return s;
  }
}

/* Renders the streamed synthesis text, splitting `[Skill: <name>]`
   tokens into small lens-toned chips. Everything else renders as
   plain text spans so React keys stay stable across streamed
   re-renders. */
function renderSynthText(text: string): ReactNode[] {
  if (!text) return [];
  const parts = text.split(/(\[Skill:\s*[^\]]+\])/g);
  return parts.map((part, idx) => {
    const match = part.match(/^\[Skill:\s*([^\]]+)\]$/);
    if (match) {
      return (
        <span key={`cite-${idx}`} className="aiop-engine__synth-cite">
          {match[1]!.trim()}
        </span>
      );
    }
    return <span key={`text-${idx}`}>{part}</span>;
  });
}

/* Strip the trailing `Citations: …` line from a streamed Skill
   fragment so the on-screen body reads as clean prose. The full
   citations list is rendered separately as chips below the body. */
function stripCitationsLine(text: string): string {
  return text.replace(/(?:^|\n)\s*citations\s*:[^\n]*\s*$/i, "").trim();
}
