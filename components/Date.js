import { isValid, parseISO, format } from "date-fns";

export default function Date({ className = "", dateString }) {
  const date = parseISO(dateString);

  return isValid(date) ? (
    <time className={className} dateTime={dateString}>
      {format(date, "LLLL d, yyyy")}
    </time>
  ) : null;
}
