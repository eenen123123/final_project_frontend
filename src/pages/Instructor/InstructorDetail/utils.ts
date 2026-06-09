export function formatCareerYear(strtYr: string, endYr: string | null) {
  return endYr ? `${strtYr}~${endYr}` : `${strtYr}~현재`;
}

export function formatPostDate(regDt: string) {
  const d = new Date(regDt);
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd}`;
}

export function isNewPost(regDt: string) {
  return Date.now() - new Date(regDt).getTime() < 7 * 24 * 60 * 60 * 1000;
}
