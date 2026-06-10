export interface SubTrainerReportFormData {
    date: string;
    summary: string;
    solutions: string;
    goals: string;
    documents: ReportDocuments[];
}

export interface ReportDocuments {
    name: string;
    url: string;
}

export interface SubmitReponse {
    status: boolean;
    message: string;
}

export interface DocumentData {
    refRPDName: string;
    refRPDUrl: string;
}

export interface SubmitReportData {
    refRPId: number;
    refUserId: number;
    refRPDate: string;
    refRPSummary: string;
    refRPSolutions: string;
    refRPGoal: string;
    refRPStatus: string;
    refRPApprovedBy: string;
    refRPCreatedAt: string;
    refRTName: string;
    documents: DocumentData[];
}

export interface SubmitReportRes {
    status: boolean;
    message: string;
    reportData: SubmitReportData[];
}
