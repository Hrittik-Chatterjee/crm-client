/* eslint-disable react/prop-types */

const ViewModal = ({ isOpen, modalContent, closeViewModal }) => {
  if (!isOpen || !modalContent) return null;

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
                value={`${modalContent.postMaterial || ""}\n\n${
                  modalContent.tags || ""
                }`.trim()}
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
  );
};

export default ViewModal;
