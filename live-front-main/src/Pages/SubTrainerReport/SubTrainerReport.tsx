import { formatPrettyDateOnly } from '@/Components/LiveTimer/LiveTimer';
import React, { useCallback, useEffect, useState } from 'react';
import ButtonsLabel from "@/Components/Buttons/ButtonsLabel";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Slide, toast, ToastContainer } from 'react-toastify';
import LoadingOverlay from '@/Components/Loading/Loading';
import TextInputWithLabel from '@/Components/Input/TextInputWithLabel';
import TextAreaWithLabel from '@/Components/Input/TextAreaWithLabel';
import FileInputWithLabel from '@/Components/Input/FileInputWithLabelProps ';
import type { SubmitReportData, SubTrainerReportFormData } from '@/Interfaces/SubtrainerReport';
import { FileHandlerService } from '@/Services/FileHandlerService';
import ViewFiles from '@/Components/ViewFiles/ViewFiles';
import { Check, ExternalLink, Loader2Icon, X } from 'lucide-react';
import { SubtrainerReportService } from '@/Services/SubtrainerReportService';
import SelectInputWithLabel from '@/Components/Input/SelectInputWithLabel';
import { Dialog } from 'primereact/dialog';
import { cn } from '@/lib/utils';

interface SubTrainerReportProps {
}

