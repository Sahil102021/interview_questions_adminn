import React, { useEffect, useState } from "react";
import Home from "../Home1/Home";
import { Box, Grid2, Typography } from "@mui/material";
import axios from "axios";
import Box1 from "../Componets/Box1";

const token = localStorage.getItem("token");

const Dasboard = () => {
  const [category, setCategory] = useState('');
  const [question, setQuestion] = useState('');
  const [banner, setBanner] = useState('');

  const fetchcategoryData = async () => {
    try {
      let categoryData = await axios.get("https://interview-question-api.onrender.com/category", {
        headers: {
          Authorization: token,
        },
      });
      setCategory(categoryData.data?.data?.length);
    } catch (error) {
      console.error(error);
    }
  };

  
  const fetchQuestionData = async () => {
    try {
      let questionData = await axios.get("https://interview-question-api.onrender.com/iq", {
        headers: {
          Authorization: token,
        },
      });
      setQuestion(questionData.data?.data?.length);
    } catch (error) {
      console.error("Error fetching Data Question:", error);
    }
  };

  const fetchBannerData = async () => {
    try {
      let questionData = await axios.get("https://interview-question-api.onrender.com/banner", {
        headers: {
          Authorization: token,
        },
      });
      setBanner(questionData.data?.data?.length);
      console.log("Fetched Questions:", questionData.data.data);
    } catch (error) {
      console.error("Error fetching Data banner:", error);
    }
  };
  


  console.log(category);
  console.log(question);
  console.log(banner);

  useEffect(() => {
    fetchQuestionData();
    fetchcategoryData();
    fetchBannerData();
  }, []);

  

  return (
    <Home>
      <Box sx={{ flexGrow: 1 }}>
      <Grid2 container spacing={2} columns={12}>
        <Grid2 size={{xs:8 , md:3}}>
          <Box1 title={'Question'} number={question} />
        </Grid2>
        <Grid2 size={{xs:8 , md:3}}>
        <Box1 title={'Category'} number={category} />
        </Grid2>
        <Grid2 size={{xs:8 , md:3}}>
        <Box1 title={'Banner'} number={banner} />
        </Grid2>
      </Grid2>
    </Box>
    </Home>
  );
};

export default Dasboard;

