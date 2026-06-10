import type { UpdateLinkTopic } from '@/Interfaces/SessionManagementInterface';
import { cn } from '@/lib/utils';
import { ClipboardPaste, Loader2Icon, X } from 'lucide-react';
import { Dialog } from 'primereact/dialog';
import React, { useState } from 'react';
import ButtonsLabel from "@/Components/Buttons/ButtonsLabel";
import TextInputWithLabel from '@/Components/Input/TextInputWithLabel';
import { SessionManagementService } from '@/Services/SessionManagementService';

interface UpdateTopicLinkSessionManagementProps {
    updateLinkTopicPopup: boolean;
    setUpdateLinkTopicPopup: React.Dispatch<React.SetStateAction<boolean>>;
    updateLinkTopicDetails: UpdateLinkTopic;
    setUpdateLinkTopicDetails: React.Dispatch<React.SetStateAction<UpdateLinkTopic>>;
    GetSessionData: () => void;
}

const UpdateTopicLinkSessionManagement: React.FC<UpdateTopicLinkSessionManagementProps> = (props) => {
    const [loading, setLoading] = useState(false);

    const handleSubmitUpdateMeetingLink = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await SessionManagementService.updateMeetingLink(props.updateLinkTopicDetails);
            if (response.status) {
                props.setUpdateLinkTopicPopup(false);
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
            visible={props.updateLinkTopicPopup}
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
            onHide={() => props.setUpdateLinkTopicPopup(false)}
        >
            <form onSubmit={handleSubmitUpdateMeetingLink}>
                <div className="w-full">
                    <div
                        onClick={() => props.setUpdateLinkTopicPopup(false)}
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
                            Topic Meeting Link
                        </div>
                        <X
                            className="absolute right-2 cursor-pointer"
                            width={20}
                            height={20}
                        />
                    </div>
                </div>
                <div className="mt-4 overflow-y-auto custom-scroll flex flex-col gap-3 px-3 pb-3">
                    <div className="w-full flex gap-2 items-end">
                        <label className=" w-full font-semibold text-gray-700 mb-2 block">
                            <TextInputWithLabel
                                type="text"
                                name={`topic-from`}
                                className='w-[100%]'
                                label={`Meeting Link for ${props.updateLinkTopicDetails.refCLName}`}
                                placeholder={`Enter Meeting Link`}
                                bgColor="#00808054"
                                value={props.updateLinkTopicDetails.refCLLink}
                                onChange={(e) => {
                                    props.setUpdateLinkTopicDetails(prev => ({
                                        ...prev,
                                        refCLLink: e.target.value
                                    }));
                                }}
                                required
                            />
                        </label>
                        <ButtonsLabel
                            type="button"
                            className="w-[50px] flex flex-col mb-2 text-xs"
                            variant="primary"
                            onClick={async () => {
                                try {
                                    const text = await navigator.clipboard.readText(); // Read clipboard
                                    props.setUpdateLinkTopicDetails(prev => ({
                                        ...prev,
                                        refCLLink: text   // Set clipboard text
                                    }));
                                } catch (err) {
                                    console.error("Failed to read clipboard: ", err);
                                }
                            }}

                        > <ClipboardPaste />
                        </ButtonsLabel>
                    </div>
                </div>
                <div className="h-[8vh]">
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

export default UpdateTopicLinkSessionManagement;