import TextInputWithLabel from '@/Components/Input/TextInputWithLabel';
import type { AddNewTopic } from '@/Interfaces/SessionManagementInterface';
import { cn } from '@/lib/utils';
import { Loader2Icon, Trash, X } from 'lucide-react';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import React, { useState } from 'react';
import ButtonsLabel from "@/Components/Buttons/ButtonsLabel";
import { SessionManagementService } from '@/Services/SessionManagementService';

interface AddTopicSessionManagementProps {
    addTopicPopup: boolean;
    setAddTopicPopup: React.Dispatch<React.SetStateAction<boolean>>;
    addTopicDetails: AddNewTopic;
    setAddTopicDetails: React.Dispatch<React.SetStateAction<AddNewTopic>>;
    GetSessionData: () => void;
}

const AddTopicSessionManagement: React.FC<AddTopicSessionManagementProps> = (props) => {

    const [loading, setLoading] = useState(false);

    const handleSubmitAddNewTopic = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await SessionManagementService.addNewTopicSession(props.addTopicDetails);
            if (response.status) {
                props.setAddTopicPopup(false);
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
            visible={props.addTopicPopup}
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
            onHide={() => props.setAddTopicPopup(false)}
        >
            <form onSubmit={handleSubmitAddNewTopic}>
                <div className="w-full">
                    <div
                        onClick={() => props.setAddTopicPopup(false)}
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
                            Add Topic
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
                            List Course Topics
                        </label>
                        {props.addTopicDetails.topic.map((topic, index) => (
                            <div key={index} className="flex gap-2 items-center mb-2">
                                <div className={`w-[90%]`}>
                                    <TextInputWithLabel
                                        type="text"
                                        name={`topic-${index}`}
                                        label=""
                                        placeholder={`Topic ${index + 1}`}
                                        bgColor="#00808054"
                                        value={topic.refCLName}
                                        onChange={(e) => {
                                            const newListTopics = [...props.addTopicDetails.topic];
                                            newListTopics[index].refCLName = e.target.value;
                                            props.setAddTopicDetails({ ...props.addTopicDetails, topic: newListTopics });
                                        }}
                                        required
                                    />
                                    <div className="flex gap-2 mt-2">
                                        <TextInputWithLabel
                                            type="date"
                                            name={`topic-date-${index}`}
                                            label="Date"
                                            placeholder={`Topic ${index + 1}`}
                                            bgColor="#00808054"
                                            value={topic.refCLDate}
                                            onChange={(e) => {
                                                const newListTopics = [...props.addTopicDetails.topic];
                                                newListTopics[index].refCLDate = e.target.value;
                                                props.setAddTopicDetails({ ...props.addTopicDetails, topic: newListTopics });
                                            }}
                                            required
                                        />
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <TextInputWithLabel
                                            type="time"
                                            name={`topic-from-${index}`}
                                            label="From Time"
                                            placeholder={`Topic ${index + 1}`}
                                            bgColor="#00808054"
                                            value={topic.refCLFromTime}
                                            onChange={(e) => {
                                                const newListTopics = [...props.addTopicDetails.topic];
                                                newListTopics[index].refCLFromTime = e.target.value;
                                                props.setAddTopicDetails({ ...props.addTopicDetails, topic: newListTopics });
                                            }}
                                            required
                                        />
                                        <TextInputWithLabel
                                            type="time"
                                            name={`topic-to-${index}`}
                                            label="To Time"
                                            placeholder={`Topic ${index + 1}`}
                                            bgColor="#00808054"
                                            value={topic.refCLToTime}
                                            onChange={(e) => {
                                                const newListTopics = [...props.addTopicDetails.topic];
                                                newListTopics[index].refCLToTime = e.target.value;
                                                props.setAddTopicDetails({ ...props.addTopicDetails, topic: newListTopics });
                                            }}
                                            required
                                        />
                                    </div>
                                    <Divider />
                                </div>
                                <div className="w-[10%]">
                                    <ButtonsLabel
                                        type="button"
                                        variant="danger"
                                        onClick={() => {
                                            const newListTopics = props.addTopicDetails.topic.filter(
                                                (_, i) => i !== index
                                            );
                                            props.setAddTopicDetails({ ...props.addTopicDetails, topic: newListTopics });
                                        }}
                                    >
                                        <Trash size={15} />
                                    </ButtonsLabel>
                                </div>
                            </div>
                        ))}
                        <ButtonsLabel
                            type="button"
                            className="h-8 lg:h-10"
                            variant="primary"
                            onClick={() => {
                                props.setAddTopicDetails({
                                    ...props.addTopicDetails,
                                    topic: [
                                        ...props.addTopicDetails.topic,
                                        {
                                            refCLName: "",
                                            refCLDate: "",
                                            refCLFromTime: "",
                                            refCLToTime: "",
                                        }
                                    ],
                                });
                            }}
                        >
                            Add Topics
                        </ButtonsLabel>
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

export default AddTopicSessionManagement;