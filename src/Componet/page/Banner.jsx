import React, { useEffect, useState } from "react";
import Home from "../Home1/Home";
import {
  TextField,
  Button,
  Box,
  Autocomplete,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";

const token = localStorage.getItem("token");

const columns = [
  { id: "id", label: "No." },
  { id: "name", label: "name" },
  { id: "title", label: "title" },
  { id: "date", label: "date" },
  { id: "registered", label: "registered" },
  { id: "image", label: "image" },
  { id: "update", label: "update" },
  { id: "Delete", label: "Delete" },
];

const validationSchema = Yup.object({
    name: Yup.string().required("name is required"),
    title: Yup.string().required("title is required"),
    date: Yup.string().required("date is required"),
    image: Yup.mixed().nullable(),
});

const Question = () => {

  const [data, setData] = useState([]);
  let [editId, setEditId] = useState(null);


  const fetchBannerData = async () => {
    try {
      let questionData = await axios.get("https://interview-question-api.onrender.com/banner", {
        headers: {
          Authorization: token,
        },
      });
      setData(questionData.data.data);
      console.log("Fetched Questions:", questionData.data.data);
    } catch (error) {
      console.error("Error fetching Data Question:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      let deleteData = await axios.delete(
        `https://interview-question-api.onrender.com/banner/delete/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(deleteData);
      fetchBannerData();
    } catch (error) {
      console.error("Error Data Delete :", error);
    }
  };

  const handleUpdate = (questionData) => {
    setEditId(questionData._id);
    formik.setValues({
      name: questionData.name,
      title: questionData.title,
      date: questionData.date,
      registered: questionData.registered,
      image: null, // Reset file input (UI doesn't support setting previous file)
    });
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      title: "",
      date: "",
      registered: "",
      image: null,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("title", values.title);
        formData.append("date", values.date);
        formData.append("registered", values.registered);
        if (values.image) {
          formData.append("image", values.image);
        }

        if (editId) {
          await axios.patch(
            `https://interview-question-api.onrender.com/banner/update/${editId}`,
            formData,
            {
              headers: { Authorization: token },
            }
          );
          setEditId(null);
        } else {
          await axios.post("https://interview-question-api.onrender.com/banner", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: token,
            },
          });
        }

        fetchBannerData(); // Correct function call
        resetForm();
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  /////// table
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    fetchBannerData();
  }, []);

  return (
    <Home>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <form onSubmit={formik.handleSubmit} encType="multipart/form-data" style={{display:'flex' , flexWrap:'wrap'}}>
          {/* Question Input */}
          <TextField
            label="name"
            id="name"
            name="name"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            margin="normal"
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            sx={{width:{xs:'100%',md:'50%'}}}
          />

          {/* Answer Input */}
          <TextField
            label="title"
            id="title"
            name="title"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
            sx={{width:{xs:'100%',md:'50%'}}}
            margin="normal"
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />

          {/* date Input */}
          <TextField
            label="date"
            id="date"
            name="date"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.date}
            sx={{width:{xs:'100%',md:'50%'}}}
            margin="normal"
            error={formik.touched.date && Boolean(formik.errors.date)}
            helperText={formik.touched.date && formik.errors.date}
          />

          {/* registered Input */}
          <TextField
            label="registered"
            id="registered"
            name="registered"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.registered}
            sx={{width:{xs:'100%',md:'50%'}}}
            margin="normal"
            error={formik.touched.registered && Boolean(formik.errors.registered)}
            helperText={formik.touched.registered && formik.errors.registered}
          />

          {/* File Upload */}
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={(event) => {
              formik.setFieldValue("image", event.currentTarget.files[0]);
            }}
            style={{ marginTop: "10px" }}
          />
          {formik.errors.image && (
            <Typography color="error">{formik.errors.image}</Typography>
          )}

          {/* Submit Button */}
          <Button
            variant="contained"
            type="submit"
            color="primary"
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </form>

        <Box>
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
                  {data.map((el, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{el.name}</TableCell>
                      <TableCell>{el.title}</TableCell>
                      <TableCell>{el.date}</TableCell>
                      <TableCell>{el.registered}</TableCell>
                      <TableCell>
                        {el.image ? (
                          <img src={el.image} alt="Preview" width="50" />
                        ) : (
                          "No Image"
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          startIcon={<UpdateIcon />}
                          onClick={() => handleUpdate(el)}
                        >
                          Update
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDelete(el._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={data.length}
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
};

export default Question;
