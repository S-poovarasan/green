import LoadingOverlay from '@/Components/Loading/Loading';
import React, { useEffect, useState } from 'react';
import ButtonsLabel from "@/Components/Buttons/ButtonsLabel";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import TextInputWithLabel from '@/Components/Input/TextInputWithLabel';
import SelectInputWithLabel from '@/Components/Input/SelectInputWithLabel';
import type { SyllabusModel } from '@/Interfaces/SyllabusInterface';
import { SyllabusService } from '@/Services/SyllabusService';
import AddSyllabus from './AddSyllabus';
import EditSyllabus from './EditSyllabus';

interface SyllabusProps {

}

const Syllabus: React.FC<SyllabusProps> = () => {

    useEffect(() => {
        getSyllabusData();
    }, [])

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<SyllabusModel[]>([]);
    const [addSyllabusPopup, setAddSyllabusPopup] = useState(false);
    const [addSyllabusData, setAddSyllabusData] = useState("");
    const [editSyllabusPopup, setEditSyllabusPopup] = useState(false);
    const [editSyllabusData, setEditSyllabusData] = useState("");
    const [editSyllabusId, setEditSyllabusId] = useState(0);

    const statusOptions = [...new Set(data.map((c) => c.refCourseStatus))].map(
        (t) => ({
            label: t ? `Active` : `Inactive`,
            value: t,
        })
    );

    const getSyllabusData = async () => {
        setLoading(true);
        try {
            const res = await SyllabusService.getSyllabus();
            if (res.status) {
                setData(res.syllabusData);
            }
        } catch (e) {
            console.log(e);
        }
        setLoading(false);
    }

    return (
        <div className="px-5 py-3 flex flex-col gap-2">
            {loading && <LoadingOverlay />}
            <AddSyllabus
                getSyllabusData={getSyllabusData}
                addSyllabusPopup={addSyllabusPopup}
                setAddSyllabusPopup={setAddSyllabusPopup}
                addSyllabusData={addSyllabusData}
                setAddSyllabusData={setAddSyllabusData}
            />
            <EditSyllabus
                getSyllabusData={getSyllabusData}
                editSyllabusPopup={editSyllabusPopup}
                setEditSyllabusPopup={setEditSyllabusPopup}
                editSyllabusData={editSyllabusData}
                setEditSyllabusData={setEditSyllabusData}
                editSyllabusId={editSyllabusId}
            />
            <div className="my-4 flex items-center justify-between">
                <h5>Syllabus</h5>
                <div className="w-6/12 lg:w-2/12">
                    <ButtonsLabel
                        variant="primary"
                        onClick={() => setAddSyllabusPopup(true)}
                    >
                        Add Syllabus
                    </ButtonsLabel>
                </div>
            </div>
            <div
                style={{
                    boxShadow:
                        "inset 7px 7px 7px rgba(153,153,153,0.25), inset -7px -7px 7px rgba(235,235,235,0.25)",
                    border: "none",
                    borderRadius: 10,
                }}
                className="w-12/12 overflow-y-auto p-4 custom-scroll"
            >
                <DataTable
                    scrollable
                    scrollHeight="65vh"
                    selectionMode="single"
                    value={data}
                    filterDisplay="menu"
                    emptyMessage="No Subtrianers Found"
                >
                    <Column
                        style={{ width: "30%" }}
                        field="refCourseName"
                        header="Course Name"
                        filter
                        filterField="refCourseName"
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
                                placeholder="Search by name"
                                className="p-column-filter w-full h-9 px-2 rounded-md border border-gray-300"
                            />
                        )}
                    />
                    <Column
                        style={{ width: "20%" }}
                        header="Status"
                        field="refCourseStatus"
                        filter
                        filterField="refCourseStatus"
                        filterMatchMode="equals"
                        showFilterMenu={true}
                        showFilterMenuOptions={false}
                        showFilterOperator={false}
                        showFilterMatchModes={false}
                        showAddButton={false}
                        body={(row) => (
                            <ButtonsLabel className="h-8 lg:h-8" variant="primary">
                                {row.refCourseStatus ? `Active` : `Inactive`}
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
                        style={{ width: "20%" }}
                        header="Action"
                        body={(row) => (
                            <ButtonsLabel
                                onClick={() => {
                                    setEditSyllabusData(row.refCourseName);
                                    setEditSyllabusId(row.refCourseId);
                                    setEditSyllabusPopup(true);
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
    );
};

export default Syllabus;