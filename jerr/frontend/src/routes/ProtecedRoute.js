import { Navigate } from "react-router";
import useAuth from "../context/auth";

function ProtectedRoute({ children }) {
	const { isAuthenticated, isLoading } = useAuth();
	return isAuthenticated || isLoading ? (
		children
	) : (
		<Navigate to="/home" replace />
	);
}

export default ProtectedRoute;
