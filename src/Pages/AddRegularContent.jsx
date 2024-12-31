import axios from "axios";
import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { useAuth } from "../hooks/useAuth";
import ContentTable from "../Components/Table/ContentTable";
import ViewModal from "../Components/Modals/ViewModal";
import EditModal from "../Components/Modals/EditModal";

const AddRegularContent = () => {
  const [businesses, setBusinesses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Initialize with today's date
  const [regularContents, setRegularContents] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const { user } = useAuth();

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
    setSelectedDate(new Date());
  }, []);

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

  const filteredContents = regularContents.filter((content) => {
    const isDateMatch =
      new Date(content.date).toLocaleDateString() ===
      selectedDate.toLocaleDateString();
    const isBusinessMatch =
      selectedBusiness && content.name === selectedBusiness.businessName;
    const isUserMatch =
      user.role === "admin" || user.username === content.addedBy;

    return isDateMatch && isBusinessMatch && isUserMatch;
  });

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

  const convertDateToInputFormat = (date) => {
    if (!date) return ""; // Handle empty or undefined dates
    const [month, day, year] = date.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };
  const convertDateToMMDDYYYY = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${month}/${day}/${year}`;
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

  // handle form data
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Combine Poster Material and Tags

    // Construct the payload
    const formData = {
      name: selectedBusiness?.businessName || "", // Use the selected business name
      date: selectedDate
        ? new Date(selectedDate).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          })
        : "", // Format date as YYYY-MM-DD
      postMaterial: e.target.postMaterial.value,
      tags: e.target.tags.value, // Combined Poster Material and Tags
      vision: e.target.vision.value, // Capture vision input
      comments: e.target.comments.value,
      posterMaterial: e.target.posterMaterial.value,
      addedBy: user?.username,
      status: false, // Initial status set to false
    };

    try {
      // Step 1: Save regular content data
      const response = await axios.post(
        "https://crm-backend-cjyf.onrender.com/regularcontents",
        formData
      );
      console.log("Data saved successfully:", response.data);
      console.log(formData);
      alert("Added successfully");

      // Step 2: Update the business with new tags
      if (selectedBusiness?._id) {
        const updatedBusinessData = {
          tags: e.target.tags.value, // Only update the tags field
        };

        const businessUpdateResponse = await axios.patch(
          `https://crm-backend-cjyf.onrender.com/businesses/${selectedBusiness._id}`,
          updatedBusinessData
        );

        console.log(
          "Business updated successfully:",
          businessUpdateResponse.data
        );
        // Optionally, provide feedback on successful update
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div>
      <div className="flex" style={{ height: "90vh" }}>
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
                  selectedDate={selectedDate}
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
              style={{
                maxHeight: "calc(100vh - 180px)", // Adjust max-height as needed
              }} // Adjust max height dynamically
            >
              {filteredBusinesses.map((business) => (
                <li
                  key={business._id}
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
              className="w-full bg-white shadow-md rounded-lg p-6"
              onSubmit={handleSubmit}
            >
              <h2 className="text-xl font-bold mb-4">Write Content</h2>

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
                    value={selectedDate?.toLocaleDateString() || ""}
                    readOnly
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-200 cursor-not-allowed focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Post Material
                </label>
                <textarea
                  name="postMaterial"
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
                  defaultValue={selectedBusiness?.tags || ""}
                ></textarea>
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
          <div>
            <ContentTable
              filteredContents={filteredContents}
              selectedDate={selectedDate}
              handleTickClick={handleTickClick}
              handleCrossClick={handleCrossClick}
              openEditModal={openEditModal}
              openViewModal={openViewModal}
              handleDelete={handleDelete}
            />
          </div>
        </div>
      </div>

      {isViewModalOpen && modalContent && (
        <ViewModal
          isOpen={isViewModalOpen}
          modalContent={modalContent}
          closeViewModal={closeViewModal}
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditModal
          isOpen={isEditModalOpen}
          editFormData={editFormData}
          handleEditChange={handleEditChange}
          closeEditModal={closeEditModal}
          saveEditChanges={saveEditChanges}
          convertDateToInputFormat={convertDateToInputFormat}
          convertDateToMMDDYYYY={convertDateToMMDDYYYY}
        />
      )}
    </div>
  );
};

export default AddRegularContent;
