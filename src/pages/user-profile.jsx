import { Container } from "@mui/material";
import { Footer, Header } from "../components";

const UserProfile = () => {
  return (
    <>
      <Header />
      <Container maxWidth={"xl"} sx={{ minHeight: "70vh", py: "1rem" }}>
        <h1>Hello world!</h1>
      </Container>
      <Footer />
    </>
  );
};

export default UserProfile;
