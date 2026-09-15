import { Children } from "react";

type ProtectedRouteProps = {
    children: React.ReactElement;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    return children;
}
