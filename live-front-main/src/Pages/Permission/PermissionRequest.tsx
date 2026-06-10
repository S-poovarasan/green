import TextAreaWithLabel from '@/Components/Input/TextAreaWithLabel';
import TextInputWithLabel from '@/Components/Input/TextInputWithLabel';
import type { PermissionData, RequestPermissionFormData } from '@/Interfaces/PermissionInterface';
import { Check, Copy, EllipsisVertical, ExternalLink, History, Loader2Icon, Undo2, X } from 'lucide-react';
import ButtonsLabel from "@/Components/Buttons/ButtonsLabel";
import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatPrettyDate } from '@/Components/LiveTimer/LiveTimer';
import { Dialog } from 'primereact/dialog';
import { Slide, toast } from 'react-toastify';
import { cn } from '@/lib/utils';
import { PermissionService } from '@/Services/PermissionService';
import { convertTo12Hour } from '@/Components/convertTo12Hour';

interface PermissionRequestProps {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const PermissionRequest: React.FC<PermissionRequestProps> = (props) => {
    const [loadingLeave, setLoadingLeave] = useState(false);
    const [permissionForm, setpermissionForm] = useState<RequestPermissionFormData>({
        date: "",
        startTime: "",
        endTime: "",
        type: "",
        description: "",
    })

    const [permissionData, setPermissionData] = useState<PermissionData[]>([]);

    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
    const menuPermissionRef = useRef<HTMLDivElement>(null);
    const [menuPosition, setMenuPosition] = useState({
        top: 0,
        left: 0
    });

