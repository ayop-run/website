import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Button,
  Input,
  Label,
  ListBox,
  Select,
  TextArea,
} from "@heroui/react";
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

  const fieldClass = "flex flex-col gap-1.5";

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
            <div className={fieldClass}>
              <Label htmlFor="photos-edit-album-url" className="text-sm opacity-80">
                Album URL
              </Label>
              <Input
                id="photos-edit-album-url"
                isRequired
                type="url"
                value={form.externalAlbumUrl}
                onChange={onChange("externalAlbumUrl")}
                variant="bordered"
                size="sm"
                className="w-full"
                placeholder="https://"
              />
            </div>

            <div className={fieldClass}>
              <Label htmlFor="photos-edit-cover-url" className="text-sm opacity-80">
                Cover image URL (optional)
              </Label>
              <Input
                id="photos-edit-cover-url"
                type="url"
                value={form.coverImageUrl}
                onChange={onChange("coverImageUrl")}
                variant="bordered"
                size="sm"
                className="w-full"
                placeholder="https://… direct image link"
              />
            </div>

            <div className={fieldClass}>
              <Label htmlFor="photos-edit-title" className="text-sm opacity-80">
                Title
              </Label>
              <Input
                id="photos-edit-title"
                isRequired
                value={form.title}
                onChange={onChange("title")}
                variant="bordered"
                size="sm"
                className="w-full"
              />
            </div>

            <div className={fieldClass}>
              <Label htmlFor="photos-edit-shot-on" className="text-sm opacity-80">
                Session date
              </Label>
              <Input
                id="photos-edit-shot-on"
                isRequired
                type="date"
                value={form.shotOn}
                onChange={onChange("shotOn")}
                variant="bordered"
                size="sm"
                className="w-full"
              />
            </div>
            <p className="text-xs opacity-60 -mt-2">
              Changing the session date will change the public URL for this entry.
            </p>

            <div className={fieldClass}>
              <Label id="photos-edit-category-label" className="text-sm opacity-80">
                Category
              </Label>
              <Select
                aria-labelledby="photos-edit-category-label"
                selectedKey={form.category}
                onSelectionChange={(key) => {
                  if (key != null) setForm((f) => ({ ...f, category: String(key) }));
                }}
                variant="bordered"
                fullWidth
                size="sm"
              >
                <Select.Trigger className="w-full">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {PHOTO_CATEGORIES.map((key) => (
                      <ListBox.Item key={key} id={key} textValue={CATEGORY_LABELS[key]}>
                        {CATEGORY_LABELS[key]}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            <div className={fieldClass}>
              <Label htmlFor="photos-edit-description" className="text-sm opacity-80">
                Description
              </Label>
              <TextArea
                id="photos-edit-description"
                value={form.description}
                onChange={onChange("description")}
                variant="bordered"
                size="sm"
                className="w-full min-h-[5.5rem]"
              />
            </div>

            <PhotographerFormFields
              photographerDisplayName={form.photographerDisplayName}
              photographerInstagramUsername={form.photographerInstagramUsername}
              onChange={onChange}
              nameOptionalLabel={false}
            />

            {!adminSession && (
              <>
                <div className={fieldClass}>
                  <Label htmlFor="photos-edit-gate-username" className="text-sm opacity-80">
                    Account name (for saved password)
                  </Label>
                  <Input
                    id="photos-edit-gate-username"
                    name="username"
                    type="text"
                    isReadOnly
                    autoComplete="username"
                    defaultValue="AYOP admin"
                    variant="bordered"
                    size="sm"
                    className="w-full"
                    aria-readonly="true"
                  />
                </div>
                <div className={fieldClass}>
                  <Label htmlFor="photos-edit-password" className="text-sm opacity-80">
                    Admin password
                  </Label>
                  <Input
                    id="photos-edit-password"
                    name="password"
                    isRequired
                    type="password"
                    autoComplete="current-password"
                    value={form.password}
                    onChange={onChange("password")}
                    variant="bordered"
                    size="sm"
                    className="w-full"
                  />
                </div>
              </>
            )}

            {saveError && (
              <p className="text-red-500 text-sm" role="alert">
                {saveError}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Button
                type="submit"
                color="primary"
                variant="solid"
                size="md"
                isDisabled={submitting}
                className="min-h-[2.75rem] min-w-[10rem]"
              >
                {submitting ? "Saving…" : "Save changes"}
              </Button>
              <Button
                type="button"
                variant="bordered"
                size="md"
                className="min-h-[2.75rem]"
                onPress={() => router.push("/photos")}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </main>
    </Layout>
  );
}
