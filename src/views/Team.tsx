import { useState, useEffect } from 'react';
import { Users, UserPlus, Mail, Shield, MoreVertical, Loader2, PlusCircle } from 'lucide-react';

export default function Team() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [org, setOrg] = useState<any>(null);
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, []);

  async function fetchTeam() {
    setLoading(true);
    try {
      const orgsRes = await fetch('/api/organizations');
      if (orgsRes.ok) {
        const orgs = await orgsRes.json();
        if (orgs.length > 0) {
          setOrg(orgs[0]);
          const membersRes = await fetch(`/api/organizations/${orgs[0].id}/members`);
          if (membersRes.ok) {
            const membersData = await membersRes.json();
            setMembers(membersData);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch team:", err);
    } finally {
      setLoading(false);
    }
  }

  async function createDefaultOrg() {
    setIsCreatingOrg(true);
    try {
       const res = await fetch('/api/organizations', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ name: 'My Workspace' })
       });
       if (res.ok) {
         fetchTeam();
       }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingOrg(false);
    }
  }

  const getAvatar = (name: string, email: string) => {
    if (name) {
      const parts = name.split(' ');
      if (parts.length > 1) return parts[0][0] + parts[1][0];
      return name.substring(0, 2).toUpperCase();
    }
    return email ? email.substring(0, 2).toUpperCase() : '??';
  };

  return (
    <div className="pt-24 pb-12 px-container-padding-mobile md:px-container-padding-desktop w-full h-full flex flex-col max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8 mt-2">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold flex items-center gap-3">
            <Users className="text-primary" size={32} />
            Team Management {org && <span className="text-sm font-medium bg-surface-variant px-3 py-1 rounded-full text-on-surface-variant ml-2 border border-outline-variant/30">{org.name}</span>}
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">Manage workspace members, roles, and access permissions.</p>
        </div>
        {org && (
          <button className="bg-primary-container text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-container/90 transition-colors cursor-pointer flex items-center gap-2 shadow-[0_0_10px_rgba(37,99,235,0.2)]">
            <UserPlus size={18} /> Invite Member
          </button>
        )}
      </div>

      {!org && !loading && (
        <div className="glass-panel rounded-xl flex flex-col items-center justify-center p-12 text-center border border-outline-variant/30">
          <Users size={48} className="text-primary/50 mb-4" />
          <h3 className="text-xl font-bold text-on-surface mb-2">No Organization Found</h3>
          <p className="text-on-surface-variant mb-6">Create a workspace organization to start collaborating with your team.</p>
          <button 
            onClick={createDefaultOrg}
            disabled={isCreatingOrg}
            className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer flex items-center gap-2"
          >
            {isCreatingOrg ? <Loader2 size={18} className="animate-spin" /> : <PlusCircle size={18} />}
            Create Workspace
          </button>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center p-12">
           <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      )}

      {org && !loading && (
        <div className="glass-panel rounded-xl flex flex-col overflow-hidden shadow-lg border border-outline-variant/30">
        <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-lowest/30">
          <div className="flex items-center gap-4">
             <div className="text-sm font-medium text-on-surface">{members.length} Member{members.length !== 1 && 's'}</div>
             <div className="text-sm text-on-surface-variant flex items-center gap-1">
                <Shield size={14} className="text-secondary" /> Unlimited Seats (Enterprise)
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
                          {getAvatar(member.user?.name, member.user?.email)}
                       </div>
                       <div>
                          <div className="font-medium text-on-surface">{member.user?.name || member.user?.email?.split('@')[0]}</div>
                          <div className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                             <Mail size={12} /> {member.user?.email}
                          </div>
                       </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border capitalize ${
                       member.role === 'owner' || member.role === 'admin' ? 'bg-primary/10 text-primary border-primary/20' :
                       member.role === 'security engineer' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                       'bg-surface-variant/50 text-on-surface-variant border-outline-variant/30'
                    }`}>
                       {member.role}
                    </span>
                  </td>
                  <td className="p-4 text-on-surface-variant text-sm">
                     Active now
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 hover:bg-surface-variant text-on-surface-variant hover:text-primary rounded transition-colors cursor-pointer">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                 <tr>
                    <td colSpan={4} className="p-8 text-center text-on-surface-variant">
                       No members found in this organization.
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  );
}
