import * as React from "react";
import { Button, FormControl, InputLabel, MenuItem, Box, Typography, Modal } from '@mui/material'
import Select from '@mui/material/Select';
import { DataGrid } from '@mui/x-data-grid';
import "./TableProduct.css";
import axios from "axios";
import { baseURL } from "../../constants/baseURL";
import AddIcon from '@mui/icons-material/Add';
import StarRateIcon from '@mui/icons-material/StarRate';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BasicTable() {
  const navigate = useNavigate();
  const [product, setProduct] = React.useState([]);
  const [productOriginal, setProductOriginal] = React.useState([]);
  const [brand, setBrand] = React.useState('All');
  const [category, setCategory] = React.useState('All');
  // SEARCH TEXT STATE
  const [searchText, setSearchText] = React.useState('');

  const [forSaleState, setForSaleState] = React.useState(false);
  React.useEffect(() => {
    // GET ALL PRODUCT
    axios.get(`${baseURL}/api/v1/product`)
      .then((res) => {
        setProduct(res.data);
        setProductOriginal(res.data);
      })
      .catch((err) => console.log(err))

  }, [forSaleState])

  React.useEffect(() => {
    // GET ALL PRODUCT
    axios.get(`${baseURL}/api/v1/product`)
      .then((res) => {
        setProduct(res.data);
        setProductOriginal(res.data);
      })
      .catch((err) => console.log(err))

  }, [])
  const showToastMessageSuccess = (message) => {
    toast.success(message, {
        position: toast.POSITION.TOP_RIGHT
    });
  };
  React.useEffect(() => {
    if (brand === 'All') {
      if (category === 'All') {
        setProduct(productOriginal);
      }
      else {
        let x = productOriginal.filter(
          (item) => item.category === category
        )
        setProduct(x);
      }
    }
    else {
      if (category === 'All') {
        let x = productOriginal.filter(
          (item) => item.brand === brand
        )
        setProduct(x);
      }
      else {
        let x = productOriginal.filter(
          (item) => item.brand === brand && item.category === category
        )
        setProduct(x);
      }
    }
  }, [brand, category])
  // SEARCH TEXT FUNCTION
  const searchedProduct = product.filter((item) => {
    if (searchText === '')
      return item;
    if (item.name.toLowerCase().includes(searchText.toLowerCase()))
      return item
  })
  const columns = [
    {
      field: "name", headerName: "Product", width: 500, renderCell: (params) => {
        let x = params.row.thumbnail
        let b = x.slice(0, -1);
        return (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
            <img src={b} style={{ width: 100, height: 100 }} />
            <p style={{ fontWeight: "bold", marginLeft: 10 }}>{params.row.name}</p>
          </div>
        )
      }
    },
    { field: "price", headerName: "Price", width: 120 },
    { field: "discount", headerName: "Promotion", width: 100 },
    {
      field: "rate", headerName: "Rate", width: 120, renderCell: (params) => {
        return (
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <p style={{ margin: 'auto' }}>{params.row.rate.toFixed(2)}</p> <StarRateIcon />
          </div>
        )
      }
    },
    {
      field: "action", headerName: "Action", width: 200, renderCell: (params) => {
        return (
          <div style={{ display: 'flex' }}>
            <button
              style={{ padding: 10, outline: 'none', border: 'none', backgroundColor: '#FF919D', color: "white" }}
              onClick={() => navigate(`/product/${params.row.id}`)}
            >
              <EditIcon /></button>
            <button
              style={{ padding: 10, outline: 'none', border: 'none', backgroundColor: 'grey', color: "white", marginLeft: 10, cursor: 'pointer' }}
              onClick={() => {
                axios.put(`${baseURL}/api/v1/product/setForSale?id=${params.row.id}&forSale=${!params.row.forSale}`)
                  .then((res) => {
                    showToastMessageSuccess(res.data.message);
                    setForSaleState(!forSaleState);
                  })
                  .catch((err) => console.log(err))
              }}
            >
              {
                params.row.forSale ? <LockIcon /> : <LockOpenIcon />
              }
            </button>
            <button
              style={{ padding: 10, outline: 'none', border: 'none', backgroundColor: 'red', color: "white", marginLeft: 10, cursor: 'pointer' }}
              onClick={() => {
                axios.delete(`${baseURL}/api/v1/product/softDelete?id=${params.row.id}&deleted=${true}`)
                .then((res) => {
                  showToastMessageSuccess(res.data.message);
                  setForSaleState(!forSaleState);
                })
                .catch((err) => console.log(err))
              }}
            >
              <DeleteIcon /></button>
          </div>
        )
      }
    },

  ];
  const handleChange = (event) => {
    setBrand(event.target.value);

  };
  const handleChange1 = (event) => {
    setCategory(event.target.value);


  };

  return (
    <>
      <ToastContainer />
      <div style={{ display: 'flex', justifyContent: "flex-end" }}>
        <div style={{ display: 'flex', alignItems: "center", width: 134, height: 56, marginRight: 320 }}>
          <div className="productFilter__search-input">
            <input
              value={searchText}
              placeholder={'Search'}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <Button style={{ marginLeft: 20, width: 300 }} onClick={() => navigate('/new-product')}><AddIcon /> Product</Button>

        </div>
        <FormControl
          style={{ width: 200, marginBottom: 20, marginRight: 10 }}
        >
          <InputLabel>Brand</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={brand}
            label="Brand"
            onChange={handleChange}
            style={{ backgroundColor: 'white' }}
          >
            {
              brandList.map((item) => (
                <MenuItem value={item}>{item}</MenuItem>
              ))
            }

          </Select>
        </FormControl>
        <FormControl
          style={{ width: 200, marginBottom: 20 }}
        >
          <InputLabel>Category</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={category}
            label="Category"
            onChange={handleChange1}
            style={{ backgroundColor: 'white' }}
          >
            {
              CategoryList.map((item) => (
                <MenuItem value={item}>{item}</MenuItem>
              ))
            }

          </Select>
        </FormControl>
        <Button onClick={() => {
          setBrand('All');
          setCategory('All');
          setSearchText('');
        }}>Refresh</Button>

      </div>
      <div className="Table" style={{ overflowY: 'scroll', height: 500 }}>

        <DataGrid className='data__grid'
          style={{ backgroundColor: 'white' }}
          rows={searchedProduct.filter(
            (item) => item.deleted === false
          )}
          columns={columns}

          pageSize={6}
          rowsPerPageOptions={[5]}
          // checkboxSelection
          disableSelectionOnClick
          // experimentalFeatures={{ newEditingApi: true }}
          rowHeight={100}
          getRowId={(row) => row.id}
          onRowClick={() => console.log("action")}
        />
      </div>
    </>
  );
}

const brandList = ['All', 'Samsung', 'Asus', 'Kingston', 'Intel', 'Logitech', 'MSI']
const CategoryList = ['All', 'Mainboard', 'CPU', 'SSD', 'Mouse', 'VGA', 'Keyboard', 'Screen', 'Ram']

const style = {
  overflowY: 'scroll',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  height: 600,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};