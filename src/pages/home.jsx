import {
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Skeleton,
  TextField,
} from "@mui/material";
import { Header, Navbar, Footer, CardHero } from "../components";
import { useEffect, useState } from "react";
import { DataFetching } from "../api";
import { BsSearch } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { setRooms } from "../redux/rooms-slice";
import { setCategory } from "../redux/category-slice";
import { removeUser } from "../redux/auth-slice";

export default function HomePage() {
  const rooms = useSelector(({ roomsSlice }) => roomsSlice.rooms);
  const categoryStore = useSelector(
    ({ categorySlice }) => categorySlice.category
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const tokenTimeout = setTimeout(() => {
      localStorage.clear();
      dispatch(removeUser());
    }, 3 * 24 * 60 * 60 * 1000);
    return () => clearTimeout(tokenTimeout);
  }, []);

  const [cardItem, setCardItem] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getData = async () => {
      if (!rooms.length && !categoryStore.length) {
        const { data, success, category } = await DataFetching.getRoomsData();
        if (success) {
          setCardItem(data);
          setIsLoading(!success);
          setCategories(category);
          dispatch(setCategory(category));
          dispatch(setRooms(data));
        }
      } else {
        setCardItem(rooms);
        setCategories(categoryStore);
        setIsLoading(false);
      }
    };

    getData();
  }, []);

  const filterData = () => {
    let newData = cardItem.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
    return search.trim().length ? newData : cardItem;
  };

  return (
    <>
      <Header>
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value.trim())}
          sx={{
            display: {
              xs: "none",
              md: "flex",
              "& fieldset": { border: "none" },
              "& .MuiFormLabel-root": {
                fontWeight: "500",
                fontFamily: "inherit",
              },
            },
            width: "20rem",
          }}
          size="small"
          InputLabelProps={{ shrink: false, disableUnderline: true }}
          placeholder="Search..."
          autoComplete={false}
          InputProps={{
            style: {
              border: "1px solid #ff385c",
              borderRadius: "20px",
            },
            endAdornment: (
              <InputAdornment>
                <IconButton style={{ background: "#ff385c" }}>
                  <BsSearch fontSize={"0.8rem"} color={"white"} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Header>
      <Container maxWidth="xl" sx={{ minHeight: "100vh" }}>
        <Navbar categories={categories} />
        {isLoading ? (
          <Grid container spacing={2} width={"100%"} mb={4}>
            {[...Array(8)].map((_, i) => (
              <Grid key={i} item xs={12} sm={6} md={4} lg={3} sx={{ pt: 0.5 }}>
                <Skeleton width={"100%"} height={250} />
                <Skeleton width="100%" />
                <Skeleton width="100%" />
                <Skeleton width="100%" />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={2} mt={2}>
            {filterData().map((item, i) => (
              <CardHero key={i} item={item} />
            ))}
          </Grid>
        )}
      </Container>
      <Footer />
    </>
  );
}
