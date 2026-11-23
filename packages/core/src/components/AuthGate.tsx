/**
 *  AuthGate.ts
 * 
 * check if user is authenticated and has admin role, if not redirect to login page
 * 
 *  @copyright 2026 Digital Aid Seattle
 *
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthService, User } from "@digitalaidseattle/core";

/**
 * Returns true if the user's email belongs to one of the authorized domains.
 * If authorizedDomains is undefined, every user is allowed.
 * Matching is case-insensitive and tolerates a leading "@" (e.g. "@example.org").
 */
function isEnabledDomain(user: User, authorizedDomains: string[] | undefined): boolean {
  if (authorizedDomains === undefined) {
    return true;
  }
  const email = (user.email ?? user.user_metadata?.email ?? "").trim().toLowerCase();
  const at = email.lastIndexOf("@");
  if (at < 0) {
    return false;
  }
  const domain = email.slice(at + 1);
  const response = authorizedDomains.some(d => d.trim().toLowerCase().replace(/^@/, "") === domain);
  console.log(response, domain, authorizedDomains)
  return response
}

export const AuthGate: React.FC<{
  authorizedRoles?: string[],
  authorizedDomains?: string[],
  children: React.ReactNode
}> = ({ authorizedRoles, authorizedDomains, children }) => {

  const authService = useAuthService();
  const navigate = useNavigate();
  const [checking, setChecking] = useState<boolean>(true);

  useEffect(() => {
    let active = true;

    authService.getUser()
      .then(user => {
        if (!active) {
          return;
        }
        if (!user) {
          navigate("/login?code=Unauthenticated");
          return;
        }
        if (isEnabledDomain(user, authorizedDomains)) {
          if (authorizedRoles && !authService.isAuthorized(user, authorizedRoles)) {
            navigate("/error?code=AccessDenied");
            return;
          }
        } else {
          navigate("/login?code=AccessDenied");
          return;
        }
        setChecking(false);
      });

    return () => {
      active = false;
    };
  }, [authService, authorizedRoles, navigate]);

  return (!checking &&
    <>
      {children}
    </>
  );
}


