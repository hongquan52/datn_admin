import * as React from "react";
import {FormControl, InputLabel, MenuItem, Rating} from '@mui/material'
import Select from '@mui/material/Select';
import { DataGrid } from '@mui/x-data-grid';
import "./TableAttribute.css";
import axios from "axios";
import { baseURL } from "../../constants/baseURL";
import {Box, Typography, Modal } from '@mui/material'
import StarRateIcon from '@mui/icons-material/StarRate';

export default function BasicTable() {
  // MODAL REVIEW VISIBLE
  const [open, setOpen] = React.useState(false);
  const [reviewDetail, setReviewDetail] = React.useState({});
  

  const [review, setReview] = React.useState([]);
  const [product, setProduct] = React.useState([]);
  const [productIdSelected, setProductIdSelected] = React.useState(1);
  const [voteSelected, setVoteSelected] = React.useState('');
  React.useEffect(() => {
    // GET ALL PRODUCT
    axios.get(`${baseURL}/api/v1/product`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => console.log(err))
    
  }, [])
  React.useEffect(() => {
    axios.get(`${baseURL}/api/v1/attribute/product?productId=${productIdSelected}`)
      .then((res) => {
        setReview(res.data);
        console.log("================ : ", res.data)
      })
      .catch((err) => console.log(err))
  }, [productIdSelected, voteSelected])
  const columns = [
    { field: "column1", headerName: "Mã thuộc tính", width: 150, renderCell: (params) => {
      return <p>{params.row.attribute.id}</p>
    } },
    { field: "column2", headerName: "Tên thuộc tính", width: 150, renderCell: (params) => {
      return <p>{params.row.attribute.name}</p>
    } },
    { field: "column3", headerName: "Nội dung", width: 400, renderCell: (params) => {
      return <p>{params.row.attribute.value}</p>
    } },
    // {
    //   field: "attribute", headerName: "Vote", width: 70, renderCell: (params) => {
    //     return <p>{params.row.attribute}</p>
    //   }
    // },
    {
      field: "action", headerName: "Action", width: 70, renderCell: (params) => {
        return (<button
          style={{ padding: 5, outline: 'none', border: 'none', backgroundColor: 'grey', color: "white" }}
          onClick={() => {
            setReviewDetail(params.row)
            setOpen(true);
          }}
        >
          View</button>)
      }
    },

  ];
  const handleChange = (event) => {
    setProductIdSelected(event.target.value);
  };
  const handleChangeRating = (event) => {
    setVoteSelected(event.target.value);
  };
  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpen(!open)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h2" style={{backgroundColor: '#FF919D', padding: 10, color: "white"}}>
            Review product
          </Typography>
          <div style={{display: 'flex', alignItems: 'center', marginTop: 30}}>
            <img src={reviewDetail?.productThumbnail?.slice(0,-1)} style={{height: 100, width: 100}} />
            <h5 style={{fontSize: 25, marginLeft: 30}}>{reviewDetail.productName}</h5>
          </div>
          <div>
          <p style={{fontSize: 25}}><p style={{fontWeight:"bold"}}>Customer Name: </p>{reviewDetail.userName}</p>
          <p style={{fontWeight:"bold", fontSize: 25}}>Vote star</p>
          <Rating
            value={reviewDetail.vote}
            readOnly
            size="large"
          />
          <p style={{fontSize: 25}}><p style={{fontWeight:"bold"}}>Content: </p>{reviewDetail.content}</p>
          </div>
          
        </Box>
      </Modal>
      <div style={{display: 'flex', justifyContent: "space-between"}}>

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
      </div>
      <div className="Table">

        <DataGrid className='data__grid'
          style={{ backgroundColor: 'white' }}
          rows={review}
          columns={columns}
          // pageSize={6}
          // rowsPerPageOptions={[5]}

          // checkboxSelection
          disableSelectionOnClick
          // experimentalFeatures={{ newEditingApi: true }}
          autoHeight
          getRowId={(row) => row.attribute.id}
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
  width: 800,
  height: 600,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};