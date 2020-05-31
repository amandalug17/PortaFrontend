import React from "react";
import { Formik } from "formik";
import Input from "../Input";
import Button from "../Button";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

export default function FormRegister(props) {
  const [step1, setStep1] = React.useState(true);
  const [step2, setStep2] = React.useState(true);
  const [step3, setStep3] = React.useState(true);
  const [phone, setPhone] = React.useState("");
  const [region, setRegion] = React.useState("");
  const [fName, setFName] = React.useState("");
  const [lName, setLName] = React.useState("");
  const [cedula, setCedula] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState(null);

  const handleStep1 = (e) => {
    console.log(props.color);
    let codigos = false;
    if (
      phone.slice(0, 4) == "0424" ||
      phone.slice(0, 4) == "0414" ||
      phone.slice(0, 4) == "0412" ||
      phone.slice(0, 4) == "0416"
    ) {
      codigos = true;
    } else {
      codigos = false;
    }

    if (
      (phone &&
        !/^\+?([0-9]{4})?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/i.test(phone)) ||
      phone == "" ||
      codigos === false
    ) {
      setStep1(true);
    } else {
      setStep1(false);
    }
  };

  const handleStep3 = (e) => {
    if (!fName || !lName || !selectedDate || !region) {
      setStep3(true);
      console.log(phone, "telefono");
    } else {
      setStep3(false);
      console.log(phone, "telefono");
    }
  };

  const handleStep2 = (e) => {
    if (!cedula || cedula < 1000000 || cedula > 100000000) {
      setStep2(true);
    } else {
      setStep2(false);
    }
  };

  const handlePhone = (e) => {
    setPhone(e.target.value);
  };

  const handleCedula = (e) => {
    setCedula(e.target.value);
  };

  const handleFName = (e) => {
    setFName(e.target.value);
  };

  const handleLName = (e) => {
    setLName(e.target.value);
  };

  const handleRegion = (e) => {
    setRegion(e.target.value);
  };

  return (
    <RegisterView>
      <Formik
        initialValues={{
          Email: "",
          Password: "",
          Password2: "",
          Phone: "",
          FName: "",
          LName: "",
          BDate: "",
          Region: "",
          Cedula: "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.Email) {
            errors.Email = "Required Field";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.Email)
          ) {
            errors.email = "Invalid Email";
          }
          if (!values.Password) {
            errors.Password = "Required Field";
          } else if (values.Password.length < 9) {
            errors.Password = "Password too short";
          } else if (values.Password != values.Password2) {
            errors.Password = "Password doesn't match";
          }

          return console.log(errors);
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          /// code here
          console.log(phone);
          let submitUser = [
            {
              UserPhone: phone,
              FirstName: fName,
              LastName: lName,
              Password: values.Password,
              Email: values.Email,
              Birthdate: selectedDate,
              Region: region,
              Cedula: cedula,
            },
          ];

          setSubmitting(true);
          console.log(submitUser);
          setStep1(true);
          setStep2(true);
          setSubmitting(false);
          resetForm();
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => (
          <form onSubmit={handleSubmit}>
            {step3 ? (
              <div>
                {step2 ? (
                  <div>
                    {step1 ? (
                      <div>
                        <Input
                          value={phone}
                          label="Enter your phone number"
                          id="Phone"
                          name="Phone"
                          type="text"
                          onChange={handlePhone}
                          onBlur={handleBlur}
                          color={props.color}
                        />

                        <div className="button">
                          <Button
                            color={props.color}
                            onClick={handleStep1}
                            block
                          >
                            {" "}
                            CONTINUE{" "}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Input
                          value={cedula}
                          label="Enter your ID"
                          id="Cedula"
                          name="Cedula"
                          type="number"
                          min="1000000"
                          max="100000000"
                          onChange={handleCedula}
                          onBlur={handleBlur}
                          color={props.color}
                        />

                        <div className="button">
                          <Button
                            color={props.color}
                            onClick={handleStep2}
                            block
                          >
                            {" "}
                            CONTINUE{" "}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="input2">
                      <Input
                        value={fName}
                        label="Enter your First Name"
                        id="FName"
                        name="FName"
                        type="text"
                        onChange={handleFName}
                        onBlur={handleBlur}
                        color={props.color}
                      />
                      <Input
                        value={lName}
                        label="Enter your Last Name"
                        id="LName"
                        name="LName"
                        type="text"
                        onChange={handleLName}
                        onBlur={handleBlur}
                        color={props.color}
                      />
                    </div>
                    <div className="input2">
                      <div className="picker">
                        <div>
                          <label className="dos">Select your Birthdate</label>
                          <DatePicker
                            selected={selectedDate}
                            maxDate={new Date(moment())}
                            onChange={(date) => setSelectedDate(date)}
                            placeholderText="Choose a Date"
                          />
                        </div>
                      </div>
                      <div className="picker">
                        <div>
                          <label className="dos">Select your Region</label>
                          <select
                            name="region"
                            value={region}
                            onChange={handleRegion}
                            onBlur={handleBlur}
                            className="select"
                          >
                            <option value="" label="Choose a Region" />
                            <option value="Hatillo" label="El Hatillo" />
                            <option value="Baruta" label="Baruta" />
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="button">
                      <Button color={props.color} onClick={handleStep3} block>
                        {" "}
                        CONTINUE{" "}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <Input
                  value={values.Email}
                  label="Enter your email"
                  id="Email"
                  name="Email"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  color={props.color}
                />
                <div className="input2">
                  <Input
                    value={values.Password}
                    label="Enter your password"
                    id="Password"
                    type="password"
                    name="Password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    color={props.color}
                  />
                  <Input
                    value={values.Password2}
                    label="Confirm password"
                    id="Password2"
                    type="password"
                    name="Password2"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    color={props.color}
                  />
                </div>

                <div className="button">
                  <Button color={props.color} type="submit" block>
                    {" "}
                    SIGN UP{" "}
                  </Button>
                </div>
              </div>
            )}
          </form>
        )}
      </Formik>
    </RegisterView>
  );
}
const RegisterView = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  label {
    font-size: 1em;
    font-weight: 600;
    color: ${(props) => props.color};
    margin: 0.2rem;
    cursor: pointer;
    margin-top: 2rem;
  }
  input {
    background: none;
    font-size: 1em;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
    color: ${(props) => props.color};
    border: none;
    border-bottom: solid 2px #ebebeb;
    box-shadow: none;
    outline: none;
    transition: all ease-in-out 0.5s;
    opacity: 0.8;
    margin: 0;
    margin-top: 1rem;
    padding: 0.3rem 0.5rem;
    width: 80%;

    &:focus {
      opacity: 1;
      outline: none;
      box-shadow: none;
      border-bottom: solid 2px ${(props) => props.color};
    }
  }

  .input2 {
    display: flex;
    flex-direction: row;
    width: 100%;
    margin: auto;
    &:focus {
      opacity: 1;
      outline: none;
      box-shadow: none;
      border-bottom: solid 2px #aaa0ed;
    }
  }

  .button {
    margin-top: 2rem;
    margin-bottom: -3rem;
  }

  .dos {
    font-size: 1em;
    font-weight: 600;
    color: ${(props) => props.color};
    cursor: pointer;
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    width: 100%;
    &:focus {
      opacity: 1;
      outline: none;
      box-shadow: none;
      border-bottom: solid 2px pink;
    }
  }

  .picker {
    display: flex;
    flex-direction: column;
    max-width: 600px;
    margin: auto;
    align-items: center;
    justify-content: center;
    font-family: Roboto;
    &:focus {
      opacity: 1;
      outline: none;
      box-shadow: none;
      border-bottom: solid 2px #aaa0ed;
    }
  }

  .select {
    background: none;
    font-size: 1em;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
    color: grey;
    border: none;
    border-bottom: solid 2px #ebebeb;
    box-shadow: none;
    outline: none;
    transition: all ease-in-out 0.5s;
    opacity: 0.8;
    margin-top: 1rem;
    padding: 0.3rem 0.5rem;
    width: 100%;
    &:focus {
      opacity: 1;
      outline: none;
      box-shadow: none;
      border-bottom: solid 2px #aaa0ed;
    }
  }
`;
