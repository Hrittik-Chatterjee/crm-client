import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { LiaBusinessTimeSolid } from "react-icons/lia";
import { IoLocationSharp } from "react-icons/io5";
import { MdAttachEmail, MdHotelClass, MdNoteAlt } from "react-icons/md";
import { FaCalendarAlt, FaPhone } from "react-icons/fa";
import { TbWorldPin } from "react-icons/tb";

const BusinessDetails = () => {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const getBusinesses = async () => {
    try {
      const response = await axios.get(
        "https://crm-backend-cjyf.onrender.com/businesses"
      );
      setBusinesses(response.data);
      if (response.data.length > 0) {
        setSelectedBusiness(response.data[0]); // Set the first business as default
      }
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
    <div className="flex h-screen-navbar">
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

      {/* Business Details */}
      <div
        className="w-full p-6 max-w-4xl mx-auto -mt-6"
        style={{ maxHeight: "calc(100vh - 120px)" }}
      >
        {selectedBusiness ? (
          <div className="bg-white shadow-md rounded-lg p-6 border">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              {selectedBusiness.businessName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-2">
                <span className="text-purple-600 text-xl  mt-1">
                  <LiaBusinessTimeSolid />
                </span>
                <div>
                  <p className="font-semibold text-gray-700">
                    Type of Business:
                  </p>
                  <p className="text-gray-600">
                    {selectedBusiness.typeOfBusiness}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 text-xl mt-1">
                  <TbWorldPin />
                </span>
                <div>
                  <p className="font-semibold text-gray-700">Country:</p>
                  <p className="text-gray-600">{selectedBusiness.country}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 text-xl mt-1">
                  <MdHotelClass />
                </span>
                <div>
                  <p className="font-semibold text-gray-700">Package:</p>
                  <p className="text-gray-600">{selectedBusiness.package}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-teal-600 text-xl mt-1 ">
                  <FaCalendarAlt />
                </span>
                <div>
                  <p className="font-semibold text-gray-700">Entry Date:</p>
                  <p className="text-gray-600">{selectedBusiness.entryDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-yellow-600 text-xl mt-1">
                  <FaPhone />
                </span>
                <div>
                  <p className="font-semibold text-gray-700">
                    Contact Details:
                  </p>
                  <p className="text-gray-600">
                    {selectedBusiness.contactDetails}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-pink-600 text-xl mt-1">
                  <MdAttachEmail />
                </span>
                <div>
                  <p className="font-semibold text-gray-700">Email:</p>
                  <p className="text-gray-600">{selectedBusiness.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-600 text-xl mt-1">
                  {" "}
                  <IoLocationSharp />
                </span>
                <div>
                  <p className="font-semibold text-gray-700">Address:</p>
                  <p className="text-gray-600">{selectedBusiness.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-indigo-600 text-xl mt-1">
                  <MdNoteAlt />
                </span>
                <div>
                  <p className="font-semibold text-gray-700">Note:</p>
                  <p className="text-gray-600">{selectedBusiness.note}</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Social Media Links:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(selectedBusiness.socialMediaLinks).map(
                  ([platform, link]) => {
                    const url =
                      typeof link === "object" && link !== null
                        ? link.url
                        : link;
                    return url ? (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:underline flex items-center gap-2"
                      >
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </a>
                    ) : (
                      <span
                        key={platform}
                        className="text-gray-500 flex items-center gap-2"
                      >
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}:
                        No link
                      </span>
                    );
                  }
                )}
              </div>
            </div>
            {/* <div className="mt-6 text-center">
              <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                Edit Business
              </button>
            </div> */}
          </div>
        ) : (
          <div className="text-gray-500 text-center">
            Select a business to view details.
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessDetails;
