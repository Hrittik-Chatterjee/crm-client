import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import "../Components/Dashboard.css";

const Links = () => {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalBusiness, setModalBusiness] = useState(null); // State to track the modal's business

  const getBusinesses = async () => {
    try {
      const response = await axios.get(
        "https://crm-backend-cjyf.onrender.com/businesses"
      );
      setBusinesses(response.data);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    }
  };

  useEffect(() => {
    getBusinesses();
  }, []);

  const { user } = useAuth();

  const filteredBusinesses = businesses
    .filter((business) =>
      user.role === "admin" ? true : business.assignedTo === user.username
    )
    .filter((business) =>
      business.businessName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="flex">
      {/* Sidebar */}
      {/* <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-2 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-purple-500"
        />
        <ul className="mt-4 space-y-2">
          {filteredBusinesses.map((business) => (
            <li
              key={business._id}
              onClick={() => setSelectedBusiness(business)}
              className={`cursor-pointer px-3 py-2 rounded-md ${
                selectedBusiness?._id === business._id
                  ? "bg-purple-200"
                  : "hover:bg-purple-100"
              }`}
            >
              {business.businessName}
            </li>
          ))}
          {filteredBusinesses.length === 0 && (
            <li className="px-3 py-2 text-gray-500">No results found</li>
          )}
        </ul>
      </div> */}
      <div className="w-1/4 bg-white shadow-md   h-full  ">
        <div className="p-4">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mt-2 w-full px-3 py-2 border rounded-md"
          />

          {/* Business List */}
          <ul
            className="mt-4 space-y-2 overflow-y-auto sidebar"
            style={{ maxHeight: "calc(100vh - 120px)" }} // Adjust max height dynamically
          >
            {filteredBusinesses.map((business) => (
              <li
                key={business.businessName}
                className={`cursor-pointer px-3 py-2 rounded-md ${
                  selectedBusiness === business.businessName
                    ? "bg-purple-200"
                    : "hover:bg-purple-100"
                }`}
                onClick={() => setSelectedBusiness(business)}
              >
                {business.businessName}
              </li>
            ))}
            {filteredBusinesses.length === 0 && (
              <li className="px-3 py-2 text-gray-500">No results found</li>
            )}
          </ul>
        </div>
      </div>
      {/* Table Content */}
      <div className="w-3/4 p-6">
        <table className="table">
          <thead>
            <tr>
              <th>Business Name</th>
              <th>Package</th>
              <th>Facebook</th>
              <th>Instagram</th>
              <th>YouTube</th>
              <th>Details</th>
            </tr>
          </thead>
          <tr>
            <td colSpan="6" className="w-full">
              <div
                style={{
                  maxHeight: "calc(100vh - 120px)", // Adjust as needed
                  overflowY: "auto", // Enable vertical scrolling
                }}
                className="sidebar "
              >
                <table className="w-full ">
                  <tbody>
                    {(selectedBusiness
                      ? [selectedBusiness]
                      : filteredBusinesses
                    ).map((business) => (
                      <tr key={business._id}>
                        <td>{business.businessName}</td>
                        <td>{business.package}</td>
                        <td>
                          <a
                            href={business?.socialMediaLinks?.facebook?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Facebook
                          </a>
                        </td>
                        <td>
                          <a
                            href={business?.socialMediaLinks?.instagram?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Instagram
                          </a>
                        </td>
                        <td>
                          <a
                            href={business?.socialMediaLinks?.youtube?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            YouTube
                          </a>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary -mr-6"
                            onClick={() => setModalBusiness(business)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                    {!selectedBusiness && businesses.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center text-gray-500">
                          No businesses available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </table>
      </div>

      {/* Modal */}
      {modalBusiness && (
        <dialog
          id="my_modal_5"
          className="modal modal-bottom sm:modal-middle"
          open
        >
          <div className="modal-box">
            <table className="table-auto w-full border border-gray-300">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Platform</th>
                  <th className="border px-4 py-2">Username</th>
                  <th className="border px-4 py-2">Password</th>
                  <th className="border px-4 py-2">Link</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(modalBusiness?.socialMediaLinks || {})
                  .filter(([platform]) =>
                    ["facebook", "instagram", "whatsApp", "youtube"].includes(
                      platform
                    )
                  )
                  .map(([platform, details]) => (
                    <tr key={platform}>
                      <td className="border px-4 py-2 capitalize">
                        {platform}
                      </td>
                      <td className="border px-4 py-2">
                        {details.username || "N/A"}
                      </td>
                      <td className="border px-4 py-2">
                        {details.password || "N/A"}
                      </td>
                      <td className="border px-4 py-2">
                        <a
                          href={details.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          Visit
                        </a>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="mt-4 flex justify-end">
              <a
                href={modalBusiness?.socialMediaLinks?.tripAdvisor}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-secondary mr-2"
              >
                TripAdvisor
              </a>
              <a
                href={modalBusiness?.socialMediaLinks?.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-secondary"
              >
                Website
              </a>
            </div>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setModalBusiness(null)} // Close modal
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Links;
