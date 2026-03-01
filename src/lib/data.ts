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
  'Computer Engineering',
  'Mechanical Engineering',
  'Electronics & Telecommunication',
  'Electrical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

// Semesters 1 & 2 are common for all branches (First Year Engineering)
const FIRST_YEAR_COMMON: Record<number, Subject[]> = {
  1: [
    { name: 'Engineering Mathematics I', icon: '📐', color: 'from-blue-500 to-cyan-500' },
    { name: 'Engineering Physics / Chemistry', icon: '⚗️', color: 'from-purple-500 to-pink-500' },
    { name: 'Programming & Problem Solving', icon: '💻', color: 'from-green-500 to-teal-500' },
    { name: 'Basic Electrical Engineering', icon: '🔌', color: 'from-yellow-500 to-orange-500' },
    { name: 'Engineering Graphics', icon: '📏', color: 'from-indigo-500 to-blue-500' },
    { name: 'Communication Skills', icon: '🗣️', color: 'from-rose-500 to-pink-500' },
    { name: 'Environmental Studies', icon: '🌿', color: 'from-emerald-500 to-green-500' },
  ],
  2: [
    { name: 'Engineering Mathematics II', icon: '📐', color: 'from-blue-500 to-indigo-500' },
    { name: 'Engineering Chemistry / Physics', icon: '🧪', color: 'from-purple-500 to-violet-500' },
    { name: 'Basic Electronics Engineering', icon: '🔋', color: 'from-yellow-500 to-amber-500' },
    { name: 'Engineering Mechanics', icon: '⚙️', color: 'from-orange-500 to-red-500' },
    { name: 'OOP / Programming in C', icon: '💻', color: 'from-cyan-500 to-blue-500' },
    { name: 'Workshop / Project Based Learning', icon: '🛠️', color: 'from-green-500 to-emerald-500' },
  ],
};

