import { isValid, parseISO, format } from "date-fns";

export default function Date({ className, dateString }) {
  if (!isValid(parseISO(dateString))) {
    return "No date";
  }
  const date = parseISO(dateString);
  return (
    <time className={className} dateTime={dateString}>
      {format(date, "LLLL d, yyyy")}
    </time>
  );
}
