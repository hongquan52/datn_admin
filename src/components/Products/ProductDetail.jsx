import React, { useEffect, useState } from "react";
import "./ProductDetail.css";
import "./UploadImage.css";
import { useNavigate, useParams } from "react-router-dom";
import { Select, FormControl, MenuItem, InputLabel } from '@mui/material'
import axios from "axios";
import { baseURL } from "../../constants/baseURL";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form'
import ClearIcon from '@mui/icons-material/Clear';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import NoneProduct from '../../imgs/product/NoneProduct.png'

const ProductDetail = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate();
    const { productId } = useParams();
    const [productData, setProductData] = useState([]);
    const [productImage, setProductImage] = useState('');

    const [brandList, setBrandList] = useState([]);
    const [brand, setBrand] = useState();
    const [categoryList, setCategoryList] = useState([]);
    const [category, setCategory] = useState();

    const [selectedImage, setSelectedImage] = useState('');

    const [selectedImage1, setSelectedImage1] = useState('');
    const [selectedImage2, setSelectedImage2] = useState('');
    const [selectedImage3, setSelectedImage3] = useState('');

    const [imagesProduct, setImagesProduct] = useState([]);
    const [originalImage1, setOriginalImage1] = useState('');
    const [originalImage2, setOriginalImage2] = useState('');
    const [originalImage3, setOriginalImage3] = useState('');
    // FUNCTION====================
    // NOTIFY SUCESS
    
    const showToastMessageSuccess = (message) => {
        toast.success(message, {
            position: toast.POSITION.TOP_RIGHT
        });
    };
    console.log(category, brand)
    // UPDATE PRODUCT
    const updateProduct = (data) => {
        if (selectedImage === '') {
            
            var dataForm = new FormData();
            dataForm.append('name', data.name);
            dataForm.append('inventory', data.inventory);
            dataForm.append('price', data.price);
            dataForm.append('description', data.description);
            dataForm.append('brand', brand);
            dataForm.append('category', category);
            dataForm.append('groupProduct', '1');

            axios.put(`${baseURL}/api/v1/product?id=${productId}`, dataForm)
                .then((res) => {
                    console.log(res.data)
                    showToastMessageSuccess(res.data.message);
                })
                .catch((err) => console.log("Update new product err: ", err))
        }
        else {
            var dataForm = new FormData();
            dataForm.append('name', data.name);
            dataForm.append('inventory', data.inventory);
            dataForm.append('price', data.price);
            dataForm.append('description', data.description);
            dataForm.append('thumbnail', selectedImage);
            dataForm.append('brand', brand);
            dataForm.append('category', category);
            dataForm.append('groupProduct', '1');

            axios.put(`${baseURL}/api/v1/product?id=${productId}`, dataForm, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
                .then((res) => {
                    showToastMessageSuccess(res.data.message);
                })
                .catch((err) => console.log("Update new product err: ", err))
        }
    }

    // GET PRODUCT DETAIL
    useEffect(() => {
        axios.get(`${baseURL}/api/v1/product/${productId}`)
            .then((res) => {
                setProductData(res.data);
                setValue('name', res.data.name);
                setValue('inventory', res.data.inventory);
                setValue('price', res.data.price);
                setValue('description', res.data.description);

                setBrand(res.data.brandId);
                setCategory(res.data.categoryId);
                setProductImage(res.data.thumbnail.slice(0,-1))
                // IMAGES PRODUCT
                let xyz = [];
                res.data.images.map((item) => {
                    xyz.push(item.slice(0,-1))
                })
                setImagesProduct(xyz);

                // // GET THUMBNAIL PRODUCT
                // axios.get(`${baseURL}/api/v1/user/image?filename=${res.data.thumbnail}`)
                //     .then((res1) => {
                //         let b = res1.data.slice(0, -1);
                //         setProductImage(b);
                //     })
                //     .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
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
            <h1>Product detail : {productId}</h1>
            <div style={{ backgroundColor: 'white', width: '90%', borderRadius: 10, padding: 10, display: 'flex' }}>
                <div>
                    <div className="orderDetail__info-container">
                        <label className="orderDetail__label">Name</label>
                        <input
                            className="orderDetail__input"

                            {...register("name", { required: true })}
                        />

                    </div>
                    {/* {errors.name && <span style={{ color: 'red', fontSize: "14px" }}>Name is required</span>} */}
                    <div className="orderDetail__info-container">
                        <label className="orderDetail__label">Price</label>
                        <input
                            className="orderDetail__input"

                            {...register("price", { required: true })}
                        />
                    </div>
                    <div className="orderDetail__info-container">
                        <label className="orderDetail__label">Inventory</label>
                        <input
                            className="orderDetail__input"

                            {...register("inventory", { required: true })}
                        />
                    </div>

                    <div className="orderDetail__info-container">
                        <label className="orderDetail__label">Description</label>
                        <textarea
                            className="orderDetail__input1"

                            {...register("description", { required: true })}
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
                                defaultValue={category}
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
                                defaultValue={brand}
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
                        src={selectedImage ? URL.createObjectURL(selectedImage) : productImage}
                        style={{ width: 300, height: 300, borderRadius: 10 }}
                    />
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
                                    : imagesProduct[0] !== undefined ? imagesProduct[0] : NoneProduct
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
                                    : imagesProduct[1] !== undefined ? imagesProduct[1] : NoneProduct
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
                                    : imagesProduct[2] !== undefined ? imagesProduct[2] : NoneProduct
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
            <div className="orderDetail__footer">
                <button style={{ backgroundColor: '#F9813A' }} onClick={handleSubmit(updateProduct)}>
                    Save
                </button>
                <button style={{ backgroundColor: 'red' }} onClick={() => navigate('/product')}>
                    Back
                </button>

            </div>
        </div>
    );
};

export default ProductDetail;
