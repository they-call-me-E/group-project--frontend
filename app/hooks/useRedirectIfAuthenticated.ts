import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const useRedirectIfAuthenticated = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/map");
    }
  }, [status, router]);

  return { session, status };
};

export default useRedirectIfAuthenticated;
