import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Sacure = (props) => {
  let navigate = useNavigate();
  const [checktoken, setCheckToken] = useState();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate("/");
    }

    setTimeout(() => {
      setCheckToken(token);
    }, 1000);
  }, []);

  if (!checktoken) {
    return (
      <div class="loader-container">
        <div class="loader"></div>
    </div>
    );
  }

  return (
      <>
        {props.children}
      </>
  );
};

export default Sacure;
