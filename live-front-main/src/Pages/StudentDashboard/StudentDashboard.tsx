import React, { useEffect, useState } from 'react';
import { useAuth } from '../Routes/AuthContext';
import type { getStudentCourseData } from '@/Interfaces/StudentDashboardInterface';
import { StudentDashboardService } from '@/Services/StudentDashboardService';
import LoadingOverlay from '@/Components/Loading/Loading';
import { useNavigate } from 'react-router-dom';

interface StudentDashboardProps {

}

const StudentDashboard: React.FC<StudentDashboardProps> = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<getStudentCourseData[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserDetails();
    }, [])

    const fetchUserDetails = async () => {
        setLoading(true);
        try {
            const response = await StudentDashboardService.getGroups();
            if (response.status) {
                setData(response.data);
            } else {
                console.error(response.message)
            }

        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }
    return (
        <div className="px-5 pt-3 flex flex-col gap-2">
            {loading && <LoadingOverlay />}
            <div className='font-bold text-[1.3rem] md:text-[2rem] lg:text-[2.5rem]'>
                Hello👋, {user?.refUserName}
            </div>
            <h6 className='underline mt-1 text-[#4c4d4e]'>Your Courses</h6>
            <div className='my-3 flex flex-wrap justify-center md:justify-start gap-10'>
                {
                    data.map((row) => (
                        <div className="flex gap-2 flex-col items-center" onClick={() => {
                            navigate("/student/course", {
                                state: {
                                    refHGId: row.refHGId,
                                    refCourseName: row.refCourseName,
                                    refGName: row.refGName,
                                }
                            })
                        }}>
                            <div
                                style={{
                                    boxShadow:
                                        "inset 7px 7px 7px rgba(153,153,153,0.25), inset -7px -7px 7px rgba(235,235,235,0.25)",
                                    borderRadius: 10,
                                    backgroundColor: "#00808054",
                                }}
                                className="
                            w-[200px] h-[150px]
                            cursor-pointer
                            flex items-center justify-center
                            transition-all duration-300 ease-in-out
                            hover:scale-105
                        "
                            >
                                <div
                                    className="
                                text-[#1e8585]
                                text-[8rem]
                                transition-all duration-300 ease-in-out
                                group-hover:text-[10rem]
                            "
                                >
                                    {row.refCourseName.charAt(0)}
                                </div>
                            </div>

                            <p className="text-normal font-semibold text-center w-[200px] cursor-pointer hover:underline">
                                {row.refCourseName}
                                <p className="text-normal font-bold text-center w-[200px] cursor-pointer">
                                    {row.refGName}
                                </p>
                            </p>
                        </div>
                    ))
                }

            </div>
        </div>
    );
};

export default StudentDashboard;