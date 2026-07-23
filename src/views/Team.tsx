import { Users, UserPlus, Mail, Shield, MoreVertical } from 'lucide-react';

export default function Team() {
  const members = [
    { id: 1, name: 'Alex Chen', email: 'alex@acme.corp', role: 'Owner', lastActive: '2 mins ago', avatar: 'AC' },
    { id: 2, name: 'Sarah Jenkins', email: 'sarah.j@acme.corp', role: 'Admin', lastActive: '1 hour ago', avatar: 'SJ' },
    { id: 3, name: 'Marcus Doe', email: 'm.doe@acme.corp', role: 'Developer', lastActive: 'Yesterday', avatar: 'MD' },
    { id: 4, name: 'Priya Patel', email: 'ppatel@acme.corp', role: 'Security Engineer', lastActive: '3 hours ago', avatar: 'PP' },
    { id: 5, name: 'David Smith', email: 'david.s@acme.corp', role: 'Viewer', lastActive: '5 days ago', avatar: 'DS' },
  ];

  return (
    <div className="pt-24 pb-12 px-container-padding-mobile md:px-container-padding-desktop w-full h-full flex flex-col max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8 mt-2">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold flex items-center gap-3">
            <Users className="text-primary" size={32} />
            Team Management
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">Manage workspace members, roles, and access permissions.</p>
        </div>
        <button className="bg-primary-container text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-container/90 transition-colors cursor-pointer flex items-center gap-2 shadow-[0_0_10px_rgba(37,99,235,0.2)]">
          <UserPlus size={18} /> Invite Member
        </button>
      </div>

      <div className="glass-panel rounded-xl flex flex-col overflow-hidden shadow-lg border border-outline-variant/30">
        <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-lowest/30">
          <div className="flex items-center gap-4">
             <div className="text-sm font-medium text-on-surface">5 Members</div>
             <div className="text-sm text-on-surface-variant flex items-center gap-1">
                <Shield size={14} className="text-secondary" /> 3 Seats Available (Pro Plan)
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-highest/20 text-xs uppercase font-label-caps tracking-wider text-on-surface-variant">
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Last Active</th>
                <th className="p-4 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-sm">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-surface-variant/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-container to-secondary-container text-white flex items-center justify-center font-bold text-sm">
                          {member.avatar}
                       </div>
                       <div>
                          <div className="font-medium text-on-surface">{member.name}</div>
                          <div className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                             <Mail size={12} /> {member.email}
                          </div>
                       </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
                       member.role === 'Owner' || member.role === 'Admin' ? 'bg-primary/10 text-primary border-primary/20' :
                       member.role === 'Security Engineer' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                       'bg-surface-variant/50 text-on-surface-variant border-outline-variant/30'
                    }`}>
                       {member.role}
                    </span>
                  </td>
                  <td className="p-4 text-on-surface-variant text-sm">
                     {member.lastActive}
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 hover:bg-surface-variant text-on-surface-variant hover:text-primary rounded transition-colors cursor-pointer">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
