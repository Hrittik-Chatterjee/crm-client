import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import axios from "axios";
import "react-day-picker/dist/style.css";
import { useAuth } from "../hooks/useAuth";
import "./Dashboard.css";
import EditModal from "./Modals/EditModal";
import ViewModal from "./Modals/ViewModal";
import ContentTable from "./Table/ContentTable";

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
    <div
      onClick={
        isViewModalOpen || isEditModalOpen
          ? () => {
              closeViewModal();
              closeEditModal();
            }
          : null
      }
      className="flex  bg-gray-100 font-title"
      style={{ height: "90vh" }}
    >
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
                key={business._id}
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

      {/* View Modal */}
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

export default Dashboard;
