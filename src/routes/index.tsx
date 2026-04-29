import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import page1 from "@/assets/page_1.jpeg";
import page2 from "@/assets/page_2.jpeg";
import page3 from "@/assets/page_3.jpeg";
import page4 from "@/assets/page_4.jpeg";
import page5 from "@/assets/page_5.jpeg";

export const Route = createFileRoute("/")({
  component: Index,
});

const TEST_DURATION = 4 * 60 * 60; // 4 hours in seconds
const PAGES = [page1, page2, page3, page4, page5];

type Phase = "intro" | "running" | "finished";

function formatTime(s: number) {
  const h = Math.floor(s / 3600).toString().padStart(2, "0");
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${h}:${m}:${sec}`;
}

function Index() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [name, setName] = useState("");
  const [remaining, setRemaining] = useState(TEST_DURATION);
  const [pageIdx, setPageIdx] = useState(0);
  const startedAt = useRef<number | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phase !== "running") return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          setPhase("finished");
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  const start = () => {
    const finalName = (nameRef.current?.value ?? name).trim();
    if (!finalName) {
      nameRef.current?.focus();
      return;
    }
    setName(finalName);
    startedAt.current = Date.now();
    setRemaining(TEST_DURATION);
    setPageIdx(0);
    setPhase("running");
  };

  const submit = () => {
    if (confirm("Submit the test? You won't be able to change answers after this.")) {
      setPhase("finished");
    }
  };

  const retake = () => {
    setPhase("intro");
    setName("");
    setRemaining(TEST_DURATION);
    setPageIdx(0);
  };

  if (phase === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Practice Test</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              100 questions • 4 hours
            </p>
          </div>

          <div className="mb-6 rounded-lg bg-muted p-4 text-sm text-muted-foreground space-y-1">
            <p>• Each correct answer: 3 marks • Wrong: −1 mark</p>
            <p>• Total duration: 4 hours (timer auto-submits)</p>
            <p>• Solve answers on paper — no on-screen answer entry</p>
          </div>

          <label className="block text-sm font-medium text-foreground mb-2">
            Your name
          </label>
          <input
            ref={nameRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />

          <button
            onClick={start}
            className="mt-6 w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Start Test
          </button>
        </div>
      </div>
    );
  }

  if (phase === "finished") {
    const used = TEST_DURATION - remaining;
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-sm text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <svg className="h-7 w-7 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Test Completed</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Well done, <span className="font-semibold text-foreground">{name}</span>.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 text-left">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground">Time used</p>
              <p className="text-lg font-semibold text-foreground">{formatTime(used)}</p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground">Time left</p>
              <p className="text-lg font-semibold text-foreground">{formatTime(remaining)}</p>
            </div>
          </div>
          <button
            onClick={retake}
            className="mt-6 w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Take Test Again
          </button>
        </div>
      </div>
    );
  }

  // running
  const lowTime = remaining < 600;
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">AFCAT Mock 02</p>
            <p className="truncate text-sm font-semibold text-foreground">{name}</p>
          </div>
          <div
            className={`rounded-md px-3 py-2 font-mono text-lg font-bold tabular-nums ${
              lowTime ? "bg-destructive text-destructive-foreground animate-pulse" : "bg-primary text-primary-foreground"
            }`}
          >
            {formatTime(remaining)}
          </div>
          <button
            onClick={submit}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            Submit
          </button>
        </div>
        <div className="mx-auto flex max-w-5xl items-center gap-2 overflow-x-auto px-4 pb-3">
          {PAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setPageIdx(i)}
              className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                pageIdx === i
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              Page {i + 1}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <img
            src={PAGES[pageIdx]}
            alt={`Test page ${pageIdx + 1}`}
            className="w-full h-auto"
          />
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={() => setPageIdx((i) => Math.max(0, i - 1))}
            disabled={pageIdx === 0}
            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent disabled:opacity-50"
          >
            ← Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {pageIdx + 1} of {PAGES.length}
          </span>
          {pageIdx < PAGES.length - 1 ? (
            <button
              onClick={() => setPageIdx((i) => Math.min(PAGES.length - 1, i + 1))}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={submit}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Finish Test
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