export const SUBJECT_DATA: Record<string, Record<number, Subject[]>> = {

  // ─────────────────────────────────────────
  // INFORMATION TECHNOLOGY
  // ─────────────────────────────────────────
  'Information Technology': {
    ...FIRST_YEAR_COMMON,
    3: [
      { name: 'Discrete Structures', icon: '🔣', color: 'from-blue-500 to-indigo-500' },
      { name: 'Data Structures', icon: '🌳', color: 'from-green-500 to-teal-500' },
      { name: 'Computer Organization', icon: '🖥️', color: 'from-orange-500 to-amber-500' },
      { name: 'OOP using Java', icon: '☕', color: 'from-violet-500 to-purple-500' },
      { name: 'Digital Electronics', icon: '🔢', color: 'from-rose-500 to-pink-500' },
    ],
    4: [
      { name: 'Engineering Mathematics III', icon: '📊', color: 'from-blue-500 to-cyan-500' },
      { name: 'Operating Systems', icon: '🖥️', color: 'from-orange-500 to-amber-500' },
      { name: 'Database Management Systems', icon: '🗄️', color: 'from-emerald-500 to-green-500' },
      { name: 'Computer Networks', icon: '🌐', color: 'from-sky-500 to-blue-500' },
      { name: 'Theory of Computation', icon: '🧮', color: 'from-indigo-500 to-violet-500' },
    ],
    5: [
      { name: 'Software Engineering', icon: '🛠️', color: 'from-purple-500 to-violet-500' },
      { name: 'Web Technologies', icon: '🌍', color: 'from-pink-500 to-rose-500' },
      { name: 'Information Security', icon: '🔒', color: 'from-red-500 to-orange-500' },
      { name: 'Data Analytics', icon: '📈', color: 'from-teal-500 to-cyan-500' },
      { name: 'Elective I', icon: '📚', color: 'from-gray-500 to-slate-500' },
    ],
    6: [
      { name: 'Artificial Intelligence', icon: '🤖', color: 'from-violet-500 to-purple-500' },
      { name: 'Cloud Computing', icon: '☁️', color: 'from-sky-500 to-blue-500' },
      { name: 'Big Data Analytics', icon: '📊', color: 'from-emerald-500 to-teal-500' },
      { name: 'Mobile Computing', icon: '📱', color: 'from-orange-500 to-amber-500' },
      { name: 'Elective II', icon: '📚', color: 'from-gray-500 to-slate-500' },
    ],
    7: [
      { name: 'Machine Learning', icon: '🧠', color: 'from-blue-500 to-indigo-500' },
      { name: 'DevOps', icon: '🔄', color: 'from-green-500 to-teal-500' },
      { name: 'IoT', icon: '📡', color: 'from-yellow-500 to-orange-500' },
      { name: 'Project Phase I', icon: '🚀', color: 'from-rose-500 to-pink-500' },
    ],
    8: [
      { name: 'Advanced Elective', icon: '🎓', color: 'from-purple-500 to-violet-500' },
      { name: 'Project Phase II', icon: '🏆', color: 'from-amber-500 to-yellow-500' },
      { name: 'Internship', icon: '💼', color: 'from-teal-500 to-cyan-500' },
    ],
  },

  // ─────────────────────────────────────────
  // COMPUTER ENGINEERING
  // ─────────────────────────────────────────
  'Computer Engineering': {
    ...FIRST_YEAR_COMMON,
    3: [
      { name: 'Discrete Mathematics', icon: '🔣', color: 'from-blue-500 to-indigo-500' },
      { name: 'Data Structures & Algorithms', icon: '🌳', color: 'from-green-500 to-teal-500' },
      { name: 'Object Oriented Programming', icon: '💻', color: 'from-violet-500 to-purple-500' },
      { name: 'Digital Electronics & Logic Design', icon: '🔢', color: 'from-rose-500 to-pink-500' },
      { name: 'Computer Graphics', icon: '🎨', color: 'from-orange-500 to-amber-500' },
    ],
    4: [
      { name: 'Engineering Mathematics III', icon: '📊', color: 'from-blue-500 to-cyan-500' },
      { name: 'Microprocessors', icon: '🔬', color: 'from-yellow-500 to-orange-500' },
      { name: 'Software Engineering', icon: '🛠️', color: 'from-purple-500 to-violet-500' },
      { name: 'Principles of Programming Languages', icon: '📝', color: 'from-teal-500 to-cyan-500' },
      { name: 'Data Structures (Advanced)', icon: '🌲', color: 'from-emerald-500 to-green-500' },
    ],
    5: [
      { name: 'Theory of Computation', icon: '🧮', color: 'from-indigo-500 to-blue-500' },
      { name: 'Database Management Systems', icon: '🗄️', color: 'from-emerald-500 to-green-500' },
      { name: 'Systems Programming & OS', icon: '🖥️', color: 'from-orange-500 to-amber-500' },
      { name: 'Computer Networks I', icon: '🌐', color: 'from-sky-500 to-blue-500' },
      { name: 'Elective I', icon: '📚', color: 'from-gray-500 to-slate-500' },
    ],
    6: [
      { name: 'Artificial Intelligence', icon: '🤖', color: 'from-violet-500 to-purple-500' },
      { name: 'Web Technology', icon: '🌍', color: 'from-pink-500 to-rose-500' },
      { name: 'Data Science & Big Data Analytics', icon: '📊', color: 'from-teal-500 to-cyan-500' },
      { name: 'Computer Networks II', icon: '🌐', color: 'from-blue-500 to-indigo-500' },
      { name: 'Elective II', icon: '📚', color: 'from-gray-500 to-slate-500' },
    ],
    7: [
      { name: 'Machine Learning', icon: '🧠', color: 'from-blue-500 to-indigo-500' },
      { name: 'Cloud Computing', icon: '☁️', color: 'from-sky-500 to-blue-500' },
      { name: 'Information & Cyber Security', icon: '🔒', color: 'from-red-500 to-orange-500' },
      { name: 'Elective III', icon: '📚', color: 'from-gray-500 to-slate-500' },
      { name: 'Project Phase I', icon: '🚀', color: 'from-rose-500 to-pink-500' },
    ],
    8: [
      { name: 'Deep Learning / Advanced ML (Elective)', icon: '🧬', color: 'from-purple-500 to-violet-500' },
      { name: 'Blockchain / IoT (Elective)', icon: '⛓️', color: 'from-amber-500 to-yellow-500' },
      { name: 'Project Phase II', icon: '🏆', color: 'from-green-500 to-emerald-500' },
      { name: 'Internship / Seminar', icon: '💼', color: 'from-teal-500 to-cyan-500' },
    ],
  },

  // ─────────────────────────────────────────
  // MECHANICAL ENGINEERING
  // ─────────────────────────────────────────
  'Mechanical Engineering': {
    ...FIRST_YEAR_COMMON,
    3: [
      { name: 'Engineering Mathematics III', icon: '📐', color: 'from-blue-500 to-cyan-500' },
      { name: 'Engineering Mechanics', icon: '⚙️', color: 'from-gray-500 to-slate-500' },
      { name: 'Strength of Materials', icon: '🏗️', color: 'from-orange-500 to-amber-500' },
      { name: 'Thermodynamics', icon: '🔥', color: 'from-red-500 to-orange-500' },
      { name: 'Material Science', icon: '🧱', color: 'from-teal-500 to-cyan-500' },
    ],
    4: [
      { name: 'Fluid Mechanics', icon: '💧', color: 'from-blue-500 to-sky-500' },
      { name: 'Theory of Machines', icon: '⚙️', color: 'from-gray-500 to-zinc-500' },
      { name: 'Manufacturing Processes', icon: '🏭', color: 'from-green-500 to-emerald-500' },
      { name: 'Heat Transfer', icon: '🌡️', color: 'from-orange-500 to-red-500' },
      { name: 'Electrical & Electronics Engg.', icon: '🔌', color: 'from-yellow-500 to-amber-500' },
    ],
    5: [
      { name: 'Design of Machine Elements I', icon: '🔩', color: 'from-indigo-500 to-blue-500' },
      { name: 'Industrial Engineering', icon: '🏢', color: 'from-purple-500 to-violet-500' },
      { name: 'Dynamics of Machinery', icon: '🔄', color: 'from-cyan-500 to-teal-500' },
      { name: 'Metrology & Quality Control', icon: '📏', color: 'from-rose-500 to-pink-500' },
      { name: 'Elective I', icon: '📚', color: 'from-gray-500 to-slate-500' },
    ],
    6: [
      { name: 'Design of Machine Elements II', icon: '🔧', color: 'from-blue-500 to-indigo-500' },
      { name: 'Refrigeration & Air Conditioning', icon: '❄️', color: 'from-sky-500 to-blue-500' },
      { name: 'Automobile Engineering', icon: '🚗', color: 'from-orange-500 to-amber-500' },
      { name: 'Finite Element Analysis', icon: '📐', color: 'from-violet-500 to-purple-500' },
      { name: 'Elective II', icon: '📚', color: 'from-gray-500 to-slate-500' },
    ],
    7: [
      { name: 'CAD/CAM & Automation', icon: '🤖', color: 'from-green-500 to-teal-500' },
      { name: 'Mechatronics', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
      { name: 'Power Plant Engineering', icon: '🏭', color: 'from-red-500 to-rose-500' },
      { name: 'Elective III', icon: '📚', color: 'from-gray-500 to-slate-500' },
      { name: 'Project Phase I', icon: '🚀', color: 'from-purple-500 to-violet-500' },
    ],
    8: [
      { name: 'Advanced Manufacturing (Elective)', icon: '🏗️', color: 'from-emerald-500 to-green-500' },
      { name: 'Robotics / Renewable Energy (Elective)', icon: '🤖', color: 'from-cyan-500 to-sky-500' },
      { name: 'Project Phase II', icon: '🏆', color: 'from-amber-500 to-yellow-500' },
      { name: 'Internship', icon: '💼', color: 'from-indigo-500 to-blue-500' },
    ],
  },

  // ─────────────────────────────────────────
  // ELECTRONICS & TELECOMMUNICATION
  // ─────────────────────────────────────────
  'Electronics & Telecommunication': {
    ...FIRST_YEAR_COMMON,
    3: [
      { name: 'Engineering Mathematics III', icon: '📐', color: 'from-blue-500 to-cyan-500' },
      { name: 'Electronic Devices & Circuits', icon: '🔬', color: 'from-purple-500 to-violet-500' },
      { name: 'Digital Electronics', icon: '🔢', color: 'from-rose-500 to-pink-500' },
      { name: 'Electrical Circuits', icon: '⚡', color: 'from-yellow-500 to-amber-500' },
      { name: 'Data Structures', icon: '🌳', color: 'from-green-500 to-teal-500' },
    ],
    4: [
      { name: 'Signals & Systems', icon: '📡', color: 'from-sky-500 to-blue-500' },
      { name: 'Control Systems', icon: '🎛️', color: 'from-orange-500 to-amber-500' },
      { name: 'Microprocessors', icon: '💾', color: 'from-indigo-500 to-violet-500' },
      { name: 'Principles of Communication', icon: '📻', color: 'from-teal-500 to-cyan-500' },
      { name: 'OOP', icon: '💻', color: 'from-green-500 to-emerald-500' },
    ],
    5: [
      { name: 'Digital Communication', icon: '📶', color: 'from-blue-500 to-indigo-500' },
      { name: 'Digital Signal Processing', icon: '🔊', color: 'from-purple-500 to-violet-500' },
      { name: 'Electromagnetics', icon: '🧲', color: 'from-red-500 to-orange-500' },
      { name: 'Microcontrollers', icon: '🖥️', color: 'from-teal-500 to-green-500' },
      { name: 'Elective I', icon: '📚', color: 'from-gray-500 to-slate-500' },
    ],
    6: [
      { name: 'VLSI Design', icon: '🔭', color: 'from-violet-500 to-purple-500' },
      { name: 'Embedded Systems', icon: '⚙️', color: 'from-orange-500 to-amber-500' },
      { name: 'Wireless Communication', icon: '📡', color: 'from-sky-500 to-blue-500' },
      { name: 'Computer Networks', icon: '🌐', color: 'from-emerald-500 to-teal-500' },
      { name: 'Elective II', icon: '📚', color: 'from-gray-500 to-slate-500' },
    ],
    7: [
      { name: 'Microwave Engineering', icon: '📻', color: 'from-yellow-500 to-orange-500' },
      { name: 'Optical Communication', icon: '🔦', color: 'from-cyan-500 to-sky-500' },
      { name: 'Elective III', icon: '📚', color: 'from-gray-500 to-slate-500' },
      { name: 'Project Phase I', icon: '🚀', color: 'from-rose-500 to-pink-500' },
    ],
    8: [
      { name: 'Advanced Communication Systems', icon: '📡', color: 'from-blue-500 to-indigo-500' },
      { name: 'Project Phase II', icon: '🏆', color: 'from-amber-500 to-yellow-500' },
      { name: 'Internship', icon: '💼', color: 'from-teal-500 to-cyan-500' },
    ],
  },

  // ─────────────────────────────────────────
  // ELECTRICAL ENGINEERING
  // ─────────────────────────────────────────
  'Electrical Engineering': {
    ...FIRST_YEAR_COMMON,
    3: [
      { name: 'Engineering Mathematics III', icon: '📐', color: 'from-blue-500 to-cyan-500' },
      { name: 'Electrical Machines I', icon: '⚡', color: 'from-yellow-500 to-amber-500' },
      { name: 'Network Analysis', icon: '🔗', color: 'from-purple-500 to-violet-500' },
      { name: 'Analog & Digital Electronics', icon: '🔢', color: 'from-rose-500 to-pink-500' },
      { name: 'Power Generation', icon: '🏭', color: 'from-green-500 to-emerald-500' },
    ],
    4: [
      { name: 'Electrical Machines II', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
      { name: 'Power Systems I', icon: '🔋', color: 'from-blue-500 to-indigo-500' },
      { name: 'Control Systems', icon: '🎛️', color: 'from-teal-500 to-cyan-500' },
      { name: 'Microcontrollers', icon: '💾', color: 'from-violet-500 to-purple-500' },
      { name: 'Numerical Methods', icon: '🧮', color: 'from-orange-500 to-amber-500' },
    ],
    5: [
      { name: 'Power Electronics', icon: '⚡', color: 'from-red-500 to-orange-500' },
      { name: 'Power Systems II', icon: '🔌', color: 'from-blue-500 to-sky-500' },
      { name: 'Electrical Drives', icon: '🔄', color: 'from-green-500 to-teal-500' },
      { name: 'Measurement & Instrumentation', icon: '📏', color: 'from-indigo-500 to-blue-500' },
      { name: 'Elective I', icon: '📚', color: 'from-gray-500 to-slate-500' },
    ],
    6: [
      { name: 'High Voltage Engineering', icon: '⚡', color: 'from-yellow-500 to-amber-500' },
      { name: 'Switchgear & Protection', icon: '🛡️', color: 'from-purple-500 to-violet-500' },
      { name: 'Renewable Energy Systems', icon: '☀️', color: 'from-emerald-500 to-green-500' },
      { name: 'Elective II', icon: '📚', color: 'from-gray-500 to-slate-500' },
    ],
    7: [
      { name: 'Smart Grid', icon: '🔋', color: 'from-cyan-500 to-blue-500' },
      { name: 'Industrial Automation', icon: '🤖', color: 'from-orange-500 to-amber-500' },
      { name: 'Project Phase I', icon: '🚀', color: 'from-rose-500 to-pink-500' },
    ],
    8: [
      { name: 'Advanced Electrical Systems', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
      { name: 'Project Phase II', icon: '🏆', color: 'from-green-500 to-emerald-500' },
      { name: 'Internship', icon: '💼', color: 'from-teal-500 to-cyan-500' },
    ],
  },

  // ─────────────────────────────────────────
  // CIVIL ENGINEERING
  // ─────────────────────────────────────────
  'Civil Engineering': {
    ...FIRST_YEAR_COMMON,
    3: [
      { name: 'Engineering Mathematics III', icon: '📐', color: 'from-blue-500 to-cyan-500' },
      { name: 'Strength of Materials', icon: '🏗️', color: 'from-orange-500 to-amber-500' },
      { name: 'Fluid Mechanics', icon: '💧', color: 'from-sky-500 to-blue-500' },
      { name: 'Surveying I', icon: '🗺️', color: 'from-green-500 to-teal-500' },
      { name: 'Building Materials & Construction', icon: '🧱', color: 'from-yellow-500 to-orange-500' },
    ],
    4: [
      { name: 'Structural Analysis I', icon: '🏛️', color: 'from-indigo-500 to-blue-500' },
      { name: 'Geotechnical Engineering I', icon: '⛏️', color: 'from-amber-500 to-yellow-500' },
      { name: 'Hydraulics & Hydraulic Machines', icon: '💧', color: 'from-cyan-500 to-sky-500' },
      { name: 'Surveying II', icon: '🗺️', color: 'from-emerald-500 to-green-500' },
      { name: 'Concrete Technology', icon: '🏗️', color: 'from-gray-500 to-slate-500' },
    ],
    5: [
      { name: 'Structural Analysis II', icon: '🏛️', color: 'from-blue-500 to-indigo-500' },
      { name: 'Geotechnical Engineering II', icon: '⛏️', color: 'from-yellow-500 to-amber-500' },
      { name: 'Transportation Engineering I', icon: '🛣️', color: 'from-purple-500 to-violet-500' },
      { name: 'Water Resources Engineering', icon: '🌊', color: 'from-sky-500 to-cyan-500' },
      { name: 'Elective I', icon: '📚', color: 'from-gray-500 to-slate-500' },
    ],
    6: [
      { name: 'Design of RCC Structures', icon: '🏢', color: 'from-rose-500 to-pink-500' },
      { name: 'Transportation Engineering II', icon: '🛣️', color: 'from-orange-500 to-amber-500' },
      { name: 'Environmental Engineering', icon: '🌿', color: 'from-emerald-500 to-green-500' },
      { name: 'Quantity Surveying & Estimation', icon: '📋', color: 'from-teal-500 to-cyan-500' },
      { name: 'Elective II', icon: '📚', color: 'from-gray-500 to-slate-500' },
    ],
    7: [
      { name: 'Design of Steel Structures', icon: '🔩', color: 'from-zinc-500 to-gray-500' },
      { name: 'Construction Management', icon: '🏗️', color: 'from-blue-500 to-indigo-500' },
      { name: 'Irrigation Engineering', icon: '🌾', color: 'from-green-500 to-teal-500' },
      { name: 'Elective III', icon: '📚', color: 'from-gray-500 to-slate-500' },
      { name: 'Project Phase I', icon: '🚀', color: 'from-rose-500 to-pink-500' },
    ],
    8: [
      { name: 'Advanced Structural Design (Elective)', icon: '🏛️', color: 'from-purple-500 to-violet-500' },
      { name: 'Remote Sensing & GIS (Elective)', icon: '🛰️', color: 'from-cyan-500 to-sky-500' },
      { name: 'Project Phase II', icon: '🏆', color: 'from-amber-500 to-yellow-500' },
      { name: 'Internship', icon: '💼', color: 'from-emerald-500 to-green-500' },
    ],
  },

  // ─────────────────────────────────────────
  // CHEMICAL ENGINEERING
  // ─────────────────────────────────────────
  'Chemical Engineering': {
    ...FIRST_YEAR_COMMON,
    3: [
      { name: 'Engineering Mathematics III', icon: '📐', color: 'from-blue-500 to-cyan-500' },
      { name: 'Chemical Process Calculations', icon: '⚗️', color: 'from-purple-500 to-violet-500' },
      { name: 'Fluid Mechanics', icon: '💧', color: 'from-sky-500 to-blue-500' },
      { name: 'Organic / Physical Chemistry', icon: '🧪', color: 'from-green-500 to-teal-500' },
      { name: 'Mechanical Operations', icon: '⚙️', color: 'from-orange-500 to-amber-500' },
    ],
    4: [
      { name: 'Thermodynamics I', icon: '🔥', color: 'from-red-500 to-orange-500' },
      { name: 'Heat Transfer', icon: '🌡️', color: 'from-amber-500 to-yellow-500' },
      { name: 'Chemical Engineering Thermodynamics', icon: '⚗️', color: 'from-violet-500 to-purple-500' },
      { name: 'Process Instrumentation & Control', icon: '🎛️', color: 'from-teal-500 to-cyan-500' },
      { name: 'Material Science', icon: '🧱', color: 'from-gray-500 to-slate-500' },
    ],
    5: [
      { name: 'Mass Transfer I', icon: '🔄', color: 'from-blue-500 to-indigo-500' },
      { name: 'Chemical Reaction Engineering I', icon: '⚗️', color: 'from-purple-500 to-pink-500' },
      { name: 'Process Dynamics & Control', icon: '📊', color: 'from-emerald-500 to-green-500' },
      { name: 'Chemical Technology', icon: '🏭', color: 'from-orange-500 to-amber-500' },
      { name: 'Elective I', icon: '📚', color: 'from-gray-500 to-slate-500' },
    ],
    6: [
      { name: 'Mass Transfer II', icon: '🔄', color: 'from-sky-500 to-blue-500' },
      { name: 'Chemical Reaction Engineering II', icon: '⚗️', color: 'from-violet-500 to-purple-500' },
      { name: 'Process Equipment Design', icon: '🔩', color: 'from-teal-500 to-cyan-500' },
      { name: 'Petroleum Refining & Petrochemicals', icon: '🛢️', color: 'from-yellow-500 to-amber-500' },
      { name: 'Elective II', icon: '📚', color: 'from-gray-500 to-slate-500' },
    ],
    7: [
      { name: 'Plant Design & Economics', icon: '🏗️', color: 'from-green-500 to-emerald-500' },
      { name: 'Process Modeling & Simulation', icon: '💻', color: 'from-indigo-500 to-blue-500' },
      { name: 'Industrial Safety & Env. Engineering', icon: '🛡️', color: 'from-red-500 to-rose-500' },
      { name: 'Elective III', icon: '📚', color: 'from-gray-500 to-slate-500' },
      { name: 'Project Phase I', icon: '🚀', color: 'from-rose-500 to-pink-500' },
    ],
    8: [
      { name: 'Advanced Chemical Engg. (Elective)', icon: '⚗️', color: 'from-purple-500 to-violet-500' },
      { name: 'Biochemical / Polymer Tech (Elective)', icon: '🧬', color: 'from-green-500 to-teal-500' },
      { name: 'Project Phase II', icon: '🏆', color: 'from-amber-500 to-yellow-500' },
      { name: 'Internship / Seminar', icon: '💼', color: 'from-cyan-500 to-sky-500' },
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
