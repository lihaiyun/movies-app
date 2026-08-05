// Drizzle's timestamp (without time zone) column stores whatever
// `Date#toISOString()` produces, which is always UTC. Since the column
// has no time zone, that gets saved and read back as if it were local
// time. Shifting by the local UTC offset before handing it to Drizzle
// makes the stored value reflect actual local wall-clock time instead.
export function localNow() {
  const date = new Date();
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
}
