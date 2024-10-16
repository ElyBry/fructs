import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

const ProtectedRoute = ({ element }) => {
    const user = localStorage.getItem('user');
    console.log(user);
    const isAdmin = true;

    if (!isAdmin) {
        return <Navigate to="/login" />;
    }

    return element;
};

export default ProtectedRoute;
