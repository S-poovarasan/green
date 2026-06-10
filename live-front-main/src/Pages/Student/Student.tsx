import React, { useState } from "react";
import CandidateAssignment from "./CandidateAssignment";
import { TabPanel, TabView } from "primereact/tabview";
import OnetoOneSessionAssignment from "./OnetoOneSessionAssignment";
import LoadingOverlay from "@/Components/Loading/Loading";
interface StudentProps {}

const Student: React.FC<StudentProps> = () => {
  const [loading, setLoading] = useState(false);
  return (
    <div className="px-5 pt-3 flex flex-col gap-2">
      {loading && <LoadingOverlay />}
      <div className="my-3">
        <h5>Filter the Students Details</h5>
      </div>
      <TabView>
        <TabPanel
          className="font-semibold text-xl text-[#000]"
          header="Candidate Assignment"
        >
          <CandidateAssignment setLoading={setLoading} />
        </TabPanel>
        <TabPanel
          className="font-semibold text-xl text-[#000]"
          header="One-to-One Session Assignment"
        >
          <OnetoOneSessionAssignment />
        </TabPanel>
      </TabView>
    </div>
  );
};

export default Student;
