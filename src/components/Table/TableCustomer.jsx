import * as React from "react";
import { Button, FormControl, InputLabel, MenuItem, Box, Typography, Modal } from '@mui/material'
import Select from '@mui/material/Select';
import { DataGrid } from '@mui/x-data-grid';
import "./TableCustomer.css";
import axios from "axios";
import { baseURL } from "../../constants/baseURL";
import AddIcon from '@mui/icons-material/Add';
import StarRateIcon from '@mui/icons-material/StarRate';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from "react-router-dom";

export default function BasicTable() {
  const navigate = useNavigate();
  const [userList, setUserList] = React.useState([]);
  const [searchText, setSearchText] = React.useState('');
  // LOCK PRODUCT STATE:
  const [lockProduct, setLockProduct] = React.useState(false)
  React.useEffect(() => {
    // GET ALL USER
    axios.get(`${baseURL}/api/v1/user`)
      .then((res) => {
        // lấy danh sách CUSTOMER (roldId === 1)
        let x = res.data.filter(
          (item) => item.role.id === 1
        )
        setUserList(x);
      })
      .catch((err) => console.log(err))
  }, [])

  const columns = [
    { field: "id", headerName: "ID", width: 60 },
    {
      field: "name", headerName: "Name", width: 200
    },
    { field: "email", headerName: "Email", width: 250 },
    { field: "phone", headerName: "Phone", width: 130 },
    {
      field: "status", headerName: "Status", width: 100, renderCell: (params) => {
        if (params.row.status === true) {
          return <p style={{ backgroundColor: 'green', color: 'white', padding: 10, fontWeight: 600 }}>Active</p>
        }
        else {
          return <p style={{ backgroundColor: 'grey', color: 'white', padding: 10, fontWeight: 600 }}>Unactive</p>
        }
      }
    },
    {
      field: "action", headerName: "Action", width: 150, renderCell: (params) => {
        return (
          <div style={{ display: 'flex' }}>
            <button
              style={{ padding: 10, outline: 'none', border: 'none', backgroundColor: '#FF919D', color: "white", cursor: 'pointer' }}

            >
              <EditIcon />
              
            </button>
            <button
              style={{ padding: 10, outline: 'none', border: 'none', backgroundColor: 'grey', color: "white", marginLeft: 10, cursor: 'pointer' }}
              onClick={() => {
                alert(params.row.id);
                setLockProduct(!lockProduct);
              }}
            >
              {lockProduct ? <LockIcon /> : <LockOpenIcon />}
            </button>
          </div>
        )
      }
    },

  ];
  // SEARCH TEXT FUNCTION
  const searchCustomer = userList.filter((item) => {
    if (searchText === '')
      return item;
    if (item.name.toLowerCase().includes(searchText.toLowerCase()) )
      return item
  })
  return (
    <>
      <div style={{ display: 'flex', justifyContent: "flex-end", justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: "center", width: 134, height: 56}}>
          <div className="productFilter__search-input">
            <input
              value={searchText}
              placeholder={'Search'}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

        </div>
        <div>
          <Button style={{marginLeft: 0}} onClick={() => navigate('/new-customer')}><AddIcon /> Customer</Button>
          <Button onClick={() => {}}>Refresh</Button>
        </div>

      </div>
      <div className="Table" style={{overflowY: 'scroll', height: 500}}>

        <DataGrid className='data__grid'
          style={{ backgroundColor: 'white' }}
          rows={searchCustomer}
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