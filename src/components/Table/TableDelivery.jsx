import * as React from "react";

import { DataGrid } from '@mui/x-data-grid';

import "./TableDelivery.css";
import axios from "axios";
import { baseURL } from "../../constants/baseURL";
import { useState } from "react";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BasicTable() {
  const [lateDelivery, setLateDelivery] = useState([])
  const [reload, setReload] = useState(false);

  const showToastMessage = (message) => {
    toast.success(message, {
        position: toast.POSITION.TOP_RIGHT
    });
};
  React.useEffect(() => {
    axios.get(`${baseURL}/api/v1/delivery/late-delivering`)
    .then((res) => setLateDelivery(res.data))
    .catch((err) => console.log(err))

  }, [])
  React.useEffect(() => {
    axios.get(`${baseURL}/api/v1/delivery/late-delivering`)
    .then((res) => setLateDelivery(res.data))
    .catch((err) => console.log(err))

  }, [reload])
  const cancelDelivery = (id) => {
    axios.put(`${baseURL}/api/v1/delivery/cancel-delivery?deliveryId=${id}`)
      .then((res) => {
        showToastMessage(res.data);
        setReload(!reload);
      })
  }
  const columns = [
    { field: "id", headerName: "Mã đơn hàng", width: 150 },
    { field: "totalPrice", headerName: "Giá", width: 100 },
    
    { field: "shipper", headerName: "Shipper", width: 150, renderCell: (params) => {
      return (
        <div>
          <p>{params.row.shipperName}</p>
          <p>{params.row.shipperPhone}</p>
        </div>
      )
    } },
    {
      field: "address", headerName: "Địa chỉ", width: 400, renderCell: (params) => {
        return (
          <div style={{ }}>
            <p>{params.row.deliveryApartmentNumber}</p>
            <p>{params.row.deliveryWard[0] === '{' ? JSON.parse(params.row.deliveryWard).ward_name : params.row.deliveryWard}, {params.row.deliveryDistrict[0] === '{' ? JSON.parse(params.row.deliveryDistrict).district_name : params.row.deliveryDistrict}, {params.row.deliveryProvince}</p>
            
          </div>
        )
      }
    },
    {
      field: "action", headerName: "Action", width: 100, renderCell: (params) => {
        return (<button
          style={{ padding: 10, outline: 'none', border: 'none', backgroundColor: 'green', color: "white", cursor: 'pointer'}}
          onClick={() => {
            cancelDelivery(params.row.id);
          }}
        >
          Khôi phục</button>)
      }
    },

  ];

  return (
    <>
      
      {/* <div style={{display: 'flex', justifyContent: "space-between"}}>

        <FormControl
          style={{width: 500, marginBottom: 20}}
        >
          <InputLabel>Product</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={productIdSelected}
            label="Product"
            onChange={handleChange}
            style={{backgroundColor: 'white'}}
          >
            {
              product.map((item) => (
                <MenuItem value={item.id}>{item.name}</MenuItem>
              ))
            }
            
          </Select>
        </FormControl>
        <FormControl
          style={{width: 100, marginBottom: 20}}
        >
          <InputLabel>Rating</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={voteSelected}
            label="Rating"
            onChange={handleChangeRating}
            style={{backgroundColor: 'white'}}
          >
            <MenuItem value={1}>{1}</MenuItem>
            <MenuItem value={2}>{2}</MenuItem>
            <MenuItem value={3}>{3}</MenuItem>
            <MenuItem value={4}>{4}</MenuItem>
            <MenuItem value={5}>{5}</MenuItem>
            <MenuItem value={''}>All</MenuItem>
          </Select>
        </FormControl>
      </div> */}
      <div className="Table">
        <ToastContainer />
        <DataGrid className='data__grid'
          style={{ backgroundColor: 'white' }}
          rows={lateDelivery}
          columns={columns}
          // pageSize={6}
          // rowsPerPageOptions={[5]}

          // checkboxSelection
          disableSelectionOnClick
          // experimentalFeatures={{ newEditingApi: true }}
          autoHeight
          getRowId={(row) => row.id}
          onRowClick={() => console.log("action")}
        />
      </div>
    </>
  );
}

