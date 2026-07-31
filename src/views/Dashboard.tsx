import { useState, useEffect, useMemo } from 'react';
import { Shield, Radar, AlertTriangle, Puzzle, MoreVertical, FolderCode, TrendingUp, RefreshCw } from 'lucide-react';
import Tooltip from '../components/Tooltip';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const [repos, setRepos] = useState<any[]>([]);
  const [scans, setScans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [userName, setUserName] = useState('Alex');

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('repoguard_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user && user.name) {
          setUserName(user.name.split(' ')[0]);
        }
      }
    } catch (e) {
      console.error('Failed to parse user from localStorage');
    }
    
    const fetchData = async () => {
      try {
        const [reposRes, scansRes] = await Promise.all([
          fetch('/api/repos'),
          fetch('/api/scans')
        ]);
        const reposData = await reposRes.json();
        const scansData = await scansRes.json();
        setRepos(reposData);
        setScans(scansData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalCritical = repos.reduce((sum, repo) => sum + (repo.findings?.crit || 0), 0);
  const totalHigh = repos.reduce((sum, repo) => sum + (repo.findings?.high || 0), 0);
  const totalSecrets = repos.reduce((sum, repo) => sum + (repo.findings?.secrets || 0), 0);
  
  const avgScore = repos.length > 0 
    ? Math.round(repos.reduce((sum, repo) => sum + (repo.score || 0), 0) / repos.length) 
    : 100;
    
  const scanningCount = repos.filter(r => r.isScanning).length;
  const totalFindings = totalCritical + totalHigh + totalSecrets;
  const critPct = totalFindings > 0 ? Math.round((totalCritical / totalFindings) * 100) : 0;
  const highPct = totalFindings > 0 ? Math.round((totalHigh / totalFindings) * 100) : 0;
  const secretsPct = totalFindings > 0 ? Math.round((totalSecrets / totalFindings) * 100) : 0;

  const pieData = [
    { name: 'Critical', value: totalCritical, color: 'var(--color-critical)' },
    { name: 'High', value: totalHigh, color: 'var(--color-warning)' },
    { name: 'Secrets', value: totalSecrets, color: '#f97316' }, // orange-500
  ].filter(d => d.value > 0);

  const dynamicVulnerabilityData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    // Initialize last 7 days
    const dataMap = new Map();
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      // Use a combination of dayName and offset to ensure uniqueness if we span weeks, but simple name is fine for 7 days
      dataMap.set(dayName, { name: dayName, critical: 0, highAndSecrets: 0, _date: d.toDateString() });
    }

    scans.forEach(scan => {
      const scanDate = new Date(scan.createdAt);
      const dayName = days[scanDate.getDay()];
      if (dataMap.has(dayName)) {
        const entry = dataMap.get(dayName);
        // Only count if it's within the last 7 days
        const diffTime = Math.abs(today.getTime() - scanDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        if (diffDays <= 7) {
          entry.critical += scan.critical || 0;
          entry.highAndSecrets += (scan.high || 0) + (scan.secrets || 0);
        }
      }
    });

    return Array.from(dataMap.values());
  }, [scans]);
  return (
    <div className="pt-24 pb-12 px-container-padding-mobile md:px-container-padding-desktop w-full h-full flex flex-col">
      <div className="mb-8 mt-2">
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-2 font-bold gradient-text pb-1">Good morning, {userName}.</h2>
        <p className="text-on-surface-variant font-body-lg">Your security posture is looking strong.</p>
      </div>
      
      <div className="dashboard-grid mb-8">
        <div className="col-span-12 md:col-span-4 glass-card p-6 flex flex-col justify-between relative overflow-hidden bg-success-subtle/5 cursor-default">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-success/10 rounded-full blur-3xl"></div>
          <div>
            <h3 className="text-on-surface-variant font-medium text-sm flex items-center gap-2 mb-4">
              <Shield className="text-success" size={18} />
              Security Score
            </h3>
          <Tooltip content={<div className="text-left"><p className="font-bold mb-1">Score Breakdown</p><p>Code Security: 92</p><p>Dependencies: 75</p><p>Configuration: 98</p></div>}>
            <div className="flex items-end gap-3 cursor-help">
              <span className="font-display-lg text-[48px] font-bold text-on-surface leading-none">88</span>
              <span className="text-on-surface-variant text-sm mb-1">/100</span>
            </div>
          </Tooltip>
          </div>
          <div className="mt-6">
            <Tooltip content="Trend: Improving. Score increased by 2 points since last week.">
              <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden cursor-help">
                <div className="h-full bg-success rounded-full w-[88%] shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
              </div>
            </Tooltip>
            <p className="text-success text-xs mt-2 font-medium flex items-center gap-1">
              <TrendingUp size={14} />
              +2 from last week
            </p>
          </div>
        </div>

        <div className="col-span-12 md:col-span-2 glass-card p-6 flex flex-col justify-between cursor-default">
          <h3 className="text-on-surface-variant font-medium text-sm flex items-center gap-2 mb-4">
            <Radar className="text-primary" size={18} />
            Active Scans
          </h3>
          <Tooltip content="Active Scans">
            <div className="cursor-help">
              <span className="font-display-lg text-[40px] font-bold text-on-surface leading-none">{scanningCount}</span>
              <div className="flex items-center gap-2 mt-4">
                {scanningCount > 0 ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="text-xs text-on-surface-variant">Scanning...</span>
                  </>
                ) : (
                  <span className="text-xs text-on-surface-variant">All scans completed</span>
                )}
              </div>
            </div>
          </Tooltip>
        </div>

        <div className="col-span-12 md:col-span-3 glass-card p-6 flex flex-col justify-between border-l-4 border-l-error shadow-critical-glow cursor-default">
          <h3 className="text-on-surface-variant font-medium text-sm flex items-center gap-2 mb-4">
            <AlertTriangle className="text-critical" size={18} />
            Critical Findings
          </h3>
          <div>
            <div className="flex items-end gap-3">
              <span className="font-display-lg text-[40px] font-bold text-critical leading-none">{totalCritical}</span>
            </div>
            <div className="mt-4 flex gap-2 flex-wrap">
              {repos.filter(r => r.findings?.crit > 0).slice(0, 3).map(repo => (
                <Tooltip key={repo.id} content={`${repo.findings.crit} critical findings in ${repo.name}`}>
                  <span className="bg-critical-subtle text-critical text-xs px-2 py-1 rounded border border-error/20 flex items-center gap-1 cursor-help">
                    <span className="w-1.5 h-1.5 rounded-full bg-critical"></span> {repo.name}
                  </span>
                </Tooltip>
              ))}
              {totalCritical === 0 && <span className="text-xs text-on-surface-variant">No critical findings</span>}
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-3 glass-card p-6 flex flex-col justify-between cursor-default">
          <h3 className="text-on-surface-variant font-medium text-sm flex items-center gap-2 mb-4">
            <Puzzle className="text-warning" size={18} />
            Dependency Risks
          </h3>
          <div>
            <div className="flex items-end gap-3">
              <span className="font-display-lg text-[40px] font-bold text-warning leading-none">{totalHigh + totalSecrets}</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-on-surface-variant mb-1">
                <span>High: {totalHigh}</span>
                <span>Secrets: {totalSecrets}</span>
              </div>
              <div className="w-full flex h-1.5 rounded-full overflow-hidden gap-0.5">
                <Tooltip content={`${totalHigh} High severity risks`}>
                  <div className="bg-warning h-full cursor-help" style={{ width: `${totalHigh / Math.max(1, totalHigh + totalSecrets) * 100}%` }}></div>
                </Tooltip>
                <Tooltip content={`${totalSecrets} Exposed Secrets`}>
                  <div className="bg-orange-500 h-full cursor-help" style={{ width: `${totalSecrets / Math.max(1, totalHigh + totalSecrets) * 100}%` }}></div>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid mb-8">
        <div className="col-span-12 md:col-span-8 glass-card p-6 min-h-[300px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-title-md text-on-surface font-semibold">Vulnerabilities Over Time</h3>
            <select className="bg-surface-variant border-none text-sm text-on-surface rounded-md py-1 pl-3 pr-8 focus:ring-1 focus:ring-primary outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="flex-1 mt-4 mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dynamicVulnerabilityData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" strokeOpacity={0.3} vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-on-surface-variant)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-on-surface-variant)" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface-container-highest)', borderColor: 'var(--color-outline-variant)', borderRadius: '8px', color: 'var(--color-on-surface)' }}
                  itemStyle={{ color: 'var(--color-on-surface)' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" name="Critical Issues" dataKey="critical" stroke="var(--color-critical)" strokeWidth={2} dot={{ r: 4, fill: 'var(--color-critical)', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                <Line type="monotone" name="High & Secrets" dataKey="highAndSecrets" stroke="var(--color-warning)" strokeWidth={2} dot={{ r: 4, fill: 'var(--color-warning)', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 glass-card p-6 min-h-[300px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-title-md text-on-surface font-semibold">Distribution</h3>
            <button className="text-on-surface-variant hover:text-primary"><MoreVertical size={18} /></button>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            {totalFindings > 0 ? (
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={75}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--color-surface-container-highest)', borderColor: 'var(--color-outline-variant)', borderRadius: '8px', color: 'var(--color-on-surface)' }}
                    itemStyle={{ color: 'var(--color-on-surface)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-40 h-40 rounded-full border-[16px] border-surface-variant relative flex items-center justify-center">
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center flex-col z-10 pointer-events-none">
              <span className="text-2xl font-bold text-on-surface">{totalFindings}</span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Total</span>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-critical"></span> <span className="text-on-surface-variant">Critical</span></div>
              <span className="font-medium">{totalCritical} ({critPct}%)</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-warning"></span> <span className="text-on-surface-variant">High</span></div>
              <span className="font-medium">{totalHigh} ({highPct}%)</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500"></span> <span className="text-on-surface-variant">Secrets</span></div>
              <span className="font-medium">{totalSecrets} ({secretsPct}%)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid pb-12">
        <div className="col-span-12 md:col-span-6 glass-card p-6 cursor-default">
          <h3 className="font-title-md text-on-surface mb-6 font-semibold">Recent Activity</h3>
          <div className="relative border-l border-outline-variant/30 ml-3 space-y-6 pb-2">
            {scans.slice(0, 4).map((scan, i) => {
              const date = new Date(scan.createdAt);
              const isCrit = scan.critical > 0;
              const isWarning = scan.high > 0;
              
              return (
                <div key={scan.id} className="relative pl-6">
                  <span className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ${isCrit ? 'bg-critical' : isWarning ? 'bg-warning' : 'bg-success'} ring-4 ring-surface-container`}></span>
                  <p className="text-sm font-medium text-on-surface">
                    {isCrit ? 'Critical Vulnerabilities Detected' : isWarning ? 'Risks Detected' : 'Scan Completed Cleanly'}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1 font-code-sm">
                    {scan.repository?.name || 'Unknown Repo'} • {scan.critical} Crit, {scan.high} High
                  </p>
                  <span className="text-[10px] text-outline mt-2 block">{date.toLocaleTimeString()} - {date.toLocaleDateString()}</span>
                </div>
              );
            })}
            {scans.length === 0 && <div className="pl-6 text-on-surface-variant text-sm">No recent activity.</div>}
          </div>
        </div>

        <div className="col-span-12 md:col-span-6 glass-card p-6 cursor-default">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-title-md text-on-surface font-semibold">Repository Health</h3>
            <a className="text-sm text-primary hover:underline" href="#">View All</a>
          </div>
          <div className="space-y-3">
            {repos.slice(0, 4).map(repo => (
              <div key={repo.id} className="group flex items-center justify-between p-3 rounded-lg hover:bg-surface-variant/30 transition-colors border border-transparent hover:border-outline-variant/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-surface-variant flex items-center justify-center text-on-surface">
                    <FolderCode size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">{repo.name}</h4>
                    <p className="text-xs text-on-surface-variant font-code-sm">{repo.visibility} • {repo.lang}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`bg-${repo.scoreColor.split('-')[0]}-subtle text-${repo.scoreColor.split('-')[0]} text-[10px] uppercase font-bold px-2 py-0.5 rounded`}>{repo.status}</span>
                  <div className="text-right">
                    <div className={`text-sm font-bold text-${repo.scoreColor.split('-')[0]}`}>{repo.score}/100</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
