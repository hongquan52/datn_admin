import React, { useEffect, useState } from "react";
import "./ProductDetail.css";
import "./UploadImage.css";
import { useNavigate, useParams } from "react-router-dom";
import { Select, FormControl, MenuItem, InputLabel } from '@mui/material'
import axios from "axios";
import NoneProduct from '../../imgs/product/NoneProduct.png'
import { baseURL } from "../../constants/baseURL";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form'
import ClearIcon from '@mui/icons-material/Clear';
import FileUploadIcon from '@mui/icons-material/FileUpload';
const NewProduct = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate();
    const [brandList, setBrandList] = useState([]);
    const [brand, setBrand] = useState();
    const [categoryList, setCategoryList] = useState([]);
    const [category, setCategory] = useState();

    const [selectedImage, setSelectedImage] = useState('');

    const [selectedImage1, setSelectedImage1] = useState('');
    const [selectedImage2, setSelectedImage2] = useState('');
    const [selectedImage3, setSelectedImage3] = useState('');
    // FUNCTION====================
    // NOTIFY SUCESS
    const showToastMessageSuccess = (message) => {
        toast.success(message, {
            position: toast.POSITION.TOP_RIGHT
        });
    };
    // NOTIFY FAILED
    const showToastMessageError = (message) => {
        toast.error(message, {
            position: toast.POSITION.TOP_RIGHT
        });
    };
    // CREATE PRODUCT
    const createProduct = (data) => {
        if (brand !== undefined && category !== undefined) {
            var dataForm = new FormData();
            dataForm.append('name', data.name);
            dataForm.append('inventory', data.inventory);
            dataForm.append('price', data.price);
            dataForm.append('description', data.description);
            dataForm.append('thumbnail', selectedImage);
            dataForm.append('brand', brand);
            dataForm.append('category', category);
            dataForm.append('groupProduct', '1');

            axios.post(`${baseURL}/api/v1/product`, dataForm, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
                .then((res) => {
                    console.log(res.data)
                    showToastMessageSuccess(res.data.message);
                })
                .catch((err) => console.log("Create new product err: ", err))
        }
        else {
            showToastMessageError('Category or brand is empty')
        }
    }
    useEffect(() => {

        // GET ALL BRAND
        axios.get(`${baseURL}/api/v1/brand`)
            .then((res) => {
                setBrandList(res.data);
            })
            .catch((err) => console.log(err))
        // GET ALL BRAND
        axios.get(`${baseURL}/api/v1/category`)
            .then((res) => {
                setCategoryList(res.data);
            })
            .catch((err) => console.log(err))
    }, [])
    return (
        <div className="MainDash">
            <ToastContainer />
            <h1>New Product</h1>
            <div style={{ backgroundColor: 'white', width: '90%', borderRadius: 10, padding: 10, display: 'flex' }}>
                <div>
                    <div className="orderDetail__info-container">
                        <label className="orderDetail__label">Name</label>
                        <input
                            className="orderDetail__input"
                            {...register("name", { required: true })}
                        />

                    </div>
                    {errors.name && <span style={{ color: 'red', fontSize: "1rem" }}>Name is required</span>}
                    <div className="orderDetail__info-container">
                        <label className="orderDetail__label">Price</label>
                        <input
                            className="orderDetail__input"
                            type="number"
                            {...register("price", { required: true })}

                        />
                    </div>
                    {errors.price && <span style={{ color: 'red', fontSize: "1rem" }}>Price is required</span>}
                    <div className="orderDetail__info-container">
                        <label className="orderDetail__label">Inventory</label>
                        <input
                            type="number"
                            className="orderDetail__input"
                            {...register("inventory", { required: true })}
                        />
                    </div>
                    {errors.inventory && <span style={{ color: 'red', fontSize: "1rem" }}>Inventory is required</span>}
                    <div className="orderDetail__info-container">
                        <label className="orderDetail__label">Description</label>
                        <textarea
                            className="orderDetail__input1"
                            {...register("description", {
                                required: {
                                    value: false
                                }
                            })}
                        />
                    </div>
                    <div className="orderDetail__info-container">
                        <label className="orderDetail__label">Category</label>
                        <FormControl
                            style={{ width: 250, marginBottom: 20, marginLeft: 50 }}
                        >
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"

                                label="Category"
                                onChange={(e) => setCategory(e.target.value)}
                                style={{ backgroundColor: 'white' }}
                            >
                                {
                                    categoryList.map((item) => (
                                        <MenuItem value={item.id}>{item.name}</MenuItem>
                                    ))
                                }

                            </Select>
                        </FormControl>
                    </div>
                    <div className="orderDetail__info-container">
                        <label className="orderDetail__label">Brand</label>
                        <FormControl
                            style={{ width: 250, marginBottom: 20, marginLeft: 50 }}
                        >
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                // value={brand}

                                label="Brand"
                                onChange={(e) => setBrand(e.target.value)}
                                style={{ backgroundColor: 'white' }}
                            >
                                {
                                    brandList.map((item) => (
                                        <MenuItem value={item.id}>{item.name}</MenuItem>
                                    ))
                                }

                            </Select>
                        </FormControl>
                    </div>
                </div>
                <div style={{ marginLeft: 70, display: 'flex', justifyContent: "center", alignItems: 'center', flexDirection: 'column' }}>
                    <img
                        src={selectedImage ? URL.createObjectURL(selectedImage) : 'sldkfjslkdf'}
                        style={{ width: 300, height: 300, borderRadius: 10 }}
                    />
                    <div >
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <div className="buttonUpload buttonImage">
                                <FileUploadIcon />
                                <input
                                    type="file"
                                    className="inputfile"
                                    onChange={(event) => {
                                        setSelectedImage(event.target.files[0]);
                                    }}
                                />
                            </div>
                            <div
                                className="buttonRemove buttonImage"
                                onClick={() => setSelectedImage(null)}
                            >
                                <ClearIcon />
                            </div>
                        </div>
                        <div style={{ height: '5rem', display: 'flex', justifyContent: "space-around" }}>
                            <div
                                style={{ display: 'flex', position: 'relative', marginLeft: 2 }}
                            >
                                <img src={
                                    selectedImage1 ?
                                        URL.createObjectURL(selectedImage1)
                                        : NoneProduct
                                }
                                    style={{ width: 100 }}>

                                </img>
                                <input
                                    type="file"
                                    className="inputfileList"
                                    onChange={(event) => {
                                        setSelectedImage1(event.target.files[0]);
                                    }}
                                />
                            </div>
                            <div
                                style={{ display: 'flex', position: 'relative', marginLeft: 2 }}
                            >
                                <img src={
                                    selectedImage2 ?
                                        URL.createObjectURL(selectedImage2)
                                        : NoneProduct
                                }
                                    style={{ width: 100 }}>

                                </img>
                                <input
                                    type="file"
                                    className="inputfileList"
                                    onChange={(event) => {
                                        setSelectedImage2(event.target.files[0]);
                                    }}
                                />
                            </div>
                            <div
                                style={{ display: 'flex', position: 'relative', marginLeft: 2 }}
                            >
                                <img src={
                                    selectedImage3 ?
                                        URL.createObjectURL(selectedImage3)
                                        : NoneProduct
                                }
                                    style={{ width: 100 }}>

                                </img>
                                <input
                                    type="file"
                                    className="inputfileList"
                                    onChange={(event) => {
                                        setSelectedImage3(event.target.files[0]);
                                    }}
                                />
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
            <div className="orderDetail__footer">
                <button style={{ backgroundColor: '#F9813A' }} onClick={handleSubmit(createProduct)}>
                    Save
                </button>
                <button style={{ backgroundColor: 'red' }} onClick={() => navigate('/product')}>
                    Back
                </button>

            </div>
        </div>
    );
};

export default NewProduct;
