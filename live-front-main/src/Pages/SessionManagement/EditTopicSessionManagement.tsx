import { cn } from '@/lib/utils';
import { Loader2Icon, X } from 'lucide-react';
import { Dialog } from 'primereact/dialog';
import React, { useState } from 'react';
import ButtonsLabel from "@/Components/Buttons/ButtonsLabel";
import TextInputWithLabel from '@/Components/Input/TextInputWithLabel';
import type { NewTopic } from '@/Interfaces/SessionManagementInterface';
import { SessionManagementService } from '@/Services/SessionManagementService';

interface EditTopicSessionManagementProps {
    editTopicPopup: boolean;
    setEditTopicPopup: React.Dispatch<React.SetStateAction<boolean>>;
    editTopicDetails: NewTopic;
    setEditTopicDetails: React.Dispatch<React.SetStateAction<NewTopic>>;
    GetSessionData: () => void;
}

const EditTopicSessionManagement: React.FC<EditTopicSessionManagementProps> = (props) => {

    const [loading, setLoading] = useState(false);

    const handleSubmitEditTopic = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await SessionManagementService.editTopicSession(props.editTopicDetails);
            if (response.status) {
                props.setEditTopicPopup(false);
                props.GetSessionData();
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
            visible={props.editTopicPopup}
            className="w-10/12 lg:w-4/12"
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
            onHide={() => props.setEditTopicPopup(false)}
        >
            <form onSubmit={handleSubmitEditTopic}>
                <div className="w-full">
                    <div
                        onClick={() => props.setEditTopicPopup(false)}
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
                            Edit Topic
                        </div>
                        <X
                            className="absolute right-2 cursor-pointer"
                            width={20}
                            height={20}
                        />
                    </div>
                </div>
                <div className="h-[72vh] overflow-y-auto custom-scroll flex flex-col gap-3 px-3 pb-3">
                    <div className="w-full">
                        <label className="font-bold text-gray-700 mb-2 block">
                            Edit Course Topics
                        </label>
                        <div className="flex gap-2 items-center mb-2">
                            <div className={`w-[90%]`}>
                                <TextInputWithLabel
                                    type="text"
                                    name={`topic`}
                                    label=""
                                    placeholder={`Topic`}
                                    bgColor="#00808054"
                                    value={props.editTopicDetails.refCLName}
                                    onChange={(e) => {
                                        props.setEditTopicDetails((prev) => ({
                                            ...prev,
                                            refCLName: e.target.value
                                        }));
                                    }}
                                    required
                                />
                                <div className="flex gap-2 mt-2">
                                    <TextInputWithLabel
                                        type="date"
                                        name={`topic-date`}
                                        label="Date"
                                        placeholder={`Date`}
                                        bgColor="#00808054"
                                        value={props.editTopicDetails.refCLDate}
                                        onChange={(e) => {
                                            props.setEditTopicDetails((prev) => ({
                                                ...prev,
                                                refCLDate: e.target.value
                                            }));
                                        }}
                                        required
                                    />
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <TextInputWithLabel
                                        type="time"
                                        name={`topic-from`}
                                        label="From Time"
                                        placeholder={`From Date`}
                                        bgColor="#00808054"
                                        value={props.editTopicDetails.refCLFromTime}
                                        onChange={(e) => {
                                            props.setEditTopicDetails((prev) => ({
                                                ...prev,
                                                refCLFromTime: e.target.value
                                            }));
                                        }}
                                        required
                                    />
                                    <TextInputWithLabel
                                        type="time"
                                        name={`topic-to`}
                                        label="To Time"
                                        placeholder={`To Date`}
                                        bgColor="#00808054"
                                        value={props.editTopicDetails.refCLToTime}
                                        onChange={(e) => {
                                            props.setEditTopicDetails((prev) => ({
                                                ...prev,
                                                refCLToTime: e.target.value
                                            }));
                                        }}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
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
                                    "Save"
                                )}
                            </ButtonsLabel>
                        </div>
                    </div>
                </div>
            </form>
        </Dialog>
    );
};

export default EditTopicSessionManagement;