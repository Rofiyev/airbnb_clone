import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
  TextField,
  FormControl,
  Button,
} from "@mui/material";
import { Footer, Header } from "../components";
import { useEffect, useState } from "react";
import { DataFetching } from "../api";
import { differenceInDays } from "date-fns";
import LazyLoad from "react-lazy-load";
import { RiMedalFill, RiStarSFill } from "react-icons/ri";
import { HiArrowSmLeft } from "react-icons/hi";
import { toast } from "react-toastify";

const OrderPage = () => {
  const { slug, checkin, checkout, numberOfGuests } = useParams();
  const [item, setItem] = useState("");
  const [count, setCount] = useState(1);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    const getData = async () => {
      let slug_room = slug.split("=")[1];
      const { data, success } = await DataFetching.getRoomsRead(slug_room);
      if (success) {
        setItem(data);

        let days = differenceInDays(
          new Date(checkout.split("=")[1]),
          new Date(checkin.split("=")[1])
        );
        typeof days === "number" && setCount(days);
      }
    };
    getData();
  }, [slug]);

  const submitPayment = (data) => {
    console.log(data);
    toast.success("A message has been sent");
    navigate("/");
    reset();
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value
      .replace(/\s/g, "")
      .match(/\d{1,4}/g)
      ?.join(" ");
    e.target.value = value ? value.substr(0, 19) : "";
  };

  const handleCardExpirationChange = (e) => {
    const { name, value } = e.target;

    if (name === "expiration") {
      const inputValue = value.replace(/\D/g, "");
      const month = inputValue.slice(0, 2);
      const year = inputValue.slice(2, 4);

      let formattedValue = "";

      if (month) formattedValue += month;
      if (year) formattedValue += `/${year}`;

      if (formattedValue.length > 5)
        formattedValue = formattedValue.slice(0, 4);

      e.target.value = formattedValue;
    }
  };

  const handleCVVChange = (event) => {
    let { value } = event.target;
    value = value.replace(/\s/g, "");

    if (!/^\d{1,5}$/.test(value)) value = value.slice(0, 4);
    event.target.value = value;
  };

  return (
    <>
      <Header />
      <Container maxWidth={"xl"} sx={{ minHeight: "100vh", py: "3rem" }}>
        <Stack direction={"row"} gap={"1rem"} alignItems={"center"}>
          <IconButton
            onClick={() => navigate(`/${slug.split("=")[1]}`)}
            aria-label="Prev page"
            size="large"
          >
            <HiArrowSmLeft style={{ fontSize: "3rem", color: "black" }} />
          </IconButton>
          <Typography variant="h3" fontFamily={"inherit"} fontWeight={500}>
            Request to book
          </Typography>
        </Stack>
        <Grid container spacing={2} mt={10}>
          <Grid item xs={12} md={7}>
            <Typography variant="h4" fontFamily={"inherit"} fontWeight={"500"}>
              Your trip
            </Typography>
            <Stack
              direction={"row"}
              justifyContent={{ xs: '"space-between"', md: "flex-start" }}
              gap={{ xs: "8px", md: "100px" }}
              mt={"20px"}
            >
              <Box>
                <Typography
                  variant="span"
                  sx={{ fontSize: "1.4rem", fontWeight: "500" }}
                >
                  Dates
                </Typography>
                <Typography ontFamily={"inherit"} fontSize={"1.1rem"}>
                  {new Date(
                    null,
                    +checkout.split("=")[1].slice(-5, -3) - 1
                  ).toLocaleString("default", {
                    month: "short",
                    locale: "en-US",
                  })}{" "}
                  {checkin.split("=")[1].slice(-2)} -{" "}
                  {checkout.split("=")[1].slice(-2)}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="span"
                  sx={{ fontSize: "1.4rem", fontWeight: "500" }}
                >
                  Guests
                </Typography>
                <Typography fontFamily={"inherit"} fontSize={"1.1rem"}>
                  {numberOfGuests.split("=")[1]} guest
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ my: "40px" }} />
            <Typography
              variant="h4"
              fontFamily={"inherit"}
              fontWeight={"500"}
              sx={{ mb: "12px" }}
            >
              Choose how to pay
            </Typography>

            <FormControl
              component="form"
              onSubmit={handleSubmit(submitPayment)}
              fullWidth
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                gap: "12px",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <TextField
                  sx={{ width: "100%" }}
                  label="Card number"
                  name="cardNumber"
                  placeholder="0000 0000 0000 0000"
                  variant="outlined"
                  {...register("cardNumber", {
                    required: true,
                    pattern: /^(?:\d{4}\s?){4}$/,
                  })}
                  error={errors.cardNumber !== undefined}
                  helperText={
                    errors.cardNumber && "Please match the required format"
                  }
                  onChange={handleCardNumberChange}
                />
                <Box sx={{ width: "100%", display: "flex" }}>
                  <TextField
                    sx={{ width: "100%" }}
                    label="Expiration"
                    name="expiration"
                    {...register("expiration", {
                      required: true,
                      maxLength: 5,
                      minLength: 4,
                      pattern: /^\d{2}\/\d{0,2}$/,
                    })}
                    error={errors.expiration}
                    InputProps={{
                      sx: {
                        borderTopRightRadius: "0px",
                        borderBottomRightRadius: "0px",
                      },
                    }}
                    helperText={
                      errors.expiration && "Please match the required format"
                    }
                    placeholder="MM/YY"
                    onChange={handleCardExpirationChange}
                  />
                  <TextField
                    sx={{ width: "100%" }}
                    label="CVV"
                    name="cvv"
                    type="number"
                    {...register("cvv", {
                      required: true,
                      maxLength: 4,
                      minLength: 3,
                    })}
                    error={errors.cvv}
                    InputProps={{
                      sx: {
                        borderTopLeftRadius: "0px",
                        borderBottomLeftRadius: "0px",
                      },
                    }}
                    helperText={
                      errors.cvv && "Please match the required format"
                    }
                    onChange={handleCVVChange}
                    placeholder="123"
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <Typography component="h6" variant="h6">
                  Billing address
                </Typography>
                <TextField
                  sx={{ width: "100%" }}
                  label="Street address"
                  {...register("streetAddress", { required: "Required" })}
                  error={errors.streetAddress}
                />
                <TextField
                  sx={{ width: "100%" }}
                  label="Apt or suite number"
                  {...register("aptOrSuiteNumber")}
                />
                <TextField
                  sx={{ width: "100%" }}
                  label="City"
                  {...register("city", { required: "Required" })}
                  error={errors.city}
                />
                <Box sx={{ width: "100%", display: "flex" }}>
                  <TextField
                    sx={{ width: "100%" }}
                    label="State"
                    id="outlined-start-adornment"
                    InputProps={{
                      sx: {
                        borderTopRightRadius: "0px",
                        borderBottomRightRadius: "0px",
                      },
                    }}
                    {...register("state")}
                  />
                  <TextField
                    sx={{ width: "100%" }}
                    label="ZIP code"
                    id="outlined-start-adornment"
                    InputProps={{
                      sx: {
                        borderTopLeftRadius: "0px",
                        borderBottomLeftRadius: "0px",
                      },
                    }}
                    {...register("zipCode", { required: "Required" })}
                    error={errors.zipCode}
                  />
                </Box>
                {errors.streetAddress || errors.city || errors.zipCode ? (
                  <Typography
                    component="div"
                    sx={{ color: "#f44", fontSize: "14px" }}
                  >
                    This is required
                  </Typography>
                ) : (
                  ""
                )}
              </Box>
              <Button
                variant="contained"
                color="error"
                type="submit"
                sx={{
                  display: "flex",
                  minWidth: "25%",
                  fontWeight: "semibold",
                  alignSelf: "flex-end",
                  textTransform: "inherit",
                }}
                size="large"
              >
                Confirm and pay
              </Button>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={5} px={{ xs: "0rem", md: "2rem" }}>
            <Card
              sx={{
                minWidth: "100%",
                boxShadow: "rgba(0, 0, 0, 0.12) 0px 6px 16px",
                border: "1px solid rgb(221, 221, 221)",
                borderRadius: "12px",
                p: "24px",
                position: {
                  xs: "relative",
                  md: "sticky !important",
                },
                top: { xs: "0", md: "30vh !important" },
              }}
            >
              <Stack
                direction={{ xs: "column-reverse", md: "row-reverse" }}
                justifyContent={"space-between"}
                mb={"16px"}
                width={"100% important"}
              >
                <CardContent
                  height={"100%"}
                  sx={{ width: { xs: "100%", md: "60%" } }}
                >
                  <Stack
                    direction={"column"}
                    height={"100% !important"}
                    justifyContent={"space-between"}
                  >
                    <Box>
                      <Typography
                        component="h6"
                        variant="h6"
                        fontSize={"0.9rem"}
                        color={"text.secondary"}
                      >
                        Butun chalet
                      </Typography>
                      <Typography
                        component="h6"
                        variant="h6"
                        fontSize={"1rem"}
                        fontWeight={400}
                      >
                        {item?.address}
                      </Typography>
                    </Box>
                    <Box sx={{ height: "20px" }} />
                    <Box
                      gap={{ xs: "20px", md: "5px" }}
                      mt={"8px"}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <Typography
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <RiStarSFill />
                        {Math.floor(Math.random() * 10)}
                        {"  "}
                        <Typography color={"text.secondary"}>
                          (reviews)
                        </Typography>
                      </Typography>
                      <Typography>•</Typography>
                      <Typography
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <RiMedalFill />
                        Superhost
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
                <Box
                  width={{ xs: "100% !important", md: "40% !important" }}
                  height={{ xs: "170px", sm: "300px", md: "150px" }}
                >
                  <LazyLoad
                    height={"100%"}
                    width={"100% !important"}
                    threshold={0.95}
                  >
                    <img
                      src={item && item?.photos[0]?.photo}
                      style={{
                        objectFit: "cover",
                        borderRadius: "12px",
                        width: "100%",
                        height: "100%",
                      }}
                      alt="Image"
                    />
                  </LazyLoad>
                </Box>
              </Stack>
              <Divider />
              <CardContent sx={{ p: "0px" }}>
                <Typography
                  variant="h5"
                  fontSize={"1.8rem"}
                  fontFamily={"inherit"}
                  fontWeight={500}
                  mt={2}
                  mb={1}
                >
                  Price Details
                </Typography>
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
              </CardContent>
              <CardContent sx={{ p: "0px !important" }}>
                <Typography variant="span" sx={{ textAlign: "center" }} mt={2}>
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
                      Total (USD)
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
      <Footer />
    </>
  );
};

export default OrderPage;
