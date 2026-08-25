import { useState, useEffect } from 'react';
import { UserPlus, UserX, ShieldAlert } from 'lucide-react';

export default function TeamManager({ token }: { token: string | null }) {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/organizations/members', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (e) {
      console.error('Failed to fetch members', e);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    
    try {
      const res = await fetch('/api/organizations/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole })
      });
      
      if (res.ok) {
        alert("User invited successfully!");
        setInviteEmail('');
        fetchMembers();
      } else {
        const err = await res.json();
        alert(err.detail || "Failed to invite user");
      }
    } catch (e) {
      console.error('Failed to invite member', e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-lg border border-outline-variant/30 bg-surface-container-lowest">
        <h4 className="font-semibold text-on-surface mb-4 flex items-center gap-2">
          <UserPlus size={18} /> Invite Team Member
        </h4>
        <form onSubmit={handleInvite} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium text-on-surface-variant mb-1">Email Address</label>
            <input 
              type="email" required
              value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
              placeholder="colleague@example.com"
              className="w-full bg-surface-container border border-outline-variant/30 rounded px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
            />
          </div>
          <div className="w-48">
            <label className="block text-xs font-medium text-on-surface-variant mb-1">Role</label>
            <select 
              value={inviteRole} onChange={e => setInviteRole(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant/30 rounded px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="admin">Admin</option>
              <option value="member">Member</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <button type="submit" className="px-4 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90 transition-colors h-[38px]">
            Send Invite
          </button>
        </form>
      </div>

      <div>
        <h4 className="font-semibold text-on-surface mb-4">Current Members</h4>
        {loading ? (
          <div className="animate-pulse h-24 bg-surface-variant/30 rounded-lg"></div>
        ) : (
          <div className="border border-outline-variant/30 rounded-lg overflow-hidden">
            <table className="w-full text-left text-sm text-on-surface">
              <thead className="bg-surface-variant/30 border-b border-outline-variant/30 text-xs font-medium text-on-surface-variant uppercase">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 bg-surface-container-lowest">
                {members.map(member => (
                  <tr key={member.id} className="hover:bg-surface-variant/10 transition-colors">
                    <td className="px-4 py-3 font-medium">{member.user.name || 'Unknown User'}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{member.user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                        member.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 
                        member.role === 'member' ? 'bg-primary/10 text-primary border border-primary/20' : 
                        'bg-surface-variant text-on-surface border border-outline-variant/30'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {member.role !== 'admin' && (
                        <button className="text-on-surface-variant hover:text-critical p-1 rounded hover:bg-critical/10 transition-colors">
                          <UserX size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
