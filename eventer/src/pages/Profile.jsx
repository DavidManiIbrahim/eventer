import { useEffect, useState } from "react";
import API from "../api/axios";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        console.log("Fetched profile:", res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, [id]);

  if (!profile)
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 mb-4"></div>
        <p className="text-gray-600">Loading events...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 ml-64">
      {/* Cover + Profile Image */}
      <div className="relative">
        <img
          src="/cover.jpg"
          alt="cover"
          className="h-48 w-full object-cover shadow"
        />
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <img
            src={`http://localhost:5000/uploads/profile_pic/${profile.profilePic}`}
            alt="profile"
            className="h-32 w-32 rounded-full border-4 border-white shadow-lg object-cover"
          />
        </div>
      </div>

      {/* User Info */}
      <div className="max-w-6xl mx-auto mt-20 px-6">
        <div className="flex flex-col md:flex-row md:justify-between items-center md:items-start gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900">
              {profile.username}
            </h1>
            <p className="mt-2 text-gray-600">{profile.email}</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow">
              Dashboard
            </button>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg shadow">
              Edit Profile
            </button>
          </div>
        </div>

        <hr className="my-8 border-t-2 border-indigo-600" />

        {/* Toggle Tabs */}
        <div className="flex gap-4 bg-gray-200 p-3 rounded-lg">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "upcoming"
                ? "bg-indigo-600 text-white"
                : "bg-gray-300"
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "past" ? "bg-indigo-600 text-white" : "bg-gray-300"
            }`}
            onClick={() => setActiveTab("past")}
          >
            Past
          </button>
          {(profile.role === "organizer" || profile.role === "admin") && (
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "created"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-300"
              }`}
              onClick={() => setActiveTab("created")}
            >
              Created Events
            </button>
          )}
        </div>

        {/* Events Section */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activeTab === "upcoming" &&
            (profile.tickets?.length ? (
              profile.tickets.map((event) => (
                <div
                  key={event._id}
                  className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition"
                >
                  {/* Event Image */}
                  {event.image && (
                    <img
                      src={`http://localhost:5000/uploads/event_image/${event.image}`}
                      alt={event.title}
                      className="h-40 w-full object-cover"
                    />
                  )}

                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {event.description}
                    </p>

                    <div className="mt-2 text-sm text-gray-500">
                      📍 {event.location}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      📅{" "}
                      {new Date(event.date).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      {event.time && (
                        <span>
                          {" "}
                          at{" "}
                          {new Date(
                            `1970-01-01T${event.time}`
                          ).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 font-medium text-indigo-600">
                      🎟 ₦{event.ticketPrice}
                    </div>
                    <div className="text-xs text-gray-500">
                      Tickets Left:{" "}
                      {event.totalTickets - (event.ticketsSold || 0)}
                    </div>

                    <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg">
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No upcoming events</p>
            ))}

          {activeTab === "created" &&
            (profile.createdEvents?.length ? (
              profile.createdEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition"
                >
                  {event.image && (
                    <img
                      src={`http://localhost:5000/uploads/event_image/${event.image}`}
                      alt={event.title}
                      className="h-40 w-full object-cover"
                    />
                  )}

                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {event.description}
                    </p>

                    <div className="mt-2 text-sm text-gray-500">
                      📍 {event.location}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      📅 {new Date(event.date).toLocaleDateString()} at{" "}
                      {event.time}
                    </div>

                    <div className="mt-2 font-medium text-indigo-600">
                      🎟 ₦{event.ticketPrice}
                    </div>
                    <div className="text-xs text-gray-500">
                      Tickets Left:{" "}
                      {event.totalTickets - (event.ticketsSold || 0)}
                    </div>

                    <button className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded-lg">
                      Manage Event
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No created events</p>
            ))}
        </div>

        {/* Future: Add Past Events Section Here */}
        {activeTab === "past" && <p className="text-gray-500">No past events</p>}
        
      </div>
    </div>
  );
};

export default Profile;
