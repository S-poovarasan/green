import TextInputWithLabel from "@/Components/Input/TextInputWithLabel";
import React, { useState } from "react";
import ButtonsLabel from "@/Components/Buttons/ButtonsLabel";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
interface ReportProps {}

const Report: React.FC<ReportProps> = () => {
  const candidates = [
    {
      date: "2025-08-01",
      name: "Ethan Harper",
      logintime: "09:00 AM",
      logouttime: "05:00 PM",
      duration: "7 hours",
    },
    {
      date: "2025-08-01",
      name: "Sophia Mitchell",
      logintime: "08:45 AM",
      logouttime: "04:30 PM",
      duration: "7 hours 15 mins",
    },
    {
      date: "2025-08-01",
      name: "Liam Johnson",
      logintime: "09:15 AM",
      logouttime: "06:00 PM",
      duration: "8 hours 45 mins",
    },
    {
      date: "2025-08-02",
      name: "Olivia Brown",
      logintime: "10:00 AM",
      logouttime: "05:00 PM",
      duration: "6 hours",
    },
    {
      date: "2025-08-02",
      name: "Noah Wilson",
      logintime: "09:30 AM",
      logouttime: "05:30 PM",
      duration: "8 hours",
    },
    {
      date: "2025-08-02",
      name: "Ava Thompson",
      logintime: "08:50 AM",
      logouttime: "04:45 PM",
      duration: "7 hours 55 mins",
    },
  ];
  const [data, _] = useState(candidates);

  return (
    <div className="px-5 py-3 flex flex-col gap-2">
      <div className="my-3 flex flex-col gap-3">
        <h5>Students Login / Logout Reports</h5>
      </div>
      <div className="w-[100%] lg:w-8/12 flex justify-center items-start lg:items-center flex-col lg:flex-row gap-3">
        <TextInputWithLabel
          type="date"
          name="enrolldate"
          label="Select Date"
          placeholder="Select Date"
          bgColor="#00808054"
        />
        <TextInputWithLabel
          type="text"
          name="name"
          label="Enter Student Name"
          placeholder="Enter Student Name"
          bgColor="#00808054"
        />
        <div className="mt-1 h-10 lg:h-16 flex justify-center items-end w-[150px] sm:w-[350px]">
          <ButtonsLabel className="h-10 lg:h-11" variant="primary">
            Generate Report
          </ButtonsLabel>
        </div>
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
            scrollHeight="58vh"
            selectionMode="single"
            value={data}
          >
            <Column style={{ width: "20%" }} field="date" header="Date" />
            <Column
              style={{ width: "25%" }}
              field="name"
              header="Student Name"
            />
            <Column
              style={{ width: "15%" }}
              field="logintime"
              header="Login Time"
            />
            <Column
              style={{ width: "15%" }}
              field="logouttime"
              header="Logout Time"
            />
            <Column
              style={{ width: "15%" }}
              field="duration"
              header="Duration"
            />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default Report;
