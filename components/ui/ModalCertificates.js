import React from "react";
import { Button } from "@/components/ui/button";

const ModalCertificates = ({
  certificates,
  tags,
  selectedUser,
  handlePreview,
  handleOpenReasonModal,
  handleDeleteCertificate,
  closeModalCertificates,
}) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        ></span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                  Certificates
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full bg-white border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-4 text-center">Title</th>
                        <th className="py-2 px-4 text-center">Status</th>
                        <th className="py-2 px-4 text-center">Tag Name</th>
                        <th className="py-2 px-4 text-center">Poin TAK</th>
                        <th className="py-2 px-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {certificates.map((certificate) => (
                        <tr key={certificate.cert_id}>
                          <td className="py-2 px-4 border border-gray-200">
                            {certificate.title}
                          </td>
                          <td className="py-2 px-4 border border-gray-200 text-center">
                            <div
                              className={`w-5 h-5 rounded-full mx-auto flex items-center justify-center tooltip ${
                                certificate.status === "reject"
                                  ? "bg-red-500"
                                  : certificate.status === "pending"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                              data-tip={
                                certificate.status === "reject"
                                  ? "Rejected"
                                  : certificate.status === "pending"
                                  ? "Pending"
                                  : "Approved"
                              }
                            ></div>
                          </td>
                          <td className="py-2 px-4 border border-gray-200">
                            {tags
                              .filter((tag) => tag.id === certificate.tag_id)
                              .map((tag) => tag.name)
                              .join(", ")}
                          </td>
                          <td className="py-2 px-4 border border-gray-200 text-center">
                            {tags
                              .filter((tag) => tag.id === certificate.tag_id)
                              .map((tag) => tag.value)
                              .join(", ")}
                          </td>
                          <td className="border border-gray-200 text-center flex gap-2 py-2">
                            <Button
                              className="btn-primary ml-4"
                              onClick={() =>
                                handlePreview(certificate.file_path)
                              }
                            >
                              Preview
                            </Button>
                            <Button
                              className="btn-primary"
                              onClick={() =>
                                handleOpenReasonModal(certificate.reason)
                              }
                            >
                              Detail
                            </Button>
                            <Button
                              className="bg-[#ee6363] ml-2"
                              onClick={() =>
                                handleDeleteCertificate(
                                  certificate.cert_id,
                                  selectedUser.user_id
                                )
                              }
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Button onClick={closeModalCertificates} className="btn-warning">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCertificates;
