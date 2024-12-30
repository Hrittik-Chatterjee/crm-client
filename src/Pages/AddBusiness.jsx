/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";

const AddBusiness = () => {
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
    assignedCW: "",
    assignedCD: "",
  });

  const [users, setUsers] = useState([]); // State for user list

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Get the token from localStorage (or another storage if needed)
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No authorization token found");
          return;
        }

        const response = await axios.get(
          "https://crm-backend-cjyf.onrender.com/users",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the Bearer token in the header
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

  const filteredDesigner = users.filter((user) => user.role === "designer");
  const filteredContentWriter = users.filter(
    (user) => user.role === "content writer"
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("socialMediaLinks")) {
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
      const response = await axios.post(
        "https://crm-backend-cjyf.onrender.com/businesses",
        formData
      );
      console.log("Form submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    console.log(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-center mb-6">
        Business Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Note:</label>
        <textarea
          name="note"
          value={formData.note}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

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

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Tags:</label>
        <textarea
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Assign Content Writer:
        </label>
        <select
          name="assignedCW"
          value={formData.assignedCW}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select a user</option>
          {filteredContentWriter.map((user) => (
            <option key={user._id} value={user.username}>
              {user.username}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Assign Designer:
        </label>
        <select
          name="assignedCD"
          value={formData.assignedCD}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select a user</option>
          {filteredDesigner.map((user) => (
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
  );
};

export default AddBusiness;
