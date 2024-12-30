import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import axios from "axios";
import "react-day-picker/dist/style.css";
import { useAuth } from "../hooks/useAuth";
import "./Dashboard.css";

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [businesses, setBusinesses] = useState([]);
  const [regularContents, setRegularContents] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const { user } = useAuth();

  // Fetch businesses
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

  // Fetch regular contents
  const getRegularContents = async () => {
    try {
      const response = await axios.get(
        "https://crm-backend-cjyf.onrender.com/regularcontents"
      );
      setRegularContents(response.data);
    } catch (error) {
      console.error("Error fetching regular contents:", error);
    }
  };

  useEffect(() => {
    getRegularContents();
  }, []);

  // Filter businesses based on the search query
  // const filteredBusinesses = businesses
  //   .filter((business) =>
  //     user.role === "admin" ? true : business.assignedTo === user.username
  //   )
  //   .filter((business) =>
  //     business.businessName.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  const filteredBusinesses = businesses
    .filter(
      (business) =>
        user.role === "admin" ||
        business.assignedCW === user.username ||
        business.assignedCD === user.username
    )
    .filter((business) =>
      business.businessName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const filteredContents = regularContents.filter((content) => {
    const isDateMatch =
      new Date(content.date).toLocaleDateString() ===
      selectedDate.toLocaleDateString();
    const isBusinessMatch =
      !selectedBusiness || content.name === selectedBusiness;
    const isUserMatch =
      user.role === "admin" || user.username === content.addedBy;

    return isDateMatch && isBusinessMatch && isUserMatch;
  });

  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);

  // Add the updated status change functionality
  const handleTickClick = async (id, currentStatus) => {
    if (!currentStatus) {
      // Change status from 'Processing' to 'Done'
      try {
        await axios.patch(
          `https://crm-backend-cjyf.onrender.com/regularcontents/${id}`,
          {
            status: true,
          }
        );
        setRegularContents((prev) =>
          prev.map((content) =>
            content._id === id ? { ...content, status: true } : content
          )
        );
      } catch (error) {
        console.error("Error updating status to 'Done':", error);
        alert("Failed to update status. Please try again.");
      }
    }
  };

  const handleCrossClick = async (id, currentStatus) => {
    if (currentStatus) {
      // Change status from 'Done' to 'Processing'
      try {
        await axios.patch(
          `https://crm-backend-cjyf.onrender.com/regularcontents/${id}`,
          {
            status: false,
          }
        );
        setRegularContents((prev) =>
          prev.map((content) =>
            content._id === id ? { ...content, status: false } : content
          )
        );
      } catch (error) {
        console.error("Error updating status to 'Processing':", error);
        alert("Failed to update status. Please try again.");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://crm-backend-cjyf.onrender.com/regularcontents/${id}`
      );
      setRegularContents((prev) =>
        prev.filter((content) => content._id !== id)
      );
      alert("Content deleted successfully.");
    } catch (error) {
      console.error("Error deleting content from backend:", error);
      alert("Failed to delete content. Please try again.");
    }
  };

  const openViewModal = (content) => {
    setModalContent(content);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => setIsViewModalOpen(false);

  const openEditModal = (content) => {
    setEditFormData(content);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => setIsEditModalOpen(false);

  const handleEditChange = (field, value) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };
  const saveEditChanges = async () => {
    try {
      const { _id, ...updateData } = editFormData; // Exclude _id from the payload
      await axios.patch(
        `https://crm-backend-cjyf.onrender.com/regularcontents/${_id}`,
        updateData
      );
      setRegularContents((prev) =>
        prev.map((content) =>
          content._id === _id ? { ...content, ...updateData } : content
        )
      );
      alert("Content updated successfully.");
      closeEditModal();
    } catch (error) {
      console.error("Error saving changes to backend:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  return (
    <div className="flex  bg-gray-100 font-title" style={{ height: "90vh" }}>
      {/* Sidebar */}
      <div className="w-1/4 bg-white shadow-md   h-full  ">
        <div className="p-4">
          {/* Date Picker */}
          <button
            className="select select-primary w-full max-w-xs bg-slate-100 flex items-center justify-center"
            onClick={toggleDatePicker}
          >
            <p className="text-center">
              {selectedDate
                ? selectedDate.toLocaleDateString()
                : "Select a Date"}
            </p>
          </button>

          {showDatePicker && (
            <div className="absolute mt-2 border rounded p-2 shadow bg-gray-800 text-white z-10">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
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
            style={{ maxHeight: "calc(100vh - 200px)" }} // Adjust max height dynamically
          >
            {filteredBusinesses.map((business) => (
              <li
                key={business.businessName}
                className={`cursor-pointer px-3 py-2 rounded-md ${
                  selectedBusiness === business.businessName
                    ? "bg-purple-200"
                    : "hover:bg-purple-100"
                }`}
                onClick={() => setSelectedBusiness(business.businessName)}
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

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Content {selectedDate.toLocaleDateString() || "No Date Selected"}
        </h2>
        <table className="w-full bg-white shadow-md rounded-md overflow-hidden">
          <thead>
            <div>
              <tr className="bg-blue-100 text-center">
                <th
                  className="py-2"
                  style={{
                    fontWeight: "normal",
                    fontSize: "clamp(0.875rem, 1vw, 1.125rem)", // Responsive font size
                    paddingLeft: "3rem",
                    paddingRight: "6rem",
                  }}
                >
                  Business Name
                </th>
                <th
                  className="py-2"
                  style={{
                    fontWeight: "normal",
                    fontSize: "clamp(0.875rem, 1vw, 1.125rem)",
                    paddingRight: "8rem",
                  }}
                >
                  Date
                </th>
                <th
                  className="py-2"
                  style={{
                    fontWeight: "normal",
                    fontSize: "clamp(0.875rem, 1vw, 1.125rem)",
                    paddingRight: "4rem",
                  }}
                >
                  Status
                </th>
                <th
                  className="py-2"
                  style={{
                    fontWeight: "normal",
                    fontSize: "clamp(0.875rem, 1vw, 1.125rem)",
                    paddingRight: "8rem",
                  }}
                >
                  Change Status
                </th>
                <th
                  className="py-2"
                  style={{
                    fontWeight: "normal",
                    fontSize: "clamp(0.875rem, 1vw, 1.125rem)",
                    paddingRight: "10rem",
                  }}
                >
                  Action
                </th>
              </tr>
            </div>
          </thead>

          <tbody>
            <tr>
              <td colSpan="5">
                <div
                  style={{
                    maxHeight: "calc(100vh - 200px)", // Adjust as needed
                    overflowY: "auto", // Enable vertical scrolling
                  }}
                  className="sidebar"
                >
                  <table className="w-full">
                    <tbody>
                      {filteredContents.map((content) => (
                        <tr
                          key={content._id}
                          className="border-b hover:bg-gray-50 text-center"
                        >
                          <td className="px-4 py-2">{content.name}</td>
                          <td className="px-4 py-2">
                            {new Date(content.date).toLocaleDateString()}
                          </td>
                          <td
                            className={`px-4 py-2 ${
                              content.status ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {content.status ? "Done" : "Processing"}
                          </td>
                          <td className="py-2 flex justify-center items-center space-x-2">
                            {/* Buttons */}
                            <button
                              className="px-3 bg-blue-500 text-white"
                              onClick={() =>
                                handleTickClick(content._id, content.status)
                              }
                              disabled={content.status}
                              style={{
                                boxShadow: "none", // No initial shadow
                                transition: "box-shadow 0.3s ease-in-out", // Smooth transition for the shadow effect
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.boxShadow =
                                  "0 6px 15px rgba(29, 78, 216, 0.8)"; // Deeper blue shadow on hover
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.boxShadow = "none"; // Remove the shadow when not hovered
                              }}
                            >
                              ✓
                            </button>
                            <button
                              className="px-3 bg-red-600 text-white"
                              onClick={() =>
                                handleCrossClick(content._id, content.status)
                              }
                              disabled={!content.status}
                              style={{
                                boxShadow: "none", // No initial shadow
                                transition: "box-shadow 0.3s ease-in-out", // Smooth transition for the shadow effect
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.boxShadow =
                                  "0 6px 15px rgba(255, 0, 0, 0.8)"; // Deeper blue shadow on hover
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.boxShadow = "none"; // Remove the shadow when not hovered
                              }}
                            >
                              ✕
                            </button>
                          </td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => openEditModal(content)}
                              className="px-3 mr-2 bg-blue-500 text-white"
                              style={{
                                boxShadow: "none", // No initial shadow
                                transition: "box-shadow 0.3s ease-in-out", // Smooth transition for the shadow effect
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.boxShadow =
                                  "0 6px 15px rgba(29, 78, 216, 0.8)"; // Deeper blue shadow on hover
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.boxShadow = "none"; // Remove the shadow when not hovered
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => openViewModal(content)}
                              className="px-3 mr-2 bg-blue-500 text-white"
                              style={{
                                boxShadow: "none", // No initial shadow
                                transition: "box-shadow 0.3s ease-in-out", // Smooth transition for the shadow effect
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.boxShadow =
                                  "0 6px 15px rgba(29, 78, 216, 0.8)"; // Deeper blue shadow on hover
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.boxShadow = "none"; // Remove the shadow when not hovered
                              }}
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleDelete(content._id)}
                              className="px-3 mr-2 bg-blue-500 text-white"
                              style={{
                                boxShadow: "none", // No initial shadow
                                transition: "box-shadow 0.3s ease-in-out", // Smooth transition for the shadow effect
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.boxShadow =
                                  "0 6px 15px rgba(29, 78, 216, 0.8)"; // Deeper blue shadow on hover
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.boxShadow = "none"; // Remove the shadow when not hovered
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredContents.length === 0 && (
                        <tr>
                          <td
                            colSpan="5"
                            className="text-center px-4 py-2 text-gray-500"
                          >
                            No content available for this selection
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {isViewModalOpen && modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="bg-white rounded-lg shadow-lg p-6 relative"
            style={{
              width: "70vw", // Adjusted width for better fit
              height: "80vh", // Height adjusted to match the provided design
              overflowY: "auto",
            }}
          >
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Content Details
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {/* Left Sidebar */}
              <div className="flex flex-col h-full">
                <div className="w-full text-left px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600">
                  Business Name
                </div>
                <div className="w-full text-left px-4 py-2 mt-5 bg-gray-200 text-gray-700 font-medium rounded">
                  Post Materials & Tags
                </div>
                <div className="w-full text-left px-4 py-2 mt-24 bg-gray-200 text-gray-700 font-medium rounded">
                  Poster Material
                </div>
                <div className="w-full text-left px-4 py-2 mt-24 bg-gray-200 text-gray-700 font-medium rounded">
                  Vision
                </div>
                <div className="w-full text-left px-4 py-2 mt-24 bg-gray-200 text-gray-700 font-medium rounded">
                  Comment
                </div>
              </div>

              {/* Right Content Area */}
              <div className="col-span-2 space-y-4">
                <div>
                  <input
                    type="text"
                    className="w-2/3 border rounded px-4 py-2 text-gray-700"
                    value={modalContent.name || ""}
                    readOnly
                  />
                  <input
                    type="text"
                    className="w-1/3 rounded border px-4 py-2 text-gray-700"
                    readOnly
                    value={modalContent?.date || "No Date"}
                  />
                </div>
                <div>
                  <textarea
                    className="w-full border rounded px-4 py-2 text-gray-700"
                    rows={4}
                    value={modalContent.postAndTags || ""}
                    readOnly
                  />
                </div>
                <div>
                  <textarea
                    className="w-full border rounded px-4 py-2 text-gray-700"
                    rows={4}
                    value={modalContent.posterMaterial || ""}
                    readOnly
                  />
                </div>
                <div>
                  <textarea
                    className="w-full border rounded px-4 py-2 text-gray-700"
                    rows={4}
                    value={modalContent.vision || ""}
                    readOnly
                  />
                </div>
                <div>
                  <textarea
                    className="w-full border rounded px-4 py-2 text-gray-700"
                    rows={4}
                    value={modalContent.comments || ""}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600"
                onClick={closeViewModal}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="bg-white rounded-lg shadow-lg p-6 relative"
            style={{
              width: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h3 className="text-2xl font-bold mb-4">Edit Content</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={editFormData.name || ""}
                  onChange={(e) => handleEditChange("name", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Post Material
                </label>
                <textarea
                  value={editFormData.postAndTags || ""}
                  onChange={(e) =>
                    handleEditChange("postMaterial", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-md"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Poster Material
                </label>
                <textarea
                  value={editFormData.posterMaterial || ""}
                  onChange={(e) =>
                    handleEditChange("posterMaterial", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-md"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Vision
                </label>
                <textarea
                  value={editFormData.vision || ""}
                  onChange={(e) => handleEditChange("vision", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <input
                  type="text"
                  value={editFormData.tags || ""}
                  onChange={(e) => handleEditChange("tags", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 mr-2"
                onClick={closeEditModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={saveEditChanges}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
