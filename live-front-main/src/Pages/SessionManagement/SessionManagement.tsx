import { Accordion, AccordionTab } from 'primereact/accordion';
import { ProgressBar } from 'primereact/progressbar';
import React, { useEffect, useState } from 'react';
import ButtonsLabel from "@/Components/Buttons/ButtonsLabel";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Edit, Link, Send, Trash, Video } from 'lucide-react';
import type { AddNewTopic, EditGroupsDetails, GetSessionModel, NewTopic, UpdateLinkTopic } from '@/Interfaces/SessionManagementInterface';
import LoadingOverlay from '@/Components/Loading/Loading';
import { SessionManagementService } from '@/Services/SessionManagementService';
import { convertTo12Hour } from '@/Components/convertTo12Hour';
import EditSessionManagement from './EditSessionManagement';
import AddTopicSessionManagement from './AddTopicSessionManagement';
import EditTopicSessionManagement from './EditTopicSessionManagement';
import DeleteTopicSessionManagement from './DeleteTopicSessionManagement';
import UpdateTopicLinkSessionManagement from './UpdateTopicLinkSessionManagement';
import SendMailSessionManagement from './SendMailSessionManagement';
import { Slide, ToastContainer } from 'react-toastify';
import RecordingLinkSessionManagement from './RecordingLinkSessionManagement';

interface SessionManagementProps {

}

