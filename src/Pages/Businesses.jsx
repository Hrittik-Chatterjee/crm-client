import axios from "axios";
import { useEffect, useState } from "react";

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

  const filteredBusinesses = businesses.filter((business) =>
    business.businessName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
          className="mt-2 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-purple-500"
        />
        <ul className="mt-4 space-y-2">
          {filteredBusinesses.map((business) => (
            <li
              key={business.businessName}
              onClick={() => setSelectedBusiness(business)} // Update selected business
              className={`cursor-pointer px-3 py-2 rounded-md ${
                selectedBusiness?.businessName === business.businessName
                  ? "bg-purple-100"
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
      </div>

      {/* Business Details */}
      <div className="w-3/4 p-6">
        {selectedBusiness ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              {selectedBusiness.businessName}
            </h2>
            <div className="mb-4">
              <span className="font-semibold">Type of Business:</span>{" "}
              {selectedBusiness.typeOfBusiness}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Country:</span>{" "}
              {selectedBusiness.country}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Package:</span>{" "}
              {selectedBusiness.package}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Entry Date:</span>{" "}
              {selectedBusiness.entryDate}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Contact Details:</span>{" "}
              {selectedBusiness.contactDetails}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Email:</span>{" "}
              {selectedBusiness.email}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Address:</span>{" "}
              {selectedBusiness.address}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Note:</span>{" "}
              {selectedBusiness.note}
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">
                Social Media Links:
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(selectedBusiness.socialMediaLinks).map(
                  ([platform, link]) => (
                    <a
                      key={platform}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline"
                    >
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </a>
                  )
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">
            Select a business to view details.
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessDetails;
