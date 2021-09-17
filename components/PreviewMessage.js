import { useCurrentUser } from "lib/sanity";

export default function PreviewMessage() {
  const { data } = useCurrentUser();
  return data ? (
    <div
      style={{
        padding: "10px",
        backgroundColor: "#333",
        color: "white",
        gridColumn: "1 / -1"
      }}>
      Preview mode
    </div>
  ) : null;
}
