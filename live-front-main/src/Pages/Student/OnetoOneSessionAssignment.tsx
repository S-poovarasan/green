import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ButtonsLabel from "@/Components/Buttons/ButtonsLabel";
import SelectInputWithLabel from "@/Components/Input/SelectInputWithLabel";
import TextInputWithLabel from "@/Components/Input/TextInputWithLabel";

const candidates = [
  {
    name: "Ethan Harper",
    course: "AWS",
    status: "Active",
    trainer: "Ms.Pooja",
  },
  {
    name: "Oliviya Bennat",
    course: "DevOps",
    status: "Active",
    trainer: "Ms.Kathija",
  },
  {
    name: "Noah Benh",
    course: "Azure",
    status: "Active",
    trainer: "Mr.Ram sheron",
  },
  {
    name: "John Cena",
    course: "Data science",
    status: "Active",
    trainer: "Mr.Sam Prasath",
  },
  {
    name: "Ava Jacks",
    course: "Python",
    status: "Active",
    trainer: "Ms.Sanam",
  },
  {
    name: "Kieran Methaw",
    course: "Java",
    status: "Active",
    trainer: "Ms.Kiruba",
  },
  {
    name: "Willis Adam",
    course: "Data Analytics",
    status: "Active",
    trainer: "Mr.Geon Mark",
  },
  {
    name: "John Cena",
    course: "Data science",
    status: "Active",
    trainer: "Mr.Sam Prasath",
  },
  {
    name: "Ava Jacks",
    course: "Python",
    status: "Active",
    trainer: "Ms.Sanam",
  },
  {
    name: "Kieran Methaw",
    course: "Java",
    status: "Active",
    trainer: "Ms.Kiruba",
  },
  {
    name: "Willis Adam",
    course: "Data Analytics",
    status: "Active",
    trainer: "Mr.Geon Mark",
  },
  {
    name: "John Cena",
    course: "Data science",
    status: "Active",
    trainer: "Mr.Sam Prasath",
  },
  {
    name: "Ava Jacks",
    course: "Python",
    status: "Active",
    trainer: "Ms.Sanam",
  },
  {
    name: "Kieran Methaw",
    course: "Java",
    status: "Active",
    trainer: "Ms.Kiruba",
  },
  {
    name: "Willis Adam",
    course: "Data Analytics",
    status: "Active",
    trainer: "Mr.Geon Mark",
  },
];

const OnetoOneSessionAssignment: React.FC = () => {
  const [data, _] = useState(candidates);

  const courseOptions = [...new Set(candidates.map((c) => c.course))].map(
    (c) => ({
      label: c,
      value: c,
    })
  );
  const trainerOptions = [...new Set(candidates.map((c) => c.trainer))].map(
    (t) => ({
      label: t,
      value: t,
    })
  );

  const statusOptions = [...new Set(candidates.map((c) => c.status))].map(
    (t) => ({
      label: t,
      value: t,
    })
  );
  return (
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
        scrollHeight="65vh"
        selectionMode="single"
        value={data}
        filterDisplay="row"
      >
        <Column
          style={{ width: "30%" }}
          field="name"
          header="Candidate name"
          filter
          showFilterMenu={false}
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
          style={{ width: "20%" }}
          field="course"
          header="Course name"
          filter
          showFilterMenu={false} // hide popup menu
          filterElement={(options) => (
            <SelectInputWithLabel
              name=" "
              label=""
              value={options.value}
              options={courseOptions}
              onChange={(e) => options.filterApplyCallback(e.value)}
              placeholder="Select a course"
              className="p-column-filter"
              // showClear
            />
          )}
        ></Column>
        <Column
          style={{ width: "10%" }}
          header="Status"
          field="status"
          filter
          showFilterMenu={false}
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
              onChange={(e) => options.filterApplyCallback(e.value)}
              placeholder="Filter by status"
              className="p-column-filter"
            />
          )}
        />
        <Column
          style={{ width: "30%" }}
          field="trainer"
          header="Sub-trainer"
          filter
          showFilterMenu={false}
          filterElement={(options) => (
            <SelectInputWithLabel
              name=" "
              label=""
              value={options.value}
              options={trainerOptions}
              onChange={(e) => options.filterApplyCallback(e.value)}
              placeholder="Filter"
              className="p-column-filter text-sm"
            />
          )}
        />
        <Column
          style={{ width: "10%" }}
          header="Action"
          body={() => (
            <ButtonsLabel className="h-8 lg:h-8" variant="primary">
              Assign
            </ButtonsLabel>
          )}
        />
      </DataTable>
    </div>
  );
};

export default OnetoOneSessionAssignment;
