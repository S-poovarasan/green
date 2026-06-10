import TextAreaWithLabel from '@/Components/Input/TextAreaWithLabel';
import TextInputWithLabel from '@/Components/Input/TextInputWithLabel';
import { Loader2Icon, X } from 'lucide-react';
import { Dialog } from 'primereact/dialog';
import ButtonsLabel from "@/Components/Buttons/ButtonsLabel";
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { EditGroupsDetails } from '@/Interfaces/SessionManagementInterface';
import { SessionManagementService } from '@/Services/SessionManagementService';

interface EditSessionManagementProps {
    editGroupPopup: boolean;
    setEditGroupPopup: React.Dispatch<React.SetStateAction<boolean>>;
    editGroupDetails: EditGroupsDetails;
    setEditGroupDetails: React.Dispatch<React.SetStateAction<EditGroupsDetails>>;
    GetSessionData: () => void;
}

const EditSessionManagement: React.FC<EditSessionManagementProps> = (props) => {

    const [loading, setLoading] = useState(false);

    const handleUpdateGroupDetails = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        try {
            const response = await SessionManagementService.updateGroupDetailsSession(props.editGroupDetails);
            if (response.status) {
                props.setEditGroupPopup(false);
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
            header="Edit Group Details"
            visible={props.editGroupPopup}
            className="w-11/12 lg:w-4/12"
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
                props.setEditGroupPopup(false);
            }}
        >
            <form onSubmit={handleUpdateGroupDetails}>
                <div className="w-full">
                    <div
                        onClick={() => {
                            props.setEditGroupPopup(false);
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
                            Edit Group Details
                        </div>
                        <X
                            className="absolute right-2 cursor-pointer"
                            width={20}
                            height={20}
                        />
                    </div>
                </div>
                <div className="h-[auto] mt-3 overflow-y-auto custom-scroll flex flex-col justify-center items-center gap-3 pb-3">
                    <TextInputWithLabel
                        type="text"
                        name="groupname"
                        label="Group Name"
                        placeholder="Enter Group Name"
                        bgColor="#00808054"
                        value={props.editGroupDetails.refGName}
                        onChange={(e) => {
                            props.setEditGroupDetails((prev) => ({
                                ...prev,
                                refGName: e.target.value
                            }));
                        }}
                        required
                    />
                    <TextAreaWithLabel
                        name="description"
                        label="Group Description"
                        placeholder="Enter details..."
                        bgColor="#00808054"
                        value={props.editGroupDetails.refGDescription}
                        onChange={(e) => {
                            props.setEditGroupDetails((prev) => ({
                                ...prev,
                                refGDescription: e.target.value
                            }));
                        }}
                        required
                    />
                    <div>
                        <ButtonsLabel
                            type="submit"
                            variant="primary"
                            className='px-10'
                        >
                            {
                                !loading ? `Save` : <><Loader2Icon className='animate-spin' /></>
                            }
                        </ButtonsLabel>
                    </div>
                </div>
            </form>
        </Dialog>
    );
};

export default EditSessionManagement;