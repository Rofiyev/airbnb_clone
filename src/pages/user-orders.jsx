import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Box,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";
import { DataFetching } from "../api";

export default function UserOrders() {
  const auth = useSelector(({ authSlice }) => authSlice.user);

  const [bookingLists, setBookingLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (auth) {
      async function getData() {
        const { data, success } = await DataFetching.getUserBookingList(
          auth.access
        );
        if (success) {
          setBookingLists(data);
          setIsLoading(!success);
        }
      }
      getData();
    }
  }, [auth]);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#ff385c",
      color: theme.palette.common.white,
      fontSize: 18,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const [searchValue, setSearchValue] = useState("");
  return (
    <>
      <Header />
      {isLoading ? (
        <Stack
          height={"70vh"}
          direction={"row"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <CircularProgress color="error" />
        </Stack>
      ) : (
        <Container maxWidth={"lg"}>
          <Box sx={{ minHeight: "100vh", py: "60px" }}>
            <Typography
              sx={{
                fontFamily: "inherit",
                fontSize: {
                  xs: "1.3rem",
                  md: "2rem",
                },
                fontWeight: "500",
              }}
              component="h5"
              variant="h5"
            >
              Your orders
            </Typography>
            <Stack
              direction={{ xs: "column-reverse", md: "row" }}
              alignItems={{ xs: "flex-start", md: "center" }}
              justifyContent={"space-between"}
              gap={"0.5rem"}
              my={"1rem"}
            >
              <TextField
                label="Search"
                size="small"
                onChange={(e) => setSearchValue(e.target.value.trim())}
                sx={{ maxWidth: "500px" }}
              />
              <Typography
                sx={{
                  fontFamily: "inherit",
                  fontWeight: "500",
                  fontSize: { xs: "1rem", md: "1.5rem" },
                }}
              >
                All orders: {bookingLists.length}
              </Typography>
            </Stack>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 800 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    {["#", "Name", "Date in", "Date out", "Total price"].map(
                      (item, index) => (
                        <StyledTableCell
                          sx={{ fontFamily: "inherit" }}
                          key={index}
                        >
                          {item}
                        </StyledTableCell>
                      )
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookingLists.length &&
                    bookingLists
                      .filter((item) =>
                        item.room
                          .toString()
                          .toLowerCase()
                          .includes(searchValue.toLowerCase().trim())
                      )
                      .map((item, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell
                            sx={{ fontWeight: "bold", fontFamily: "inherit" }}
                          >
                            {index + 1}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ fontFamily: "inherit" }}
                            component="th"
                            scope="row"
                          >
                            {item.room}
                          </StyledTableCell>
                          <StyledTableCell sx={{ fontFamily: "inherit" }}>
                            {item.date_in}
                          </StyledTableCell>
                          <StyledTableCell sx={{ fontFamily: "inherit" }}>
                            {item.date_out}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ fontFamily: "inherit", fontWeight: "500" }}
                          >
                            ${item.total_price + 70}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Container>
      )}
      <Footer />
    </>
  );
}
