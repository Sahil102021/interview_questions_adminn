import React from "react";
import { useFormik } from "formik";
import { Box, TextField, Button, Typography, Container } from "@mui/material";
import { NavLink, useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { lightGreen } from "@mui/material/colors";

import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string().required("email is required"),
  password: Yup.string().required("password is required"),
});

const Loginpage = () => {
  let navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        let loginData = await axios.post(
          "https://interview-question-api.onrender.com/users/login",
          values
        );
        console.log(loginData);
        toast.success(loginData?.data?.status);

        let tokenLocal = loginData?.data?.token;
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
      <Box width="100%">
        <Container maxWidth="xl" sx={{ mt: { xs: "5rem", md: "10rem" } }}>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{
              maxWidth: 400,
              mx: "auto",
              p: { xs: 1, md: 3 },
              boxShadow: 3,
              borderRadius: 2,
              backgroundColor: "#fff",
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
              Login Page
            </Typography>

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              variant="outlined"
              margin="normal"
              onChange={formik.handleChange}
              value={formik.values.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              variant="outlined"
              margin="normal"
              onChange={formik.handleChange}
              value={formik.values.password}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
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
              <NavLink to={"/signup"}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "black",
                    textTransform: "capitalize",
                    ":hover": { color: "green" },
                  }}
                >
                  SignUp Page Create
                </Typography>
              </NavLink>
            </Box>
          </Box>
        </Container>
      </Box>
    </div>
  );
};

export default Loginpage;
