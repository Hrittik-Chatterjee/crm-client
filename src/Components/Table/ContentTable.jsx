// ContentTable.js
/* eslint-disable react/prop-types */

const ContentTable = ({
  filteredContents,
  selectedDate,
  handleTickClick,
  handleCrossClick,
  openEditModal,
  openViewModal,
  handleDelete,
}) => {
  return (
    <div className="flex-1 p-6">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Content {selectedDate.toLocaleDateString() || "No Date Selected"}
      </h2>
      <table className="w-full bg-white shadow-md rounded-md overflow-hidden">
        <thead>
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
                                "0 6px 15px rgba(255, 0, 0, 0.8)"; // Deeper red shadow on hover
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
  );
};

export default ContentTable;
