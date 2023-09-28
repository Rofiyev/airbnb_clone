import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  ImageList,
  ImageListItem,
  Stack,
  Typography,
  useMediaQuery,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Footer, Header } from "../components";
import { useNavigate, useParams } from "react-router-dom";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { DataFetching } from "../api";
import { useEffect, useState } from "react";
import { format, differenceInDays } from "date-fns";
import { toast } from "react-toastify";
import LazyLoad from "react-lazy-load";
import { useSelector } from "react-redux";

function srcset(image) {
  return {
    src: `${image}`,
    srcSet: `${image}`,
  };
}

export default function CardDetailPage() {
  const auth = useSelector(({ authSlice }) => authSlice.user);

  const { id } = useParams();
  const [item, setItem] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [date_in, setDateIn] = useState("");
  const [date_out, setDateOut] = useState("");
  const [count, setCount] = useState(1);
  const [guestCount, setGuestCount] = useState(1);

  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const getData = async () => {
      const { data, success } = await DataFetching.getRoomsRead(id);
      if (success) {
        setItem(data);
        setIsLoading(!success);
      } else {
        navigate("/not-found");
      }
    };

    getData();
  }, [id]);

  console.log(item);

  useEffect(() => {
    let days = differenceInDays(
      new Date(date_out ? date_out : "2023-09-19"),
      new Date(date_in ? date_in : "2023-09-18")
    );
    typeof days === "number" && setCount(days);
  }, [date_out, date_in]);

  const submitData = async () => {
    if (auth) {
      if (date_in.length && date_out.length && count >= 1) {
        navigate(
          `/order/slug=${id}/checkin=${date_in}/checkout=${date_out}/numberOfGuests=${+guestCount}/price=${
            count * item.price
          }`
        );
      } else {
        toast.error("You must register first!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  };

  return (
    <>
      <Header />
      {isLoading ? (
        <Stack
          alignItems={"center"}
          justifyContent={"center"}
          minHeight={"70vh"}
        >
          <CircularProgress color="error" />
        </Stack>
      ) : (
        <Container maxWidth="xl" sx={{ minHeight: "100vh", my: "20px" }}>
          <Typography
            variant="h5"
            sx={{ fontFamily: "inherit", fontWeight: "500" }}
          >
            Trophy | Dior Belle Maison Suite
          </Typography>
          <Stack direction={{ xs: "column", md: "row" }} gap={"5px"} mt={"8px"}>
            <Typography sx={{ textDecoration: "underline", cursor: "pointer" }}>
              {Math.floor(Math.random() * 1000)} review
            </Typography>
            <Typography sx={{ display: { xs: "none", md: "block" } }}>
              •
            </Typography>
            <Typography sx={{ textDecoration: "underline", cursor: "pointer" }}>
              {item?.address}
            </Typography>
          </Stack>

          {/* Image Gallery */}
          <ImageList
            sx={{
              width: "100%",
              mt: "20px",
              borderRadius: "20px",
            }}
            variant="quilted"
            cols={matchDownMd ? 2 : 4}
            rowHeight={200}
          >
            {item?.photos?.slice(0, 5)?.map((item, i) => {
              item = {
                ...item,
                rows: i === 0 ? 2 : "",
                cols: i === 0 ? 2 : "",
              };
              return (
                <ImageListItem
                  key={i}
                  cols={item.cols || 1}
                  rows={item.rows || 1}
                >
                  <img
                    {...srcset(item.photo, 121, item.rows, item.cols)}
                    style={{ objectFit: "cover" }}
                    alt={item.title}
                    className="card-detail__image"
                    loading="lazy"
                  />
                </ImageListItem>
              );
            })}
          </ImageList>

          <Grid container spacing={4} mt={"20px"}>
            <Grid item sx={{ width: { sm: "100%", md: "70%" } }}>
              <Stack
                direction={{ xs: "column-reverse", sm: "row" }}
                justifyContent={"space-between"}
                gap={"8px"}
              >
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ fontFamily: "inherit", fontWeight: "500" }}
                  >
                    {item?.title}
                  </Typography>
                  <Typography sx={{ color: "gray" }}>
                    {item?.guests} guests
                  </Typography>
                  <Divider sx={{ my: "10px" }} />
                  <Typography sx={{ fontFamily: "inherit" }}>
                    {item?.description}
                  </Typography>
                </Box>
                {/* {item} */}
                <Avatar
                  alt={"Username"}
                  src={item?.facilities.length && item?.facilities[0].icon}
                  sx={{ width: 56, height: 56 }}
                />
              </Stack>
              <Divider sx={{ my: "20px" }} />
              <Typography variant={"h4"} sx={{ fontWeight: "500" }}>
                What this place offers
              </Typography>
              <Stack
                direction={{ xs: "column", md: "row" }}
                flexWrap={"wrap"}
                gap={"2rem"}
                mt={2}
              >
                {item.services.map((data) => (
                  <Stack
                    key={data.name}
                    width={{ xs: "100%", md: "48%" }}
                    direction={"row"}
                    gap={"8px"}
                    alignItems={"center"}
                  >
                    <LazyLoad height={40} width={50} threshold={0.95}>
                      <img
                        src={`https://api.airbnb.tw1.su${data.icon}`}
                        alt="Logo"
                        className="logo-header"
                        style={{ objectFit: "cover" }}
                      />
                    </LazyLoad>
                    <Typography
                      variant="h6"
                      sx={{ fontFamily: "inherit", fontWeight: "500" }}
                    >
                      {data.name}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
              <Divider sx={{ my: "20px" }} />
              <Box
                component={"iframe"}
                src={`https://www.google.com/maps?q=${item.location.lat},${item.location.lng}&hl=es;z%3D14&amp&output=embed`}
                width={"100%"}
                height={400}
                frameBorder="0"
                style={{ border: "0px" }}
                allowFullScreen={true}
              ></Box>
            </Grid>
            <Grid item sx={{ flex: "1", maxWidth: "400px" }}>
              <Card
                sx={{
                  minWidth: "100%",
                  boxShadow: "rgba(0, 0, 0, 0.12) 0px 6px 16px",
                  border: "1px solid rgb(221, 221, 221)",
                  borderRadius: "12px",
                  p: "24px",
                  position: { xs: "relative", md: "sticky" },
                  top: { xs: "0", md: "30vh" },
                }}
              >
                <CardContent sx={{ p: "0px" }}>
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Typography sx={{ fontSize: 14, color: "gray" }}>
                      <Typography
                        variant="span"
                        sx={{ fontSize: 26, color: "black !important" }}
                      >
                        ${item?.price}
                      </Typography>{" "}
                      night
                    </Typography>
                    <Typography
                      sx={{ textDecoration: "underline", cursor: "pointer" }}
                    >
                      1 review
                    </Typography>
                  </Stack>
                  <Stack
                    sx={{ width: "100%" }}
                    mt={2}
                    direction={"row"}
                    gap={"10px"}
                  >
                    <DesktopDatePicker
                      sx={{ width: "50%" }}
                      format="YYYY/MM/DD"
                      value={date_in}
                      onChange={(date) =>
                        setDateIn(
                          format(
                            new Date(date.$y, date.$M, date.$D),
                            "yyyy-MM-dd"
                          )
                        )
                      }
                    />
                    <DesktopDatePicker
                      sx={{ width: "50%" }}
                      format="YYYY/MM/DD"
                      value={date_out}
                      onChange={(date) =>
                        setDateOut(
                          format(
                            new Date(date.$y, date.$M, date.$D),
                            "yyyy-MM-dd"
                          )
                        )
                      }
                    />
                  </Stack>
                  <FormControl fullWidth sx={{ mt: "10px" }}>
                    <InputLabel>Guest</InputLabel>
                    <Select
                      value={guestCount}
                      label="Age"
                      onChange={(e) => setGuestCount(e.target.value)}
                    >
                      {[...Array(8)].map((_, i) => (
                        <MenuItem value={i + 1}>{i + 1}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardContent>
                <CardActions sx={{ px: "0px" }} my={2}>
                  <Button
                    size="large"
                    variant="contained"
                    color="error"
                    fullWidth
                    sx={{
                      textTransform: "capitalize",
                      fontFamily: "inherit",
                      fontWeight: "500",
                    }}
                    onClick={submitData}
                  >
                    Reserve
                  </Button>
                </CardActions>
                <CardContent sx={{ p: "0px" }}>
                  <Typography
                    variant="span"
                    sx={{ textAlign: "center" }}
                    mt={2}
                  >
                    You won't be charged yet
                  </Typography>
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    gap={"10px"}
                    mt={2}
                  >
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Typography
                        sx={{
                          textDecoration: "underline",
                          cursor: "pointer",
                          color: "gray",
                        }}
                      >
                        ${item?.price} {`x${count}`} nights
                      </Typography>
                      <Typography sx={{ color: "gray" }}>
                        ${item?.price * count}
                      </Typography>
                    </Stack>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Typography
                        sx={{
                          textDecoration: "underline",
                          cursor: "pointer",
                          color: "gray",
                        }}
                      >
                        Cleaning fee
                      </Typography>
                      <Typography sx={{ color: "gray" }}>$70</Typography>
                    </Stack>
                    <Divider my={2} />
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Typography
                        sx={{
                          fontFamily: "inherit",
                          fontSize: "20px",
                          fontWeight: "600",
                        }}
                      >
                        Total before taxes
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "inherit",
                          fontSize: "20px",
                          fontWeight: "600",
                        }}
                      >
                        ${item?.price * count + 70}
                      </Typography>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      )}
      <Footer />
    </>
  );
}
