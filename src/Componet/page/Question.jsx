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
  { id: "question", label: "question" },
  { id: "answer", label: "answer" },
  { id: "categoryId", label: "category" },
  { id: "photos", label: "photos" },
  { id: "update", label: "update" },
  { id: "Delete", label: "Delete" },
];

const validationSchema = Yup.object({
  question: Yup.string().required("Question is required"),
  answer: Yup.string().required("Answer is required"),
  categoryId: Yup.string().required("Category is required"),
});

const Question = () => {
  const [category, setCategory] = useState([]);
  const [data, setData] = useState([]);
  let [editId, setEditId] = useState(null);

  const fetchCategoryData = async () => {
    try {
      const response = await axios.get("https://interview-question-api.onrender.com/category", {
        headers: token ? { Authorization: token } : {},
      });
      setCategory(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchQuestionData = async () => {
    try {
      let questionData = await axios.get("https://interview-question-api.onrender.com/iq", {
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
        `https://interview-question-api.onrender.com/iq/delete/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(deleteData);
      fetchQuestionData();
    } catch (error) {
      console.error("Error Data Delete :", error);
    }
  };

  const handleUpdate = (questionData) => {
    setEditId(questionData._id);
    formik.setValues({
      question: questionData.question,
      answer: questionData.answer,
      categoryId: questionData.categoryId?._id || "",
      photos: null, // Reset file input (UI doesn't support setting previous file)
    });
  };

  const formik = useFormik({
    initialValues: {
      question: "",
      answer: "",
      categoryId: "",
      photos: null,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("question", values.question);
        formData.append("answer", values.answer);
        formData.append("categoryId", values.categoryId);
        if (values.photos) {
          formData.append("photos", values.photos);
        }

        if (editId) {
          await axios.patch(
            `https://interview-question-api.onrender.com/iq/update/${editId}`,
            formData,
            {
              headers: { Authorization: token },
            }
          );
          setEditId(null);
        } else {
          await axios.post("https://interview-question-api.onrender.com/iq", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: token,
            },
          });
        }

        fetchQuestionData(); // Correct function call
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
    fetchQuestionData();
    fetchCategoryData();
  }, []);

  return (
    <Home>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
          {/* Question Input */}
          <TextField
            label="Question"
            id="question"
            name="question"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.question}
            fullWidth
            margin="normal"
            error={formik.touched.question && Boolean(formik.errors.question)}
            helperText={formik.touched.question && formik.errors.question}
          />

          {/* Answer Input */}
          <TextField
            label="Answer"
            id="answer"
            name="answer"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.answer}
            fullWidth
            margin="normal"
            error={formik.touched.answer && Boolean(formik.errors.answer)}
            helperText={formik.touched.answer && formik.errors.answer}
          />

          {/* Category Selection */}
          <Autocomplete
            options={category}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category Selection"
                margin="normal"
                fullWidth
                error={
                  formik.touched.categoryId && Boolean(formik.errors.categoryId)
                }
                helperText={
                  formik.touched.categoryId && formik.errors.categoryId
                }
              />
            )}
            value={
              category.find((el) => el._id === formik.values.categoryId) || null
            }
            onChange={(event, newValue) =>
              formik.setFieldValue("categoryId", newValue ? newValue._id : "")
            }
          />

          {/* File Upload */}
          <input
            type="file"
            id="photos"
            name="photos"
            accept="image/*"
            onChange={(event) => {
              formik.setFieldValue("photos", event.currentTarget.files[0]);
            }}
            style={{ marginTop: "10px" }}
          />
          {formik.errors.photos && (
            <Typography color="error">{formik.errors.photos}</Typography>
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
                      <TableCell>{el.question}</TableCell>
                      <TableCell>{el.answer}</TableCell>
                      <TableCell>{el.categoryId?.name}</TableCell>
                      <TableCell>
                        {el.photos ? (
                          <img src={el.photos} alt="Preview" width="50" />
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
