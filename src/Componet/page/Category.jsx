import { useEffect, React, useState } from "react";
import Home from "../Home1/Home";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Box, Button, IconButton, Switch, TextField } from "@mui/material";
import axios from "axios";
import { Formik, useFormik } from "formik";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";

let token = localStorage.getItem("token");
console.log(token);

const label = { inputProps: { "aria-label": "Switch demo" } };

const columns = [
  { id: "id", label: "No." },
  { id: "name", label: "Category Name" },
  { id: "discription", label: "Discription" },
  { id: "Delete", label: "Delete" },
  { id: "update", label: "update" },
];

export default function Category() {
  let [data, setData] = useState([]);
  let [transferData, setTransferData] = useState("");
  let [editId, setEditId] = useState(null);
  let [editCategory , setEditCategory] = useState({name :'',discription : ''});
  console.log(transferData);

  const fetchData = async () => {
    try {
      let categoryData = await axios.get(
        "https://interview-question-api.onrender.com/category",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setData(categoryData.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  console.log(data);

  let handleDelete = async (id) => {
    try {
      let deleteData = await axios.delete(
        `https://interview-question-api.onrender.com/category/delete/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(deleteData);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  let handleUpdate = (category) => {
    setEditId(category._id);
    setEditCategory({
      name : category.name,
      discription : category.discription
    });
  };


  const formik = useFormik({
    initialValues: editCategory, // Use editCategory data as initial form values
    enableReinitialize: true, // Allow form to reinitialize with new values when editing
    onSubmit: async (values, { resetForm }) => {
      setTransferData(values);
      // handleSubmit();
      try {
        if (editId) {
          let categoryUpdate = await axios.patch(`https://interview-question-api.onrender.com/category/update/${editId}`,values,{
            headers : {
              Authorization : token
            }
          })
          console.log(categoryUpdate);
        } else {
          let categoryData = await axios.post(
            "https://interview-question-api.onrender.com/category",
            values,
            {
              headers: {
                Authorization: token,
              },
            }
          );
        }
        // console.log(categoryData);
      } catch (error) {
        console.error(error);
      }
      fetchData();
      setEditId(null);
      setEditCategory({name : "", discription : ""});
      resetForm();
    },
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Home>
      <h3>Category</h3> <br />

      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
            gap: "20px",
          }}
          component="form"
          onSubmit={formik.handleSubmit}
        >
          <TextField
            label="Category name"
            id="name"
            name="name"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          <TextField
            label="Description"
            id="discription"
            name="discription"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.discription}
          />
          <Button
            variant="contained"
            sx={{ p: { xs: "15px 50px" } }}
            type="submit"
          >
            Submit
          </Button>
        </Box>
        <Box sx={{ width: "100%" }}>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((el, index) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{el.name}</TableCell>
                        <TableCell>{el.discription}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDelete(el._id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            startIcon={<UpdateIcon />}
                            onClick={() => handleUpdate(el)}
                          >
                            Upadte
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
      </Box>
    </Home>
  );
}
