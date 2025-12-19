export interface TimeOffRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'vacation' | 'sick' | 'personal';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  submittedDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  title: string;
  manager: string;
  phone: string;
  hireDate: string;
}

// Initialize sample data
const initializeData = () => {
  if (!localStorage.getItem('hr_requests')) {
    const sampleRequests: TimeOffRequest[] = [
      {
        id: '1',
        employeeId: 'emp-1',
        employeeName: 'John Martinez',
        type: 'vacation',
        startDate: '2025-11-15',
        endDate: '2025-11-19',
        days: 5,
        reason: 'Family vacation',
        status: 'pending',
        submittedDate: '2025-10-01',
      },
      {
        id: '2',
        employeeId: 'emp-1',
        employeeName: 'John Martinez',
        type: 'sick',
        startDate: '2025-09-12',
        endDate: '2025-09-12',
        days: 1,
        reason: 'Medical appointment',
        status: 'approved',
        submittedDate: '2025-09-10',
        reviewedBy: 'HR Admin',
        reviewedDate: '2025-09-11',
      },
    ];
    localStorage.setItem('hr_requests', JSON.stringify(sampleRequests));
  }

  if (!localStorage.getItem('hr_announcements')) {
    const sampleAnnouncements: Announcement[] = [
      {
        id: '1',
        title: 'Holiday Schedule 2025',
        content: 'Please review the updated holiday schedule for the remainder of 2025. Thanksgiving: Nov 27-28, Christmas: Dec 25-26, New Year: Jan 1.',
        author: 'HR Admin',
        date: '2025-10-01',
        priority: 'high',
      },
      {
        id: '2',
        title: 'Open Enrollment Period',
        content: 'Open enrollment for health benefits begins November 1st and ends November 30th. Please review your benefits and make any necessary changes.',
        author: 'HR Admin',
        date: '2025-09-28',
        priority: 'high',
      },
      {
        id: '3',
        title: 'Employee Wellness Program',
        content: 'Join our new wellness program! Free fitness classes available every Tuesday and Thursday at 5 PM in Conference Room A.',
        author: 'HR Admin',
        date: '2025-09-20',
        priority: 'medium',
      },
    ];
    localStorage.setItem('hr_announcements', JSON.stringify(sampleAnnouncements));
  }

  if (!localStorage.getItem('hr_employees')) {
    const sampleEmployees: Employee[] = [
      {
        id: 'emp-1',
        name: 'John Martinez',
        email: 'john.martinez@lacounty.gov',
        department: 'Public Works',
        title: 'Senior Engineer',
        manager: 'Sarah Chen',
        phone: '(213) 555-0123',
        hireDate: '2018-03-15',
      },
      {
        id: 'emp-2',
        name: 'Sarah Chen',
        email: 'sarah.chen@lacounty.gov',
        department: 'Public Works',
        title: 'Engineering Manager',
        manager: 'Robert Kim',
        phone: '(213) 555-0124',
        hireDate: '2015-06-01',
      },
      {
        id: 'emp-3',
        name: 'Michael Johnson',
        email: 'michael.johnson@lacounty.gov',
        department: 'Finance',
        title: 'Budget Analyst',
        manager: 'Lisa Wong',
        phone: '(213) 555-0125',
        hireDate: '2019-09-10',
      },
      {
        id: 'emp-4',
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@lacounty.gov',
        department: 'IT Services',
        title: 'Systems Administrator',
        manager: 'David Lee',
        phone: '(213) 555-0126',
        hireDate: '2020-01-20',
      },
      {
        id: 'emp-5',
        name: 'David Lee',
        email: 'david.lee@lacounty.gov',
        department: 'IT Services',
        title: 'IT Director',
        manager: 'Chief Information Officer',
        phone: '(213) 555-0127',
        hireDate: '2012-04-15',
      },
    ];
    localStorage.setItem('hr_employees', JSON.stringify(sampleEmployees));
  }
};

// Requests
export const getRequests = (): TimeOffRequest[] => {
  initializeData();
  return JSON.parse(localStorage.getItem('hr_requests') || '[]');
};

export const saveRequest = (request: TimeOffRequest) => {
  const requests = getRequests();
  const index = requests.findIndex(r => r.id === request.id);
  if (index >= 0) {
    requests[index] = request;
  } else {
    requests.push(request);
  }
  localStorage.setItem('hr_requests', JSON.stringify(requests));
};

export const deleteRequest = (id: string) => {
  const requests = getRequests().filter(r => r.id !== id);
  localStorage.setItem('hr_requests', JSON.stringify(requests));
};

// Announcements
export const getAnnouncements = (): Announcement[] => {
  initializeData();
  return JSON.parse(localStorage.getItem('hr_announcements') || '[]');
};

export const saveAnnouncement = (announcement: Announcement) => {
  const announcements = getAnnouncements();
  const index = announcements.findIndex(a => a.id === announcement.id);
  if (index >= 0) {
    announcements[index] = announcement;
  } else {
    announcements.push(announcement);
  }
  localStorage.setItem('hr_announcements', JSON.stringify(announcements));
};

export const deleteAnnouncement = (id: string) => {
  const announcements = getAnnouncements().filter(a => a.id !== id);
  localStorage.setItem('hr_announcements', JSON.stringify(announcements));
};

// Employees
export const getEmployees = (): Employee[] => {
  initializeData();
  return JSON.parse(localStorage.getItem('hr_employees') || '[]');
};
