import { useEffect, useState } from "react";
import axios from "axios";

const EditBusinessForm = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    typeOfBusiness: "",
    country: "",
    package: "",
    entryDate: "",
    contactDetails: "",
    email: "",
    address: "",
    note: "",
    socialMediaLinks: {
      facebook: { url: "", username: "", password: "" },
      instagram: { url: "", username: "", password: "" },
      whatsApp: { url: "", username: "", password: "" },
      youtube: { url: "", username: "", password: "" },
      website: "",
      tripAdvisor: "",
      googleBusiness: "",
    },
    tags: "",
    assignedTo: "",
  });

  const [users, setUsers] = useState([]); // State for user list
  const [businessList, setBusinessList] = useState([]); // State for list of businesses
  const [businessId, setBusinessId] = useState(""); // State for selected businessId
  const [successMessage, setSuccessMessage] = useState(""); // Success alert
  const [errorMessage, setErrorMessage] = useState(""); // Error alert

  // Fetch all businesses
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://crm-backend-cjyf.onrender.com/businesses",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the Bearer token in the header
            },
          }
        );
        setBusinessList(response.data);
      } catch (error) {
        console.error("Error fetching businesses:", error);
      }
    };
    fetchBusinesses();
  }, []);

  // Fetch users for the "assigned to" field
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authorization token found");
          return;
        }
        const response = await axios.get(
          "https://crm-backend-cjyf.onrender.com/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const filteredUsers = response.data.filter(
          (user) => user.role !== "admin"
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch business details when a business is selected
  useEffect(() => {
    if (!businessId) return;

    const fetchBusinessDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://crm-backend-cjyf.onrender.com/businesses/${businessId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the Bearer token in the header
            },
          }
        );
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching business details:", error);
      }
    };
    fetchBusinessDetails();
  }, [businessId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("socialMediaLinks")) {
      // eslint-disable-next-line no-unused-vars
      const [_, platform, field] = name.split(".");

      if (!field) {
        setFormData((prev) => ({
          ...prev,
          socialMediaLinks: {
            ...prev.socialMediaLinks,
            [platform]: value,
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          socialMediaLinks: {
            ...prev.socialMediaLinks,
            [platform]: {
              ...prev.socialMediaLinks[platform],
              [field]: value,
            },
          },
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setErrorMessage("Authorization token is missing.");
        return;
      }

      // Exclude the `_id` field from the payload
      // eslint-disable-next-line no-unused-vars
      const { _id, ...dataToUpdate } = formData;

      const response = await axios.patch(
        `http://localhost:5000/businesses/${businessId}`,
        dataToUpdate,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the Bearer token in the header
          },
        }
      );

      console.log("Business updated successfully:", response.data);
      setSuccessMessage("Business updated successfully!");
      setErrorMessage(""); // Clear any previous error
    } catch (error) {
      console.error("Error updating business:", error);
      setErrorMessage("Error updating business. Please try again.");
      setSuccessMessage(""); // Clear any previous success message
    }
  };

  return (
    <div className="flex">
      {/* Sidebar with Business List */}
      <div className="w-1/4 p-4 bg-gray-100">
        <h3 className="text-lg font-semibold">Select a Business</h3>
        <ul>
          {businessList.map((business) => (
            <li
              key={business._id}
              className="cursor-pointer p-2 hover:bg-gray-200"
              onClick={() => setBusinessId(business._id)}
            >
              {business.businessName}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Form */}
      <div className="w-3/4 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Edit Business Information
        </h2>

        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}
        {errorMessage && (
          <div className="alert alert-error">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Business Name:
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Type of Business */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type of Business:
              </label>
              <input
                type="text"
                name="typeOfBusiness"
                value={formData.typeOfBusiness}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country:
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Package */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Package:
              </label>
              <input
                type="text"
                name="package"
                value={formData.package}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Entry Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Entry Date:
              </label>
              <input
                type="date"
                name="entryDate"
                value={formData.entryDate}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Contact Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact Details:
              </label>
              <input
                type="text"
                name="contactDetails"
                value={formData.contactDetails}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address:
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Social Media Links */}
          <h2 className="text-xl font-bold mt-6 mb-4">Social Media Links</h2>
          {["facebook", "instagram", "whatsApp", "youtube"].map((platform) => (
            <div key={platform} className="mb-4">
              <h3 className="text-lg font-semibold capitalize">{platform}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    URL:
                  </label>
                  <input
                    type="text"
                    name={`socialMediaLinks.${platform}.url`}
                    value={formData.socialMediaLinks[platform].url}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username:
                  </label>
                  <input
                    type="text"
                    name={`socialMediaLinks.${platform}.username`}
                    value={formData.socialMediaLinks[platform].username}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password:
                  </label>
                  <input
                    type="password"
                    name={`socialMediaLinks.${platform}.password`}
                    value={formData.socialMediaLinks[platform].password}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Website, TripAdvisor, and Google Business Links */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Website:
              </label>
              <input
                type="text"
                name="socialMediaLinks.website"
                value={formData.socialMediaLinks.website}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                TripAdvisor:
              </label>
              <input
                type="text"
                name="socialMediaLinks.tripAdvisor"
                value={formData.socialMediaLinks.tripAdvisor}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Google Business:
              </label>
              <input
                type="text"
                name="socialMediaLinks.googleBusiness"
                value={formData.socialMediaLinks.googleBusiness}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Assigned To */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Assigned To:
            </label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user._id} value={user.username}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBusinessForm;
