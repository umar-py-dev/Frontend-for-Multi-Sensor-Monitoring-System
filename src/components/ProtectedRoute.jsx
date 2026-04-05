// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LoadingService } from "../services/loadingService";


const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null = checking, true = yes, false = no

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    // Jab tak check ho raha hai, kuch mat dikhao (ya spinner dikhao)
    if (isAuthenticated === null) {
        return <div className="flex justify-center items-center">{LoadingService()}</div>;
    }

    // Agar authenticated nahi hai toh Login page par bhej do
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Agar authenticated hai toh requested page dikhao
    return children;
};

export default ProtectedRoute;