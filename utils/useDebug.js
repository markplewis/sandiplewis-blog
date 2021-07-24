import { useRouter } from "next/router";

export default function useDebug() {
  const router = useRouter();
  const { debug } = router.query;
  return debug === "true";
}
