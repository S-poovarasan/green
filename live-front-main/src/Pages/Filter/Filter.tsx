import TextInputWithLabel from "@/Components/Input/TextInputWithLabel";
import YearPickerWithLabel from "@/Components/Input/YearPickerWithLabel";
import React, { useEffect, useState } from "react";
import ButtonsLabel from "@/Components/Buttons/ButtonsLabel";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import SelectInputWithLabel from "@/Components/Input/SelectInputWithLabel";
import type { ListFilterModel } from "@/Interfaces/FilterInterface";
import { FilterService } from "@/Services/FilterService";
import LoadingOverlay from "@/Components/Loading/Loading";
import EditStudent from "./EditStudent";
import { Slide, ToastContainer } from "react-toastify";

interface FilterProps { }

const Filter: React.FC<FilterProps> = () => {
  useEffect(() => {
    getFilterData();
  }, []);

  const [filterData, setFilterData] = useState<ListFilterModel[]>([]);
  const [data, setData] = useState<ListFilterModel[]>([]);
  const [Loading, setLoading] = useState(false);
  const [enrollDate, setEnrollDate] = useState<string>("");
  const [experienceLevel, setExperienceLevel] = useState<string>("");
  const [editPopupStatus, setEditPopupStatus] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(0);

  const statusOptions = [...new Set(data.map((c) => c.refUserStatus))].map(
    (t) => ({
      label: t ? "Active" : "Inactive",
      value: t,
    })
  );

  const courseOptions = [
    ...new Set(filterData.map((c) => c.refCourseName)),
  ].map((t) => ({
    label: t,
    value: t,
  }));

  const groupOptions = [...new Set(filterData.map((c) => c.refGName))].map(
    (t) => ({
      label: t,
      value: t,
    })
  );

  const getFilterData = async () => {
    setLoading(true);
    try {
      const res = await FilterService.getFilter();

      if (res.status) {
        setFilterData(res.data);
        setData(res.data);
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const handleApplyFilter = () => {
    let filteredData = [...filterData];

    if (enrollDate) {
      filteredData = filterData.filter((item) =>
        item.refUserEnrolledDate?.startsWith(enrollDate)
      );
    }

    if (experienceLevel.length > 0) {
      filteredData = filteredData.filter(
        (item) => item.refUSDWorkExperience === String(experienceLevel)
      );
    }

    setData(filteredData);
  };

  const handleResetFilter = () => {
    setEnrollDate("");
    setExperienceLevel("");
    setData(filterData);
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
      <EditStudent
        getFilterData={getFilterData}
        editPopupStatus={editPopupStatus}
        setEditPopupStatus={setEditPopupStatus}
        currentStudentId={currentStudentId}
      />
      {Loading && <LoadingOverlay />}
      <div className="my-3 flex flex-col gap-3">
        <h5>Filter the Students Registered</h5>
        <p className="font-semibold text-sm text-[#7D7C7C]">
          Filter and manage students registrations based on the date and
          experience level
        </p>
      </div>
      <div className="w-[100%] lg:w-8/12 flex justify-center items-start lg:items-center flex-col lg:flex-row gap-3">
        <TextInputWithLabel
          type="date"
          name="enrolldate"
          label="Registration Date / Month / Year"
          placeholder="Select date / month / year"
          bgColor="#00808054"
          value={enrollDate}
          onChange={(e) => setEnrollDate(e.target.value)}
          onDoubleClick={() => {
            setEnrollDate("");
          }}
        />

        <YearPickerWithLabel
          name="workexprience"
          label="Experience Level"
          placeholder="Select experience level"
          value={parseInt(experienceLevel)}
          onChange={(e) => setExperienceLevel(String(e.value))}
          onDoubleClick={() => {
            setExperienceLevel("");
          }}
          startYear={0}
          endYear={30}
          bgColor="#00808054"
        />

        <div className="mt-1 h-10 lg:h-16 flex justify-center items-end w-[150px] sm:w-[200px]">
          <ButtonsLabel
            className="h-10 lg:h-11"
            variant="primary"
            onClick={handleApplyFilter}
          >
            Apply
          </ButtonsLabel>
        </div>

        {(enrollDate || experienceLevel) && (
          <div className="mt-1 h-10 lg:h-16 flex justify-center items-end w-[150px] sm:w-[200px]">
            <ButtonsLabel
              className="h-10 lg:h-11"
              variant="primary"
              onClick={handleResetFilter}
            >
              Reset
            </ButtonsLabel>
          </div>
        )}
      </div>
      <div className="w-full mt-3">
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
            // resizableColumns
            // showGridlines
            scrollHeight="49vh"
            selectionMode="single"
            value={data}
            filterDisplay="menu"
            emptyMessage="No Filter Data Found"
          >
            <Column
              style={{ width: "15%" }}
              field="refUserName"
              header="Student name"
              filter
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
                  placeholder="Search by name"
                  className="p-column-filter w-full h-9 px-2 rounded-md border border-gray-300"
                />
              )}
            />
            <Column
              style={{ width: "15%" }}
              field="refUCMail"
              header="Email ID"
              filter
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
              style={{ width: "15%" }}
              field="refUserEnrolledDate"
              header="Enrolled Date"
            />
            <Column
              style={{ width: "15%" }}
              field="refUSDWorkExperience"
              header="Experience Level"
            />
            <Column
              style={{ width: "15%" }}
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
                  placeholder="Filter by course"
                  className="p-column-filter"
                />
              )}
            />

            <Column
              style={{ width: "15%" }}
              field="refGName"
              header="Group name"
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
                  options={groupOptions}
                  onChange={(e) => options.filterApplyCallback(e.value)}
                  placeholder="Filter by group"
                  className="p-column-filter"
                />
              )}
            />
            <Column
              style={{ width: "15%" }}
              header="Status"
              field="refUserStatus"
              filter
              filterField="refUserStatus"
              filterMatchMode="equals"
              showFilterMenuOptions={false} // hides "Starts with / Contains"
              showFilterOperator={false} // hides AND/OR toggle
              showFilterMatchModes={false} // hides condition dropdown
              showAddButton={false} // hides "+ Add Rule"
              body={(row) => (
                <>
                  {
                    row.refUserStatus ? (
                      <ButtonsLabel className="h-8 lg:h-8" variant="primary">
                        Active
                      </ButtonsLabel>
                    ) : (
                      <ButtonsLabel className="h-8 lg:h-8" variant="primary">
                        Inactive
                      </ButtonsLabel>
                    )
                  }
                </>
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
              style={{ width: "10%" }}
              header="Action"
              body={(row) => (
                <ButtonsLabel
                  onClick={() => {
                    setCurrentStudentId(row.refUserId);
                    setEditPopupStatus(true);
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
    </div>
  );
};

export default Filter;
