import NumberInputWithLabel from "@/Components/Input/NumberInputWithLabel";
import SelectInputWithLabel from "@/Components/Input/SelectInputWithLabel";
import TextInputWithLabel from "@/Components/Input/TextInputWithLabel";
import YearPickerWithLabel from "@/Components/Input/YearPickerWithLabel";
import type { courses, NewRegisterFormData } from "@/Interfaces/RegisterStudentInterface";
import { cn } from "@/lib/utils";
import { Loader2Icon, X } from "lucide-react";
import { Dialog } from "primereact/dialog";
import { InputSwitch } from "primereact/inputswitch";
import React, { useEffect, useState } from "react";
import ButtonsLabel from "@/Components/Buttons/ButtonsLabel";
import { FilterService } from "@/Services/FilterService";
import { toast } from "react-toastify";

interface EditStudentProps {
  getFilterData: () => Promise<void>
  editPopupStatus: boolean;
  setEditPopupStatus: React.Dispatch<React.SetStateAction<boolean>>;
  currentStudentId: number;
}

const EditStudent: React.FC<EditStudentProps> = (props) => {
  useEffect(() => {
    GetStudentDetails();
  }, [props.currentStudentId])

  const [sameWhatsappNumber, setWhatsappNumber] = useState(true);

  const [listCourses, setListCourses] = useState<courses[]>([]);

  const [editGroupLoading, setEditGroupLoading] = useState(false);

  const [errorStatus, setErrorStatus] = useState({
    enrolldate: false,
    fullname: false,
    phonenumber: false,
    phoneMessage: "",
    whatsappnumber: false,
    emailid: false,
    emailMessage: "",
    dob: false,
    highesteducation: false,
    currentLocation: false,
    fathersmothersoccupation: false,
    passedoutyear: false,
    workexprience: false,
    courseselection: false,
    preference: false,
  });

  const GetStudentDetails = async () => {
    try {
      const res = await FilterService.getPatientData(props.currentStudentId);
      if (res.status) {
        setListCourses(res.listCourses);
        setFormData({
          enrolldate: res.data.refUserEnrolledDate,
          fullname: res.data.refUserName,
          phonenumber: res.data.refUCMobileno,
          whatsappnumber: res.data.refUCWhatsAppMobileNo,
          emailid: res.data.refUCMail,
          dob: res.data.refUserDOB,
          highesteducation: res.data.refUSDHigherEducation,
          currentLocation: res.data.refUCAddress,
          fathersmothersoccupation: res.data.refUSDFMOccupation,
          passedoutyear: res.data.refUSDPassedOutYear,
          workexprience: res.data.refUSDWorkExperience,
          courseselection: res.data.refCourseId.toString(),
          preference: res.data.refUCOPreference,
        });
        setWhatsappNumber(res.data.refUCWhatsAppMobileNo === res.data.refUCMobileno);
        setUserActive(res.data.refUserStatus);
      }
    } catch (e) {
      console.log(e);
    }
  }

  const [userActive, setUserActive] = useState<boolean>(false);;

  const [formData, setFormData] = useState<NewRegisterFormData>({
    enrolldate: new Date().toISOString().split("T")[0].toString(),
    fullname: "",
    phonenumber: null,
    whatsappnumber: null,
    emailid: "",
    dob: "",
    highesteducation: "",
    currentLocation: "",
    fathersmothersoccupation: "",
    passedoutyear: "",
    workexprience: "",
    courseselection: "",
    preference: "",
  });

  const handleInput = (e: any) => {
    // Works for native input
    const name = e.target?.name || e.name;
    const value = e.target?.value ?? e.value;

    console.log(name, value);

    setErrorStatus((prevErrorStatus) => ({
      ...prevErrorStatus,
      [name]: false,
    }));

    if (sameWhatsappNumber && name === "phonenumber") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        phonenumber: value,
        whatsappnumber: value,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };


  const CheckErrorStatus = async () => {
    const phonenumberCheck = formData.phonenumber || "";
    const whatsappnumberCheck = formData.whatsappnumber || "";

    const isValidEmail = (email: string): boolean => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    const errors = {
      fullname: !formData.fullname,
      phonenumber: phonenumberCheck.length !== 10,
      phoneMessage: "",
      whatsappnumber: whatsappnumberCheck.length !== 10,
      emailid: !isValidEmail(formData.emailid),
      emailMessage: "",
      dob: !formData.dob,
      highesteducation: !formData.highesteducation,
      currentLocation: !formData.currentLocation,
      fathersmothersoccupation: !formData.fathersmothersoccupation,
      passedoutyear: !formData.passedoutyear,
      workexprience: !formData.workexprience,
      courseselection: !formData.courseselection,
      preference: !formData.preference,
      enrolldate: !formData.enrolldate,
    };

    await setErrorStatus(errors);

    // check if any field is true (ignoring emailMessage since it's a string)
    if (
      errors.fullname ||
      errors.phonenumber ||
      errors.whatsappnumber ||
      errors.dob ||
      errors.highesteducation ||
      errors.currentLocation ||
      errors.fathersmothersoccupation ||
      errors.passedoutyear ||
      errors.workexprience ||
      errors.courseselection ||
      errors.preference ||
      errors.enrolldate
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleUpdatePatient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editGroupLoading) {
      return
    }

    const status = await CheckErrorStatus();
    if (status) {
      console.log("Please fill all required fields.");
      return;
    } else {
      try {
        setEditGroupLoading(true);
        // setLoading(true);

        const res = await FilterService.updatePatientData(
          formData,
          props.currentStudentId,
          userActive
        );

        console.log(res);

        if (res.status) {
          toast.success(res.message);
          props.setEditPopupStatus(false);
          props.getFilterData();
        } else {
          if (res.message === "Phone Number Already Exits") {
            setErrorStatus((prevErrorStatus) => ({
              ...prevErrorStatus,
              phonenumber: true,
              phoneMessage: "Phone Number Already Exits",
            }));
          } else {
            toast.error(res.message);
          }
        }
      } catch (e) {
        console.log(e);
      }
    }

    setEditGroupLoading(false);
  };

  return (
    <Dialog
      header="New Sub Trainer Registration Details"
      visible={props.editPopupStatus}
      className="w-11/12"
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
      onHide={() => props.setEditPopupStatus(false)}
    >
      <form onSubmit={handleUpdatePatient}>
        <div className="w-full">
          <div
            onClick={() => props.setEditPopupStatus(false)}
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
              Edit Student
            </div>
            <X
              className="absolute right-2 cursor-pointer"
              width={20}
              height={20}
            />
          </div>
        </div>
        <div className="h-[72vh] overflow-y-auto custom-scroll flex flex-col gap-3 px-3 pb-3">
          <div className="w-full flex flex-col lg:flex-row justify-between h-full">
            <div className="w-full lg:w-4/12 flex flex-col gap-4 px-0 sm:px-4">
              <TextInputWithLabel
                type="date"
                name="enrolldate"
                label="Enrolled Date"
                placeholder="Select date"
                bgColor="#00808054"
                value={formData.enrolldate}
                onChange={handleInput}
                // required
                readonly
                errorStatus={errorStatus.enrolldate}
              />
              <TextInputWithLabel
                type="text"
                name="fullname"
                label="Full Name"
                placeholder="Enter Full name"
                bgColor="#00808054"
                value={formData.fullname}
                onChange={handleInput}
                required
                errorStatus={errorStatus.fullname}
              />
              <NumberInputWithLabel
                name="phonenumber"
                label="Mobile Number"
                useGrouping={false}
                placeholder="Enter Mobile Number"
                bgColor="#00808054"
                value={
                  formData.phonenumber ? parseInt(formData.phonenumber) : null
                }
                onChange={handleInput}
                required
                errorStatus={errorStatus.phonenumber}
                errormessage={errorStatus.phoneMessage}
              />
              <div className="flex items-center gap-2">
                <label className="w-8/12 lg:w-auto">
                  Use Same Number for Whatsapp
                </label>
                <InputSwitch
                  checked={sameWhatsappNumber}
                  onChange={(e) => {
                    setWhatsappNumber(e.value);
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      whatsappnumber: formData.phonenumber,
                    }));
                  }}
                />
              </div>
              {!sameWhatsappNumber && (
                <NumberInputWithLabel
                  name="whatsappnumber"
                  label="Whatsapp Number"
                  useGrouping={false}
                  placeholder="Enter Whatsapp Number"
                  bgColor="#00808054"
                  value={
                    formData.whatsappnumber
                      ? parseInt(formData.whatsappnumber)
                      : null
                  }
                  onChange={handleInput}
                  required={!sameWhatsappNumber}
                  errorStatus={errorStatus.whatsappnumber}
                />
              )}
              <TextInputWithLabel
                type="text"
                name="emailid"
                label="Email ID"
                placeholder="Enter Email ID"
                bgColor="#00808054"
                value={formData.emailid}
                onChange={handleInput}
                // required
                readonly
                errorStatus={errorStatus.emailid}
                errormessage={errorStatus.emailMessage}
              />
            </div>
            <div className="w-full lg:w-4/12 mt-4 lg:mt-0 flex flex-col gap-4 px-0 sm:px-4">
              <TextInputWithLabel
                type="date"
                name="dob"
                label="Date of Birth"
                placeholder="Select Date of Birth"
                bgColor="#00808054"
                value={formData.dob}
                onChange={handleInput}
                required
                errorStatus={errorStatus.dob}
              />
              <TextInputWithLabel
                type="text"
                name="highesteducation"
                label="Highest Education"
                placeholder="Enter Highest Education"
                bgColor="#00808054"
                value={formData.highesteducation}
                onChange={handleInput}
                required
                errorStatus={errorStatus.highesteducation}
              />
              <TextInputWithLabel
                type="text"
                name="currentLocation"
                label="Current Location"
                placeholder="Enter Current Location"
                bgColor="#00808054"
                value={formData.currentLocation}
                onChange={handleInput}
                required
                errorStatus={errorStatus.currentLocation}
              />
              <TextInputWithLabel
                type="text"
                name="fathersmothersoccupation"
                label="Father’s / Mother’s Occupation"
                placeholder="Enter Father’s / Mother’s Occupation"
                bgColor="#00808054"
                value={formData.fathersmothersoccupation}
                onChange={handleInput}
                required
                errorStatus={errorStatus.fathersmothersoccupation}
              />
              <YearPickerWithLabel
                name="passedoutyear"
                label="Passed Out Year"
                startYear={new Date().getFullYear() + 3}
                endYear={new Date().getFullYear() - 6}
                bgColor="#00808054"
                value={parseInt(formData.passedoutyear)}
                onChange={handleInput}
                required
                errorStatus={errorStatus.passedoutyear}
              />
            </div>
            <div className="w-full lg:w-4/12 mt-4 lg:mt-0 flex flex-col gap-4 px-0 sm:px-4">
              <YearPickerWithLabel
                name="workexprience"
                label="Work Experience"
                placeholder="Select Work Experience"
                startYear={0}
                endYear={15}
                bgColor="#00808054"
                value={parseInt(formData.workexprience)}
                onChange={handleInput}
                required
                errorStatus={errorStatus.workexprience}
              />
              <SelectInputWithLabel
                name="courseselection"
                label="Course Selection"
                placeholder="Select Course"
                options={
                  listCourses.map((course) => ({
                    label: course.refCourseName,
                    value: course.refCourseId.toString(),
                  })) || []
                }
                bgColor="#00808054"
                value={formData.courseselection}
                onChange={handleInput}
                disabled
                // required
                errorStatus={errorStatus.courseselection}
              />
              <SelectInputWithLabel
                name="preference"
                label="Student Preference"
                placeholder="Select Preference"
                options={[
                  {
                    label: "Interested in One-to-One Session",
                    value: "1to1interested",
                  },
                  {
                    label: "Not Interested in One-to-One Session",
                    value: "not1to1interested",
                  },
                ]}
                bgColor="#00808054"
                value={formData.preference}
                disabled
                onChange={handleInput}
                required
                errorStatus={errorStatus.preference}
              />
              <SelectInputWithLabel
                name="userActiveStatus"
                label="Select Student Status"
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
                value={userActive}
                onChange={(e) => { setUserActive(e.value) }}
                required
              />
            </div>
          </div>
        </div>
        <div className="h-[8vh]">
          <div className="w-full flex justify-center items-center">
            <div className="w-6/12 lg:w-4/12">
              <ButtonsLabel
                // type={editGroupLoading ? "button" : "submit"}
                className="h-8 lg:h-10"
                variant="primary"
              >
                {editGroupLoading ? (
                  <>
                    <Loader2Icon size={18} className="animate-spin" />
                  </>
                ) : (
                  "Save"
                )}
              </ButtonsLabel>
            </div>
          </div>
        </div>
      </form>
    </Dialog>
  );
};

export default EditStudent;
