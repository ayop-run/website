import React, { useEffect, useId, useState } from "react";

const inputClass =
  "mt-1 w-full rounded border border-black/20 dark:border-white/20 bg-transparent px-3 py-2";

/** Extra rows merged into the name quick-pick / datalist when archive has names. */
const EXTRA_SELECTOR_DISPLAY_NAME = "Sujin";
/** Extra rows merged into the Instagram quick-pick / datalist when archive has usernames. */
const EXTRA_SELECTOR_INSTAGRAM = "sujinleeme";

/**
 * @param {string[]} defaults
 * @param {string[]} fromApi
 */
function mergeUniqueSorted(defaults, fromApi) {
  const set = new Set([...defaults, ...fromApi]);
  const sort = (a, b) => a.localeCompare(b, undefined, { sensitivity: "base" });
  return [...set].sort(sort);
}

/**
 * @param {unknown[]} photos
 * @returns {{ names: string[]; usernames: string[] }}
 */
function extractSuggestions(photos) {
  const names = new Set();
  const usernames = new Set();
  for (const p of photos || []) {
    if (p && typeof p === "object") {
      const n = /** @type {{ photographerDisplayName?: string | null }} */ (p).photographerDisplayName;
      if (typeof n === "string" && n.trim()) names.add(n.trim());
      const u = /** @type {{ photographerInstagramUsername?: string | null }} */ (p)
        .photographerInstagramUsername;
      if (typeof u === "string" && u.trim()) usernames.add(u.trim());
    }
  }
  const sort = (a, b) => a.localeCompare(b, undefined, { sensitivity: "base" });
  return {
    names: [...names].sort(sort),
    usernames: [...usernames].sort(sort),
  };
}

/**
 * Photographer name + Instagram: plain inputs until the archive has values for
 * that field; then select + datalist, with Sujin / sujinleeme added to those lists.
 *
 * @param {{
 *   photographerDisplayName: string;
 *   photographerInstagramUsername: string;
 *   onChange: (field: "photographerDisplayName" | "photographerInstagramUsername") => (e: React.ChangeEvent<HTMLInputElement>) => void;
 *   nameOptionalLabel?: boolean;
 * }} props
 */
export default function PhotographerFormFields({
  photographerDisplayName,
  photographerInstagramUsername,
  onChange,
  nameOptionalLabel = true,
}) {
  const nameListId = useId();
  const usernameListId = useId();
  const [nameOptions, setNameOptions] = useState(/** @type {string[]} */ ([]));
  const [usernameOptions, setUsernameOptions] = useState(/** @type {string[]} */ ([]));
  const [quickName, setQuickName] = useState("");
  const [quickUsername, setQuickUsername] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/photos");
        const body = await res.json().catch(() => ({}));
        if (cancelled) return;
        const { names, usernames } = res.ok
          ? extractSuggestions(body.photos)
          : { names: [], usernames: [] };
        if (!cancelled) {
          setNameOptions(
            names.length > 0
              ? mergeUniqueSorted([EXTRA_SELECTOR_DISPLAY_NAME], names)
              : []
          );
          setUsernameOptions(
            usernames.length > 0
              ? mergeUniqueSorted([EXTRA_SELECTOR_INSTAGRAM], usernames)
              : []
          );
        }
      } catch {
        if (!cancelled) {
          setNameOptions([]);
          setUsernameOptions([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const hasNameSuggestions = nameOptions.length > 0;
  const hasUsernameSuggestions = usernameOptions.length > 0;

  const nameLabel = nameOptionalLabel
    ? "Photographer name (optional)"
    : "Photographer name";
  const instagramLabel = nameOptionalLabel
    ? "Instagram username, no @ (optional)"
    : "Instagram username, no @";

  return (
    <>
      <div className="block text-sm">
        <span className="opacity-80 block">{nameLabel}</span>
        {hasNameSuggestions ? (
          <div className="mt-1 space-y-1">
            <select
              className="w-full rounded border border-black/20 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
              value={quickName}
              onChange={(e) => {
                const v = e.target.value;
                if (v) {
                  onChange("photographerDisplayName")({ target: { value: v } });
                }
                setQuickName("");
              }}
              aria-label="Pick a saved photographer name"
            >
              <option value="">Saved names — pick or type below…</option>
              {nameOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <input
              type="text"
              list={nameListId}
              value={photographerDisplayName}
              onChange={onChange("photographerDisplayName")}
              autoComplete="off"
              className={inputClass}
              aria-label={nameLabel}
            />
            <datalist id={nameListId}>
              {nameOptions.map((n) => (
                <option key={n} value={n} />
              ))}
            </datalist>
          </div>
        ) : (
          <input
            type="text"
            value={photographerDisplayName}
            onChange={onChange("photographerDisplayName")}
            className={`${inputClass} mt-1`}
          />
        )}
      </div>
      <div className="block text-sm">
        <span className="opacity-80 block">{instagramLabel}</span>
        {hasUsernameSuggestions ? (
          <div className="mt-1 space-y-1">
            <select
              className="w-full rounded border border-black/20 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
              value={quickUsername}
              onChange={(e) => {
                const v = e.target.value;
                if (v) {
                  onChange("photographerInstagramUsername")({ target: { value: v } });
                }
                setQuickUsername("");
              }}
              aria-label="Pick a saved Instagram username"
            >
              <option value="">Saved usernames — pick or type below…</option>
              {usernameOptions.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            <input
              type="text"
              list={usernameListId}
              value={photographerInstagramUsername}
              onChange={onChange("photographerInstagramUsername")}
              autoComplete="off"
              className={inputClass}
              placeholder="username"
              aria-label={instagramLabel}
            />
            <datalist id={usernameListId}>
              {usernameOptions.map((u) => (
                <option key={u} value={u} />
              ))}
            </datalist>
          </div>
        ) : (
          <input
            type="text"
            value={photographerInstagramUsername}
            onChange={onChange("photographerInstagramUsername")}
            className={`${inputClass} mt-1`}
            placeholder="username"
          />
        )}
      </div>
    </>
  );
}
