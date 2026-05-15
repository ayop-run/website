import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import PhotographerFormFields from "../../components/photos/PhotographerFormFields";
import { CATEGORY_LABELS, PHOTO_CATEGORIES } from "../../lib/photos/constants";

const emptyForm = {
  title: "",
  description: "",
  externalAlbumUrl: "",
  coverImageUrl: "",
  shotOn: "",
  category: "TRACK_SESSION",
  photographerDisplayName: "",
  photographerInstagramUsername: "",
  password: "",
};

export default function PhotosNewPage() {
  const router = useRouter();
  const [step, setStep] = useState("checking"); // checking | form
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/photos/unlock-new", { credentials: "include" });
        const body = await res.json();
        if (cancelled) return;
        if (res.ok && body.unlocked) {
          setStep("form");
        } else if (typeof window !== "undefined") {
          window.location.assign(`/admin?next=${encodeURIComponent("/photos/new")}`);
        }
      } catch {
        if (!cancelled && typeof window !== "undefined") {
          window.location.assign(`/admin?next=${encodeURIComponent("/photos/new")}`);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      const body = {
        title: form.title,
        description: form.description || null,
        externalAlbumUrl: form.externalAlbumUrl,
        shotOn: form.shotOn,
        category: form.category,
        photographerDisplayName: form.photographerDisplayName || null,
        photographerInstagramUsername: form.photographerInstagramUsername || null,
      };
      const trimmedCover = form.coverImageUrl.trim();
      if (trimmedCover) {
        body.coverImageUrl = trimmedCover;
      }
      if (form.password.trim()) {
        body.password = form.password;
      }
      const res = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save");
      }
      await router.push("/photos");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Add photo entry" description="Add a photo album link to the archive">
      <main className="mt-10 laptop:mt-16 max-w-xl mx-auto">
        <p className="text-sm mb-6">
          <Link href="/photos" className="underline opacity-80 hover:opacity-100">
            ← All photos
          </Link>
        </p>

        {step === "checking" && <p className="opacity-70">Checking sign-in…</p>}

        {step === "form" && (
          <>
            <h1 className="text-3xl font-bold mb-2">New entry</h1>
            <form onSubmit={onSubmitForm} className="space-y-4">
              <label className="block text-sm">
                <span className="opacity-80">Album URL</span>
                <input
                  required
                  type="url"
                  value={form.externalAlbumUrl}
                  onChange={onChange("externalAlbumUrl")}
                  className="mt-1 w-full rounded border border-black/20 dark:border-white/20 bg-transparent px-3 py-2"
                  placeholder="https://"
                />
              </label>
              <label className="block text-sm">
                <span className="opacity-80">Cover image URL (optional)</span>
                <input
                  type="url"
                  value={form.coverImageUrl}
                  onChange={onChange("coverImageUrl")}
                  className="mt-1 w-full rounded border border-black/20 dark:border-white/20 bg-transparent px-3 py-2"
                  placeholder="https://… direct image link for album grid"
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
                <span className="opacity-80">Description (optional)</span>
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
                nameOptionalLabel
              />
              <label htmlFor="photos-new-form-password" className="block text-sm">
                <span className="opacity-80">
                  Admin password (only if your sign-in expired; your browser can autofill)
                </span>
                <input
                  id="photos-new-form-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={onChange("password")}
                  className="mt-1 w-full rounded border border-black/20 dark:border-white/20 bg-transparent px-3 py-2"
                />
              </label>
              {formError && (
                <p className="text-red-500 text-sm" role="alert">
                  {formError}
                </p>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg px-4 py-2 text-sm font-medium border-2 border-black bg-black text-white transition-colors hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 disabled:opacity-50"
                >
                  {submitting ? "Saving…" : "Save"}
                </button>
                <Link
                  href="/photos"
                  className="rounded-lg px-4 py-2 text-sm border border-black/20 dark:border-white/20 inline-flex items-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </>
        )}
      </main>
    </Layout>
  );
}
