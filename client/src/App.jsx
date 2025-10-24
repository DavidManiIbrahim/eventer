import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyTickets from "./pages/MyTickets";
import Dashboard from "./pages/Dashboard";
import NavBar from "./components/NavBar";
import Success from "./pages/Success";
import StatsDashboard from "./pages/StatsDashboard";
import Sidebar from "./components/SideBar";
import LiveEvent from "./components/LiveEvents";
import Settings from "./components/Settings";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import EventDetail from "./pages/EventDetails";
import Checkout from "./pages/CheckOut";
import TicketScanner from "./pages/TicketScanner";
import TicketValidationPage from "./pages/ValidateTicket";
import UserManagement from "./pages/Admin";

import AboutUs from "./pages/AboutUs"
import Contact from "./pages/Contact"
import Pricing from "./pages/Pricing"
import Donation from "./pages/Donation"
import HelpCenter from "./pages/HelpCenter"
import Documentation from "./pages/Documentation"
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService"

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
        <Route path="/my-tickets" element={<MyTickets />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<StatsDashboard />} />
        <Route path="/Eventdetail/:eventId" element={<EventDetail />} />
        <Route path="/success" element={<Success />} />
        <Route path="/live/events" element={<LiveEvent />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/checkout/:eventId" element={<Checkout />} />
        <Route path="/scanner" element={<TicketScanner />} />
        <Route path="/validate/:ticketId" element={<TicketValidationPage />} />

        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/donate" element={<Donation />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/docs" element={<Documentation />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
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
