import React from "react";
import styled, { keyframes } from "styled-components";
import { NavLink, withRouter } from "react-router-dom";
import { TiThMenuOutline } from "react-icons/ti";
import { FiMail } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { GET_ORDERS } from "../helpers/graphql/queries/index";
import { useQuery } from "@apollo/react-hooks";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "./Spinner";
import { NOTIFICATION_ADDED_SUSCRIPTION } from "../helpers/graphql/subscriptions/index";
import { useMutation } from "@apollo/react-hooks";
import { CONTACT_US } from "../helpers/graphql/mutations/index";
import Checkbox from "@material-ui/core/Checkbox";

export default function Correo() {
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const { _id, mail, name, lastName, role } = useSelector((state) => ({
    ...state.User,
  }));

  const [contactUs, { data, error, loading }] = useMutation(
    CONTACT_US
  );

  const sendMail = async (e) => {
    e.preventDefault();
    
    const { data } = await contactUs({
      variables:{
        contactInput: {
          name: name,
          lastName: lastName,
          from: mail,
          subject:"enviado desde el front",
          text:"mucho texto",
          role: role
        }
      }
    });

  };

  return (
    <StyledCorreo>
      <form className="forma">
        <label className="lab">
          Subject
          <input className="sub" type="text" />
        </label>
        <label className="lab">
          Content
          <input className="cont" type="text" />
        </label>
        <input className="but" type="submit" value="Submit" onClick={sendMail}/>
        <div className="check">
          <h4>{data && data.contactUs ? "Correo recibido":""}</h4>
          <h4>{data && !data.contactUs ? "Network error":""}</h4>
          <Checkbox
            disabled
            checked
            inputProps={{ "aria-label": "disabled checked checkbox" }}
          />
        </div>
      </form>
    </StyledCorreo>
  );
}

const StyledCorreo = styled.nav`
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  .forma {
    display: inline-grid;
  }

  .check {
    display: flex;
    /* h4 {
      margin-top: 10px;
    } */
  }

  .check {
    margin-top: 20px;
    align-items: center;
  }

  .lab {
    display: inline-grid;
  }
  .but {
    border: solid 2px #00507a;
    color: white;
    padding: 10px;
    font-size: 15px;
    width: 200px;
    display: flex;
    font-weight: 600;
    cursor: pointer;
    background: #00507a;
    border-radius: 500px;
    transition: all ease-in-out 0.3s;
    justify-content: center;
    &:hover {
      opacity: 0.8;
      background: #00507a;
      color: white;
      border-color: #00507a;
    }
    &:focus {
      opacity: 0.8;
      outline: none;
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
    }
  }

  @media only screen and (min-width: 970px) {
    .sub {
      width: 40rem;
    }
    .cont {
      width: 40rem;
      height: 300px;
    }
    .but {
      width: 200px;
    }
  }

  @media only screen and (max-width: 969px) and (min-width: 735px) {
  }

  @media only screen and (max-width: 734px) {
  }
`;
