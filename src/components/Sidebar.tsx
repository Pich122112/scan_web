import { FaHome, FaUser, FaUsers, FaCog } from 'react-icons/fa';

export default function Sidebar() {
  return (
    <aside className="w-16 min-h-screen bg-white mt-30 shadow-md flex flex-col items-center py-4 gap-6">
      <button className="text-orange-500 text-2xl"><FaUser /></button>
      <button className="text-gray-500 text-2xl"><FaHome /></button>
      <button className="text-gray-500 text-2xl"><FaUsers /></button>
      <button className="text-gray-500 text-2xl mt-auto mb-4"><FaCog /></button>
    </aside>
  );
}
