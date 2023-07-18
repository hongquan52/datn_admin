import * as React from "react";
import {FormControl, InputLabel, MenuItem} from '@mui/material'
import Select from '@mui/material/Select';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import { DataGrid } from '@mui/x-data-grid';
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./TableOrder.css";
import axios from "axios";
import { baseURL } from "../../constants/baseURL";
import QLPAY from '../../imgs/QLPAY.JPG'
import COD from '../../imgs/COD.jpg'
import StarRateIcon from '@mui/icons-material/StarRate';
import { useNavigate } from "react-router-dom";

function createData(name, trackingId, date, status) {
  return { name, trackingId, date, status };
}


const makeStyle = (status) => {
  if (status === 'Approved') {
    return {
      background: 'rgb(145 254 159 / 47%)',
      color: 'green',
    }
  }
  else if (status === 'Pending') {
    return {
      background: '#ffadad8f',
      color: 'red',
    }
  }
  else {
    return {
      background: '#59bfff',
      color: 'white',
    }
  }
}

export default function BasicTable() {
  const navigate = useNavigate();
  const [status, setStatus] = React.useState('Ordered');
  const [orderData, setOrderData] = React.useState([]);

  React.useEffect(() => {
    axios.get(`${baseURL}/api/v1/order`)
      .then((res) => setOrderData(res.data))
      .catch((err) => console.log(err))
  }, [])
  React.useEffect(() => {
    axios.get(`${baseURL}/api/v1/order`)
      .then((res) => {
        let x = res.data.filter(
          (item) => item.status === status
        )
        setOrderData(x);
      })
      .catch((err) => console.log(err))
  }, [status])
  
  const columns = [
    { field: "orderId", headerName: "ID", width: 30 },
    { field: "userName", headerName: "Customer", width: 150 },
    { field: "orderedDate", headerName: "Order date", width: 170 },
    { field: "finalPrice", headerName: "Price", width: 130 },
    // { field: "paymentMethod", headerName: "Payment type", width: 200 },
    { field: "paymentMethod", headerName: "Payment", width: 200, renderCell: (params) => {
        if(params.row.paymentMethod === 'VNPAY') {
            return (
                <img src={QLPAY}
                    style={{width: 60, height: 60, borderRadius: 10}}
                />
            )
        }
        else {
            return (
                <img src={COD}
                    style={{width: 60, height: 60, borderRadius: 10}}
                />
            )
        }
    } },
    { field: "status", headerName: "Status", width: 150, renderCell: (params) => {
      if(params.row.status === 'Done') {
          return (
              <p
                  className='order__status-view'
                  style={{padding: 10,borderRadius: 10,fontWeight: 'bold',backgroundColor:'green', color: 'white'}}
              >Done</p>
          )
      }
      else if(params.row.status === 'Ordered') {
          return (
              <p
                  className='order__status-view'
                  style={{padding: 10,borderRadius: 10,fontWeight: 'bold',backgroundColor:'blue', color: 'white'}}
              >Ordered</p>
          )
      }
      else if(params.row.status === 'Confirmed') {
          return (
              <p
                  className='order__status-view'
                  style={{padding: 10,borderRadius: 10,fontWeight: 'bold',backgroundColor:'#14d9e3', color: 'black'}}
              >Confirmed</p>
          )
      }
      else if (params.row.status==='Wait_Delivering') {
          return (
              <p
                  className='order__status-view'
                  style={{padding: 10,borderRadius: 10,fontWeight: 'bold',backgroundColor:'#F9813A', color: 'white'}}
              >Wait delivery</p>
          )
      }
      else if(params.row.status === 'Delivering') {
          return (
              <p
                  className='order__status-view'
                  style={{padding: 10,borderRadius: 10,fontWeight: 'bold',backgroundColor:'yellow', color: 'black'}}
              >Delivering</p>
          )
      }
      else if(params.row.status === 'Cancel') {
          return (
              <p
                  className='order__status-view'
                  style={{padding: 10,borderRadius: 10,fontWeight: 'bold',backgroundColor:'red', color: 'white'}}
              >Canceled</p>
          )
      }
      else if(params.row.status === 'Delivered') {
          return (
              <p
                  className='order__status-view'
                  style={{padding: 10,borderRadius: 10,fontWeight: 'bold',backgroundColor:'green', color: 'white'}}
              >Delivered</p>
          )
      }
  }},
    {
      field: "action", headerName: "Action", width: 70, renderCell: (params) => {
        return (
        <button
          className="order__view-btn"
          onClick={() => {
            navigate(`/order/${params.row.orderId}`);
          }}
        >
          View</button>)
      }
    },

  ];
  
  return (
    <>
      <div style={{display: 'flex', justifyContent: "space-around", marginBottom: 20, backgroundColor: "white"}}>
        {
          statusList.map((item) => (
            <div className={item !==status ? 'statusBar' : 'statusBarActive'} onClick={() => {
              setStatus(item)
            }}>
              {
                item==='Wait_Delivering' ? <p style={{textAlign: "center", width: 120}}>Wait delivery</p> : <p style={{textAlign: "center", width: 120}}>{item}</p>
              }
              
            </div>
          ))
        }
        
      </div>
      <div className="Table">

        <DataGrid className='data__grid'
          style={{ backgroundColor: 'white' }}
          rows={orderData}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 8,
              },
            },
          }}
          pageSizeOptions={[5]}
          // pageSize={8}
          rowsPerPageOptions={[5]}
          // checkboxSelection
          disableSelectionOnClick
          // experimentalFeatures={{ newEditingApi: true }}
          autoHeight
          getRowId={(row) => row.orderId}
          onRowClick={() => console.log("action")}
        />
      </div>
    </>
  );
}

const statusList = ['Ordered','Wait_Delivering', 'Delivering', 'Delivered', 'Done', 'Cancel']
