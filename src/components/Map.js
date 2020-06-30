import React from "react";
import styled from "styled-components";
import Geocoder from "react-native-geocoding";
import { useMutation } from "@apollo/react-hooks";
import { useQuery } from "@apollo/react-hooks";
import { DRIVERS_AROUND } from "../helpers/graphql/queries/index";
import { MAKE_ORDER } from "../helpers/graphql/mutations/index";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Spinner from "./Spinner";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import Grid from "@material-ui/core/Grid";

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import { formatRelative } from "date-fns";

import "@reach/combobox/styles.css";
import mapStyles from "../assets/scss/mapStyles";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

const libraries = ["places", "directions"];
const mapContainerStyle = {
  height: "100%",
  width: "100%",
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};
const center = {
  lat: 10.480594,
  lng: -66.903603,
};

export default function Map() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCM4qSOvs4NukQZxy366IuzW41Ymugauqo",
    libraries,
  });

  Geocoder.init("AIzaSyCM4qSOvs4NukQZxy366IuzW41Ymugauqo");
  const [markers, setMarkers] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [pack, setPackage] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState(
    new Date("2014-08-18T21:11:54")
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const { data, error, loading } = useQuery(DRIVERS_AROUND, {
    fetchPolicy: "network-only",
  });

  console.log(data);

  const [
    makeOrderd,
    { data: dataM, error: errorM, loading: loadingM },
  ] = useMutation(MAKE_ORDER);

  const { _id, role, name, lastName } = useSelector((state) => ({
    ...state.User,
  }));

  const dispatch = useDispatch();

  const handleSend = async (e) => {
    if (user != null && pack != null) {
      console.log("SE PUEDE MANDAR");
      console.log(user);
      const { dataM } = await makeOrderd({
        variables: {
          orderInput: {
            user: _id,
            pickUp: user.address,
            deliver: pack.address,
            km: 1500,
            price: 2000,
          },
        },
      });
    } else {
      console.log("NO SE PUEDE MANDAR");
    }
  };
  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const onMapClick = React.useCallback((e) => {
    setMarkers({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
      time: new Date(),
    });
  });

  const handleUserChange = ({ lat, lng, address }) => {
    setUser({ lat, lng, address });
    console.log("User");
    console.log(user);
  };
  const handlePackageChange = ({ lat, lng, address }) => {
    setPackage({ lat, lng, address });
    console.log("Package");
    console.log(pack);
  };

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  console.log(data);

  return (
    <>
      <StyledMap>
        <div className="busqueda">
          <h1>Realiza un pedido</h1>
          <div className="rutas">
            <div className="div1"></div>
            <div className="div2">
              <Search
                panTo={panTo}
                handleChange={handleUserChange}
                placeH="Where Are You?"
              />
            </div>
            <div className="div3">
              <Search
                panTo={panTo}
                handleChange={handlePackageChange}
                placeH="Where is Your Package?"
              />
            </div>
          </div>

          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
              <KeyboardTimePicker
                margin="normal"
                id="time-picker"
                label="Time picker"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change time",
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
          <div className="clear">
            <button className="boton" onClick={handleSend}>
              ACCEPT
            </button>
          </div>
        </div>
      </StyledMap>

      <Locate panTo={panTo} handleUserChange={handleUserChange} />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {loading ? (
          <Spinner />
        ) : (
          data.driversAroundMe.map((repartidor) => (
            <Marker
              position={{
                lat: Number(repartidor.latitud),
                lng: Number(repartidor.longitud),
              }}
              icon={{
                url: "/RepartidorFondo.png",
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(15, 15),
                scaledSize: new window.google.maps.Size(30, 30),
              }}
            />
          ))
        )}
        {user ? (
          <Marker
            position={{ lat: user.lat, lng: user.lng }}
            icon={{
              url: "/ClienteMap.png",
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
              scaledSize: new window.google.maps.Size(30, 30),
            }}
          />
        ) : null}
        {pack ? (
          <Marker
            position={{ lat: pack.lat, lng: pack.lng }}
            icon={{
              url: "/PackageMap.png",
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
              scaledSize: new window.google.maps.Size(30, 30),
            }}
          />
        ) : null}
      </GoogleMap>
    </>
  );
}

