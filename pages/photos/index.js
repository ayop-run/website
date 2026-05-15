import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Input } from "@heroui/react";
import Layout from "../../components/Layout";
import { CATEGORY_LABELS, FILTER_YEARS, PHOTO_CATEGORIES } from "../../lib/photos/constants";
import {
  formatPhotographerCredit,
  instagramProfileUrl,
} from "../../lib/photos/photographerCredit";

function albumMeta(p) {
  return `${p.shotOn} · ${CATEGORY_LABELS[p.category] || p.category}`;
}

/** Cover image or gradient; fills a sized parent (e.g. blog index image box). */
function AlbumCoverMedia({ photo, eager, className = "" }) {
  const hasCover = Boolean(photo.coverImageUrl);
  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-gradient-to-br from-neutral-700 to-neutral-900 dark:from-neutral-800 dark:to-neutral-950 ${className}`}
    >
      {hasCover && (
        <img
          src={photo.coverImageUrl}
          alt={photo.title}
          className="absolute inset-0 h-full w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
          loading={eager ? "eager" : "lazy"}
          referrerPolicy="no-referrer"
        />
      )}
      {hasCover && (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
          aria-hidden
        />
      )}
      {!hasCover && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
          <span className="text-xs font-medium uppercase tracking-wide text-white/50">
            {CATEGORY_LABELS[photo.category] || photo.category}
          </span>
          <span className="text-sm text-white/70">{photo.shotOn}</span>
          <span className="line-clamp-3 text-lg font-semibold text-white/95">{photo.title}</span>
        </div>
      )}
    </div>
  );
}

function openExternalAlbum(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function PhotoAlbumCard({ photo, adminUnlocked }) {
  const credit = formatPhotographerCredit(
    photo.photographerDisplayName,
    photo.photographerInstagramUsername
  );
  const description = photo.description?.trim() ? photo.description : null;

  return (
    <article
      className="relative group transition-all hover:scale-[1.02]"
      onClick={() => openExternalAlbum(photo.externalAlbumUrl)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openExternalAlbum(photo.externalAlbumUrl);
        }
      }}
    >
      <div className="relative overflow-hidden rounded-lg shadow-md group-hover:shadow-lg transition-shadow">
        <div className="relative w-full h-64 laptop:h-72">
          <AlbumCoverMedia photo={photo} eager={false} />
        </div>
        {adminUnlocked && (
          <div className="absolute top-2 right-2 z-10">
            <Link
              href={`/photos/${photo.id}/edit`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex min-h-[2.25rem] items-center rounded-lg border-2 border-black/90 bg-white/95 px-3 py-1.5 text-xs font-semibold text-black shadow-sm backdrop-blur-sm transition-opacity hover:opacity-90 dark:border-white dark:bg-black/80 dark:text-white"
            >
              Edit
            </Link>
          </div>
        )}
      </div>
      <h2 className="mt-6 text-xl tablet:text-2xl laptop:text-3xl font-bold leading-tight">
        {photo.title}
      </h2>
      {description && (
        <p className="mt-3 opacity-70 text-base tablet:text-lg leading-relaxed line-clamp-3">
          {description}
        </p>
      )}
      {credit && (
        <div className="mt-3 text-sm opacity-90">
          {photo.photographerInstagramUsername ? (
            <a
              href={instagramProfileUrl(photo.photographerInstagramUsername)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="underline-offset-2 hover:underline"
            >
              {credit}
            </a>
          ) : (
            <span>{credit}</span>
          )}
        </div>
      )}
      <span className="block mt-4 text-sm opacity-50">{albumMeta(photo)}</span>
    </article>
  );
}

function buildQuery(params) {
  const q = new URLSearchParams();
  if (params.year) q.set("year", params.year);
  if (params.month) q.set("month", params.month);
  if (params.category) q.set("category", params.category);
  if (params.q) q.set("q", params.q);
  return q.toString();
}

export default function PhotosListPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [category, setCategory] = useState("");
  const [q, setQ] = useState("");

  const [sessionState, setSessionState] = useState("loading"); // loading | guest | admin

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const res = await fetch("/api/photos/unlock-new", { credentials: "include" });
        const body = await res.json();
        if (cancelled) return;
        if (res.ok && body.unlocked) {
          setSessionState("admin");
        } else {
          setSessionState("guest");
        }
      } catch {
        if (!cancelled) setSessionState("guest");
      }
    };
    check();
    const onVis = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    const y = router.query.year ? String(router.query.year) : "";
    setYear(FILTER_YEARS.includes(y) ? y : "");
    setMonth(router.query.month ? String(router.query.month) : "");
    setCategory(router.query.category ? String(router.query.category) : "");
    setQ(router.query.q ? String(router.query.q) : "");
  }, [router.isReady, router.query]);

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = buildQuery({ year, month, category, q });
      const res = await fetch(`/api/photos${qs ? `?${qs}` : ""}`);
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Request failed");
      setPhotos(body.photos || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  }, [year, month, category, q]);

  useEffect(() => {
    if (!router.isReady) return;
    fetchPhotos();
  }, [router.isReady, fetchPhotos]);

  const applyFilters = (e) => {
    e.preventDefault();
    const qs = buildQuery({ year, month, category, q });
    router.push(qs ? `/photos?${qs}` : "/photos", undefined, { shallow: true });
  };

  const onAdminSignOut = async () => {
    try {
      await fetch("/api/photos/unlock-new", { method: "DELETE", credentials: "include" });
    } catch {
      /* still treat as signed out locally */
    }
    setSessionState("guest");
  };

  const years = FILTER_YEARS;
  const adminUnlocked = sessionState === "admin";

  return (
    <Layout title="Photos" description="Photo archive and admin tools" isBlog>
      <main className="mt-10 laptop:mt-20">
        <section className="p-2 laptop:p-0">
          <h1 className="text-4xl tablet:text-5xl laptop:text-6xl font-bold mb-12 laptop:mb-16">
            Photos
          </h1>

          <div className="mb-10 flex flex-col gap-6 laptop:flex-row laptop:items-end laptop:justify-between">
            <p className="max-w-3xl text-base leading-relaxed opacity-70 tablet:text-lg">
              Every run tells a story. We capture your happiest moments.
            </p>
            {adminUnlocked && (
              <div className="flex flex-col gap-2 laptop:items-end">
                <Button color="primary" variant="solid" onPress={() => router.push("/photos/new")}>
                  Add entry
                </Button>
                <Button variant="light" className="self-end" onPress={onAdminSignOut}>
                  Sign out
                </Button>
              </div>
            )}
          </div>

          <form
            onSubmit={applyFilters}
            className="mb-10 grid grid-cols-1 gap-3 rounded-lg border border-black/10 bg-black/[0.02] p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03] tablet:grid-cols-2 laptop:grid-cols-4 laptop:gap-4 laptop:p-5"
          >
          <label className="flex flex-col gap-1 text-sm">
            <span className="opacity-80">Year</span>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="rounded border border-black/20 dark:border-white/20 bg-transparent px-2 py-2"
            >
              <option value="">Any</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="opacity-80">Month</span>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="rounded border border-black/20 dark:border-white/20 bg-transparent px-2 py-2"
            >
              <option value="">Any</option>
              {Array.from({ length: 12 }, (_, i) => {
                const m = String(i + 1);
                return (
                  <option key={m} value={m}>
                    {m.padStart(2, "0")}
                  </option>
                );
              })}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="opacity-80">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded border border-black/20 dark:border-white/20 bg-transparent px-2 py-2"
            >
              <option value="">Any</option>
              {PHOTO_CATEGORIES.map((key) => (
                <option key={key} value={key}>
                  {CATEGORY_LABELS[key]}
                </option>
              ))}
            </select>
          </label>
          <label
            htmlFor="photos-filter-search"
            className="flex flex-col gap-1 text-sm tablet:col-span-2 laptop:col-span-1"
          >
            <span className="opacity-80">Search</span>
            <Input
              id="photos-filter-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Title, description, photographer"
              variant="bordered"
              size="sm"
              className="w-full"
            />
          </label>
          <div className="tablet:col-span-2 laptop:col-span-4 flex flex-wrap gap-2">
            <Button type="submit" color="primary" variant="solid" size="sm">
              Apply
            </Button>
            <Button
              type="button"
              variant="bordered"
              size="sm"
              onPress={() => {
                setYear("");
                setMonth("");
                setCategory("");
                setQ("");
                router.push("/photos", undefined, { shallow: true });
              }}
            >
              Clear
            </Button>
          </div>
        </form>

        {error && (
          <p className="text-red-500 mb-4" role="alert">
            {error}
          </p>
        )}
        {loading && <p className="opacity-70">Loading…</p>}
        {!loading && photos.length === 0 && !error && (
          <p className="opacity-70">No entries yet.</p>
        )}

        {!loading && photos.length > 0 && !error && (
          <div className="mt-10 grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-8 laptop:gap-10">
            {photos.map((p) => (
              <PhotoAlbumCard key={p.id} photo={p} adminUnlocked={adminUnlocked} />
            ))}
          </div>
        )}
      </section>
    </main>
    </Layout>
  );
}
