/* eslint-disable react/prop-types */
const EditModal = ({
  isOpen,
  editFormData,
  handleEditChange,
  closeEditModal,
  saveEditChanges,
  convertDateToInputFormat,
  convertDateToMMDDYYYY,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="bg-white rounded-lg shadow-lg p-6 relative"
        style={{
          width: "93vw",
          height: "93vh",
          overflowY: "auto",
        }}
      >
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          Edit Content Details
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {/* Left Sidebar */}
          <div className="flex flex-col h-full">
            <div className="w-full text-left px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600">
              Business Name
            </div>
            <div className="w-full text-left px-4 py-2 mt-5 bg-gray-200 text-gray-700 font-medium rounded">
              Post Materials
            </div>
            <div className="w-full text-left px-4 py-2 mt-24 bg-gray-200 text-gray-700 font-medium rounded">
              Tags
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
                value={editFormData.name || ""}
                readOnly
              />
              <input
                type="date"
                className="w-1/3 rounded border px-4 py-2 text-gray-700"
                value={
                  editFormData?.date
                    ? convertDateToInputFormat(editFormData.date)
                    : ""
                }
                onChange={(e) =>
                  handleEditChange(
                    "date",
                    e.target.value ? convertDateToMMDDYYYY(e.target.value) : ""
                  )
                }
              />
            </div>
            <div>
              <textarea
                className="w-full border rounded px-4 py-2 text-gray-700"
                rows={4}
                value={editFormData.postMaterial || ""}
                onChange={(e) =>
                  handleEditChange("postMaterial", e.target.value)
                }
              />
            </div>
            <div>
              <textarea
                className="w-full border rounded px-4 py-2 text-gray-700"
                rows={4}
                value={editFormData.tags || ""}
                onChange={(e) => handleEditChange("tags", e.target.value)}
              />
            </div>
            <div>
              <textarea
                className="w-full border rounded px-4 py-2 text-gray-700"
                rows={4}
                value={editFormData.posterMaterial || ""}
                onChange={(e) =>
                  handleEditChange("posterMaterial", e.target.value)
                }
              />
            </div>
            <div>
              <textarea
                className="w-full border rounded px-4 py-2 text-gray-700"
                rows={4}
                value={editFormData.vision || ""}
                onChange={(e) => handleEditChange("vision", e.target.value)}
              />
            </div>
            <div>
              <textarea
                className="w-full border rounded px-4 py-2 text-gray-700"
                rows={4}
                value={editFormData?.comments || ""}
                onChange={(e) => handleEditChange("comments", e.target.value)}
              />
            </div>
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
  );
};

export default EditModal;
