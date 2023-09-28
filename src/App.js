import { Route, Routes } from "react-router-dom";
import {
  CardDetailPage,
  HomePage,
  NotFound,
  OrderPage,
  UserOrders,
  UserProfile,
} from "./pages";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/:id" element={<CardDetailPage />} />
      <Route path="/user-profile" element={<UserProfile />} />
      <Route
        path="/order/:slug/:checkin/:checkout/:numberOfGuests/:price"
        element={<OrderPage />}
      />
      <Route path="/user-orders" element={<UserOrders />} />
      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
