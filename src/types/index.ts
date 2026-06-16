export interface Student {
  id: string;
  cnie: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  credits: number;
}

export interface Enrollment {
  enrollmentId: string;
  studentCnie: string;
  studentName: string;
  courseName: string;
  enrollmentDate: string;
  deletable: boolean;
}

export interface ApiError {
  message: string;
  status: number;
}
