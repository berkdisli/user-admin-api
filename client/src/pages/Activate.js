import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { activateUser } from '../services/UserService';

const Activate = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const handleActivateUser = async () => {
        try {
            await activateUser({ token });
            navigate("/login")
        } catch (err) {
            toast.err(err.response.data.error.message)
        }
    }
    return (
        <div>
            <button onClick={handleActivateUser}> Activate User </button>
        </div>
    )
}

export default Activate