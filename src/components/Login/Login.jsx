import React , {useState} from 'react'
import axios from 'axios';
import jwtDecode from 'jwt-decode'
import { baseURL } from '../../constants/baseURL';
import './Login.css'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Login = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const showToastMessageSuccess = (message) => {
        toast.success(message, {
            position: toast.POSITION.TOP_RIGHT
        });
    };
    const showToastMessageError = (message) => {
        toast.error(message, {
            position: toast.POSITION.TOP_RIGHT
        });
    };

    const loginHandle = () => {

        var data = new FormData();
        data.append('phone', userName);
        data.append('password', password);
        axios.post(`${baseURL}/auth/login`, data)
            .then((res) => {
                if(res.data.status === 'OK') {
                    sessionStorage.setItem('accessToken', res.data.data.accessToken);
                    sessionStorage.setItem('userName', res.data.data.name);

                    decoded(res.data.data.accessToken);
                    navigate('/home');
                    window.location.reload();
                }
                else {
                    showToastMessageError('Your phone or password is incorrect. Please enter again!')
                }
            })
    }
    const decoded = (token) => {
        const decoded = jwtDecode(token);
        const manguoidung = decoded.sub
        const manguoidung1 = parseInt(manguoidung);
        sessionStorage.setItem("userID", manguoidung1);
        
      }
    return (
        <div style={{ display: 'flex', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <div className='login__container'>
                <ToastContainer />
                <div className='login__header-container'>
                    <h5>Admin Dashboard</h5>
                </div>
                <div className='login__form-container'>
                    <div className='login__form-item'>
                        <label>Username</label>
                        <input
                            
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </div>
                    <div className='login__form-item'>
                        <label>Password</label>
                        <input
                            
                            type='password'
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className='login__form-item'>
                        <button
                            className='login__login-btn'
                            onClick={() => loginHandle()}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login