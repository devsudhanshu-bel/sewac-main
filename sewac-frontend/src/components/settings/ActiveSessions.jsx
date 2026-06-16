import { useState } from "react";
import { Monitor, Smartphone, Laptop, ArrowRight, MoreVertical } from "lucide-react";

export default function ActiveSessions({ onNotify }) {
  const [sessions, setSessions] = useState([
    { id: 1, title: "Windows · Chrome", location: "Bengaluru, Karnataka, India", badge: "This Device", icon: Monitor, active: "" },
    { id: 2, title: "Android · SEWAC Admin App", location: "Bengaluru, Karnataka, India", badge: "", icon: Smartphone, active: "Active 2h ago" },
    { id: 3, title: "macOS · Safari", location: "Bengaluru, Karnataka, India", badge: "", icon: Laptop, active: "Active 1d ago" },
  ]);

  const handleRevokeSession = (id, name) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (onNotify) onNotify(`Terminated session on ${name} successfully.`, "success");
  };

  const handleSignOutAll = () => {
    setSessions(prev => prev.filter(s => s.badge !== "This Device"));
    if (onNotify) onNotify("Logged out of all secondary devices.", "success");
  };

  return (
    <div className="bg-white rounded-[18px] border border-[#f1f1f1] shadow-sm p-5 w-full">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-[15px] font-semibold text-[#1f2937]">Active Sessions</h3>
          <p className="text-[11px] text-[#9ca3af] mt-1">Manage your active sessions</p>
        </div>
        {sessions.length > 1 && (
          <button
            onClick={handleSignOutAll}
            className="h-[30px] px-4 rounded-[8px] border border-pink-200 text-[11px] font-medium text-pink-500 bg-white hover:bg-pink-50 cursor-pointer transition-colors"
          >
            Sign Out All
          </button>
        )}
      </div>

      <div>
        {sessions.map((session) => {
          const Icon = session.icon;
          return (
            <div key={session.id} className="flex items-center justify-between py-4 border-b border-[#f3f4f6]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#f5f3ff] flex items-center justify-center">
                  <Icon size={16} className="text-[#8b5cf6]" />
                </div>
                <div>
                  <h4 className="text-[12px] font-medium text-[#374151]">{session.title}</h4>
                  <p className="text-[11px] text-[#9ca3af] mt-1">{session.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {session.badge ? (
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-[10px] font-medium">
                    {session.badge}
                  </span>
                ) : (
                  <>
                    <span className="text-[11px] text-[#9ca3af]">{session.active}</span>
                    <button 
                      onClick={() => handleRevokeSession(session.id, session.title)}
                      className="p-1 hover:bg-gray-100 rounded text-red-400 transition-colors"
                      title="Terminate Session"
                    >
                      <MoreVertical size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 border border-[#ece8ff] rounded-[10px] px-4 py-3 flex items-center justify-between text-[#8b5cf6] text-[12px] font-medium cursor-pointer hover:bg-purple-50 transition-colors">
        <span>View All Sessions</span>
        <ArrowRight size={15} />
      </div>
    </div>
  );
}