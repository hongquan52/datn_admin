import React from 'react'
import './NewCustomer.css'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form'
import axios from 'axios';
import { baseURL } from "../../constants/baseURL";

const NewCustomer = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate();
    // SUCESS NOTIFY
    const showToastMessageSuccess = (message) => {
        toast.success(message, {
            position: toast.POSITION.TOP_RIGHT
        });
    };
    // SUCESS NOTIFY
    const showToastMessageError = (message) => {
        toast.error(message, {
            position: toast.POSITION.TOP_RIGHT
        });
    };
    // CREATE USER FUNCTION
    const onSubmit = (data) => {
        const { name, email, phone, password } = data
        // showToastMessageSuccess();
        if (data.password !== data.password1) {
            showToastMessageError();
        } else {
            // showToastMessageSuccess();
            var dataForm = new FormData();
            dataForm.append('name', name);
            dataForm.append('email', email);
            dataForm.append('phone', phone);
            dataForm.append('password', password);
            dataForm.append('role', '1');
            axios.post(`${baseURL}/api/v1/user`, dataForm)
                .then((res) => {
                    if(res.data.status === 'OK') {
                        showToastMessageSuccess(res.data.message);
                    }
                    else {
                        showToastMessageError(res.data.message);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    showToastMessageError('Tạo tài khoản thất bại !!!')
                })
        }

    }
    
    return (
        <div className="MainDash">
            <h1>New customer</h1>
            <ToastContainer />
            <div style={{
                backgroundColor: 'white', width: '90%', borderRadius: 10, padding: 10, display: 'flex',
            }}>
                <div>
                    <div className="orderDetail__info-container">
                        <label className="orderDetail__label">Name</label>
                        <input
                            className="orderDetail__input"
                            {...register("name", { required: true })}
                        />
                        {errors.name && <span style={{ color: 'red', fontSize: "1rem", marginLeft: '1rem' }}>Name is required</span>}
                    </div>
                    <div className="orderDetail__info-container">
                        <label className="orderDetail__label">Email</label>
                        <input
                            className="orderDetail__input"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                    message: 'Please enter a valid email',
                                },
                            })}
                        />
                        {errors.email?.message && (
                            <span style={{ color: 'red', fontSize: "1rem", marginLeft: '1rem' }}>{errors.email?.message}</span>
                        )}
                    </div>
                    <div className="orderDetail__info-container">
                        <label className="orderDetail__label">Phone</label>
                        <input
                            className="orderDetail__input"
                            {...register("phone", { required: true })}
                        />
                        {errors.phone && <span style={{ color: 'red', fontSize: "1rem", marginLeft: '1rem' }}>Phone is required</span>}
                    </div>
                    <div className="orderDetail__info-container">
                        <label className="orderDetail__label">Password</label>
                        <input
                            className="orderDetail__input"
                            type='password'
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be 8 chars",
                                },
                                
                                validate: (value) => {
                                    return (
                                        [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].every((pattern) =>
                                            pattern.test(value)
                                        ) || "Include lower, upper, number, and special chars"
                                    );
                                },
                            })}
                        />
                        {errors.password && <span style={{ color: 'red', fontSize: "1rem", marginLeft: '1rem' }}>{errors.password.message}</span>}
                    </div>
                    <div className="orderDetail__info-container">
                        <label className="orderDetail__label">Password Again</label>
                        <input
                            className="orderDetail__input"
                            type='password'
                            {...register("password1", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be 8 chars",
                                },
                                validate: (value) => {
                                    return (
                                        [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].every((pattern) =>
                                            pattern.test(value)
                                        ) || "Include lower, upper, number, and special chars"
                                    );
                                },
                            })}
                        />
                        {errors.password1 && <span style={{ color: 'red', fontSize: "1rem", marginLeft: '1rem' }}>{errors.password1.message}</span>}
                    </div>

                </div>
                <div style={{ marginLeft: 70, display: 'flex', justifyContent: "center", alignItems: 'center' }}>

                </div>
            </div>
            <div className="orderDetail__footer">
                <button style={{ backgroundColor: '#FF919D' }} onClick={handleSubmit(onSubmit)} >
                    SAVE
                </button>
                <button style={{ backgroundColor: '#F9813A' }} onClick={() => navigate('/customer')}>
                    BACK
                </button>
            </div>
        </div>
    )
}

export default NewCustomer