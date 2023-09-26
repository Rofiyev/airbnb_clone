import {
  Avatar,
  Button,
  CircularProgress,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Footer, Header } from "../components";
import { useSelector } from "react-redux";
import { DateCalendar } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const UserProfile = () => {
  const auth = useSelector(({ authSlice }) => authSlice.user);
  console.log(auth);

  const getDayFunc = (auth_date) => {
    if (auth_date) return auth_date;

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}/${month}/${day}`;
  };

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
            <Stack
              justifyContent={"center"}
              direction={"row"}
              gap={"1rem"}
              alignItems={"center"}
            >
              <Avatar
                sx={{ width: 80, height: 80 }}
                src={auth?.user?.profile_picture}
                alt="User"
              >
                {`${auth?.user?.first_name.charAt(
                  0
                )}${auth?.user?.last_name.charAt(0)}`}
              </Avatar>
              <Stack direction={"column"}>
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
                    label="Firstname"
                    defaultValue={auth?.user?.first_name}
                    variant="outlined"
                    autoComplete={false}
                  />
                  <TextField
                    fullWidth
                    label="Lastname"
                    defaultValue={auth?.user?.last_name}
                    variant="outlined"
                    autoComplete={false}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack direction={{ xs: "column", md: "row" }} gap={"1rem"}>
                  <TextField
                    fullWidth
                    label="Email"
                    defaultValue={auth?.user?.email}
                    variant="outlined"
                    autoComplete={false}
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    defaultValue={auth?.user?.phone_number}
                    variant="outlined"
                    autoComplete={false}
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
                  referenceDate={dayjs(getDayFunc(auth?.user?.birth_date))}
                  views={["year", "month", "day"]}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Button
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
          </Container>
        </>
      )}
      <Footer />
    </>
  );
};

export default UserProfile;
