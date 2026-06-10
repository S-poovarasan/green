import LoadingOverlay from '@/Components/Loading/Loading';
import { TabPanel, TabView } from 'primereact/tabview';
import React, { useState } from 'react';
import TimeAttendancePermission from './TimeAttendancePermission';
import LeavePermission from './LeavePermission';
import { Slide, ToastContainer } from 'react-toastify';
import PermissionRequest from './PermissionRequest';

interface PermissionProps {

}

const Permission: React.FC<PermissionProps> = () => {
    const [loading, setLoading] = useState(false);

    return (
        <div className="px-5 pt-3 flex flex-col gap-2">
            <ToastContainer
                position="top-right"
                autoClose={2000}
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
            {loading && <LoadingOverlay />}
            <div className="my-3">
                <h5>Permission Details</h5>
            </div>
            <TabView>
                <TabPanel
                    className="font-semibold text-xl text-[#000]"
                    header="Time & Attendance"
                >
                    <TimeAttendancePermission setLoading={setLoading} />
                </TabPanel>
                <TabPanel
                    className="font-semibold text-xl text-[#000]"
                    header="Leave Application"
                >
                    <LeavePermission setLoading={setLoading} />
                </TabPanel>
                <TabPanel
                    className="font-semibold text-xl text-[#000]"
                    header="Permission Request"
                >
                    <PermissionRequest setLoading={setLoading} />
                </TabPanel>
            </TabView>
        </div>
    );
};

export default Permission;