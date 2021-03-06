import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { colorPrimary } from "../helpers/styles";
import NavbarDriver from "../components/NavbarDriver";
import NavbarOn from "../components/NavOn";
import DriverMenu from "../components/DriverMenu";
import DriverProfileSidebar from "../components/DriverProfileSidebar";
import DriverEditProfileForm from "../components/Forms/DriverEditProfile";
import { FaUserAlt } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { useSelector } from "react-redux";

export default function DriverEditProfile() {
  const [sidebar, setSidebar] = React.useState(false);

  const { name } = useSelector((state) => ({
    ...state.User,
  }));

  const handlingSidebar = (e) => setSidebar(!sidebar);

  return (
    <HomeStyle>
      {" "}
      <NavbarOn name={name}/>
      {/* <NavbarDriver togglerSidebar={handlingSidebar} /> */}
      <DriverMenu show={sidebar} />
      <div className="form">
        <DriverEditProfileForm />
      </div>
      <DriverProfileSidebar />
    </HomeStyle>
  );
}

const HomeStyle = styled.section`
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  position: absolute;
  overflow-x: hidden;
  background: #fafafa;
  .content {
    margin-top: 5rem;
  }
  .photo2 {
    border-radius: 500px;
    padding: 2em;
    border: solid 0.2em #00507a;
    width: 8vw;
    height: 8vw;
    margin-left: 1vw;
  }
  .settings2 {
    border-radius: 500px;
    margin-left: 0;
    left: 0;
    margin-top: 8vw;
    display: flex;
    position: absolute;
    padding: 1em;
    border: solid 0.1em #00507a;
    width: 2vw;
    height: 2vw;
    background: white;
  }

  .edit2 {
    display: flex;
    position: relative;
    width: 40vw;
    height: 50vh;
    margin-left: 292px;
    margin-top: 80px;
  }

  .form {
    width: 60vw;
    height: 80vh;
    margin-left: 292px;
    margin-top: 80px;
    display: flex;
    position: fixed;
  }

  @media only screen and (max-width: 734px) {
    .form {
      width: 100vw;
      height: 100vh;
      margin-left: 0;
      margin-top: 0;
      display: flex;
      position: fixed;
    }
  }
`;
