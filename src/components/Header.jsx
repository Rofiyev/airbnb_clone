import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import {
  MenuItem,
  Button,
  Stack,
  TextField,
  Divider,
  Autocomplete,
} from "@mui/material";
import { countries, settings } from "../config";
import logo from "../assets/logo.png";
import LazyLoad from "react-lazy-load";
import { Link, useNavigate } from "react-router-dom";
import ModalContent from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import { removeUser, setUser } from "../redux/auth-slice";
import { DataFetching } from "../api";
import { MuiOtpInput } from "mui-one-time-password-input";
import { toast } from "react-toastify";
import { getItem } from "../helpers/persistance-storage";

function Header({ children }) {
  const auth = useSelector(({ authSlice }) => authSlice.user);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [isRegisterModal, setIsRegisterModal] = useState(false);
  const [country, setCountry] = useState({
    code: "UZ",
    label: "Uzbekistan",
    phone: "998",
  });
  const [phone, setPhone] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  useEffect(() => {
    // Locale Storage User Data
    const user = getItem("user");
    user && dispatch(setUser(user));
  }, []);

  useEffect(() => setPhone(`+${country.phone} `), [country]);
  const handlerChange = (e) => setPhone(`${e.target.value}`);

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = (route, name) => {
    setAnchorElUser(null);
    if (name === "Logout") {
      dispatch(removeUser());
      navigate("/");
    }

    route && navigate(route);
  };

  // Handle Change Modal Open and Close
  const handleModal = (bool) => setIsOpenModal(bool);
  const handleModal_2 = (bool) => setIsLoginModal(bool);
  const handleModal_3 = (bool) => setIsRegisterModal(bool);
  // Handle Change Modal Open and Close

  // Login or Signup form
  const submitData = async () => {
    if (phone.length > 6) {
      setUserPhone(phone);
      const { data } = await DataFetching.authVerify({
        phone_number: phone.replace(/\s/g, ""),
      });
      if (data.verification_type === "login") {
        setIsLoginModal(true);
        setPhone(`+${country.phone} `);
        toast.success(data.detail, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setIsOpenModal(false);
      } else if (data.verification_type === "register") {
        setIsRegisterModal(true);
        setIsOpenModal(false);
        setPhone(`+${country.phone} `);
      }
    }
  };

  // Login Verify
  const handleVerifCode = (newValue) => setOtp(newValue);
  const submitVerify = async () => {
    const { data, success } = await DataFetching.verifyPhoneCode({
      phone_number: userPhone.replace(/\s/g, ""),
      code: otp,
    });

    if (success) {
      toast.success(data.detail, {
        position: toast.POSITION.TOP_RIGHT,
      });

      const number_user = userPhone.replace(/\s/g, "");
      const { res, success } = await DataFetching.getAuthToken({
        phone_number: number_user,
        code: "1",
      });
      if (success) {
        setIsLoginModal(false);
        setOtp("");
        dispatch(setUser(res.data));
      }
    } else {
      toast.error("Incorrect code.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  // Register Form
  const registerForm = async () => {
    const body = {
      first_name: firstname,
      last_name: lastname,
      phone_number: userPhone.replace(/\s/g, ""),
    };

    const { data, success } = await DataFetching.authRegister(body);
    if (success) {
      dispatch(setUser(data));
      setIsRegisterModal(false);
      setLastname("");
      setFirstname("");
      toast.success("Created user successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setPhone("");
    }
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        top: "0",
        zIndex: "100",
        fontFamily: "inherit !important",
        py: "10px",
        background: "transparent",
        color: "black",
        borderBottom: "1px solid #e6e6e6",
        backgroundColor: "white",
      }}
      elevation={0}
    >
      <Container
        maxWidth="xl"
        display={"flex"}
        alignItems={"center"}
        height={"100%"}
      >
        <Toolbar
          disableGutters
          sx={{
            height: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack direction={"row"} alignItems={"center"} gap={1}>
            <LazyLoad
              height={150}
              width={150}
              threshold={0.95}
              className="logo-header__wrapper"
            >
              <img src={logo} alt="Logo" className="logo-header" />
            </LazyLoad>
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                fontWeight: "600",
                letterSpacing: "-1px",
                color: "#ff385c",
                fontSize: "24px",
              }}
            >
              <Link style={{ color: "inherit", textDecoration: "none" }} to="/">
                airbnb
              </Link>
            </Typography>
          </Stack>
          <>{children}</>
          <Box>
            {auth ? (
              <>
                <Stack direction={"row"} alignItems={"center"} gap={"10px"}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "inherit",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    {auth?.user?.first_name} {auth?.user?.last_name?.charAt(0)}.
                  </Typography>
                  <IconButton
                    sx={{ cursor: "pointer", p: 0.5 }}
                    onClick={handleOpenUserMenu}
                  >
                    <Avatar
                      alt="Remy Sharp"
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFCzxivJXCZk0Kk8HsHujTO3Olx0ngytPrWw&usqp=CAU"
                    />
                  </IconButton>
                </Stack>
                <Menu
                  sx={{ mt: "45px", width: 350 }}
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map(({ icon, name, route }) => (
                    <MenuItem
                      key={name}
                      sx={{ display: "flex", gap: "10px" }}
                      onClick={() => handleCloseUserMenu(route, name)}
                    >
                      {icon}
                      <Typography>{name}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Button
                variant="outlined"
                color="error"
                sx={{ textTransform: "capitalize" }}
                onClick={() => handleModal(true)}
              >
                Sign Up
              </Button>
            )}
          </Box>
        </Toolbar>
        {/* Modal SignUp or Log In */}
        <ModalContent isOpen={isOpenModal} handleModal={handleModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "85%", md: "45%" },
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 2,
              borderRadius: "8px",
              maxHeight: "450px",
            }}
          >
            <Typography
              sx={{ fontFamily: "inherit", mb: "8px" }}
              variant="h6"
              align="center"
            >
              Log in or sign up
            </Typography>
            <Divider />
            <Typography
              variant="h5"
              component={"h3"}
              sx={{ fontFamily: "inherit", my: "8px", fontWeight: "500" }}
            >
              Welcome to Airbnb
            </Typography>
            <Autocomplete
              required
              autoComplete={false}
              onChange={(e, value) => setCountry(value)}
              sx={{ width: "full" }}
              options={countries}
              autoHighlight
              defaultValue={countries[countries.length - 16]}
              getOptionLabel={(option) => option.label}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                  {...props}
                >
                  <img
                    loading="lazy"
                    width="20"
                    src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                    srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                    alt="Flag"
                  />
                  {option.label} ({option.code}) +{option.phone}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  value={`${country.label} (+${country.code})`}
                  {...params}
                  label="Country/Region"
                  inputProps={{
                    ...params.inputProps,
                    // autoComplete: "new-password", // disable autocomplete and autofill
                  }}
                />
              )}
            />
            <TextField
              required
              type="tel"
              pattern="[05]{2}[0-9]{8}"
              label="Phone number"
              variant="outlined"
              value={phone}
              onChange={handlerChange}
              autoComplete={false}
              fullWidth
              sx={{ mt: "8px" }}
            />
            <Typography variant="body2" sx={{ my: "10px" }}>
              We’ll call or text you to confirm your number. Standard message
              and data rates apply.<Link>Privacy Policy</Link>
            </Typography>
            <Button
              onClick={submitData}
              variant="contained"
              color={"error"}
              fullWidth
              mt={1}
              sx={{ textTransform: "capitalize" }}
            >
              Continue
            </Button>
          </Box>
        </ModalContent>
        {/* Modal SignUp or Log In */}

        {/* Modal Login */}
        <ModalContent isOpen={isLoginModal} handleModal={handleModal_2}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "85%", md: "45%" },
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 2,
              borderRadius: "8px",
              maxHeight: "450px",
            }}
          >
            <Typography
              sx={{ fontFamily: "inherit", mb: "8px" }}
              variant="h6"
              align="center"
            >
              Login account
            </Typography>
            <Divider />
            <TextField
              disabled
              type="tel"
              pattern="[05]{2}[0-9]{8}"
              label="Phone number"
              variant="outlined"
              value={userPhone}
              autoComplete={false}
              fullWidth
              sx={{ my: "14px" }}
            />
            <MuiOtpInput value={otp} length={6} onChange={handleVerifCode} />
            <Button
              onClick={submitVerify}
              variant="contained"
              color={"error"}
              fullWidth
              mt={1}
              sx={{ textTransform: "capitalize", mt: "10px" }}
            >
              Submit
            </Button>
          </Box>
        </ModalContent>
        {/* Modal Login */}

        {/* Modal Register */}
        <ModalContent isOpen={isRegisterModal} handleModal={handleModal_3}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "85%", md: "45%" },
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 2,
              borderRadius: "8px",
              maxHeight: "450px",
            }}
          >
            <Typography
              sx={{ fontFamily: "inherit", mb: "8px" }}
              variant="h6"
              align="center"
            >
              Register account
            </Typography>
            <Divider sx={{ mt: "10px", mb: "18px" }} />
            <Autocomplete
              required
              autoComplete={false}
              disabled
              sx={{ width: "full" }}
              options={countries}
              autoHighlight
              defaultValue={countries[countries.length - 16]}
              getOptionLabel={(option) => option.label}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                  {...props}
                >
                  <img
                    loading="lazy"
                    width="20"
                    src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                    srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                    alt="Flag"
                  />
                  {option.label} ({option.code}) +{option.phone}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  value={`${country.label} (+${country.code})`}
                  {...params}
                  label="Country/Region"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: "new-password", // disable autocomplete and autofill
                  }}
                />
              )}
            />
            <TextField
              type="tel"
              disabled
              pattern="[05]{2}[0-9]{8}"
              label="Phone number"
              variant="outlined"
              value={userPhone}
              onChange={handlerChange}
              autoComplete={false}
              fullWidth
              sx={{ my: "12px" }}
            />
            <Stack direction={{ xs: "column", md: "row" }} gap={"10px"}>
              <TextField
                label="Firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                variant="outlined"
                required
                fullWidth
              />
              <TextField
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                label="Lastname"
                variant="outlined"
                required
                fullWidth
              />
            </Stack>
            <Button
              onClick={registerForm}
              variant="contained"
              color={"error"}
              fullWidth
              mt={1}
              sx={{ textTransform: "capitalize", mt: "10px" }}
            >
              Continue
            </Button>
          </Box>
        </ModalContent>
        {/* Modal Register */}
      </Container>
    </AppBar>
  );
}
export default Header;