function Locate({ panTo, handleUserChange }) {
  return (
    <StyledMap>
      <button
        className="locate"
        onClick={() => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              Geocoder.from(position.coords.latitude, position.coords.longitude)
                .then((json) => {
                  var addressComponent = json.results[0].address_components[0];
                  console.log(addressComponent);
                  handleUserChange({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    address: addressComponent,
                  });
                })
                .catch((error) => console.warn(error));
              panTo({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            () => null
          );
        }}
      >
        <img src="/ClienteMap.png" alt="compass" />
      </button>
    </StyledMap>
  );
}

function Search({ panTo, handleChange, handlePackageChange, placeH }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 10.480594, lng: () => -66.903603 },
      radius: 200 * 1000,
    },
  });

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      console.log(lat, lng);
      handleChange({ lat, lng, address });
      panTo({ lat, lng });
    } catch (error) {
      console.log("😱 Error: ", error);
    }
  };

  return (
    <StyledMap>
      <div className="search">
        <Combobox onSelect={handleSelect}>
          <ComboboxInput
            style={{ fontFamily: "Roboto" }}
            value={value}
            onChange={handleInput}
            disabled={!ready}
            placeholder={placeH}
          />

          <ComboboxPopover style={{ zIndex: 100, fontFamily: "Roboto" }}>
            <ComboboxList style={{ zIndex: 100 }}>
              {status === "OK" &&
                data.map(({ id, description }) => (
                  <ComboboxOption
                    key={id}
                    value={description}
                    style={{ zIndex: 100 }}
                  />
                ))}
            </ComboboxList>
          </ComboboxPopover>
        </Combobox>
      </div>
    </StyledMap>
  );
}
const StyledMap = styled.div`
z-index:10;
  .search {
      position:relative;
      width:100%
      max-width:400px;
      z-index:1000;
      
  }

  .search input {
    padding: 0.5rem;
    font-size: 1.5rem;
    width: 100%;
  }



  .locate {
    position: absolute;
    top: 5rem;
    right: 1rem;
    background: none;
    border: none;
    z-index: 2010;
  }
  .locate img {
    width: 5em;
    cursor: pointer;
  }
  .clear {
    grid-area: clear;
    height: 20vh;
    display:flex;
    justify-content:center;
    align-items:center;
  }
  .busqueda {
    background-color: #fafafa;
    margin: 20px;
    margin-top: 80px;
    width: 400px;
    z-index:1;
 

    position:absolute;
    h1 {
      font-size: 60px;
      font-weight: 600;
      color: #fafafa;
      height: 230px;
      background-color: rgb(0, 80, 122);
      margin: 0;
      padding: 40px;
    }
    h2 {
      font-size: 25px;
      font-weight: 500;
      color: #1d1d1f;
      margin: 0;
      margin-top: 5%;
      margin-left: 5%;
    }

    .div1 {
      background-image: url("/iconos.png");
      background-repeat: no-repeat;
      background-size: 40px;
      margin-left: 25%;
      margin-top: 20%;
    }
    .rutas {
      margin: 0;
      padding: 0;
      display: grid;
      grid-template-areas:
        "iconos partida"
        "iconos llegada";
    }
    input {
      background-color: #ffffff;
      margin: 5%;
      border: none;
      height: 40px;
      width: 90%;
      font-size: 20px;
      font-weight: 500;
      color: #1d1d1f;
    }

    .div1 {
      grid-area: iconos;
    }
    .div2 {
      grid-area: partida;
      margin: 0;
    }
    .div3 {
      grid-area: llegada;
      margin: 0;
    }
  }

  .boton {
    border: solid 2px #00507a;
    color: white;
    padding: 0.9rem;
    font-size: 0.8em;
    width: 15vw;
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
`;