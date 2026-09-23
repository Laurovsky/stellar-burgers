import {
  selectUser,
  selectUserIsAuthChecked,
  selectUserIsLoading
} from '../../services/slices/userSlice';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false
}: ProtectedRouteProps) => {
  const location = useLocation();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectUserIsLoading);
  const isAuthChecked = useSelector(selectUserIsAuthChecked);

  if (isLoading) {
    return <Preloader />;
  }

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (onlyUnAuth && user) {
    return <Navigate to='/' replace />;
  }

  return children;
};
