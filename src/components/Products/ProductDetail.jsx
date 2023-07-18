import React, { useEffect, useState } from "react";
import "./ProductDetail.css";
import "./UploadImage.css";
import { useNavigate, useParams } from "react-router-dom";
import { Select, FormControl, MenuItem, InputLabel, Modal, Box, Typography } from '@mui/material'
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
    const [open, setOpen] = React.useState(false);
    const [brandList, setBrandList] = useState([]);
    const [brand, setBrand] = useState();
    const [categoryList, setCategoryList] = useState([]);
    const [category, setCategory] = useState();
    const [discountProductData, setDiscountProductData] = useState([])
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [discountID, setDiscountID] = useState(1);
    const [selectedImage, setSelectedImage] = useState('');

    const [selectedImage1, setSelectedImage1] = useState('');
    const [selectedImage2, setSelectedImage2] = useState('');
    const [selectedImage3, setSelectedImage3] = useState('');

    const [imagesProductOriginal, setImagesProductOriginal] = useState([]);
    const [imagesProduct, setImagesProduct] = useState([]);
    const [originalImage1, setOriginalImage1] = useState('');
    const [originalImage2, setOriginalImage2] = useState('');
    const [originalImage3, setOriginalImage3] = useState('');
    // FUNCTION====================
    // NOTIFY SUCESS
    // UPDATE DISOCUNT:
    const updateDiscount = () => {
        // COMPARE START / END DATE
        let x = new Date(startDate);
        let y = new Date(endDate);

        if (y.getTime() < x.getTime()) {
            showToastMessageSuccess('Ngày bắt đầu không thể sau ngày kết thúc!');
        }
        else {
            let discountId = parseInt(discountID);
            let z = formatDateJSON(startDate);
            let t = formatDateJSON(endDate);
            axios.post(`${baseURL}/api/v1/discount/product?productId=${productId}&discountId=${discountId}&startDate=${z}&endDate=${t}`)
                .then((res) => showToastMessageSuccess('Chỉnh sửa giảm giá sản phẩm thành công'))
                .catch((err) => console.log(err))
        }
    }
    const showToastMessageSuccess = (message) => {
        toast.success(message, {
            position: toast.POSITION.TOP_RIGHT
        });
    };
    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }
    function formatDate(date) {
        return (
            [
                date.getFullYear(),
                padTo2Digits(date.getMonth() + 1),
                padTo2Digits(date.getDate()),
            ].join('-')
        );
    }
    const convertDate = (dateString) => {

        let date_string = dateString; // Apr 03 2020
        let dateObj = new Date(date_string);

        return formatDate(dateObj);

    }
    const formatDateJSON = (date) => {
        let tempDate = new Date(date);
        var formattedDate = [tempDate.getFullYear(), tempDate.getMonth() + 1, tempDate.getDate(),].join('/');
        return formattedDate;
    }
    console.log(category, brand)
    // UPDATE PRODUCT
    const updateProduct = (data) => {
        if (selectedImage === '' && selectedImage1 === '' && selectedImage2 === '' && selectedImage3 === '') {

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
            {
                selectedImage1 !== '' &&
                    imagesProduct.push(selectedImage1);
            }
            {
                selectedImage2 !== '' &&
                    imagesProduct.push(selectedImage2);
            }
            {
                selectedImage3 !== '' &&
                    imagesProduct.push(selectedImage3);
            }

            var dataForm = new FormData();
            dataForm.append('name', data.name);
            dataForm.append('inventory', data.inventory);
            dataForm.append('price', data.price);
            dataForm.append('description', data.description);
            dataForm.append('brand', brand);
            dataForm.append('category', category);
            dataForm.append('groupProduct', '1');

            if (selectedImage !== '') {
                dataForm.append('thumbnail', selectedImage);
            }
            if (imagesProduct.length !== 0) {
                for (const item of imagesProduct) {
                    dataForm.append('images', item);
                }
            }
            console.log("sdfjsldfjskdfj: ", imagesProduct)

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
                setValue('discount', res.data.discountPercent);

                setBrand(res.data.brandId);
                setCategory(res.data.categoryId);
                setProductImage(res.data.thumbnail.slice(0, -1))
                // IMAGES PRODUCT
                let xyz = [];
                res.data.images.map((item) => {
                    xyz.push(item.slice(0, -1))
                })
                setImagesProductOriginal(xyz);

                // // GET THUMBNAIL PRODUCT
                // axios.get(`${baseURL}/api/v1/user/image?filename=${res.data.thumbnail}`)
                //     .then((res1) => {
                //         let b = res1.data.slice(0, -1);
                //         setProductImage(b);
                //     })
                //     .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
        // GET DISCOUNT
        axios.get(`${baseURL}/api/v1/discount/product?productId=${productId}`)
            .then((res) => {
                setDiscountProductData(res.data);
                setValue('discount', res.data[0].discount.percent);
                setStartDate(res.data[0].startDate);
                setEndDate(res.data[0].endDate);
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
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Chỉnh sửa giảm giá
                    </Typography>
                    <div>

                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Mức giảm giá (%)
                        </Typography>
                        <input placeholder="Phần trăm giảm" className='banner__edit-input' defaultValue={productData.discountPercent}
                            onChange={(e) => setDiscountID(e.target.value)}
                            type="number"
                        />

                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <div style={{ marginRight: 10 }}>
                                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                    Ngày bắt đầu
                                </Typography>

                                <input placeholder="Mã bảng hiệu" className='banner__edit-input' type="date"
                                    defaultValue={convertDate(discountProductData[0]?.startDate)}
                                    onChange={(e) => {
                                        setStartDate(e.target.value);

                                    }}
                                />
                            </div>
                            <div>
                                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                    Ngày kết thúc
                                </Typography>
                                <input placeholder="Mã bảng hiệu" className='banner__edit-input' type="date"
                                    defaultValue={convertDate(discountProductData[0]?.endDate)}
                                    onChange={(e) => {
                                        setEndDate(e.target.value);

                                    }}
                                />
                            </div>
                        </div>

                    </div>
                    <button
                        onClick={() => updateDiscount()}
                        style={{padding: 6, marginTop: 20}}
                        >Lưu giảm giá
                    </button>


                </Box>
            </Modal>
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
                    <div className="orderDetail__info-container">
                        <label className="orderDetail__label">Discount</label>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                className="orderDetail__input"
                                readOnly
                                {...register("discount")}
                            />
                            <button style={{marginLeft: 5 }} onClick={() => setOpen(true)}>Edit</button>
                        </div>
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
                                    : imagesProductOriginal[0] !== undefined ? imagesProductOriginal[0] : NoneProduct
                            }
                                style={{ width: 100 }}>

                            </img>
                            <input
                                type="file"
                                className="inputfileList"
                                onChange={(event) => {
                                    setSelectedImage1(event.target.files[0]);
                                    // setImagesProduct(imagesProduct?.push(event.target.files[0]))
                                }}
                            />
                        </div>
                        <div
                            style={{ display: 'flex', position: 'relative', marginLeft: 2 }}
                        >
                            <img src={
                                selectedImage2 ?
                                    URL.createObjectURL(selectedImage2)
                                    : imagesProductOriginal[1] !== undefined ? imagesProductOriginal[1] : NoneProduct
                            }
                                style={{ width: 100 }}>

                            </img>
                            <input
                                type="file"
                                className="inputfileList"
                                onChange={(event) => {
                                    setSelectedImage2(event.target.files[0]);
                                    // setImagesProduct(imagesProduct?.push(event.target.files[0]))
                                }}
                            />
                        </div>
                        <div
                            style={{ display: 'flex', position: 'relative', marginLeft: 2 }}
                        >
                            <img src={
                                selectedImage3 ?
                                    URL.createObjectURL(selectedImage3)
                                    : imagesProductOriginal[2] !== undefined ? imagesProductOriginal[2] : NoneProduct
                            }
                                style={{ width: 100 }}>

                            </img>
                            <input
                                type="file"
                                className="inputfileList"
                                onChange={(event) => {
                                    setSelectedImage3(event.target.files[0]);
                                    // setImagesProduct(imagesProduct?.push(event.target.files[0]))
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

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
