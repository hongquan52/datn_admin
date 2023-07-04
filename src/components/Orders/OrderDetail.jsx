import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, Modal, FormControl,InputLabel,Select,MenuItem } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ClearIcon from '@mui/icons-material/Clear';
import "./Orders.css";
import axios from "axios";
import { baseURL } from "../../constants/baseURL";
const OrderDetail = () => {
    const { orderId } = useParams();
    const [orderDetailData, setOrderDetailData] = useState({});
    const [open, setOpen] = useState(false);
    const [shipperList, setShipperList] = useState([]);

    const [shipperId, setShipperId] = useState('');

    const handleChangeShipper = (event) => {
        setShipperId(event.target.value);
      };
    useEffect(() => {
        axios.get(`${baseURL}/api/v1/order/${orderId}`)
            .then((res) => setOrderDetailData(res.data))
            .catch((err) => console.log(err))
        // GET ALL SHIPPER:
        axios.get(`${baseURL}/api/v1/user/shipper`)
            .then((res) => setShipperList(res.data))
            .catch((err) => console.log(err))
    }, [])
    // CREATE DELIVERY FUNCTION
    const createDelivery = () => {
        var data = new FormData();
        data.append('addressId', orderDetailData.addressId);
        data.append('orderId', orderId);
        data.append('shipperId', shipperId);
        axios.post(`${baseURL}/api/v1/delivery`, data)
            .then((res) => alert(res.data.message))
            .catch((err) => console.log(err))
    }
    // UPDATE STATUS ORDER
    const updateStatus = (status) => {
        let dataRaw = JSON.stringify({
            "totalPrice": orderDetailData.totalPrice,
            "shippingFee": orderDetailData.shippingFee,
            "finalPrice": orderDetailData.finalPrice,
            "addressId":orderDetailData.addressId,
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
            .then((res) => alert(res.data.message))
            .catch((err) => console.log("Update status: ", err))
    }
    return (
        <div className="MainDash">
            <Modal
                open={open}
                onClose={() => setOpen(!open)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Create delivery
                    </Typography>
                    <div className="orderDetail__info-container">
                        <label className="orderDetail__label">Address</label>
                        <textarea
                            className="orderDetail__input1"
                            value={orderDetailData.deliveryApartmentNumber + ", " + orderDetailData.deliveryWard + ", " + orderDetailData.deliveryDistrict + ", " + orderDetailData.deliveryProvince}
                        />
                    </div>
                    <div className="orderDetail__info-container" style={{marginTop: 50}}>
                        <label className="orderDetail__label">Shipper</label>
                        <FormControl
                            style={{ width: 250, marginLeft: 50}}
                        >
                            <InputLabel>Shipper</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={shipperId}
                                label="Shipper"
                                onChange={handleChangeShipper}
                                style={{ backgroundColor: 'white' }}
                            >
                                {
                                    shipperList.map((item) => (
                                        <MenuItem value={item.id}>{item.name}</MenuItem>
                                    ))
                                }
                                
                            </Select>
                        </FormControl>
                    </div>
                    <div style={{ display: "flex", justifyContent: 'space-around', marginTop: 60 }}>
                        <button className="orderDetail__deliveryBtn" onClick={() => {
                            updateStatus('Wait_Delivering');
                            createDelivery();
                            setOpen(false);
                        }}>
                            Confirm
                        </button>
                        <button className="orderDetail__deliveryBtn" onClick={() => setOpen(false)}>Cancel</button>
                    </div>
                </Box>
            </Modal>
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
                            value={orderDetailData.deliveryApartmentNumber + ", " + orderDetailData.deliveryWard + ", " + orderDetailData.deliveryDistrict + ", " + orderDetailData.deliveryProvince}
                        />
                    </div>
                </div>
                <div style={{ marginLeft: 70, display: 'flex', justifyContent: "center", alignItems: 'center' }}>
                    {
                        orderDetailData.paymentMethod === 'VNPAY' ?
                            <img src='https://inkythuatso.com/uploads/images/2021/12/vnpay-logo-inkythuatso-01-13-16-26-42.jpg'
                                style={{ width: 300, height: 300, borderRadius: 10 }}
                            />
                            :
                            <img src='https://png.pngtree.com/png-vector/20210529/ourlarge/pngtree-cod-cash-on-delivery-fast-png-image_3382624.jpg'
                                style={{ width: 300, height: 300, borderRadius: 10 }}
                            />
                    }

                </div>
            </div>
            <div className="orderDetail__footer">
                <button style={{ backgroundColor: 'green' }} onClick={() => updateStatus('Confirmed')}>
                    <CheckIcon />
                </button>
                <button style={{ backgroundColor: '#F9813A' }} /*disabled={true}*/ onClick={() => setOpen(true)}>
                    <LocalShippingIcon />
                </button>
                <button style={{ backgroundColor: 'red' }} onClick={() => updateStatus('Canceled')}>
                    <ClearIcon />
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