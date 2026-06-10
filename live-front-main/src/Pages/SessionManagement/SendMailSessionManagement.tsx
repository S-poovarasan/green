import { cn } from '@/lib/utils';
import { Loader2Icon, X } from 'lucide-react';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import ButtonsLabel from "@/Components/Buttons/ButtonsLabel";
import { SessionManagementService } from '@/Services/SessionManagementService';
import type { StudentListData } from '@/Interfaces/GroupsInterface';
import { MultiSelect } from 'primereact/multiselect';
import { Slide, toast } from 'react-toastify';

interface UpdateTopicLinkSessionManagementProps {
    sendMailPopup: boolean;
    setsendMailPopup: React.Dispatch<React.SetStateAction<boolean>>;
    sendMailId: number;
    refCLId: number;
}

const SendMailSessionManagement: React.FC<UpdateTopicLinkSessionManagementProps> = (props) => {

    useEffect(() => {
        GetStudentList();
    }, [props.sendMailPopup === true])

    const [globalLoading, setGlobalLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [studentList, setStudentList] = useState<StudentListData[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<number[]>([]);

    const GetStudentList = async () => {
        setGlobalLoading(true);
        try {
            const response = await SessionManagementService.getGroupStudentList(props.sendMailId);
            console.log('SendMailSessionManagement.tsx / response / 30 -------------------  ', response);
            if (response.status) {
                setStudentList(response.data);
            } else {
                console.error(response.message);
            }
        } catch (e) {
            console.log(e)
        }
        setGlobalLoading(false);
    }

    const SendMailStudent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        try {
            const response = await SessionManagementService.sendMailStudentList(selectedStudent, props.refCLId);
            if (response.status) {
                toast.success(response.message, {
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
                props.setsendMailPopup(false);
                setSelectedStudent([]);
            } else {
                console.error(response.message);
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }


    return (
        <Dialog
            header="New Sub Trainer Registration Details"
            visible={props.sendMailPopup}
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
            onHide={() => { props.setsendMailPopup(false) }}
        >
            <form onSubmit={SendMailStudent}>
                <div className="w-full">
                    <div
                        onClick={() => props.setsendMailPopup(false)}
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
                            Send Mail
                        </div>
                        <X
                            className="absolute right-2 cursor-pointer"
                            width={20}
                            height={20}
                        />
                    </div>
                </div>
                {
                    globalLoading ? <div className='flex justify-around items-center my-10'><Loader2Icon size={18} className="animate-spin" /></div> : (
                        <>
                            <div className="mt-10 overflow-y-auto custom-scroll flex flex-col gap-3 px-3 pb-10">
                                <div className="w-full flex gap-2 items-end">
                                    <MultiSelect value={selectedStudent} onChange={(e) => setSelectedStudent(e.value)} options={studentList} optionLabel="refUserName" optionValue="refUserId"
                                        placeholder="Select Student"
                                        style={{
                                            boxShadow:
                                                "inset 7px 7px 7px rgba(153,153,153,0.25), inset -7px -7px 7px rgba(235,235,235,0.25)",
                                            border: "none",
                                            borderRadius: 10,
                                            backgroundColor: "#00808054",
                                        }}
                                        className="w-full h-10 lg:h-11 text-sm rounded-2xl focus:border-none"
                                    />
                                </div>
                            </div>
                            <div className="h-[8vh]">
                                <div className="w-full flex justify-center items-center">
                                    <div className="w-8/12 lg:w-6/12">
                                        <ButtonsLabel
                                            type={loading ? "button" : "submit"}
                                            className="h-8 lg:h-10"
                                            variant="primary"
                                            disabled={selectedStudent.length === 0}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2Icon size={30} className="animate-spin" />
                                                </>
                                            ) : (
                                                "Save"
                                            )}
                                        </ButtonsLabel>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }
            </form>
        </Dialog>
    );
};

export default SendMailSessionManagement;