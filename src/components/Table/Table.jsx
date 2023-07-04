import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./Table.css";
import axios from "axios";
import { baseURL } from "../../constants/baseURL";


function createData(name, trackingId, date, status) {
  return { name, trackingId, date, status };
}

const rows = [
  createData("Lasania Chiken Fri", 18908424, "2 March 2022", "Approved"),
  createData("Big Baza Bang ", 18908424, "2 March 2022", "Pending"),
  createData("Mouth Freshner", 18908424, "2 March 2022", "Approved"),
  createData("Cupcake", 18908421, "2 March 2022", "Delivered"),
];


const makeStyle=(status)=>{
  if(status === 'Approved')
  {
    return {
      background: 'rgb(145 254 159 / 47%)',
      color: 'green',
    }
  }
  else if(status === 'Pending')
  {
    return{
      background: '#ffadad8f',
      color: 'red',
    }
  }
  else{
    return{
      background: '#59bfff',
      color: 'white',
    }
  }
}

export default function BasicTable() {
  const [recentOrder, setRecentOrder] = React.useState([]);
  const [salestProduct, setSalestProduct] = React.useState([]);

  React.useEffect(() => {
    // GET ALL ORDER
    axios.get(`${baseURL}/api/v1/order`)
      .then((res) => {
        let x = res.data.filter(
          (item) => item.status === 'Ordered'
        )
        setRecentOrder(x);
      })
      .catch((err) => console.log(err))
    // GET TOP 4 PRODUCT SALEST:
    axios.get(`${baseURL}/statistic/top-seller`)
      .then((res) => setSalestProduct(res.data))
      .catch((err) => console.log(err))
  },[])
  
  return (
      <div className="Table" >
          <h3>Recent Orders</h3>
          <TableContainer
            component={Paper}
            style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="left">Tracking ID</TableCell>
                  <TableCell align="left">Date</TableCell>
                  <TableCell align="left">Status</TableCell>
                  <TableCell align="left">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ color: "white" }}>
                {recentOrder.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.finalPrice}
                    </TableCell>
                    <TableCell align="left">{row.orderId}</TableCell>
                    <TableCell align="left">{row.orderedDate}</TableCell>
                    <TableCell align="left">
                      <span className="status" style={makeStyle(row.status)}>{row.status}</span>
                    </TableCell>
                    <TableCell align="left" className="Details" onClick={() => alert(row.orderId)}>Details</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <h3>Top 4 product</h3>
          <div style={{overflowY: 'scroll', height: 200}}>
            <TableContainer
              component={Paper}
              style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Sản phẩm</TableCell>
                    <TableCell align="left">Số lượng bán</TableCell>
                    <TableCell align="left">Tổng doanh thu</TableCell>
                    <TableCell align="left">Tồn kho</TableCell>
                    <TableCell align="left">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody style={{ color: "white" }}>
                  {salestProduct.map((row) => (
                    <TableRow
                      key={row.product.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" style={{display: 'flex'}}>
                        <img
                          src={row.product.thumbnail} style={{width: 40, height: 40}}
                        />
                        <p style={{fontWeight: 600, marginLeft: 15}}>{row.product.name}</p>
                      </TableCell>
                      <TableCell align="left">{row.quantity}</TableCell>
                      <TableCell align="left">{row.product.price*row.quantity*((100-row.product.discountPercent)/100)}</TableCell>
                      <TableCell align="left">
                        <span className="status">{row.product.inventory}</span>
                      </TableCell>
                      <TableCell align="left" className="Details" onClick={() => alert(row.orderId)}>Details</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
      </div>
  );
}
