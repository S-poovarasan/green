import { cn } from '@/lib/utils';
import { Loader2Icon, X } from 'lucide-react';
import { Dialog } from 'primereact/dialog';
import ButtonsLabel from "@/Components/Buttons/ButtonsLabel";
import React, { useState } from 'react';
import { SessionManagementService } from '@/Services/SessionManagementService';

interface DeleteTopicSessionManagementProps {
    deleteTopicPopup: boolean;
    setDeleteTopicPopup: React.Dispatch<React.SetStateAction<boolean>>;
    deleteTopicDetails: number;
    setDeleteTopicDetails: React.Dispatch<React.SetStateAction<number>>;
    GetSessionData: () => void;
    deleteTopicName: string;
}

const DeleteTopicSessionManagement: React.FC<DeleteTopicSessionManagementProps> = (props) => {
    const [loading, setLoading] = useState(false);

    const handleSubmitDeleteTopic = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await SessionManagementService.deleteTopicSession(props.deleteTopicDetails);
            if (response.status) {
                props.setDeleteTopicPopup(false);
                props.GetSessionData();
            } else {
                console.error(response.message);
            }
        } catch (e) {
            console.log(e)
        }
        setLoading(false);
    }

    return (
        <Dialog
            header="New Sub Trainer Registration Details"
            visible={props.deleteTopicPopup}
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
            onHide={() => props.setDeleteTopicPopup(false)}
        >
            <form onSubmit={handleSubmitDeleteTopic}>
                <div className="w-full">
                    <div
                        onClick={() => props.setDeleteTopicPopup(false)}
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
                            Delete Topic
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
                            Are you sure you want to delete the class? <span className='font-bold'>{props.deleteTopicName}</span>
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
                                type={loading ? "button" : "submit"}
                                className="h-8 lg:h-10"
                                variant="primary"
                            >
                                {loading ? (
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
    );
};

export default DeleteTopicSessionManagement;