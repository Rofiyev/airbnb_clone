import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Footer, Header } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { DateCalendar } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { DataFetching } from "../api";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/auth-slice";
import { toast } from "react-toastify";

const UserProfile = () => {
  const auth = useSelector(({ authSlice }) => authSlice.user);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [date, setDate] = useState(dayjs(getDayFunc(auth?.user?.birth_date)));

  function getDayFunc(auth_date) {
    if (auth_date) return auth_date;

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}/${month}/${day}`;
  }

  const { register, handleSubmit } = useForm();

  const onSubmit = async (formData) => {
    const body = {
      ...formData,
      birth_date: `${date?.$y}-${+date?.$M + 1}-${date?.$D}`,
    };
    const { data, success } = await DataFetching.changeUserData(
      body,
      auth.access
    );
    if (success) {
      dispatch(
        setUser({ access: auth.access, refresh: auth.refresh, user: data })
      );
      navigate("/");
      toast.success("User information has been changed successfully");
    }
  };

  const handleDateChange = (date) => setDate(dayjs(getDayFunc(date)));

  return (
    <>
      <Header />
      {!auth ? (
        <Stack alignItems={"center"} justifyContent={"center"} height={"60vh"}>
          <CircularProgress color="error" />
        </Stack>
      ) : (
        <>
          <Container maxWidth={"xl"} sx={{ minHeight: "70vh", py: "1rem" }}>
            <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
              <Stack
                justifyContent={"center"}
                direction={"column"}
                gap={"1rem"}
                alignItems={"center"}
              >
                <Stack direction={"column"} textAlign={"center"}>
                  <Typography
                    fontFamily={"inherit"}
                    fontWeight={"600"}
                    fontSize={"2rem"}
                    sx={{ cursor: "pointer" }}
                  >
                    {`${auth?.user?.first_name} ${auth?.user?.last_name}`}
                  </Typography>
                  <Typography fontFamily={"inherit"} fontSize={"1.2rem"}>
                    {auth?.user?.phone_number}
                  </Typography>
                </Stack>
              </Stack>
              <Typography
                fontFamily={"inherit"}
                fontWeight={"500"}
                fontSize={"1.2rem"}
                textAlign={"center"}
                sx={{
                  mt: 6,
                  mb: 2,
                  mx: "auto",
                }}
              >
                Change Profile
              </Typography>
              <Grid
                container
                spacing={2}
                sx={{
                  width: "80%",
                  borderRadius: "12px",
                  mx: "auto",
                  px: { xs: 0.5, md: 10 },
                }}
              >
                <Grid item xs={12}>
                  <Stack direction={{ xs: "column", md: "row" }} gap={"1rem"}>
                    <TextField
                      fullWidth
                      name="first_name"
                      label="Firstname"
                      defaultValue={auth?.user?.first_name}
                      variant="outlined"
                      autoComplete={false}
                      {...register("first_name")}
                    />
                    <TextField
                      fullWidth
                      name="last_name"
                      label="Lastname"
                      defaultValue={auth?.user?.last_name}
                      variant="outlined"
                      autoComplete={false}
                      {...register("last_name")}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack direction={{ xs: "column", md: "row" }} gap={"1rem"}>
                    <TextField
                      fullWidth
                      type="email"
                      name="email"
                      label="Email"
                      defaultValue={auth?.user?.email}
                      variant="outlined"
                      autoComplete={false}
                      {...register("email")}
                    />
                    <TextField
                      fullWidth
                      name="phone_number"
                      label="Phone Number"
                      defaultValue={auth?.user?.phone_number}
                      variant="outlined"
                      autoComplete={false}
                      {...register("phone_number")}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    fontFamily={"inherit"}
                    fontWeight={"400"}
                    fontSize={"1rem"}
                  >
                    Birthday Date
                  </Typography>
                  <DateCalendar
                    views={["year", "month", "day"]}
                    value={date}
                    onChange={handleDateChange}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      fontFamily: "inherit",
                      textTransform: "capitalize",
                      mx: "auto",
                    }}
                  >
                    Change information
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </>
      )}
      <Footer />
    </>
  );
};

export default UserProfile;