const SubTrainerReport: React.FC<SubTrainerReportProps> = () => {

    useEffect(() => {
        fetchReportData();
    }, [])

    const [loading, setLoading] = useState(false);
    const [tabView, setTabView] = useState<number>(1);
    const [fileInputKey, setFileInputKey] = useState(0);
    const [formData, setFormData] = useState<SubTrainerReportFormData>({
        date: "",
        summary: "",
        solutions: "",
        goals: "",
        documents: []
    });
    const [visible, setVisible] = useState<boolean>(false);
    const [fileData, setFileData] = useState<SubmitReportData | null>(null)
    const [error, setError] = useState({
        status: false,
        message: "",
    });
    const [reportData, setReportData] = useState<SubmitReportData[]>([]);

    const typeOptions = [
        ...new Set(reportData.map((d) => d.refRTName)),
    ].map((t) => ({
        label: t,
        value: t,
    }));

    const statusOptions = [
        ...new Set(reportData.map((d) => d.refRPStatus)),
    ].map((s) => ({
        label: s.charAt(0).toUpperCase() + s.slice(1),
        value: s,
    }));



    const handleInput = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleFileUpload = useCallback(
        async (file: File, editStatus: boolean) => {
            const formDataImg = new FormData();
            formDataImg.append("file", file);

            try {
                const response = await FileHandlerService.uploadFile({
                    formFile: formDataImg,
                });

                if (response.status) {
                    if (editStatus) {
                        setFormData((prevFormData) => ({
                            ...prevFormData,
                            documents: [
                                ...prevFormData.documents,
                                {
                                    name: response.oldFilename,
                                    url: response.fileName,
                                },
                            ],
                        }));
                        setError({
                            status: false,
                            message: "",
                        });
                    }
                } else {
                    setError({
                        status: true,
                        message: "File upload failed",
                    });
                }
            } catch (err) {
                setError({
                    status: true,
                    message: "Error uploading file",
                });
            }
        },
        [setFormData, setError]
    );

    const submitFormData = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await SubtrainerReportService.SubmitReport(formData, tabView);
            if (response.status) {
                setFormData({
                    date: "",
                    summary: "",
                    solutions: "",
                    goals: "",
                    documents: []
                })
                setFileInputKey(prev => prev + 1);
                toast.success(response.message, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Slide,
                });
                fetchReportData();
                setError({
                    status: false,
                    message: "",
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
        setLoading(false);
    }

    const removeDocument = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            documents: prev.documents.filter((_, i) => i !== index),
        }));
    };

    const fetchReportData = async () => {
        setLoading(true);
        try {
            const response = await SubtrainerReportService.getReport();
            if (response.status) {
                setReportData(response.reportData);
            } else {
                console.log(response.message);
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }

    return (
        <div className="px-5 pt-3 flex flex-col gap-2">
            {loading && <LoadingOverlay />}
            <ToastContainer
                position="top-right"
                autoClose={2000}
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
            <div className="my-3">
                <h5>Reports</h5>
                <div className='text-[0.9rem] py-2 font-semibold text-[#7D7C7C]'>
                    Submit your weekly and monthly reports to the head trainer
                </div>
            </div>
            <div className='flex flex-col lg:flex-row gap-5 w-[100%] h-[65vh]'>
                <div className='flex flex-col gap-5 w-[100%] lg:w-[35%] h-[100%] overflow-auto custom-scroll'>
                    <div className='flex flex-col gap-2 p-2'>
                        <div className="w-full flex justify-around items-center py-3" style={{
                            boxShadow:
                                "inset 7px 7px 7px rgba(153,153,153,0.25), inset -7px -7px 7px rgba(235,235,235,0.25)",
                            border: "none",
                            borderRadius: 10,
                            backgroundColor: "#00808054",
                        }}>
                            <div className='w-[45%]'>
                                <ButtonsLabel
                                    className="h-8 lg:h-8 px-10"
                                    variant={`${tabView === 1 ? "primary" : "neutral"}`}
                                    onClick={() => setTabView(1)}
                                >
                                    Weekly Report
                                </ButtonsLabel>
                            </div>
                            <div className='w-[45%]'>
                                <ButtonsLabel
                                    className="h-8 lg:h-8 px-10"
                                    variant={`${tabView === 2 ? "primary" : "neutral"}`}
                                    onClick={() => setTabView(2)}
                                >
                                    Monthly Report
                                </ButtonsLabel>
                            </div>
                        </div>
                        <form onSubmit={submitFormData}>
                            <div className='my-5 flex flex-col gap-5'>
                                <TextInputWithLabel
                                    type="date"
                                    name="date"
                                    label={`${tabView === 1 ? "Weekly Report" : "Monthly Report"}`}
                                    placeholder="Select date / month / year"
                                    bgColor="#00808054"
                                    value={formData.date}
                                    onChange={handleInput}
                                    required
                                />
                                <TextAreaWithLabel
                                    name="summary"
                                    label={`${tabView === 1 ? "Weekly Summary" : "Monthly Summary"}`}
                                    placeholder="Provide a summary of your training activities, client progress and any notable events for the week."
                                    bgColor="#00808054"
                                    value={formData.summary}
                                    onChange={handleInput}
                                    required
                                />
                                <TextAreaWithLabel
                                    name="solutions"
                                    label="Chellenges and Solutions"
                                    placeholder="Describe any challenges encountered during the week and the solutions implemented."
                                    bgColor="#00808054"
                                    value={formData.solutions}
                                    onChange={handleInput}
                                    required
                                />
                                <TextAreaWithLabel
                                    name="goals"
                                    label={`${tabView === 1 ? "Goal for Next Week" : "Goal for Next Month"}`}
                                    placeholder="Outline your goals and objective for the upcoming weeks."
                                    bgColor="#00808054"
                                    value={formData.goals}
                                    onChange={handleInput}
                                    required
                                />
                                <FileInputWithLabel
                                    key={fileInputKey}
                                    name="resume"
                                    label="Upload Report Documents"
                                    accept=".pdf,.xls,.xlsx"
                                    onChange={(files) => {
                                        if (!files || files.length === 0) return;

                                        setLoading(true);

                                        Array.from(files).forEach((file) => {
                                            const maxSize = 5 * 1024 * 1024;
                                            if (file.size > maxSize) {
                                                setError({
                                                    status: true,
                                                    message: "Each file must be less than 5MB.",
                                                });
                                                return;
                                            }

                                            handleFileUpload(file, true);
                                        });

                                        setLoading(false);
                                    }}
                                    multiple
                                    bgColor="#00808054"
                                />
                                {
                                    formData.documents.length > 0 && formData.documents.map((item, index) => {
                                        return (
                                            <div className='w-[100%] flex gap-2 items-center'>
                                                <div className='w-[90%]'>
                                                    <ViewFiles Filename={item.url} oldFileName={item.name} />
                                                </div>
                                                <X size={15} color='red' className='hover:cursor-pointer' onClick={() => removeDocument(index)} />
                                            </div>
                                        )
                                    })
                                }
                                {
                                    error.status && (
                                        <p className="text-center h-[30px] text-[red]">
                                            {error.status && error.message}
                                        </p>
                                    )
                                }
                                <ButtonsLabel
                                    variant="primary"
                                    type={loading ? 'button' : 'submit'}
                                >
                                    {
                                        !loading ? `Submit Report` : <><Loader2Icon className='animate-spin' /></>
                                    }
                                </ButtonsLabel>
                            </div>
                        </form>
                    </div>
                </div>
                <div
                    style={{
                        boxShadow:
                            "inset 7px 7px 7px rgba(153,153,153,0.25), inset -7px -7px 7px rgba(235,235,235,0.25)",
                        border: "none",
                        borderRadius: 10,
                    }}
                    className="w-[100%] lg:w-[65%] overflow-y-auto p-4 custom-scroll"
                >
                    <Dialog
                        header="New Sub Trainer Registration Details"
                        visible={visible}
                        className="w-10/12"
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
                        onHide={() => {
                            setVisible(false);
                            setFileData(null);
                        }}
                    >
                        <div className="w-full">
                            <div
                                onClick={() => {
                                    setVisible(false);
                                    setFileData(null);
                                }}
                                className="flex cursor-pointer justify-center"
                            >
                                <div
                                    className={cn(
                                        "inline-flex items-center justify-center select-none focus:outline-none py-2 px-4 text-[0.8rem] font-bold rounded-xl",
                                        // sizeClasses[size],
                                        "bg-[#008080] text-white",
                                        "shadow-[inset_7px_7px_7px_rgba(153,153,153,0.25),inset_-7px_-7px_7px_rgba(235,235,235,0.25)]",
                                        "hover:shadow-[inset_9px_9px_9px_rgba(153,153,153,0.28),inset_-9px_-9px_9px_rgba(235,235,235,0.28)]"
                                        //   "active:shadow-[inset_4px_4px_6px_rgba(153,153,153,0.35),inset_-4px_-4px_6px_rgba(235,235,235,0.35)]"
                                    )}
                                >
                                    View Details
                                </div>
                                <X
                                    className="absolute right-2 cursor-pointer"
                                    width={20}
                                    height={20}
                                />
                            </div>
                        </div>
                        <div className="h-[76vh] overflow-y-auto custom-scroll flex flex-col justify-center items-start gap-3 p-10">
                            {
                                fileData !== null ? (
                                    <>
                                        <div className='mt-10'>
                                            <label className="font-bold text-gray-700 mb-2 block">
                                                Report Status
                                            </label>
                                            <div className='text-sm'>
                                                {fileData.refRTName}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="font-bold text-gray-700 mb-2 block">
                                                {fileData.refRTName} Report
                                            </label>
                                            <div className='text-sm'>
                                                {formatPrettyDateOnly(fileData.refRPDate)}
                                            </div>
                                        </div>
                                        <TextAreaWithLabel
                                            name="summary"
                                            label={`${fileData.refRTName} Summary`}
                                            placeholder="Provide a summary of your training activities, client progress and any notable events for the week."
                                            bgColor="#00808054"
                                            value={fileData ? fileData.refRPSummary : ""}
                                        />
                                        <TextAreaWithLabel
                                            name="summary"
                                            label="Chellenges and Solutions"
                                            placeholder="Provide a summary of your training activities, client progress and any notable events for the week."
                                            bgColor="#00808054"
                                            value={fileData ? fileData.refRPSolutions : ""}
                                        />
                                        <TextAreaWithLabel
                                            name="summary"
                                            label={`Goal for Next ${fileData.refRTName}`}
                                            placeholder="Provide a summary of your training activities, client progress and any notable events for the week."
                                            bgColor="#00808054"
                                            value={fileData ? fileData.refRPGoal : ""}
                                        />
                                        {
                                            fileData.documents.length > 0 && fileData.documents.map((item) => {
                                                return (
                                                    <div className='w-[100%] flex gap-2 items-center'>
                                                        <div className='w-[90%]'>
                                                            <ViewFiles Filename={item.refRPDUrl} oldFileName={item.refRPDName} />
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </>
                                ) : (<h2>No Data Found</h2>)
                            }
                        </div>
                    </Dialog>
                    <DataTable
                        scrollable
                        scrollHeight="57vh"
                        selectionMode="single"
                        value={reportData}
                        filterDisplay="menu"
                    >
                        <Column
                            style={{ width: "20%" }}
                            field="refRPDate"
                            body={(row) => {
                                return (
                                    <div>{row.refRPDate ? formatPrettyDateOnly(row.refRPDate) : "-"}</div>
                                )
                            }}
                            filter
                            showFilterMenu
                            showFilterMenuOptions={false}
                            showFilterOperator={false}
                            showFilterMatchModes={false}
                            filterElement={(options) => (
                                <TextInputWithLabel
                                    name="date"
                                    label=""
                                    type="date"
                                    value={options.value || ""}
                                    onChange={(e) => options.filterApplyCallback(e.target.value)}
                                    placeholder="Filter by date"
                                    className="p-column-filter w-full h-9 px-2"
                                />
                            )}
                            header="Date"
                        />
                        <Column
                            style={{ width: "20%" }}
                            field="refRTName"
                            header="Type"
                            filter
                            showFilterMenu
                            showFilterMenuOptions={false}
                            showFilterOperator={false}
                            showFilterMatchModes={false}
                            filterElement={(options) => (
                                <SelectInputWithLabel
                                    name="type"
                                    label=""
                                    value={options.value}
                                    options={typeOptions}
                                    onChange={(e) => options.filterApplyCallback(e.value)}
                                    placeholder="Filter by type"
                                    className="p-column-filter w-full"
                                />
                            )}
                        />
                        <Column
                            style={{ width: "20%" }}
                            field="refRPStatus"
                            filter
                            showFilterMenu
                            showFilterMenuOptions={false}
                            showFilterOperator={false}
                            showFilterMatchModes={false}
                            filterElement={(options) => (
                                <SelectInputWithLabel
                                    name="type"
                                    label=""
                                    value={options.value}
                                    options={statusOptions}
                                    onChange={(e) => options.filterApplyCallback(e.value)}
                                    placeholder="Filter by type"
                                    className="p-column-filter w-full"
                                />
                            )}
                            body={(row) => {
                                return (
                                    <>
                                        {
                                            row.refRPStatus === 'submitted' ? (
                                                <>
                                                    <div className='flex gap-1 justify-between items-center'>
                                                        <div
                                                            className="flex gap-1 justify-center items-center px-1 py-1 rounded text-xs font-normal"
                                                            style={{
                                                                backgroundColor: "#8CE4FF",
                                                                color: "#3D74B6",
                                                            }}
                                                        >
                                                            <Check size={15} color={"#3D74B6"} />
                                                            Submitted
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (<></>)
                                        }
                                    </>
                                )
                            }}
                            header="Status"
                        />
                        <Column
                            style={{ width: "20%" }}
                            field="refRTName"
                            header="Action"
                            body={(row) => {
                                return (
                                    <ButtonsLabel onClick={() => {
                                        setVisible(true);
                                        setFileData(row);
                                    }}
                                        className='w-40 h-8 lg:h-8 flex gap-2'>
                                        <div className='flex gap-2 justify-center items-center'>
                                            View Details <ExternalLink size={15} />
                                        </div>
                                    </ButtonsLabel>
                                )
                            }}
                        />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default SubTrainerReport;