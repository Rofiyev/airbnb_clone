import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Stack,
} from "@mui/material";
import { AiFillStar } from "react-icons/ai";
import { Link } from "react-router-dom";
// Import css files
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function CardHero({ item }) {
  let settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Link style={{ textDecoration: "none" }} to={item?.slug}>
        <Card
          sx={{
            maxWidth: "100%",
            boxShadow: "none !important",
            borderRadius: "1rem",
          }}
        >
          <Slider {...settings}>
            {item?.photos?.map(({ photo }, i) => (
              <CardMedia
                key={i}
                component="img"
                height="250"
                image={photo}
                alt="Slide Item"
              />
            ))}
          </Slider>
          <CardContent>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography
                sx={{ fontFamily: "inherit", fontSize: "18px" }}
                gutterBottom
                variant="h6"
                component="h2"
              >
                {item?.title}
              </Typography>
              <Typography
                sx={{ display: "flex", alignItems: "center", gap: "3px" }}
                variant="span"
                component="span"
                fontWeight={"500"}
              >
                <AiFillStar />{" "}
                {Math.floor(Math.random() * 10) > 0
                  ? Math.floor(Math.random() * 10)
                  : 1}
              </Typography>
            </Stack>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography variant="body1" color="text.secondary">
                Lizards are a widespread
              </Typography>
              <Typography
                sx={{ display: "flex", alignItems: "center", gap: "3px" }}
                variant="span"
                component="span"
                fontWeight={"500"}
              >
                ${item?.price} night
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
}