    useEffect(() => {
        fetchPermissionData();
    }, [])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuPermissionRef.current && !menuPermissionRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInput = (e: any) => {
        const name = e.target?.name || e.name;
        const value = e.target?.value ?? e.value;

        setpermissionForm((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    const handleSubmitRequest = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingLeave(true);
        try {
            const response = await PermissionService.newPermissionRequest(permissionForm);
            if (response.status) {
                setpermissionForm({
                    date: "",
                    startTime: "",
                    endTime: "",
                    type: "",
                    description: "",
                })
                fetchPermissionData();
            }
        } catch (e) {
            console.error(e);
        }
        setLoadingLeave(false);
    }

    const fetchPermissionData = async () => {
        props.setLoading(true);
        try {
            const response = await PermissionService.getPermissionData();
            if (response.status) {
                setPermissionData(response.permissionData);
            }
        } catch (e) {
            console.error(e);
        }
        props.setLoading(false);
    }

    const WithdrawSubmitRequest = async (selectedRowId: number) => {
        try {
            const response = await PermissionService.withdrawPermissionRequest(selectedRowId || 0);
            if (response.status) {
                setMenuOpen(false);
                fetchPermissionData();
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className='flex flex-row gap-5 w-[100%] h-[65vh]'>
            {menuOpen && (
                <div
                    ref={menuPermissionRef}
                    className="fixed bg-white shadow-lg rounded-lg border-2 border-[#f3f4f6] z-50"
                    style={{
                        top: menuPosition.top,
                        left: menuPosition.left
                    }}
                >
                    <div className=" cursor-pointer flex gap-1 text-left px-3 py-2 text-xs text-[#374151] hover:bg-[#f3f4f6]"
                        onClick={() => selectedRowId && WithdrawSubmitRequest(selectedRowId)}
                    >
                        <Undo2 size={15} /> Withdraw
                    </div>
                </div>
            )}

            <div className='flex flex-col gap-5 w-[35%]'>
                <form
                    onSubmit={handleSubmitRequest}
                    className='flex flex-col gap-5 pb-10'>
                    <TextInputWithLabel
                        type="date"
                        name="date"
                        label="Date"
                        placeholder="Select Start date"
                        bgColor="#00808054"
                        value={permissionForm.date}
                        onChange={handleInput}
                        required
                    />
                    <div className='flex gap-5'>
                        <TextInputWithLabel
                            type="time"
                            name="startTime"
                            label="Start Time"
                            placeholder="Select Start date"
                            bgColor="#00808054"
                            value={permissionForm.startTime}
                            onChange={handleInput}
                            required
                        />
                        <TextInputWithLabel
                            type="time"
                            name="endTime"
                            label="End Time"
                            placeholder="Select End Date"
                            bgColor="#00808054"
                            value={permissionForm.endTime}
                            onChange={handleInput}
                            required
                        />
                    </div>
                    <TextInputWithLabel
                        type="text"
                        name="type"
                        label="Permission Type"
                        placeholder="Enter Permission Type"
                        bgColor="#00808054"
                        value={permissionForm.type}
                        onChange={handleInput}
                        required
                    />
                    <TextAreaWithLabel
                        name="description"
                        label="Description"
                        placeholder="Describe your permission request"
                        bgColor="#00808054"
                        required
                        value={permissionForm.description}
                        onChange={handleInput}
                    />
                    <div>
                        <ButtonsLabel
                            type={loadingLeave ? "button" : "submit"}
                            className="h-10 lg:h-10 px-10"
                            variant="primary"
                        >
                            {loadingLeave ? (
                                <>
                                    <Loader2Icon size={18} className="animate-spin" />
                                </>
                            ) : (
                                "Submit Permission Request"
                            )}
                        </ButtonsLabel>
                    </div>
                </form>
            </div>
            <div
                style={{
                    boxShadow:
                        "inset 7px 7px 7px rgba(153,153,153,0.25), inset -7px -7px 7px rgba(235,235,235,0.25)",
                    border: "none",
                    borderRadius: 10,
                }}
                className="w-[65%] overflow-y-auto p-4 custom-scroll"
            >
                <DataTable
                    scrollable
                    scrollHeight="57vh"
                    selectionMode="single"
                    value={permissionData}
                    filterDisplay="menu"
                >
                    <Column
                        style={{ width: "30%" }}
                        field="refUPCreatedAt"
                        body={(row) => {
                            return (
                                <div>{row.refUPCreatedAt ? formatPrettyDate(row.refUPCreatedAt) : "-"}</div>
                            )
                        }}
                        header="Permission Applied Date"
                    />
                    <Column
                        style={{ width: "20%" }}
                        field="refUPDate"
                        header="Permission Date"
                    />
                    <Column
                        style={{ width: "20%" }}
                        field="refUPStartTime"
                        body={(row) => {
                            return (
                                <div>{convertTo12Hour(row.refUPStartTime)}</div>
                            )
                        }}
                        header="Start Time"
                    />
                    <Column
                        style={{ width: "20%" }}
                        field="refUPEndDate"
                        body={(row) => {
                            return (
                                <div>{convertTo12Hour(row.refUPEndTime)}</div>
                            )
                        }}
                        header="End Date"
                    />
                    <Column
                        style={{ width: "20%" }}
                        field="refUPPermissionType"
                        body={(row) => {
                            const text = row.refUPPermissionType ?? "";
                            const [openStatus, setOpenStatus] = useState(false);
                            return (
                                <>
                                    <div className="flex gap-1 items-center hover:underline">
                                        <div
                                            onClick={() => {
                                                setOpenStatus(true);
                                            }}
                                            style={{
                                                maxWidth: "150px",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {text}
                                        </div>
                                        <ExternalLink size={15} />
                                    </div>
                                    <Dialog
                                        header="New Sub Trainer Registration Details"
                                        visible={openStatus}
                                        className="w-6/12"
                                        style={{
                                            height: "auto",
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
                                            setOpenStatus(false);
                                        }}
                                    >
                                        <div className="w-full">
                                            <div
                                                onClick={() => {
                                                    setOpenStatus(false);
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
                                                    Reason
                                                </div>
                                                <X
                                                    className="absolute right-2 cursor-pointer"
                                                    width={20}
                                                    height={20}
                                                />
                                            </div>
                                        </div>
                                        <div className="h-[auto] border-1 border-[#4B5563] rounded-lg p-2 overflow-y-auto custom-scroll flex flex-col justify-start items-center my-2">
                                            Permission Type: {text}
                                            <br />
                                            Description: {row.refUPReason}
                                        </div>
                                        <div
                                            onClick={() => {
                                                navigator.clipboard.writeText(`Permission Type: ${text}
Description: ${row.refUPReason}
                                                    `)
                                                toast.success("Reason Copied !", {
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
                                            }}
                                            className={cn(
                                                "inline-flex items-center cursor-pointer justify-center gap-2 select-none focus:outline-none py-2 px-4 text-[0.8rem] font-bold rounded-xl",
                                                // sizeClasses[size],
                                                "bg-[#008080] text-white",
                                                "shadow-[inset_7px_7px_7px_rgba(153,153,153,0.25),inset_-7px_-7px_7px_rgba(235,235,235,0.25)]",
                                                "hover:shadow-[inset_9px_9px_9px_rgba(153,153,153,0.28),inset_-9px_-9px_9px_rgba(235,235,235,0.28)]"
                                                //   "active:shadow-[inset_4px_4px_6px_rgba(153,153,153,0.35),inset_-4px_-4px_6px_rgba(235,235,235,0.35)]"
                                            )}
                                        >
                                            Copy to Clipboard <Copy size={18} />
                                        </div>
                                    </Dialog>
                                </>
                            );
                        }}
                        header="Type"
                    />

                    <Column
                        style={{ width: "20%" }}
                        field="refUPStatus"
                        body={(row) => {
                            let bgcolor = "";
                            let color = "";
                            let text = "";

                            if (row.refUPStatus === "pending") {
                                bgcolor = "#FFF4CC";
                                color = "#9A6B00";
                                text = "Pending";
                            } else if (row.refUPStatus === "rejected") {
                                bgcolor = "#FDE2E2";
                                color = "#B71C1C";
                                text = "Rejected";
                            } else if (row.refUPStatus === "approved") {
                                bgcolor = "#D8F3EA";
                                color = "#0C895E";
                                text = "Approved";
                            } else if (row.refUPStatus === "withdraw") {
                                bgcolor = "#E5E7EB";
                                color = "#374151";
                                text = "Withdraw";
                            }

                            return (
                                <div className='flex gap-1 justify-between items-center'>
                                    <div
                                        className="flex gap-1 justify-center items-center px-1 py-1 rounded text-xs font-normal"
                                        style={{
                                            backgroundColor: bgcolor,
                                            color: color,
                                        }}
                                    >
                                        {
                                            row.refUPStatus === "pending" && (
                                                <History size={15} color={color} />
                                            )}
                                        {
                                            row.refUPStatus === "approved" && (
                                                <Check size={15} color={color} />
                                            )
                                        }
                                        {
                                            row.refUPStatus === "rejected" && (
                                                <X size={15} color={color} />
                                            )
                                        }
                                        {
                                            row.refUPStatus === "withdraw" && (
                                                <Undo2 size={15} color={color} />
                                            )

                                        }
                                        {text}
                                    </div>
                                    {
                                        row.refUPStatus === "pending" && (
                                            <>
                                                <EllipsisVertical
                                                    className="cursor-pointer p-1 rounded-full hover:bg-gray-200"
                                                    size={22}
                                                    onClick={(e) => {
                                                        const rect = (e.target as HTMLElement).getBoundingClientRect();

                                                        setMenuPosition({
                                                            top: rect.bottom + window.scrollY,   // below the icon
                                                            left: rect.left + window.scrollX - 90  // shift left a bit
                                                        });

                                                        setSelectedRowId(row.refUPId);
                                                        setMenuOpen(true);
                                                    }}
                                                />
                                            </>
                                        )

                                    }
                                </div>
                            );
                        }}
                        header="Status"
                    />

                </DataTable>
            </div>
        </div>
    );
};

export default PermissionRequest;