import React, { useEffect, useState } from "react";
import ButtonsLabel from "@/Components/Buttons/ButtonsLabel";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ProgressBar } from "primereact/progressbar";
import SelectInputWithLabel from "@/Components/Input/SelectInputWithLabel";
import type { courses } from "@/Interfaces/RegisterStudentInterface";
import TextInputWithLabel from "@/Components/Input/TextInputWithLabel";
import LoadingOverlay from "@/Components/Loading/Loading";
import NewGroups from "./NewGroups";
import { GroupsService } from "@/Services/GroupsService";
import type { SubtrainerListModel } from "@/Interfaces/SubtrainerInterface";
import { Slide, ToastContainer } from "react-toastify";
import type { EditGroupsData, ListGroups } from "@/Interfaces/GroupsInterface";
import EditGroups from "./EditGroups";

interface GroupsProps { }

const Groups: React.FC<GroupsProps> = () => {
  useEffect(() => {
    Getgroups(0);
  }, []);

  const [loading, setLoading] = useState(false);
  const [listCourses, setListCourses] = useState<courses[]>([]);
  const [listSubTrainers, setListSubTrainer] = useState<SubtrainerListModel[]>(
    []
  );
  const [newGroupPopup, setNewGroupPopup] = useState(false);
  const [listGropus, setListGroups] = useState<ListGroups[]>([]);

  const courseOptions = [
    ...new Set(listGropus.map((c) => c.refCourseName)),
  ].map((c) => ({
    label: c,
    value: c,
  }));

  const trainerOptions = [...new Set(listGropus.map((c) => c.refUserName))].map(
    (t) => ({
      label: t,
      value: t,
    })
  );

  const [viewGroupsPopup, setViewGroupsPopup] = useState(false);
  const [viewGroupsFormData, setViewGroupsFormData] = useState<EditGroupsData>({
    refGId: 0,
    refGName: "",
    refGDescription: "",
    listclass: [],
  });

  const Getgroups = async (GroupId: number) => {
    try {
      setLoading(true);

      const res = await GroupsService.getGroups(GroupId);
      console.log("Groups.tsx / res / 100 -------------------  ", res);

      if (res.status) {
        if (GroupId !== 0) {
          setViewGroupsPopup(true);
          setViewGroupsFormData({
            refGId: res.listallgroups[0].refGId,
            refGName: res.listallgroups[0].refGName,
            refGDescription: res.listallgroups[0].refGDescription,
            listclass: res.listallgroups[0].listclass,
          });
        } else {
          setListCourses(res.listcourse);
          setListSubTrainer(res.listSubTrainer);
          setListGroups(res.listallgroups);
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-5 py-3 flex flex-col gap-2">
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
      {loading && <LoadingOverlay />}
      <NewGroups
        newGroupPopup={newGroupPopup}
        setNewGroupPopup={setNewGroupPopup}
        listCourses={listCourses}
        listSubTrainers={listSubTrainers}
        Getgroups={Getgroups}
      />
      <EditGroups
        viewGroupsPopup={viewGroupsPopup}
        setViewGroupsPopup={setViewGroupsPopup}
        viewGroupsFormData={viewGroupsFormData}
        setViewGroupsFormData={setViewGroupsFormData}
        Getgroups={Getgroups}
      />
      <div className="my-3 flex justify-between items-center gap-3">
        <div>
          <h5>Students Group</h5>
          <p className="font-semibold text-sm text-[#7D7C7C]">
            View and manage students groups, track progress and identify areas
            of improvement
          </p>
        </div>
        <div>
          <ButtonsLabel
            className="px-10"
            variant="primary"
            onClick={() => setNewGroupPopup(true)}
          >
            Add Groups
          </ButtonsLabel>
        </div>
      </div>
      <div className="w-full">
        <div
          style={{
            boxShadow:
              "inset 7px 7px 7px rgba(153,153,153,0.25), inset -7px -7px 7px rgba(235,235,235,0.25)",
            border: "none",
            borderRadius: 10,
            //   backgroundColor: "#008080",
            //   color: "#fff",
          }}
          className="w-12/12 overflow-y-auto p-4 custom-scroll"
        >
          <DataTable
            scrollable
            scrollHeight="65vh"
            selectionMode="single"
            value={listGropus}
            filterDisplay="menu"
            emptyMessage="No Groups Found"
          >
            {/* Group name filter */}
            <Column
              style={{ width: "20%" }}
              field="refGName"
              header="Group name"
              filter
              // filterField="refUserName"
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
                  placeholder="Search by group name"
                  className="p-column-filter w-full h-9 px-2 rounded-md border border-gray-300"
                />
              )}
            />

            {/* Course filter */}
            <Column
              style={{ width: "20%" }}
              field="refCourseName"
              header="Course"
              filter
              showFilterMenu={true}
              showFilterMenuOptions={false}
              showFilterOperator={false}
              showFilterMatchModes={false}
              showAddButton={false}
              filterElement={(options) => (
                <SelectInputWithLabel
                  name=" "
                  label=""
                  value={options.value}
                  options={courseOptions}
                  onChange={(e) => options.filterApplyCallback(e.value)}
                  placeholder="Select Course"
                  className="w-full"
                />
              )}
            />

            {/* Sub trainer filter */}
            <Column
              style={{ width: "20%" }}
              field="refUserName"
              header="Sub Trainer"
              filter
              showFilterMenu={true}
              showFilterMenuOptions={false}
              showFilterOperator={false}
              showFilterMatchModes={false}
              showAddButton={false}
              filterElement={(options) => (
                <SelectInputWithLabel
                  name=" "
                  label=""
                  value={options.value}
                  options={trainerOptions}
                  onChange={(e) => options.filterApplyCallback(e.value)}
                  placeholder="Select Trainer"
                  className="w-full"
                />
              )}
            />

            {/* Students count */}
            <Column
              style={{ width: "10%" }}
              field="userCourseCount"
              header="Students"
            />

            {/* Completed topics with progress */}
            <Column
              style={{ width: "20%" }}
              header="Completed topics"
              body={(row) => (
                <div className="flex gap-2 justify-start items-center">
                  <ProgressBar
                    style={{ height: "10px", width: "60%" }}
                    displayValueTemplate={() => ""}
                    className="custom-progressbar"
                    value={Math.round(
                      (row.completedTopics / row.totalTopics) * 100
                    )}
                  />
                  <span>{row.totalTopics}</span>
                </div>
              )}
            />

            {/* Action */}
            <Column
              style={{ width: "10%" }}
              header="Action"
              body={(row) => (
                <ButtonsLabel
                  onClick={() => {
                    Getgroups(row.refGId);
                  }}
                  className="h-8 lg:h-8"
                  variant="primary"
                >
                  View
                </ButtonsLabel>
              )}
            />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default Groups;
