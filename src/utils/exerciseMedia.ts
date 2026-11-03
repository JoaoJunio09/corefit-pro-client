export function youtubeEmbedUrl(source: string): string | null {
  try {
    const url = new URL(source);
    if (
      ![
        "youtube.com",
        "www.youtube.com",
        "m.youtube.com",
        "youtu.be",
        "www.youtube-nocookie.com",
      ].includes(url.hostname)
    )
      return null;
    const id =
      url.hostname === "youtu.be"
        ? url.pathname.split("/")[1]
        : (url.searchParams.get("v") ??
          url.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/)?.[1]);
    return id && /^[a-zA-Z0-9_-]{11}$/.test(id)
      ? `https://www.youtube-nocookie.com/embed/${id}`
      : null;
  } catch {
    return null;
  }
}

export function safeMediaUrl(source: string | null | undefined): string | null {
  if (!source) return null;
  try {
    const url = new URL(source);
    return ["https:", "http:"].includes(url.protocol) ? source : null;
  } catch {
    return null;
  }
}
