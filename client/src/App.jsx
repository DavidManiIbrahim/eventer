import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import LandingPage from "../src/pages/LandingPage.jsx";
import Login from "../src/pages/Login";
import Register from "../src/pages/Register";
import CreateEvent from "../src/pages/CreateEvent";
import MyTickets from "../src/pages/MyTickets";
import Dashboard from "../src/pages/Dashboard";
import EditEvent from "../src/pages/EditEvent.jsx";
import NavBar from "../src/components/NavBar";
import Success from "../src/pages/Success";
import StatsDashboard from "../src/pages/StatsDashboard";
import Sidebar from "../src/components/SideBar";
import LiveEvent from "../src/components/LiveEvents";
import Settings from "../src/components/Settings";
import Profile from "../src/pages/Profile";
import EventDetail from "../src/pages/EventDetails";
import Checkout from "../src/pages/CheckOut";
import TicketScanner from "../src/pages/TicketScanner";
import TicketValidationPage from "../src/pages/ValidateTicket";
import UserManagement from "../src/pages/Admin";
import Donate from "../src/pages/Donate";
import Pricing from "../src/pages/pricing";


function Layout() {
  const location = useLocation();

  // hide navbar & sidebar on landing page
  const hideNavAndSidebar = location.pathname === "/";

  return (
    <>
      {!hideNavAndSidebar && <NavBar />}
      {!hideNavAndSidebar && <Sidebar />}
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/events" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/my-tickets" element={<MyTickets />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<StatsDashboard />} />
        <Route path="/Eventdetail/:eventId" element={<EventDetail />} />
        <Route path="/edit/:eventId" element={<EditEvent />} />
        <Route path="/success" element={<Success />} />
        <Route path="/live/events" element={<LiveEvent />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/checkout/:eventId" element={<Checkout />} />
        <Route path="/scanner" element={<TicketScanner />} />
        <Route path="/validate/:ticketId" element={<TicketValidationPage />} />
        <Route path="/donate" element={<Donate/>} />
        <Route path="/pricing" element={<Pricing/>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
