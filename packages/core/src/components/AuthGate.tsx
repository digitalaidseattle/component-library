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

export const AuthGate: React.FC<{ authorizedRoles: string[], children: React.ReactNode }> = ({ authorizedRoles, children }) => {

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
        if (!authService.isAuthorized(user, authorizedRoles)) {
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