import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, Modal, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ClearIcon from '@mui/icons-material/Clear';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import "./Orders.css";
import axios from "axios";
import { baseURL } from "../../constants/baseURL";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QLPAY from '../../imgs/QLPAY.JPG'
import COD from '../../imgs/COD.jpg'
const OrderDetail = () => {
    const { orderId } = useParams();
    const [orderDetailData, setOrderDetailData] = useState({});
    const [open, setOpen] = useState(false);
    const [shipperList, setShipperList] = useState([]);

    const [ward, setWard] = useState('');
    const [district, setDistrict] = useState('');

    const [shipperId, setShipperId] = useState('');

    const handleChangeShipper = (event) => {
        setShipperId(event.target.value);
    };
    // NOTIFY
    const showToastMessage = (message) => {
        toast.success(message, {
            position: toast.POSITION.TOP_RIGHT
        });
    };
    const showToastMessageError = (message) => {
        toast.error(message, {
            position: toast.POSITION.TOP_RIGHT
        });
    };
    useEffect(() => {
        axios.get(`${baseURL}/api/v1/order/${orderId}`)
            .then((res) => {
                setOrderDetailData(res.data);

                if (res.data.deliveryWard[0] === '{') {
                    let x = JSON.parse(res.data.deliveryWard)
                    setWard(x.ward_name);
                }
                else {
                    setWard(res.data.deliveryWard);
                }
                if (res.data.deliveryDistrict[0] === '{') {
                    let x = JSON.parse(res.data.deliveryDistrict)
                    setDistrict(x.district_name);
                }
                else {
                    setDistrict(res.data.deliveryDistrict);
                }

            })
            .catch((err) => console.log(err))
        // GET ALL SHIPPER:
        axios.get(`${baseURL}/api/v1/user/shipper`)
            .then((res) => setShipperList(res.data))
            .catch((err) => console.log(err))
    }, [])
    // CREATE DELIVERY FUNCTION
    const createDelivery = () => {
        if (shipperId === '') {
            showToastMessageError('Vui lòng chọn người giao hàng!');
        }
        else {
            var data = new FormData();
            data.append('addressId', orderDetailData.addressId);
            data.append('orderId', orderId);
            data.append('shipperId', shipperId);
            axios.post(`${baseURL}/api/v1/delivery`, data)
                .then((res) => showToastMessage(res.data.message))
                .catch((err) => console.log(err))
        }
    }
    // UPDATE STATUS ORDER
    const updateStatus = (status) => {

        let dataRaw = JSON.stringify({
            "totalPrice": orderDetailData.totalPrice,
            "shippingFee": orderDetailData.shippingFee,
            "finalPrice": orderDetailData.finalPrice,
            "addressId": orderDetailData.addressId,
            "note": orderDetailData.note,
            "status": status,
            "paymentMethod": orderDetailData.paymentMethod
        });
        let config = {
            headers: {
                'Content-Type': 'application/json'
            },
        };
        axios.put(`${baseURL}/api/v1/order?orderId=${orderId}`, dataRaw, config)
            .then((res) => showToastMessage(res.data.message))
            .catch((err) => console.log("Update status: ", err))

    }
    return (
        <div className="MainDash">
            <ToastContainer />
            
            <h1>Order detail</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h4>ORDER ID: {orderId}</h4>
                <h4 style={{ marginRight: 80 }}>{orderDetailData.status}</h4>
            </div>
            <div style={{ backgroundColor: 'white', width: '90%', height: 370, borderRadius: 10, padding: 10, display: 'flex' }}>
                <div>
                    <div className="orderDetail__info-container">
                        <label className="orderDetail__label">Customer</label>
                        <input
                            className="orderDetail__input"
                            value={orderDetailData.userName}
                        />
                    </div>
                    <div className="orderDetail__info-container">
                        <label className="orderDetail__label">Price</label>
                        <input
                            className="orderDetail__input"
                            value={orderDetailData.totalPrice}
                        />
                    </div>
                    <div className="orderDetail__info-container">
                        <label className="orderDetail__label">Shipping</label>
                        <input
                            className="orderDetail__input"
                            value={orderDetailData.shippingFee}
                        />
                    </div>
                    <div className="orderDetail__info-container">
                        <label className="orderDetail__label">Final price</label>
                        <input
                            className="orderDetail__input"
                            value={orderDetailData.finalPrice}
                        />
                    </div>
                    <div className="orderDetail__info-container">
                        <label className="orderDetail__label">Note</label>
                        <textarea
                            className="orderDetail__input1"
                            value={orderDetailData.note}
                        />

                    </div>
                    <div className="orderDetail__info-container">
                        <label className="orderDetail__label">Address</label>
                        <textarea
                            className="orderDetail__input1"
                            value={orderDetailData.deliveryApartmentNumber + ", " + ward + ", " + district + ", " + orderDetailData.deliveryProvince}
                        />
                    </div>
                </div>
                <div style={{ marginLeft: 70, display: 'flex', justifyContent: "center", alignItems: 'center' }}>
                    {
                        orderDetailData.paymentMethod === 'VNPAY' ?
                            <img src={QLPAY}
                                style={{ width: 300, height: 300, borderRadius: 10 }}
                            />
                            :
                            <img src={COD}
                                style={{ width: 300, height: 300, borderRadius: 10 }}
                            />
                    }

                </div>
            </div>
            <div className="orderDetail__footer">
                <button
                    style={{ backgroundColor: orderDetailData.status === 'Ordered' ? 'green' : 'grey' }}
                    onClick={() => updateStatus('Wait_Delivering')}
                    disabled={orderDetailData.status === 'Ordered' ? false : true}
                >
                    <CheckIcon />
                </button>
                {/* <button 
                    style={{ backgroundColor: orderDetailData.status === 'Confirmed' ? '#F9813A' : 'grey' }} 
                    onClick={() => setOpen(true)}
                    
                    disabled={ orderDetailData.status === 'Confirmed' ? false : true }
                >
                    <LocalShippingIcon />
                </button> */}
                <button style={{ backgroundColor: orderDetailData.status === 'Ordered' ? 'red' : 'grey' }}
                    onClick={() => updateStatus('Canceled')}
                    disabled={orderDetailData.status === 'Ordered' ? false : true}
                >
                    <ClearIcon />
                </button>
                <button
                    style={{ backgroundColor: orderDetailData.status === 'Delivered' || orderDetailData.status === 'Received' ? 'green' : 'grey' }}
                    onClick={() => updateStatus('Done')}
                    disabled={orderDetailData.status === 'Delivered' || orderDetailData.status === 'Received' ? false : true}
                >
                    <CheckBoxIcon />
                </button>

            </div>

        </div>
    );
};

export default OrderDetail;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 300,
    bgcolor: 'background.paper',

    boxShadow: 24,
    p: 4,
};