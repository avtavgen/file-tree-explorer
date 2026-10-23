const oneDecimalUnder10 = (value: number): string =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: value < 10 ? 1 : 0,
    maximumFractionDigits: value < 10 ? 1 : 0,
  });

/** B / KB / MB only (1 KB = 1024 B). */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${oneDecimalUnder10(bytes / 1024)} KB`;
  return `${oneDecimalUnder10(bytes / (1024 * 1024))} MB`;
}

/** "1.0 KB (1,024 bytes)" — exact byte count only when it adds information. */
export function formatSizeLong(bytes: number): string {
  return bytes < 1024 ? formatBytes(bytes) : `${formatBytes(bytes)} (${bytes.toLocaleString("en-US")} bytes)`;
}

export const plural = (n: number, word: string): string => `${n} ${word}${n === 1 ? "" : "s"}`;