const SessionManagement: React.FC<SessionManagementProps> = () => {

    useEffect(() => {
        GetSessionData();
    }, [])

    const [loading, setLoading] = useState(true);
    const [sessionData, setSessionData] = useState<GetSessionModel[]>([]);
    const [editGroupPopup, setEditGroupPopup] = useState(false);
    const [editGroupDetails, setEditGroupDetails] = useState<EditGroupsDetails>({
        refGId: 0,
        refGName: "",
        refGDescription: "",
    });
    const [addTopicPopup, setAddTopicPopup] = useState(false);
    const [addTopicDetails, setAddTopicDetails] = useState<AddNewTopic>({
        refGId: 0,
        topic: [{
            refCLDate: "",
            refCLName: "",
            refCLFromTime: "",
            refCLToTime: "",
        }]
    });
    const [editTopicPopup, setEditTopicPopup] = useState(false);
    const [editTopicDetails, setEditTopicDetails] = useState<NewTopic>({
        refCLId: 0,
        refCLDate: "",
        refCLName: "",
        refCLFromTime: "",
        refCLToTime: "",
    });
    const [deleteTopicPopup, setDeleteTopicPopup] = useState(false);
    const [deleteTopicDetails, setDeleteTopicDetails] = useState<number>(0);
    const [deleteTopicName, setDeleteTopicName] = useState<string>("");
    const [updateLinkTopicPopup, setUpdateLinkTopicPopup] = useState(false);
    const [updateLinkTopicDetails, setUpdateLinkTopicDetails] = useState<UpdateLinkTopic>({
        refCLId: 0,
        refCLLink: "",
        refCLName: "",
    });
    const [sendMailPopup, setsendMailPopup] = useState(false);
    const [sendMailId, setSendMailId] = useState(0);
    const [refCLId, setRefCLId] = useState(0);
    const [updateRecordTopicPopup, setUpdateRecordTopicPopup] = useState(false);
    const [updateRecordTopicDetails, setUpdateRecordTopicDetails] = useState<UpdateLinkTopic>({
        refCLId: 0,
        refCLRecordingLink: "",
        refCLName: "",
    });

    const GetSessionData = async () => {
        setLoading(true);
        try {
            const response = await SessionManagementService.getSession();
            if (response.status) {
                setSessionData(response.data);
            } else {
                console.error(response.message);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="px-5 py-3 flex flex-col gap-2">
            {loading && <LoadingOverlay />}
            <ToastContainer
                position="top-right"
                autoClose={3000}
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
            <EditSessionManagement
                editGroupPopup={editGroupPopup}
                setEditGroupPopup={setEditGroupPopup}
                editGroupDetails={editGroupDetails}
                setEditGroupDetails={setEditGroupDetails}
                GetSessionData={GetSessionData}
            />
            <AddTopicSessionManagement
                addTopicPopup={addTopicPopup}
                setAddTopicPopup={setAddTopicPopup}
                addTopicDetails={addTopicDetails}
                setAddTopicDetails={setAddTopicDetails}
                GetSessionData={GetSessionData}
            />
            <EditTopicSessionManagement
                editTopicPopup={editTopicPopup}
                setEditTopicPopup={setEditTopicPopup}
                editTopicDetails={editTopicDetails}
                setEditTopicDetails={setEditTopicDetails}
                GetSessionData={GetSessionData}
            />
            <DeleteTopicSessionManagement
                deleteTopicPopup={deleteTopicPopup}
                setDeleteTopicPopup={setDeleteTopicPopup}
                deleteTopicDetails={deleteTopicDetails}
                setDeleteTopicDetails={setDeleteTopicDetails}
                GetSessionData={GetSessionData}
                deleteTopicName={deleteTopicName}
            />
            <UpdateTopicLinkSessionManagement
                updateLinkTopicPopup={updateLinkTopicPopup}
                setUpdateLinkTopicPopup={setUpdateLinkTopicPopup}
                updateLinkTopicDetails={updateLinkTopicDetails}
                setUpdateLinkTopicDetails={setUpdateLinkTopicDetails}
                GetSessionData={GetSessionData}
            />
            <SendMailSessionManagement
                sendMailPopup={sendMailPopup}
                setsendMailPopup={setsendMailPopup}
                sendMailId={sendMailId}
                refCLId={refCLId}
            />
            <RecordingLinkSessionManagement
                updateRecordTopicPopup={updateRecordTopicPopup}
                setUpdateRecordTopicPopup={setUpdateRecordTopicPopup}
                updateRecordTopicDetails={updateRecordTopicDetails}
                setUpdateRecordTopicDetails={setUpdateRecordTopicDetails}
                GetSessionData={GetSessionData}
            />
            <div className="my-3 flex flex-col gap-3">
                <h5>Session Management</h5>
            </div>
            <div className='p-3 md:p-10' style={{
                boxShadow:
                    "inset 7px 7px 7px rgba(153,153,153,0.25), inset -7px -7px 7px rgba(235,235,235,0.25)",
                border: "none",
                borderRadius: 10,
                //   backgroundColor: "#008080",
                //   color: "#fff",
            }}>
                <Accordion>
                    {
                        sessionData.map((data) => (
                            <AccordionTab headerTemplate={
                                () => {
                                    return (
                                        <div className='flex flex-col sm:flex-row gap-x-10 gap-y-2 w-full items-center justify-between'>
                                            <div>
                                                <h6>{data.refCourseName}</h6>
                                                <p>{data.refGName}</p>
                                            </div>
                                            <div className="flex gap-2 justify-start items-center">
                                                <ProgressBar
                                                    style={{ height: "10px" }}
                                                    displayValueTemplate={() => ""}
                                                    className="custom-progressbar w-[80px] sm:w-[150px]"
                                                    value={data.totalClass > 0
                                                        ? (data.attendedClass / data.totalClass) * 100
                                                        : 0}
                                                />
                                                <span>{data.attendedClass} / {data.totalClass}</span>
                                            </div>
                                        </div>
                                    )
                                }
                            }>
                                <div className='flex w-full justify-end'>
                                    <div className='flex gap-3'>
                                        <ButtonsLabel
                                            className="px-10"
                                            variant="primary"
                                            onClick={() => {
                                                setAddTopicPopup(true);
                                                setAddTopicDetails({
                                                    refGId: data.refGId,
                                                    topic: [{
                                                        refCLDate: "",
                                                        refCLName: "",
                                                        refCLFromTime: "",
                                                        refCLToTime: "",
                                                    }]
                                                })
                                            }}
                                        >
                                            Add Topics
                                        </ButtonsLabel>
                                        <ButtonsLabel
                                            className="px-10"
                                            variant="primary"
                                            onClick={() => {
                                                setEditGroupPopup(true);
                                                setEditGroupDetails({
                                                    refGId: data.refGId,
                                                    refGName: data.refGName,
                                                    refGDescription: data.refGDescription,
                                                })
                                            }}
                                        >
                                            Edit Group Details
                                        </ButtonsLabel>
                                    </div>
                                </div>
                                <div className="w-full mt-3">
                                    <div
                                        style={{
                                            boxShadow:
                                                "inset 7px 7px 7px rgba(153,153,153,0.25), inset -7px -7px 7px rgba(235,235,235,0.25)",
                                            border: "none",
                                            borderRadius: 10,
                                            //   backgroundColor: "#008080",
                                            //   color: "#fff",
                                        }}
                                        className="w-12/12 overflow-y-auto p-4 custom-scroll"
                                    >
                                        <DataTable
                                            scrollable
                                            scrollHeight="58vh"
                                            selectionMode="single"
                                            value={data.classes}
                                        >
                                            <Column style={{ width: "20%" }} field="refCLDate" header="Date" />
                                            <Column
                                                style={{ width: "25%" }}
                                                field="refCLName"
                                                header="Topic Name"
                                            />
                                            <Column
                                                style={{ width: "15%" }}
                                                body={(row) => {
                                                    return (
                                                        <>{convertTo12Hour(row.refCLFromTime)}</>
                                                    )
                                                }}
                                                header="From Time"
                                            />
                                            <Column
                                                style={{ width: "15%" }}
                                                body={(row) => {
                                                    return (
                                                        <>{convertTo12Hour(row.refCLToTime)}</>
                                                    )
                                                }}
                                                header="To Time"
                                            />
                                            <Column
                                                style={{ width: "15%" }}
                                                body={(row) => {
                                                    return (
                                                        <>
                                                            <div className='flex gap-2'>
                                                                <Edit onClick={() => {
                                                                    if (row.refCLRecordingLink.length > 0) return;
                                                                    setEditTopicDetails({
                                                                        refCLId: row.refCLId,
                                                                        refCLDate: row.refCLDate,
                                                                        refCLName: row.refCLName,
                                                                        refCLFromTime: row.refCLFromTime,
                                                                        refCLToTime: row.refCLToTime,
                                                                    })
                                                                    setEditTopicPopup(true);
                                                                }} className={` ${(row.refCLRecordingLink.length > 0) ? 'cursor-not-allowed opacity-50' : 'hover:bg-[#c7c7c7]'} rounded-lg p-1`} color='#134686' width={30} height={30} />
                                                                <Trash onClick={() => {
                                                                    if (row.refCLRecordingLink.length > 0) return;
                                                                    setDeleteTopicDetails(row.refCLId)
                                                                    setDeleteTopicName(row.refCLName)
                                                                    setDeleteTopicPopup(true)
                                                                }} className={` ${(row.refCLRecordingLink.length > 0) ? 'cursor-not-allowed opacity-50' : 'hover:bg-[#c7c7c7]'} rounded-lg p-1`} color='#E43636' width={30} height={30} />
                                                                <Link onClick={() => {
                                                                    if (row.refCLRecordingLink.length > 0) return;
                                                                    setUpdateLinkTopicDetails({
                                                                        refCLId: row.refCLId,
                                                                        refCLLink: row.refCLLink,
                                                                        refCLName: row.refCLName,
                                                                    }
                                                                    )
                                                                    setUpdateLinkTopicPopup(true)
                                                                }} className={` ${(row.refCLRecordingLink.length > 0) ? 'cursor-not-allowed opacity-50' : 'hover:bg-[#c7c7c7]'} rounded-lg p-1`} color='#0046FF' width={30} height={30} />
                                                                <Send onClick={() => {
                                                                    if (row.refCLLink.length === 0) return;
                                                                    if (row.refCLRecordingLink.length > 0) return;
                                                                    setSendMailId(data.refGId);
                                                                    setsendMailPopup(true)
                                                                    setRefCLId(row.refCLId)
                                                                }} className={` ${(row.refCLLink.length === 0 || row.refCLRecordingLink.length > 0) ? 'cursor-not-allowed opacity-50' : 'hover:bg-[#c7c7c7]'} rounded-lg p-1`} color='#008080' width={30} height={30} />
                                                                <Video onClick={() => {
                                                                    setUpdateRecordTopicPopup(true);
                                                                    setUpdateRecordTopicDetails({
                                                                        refCLId: row.refCLId,
                                                                        refCLRecordingLink: row.refCLRecordingLink,
                                                                        refCLName: row.refCLName,
                                                                    })
                                                                }} className='hover:bg-[#c7c7c7] rounded-lg p-1' color='#FE7743' width={30} height={30} />
                                                            </div>
                                                        </>
                                                    )
                                                }}
                                                header="Actions"
                                            />
                                        </DataTable>
                                    </div>
                                </div>
                            </AccordionTab>
                        ))
                    }
                </Accordion>
            </div>
        </div>
    );
};

export default SessionManagement;