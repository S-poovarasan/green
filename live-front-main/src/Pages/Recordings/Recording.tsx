import TextInputWithLabel from "@/Components/Input/TextInputWithLabel";
import React, { useState } from "react";
import ButtonsLabel from "@/Components/Buttons/ButtonsLabel";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

interface RecordingProps {}

const Recording: React.FC<RecordingProps> = () => {
  const candidates = [
    {
      course: "AWS",
      topic: "Introduction to AWS",
      recordlink: "https://drive.google.com/d/1230abdc98hdu",
    },
    {
      course: "AWS",
      topic: "EC2 Instance Setup",
      recordlink: "https://drive.google.com/d/4567qwec12kl",
    },
    {
      course: "AWS",
      topic: "S3 Bucket & Permissions",
      recordlink: "https://drive.google.com/d/8901zxcv45mn",
    },
    {
      course: "React",
      topic: "React Basics & Components",
      recordlink: "https://drive.google.com/d/1122react99ab",
    },
    {
      course: "React",
      topic: "State & Props",
      recordlink: "https://drive.google.com/d/3344react77cd",
    },
    {
      course: "Node.js",
      topic: "Introduction to Node.js",
      recordlink: "https://drive.google.com/d/5566node55ef",
    },
    {
      course: "Node.js",
      topic: "Express.js Routing",
      recordlink: "https://drive.google.com/d/7788node33gh",
    },
    {
      course: "PostgreSQL",
      topic: "Database Basics",
      recordlink: "https://drive.google.com/d/9900pg44ij",
    },
    {
      course: "PostgreSQL",
      topic: "Joins & Relationships",
      recordlink: "https://drive.google.com/d/2233pg22kl",
    },
  ];
  const [data, _] = useState(candidates);

  return (
    <div className="px-5 py-3 flex flex-col gap-2">
      <div className="my-3 flex flex-col gap-3">
        <h5>Course Recordings</h5>
        <p className="font-semibold text-sm text-[#7D7C7C]">
          Manage recordings for each course
        </p>
      </div>
      <div className="w-[100%] lg:w-4/12 flex justify-center items-start lg:items-center flex-col lg:flex-row gap-3">
        <TextInputWithLabel
          type="text"
          name="enrolldate"
          label=""
          placeholder="Search by course name and topic"
          bgColor="#00808054"
          className="text-[#fff]"
        />
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
            scrollHeight="50vh"
            selectionMode="single"
            value={data}
          >
            <Column
              style={{ width: "20%" }}
              field="course"
              header="Course name"
            />
            <Column
              style={{ width: "30%" }}
              field="topic"
              header="Topic / Module"
            />
            <Column
              style={{ width: "40%" }}
              field="recordlink"
              header="Recording Link"
            />

            <Column
              style={{ width: "10%" }}
              header="Action"
              body={() => (
                <ButtonsLabel
                  // onClick={() => setEditRegistrationPopup(true)}
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

export default Recording;
