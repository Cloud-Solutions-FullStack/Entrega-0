import React from 'react';

interface AuthNotificationProps {
    message: string;
    isError: boolean;
}

const AuthNotification: React.FC<AuthNotificationProps> = ({ message, isError }) => {
    return (
        <div className={`notification ${isError ? 'error' : 'success'}`}>
            {message}
        </div>
    );
};

export default AuthNotification;