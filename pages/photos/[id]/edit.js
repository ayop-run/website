import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import PhotographerFormFields from "../../../components/photos/PhotographerFormFields";
import { CATEGORY_LABELS, PHOTO_CATEGORIES } from "../../../lib/photos/constants";

export default function PhotoEditPage() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminSession, setAdminSession] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    externalAlbumUrl: "",
    coverImageUrl: "",
    shotOn: "",
    category: "TRACK_SESSION",
    photographerDisplayName: "",
    photographerInstagramUsername: "",
    password: "",
  });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      setAdminSession(false);
      try {
        const [unlockRes, photoRes] = await Promise.all([
          fetch("/api/photos/unlock-new", { credentials: "include" }),
          fetch(`/api/photos/${encodeURIComponent(id)}`),
        ]);
        const unlockBody = await unlockRes.json().catch(() => ({}));
        const body = await photoRes.json();
        if (!cancelled) {
          setAdminSession(Boolean(unlockRes.ok && unlockBody.unlocked));
        }
        if (!photoRes.ok) throw new Error(body.error || "Not found");
        const p = body.photo;
        if (!cancelled) {
          setForm({
            title: p.title,
            description: p.description || "",
            externalAlbumUrl: p.externalAlbumUrl,
            coverImageUrl: p.coverImageUrl || "",
            shotOn: p.shotOn,
            category: p.category,
            photographerDisplayName: p.photographerDisplayName || "",
            photographerInstagramUsername: p.photographerInstagramUsername || "",
            password: "",
          });
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const onChange = (field) => (e) => {
    const v = e.target.value;
    setForm((f) => ({ ...f, [field]: v }));
  };

  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!id) return;
    setSubmitting(true);
    setSaveError(null);
    try {
      const res = await fetch(`/api/photos/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description || null,
          externalAlbumUrl: form.externalAlbumUrl,
          coverImageUrl: form.coverImageUrl.trim() === "" ? null : form.coverImageUrl.trim(),
          shotOn: form.shotOn,
          category: form.category,
          photographerDisplayName: form.photographerDisplayName || null,
          photographerInstagramUsername: form.photographerInstagramUsername || null,
          password: adminSession ? undefined : form.password,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Failed to update");
      await router.push("/photos");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Edit photo entry" description="Edit album link">
      <main className="mt-10 laptop:mt-16 max-w-xl mx-auto">
        <p className="text-sm mb-4">
          <Link href="/photos" className="hover:underline opacity-80">
            ← All photos
          </Link>
        </p>
        <h1 className="text-3xl font-bold mb-6">Edit entry</h1>
        {loading && <p className="opacity-70">Loading…</p>}
        {error && (
          <p className="text-red-500" role="alert">
            {error}
          </p>
        )}
        {!loading && !error && (
          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block text-sm">
              <span className="opacity-80">Album URL</span>
              <input
                required
                type="url"
                value={form.externalAlbumUrl}
                onChange={onChange("externalAlbumUrl")}
                className="mt-1 w-full rounded border border-black/20 dark:border-white/20 bg-transparent px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="opacity-80">Cover image URL (optional)</span>
              <input
                type="url"
                value={form.coverImageUrl}
                onChange={onChange("coverImageUrl")}
                className="mt-1 w-full rounded border border-black/20 dark:border-white/20 bg-transparent px-3 py-2"
                placeholder="https://… direct image link"
              />
            </label>
            <label className="block text-sm">
              <span className="opacity-80">Title</span>
              <input
                required
                value={form.title}
                onChange={onChange("title")}
                className="mt-1 w-full rounded border border-black/20 dark:border-white/20 bg-transparent px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="opacity-80">Session date</span>
              <input
                required
                type="date"
                value={form.shotOn}
                onChange={onChange("shotOn")}
                className="mt-1 w-full rounded border border-black/20 dark:border-white/20 bg-transparent px-3 py-2"
              />
            </label>
            <p className="text-xs opacity-60">
              Changing the session date will change the public URL for this entry.
            </p>
            <label className="block text-sm">
              <span className="opacity-80">Category</span>
              <select
                value={form.category}
                onChange={onChange("category")}
                className="mt-1 w-full rounded border border-black/20 dark:border-white/20 bg-transparent px-3 py-2"
              >
                {PHOTO_CATEGORIES.map((key) => (
                  <option key={key} value={key}>
                    {CATEGORY_LABELS[key]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="opacity-80">Description</span>
              <textarea
                value={form.description}
                onChange={onChange("description")}
                rows={3}
                className="mt-1 w-full rounded border border-black/20 dark:border-white/20 bg-transparent px-3 py-2"
              />
            </label>
            <PhotographerFormFields
              photographerDisplayName={form.photographerDisplayName}
              photographerInstagramUsername={form.photographerInstagramUsername}
              onChange={onChange}
              nameOptionalLabel={false}
            />
            {!adminSession && (
              <>
                <label htmlFor="photos-edit-gate-username" className="block text-sm">
                  <span className="opacity-80">Account name (for saved password)</span>
                  <input
                    id="photos-edit-gate-username"
                    name="username"
                    type="text"
                    readOnly
                    autoComplete="username"
                    defaultValue="AYOP admin"
                    className="mt-1 w-full cursor-default rounded border border-black/20 bg-black/[0.04] px-3 py-2 text-sm dark:border-white/20 dark:bg-white/[0.06]"
                    aria-readonly="true"
                  />
                </label>
                <label htmlFor="photos-edit-password" className="block text-sm">
                  <span className="opacity-80">Admin password</span>
                  <input
                    id="photos-edit-password"
                    name="password"
                    required
                    type="password"
                    autoComplete="current-password"
                    value={form.password}
                    onChange={onChange("password")}
                    className="mt-1 w-full rounded border border-black/20 dark:border-white/20 bg-transparent px-3 py-2"
                  />
                </label>
              </>
            )}
            {saveError && (
              <p className="text-red-500 text-sm" role="alert">
                {saveError}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={submitting}
                aria-busy={submitting}
                className="inline-flex min-h-[2.75rem] min-w-[10rem] items-center justify-center rounded-lg border-2 border-black bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-sm outline-none transition-colors hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-black/55 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-100 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 dark:focus-visible:ring-white/80 dark:focus-visible:ring-offset-neutral-950 disabled:pointer-events-none disabled:opacity-50"
              >
                {submitting ? "Saving…" : "Save changes"}
              </button>
              <Link
                href="/photos"
                className="inline-flex min-h-[2.75rem] items-center justify-center rounded-lg border-2 border-black/20 px-5 py-2.5 text-sm font-medium outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-100 dark:border-white/25 dark:focus-visible:ring-white/60 dark:focus-visible:ring-offset-neutral-950"
              >
                Cancel
              </Link>
            </div>
          </form>
        )}
      </main>
    </Layout>
  );
}
