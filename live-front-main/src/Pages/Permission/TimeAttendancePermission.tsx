import { formatPrettyDate, useLiveDateTime } from '@/Components/LiveTimer/LiveTimer';
import type { AttendanceData } from '@/Interfaces/PermissionInterface';
import { PermissionService } from '@/Services/PermissionService';
import React, { useEffect, useState } from 'react';
import ButtonsLabel from "@/Components/Buttons/ButtonsLabel";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { cn } from '@/lib/utils';
import { Loader2Icon, X } from 'lucide-react';

interface TimeAttendancePermissionProps {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const TimeAttendancePermission: React.FC<TimeAttendancePermissionProps> = (props) => {

    const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
    const [startTime, setStartTime] = useState<string | null>(null);
    const runningTime = useLiveDateTime(startTime);
    const [punchPopup, setPunchPopup] = useState(false);
    const [popupLoading, setPopupLoading] = useState(false);
    const [punchStatus, setPunchStatus] = useState("");

    useEffect(() => {
        fetchAttendanceData();
    }, [])

    const fetchAttendanceData = async () => {
        props.setLoading(true);
        try {
            const response = await PermissionService.getAttendanceData();
            if (response.status) {
                setAttendanceData(response.attendanceData);
                setStartTime(response.timeStamp)
            } else {
                console.log(response.message);
            }
        } catch (e) {
            console.error(e);
        }
        props.setLoading(false);
    }

    const canPunchIn = () => {
        if (attendanceData) {
            if (attendanceData.length > 0) {
                if (attendanceData[0].refUAPunchOutTime !== "") {
                    return false
                } else {
                    return true
                }
            } else {
                return false
            }
        } else {
            return false
        }
    }

    const canPunchOut = () => {
        if (attendanceData) {
            if (attendanceData.length > 0) {
                if (attendanceData[0].refUAPunchOutTime === "") {
                    return false
                } else {
                    return true
                }
            } else {
                return true
            }
        } else {
            return true
        }
    }

    const PunchIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPopupLoading(true);
        try {
            const response = await PermissionService.punchIn();
            if (response.status) {
                setPopupLoading(false);
                setPunchPopup(false);
                fetchAttendanceData();
            } else {
                console.log(response.message);
            }
        } catch (e) {
            console.error(e);
        }
    }

    const PunchOut = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPopupLoading(true);
        try {
            const response = await PermissionService.punchOut();
            if (response.status) {
                setPopupLoading(false);
                setPunchPopup(false);
                fetchAttendanceData();
            } else {
                console.log(response.message);
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className='flex flex-col lg:flex-row gap-5 w-[100%] h-[65vh]'>
            <Dialog
                header="New Sub Trainer Registration Details"
                visible={punchPopup}
                className="w-10/12 lg:w-4/12"
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
                onHide={() => setPunchPopup(false)}
            >
                <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    if (punchStatus === "Punch In") {
                        PunchIn(e);
                    } else if (punchStatus === "Punch Out") {
                        PunchOut(e);
                    }
                }}>
                    <div className="w-full">
                        <div
                            onClick={() => setPunchPopup(false)}
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
                                {punchStatus}
                            </div>
                            <X
                                className="absolute right-2 cursor-pointer"
                                width={20}
                                height={20}
                            />
                        </div>
                    </div>
                    <div className="mt-4 overflow-y-auto custom-scroll flex flex-col gap-3 px-3 pb-3">
                        <div className="w-full">
                            <label className="font-semibold text-gray-700 mb-2 block">
                                Are you sure you want to {punchStatus}?
                            </label>
                        </div>
                    </div>
                    <div className="h-[8vh]">
                        {/* <p className="text-center h-[30px] text-[red]">
                        {error.status && error.message}
                    </p> */}
                        <div className="w-full flex justify-center items-center">
                            <div className="w-8/12 lg:w-6/12">
                                <ButtonsLabel
                                    type={popupLoading ? "button" : "submit"}
                                    className="h-8 lg:h-10"
                                    variant="primary"
                                >
                                    {popupLoading ? (
                                        <>
                                            <Loader2Icon size={18} className="animate-spin" />
                                        </>
                                    ) : (
                                        "Yes, Sure"
                                    )}
                                </ButtonsLabel>
                            </div>
                        </div>
                    </div>
                </form>
            </Dialog>
            <div className='flex flex-col gap-5 w-[100%] lg:w-[35%]'>
                <div>
                    <div className='text-[1rem] font-bold'>
                        Current Time
                    </div>
                    <div className='text-[0.9rem] py-2 font-semibold text-[#7D7C7C]'>
                        {runningTime || "No Time"}
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <div className='text-[1rem] font-bold'>
                        Punch In / Out
                    </div>
                    <div className='flex gap-3 ml-0 lg:ml-10'>
                        <div>
                            <ButtonsLabel
                                onClick={() => {
                                    setPunchPopup(true);
                                    setPunchStatus("Punch In");
                                }}
                                disabled={canPunchIn()}
                                className="h-10 lg:h-10 px-10"
                                variant="primary"
                            >
                                Punch In
                            </ButtonsLabel>
                        </div>
                        <div>
                            <ButtonsLabel
                                onClick={() => {
                                    setPunchPopup(true);
                                    setPunchStatus("Punch Out");
                                }}
                                disabled={canPunchOut()}
                                className="h-10 lg:h-10 px-10"
                                variant="primary"
                            >
                                Punch Out
                            </ButtonsLabel>
                        </div>
                    </div>
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
                <DataTable
                    scrollable
                    scrollHeight="57vh"
                    selectionMode="single"
                    value={attendanceData}
                    filterDisplay="menu"
                >
                    <Column
                        style={{ width: "20%" }}
                        field="refUAPunchInTime"
                        body={(row) => {
                            return (
                                <div>{row.refUAPunchInTime ? formatPrettyDate(row.refUAPunchInTime) : "-"}</div>
                            )
                        }}
                        header="Punch In Date & Time"
                    />
                    <Column
                        style={{ width: "20%" }}
                        field="refUAPunchOutTime"
                        body={(row) => {
                            return (
                                <div>{row.refUAPunchOutTime ? formatPrettyDate(row.refUAPunchOutTime) : "-"}</div>
                            )
                        }}
                        header="Punch Out Date & Time"
                    />
                </DataTable>
            </div>
        </div>
    );
};

export default TimeAttendancePermission;