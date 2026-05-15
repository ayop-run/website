import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

/** Same-origin path only; avoids open redirects via `?next=`. */
function readSafeNextPath(next) {
  if (next == null) return null;
  const raw = Array.isArray(next) ? next[0] : String(next);
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw.trim());
  } catch {
    return null;
  }
  if (!decoded.startsWith("/") || decoded.startsWith("//")) return null;
  if (decoded.includes("://")) return null;
  return decoded;
}

/**
 * Reuses the same admin unlock session as Photos (`/api/photos/unlock-new`).
 */
export default function AdminGate({ children, showSignOut = true }) {
  const router = useRouter();
  const [sessionState, setSessionState] = useState("loading"); // loading | guest | admin
  const [password, setPassword] = useState("");
  const [rememberDevice, setRememberDevice] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/photos/unlock-new", { credentials: "include" });
        const body = await res.json();
        if (cancelled) return;
        setSessionState(res.ok && body.unlocked ? "admin" : "guest");
      } catch {
        if (!cancelled) setSessionState("guest");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (sessionState !== "admin" || !router.isReady) return;
    const safe = readSafeNextPath(router.query.next);
    if (safe) {
      void router.replace(safe);
    }
  }, [sessionState, router.isReady, router.query.next, router.replace]);

  const onSignIn = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/photos/unlock-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password, remember: rememberDevice }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Sign-in failed");
      setPassword("");
      setSessionState("admin");
      const safe = readSafeNextPath(router.query.next);
      if (safe) {
        void router.replace(safe);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setSubmitting(false);
    }
  };

  const onSignOut = async () => {
    try {
      await fetch("/api/photos/unlock-new", { method: "DELETE", credentials: "include" });
    } catch {
      /* ignore */
    }
    setSessionState("guest");
  };

  if (sessionState === "loading") {
    return <p className="opacity-70">Loading…</p>;
  }

  if (sessionState === "guest") {
    return (
      <form
        method="post"
        onSubmit={onSignIn}
        className="max-w-sm space-y-3 rounded-lg border border-black/10 dark:border-white/10 p-4"
      >
        <p className="text-xs leading-relaxed opacity-70">
          Your browser can save this sign-in (like any other site). Use a fixed account name below
          so your password app pairs it with your password.
        </p>
        <label htmlFor="admin-gate-username" className="block text-sm">
          <span className="opacity-80">Account name (for saved password)</span>
          <input
            id="admin-gate-username"
            name="username"
            type="text"
            readOnly
            autoComplete="username"
            defaultValue="AYOP admin"
            className="mt-1 w-full cursor-default rounded border border-black/20 bg-black/[0.04] px-3 py-2 text-sm dark:border-white/20 dark:bg-white/[0.06]"
            aria-readonly="true"
          />
        </label>
        <label htmlFor="admin-gate-password" className="block text-sm">
          <span className="opacity-80">Admin password</span>
          <input
            id="admin-gate-password"
            name="password"
            required
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded border border-black/20 dark:border-white/20 bg-transparent px-3 py-2"
          />
        </label>
        <label htmlFor="admin-gate-remember" className="flex cursor-pointer items-start gap-2 text-sm">
          <input
            id="admin-gate-remember"
            type="checkbox"
            checked={rememberDevice}
            onChange={(e) => setRememberDevice(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0"
          />
          <span className="opacity-90 leading-snug">
            Stay signed in on this device (up to 30 days). Uncheck for a short session only.
          </span>
        </label>
        {error && (
          <p className="text-red-500 text-sm" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg border-2 border-black bg-black px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      {showSignOut && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onSignOut}
            className="text-sm underline opacity-70 hover:opacity-100"
          >
            Sign out
          </button>
        </div>
      )}
      {children}
    </div>
  );
}
