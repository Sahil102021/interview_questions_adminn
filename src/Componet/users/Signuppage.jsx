import React from "react";
import { useFormik } from "formik";
import { Box, TextField, Button, Typography, Container } from "@mui/material";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router";

const Signuppage = () => {
  let navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      firstname: "",
      lastname: "",
      contact: "",
      email: "",
      password: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        console.log(values);
        let signupData = await axios.post(
          "https://interview-question-api.onrender.com/users/signup",
          values
        );
        console.log(signupData);
        toast.success(signupData?.data?.status);

        let tokenLocal = signupData?.data?.token;
        if (tokenLocal) {
          localStorage.setItem("token", tokenLocal);
        } else {
          console.log("token Provide");
        }

        navigate("/dashboard");
      } catch (error) {
        console.log(error);
        console.log(error.response.data.message);
      }
      resetForm();
    },
  });
  return (
    <div>
      <Box width='100%'>
        <Container  maxWidth="xl" sx={{mt:{xs:'1rem',md:'10rem'}}}>

      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          maxWidth: 400,
          mx: "auto",
          p: {xs:1 , md:3},
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "#fff",
        }}
        >
        <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
          Sign Up
        </Typography>

        <TextField
          fullWidth
          label="Dasbord User Name "
          name="username"
          type="text"
          variant="outlined"
          margin="normal"
          onChange={formik.handleChange}
          value={formik.values.username}
          />

        <TextField
          fullWidth
          label="First Name"
          name="firstname"
          type="text"
          variant="outlined"
          margin="normal"
          onChange={formik.handleChange}
          value={formik.values.firstname}
          />

        <TextField
          fullWidth
          label="Last Name"
          name="lastname"
          type="text"
          variant="outlined"
          margin="normal"
          onChange={formik.handleChange}
          value={formik.values.lastname}
          />

        <TextField
          fullWidth
          label="Contact Number"
          name="contact"
          type="number"
          variant="outlined"
          margin="normal"
          onChange={formik.handleChange}
          value={formik.values.contact}
        />

        <TextField
          fullWidth
          label="Email Address"
          name="email"
          type="email"
          variant="outlined"
          margin="normal"
          onChange={formik.handleChange}
          value={formik.values.email}
          />

        <TextField
          fullWidth
          label="Password"
          name="password"
          variant="outlined"
          margin="normal"
          onChange={formik.handleChange}
          value={formik.values.password}
          />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          >
          Submit
        </Button>
        <Box sx={{ py: "10px" }}>
          <NavLink to={"/"}>
            <Typography
              variant="body2"
              sx={{
                color: "black",
                textTransform: "capitalize",
                ":hover": { color: "green" },
              }}
              >
              Login Page
            </Typography>
          </NavLink>
        </Box>
      </Box>
              </Container>
            </Box>
    </div>
  );
};

export default Signuppage;
