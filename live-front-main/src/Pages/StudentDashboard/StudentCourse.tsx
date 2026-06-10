import LoadingOverlay from '@/Components/Loading/Loading';
import type { getStudentCourseData } from '@/Interfaces/StudentDashboardInterface';
import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface StudentCourseProps {

}

const StudentCourse: React.FC<StudentCourseProps> = () => {
    const navigate = useNavigate();
    const location = useLocation().state as getStudentCourseData;
    const [loading] = useState(false);

    return (
        <div className="px-5 pt-3 flex flex-col gap-2">
            {loading && <LoadingOverlay />}
            <div className='font-bold text-[1rem] md:text-[1.5rem] lg:text-[2rem] flex gap-4 items-center'>
                <ArrowLeft className='cursor-pointer bg-[#fff] w-[35px] h-[35px] p-1 rounded-full hover:bg-[#d3d3d3]' onClick={() => {
                    navigate(-1);
                }} /> {location?.refCourseName}&nbsp;-&nbsp;{location.refGName}
            </div>
            StudentCourse Component {location?.refGName}
        </div>
    );
};

export default StudentCourse;