import TextInputWithLabel from "@/Components/Input/TextInputWithLabel";
import { cn } from "@/lib/utils";
import { Loader2Icon, Trash, X } from "lucide-react";
import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import ButtonsLabel from "@/Components/Buttons/ButtonsLabel";
import type { EditGroupsData } from "@/Interfaces/GroupsInterface";
import { GroupsService } from "@/Services/GroupsService";
import { Slide, toast } from "react-toastify";
import { Divider } from "primereact/divider";
import TextAreaWithLabel from "@/Components/Input/TextAreaWithLabel";

interface EditGroupsProps {
  viewGroupsPopup: boolean;
  setViewGroupsPopup: React.Dispatch<React.SetStateAction<boolean>>;
  viewGroupsFormData: EditGroupsData;
  setViewGroupsFormData: React.Dispatch<React.SetStateAction<EditGroupsData>>;
  Getgroups: (GroupId: number) => Promise<void>;
}

const EditGroups: React.FC<EditGroupsProps> = ({
  viewGroupsPopup,
  setViewGroupsPopup,
  viewGroupsFormData,
  setViewGroupsFormData,
  Getgroups,
}) => {
  const [editGroupLoading, setEditGroupLoading] = useState(false);
  const [error, setError] = useState({
    status: false,
    message: "",
  });

  const handleSubmitEditGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditGroupLoading(true);
    try {
      const response = await GroupsService.updateGroups(viewGroupsFormData);
      if (response.status) {
        setViewGroupsPopup(false);
        setError({
          status: false,
          message: "",
        });
        toast.success("Group Updated Successful!", {
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
        Getgroups(0);
      } else {
        setError({
          status: true,
          message: response.message,
        });
      }
      console.log(viewGroupsFormData);
    } catch (e) {
      console.log(e);
    }
    setEditGroupLoading(false);
  };

  return (
    <Dialog
      header="New Sub Trainer Registration Details"
      visible={viewGroupsPopup}
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
      onHide={() => setViewGroupsPopup(false)}
    >
      <form onSubmit={handleSubmitEditGroup}>
        <div className="w-full">
          <div
            onClick={() => setViewGroupsPopup(false)}
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
              Edit Group
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
            name="groupname"
            label="Group Name"
            placeholder="Enter Group Name"
            bgColor="#00808054"
            value={viewGroupsFormData.refGName}
            onChange={(e) => {
              setViewGroupsFormData({
                ...viewGroupsFormData,
                refGName: e.target.value,
              });
            }}
            required
          />
          <TextAreaWithLabel
            name="description"
            label="Group Description"
            placeholder="Enter details..."
            bgColor="#00808054"
            value={viewGroupsFormData.refGDescription}
            onChange={(e) => {
              setViewGroupsFormData({
                ...viewGroupsFormData,
                refGDescription: e.target.value,
              });
            }}
            required
          />
          <div className="w-full">
            <label className="font-bold text-gray-700 mb-2 block">
              List Course Topics
            </label>
            {viewGroupsFormData.listclass &&
              viewGroupsFormData.listclass.map((topic, index) => (
                <>
                  {topic.refCLStatus !== "delete" && (
                    <div key={index} className="flex gap-2 items-center mb-2">
                      <div className={`w-[90%]`}>
                        <TextInputWithLabel
                          type="text"
                          name={`topic-${index}`}
                          label="Topic Name"
                          placeholder={`Topic ${index + 1}`}
                          bgColor="#00808054"
                          value={topic.refCLName}
                          onChange={(e) => {
                            const newListTopics = [
                              ...viewGroupsFormData.listclass,
                            ];
                            newListTopics[index].refCLName = e.target.value;
                            if (newListTopics[index].refCLStatus !== "new") {
                              newListTopics[index].refCLStatus = "updated";
                            }
                            setViewGroupsFormData({
                              ...viewGroupsFormData,
                              listclass: newListTopics,
                            });
                          }}
                          required
                        />
                        <div className="flex gap-2 mt-2">
                          <TextInputWithLabel
                            type="date"
                            name={`topic-date-${index}`}
                            label="Date"
                            placeholder={`Topic ${index + 1}`}
                            bgColor="#00808054"
                            value={topic.refCLDate}
                            onChange={(e) => {
                              const newListTopics = [
                                ...viewGroupsFormData.listclass,
                              ];
                              newListTopics[index].refCLDate = e.target.value;
                              if (newListTopics[index].refCLStatus !== "new") {
                                newListTopics[index].refCLStatus = "updated";
                              }
                              setViewGroupsFormData({
                                ...viewGroupsFormData,
                                listclass: newListTopics,
                              });
                            }}
                            required
                          />
                        </div>
                        <div className="flex gap-2 mt-2">
                          <TextInputWithLabel
                            type="time"
                            name={`topic-from-${index}`}
                            label="From Time"
                            placeholder={`Topic ${index + 1}`}
                            bgColor="#00808054"
                            value={topic.refCLFromTime}
                            onChange={(e) => {
                              const newListTopics = [
                                ...viewGroupsFormData.listclass,
                              ];
                              newListTopics[index].refCLFromTime = e.target.value;
                              if (newListTopics[index].refCLStatus !== "new") {
                                newListTopics[index].refCLStatus = "updated";
                              }
                              setViewGroupsFormData({
                                ...viewGroupsFormData,
                                listclass: newListTopics,
                              });
                            }}
                            required
                          />
                          <TextInputWithLabel
                            type="time"
                            name={`topic-to-${index}`}
                            label="To Time"
                            placeholder={`Topic ${index + 1}`}
                            bgColor="#00808054"
                            value={topic.refCLToTime}
                            onChange={(e) => {
                              const newListTopics = [
                                ...viewGroupsFormData.listclass,
                              ];
                              newListTopics[index].refCLToTime = e.target.value;
                              if (newListTopics[index].refCLStatus !== "new") {
                                newListTopics[index].refCLStatus = "updated";
                              }
                              setViewGroupsFormData({
                                ...viewGroupsFormData,
                                listclass: newListTopics,
                              });
                            }}
                            required
                          />
                        </div>
                        <Divider />
                      </div>
                      <div className="w-[10%]">
                        <ButtonsLabel
                          type="button"
                          variant="danger"
                          onClick={() => {
                            const newListTopics = [
                              ...viewGroupsFormData.listclass,
                            ];
                            newListTopics[index].refCLStatus = "delete";
                            setViewGroupsFormData({
                              ...viewGroupsFormData,
                              listclass: newListTopics,
                            });
                          }}
                        >
                          <Trash size={15} />
                        </ButtonsLabel>
                      </div>
                    </div>
                  )}
                </>
              ))}
            <ButtonsLabel
              type="button"
              className="h-8 lg:h-10"
              variant="primary"
              onClick={() => {
                const ListClasses = viewGroupsFormData.listclass || [];
                ListClasses.push({
                  refCLId: 0,
                  refCLName: "",
                  refCLFromTime: "",
                  refCLToTime: "",
                  refCLDate: "",
                  refCLStatus: "new",
                });
                setViewGroupsFormData({
                  ...viewGroupsFormData,
                  listclass: ListClasses,
                });
              }}
            >
              Add Topics
            </ButtonsLabel>
          </div>
        </div>
        <div className="h-[8vh]">
          <p className="text-center h-[30px] text-[red]">
            {error.status && error.message}
          </p>
          <div className="w-full flex justify-center items-center">
            <div className="w-8/12 lg:w-6/12">
              <ButtonsLabel
                type={editGroupLoading ? "button" : "submit"}
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

export default EditGroups;
