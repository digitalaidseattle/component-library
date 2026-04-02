/**
 *  AuthGate.ts
 * 
 * check if user is authenticated and has admin role, if not redirect to login page
 * 
 *  @copyright 2026 Digital Aid Seattle
 *
 */
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthService, User } from "@digitalaidseattle/core";

export const AuthGate: React.FC<{ authorizedRoles: string[], children: React.ReactNode }> = ({ authorizedRoles, children }) => {

  const authService = useAuthService();
  const navigate = useNavigate();

  useEffect(() => {
    authService.getUser()
      .then(user => {
        if (!user) {
          navigate("/login?code=Unauthenticated");
        } else {
          if (!isAuthorized(user)) {
            navigate("/login?code=AccessDenied");
          }
        }
      })
  }, [authService]);

  function isAuthorized(user: User): boolean {
    const metadata: any = user.user_metadata;
    if (metadata.roles) {
      return (metadata.roles as string[]).some(role => authorizedRoles.includes(role));
    }
    return false;
  }

  return (
    <>
      {children}
    </>
  );
}