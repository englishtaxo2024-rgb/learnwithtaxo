import { Navigate, useLocation } from 'react-router-dom';
import { canAccess } from '../../utils/roleAccess';

export function RoleGuard({ user, area, children }) {
  const location = useLocation();
  if (!canAccess(user, area)) {
    return <Navigate to="/login" replace state={{ from: location.pathname, deniedArea: area }} />;
  }
  return children;
}
