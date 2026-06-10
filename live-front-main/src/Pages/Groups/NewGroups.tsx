import { Loader2Icon, Trash, X } from "lucide-react";
import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import ButtonsLabel from "@/Components/Buttons/ButtonsLabel";
import { cn } from "@/lib/utils";
import type { courses } from "@/Interfaces/RegisterStudentInterface";
import SelectInputWithLabel from "@/Components/Input/SelectInputWithLabel";
import TextInputWithLabel from "@/Components/Input/TextInputWithLabel";
import { useAuth } from "../Routes/AuthContext";
import type { SubtrainerListModel } from "@/Interfaces/SubtrainerInterface";
import type { NewGroup, Topic } from "@/Interfaces/GroupsInterface";
import { GroupsService } from "@/Services/GroupsService";
import { Slide, toast } from "react-toastify";
import TextAreaWithLabel from "@/Components/Input/TextAreaWithLabel";
import { Divider } from "primereact/divider";

interface NewGroupsProps {
  newGroupPopup: boolean;
  setNewGroupPopup: React.Dispatch<React.SetStateAction<boolean>>;
  listCourses: courses[];
  listSubTrainers: SubtrainerListModel[];
  Getgroups: (GroupId: number) => Promise<void>;
}

const NewGroups: React.FC<NewGroupsProps> = ({
  newGroupPopup,
  setNewGroupPopup,
  listCourses,
  listSubTrainers,
  Getgroups,
}) => {
  const { role } = useAuth();
  const [newGroupLoading, setNewGroupLoading] = useState(false);
  const [listTopics, setListTopics] = useState<Topic[]>([]);
  const [newGroup, setNewGroup] = useState<NewGroup>({
    groupname: "",
    description: "",
    courseId: 0,
    subtrainerId: 0,
  });
  const [error, setError] = useState({
    status: false,
    message: "",
  });

  const handleSubmitNewGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNewGroupLoading(true);
    try {
      const response = await GroupsService.newGroups(newGroup, listTopics);
      if (response.status) {
        setNewGroupPopup(false);
        setNewGroup({
          groupname: "",
          description: "",
          courseId: 0,
          subtrainerId: 0,
        });
        setListTopics([]);
        setError({
          status: false,
          message: "",
        });
        Getgroups(0);
        toast.success("Group Added Successful!", {
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

      } else {
        setError({
          status: true,
          message: response.message,
        });
      }
    } catch (e) {
      console.log(e);
    }
    setNewGroupLoading(false);
  };

  return (
    <Dialog
      header="New Sub Trainer Registration Details"
      visible={newGroupPopup}
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
      onHide={() => setNewGroupPopup(false)}
    >
      <form onSubmit={handleSubmitNewGroup}>
        <div className="w-full">
          <div
            onClick={() => setNewGroupPopup(false)}
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
              Add Group
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
            value={newGroup.groupname}
            onChange={(e) => {
              setNewGroup({ ...newGroup, groupname: e.target.value });
            }}
            required
          // errorStatus={errorStatus.currentLocation}
          />
          <SelectInputWithLabel
            name="courseselection"
            label="Course Selection"
            placeholder="Select Course"
            options={
              listCourses.map((course) => ({
                label: course.refCourseName,
                value: course.refCourseId,
              })) || []
            }
            bgColor="#00808054"
            value={newGroup.courseId}
            onChange={(e) => {
              setNewGroup({ ...newGroup, courseId: e.value });
            }}
            required
          />
          {role?.id === 2 && (
            <SelectInputWithLabel
              name="subtrianer"
              label="Sub Trainer Selection"
              placeholder="Select Sub Trianer"
              options={
                listSubTrainers.map((course) => ({
                  label: course.refUserName,
                  value: course.refUserId,
                })) || []
              }
              bgColor="#00808054"
              value={newGroup.subtrainerId}
              onChange={(e) => {
                setNewGroup({ ...newGroup, subtrainerId: e.value });
              }}
              required
            />
          )}
          <TextAreaWithLabel
            name="description"
            label="Group Description"
            placeholder="Enter details..."
            bgColor="#00808054"
            value={newGroup.description}
            onChange={(e) => {
              setNewGroup({ ...newGroup, description: e.target.value });
            }}
            required
          />
          <div className="w-full">
            <label className="font-bold text-gray-700 mb-2 block">
              List Course Topics
            </label>
            {listTopics.map((topic, index) => (
              <div key={index} className="flex gap-2 items-center mb-2">
                <div className={`w-[90%]`}>
                  <TextInputWithLabel
                    type="text"
                    name={`topic-${index}`}
                    label=""
                    placeholder={`Topic ${index + 1}`}
                    bgColor="#00808054"
                    value={topic.name}
                    onChange={(e) => {
                      const newListTopics = [...listTopics];
                      newListTopics[index].name = e.target.value;
                      setListTopics(newListTopics);
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
                      value={topic.date}
                      onChange={(e) => {
                        const newListTopics = [...listTopics];
                        newListTopics[index].date = e.target.value;
                        setListTopics(newListTopics);
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
                      value={topic.fromTime}
                      onChange={(e) => {
                        const newListTopics = [...listTopics];
                        newListTopics[index].fromTime = e.target.value;
                        setListTopics(newListTopics);
                      }}
                      required
                    />
                    <TextInputWithLabel
                      type="time"
                      name={`topic-to-${index}`}
                      label="To Time"
                      placeholder={`Topic ${index + 1}`}
                      bgColor="#00808054"
                      value={topic.toTime}
                      onChange={(e) => {
                        const newListTopics = [...listTopics];
                        newListTopics[index].toTime = e.target.value;
                        setListTopics(newListTopics);
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
                      const newListTopics = listTopics.filter(
                        (_, i) => i !== index
                      );
                      setListTopics(newListTopics);
                    }}
                  >
                    <Trash size={15} />
                  </ButtonsLabel>
                </div>
              </div>
            ))}
            <ButtonsLabel
              type="button"
              className="h-8 lg:h-10"
              variant="primary"
              onClick={() => setListTopics([...listTopics, { name: "", date: "", fromTime: "", toTime: "" }])}
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
                type={newGroupLoading ? "button" : "submit"}
                className="h-8 lg:h-10"
                variant="primary"
              >
                {newGroupLoading ? (
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

export default NewGroups;
