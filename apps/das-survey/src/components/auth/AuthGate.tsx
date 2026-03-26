import { UserContext, useAuthService } from "@digitalaidseattle/core";
import { Box, CircularProgress } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

type GateStatus = "loading" | "ready" | "unauthenticated";

export default function AuthGate() {
  const authService = useAuthService();
  const { setUser } = useContext(UserContext);
  const location = useLocation();
  const [status, setStatus] = useState<GateStatus>("loading");

  useEffect(() => {
    let cancelled = false;

    async function syncUser() {
      if (authService.getProviders().length === 0) {
        if (!cancelled) {
          setUser(undefined);
          setStatus("ready");
        }
        return;
      }

      try {
        const user = await authService.getUser();
        if (!cancelled) {
          setUser(user ?? undefined);
          setStatus(user ? "ready" : "unauthenticated");
        }
      } catch (error) {
        console.error("Unable to resolve authenticated user", error);
        if (!cancelled) {
          setUser(undefined);
          setStatus("unauthenticated");
        }
      }
    }

    void syncUser();

    return () => {
      cancelled = true;
    };
  }, [authService, location.key, setUser]);

  if (status === "loading") {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (status === "unauthenticated") {
    const nextPath = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={`/login?next=${encodeURIComponent(nextPath)}`} replace />;
  }

  return <Outlet />;
}
