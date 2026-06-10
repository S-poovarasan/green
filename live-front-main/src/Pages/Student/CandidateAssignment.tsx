import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ButtonsLabel from "@/Components/Buttons/ButtonsLabel";
import SelectInputWithLabel from "@/Components/Input/SelectInputWithLabel";
import TextInputWithLabel from "@/Components/Input/TextInputWithLabel";
import type {
  ListCourseNSubtrainerModel,
  ListStudentData,
} from "@/Interfaces/StudentInterface";
import { StudentService } from "@/Services/StudentService";
import { Dialog } from "primereact/dialog";
import { Loader2Icon, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CandidateAssignmentProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const CandidateAssignment: React.FC<CandidateAssignmentProps> = ({
  setLoading,
}) => {
  useEffect(() => {
    getStudentCandidateAssignment();
  }, []);

  const [data, setData] = useState<ListStudentData[]>([]);
  const [assignPopup, setAssignPopup] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [ListCourseNSubtrainer, setListCourseNSubtrainer] = useState<
    ListCourseNSubtrainerModel[]
  >([]);
  const [assignData, setAssignData] = useState({
    GHId: 0,
    username: "",
    CourseName: "",
    refUCOId: 0,
  });

  const courseOptions = [...new Set(data.map((c) => c.CourseName))].map(
    (c) => ({
      label: c,
      value: c,
    })
  );

  const trainerOptions = [
    { label: "Not Assigned", value: "-" }, // extra option
    ...[...new Set(data.map((c) => c.HandlerName))]
      .filter((t) => t !== "-") // exclude '-'
      .map((t) => ({
        label: t,
        value: t,
      })),
  ];

  const GroupOption = [
    { label: "Not Assigned", value: "-" }, // extra option
    ...[...new Set(data.map((c) => c.refGName))]
      .filter((t) => t !== "-") // exclude '-'
      .map((t) => ({
        label: t,
        value: t,
      })),
  ];

  const statusOptions = [...new Set(data.map((c) => c.StudentStatus))].map(
    (t) => ({
      label: t ? "Active" : "Inactive",
      value: t,
    })
  );

  const getStudentCandidateAssignment = async () => {
    setLoading(true);
    const response = await StudentService.getCandidateAssignment();

    if (response.status) {
      const normalizedData = response.data.map((item) => ({
        ...item,
        HandlerName: item.HandlerName || "-",
        refGName: item.refGName || "-",
      }));
      setData(normalizedData);
    } else {
      console.log(response.message);
    }
    setLoading(false);
  };

  const GetCourseNSubtrainer = async (
    courseId: number,
    username: string,
    courseName: string,
    refUCOId: number
  ) => {
    setLoading(true);
    const response = await StudentService.getCourseNSubtrainer(courseId);

    if (response.status) {
      setListCourseNSubtrainer(response.data);
      setAssignData({
        GHId: 0,
        username: username,
        CourseName: courseName,
        refUCOId: refUCOId,
      });
      setAssignPopup(true);
    } else {
      console.log(response.message);
    }
    setLoading(false);
  };

  const AssignStudent = async () => {
    setAssignLoading(true);
    const response = await StudentService.assignStudent(
      assignData.GHId,
      assignData.refUCOId
    );
    if (response.status) {
      getStudentCandidateAssignment();
      setAssignPopup(false);
    } else {
      console.log(response.message);
    }
    setAssignLoading(false);
  };

  return (
    <div
      style={{
        boxShadow:
          "inset 7px 7px 7px rgba(153,153,153,0.25), inset -7px -7px 7px rgba(235,235,235,0.25)",
        border: "none",
        borderRadius: 10,
      }}
      className="w-12/12 overflow-y-auto p-4 custom-scroll"
    >
      <Dialog
        header="New Sub Trainer Registration Details"
        visible={assignPopup}
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
        onHide={() => setAssignPopup(false)}
      >
        <div>
          <div className="w-full">
            <div
              onClick={() => setAssignPopup(false)}
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
                Assign
              </div>
              <X
                className="absolute right-2 cursor-pointer"
                width={20}
                height={20}
              />
            </div>
          </div>
          <div className="h-[76vh] overflow-y-auto custom-scroll flex flex-col gap-3 px-3 pb-3">
            <label className="font-bold text-gray-700 mb-2 block mt-3">
              Student Name: {assignData.username}
            </label>
            <label className="font-bold text-gray-700 mb-2 block">
              Course Name: {assignData.CourseName}
            </label>
            <SelectInputWithLabel
              name="groupselection"
              label="Group Selection"
              placeholder="Select Group"
              options={
                ListCourseNSubtrainer.map((course) => ({
                  label: course.refGName,
                  value: course.refHGId,
                })) || []
              }
              bgColor="#00808054"
              value={assignData.GHId}
              onChange={(e) => {
                setAssignData({ ...assignData, GHId: e.value });
              }}
              required
            />
            <SelectInputWithLabel
              name="subtrainerselection"
              label="Subtrainer Selection"
              placeholder="Select Subtrainer"
              options={
                ListCourseNSubtrainer.map((course) => ({
                  label: course.refUserName,
                  value: course.refHGId,
                })) || []
              }
              bgColor="#00808054"
              value={assignData.GHId}
              required
              disabled
            />
          </div>
          <div className="h-[4vh]">
            <div className="w-full flex justify-center items-center">
              <div className="w-8/12 lg:w-6/12">
                <ButtonsLabel
                  type={assignLoading ? "button" : "submit"}
                  className="h-8 lg:h-10"
                  variant="primary"
                  onClick={AssignStudent}
                  disabled={assignData.GHId === 0}
                >
                  {assignLoading ? (
                    <>
                      <Loader2Icon size={18} className="animate-spin" />
                    </>
                  ) : (
                    "Assign"
                  )}
                </ButtonsLabel>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
      <DataTable
        scrollable
        scrollHeight="65vh"
        selectionMode="single"
        value={data}
        filterDisplay="menu"
      >
        <Column
          field="StudetName"
          header="Candidate name"
          filter
          filterField="StudetName"
          showFilterMenuOptions={false}
          showFilterOperator={false}
          showFilterMatchModes={false}
          showAddButton={false}
          filterElement={(options) => (
            <TextInputWithLabel
              name=" "
              label=""
              value={options.value || ""}
              onChange={(e) => options.filterApplyCallback(e.target.value)} // ✅ applies instantly
              placeholder="Search by name"
              className="w-full h-9 px-2 rounded-md border border-gray-300"
            />
          )}
        />
        <Column
          style={{ width: "20%" }}
          field="CourseName"
          header="Course name"
          filter
          showFilterMenu={true}
          showFilterOperator={false}
          showFilterMatchModes={false}
          showAddButton={false}
          filterElement={(options) => (
            <SelectInputWithLabel
              name=" "
              label=""
              value={options.value}
              options={courseOptions}
              onChange={(e) => options.filterApplyCallback(e.value)} // ✅ applies immediately
              placeholder="Select a course"
              className="p-column-filter"
            />
          )}
        />
        <Column
          style={{ width: "20%" }}
          field="refGName"
          header="Group Name"
          filter
          showFilterMenu={true}
          showFilterOperator={false}
          showFilterMatchModes={false}
          showAddButton={false}
          filterElement={(options) => (
            <SelectInputWithLabel
              name=" "
              label=""
              value={options.value}
              options={GroupOption}
              onChange={(e) => options.filterApplyCallback(e.value)} // ✅ applies immediately
              placeholder="Select a course"
              className="p-column-filter"
            />
          )}
        />
        <Column
          style={{ width: "15%" }}
          header="Status"
          field="StudentStatus"
          filter
          filterField="StudentStatus"
          filterMatchMode="equals"
          showFilterMenuOptions={false} // hides "Starts with / Contains"
          showFilterOperator={false} // hides AND/OR toggle
          showFilterMatchModes={false} // hides condition dropdown
          showAddButton={false} // hides "+ Add Rule"
          body={() => (
            <ButtonsLabel className="h-8 lg:h-8" variant="primary">
              Active
            </ButtonsLabel>
          )}
          filterElement={(options) => (
            <SelectInputWithLabel
              name=" "
              label=""
              value={options.value}
              options={statusOptions}
              onChange={(e) => options.filterApplyCallback(e.value)} // ✅ applies instantly
              placeholder="Filter by status"
              className="p-column-filter"
            />
          )}
        />
        <Column
          style={{ width: "25%" }}
          field="HandlerName"
          body={(row) => (
            <>
              {row.HandlerName !== "-" ? (
                row.HandlerName
              ) : (
                <div className="flex justify-center items-center">
                  <div className="w-5">
                    <ButtonsLabel
                      onClick={() => {
                        GetCourseNSubtrainer(
                          row.refCourseId,
                          row.StudetName,
                          row.CourseName,
                          row.refUCOId
                        );
                      }}
                      className="h-8 lg:h-8"
                      variant="primary"
                    >
                      Assign
                    </ButtonsLabel>
                  </div>
                </div>
              )}
            </>
          )}
          bodyStyle={{ textAlign: "center" }}
          header="Sub-trainer"
          filter
          filterMatchMode="equals"
          filterField="HandlerName"
          showFilterMenuOptions={false} // ✅ hides default menu operators
          showFilterOperator={false} // ✅ hides AND/OR
          showFilterMatchModes={false} // ✅ hides condition dropdown
          showAddButton={false} // ✅ hides "+ Add Rule"
          filterElement={(options) => (
            <SelectInputWithLabel
              name=" "
              label=""
              value={options.value}
              options={trainerOptions}
              onChange={(e) => options.filterApplyCallback(e.value)} // ✅ applies instantly
              placeholder="Filter by trainer"
              className="p-column-filter text-sm"
            />
          )}
        />
      </DataTable>
    </div>
  );
};

export default CandidateAssignment;
