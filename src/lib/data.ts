export interface UserProfile {
  fullName: string;
  age: number;
  institute: string;
  department: string;
  semester: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Subject {
  name: string;
  icon: string;
  color: string;
}

export const DEPARTMENTS = [
  'Information Technology',
  'Computer Science',
  'Mechanical Engineering',
  'Civil Engineering',
  'E&TC',
  'Electrical Engineering',
  'Chemical Engineering',
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const SUBJECT_DATA: Record<string, Record<number, Subject[]>> = {
  'Information Technology': {
    1: [
      { name: 'Engineering Mathematics I', icon: '📐', color: 'from-blue-500 to-cyan-500' },
      { name: 'Engineering Physics', icon: '⚡', color: 'from-purple-500 to-pink-500' },
      { name: 'Basic Electrical Engineering', icon: '🔌', color: 'from-yellow-500 to-orange-500' },
      { name: 'Engineering Mechanics', icon: '⚙️', color: 'from-green-500 to-teal-500' },
    ],
    2: [
      { name: 'Data Structures', icon: '🌳', color: 'from-blue-500 to-indigo-500' },
      { name: 'Object Oriented Programming', icon: '💻', color: 'from-violet-500 to-purple-500' },
      { name: 'Engineering Mathematics III', icon: '📊', color: 'from-cyan-500 to-blue-500' },
      { name: 'Digital Logic Design', icon: '🔢', color: 'from-rose-500 to-pink-500' },
    ],
    3: [
      { name: 'Database Management Systems', icon: '🗄️', color: 'from-emerald-500 to-green-500' },
      { name: 'Computer Networks', icon: '🌐', color: 'from-blue-500 to-sky-500' },
      { name: 'Operating Systems', icon: '🖥️', color: 'from-orange-500 to-amber-500' },
      { name: 'Software Engineering', icon: '🛠️', color: 'from-purple-500 to-violet-500' },
    ],
    4: [
      { name: 'Web Technologies', icon: '🌍', color: 'from-pink-500 to-rose-500' },
      { name: 'Theory of Computation', icon: '🧮', color: 'from-indigo-500 to-blue-500' },
      { name: 'Machine Learning', icon: '🤖', color: 'from-teal-500 to-cyan-500' },
      { name: 'Information Security', icon: '🔒', color: 'from-red-500 to-orange-500' },
    ],
  },
  'Computer Science': {
    1: [
      { name: 'Engineering Mathematics I', icon: '📐', color: 'from-blue-500 to-cyan-500' },
      { name: 'Engineering Physics', icon: '⚡', color: 'from-purple-500 to-pink-500' },
      { name: 'Programming Fundamentals', icon: '💻', color: 'from-green-500 to-teal-500' },
      { name: 'Engineering Chemistry', icon: '🧪', color: 'from-yellow-500 to-orange-500' },
    ],
    2: [
      { name: 'Data Structures & Algorithms', icon: '🌳', color: 'from-blue-500 to-indigo-500' },
      { name: 'OOP with Java', icon: '☕', color: 'from-violet-500 to-purple-500' },
      { name: 'Discrete Mathematics', icon: '📊', color: 'from-cyan-500 to-blue-500' },
      { name: 'Digital Electronics', icon: '🔢', color: 'from-rose-500 to-pink-500' },
    ],
  },
  'Mechanical Engineering': {
    2: [
      { name: 'Thermodynamics', icon: '🔥', color: 'from-orange-500 to-red-500' },
      { name: 'Fluid Mechanics', icon: '💧', color: 'from-blue-500 to-cyan-500' },
      { name: 'Strength of Materials', icon: '🏗️', color: 'from-gray-500 to-slate-500' },
      { name: 'Manufacturing Processes', icon: '🏭', color: 'from-green-500 to-emerald-500' },
    ],
  },
};

export function getSubjects(department: string, semester: number): Subject[] {
  const deptData = SUBJECT_DATA[department];
  if (!deptData) {
    return [
      { name: 'Subject 1', icon: '📘', color: 'from-blue-500 to-indigo-500' },
      { name: 'Subject 2', icon: '📗', color: 'from-green-500 to-teal-500' },
      { name: 'Subject 3', icon: '📙', color: 'from-orange-500 to-amber-500' },
      { name: 'Subject 4', icon: '📕', color: 'from-red-500 to-rose-500' },
    ];
  }
  return deptData[semester] || [
    { name: 'Subject 1', icon: '📘', color: 'from-blue-500 to-indigo-500' },
    { name: 'Subject 2', icon: '📗', color: 'from-green-500 to-teal-500' },
    { name: 'Subject 3', icon: '📙', color: 'from-orange-500 to-amber-500' },
    { name: 'Subject 4', icon: '📕', color: 'from-red-500 to-rose-500' },
  ];
}
