import React, { useCallback, useEffect, useState } from "react";
import ButtonsLabel from "@/Components/Buttons/ButtonsLabel";
import { Column } from "primereact/column";
import SelectInputWithLabel from "@/Components/Input/SelectInputWithLabel";
import { DataTable } from "primereact/datatable";
import TextInputWithLabel from "@/Components/Input/TextInputWithLabel";
import { Dialog } from "primereact/dialog";
import { Loader2Icon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import NumberInputWithLabel from "@/Components/Input/NumberInputWithLabel";
import FileInputWithLabel from "@/Components/Input/FileInputWithLabelProps ";
import { FileHandlerService } from "@/Services/FileHandlerService";
import type {
  SubtrainerListModel,
  TempFilesState,
} from "@/Interfaces/SubtrainerInterface";
import { SubtrainerService } from "@/Services/SubtrainerService";
import LoadingOverlay from "@/Components/Loading/Loading";
import { Slide, toast, ToastContainer } from "react-toastify";
import ViewFiles from "@/Components/ViewFiles/ViewFiles";
import ViewProfile from "@/Components/ViewFiles/ViewProfile";

interface SubtrainerProps {}

const Subtrainer: React.FC<SubtrainerProps> = () => {
  useEffect(() => {
    getSubtrainer();
  }, []);

  const [data, setData] = useState<SubtrainerListModel[]>([]);

  const [loading, setLoading] = useState(false);

  const statusOptions = [...new Set(data.map((c) => c.refUserStatus))].map(
    (t) => ({
      label: t ? `Active` : `Inactive`,
      value: t,
    })
  );

  const [newRegistrationPopup, setNewRegistrationPopup] = useState(false);
  const [editRegistrationPopup, setEditRegistrationPopup] = useState(false);

  const [newRegistrationFormData, setNewRegistrationFormData] = useState({
    fullname: "",
    phonenumber: "",
    emailid: "",
    dob: "",
    currentLocation: "",
    workexprience: "",
    aadhar: "",
    profile_img: "",
    resume: "",
  });

  const [edtRegistationFormData, setEditRegistratioinFormData] = useState({
    id: 0,
    fullname: "",
    phonenumber: "",
    emailid: "",
    dob: "",
    currentLocation: "",
    workexprience: "",
    aadhar: "",
    profile_img: "",
    resume: "",
    userStatus: false,
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError({
      status: false,
      message: "",
    });

    const { name, value } = e.target;
    setNewRegistrationFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError({
      status: false,
      message: "",
    });

    const { name, value } = e.target;
    setEditRegistratioinFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [__, setNewFiles] = useState<TempFilesState>({
    profile_img: null,
    resume: null,
  });

  const [error, setError] = useState({
    status: false,
    message: "",
  });

  const [registerLoading, setRegisterLoading] = useState(false);

  // const [editRegisterFiles, setEditRegisterFiles] = useState({
  //   profile: false,
  //   resume: false,
  // });

  const getSubtrainer = async () => {
    setLoading(true);
    try {
      const response = await SubtrainerService.getSubtrainer(0);
      console.log(response);
      if (response.status && response.data) {
        setData(response.data);
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const getOneSubtrainer = async (id: number) => {
    setLoading(true);
    try {
      const response = await SubtrainerService.getSubtrainer(id);
      console.log(response);
      if (response.status && response.data) {
        const row = response.data[0];
        setEditRegistratioinFormData({
          id: row.refUserId,
          fullname: row.refUserName,
          phonenumber: row.refUCMobileno,
          emailid: row.refUCMail,
          dob: row.refUserDOB,
          currentLocation: row.refUCAddress,
          workexprience: row.refSTDWorkExprience,
          aadhar: row.refSDTAadhar,
          profile_img: row.refUserProfile,
          resume: row.refSDTResume,
          userStatus: row.refUserStatus,
        });
        setEditRegistrationPopup(true);
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const handleProfileImageUpload = useCallback(
    async (file: File, editStatus: boolean) => {
      const formDataImg = new FormData();
      formDataImg.append("profileImage", file);
      setError({
        status: false,
        message: "",
      });

      try {
        const response = await FileHandlerService.uploadImage({
          formImg: formDataImg,
        });

        if (response.status) {
          if (editStatus) {
            setEditRegistratioinFormData((prev) => ({
              ...prev,
              profile_img: response.fileName,
            }));
          } else {
            setNewRegistrationFormData((prev) => ({
              ...prev,
              profile_img: response.fileName,
            }));

            setNewFiles((prev) => ({
              ...prev,
              profile_img: file,
            }));
          }
        } else {
          setError({
            status: true,
            message: "Profile image upload failed",
          });
        }
      } catch (err) {
        setError({
          status: true,
          message: "Error uploading profile image",
        });
      }
    },
    [setNewRegistrationFormData, setNewFiles, setError]
  );

  const handleFileUpload = useCallback(
    async (file: File, editStatus: boolean) => {
      const formDataImg = new FormData();
      formDataImg.append("file", file);

      try {
        const response = await FileHandlerService.uploadFile({
          formFile: formDataImg,
        });

        console.log(response);

        if (response.status) {
          if (editStatus) {
            setEditRegistratioinFormData((prev) => ({
              ...prev,
              resume: response.fileName,
            }));
          } else {
            setNewRegistrationFormData((prev) => ({
              ...prev,
              resume: response.fileName,
            }));

            setNewFiles((prev) => ({
              ...prev,
              resume: file,
            }));
          }
        } else {
          setError({
            status: true,
            message: "File upload failed",
          });
        }
      } catch (err) {
        setError({
          status: true,
          message: "Error uploading file",
        });
      }
    },
    [setNewRegistrationFormData, setNewFiles, setError]
  );

  const handleNewRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setRegisterLoading(true);
    try {
      const response = await SubtrainerService.newSubtrainer(
        newRegistrationFormData
      );

      if (response.status) {
        toast.success("Sub Trainer Registration Successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Slide,
        });
        setNewRegistrationPopup(false);

        setNewRegistrationFormData({
          fullname: "",
          phonenumber: "",
          emailid: "",
          dob: "",
          currentLocation: "",
          workexprience: "",
          aadhar: "",
          profile_img: "",
          resume: "",
        });

        getSubtrainer();
      } else {
        setError({
          status: true,
          message: response.message,
        });
      }
    } catch (err) {
      console.error(err);
    }

    setRegisterLoading(false);
  };

  const handleEditRegistration = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setRegisterLoading(true);
    try {
      const response = await SubtrainerService.editSubtrainer(
        edtRegistationFormData
      );

      if (response.status) {
        toast.success("Sub Trainer Update Successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Slide,
        });
        setEditRegistrationPopup(false);

        setEditRegistratioinFormData({
          id: 0,
          fullname: "",
          phonenumber: "",
          emailid: "",
          dob: "",
          currentLocation: "",
          workexprience: "",
          aadhar: "",
          profile_img: "",
          resume: "",
          userStatus: false,
        });

        getSubtrainer();
      } else {
        setError({
          status: true,
          message: response.message,
        });
      }
    } catch (err) {
      console.error(err);
    }

    setRegisterLoading(false);
  };

  return (
    <div className="px-5 py-3 flex flex-col gap-2">
      {loading && <LoadingOverlay />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
        transition={Slide}
      />
      <Dialog
        header="New Sub Trainer Registration Details"
        visible={newRegistrationPopup}
        className="w-10/12 lg:w-4/12"
        style={{
          height: "100%",
          borderRadius: "16px", // rounded corners
          overflow: "hidden",
        }}
        headerStyle={{
          display: "none",
        }}
        contentStyle={{
          background: "rgba(255, 255, 255, 0.1)", // semi-transparent
          backdropFilter: "blur(20px)", // frosted glass
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "0 0 16px 16px",
          padding: "0.5rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        onHide={() => setNewRegistrationPopup(false)}
      >
        <form onSubmit={handleNewRegistration}>
          <div className="w-full">
            <div
              onClick={() => setNewRegistrationPopup(false)}
              className="flex cursor-pointer justify-center"
            >
              <div
                className={cn(
                  "inline-flex items-center justify-center select-none focus:outline-none py-2 px-4 text-[0.8rem] font-bold rounded-xl",
                  // sizeClasses[size],
                  "bg-[#008080] text-white",
                  "shadow-[inset_7px_7px_7px_rgba(153,153,153,0.25),inset_-7px_-7px_7px_rgba(235,235,235,0.25)]",
                  "hover:shadow-[inset_9px_9px_9px_rgba(153,153,153,0.28),inset_-9px_-9px_9px_rgba(235,235,235,0.28)]"
                )}
              >
                New Sub Trainer Registration Details
              </div>
              <X
                className="absolute right-2 cursor-pointer"
                width={20}
                height={20}
              />
            </div>
          </div>
          <div className="h-[72vh] overflow-y-auto custom-scroll flex flex-col gap-3 px-3 pb-3">
            <TextInputWithLabel
              type="text"
              name="fullname"
              label="Name"
              placeholder="Enter your name"
              bgColor="#00808054"
              value={newRegistrationFormData.fullname}
              onChange={handleInput}
              required
            />
            <TextInputWithLabel
              type="email"
              name="emailid"
              label="Email ID"
              placeholder="Enter your email ID"
              bgColor="#00808054"
              value={newRegistrationFormData.emailid}
              onChange={handleInput}
              required
            />
            <NumberInputWithLabel
              name="phonenumber"
              label="Mobile Number "
              useGrouping={false}
              placeholder="Enter Mobile Number"
              bgColor="#00808054"
              value={
                newRegistrationFormData.phonenumber
                  ? parseInt(newRegistrationFormData.phonenumber)
                  : null
              }
              onChange={handleInput}
              required
            />
            <TextInputWithLabel
              type="date"
              name="dob"
              label="Date of Birth "
              placeholder="Select your date of birth"
              bgColor="#00808054"
              value={newRegistrationFormData.dob}
              onChange={handleInput}
              required
            />
            <TextInputWithLabel
              type="text"
              name="currentLocation"
              label="Trainer Location "
              placeholder="Enter your location"
              bgColor="#00808054"
              value={newRegistrationFormData.currentLocation}
              onChange={handleInput}
              required
            />
            <NumberInputWithLabel
              name="experience"
              label="Trainer Experience "
              placeholder="Enter your experience"
              bgColor="#00808054"
              value={
                newRegistrationFormData.workexprience
                  ? parseInt(newRegistrationFormData.workexprience)
                  : null
              }
              onChange={handleInput}
              required
            />
            <NumberInputWithLabel
              name="aadhar"
              label="Trainer Aadhar "
              placeholder="Enter your aadhar number"
              bgColor="#00808054"
              useGrouping={false}
              value={
                newRegistrationFormData.aadhar
                  ? parseInt(newRegistrationFormData.aadhar)
                  : null
              }
              onChange={handleInput}
              required
            />
            <FileInputWithLabel
              name="profile"
              label="Trainer Image "
              accept=".jpg,.jpeg,.png"
              onChange={(files) => {
                const file = files?.[0];
                if (!file) return;

                const maxSize = 5 * 1024 * 1024;
                if (file.size > maxSize) {
                  setError({
                    status: true,
                    message: "Image must be less than 5MB.",
                  });
                  return;
                }

                handleProfileImageUpload(file, false);
              }}
              bgColor="#00808054"
              required
            />
            {newRegistrationFormData.profile_img && (
              <>
                <ViewProfile Filename={newRegistrationFormData.profile_img} />
              </>
            )}

            <FileInputWithLabel
              name="resume"
              label="Trainer Resume "
              accept="application/pdf"
              onChange={(files) => {
                const file = files?.[0];
                if (!file) return;

                const maxSize = 5 * 1024 * 1024;
                if (file.size > maxSize) {
                  setError({
                    status: true,
                    message: "File must be less than 5MB.",
                  });
                  return;
                }

                handleFileUpload(file, false);
              }}
              bgColor="#00808054"
              required
            />
            {newRegistrationFormData.resume && (
              <>
                <ViewFiles Filename={newRegistrationFormData.resume} />
              </>
            )}
          </div>
          <div className="h-[8vh]">
            <p className="text-center h-[30px] text-[red]">
              {error.status && error.message}
            </p>
            <div className="w-full flex justify-center items-center">
              <div className="w-8/12 lg:w-6/12">
                <ButtonsLabel
                  type={registerLoading ? "button" : "submit"}
                  className="h-8 lg:h-10"
                  variant="primary"
                >
                  {registerLoading ? (
                    <>
                      <Loader2Icon size={18} className="animate-spin" />
                    </>
                  ) : (
                    "Register"
                  )}
                </ButtonsLabel>
              </div>
            </div>
          </div>
        </form>
      </Dialog>

      <Dialog
        header="New Sub Trainer Registration Details"
        visible={editRegistrationPopup}
        className="w-10/12 lg:w-4/12"
        style={{
          height: "100%",
          borderRadius: "16px", // rounded corners
          overflow: "hidden",
        }}
        headerStyle={{
          display: "none",
        }}
        contentStyle={{
          background: "rgba(255, 255, 255, 0.1)", // semi-transparent
          backdropFilter: "blur(20px)", // frosted glass
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "0 0 16px 16px",
          padding: "0.5rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        onHide={() => setEditRegistrationPopup(false)}
      >
        <form onSubmit={handleEditRegistration}>
          <div className="w-full">
            <div
              onClick={() => setEditRegistrationPopup(false)}
              className="flex cursor-pointer justify-center"
            >
              <div
                className={cn(
                  "inline-flex items-center justify-center select-none focus:outline-none py-2 px-4 text-[0.8rem] font-bold rounded-xl",
                  // sizeClasses[size],
                  "bg-[#008080] text-white",
                  "shadow-[inset_7px_7px_7px_rgba(153,153,153,0.25),inset_-7px_-7px_7px_rgba(235,235,235,0.25)]",
                  "hover:shadow-[inset_9px_9px_9px_rgba(153,153,153,0.28),inset_-9px_-9px_9px_rgba(235,235,235,0.28)]"
                  //   "active:shadow-[inset_4px_4px_6px_rgba(153,153,153,0.35),inset_-4px_-4px_6px_rgba(235,235,235,0.35)]"
                )}
              >
                Sub Trainer Registration Details
              </div>
              <X
                className="absolute right-2 cursor-pointer"
                width={20}
                height={20}
              />
            </div>
          </div>
          <div className="h-[72vh] overflow-y-auto custom-scroll flex flex-col gap-3 px-3 pb-3">
            <TextInputWithLabel
              type="text"
              name="fullname"
              value={edtRegistationFormData.fullname}
              onChange={handleInputUpdate}
              label="Name :"
              placeholder="Enter your name"
              bgColor="#00808054"
              required
            />
            <SelectInputWithLabel
              name="userStatus"
              label="User Status"
              placeholder="Select Status"
              options={[
                {
                  label: "Active",
                  value: true,
                },
                {
                  label: "Inactive",
                  value: false,
                },
              ]}
              bgColor="#00808054"
              value={edtRegistationFormData.userStatus}
              onChange={handleInputUpdate}
              required
            />
            <TextInputWithLabel
              type="text"
              name="emailid"
              value={edtRegistationFormData.emailid}
              onChange={handleInputUpdate}
              label="Email ID :"
              placeholder="Enter your email Id"
              bgColor="#00808054"
              disabled
            />
            <NumberInputWithLabel
              name="phonenumber"
              label="Mobile Number :"
              placeholder="Enter your aadhar number"
              bgColor="#00808054"
              useGrouping={false}
              value={
                edtRegistationFormData.phonenumber
                  ? parseInt(edtRegistationFormData.phonenumber)
                  : null
              }
              onChange={handleInputUpdate}
              required
            />
            <TextInputWithLabel
              type="date"
              name="dob"
              label="Date of Birth :"
              value={edtRegistationFormData.dob}
              onChange={handleInputUpdate}
              placeholder="Select your date of birth"
              bgColor="#00808054"
              required
            />
            <TextInputWithLabel
              type="text"
              name="currentLocation"
              label="Trainer Location :"
              placeholder="Enter your location"
              bgColor="#00808054"
              value={edtRegistationFormData.currentLocation}
              onChange={handleInputUpdate}
              required
            />
            <NumberInputWithLabel
              name="workexprience"
              label="Trainer Experience :"
              placeholder="Enter your experience"
              bgColor="#00808054"
              value={
                edtRegistationFormData.workexprience
                  ? parseInt(edtRegistationFormData.workexprience)
                  : null
              }
              onChange={handleInputUpdate}
              required
            />
            <NumberInputWithLabel
              name="aadhar"
              label="Trainer Aadhar :"
              placeholder="Enter your aadhar number"
              bgColor="#00808054"
              useGrouping={false}
              value={
                edtRegistationFormData.aadhar
                  ? parseInt(edtRegistationFormData.aadhar)
                  : null
              }
              onChange={handleInputUpdate}
              required
            />
            <FileInputWithLabel
              name="profile"
              label="Trainer Image :"
              accept="image/*"
              onChange={(files) => {
                const file = files?.[0];
                if (!file) return;

                const maxSize = 5 * 1024 * 1024;
                if (file.size > maxSize) {
                  setError({
                    status: true,
                    message: "Image must be less than 5MB.",
                  });
                  return;
                }

                handleProfileImageUpload(file, true);
              }}
              bgColor="#00808054"
            />
            {edtRegistationFormData.profile_img && (
              <>
                <ViewProfile Filename={edtRegistationFormData.profile_img} />
              </>
            )}
            <FileInputWithLabel
              name="resume"
              label="Trainer Resume :"
              accept="application/pdf" // optional: allow images & pdf
              onChange={(files) => {
                const file = files?.[0];
                if (!file) return;

                const maxSize = 5 * 1024 * 1024;
                if (file.size > maxSize) {
                  setError({
                    status: true,
                    message: "File must be less than 5MB.",
                  });
                  return;
                }

                handleFileUpload(file, true);
              }}
              bgColor="#00808054"
            />
            {edtRegistationFormData.resume && (
              <>
                <ViewFiles Filename={edtRegistationFormData.resume} />
              </>
            )}
          </div>
          <div className="h-[8vh]">
             <p className="text-center h-[30px] text-[red]">
              {error.status && error.message}
            </p>
            <div className="w-full flex justify-center items-center">
              <div className="w-8/12 lg:w-6/12">
                <ButtonsLabel
                  type="submit"
                  className="h-8 lg:h-10"
                  variant="primary"
                >
                  Save
                </ButtonsLabel>
              </div>
            </div>
          </div>
        </form>
      </Dialog>

      <div className="my-4 flex items-center justify-between">
        <h5>Sub Trainers</h5>
        <div className="w-6/12 lg:w-2/12">
          <ButtonsLabel
            variant="primary"
            onClick={() => setNewRegistrationPopup(true)}
          >
            Add Sub Trainers
          </ButtonsLabel>
        </div>
      </div>
      <div
        style={{
          boxShadow:
            "inset 7px 7px 7px rgba(153,153,153,0.25), inset -7px -7px 7px rgba(235,235,235,0.25)",
          border: "none",
          borderRadius: 10,
        }}
        className="w-12/12 overflow-y-auto p-4 custom-scroll"
      >
        <DataTable
          scrollable
          scrollHeight="65vh"
          selectionMode="single"
          value={data}
          filterDisplay="menu"
          emptyMessage="No Subtrianers Found"
        >
          <Column
            style={{ width: "30%" }}
            field="refUserName"
            header="Sub Trainer Name"
            filter
            filterField="refUserName"
            showFilterMenu={true}
            showFilterMenuOptions={false}
            showFilterOperator={false}
            showFilterMatchModes={false}
            showAddButton={false}
            filterElement={(options) => (
              <TextInputWithLabel
                name=" "
                label=""
                value={options.value || ""}
                onChange={(e) => options.filterApplyCallback(e.target.value)} // ✅ instant apply
                placeholder="Search by name"
                className="p-column-filter w-full h-9 px-2 rounded-md border border-gray-300"
              />
            )}
          />

          <Column
            style={{ width: "30%" }}
            field="refUCMail"
            header="Email ID"
            filter
            filterField="refUCMail"
            showFilterMenu={true}
            showFilterMenuOptions={false}
            showFilterOperator={false}
            showFilterMatchModes={false}
            showAddButton={false}
            filterElement={(options) => (
              <TextInputWithLabel
                name=" "
                label=""
                value={options.value || ""}
                onChange={(e) => options.filterApplyCallback(e.target.value)}
                placeholder="Search by email"
                className="p-column-filter w-full h-9 px-2 rounded-md border border-gray-300"
              />
            )}
          />
          <Column
            style={{ width: "20%" }}
            header="Status"
            field="refUserStatus"
            filter
            filterField="refUserStatus"
            filterMatchMode="equals"
            showFilterMenu={true}
            showFilterMenuOptions={false}
            showFilterOperator={false}
            showFilterMatchModes={false}
            showAddButton={false}
            body={(row) => (
              <ButtonsLabel className="h-8 lg:h-8" variant="primary">
                {row.refUserStatus ? `Active` : `Inactive`}
              </ButtonsLabel>
            )}
            filterElement={(options) => (
              <SelectInputWithLabel
                name=" "
                label=""
                value={options.value}
                options={statusOptions}
                onChange={(e) => options.filterApplyCallback(e.value)}
                placeholder="Filter by status"
                className="p-column-filter"
              />
            )}
          />
          <Column
            style={{ width: "20%" }}
            header="Action"
            body={(row: SubtrainerListModel) => (
              <ButtonsLabel
                onClick={() => {
                  getOneSubtrainer(row.refUserId);
                }}
                className="h-8 lg:h-8"
                variant="primary"
              >
                Edit
              </ButtonsLabel>
            )}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default Subtrainer;
