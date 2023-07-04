import React, { useEffect, useState } from "react";
import CustomerReview from "../CustomerReview/CustomerReview1";
import CustomerReview2 from "../CustomerReview/CustomerReview2";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import "./Statics.css";
import axios from "axios";
import { baseURL } from "../../constants/baseURL";
import CardsAmountOrder from "../Cards/CardsAmountOrder";
const Statics = () => {
    const [tab, settab] = useState('Order');
    const [salestProduct, setSalestProduct] = useState([]);
    const [newCustomer, setNewCustomer] = useState([]);
    // REVENUE LAST 7 DAYS:
    const [revenue7Days, setRevenue7Days] = useState([]);
    useEffect(() => {
        axios.get(`${baseURL}/statistic/total-revenue-in-7days`)
            .then((res) => {
                let x = res.data.map((item) => {
                    return item / 1000000
                })
                setRevenue7Days(x)
            })
            .catch((err) => console.log(err))
        // NEW CUSTOMER LAST 7 DAYS:
        axios.get(`${baseURL}/statistic/new-user-amount`)
            .then((res) => {
                setNewCustomer(res.data);
            })
            .catch((err) => console.log(err))
        // BEST SALE PRODUCT
        axios.get(`${baseURL}/statistic/sold-product-amount`)
            .then((res) => setSalestProduct(res.data))
            .catch((err) => console.log(err))
    }, [])

    return (
        <div className="MainDash">
            <h1>Statics</h1>
            <div style={{ display: 'flex', justifyContent: "space-around", marginBottom: 20, backgroundColor: "white" }}>
                {
                    staticBar.map((item) => (
                        <div className={item === tab ? 'statusBarActive' : 'statusBar'} onClick={() => settab(item)}>
                            <p style={{ textAlign: "center", width: 120 }}>{item}</p>
                        </div>
                    ))
                }

            </div>
            {
                tab === 'Last 7 days' && (
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <div>
                            <div>Revenue last 7 days (millions)</div>
                            <CustomerReview revenue7Days={revenue7Days} />
                        </div>
                        <div>
                            <div>New customer last 7 days</div>
                            <CustomerReview2 revenue7Days={newCustomer} />
                        </div>
                    </div>
                )
            }
            {
                tab === 'Order' && (
                    <div>

                        <CardsAmountOrder />
                    </div>
                )
            }
            {
                tab === 'Product' && (
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '100%', height: 400, backgroundColor: "white", margin: 5, boxShadow: "0px 13px 20px 0px #80808029"
                            , overflowY: 'scroll' }}>
                            <p style={{ fontSize: 22, textAlign: 'center' }}>Sản phẩm bán chạy nhất</p>
                            <TableContainer
                                component={Paper}
                                style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
                            >
                                <Table sx={{ minWidth: 500}} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell width={200}>Name</TableCell>
                                            <TableCell align="left">Revenue</TableCell>
                                            <TableCell align="left" width={70}>Amount sales</TableCell>
                                            <TableCell align="left">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody style={{ color: "white" }}>
                                        {salestProduct.map((row) => (
                                            <TableRow
                                                key={row}
                                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row" style={{display: 'flex', alignItems: 'center'}}>
                                                    <img src={row.product.thumbnail}
                                                        style={{width: 50, height: 50}}
                                                    />
                                                    <p style={{marginLeft: 5, fontSize: 13, fontWeight: 500}}>{row.product.name}</p>
                                                </TableCell>
                                                <TableCell align="left">{row.product.price*row.quantity}</TableCell>
                                                <TableCell align="left">{row.quantity}</TableCell>
                                                <TableCell align="left" className="Details" onClick={() => alert('product ID')}>Details</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        <div style={{ width: '100%', height: '100%', backgroundColor: 'grey', margin: 5 }}>
                            <h5 style={{ fontSize: 22, textAlign: 'center' }}>Sản phẩm đánh giá cao nhất</h5>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default Statics;

const staticBar = ['Order', 'Last 7 days', 'Product']