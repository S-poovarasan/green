import TextInputWithLabel from '@/Components/Input/TextInputWithLabel';
import { cn } from '@/lib/utils';
import { Loader2Icon, X } from 'lucide-react';
import { Dialog } from 'primereact/dialog';
import React from 'react';
import ButtonsLabel from "@/Components/Buttons/ButtonsLabel";
import { SyllabusService } from '@/Services/SyllabusService';

interface AddSyllabusProps {
    getSyllabusData: () => void,
    addSyllabusPopup: boolean;
    setAddSyllabusPopup: React.Dispatch<React.SetStateAction<boolean>>;
    addSyllabusData: string;
    setAddSyllabusData: React.Dispatch<React.SetStateAction<string>>;
}

const AddSyllabus: React.FC<AddSyllabusProps> = (props) => {
    const [registerLoading, setRegisterLoading] = React.useState(false);
    const [error, setError] = React.useState({
        status: false,
        message: "",
    });

    const AddSyllabus = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setRegisterLoading(true);
        try {

            const res = await SyllabusService.newFSyllabus(props.addSyllabusData);
            if (res.status) {

                props.setAddSyllabusPopup(false);
                props.setAddSyllabusData("");

                props.getSyllabusData();;

            } else {
                setError({
                    status: true,
                    message: res.message,
                });
            }

        } catch (err) {
            console.error(err);
        }

        setRegisterLoading(false);
    }

    return (
        <Dialog
            header="New Sub Trainer Registration Details"
            visible={props.addSyllabusPopup}
            className="w-10/12 lg:w-4/12"
            style={{
                height: "31vh",
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
            onHide={() => props.setAddSyllabusPopup(false)}
        >
            <form onSubmit={AddSyllabus}>
                <div className="w-full">
                    <div
                        onClick={() => props.setAddSyllabusPopup(false)}
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
                            New Syllabus
                        </div>
                        <X
                            className="absolute right-2 cursor-pointer"
                            width={20}
                            height={20}
                        />
                    </div>
                </div>
                <div className="overflow-y-auto custom-scroll flex flex-col gap-3 px-3 pb-2 mt-4">
                    <TextInputWithLabel
                        type="text"
                        name="fullname"
                        label="Name"
                        placeholder="Enter your name"
                        bgColor="#00808054"
                        value={props.addSyllabusData}
                        onChange={(e) => {
                            props.setAddSyllabusData(e.target.value)
                            setError({
                                status: false,
                                message: "",
                            });
                        }}
                        required
                    />
                </div>
                <div className="h-[8vh]">
                    <p className="text-center h-[30px] text-[red]">
                        {error.status && error.message}
                    </p>
                    <div className="w-full flex justify-center items-center">
                        <div className="w-8/12 lg:w-6/12">
                            <ButtonsLabel
                                type={registerLoading ? "button" : "submit"}
                                className="h-8 lg:h-10"
                                variant="primary"
                            >
                                {registerLoading ? (
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

export default AddSyllabus;