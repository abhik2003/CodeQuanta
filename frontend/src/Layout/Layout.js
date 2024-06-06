import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Layout(props) {
  return (
    <div>
      <Header />
      <main style={{ minHeight: "75vh" }}>{props.children}</main>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default Layout;
