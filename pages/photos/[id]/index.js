import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";

/**
 * Legacy /photos/:id URLs redirect straight to the external album (no on-site detail).
 */
export default function PhotoAlbumRedirectPage() {
  const router = useRouter();
  const { id } = router.query;
  const [message, setMessage] = useState("Opening album…");

  useEffect(() => {
    if (!id || typeof id !== "string") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/photos/${encodeURIComponent(id)}`);
        const body = await res.json();
        if (cancelled) return;
        if (!res.ok || !body.photo?.externalAlbumUrl) {
          setMessage("This entry was not found.");
          return;
        }
        window.location.assign(body.photo.externalAlbumUrl);
      } catch {
        if (!cancelled) setMessage("Could not open the album link.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <Layout title="Photos" description="Redirecting to album">
      <main className="mt-10 laptop:mt-16 max-w-xl mx-auto">
        <p className="text-sm mb-4">
          <Link href="/photos" className="hover:underline opacity-80">
            ← All photos
          </Link>
        </p>
        <p className="opacity-80">{message}</p>
        {message !== "Opening album…" && (
          <p className="mt-4 text-sm">
            <Link href="/photos" className="underline">
              Back to list
            </Link>
          </p>
        )}
      </main>
    </Layout>
  );
}
