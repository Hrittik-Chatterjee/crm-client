import axios from "axios";
import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { useAuth } from "../hooks/useAuth";

const AddRegularContent = () => {
  const [businesses, setBusinesses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [selected, setSelected] = useState(new Date()); // Initialize with today's date

  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);

  const getBusinesses = async () => {
    try {
      const response = await axios.get(
        "https://crm-backend-cjyf.onrender.com/businesses"
      );
      setBusinesses(response.data); // Set the fetched data
    } catch (error) {
      console.error("Error fetching businesses:", error);
    }
  };

  useEffect(() => {
    getBusinesses();
  }, []);

  useEffect(() => {
    // Automatically set today's date when the component loads
    setSelected(new Date());
  }, []);

  const { user } = useAuth();
  const filteredBusinesses = businesses
    .filter((business) =>
      user.role === "admin" ? true : business.assignedTo === user.username
    )
    .filter((business) =>
      business.businessName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // handle form data
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Combine Poster Material and Tags
    const posterMaterial = e.target.posterMaterial.value;
    const tags = e.target.tags.value;
    const posterAndTags = `${posterMaterial} ${tags}`.trim();

    // Construct the payload
    const formData = {
      name: selectedBusiness?.businessName || "", // Use the selected business name
      date: selected
        ? new Date(selected).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          })
        : "", // Format date as YYYY-MM-DD
      posterAndTags, // Combined Poster Material and Tags
      vision: e.target.vision.value, // Capture vision input
      comments: e.target.comments.value,
      addedBy: user?.username,
      status: false, // Initial status set to false
    };

    try {
      const response = await axios.post(
        "https://crm-backend-cjyf.onrender.com/regularcontents",
        formData
      );
      console.log("Data saved successfully:", response.data);
      alert("Added successfully");
      // Optionally reset form or provide feedback
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className="flex h-screen-navbar">
      {/* Sidebar */}
      {/* <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto"> */}
      {/* DayPicker */}
      {/* <div className="w-full max-w-xs relative">
          <button
            className="select select-primary w-full max-w-xs bg-slate-300"
            onClick={toggleDatePicker}
          >
            {selected ? selected.toLocaleDateString() : "Select a Date"}
          </button>

          {showDatePicker && (
            <div
              className="absolute mt-2 border rounded p-2 shadow bg-gray-800 text-white z-10"
              style={{ minWidth: "fit-content" }}
            >
              <DayPicker
                mode="single"
                selected={selected}
                onSelect={(date) => {
                  setSelected(date);
                  setShowDatePicker(false);
                }}
                disabled={{ before: new Date() }}
              />
            </div>
          )}
        </div> */}
      {/* Search bar */}
      {/* <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
          className="mt-2 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-purple-500"
        /> */}
      {/* <ul className="mt-4 space-y-2">
          {filteredBusinesses.map((business) => (
            <li
              key={business.businessName}
              onClick={() => setSelectedBusiness(business)} 
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
        </ul> */}
      {/* </div> */}

      <div className="w-1/4 bg-white shadow-md   h-full  ">
        <div className="p-4">
          {/* Date Picker */}
          <button
            className="select select-primary w-full max-w-xs bg-slate-100 flex items-center justify-center"
            onClick={toggleDatePicker}
          >
            <p className="text-center">
              {selected ? selected.toLocaleDateString() : "Select a Date"}
            </p>
          </button>

          {showDatePicker && (
            <div className="absolute mt-2 border rounded p-2 shadow bg-gray-800 text-white z-10">
              <DayPicker
                mode="single"
                selected={selected}
                onSelect={(date) => {
                  setSelected(date);
                  setShowDatePicker(false);
                }}
              />
            </div>
          )}

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
                  selectedBusiness?.businessName === business.businessName
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

      {/* Regular content */}
      <div className="w-3/4 p-6">
        <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
          <form
            className="w-full max-w-lg bg-white shadow-md rounded-lg p-6"
            onSubmit={handleSubmit}
          >
            <h2 className="text-xl font-bold mb-4">Add Special Content</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={selectedBusiness?.businessName || ""}
                  readOnly
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-200 cursor-not-allowed focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Date
                </label>
                <input
                  type="text"
                  value={selected?.toLocaleDateString() || ""}
                  readOnly
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-200 cursor-not-allowed focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Poster Material
              </label>
              <textarea
                name="posterMaterial"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
              ></textarea>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Tags
              </label>
              <textarea
                name="tags"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
                value={selectedBusiness?.tags || ""}
              ></textarea>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Vision
              </label>
              <textarea
                name="vision"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
              ></textarea>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Comments
              </label>
              <textarea
                name="comments"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
              ></textarea>
            </div>

            <div className="mt-6 text-right">
              <button
                type="submit"
                className="bg-purple-500 text-white px-6 py-2 rounded shadow hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRegularContent;
