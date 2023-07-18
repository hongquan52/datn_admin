import * as React from "react";
import { Button } from '@mui/material'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Select from '@mui/material/Select';

import { DataGrid } from '@mui/x-data-grid';
import "./TableBanner.css";
import axios from "axios";
import { baseURL } from "../../constants/baseURL";
import AddIcon from '@mui/icons-material/Add';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";
import { useForm } from 'react-hook-form'

export default function BasicTable() {
  const navigate = useNavigate();
  const [banner, setBanner] = React.useState([]);
  const [searchText, setSearchText] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [openNew, setOpenNew] = React.useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [bannerEdit, setBannerEdit] = useState({});
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  
  // LOCK PRODUCT STATE:
  const [lockProduct, setLockProduct] = React.useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
} = useForm();

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
    var formattedDate = [tempDate.getFullYear(),tempDate.getMonth() + 1, tempDate.getDate(), ].join('/');
    return formattedDate;
  }
  const editBanner = () => {
    setOpen(false);
  }
  const createBanner = (data) => {
    // COMPARE START / END DATE
    let x = new Date(startDate);
    let x1 = new Date(endDate);

    if(x1.getTime() < x.getTime()) {
      showToastMessageSuccess('Ngày bắt đầu không thể sau ngày kết thúc!');
    }
    else {
      
      var dataForm = new FormData();
      dataForm.append('photoUrl', selectedImage);
      dataForm.append('description', data.description);
      dataForm.append('startDate', formatDateJSON(startDate));
      dataForm.append('endDate', formatDateJSON(endDate));
      dataForm.append('link', data.link);
      axios.post(`${baseURL}/api/v1/banner`, dataForm, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
        .then((res) => {
          if(res.data.status === 'OK') {
            setOpenNew(false);
            setLockProduct(!lockProduct);
            showToastMessageSuccess('Tạo bảng hiệu thành công!');
          }
          else {
            showToastMessageSuccess('Tạo bảng hiệu thất bại');
          }
        })
        .catch((err) => console.log(err))
    }

    
  }
  React.useEffect(() => {
    // GET ALL BANNER

    axios.get(`${baseURL}/api/v1/banner`)
      .then((res) => {

        setBanner(res.data);
      })
      .catch((err) => console.log(err))
  }, [])
  React.useEffect(() => {
    // GET ALL BANNER

    axios.get(`${baseURL}/api/v1/banner`)
      .then((res) => {

        setBanner(res.data);
      })
      .catch((err) => console.log(err))
  }, [lockProduct])

  const showToastMessageSuccess = (message) => {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT
    });
  };
  const columns = [
    { field: "id", headerName: "Mã bảng hiệu", width: 100 },
    {
      field: "description", headerName: "Mô tả", width: 100
    },
    {
      field: "photoUrl", headerName: "Hình ảnh", width: 250, renderCell: (params) => {
        return <img src={params.row.photoUrl.slice(0,-1)} style={{ width: 200, height: 60 }} />

      }
    },
    { field: "link", headerName: "Đường dẫn", width: 100 },
    { field: "startDate", headerName: "Ngày bắt đầu", width: 150 },
    { field: "endDate", headerName: "Ngày kết thúc", width: 150 },
    {
      field: "status", headerName: "Status", width: 100, renderCell: (params) => {
        if (params.row.status === true) {
          return <p style={{ backgroundColor: 'green', color: 'white', padding: 10, fontWeight: 600, width: 60, textAlign: "center" }}>Active</p>
        }
        else {
          return <p style={{ backgroundColor: 'grey', color: 'white', padding: 10, fontWeight: 600, width: 60, textAlign: "center" }}>Unactive</p>
        }
      }
    },
    {
      field: "action", headerName: "Action", width: 200, renderCell: (params) => {
        return (
          <div style={{ display: 'flex' }}>

            <button
              style={{ padding: 10, outline: 'none', border: 'none', backgroundColor: 'green', color: "white", marginLeft: 10, cursor: 'pointer' }}
              onClick={() => {
                setBannerEdit(params.row);
                setOpen(true);
              }}
            >
              <EditIcon />
            </button>
            <button
              style={{ padding: 10, outline: 'none', border: 'none', backgroundColor: 'red', color: "white", cursor: 'pointer', marginLeft: 10 }}
              onClick={() => {
                showToastMessageSuccess("Remove banner successfully!");
              }}

            >
              <DeleteIcon />

            </button>
          </div>
        )
      }
    },

  ];

  return (
    <>
      <ToastContainer />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Chỉnh sửa bảng hiệu
          </Typography>
          <div>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Mã bảng hiệu
            </Typography>
            <input placeholder="Mã bảng hiệu" className='banner__edit-input' value={bannerEdit.id} />
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Mô tả
            </Typography>
            <input placeholder="Mã bảng hiệu" className='banner__edit-input' defaultValue={bannerEdit.description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Đường dẫn bảng hiệu
            </Typography>
            <input placeholder="Mã bảng hiệu" className='banner__edit-input' defaultValue={bannerEdit.link} style={{ width: 500 }}
              onChange={(e) => setLink(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ marginRight: 10 }}>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Ngày bắt đầu
                </Typography>

                <input placeholder="Mã bảng hiệu" className='banner__edit-input' type="date"
                  defaultValue={convertDate(bannerEdit.startDate)}
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
                  defaultValue={convertDate(bannerEdit.endDate)}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    
                  }}  
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', height: 200, justifyContent: 'space-around' }}>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Hình ảnh bảng hiệu
              </Typography>
              <input placeholder="Mã bảng hiệu" className='banner__edit-input' type="file"
                onChange={(event) => {
                  setSelectedImage(event.target.files[0]);

                }}
              />
              <img
                src={selectedImage ? URL.createObjectURL(selectedImage) : bannerEdit.photoURL?.slice(0,-1)}
                style={{ height: 100, width: 600 }}

              />
            </div>
          </div>
          <button onClick={createBanner}>Tạo bảng hiệu</button>


        </Box>
      </Modal>
      <Modal
        open={openNew}
        onClose={() => setOpenNew(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Thêm mới bảng hiệu
          </Typography>
          <div>
            
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Mô tả
            </Typography>
            <input placeholder="Mã bảng hiệu" className='banner__edit-input' 
              {...register("description")}
            />
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Đường dẫn bảng hiệu
            </Typography>
            <input placeholder="Mã bảng hiệu" className='banner__edit-input'  style={{ width: 500 }}
              {...register("link")}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ marginRight: 10 }}>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Ngày bắt đầu
                </Typography>

                <input placeholder="Mã bảng hiệu" className='banner__edit-input' type="date"
                  
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
                  
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    
                  }}  
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', height: 200, justifyContent: 'space-around' }}>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Hình ảnh bảng hiệu
              </Typography>
              <input placeholder="Mã bảng hiệu" className='banner__edit-input' type="file"
                onChange={(event) => {
                  setSelectedImage(event.target.files[0]);

                }}
              />
              <img
                src={selectedImage ? URL.createObjectURL(selectedImage) : bannerEdit.photoURL?.slice(0,-1)}
                style={{ height: 100, width: 600 }}

              />
            </div>
          </div>
          <button onClick={handleSubmit(createBanner)}
            style={{padding: 10}}
          >Tạo bảng hiệu</button>


        </Box>
      </Modal>
      <div style={{ display: 'flex', justifyContent: "flex-end", justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: "center", width: 134, height: 56 }}>
          <div className="productFilter__search-input">
            <input
              value={searchText}
              placeholder={'Search'}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

        </div>
        <div>
          <Button style={{ marginLeft: 0 }} onClick={() => setOpenNew(true)}>Thêm bảng hiệu</Button>
          <Button onClick={() => { }}>Refresh</Button>
        </div>

      </div>
      <div className="Table" style={{ overflowY: 'scroll', height: 500 }}>

        <DataGrid className='data__grid'
          style={{ backgroundColor: 'white' }}
          rows={banner}
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