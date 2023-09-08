import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { WithChildrenProps } from '@app/types/generalTypes';

const RequireAuth: React.FC<WithChildrenProps> = ({ children }) => {
  const token = useAppSelector((state) => state.auth);
  console.log("🚀 ~ file: RequireAuth.tsx:8 ~ token:", token)
  const user = useAppSelector((state) => state.user.user);

  return token && user ? <>{children}</> : <Navigate to="/auth/login" replace />;
};

export default RequireAuth;
