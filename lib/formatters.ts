// AI response cleanup helpers — Gemini kabhi weird formatting deta hai

/**
 * Extra newlines, leading/trailing spaces clean karo
 */
export function cleanText(text: string): string {
  return text
    .trim()
    .replace(/\n{3,}/g, "\n\n") // 3+ newlines → 2
    .replace(/[ \t]+$/gm, ""); // trailing spaces from each line
}

/**
 * Numbered list items ko array me convert karo
 * Input: "1. First item\n2. Second item\n3. Third item"
 * Output: ["First item", "Second item", "Third item"]
 */
export function parseNumberedList(text: string): string[] {
  return text
    .split(/\n/)
    .map((line) => line.replace(/^\d+[\.\)]\s*/, "").trim())
    .filter((line) => line.length > 0);
}

/**
 * Hashtags extract karo kisi bhi text se
 * Input: "Use #travel #explore for your #reel"
 * Output: ["#travel", "#explore", "#reel"]
 */
export function extractHashtags(text: string): string[] {
  const matches = text.match(/#[\w\u0900-\u097F]+/g);
  return matches
    ? matches.filter((v, i, a) => a.indexOf(v) === i) // unique only
    : [];
}

/**
 * Markdown formatting hatao (bold, italic, headers)
 */
export function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s/g, "") // headers
    .replace(/\*\*(.*?)\*\*/g, "$1") // bold
    .replace(/\*(.*?)\*/g, "$1") // italic
    .replace(/`(.*?)`/g, "$1"); // inline code
}
