import { useState, useEffect, useMemo, useCallback } from 'react';
import { Shield, Radar, AlertTriangle, Puzzle, MoreVertical, FolderCode, TrendingUp, RefreshCw } from 'lucide-react';
import Tooltip from '../components/Tooltip';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [repos, setRepos] = useState<any[]>([]);
  const [scans, setScans] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [days, setDays] = useState(7);
  const [isLoading, setIsLoading] = useState(true);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const { user, token } = useAuth();
  const userName = user?.name ? user.name.split(' ')[0] : (user?.email?.split('@')[0] || 'User');

  const fetchData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    }
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [reposRes, scansRes, analyticsRes] = await Promise.all([
        fetch('/api/repos', { headers }),
        fetch('/api/scans', { headers }),
        fetch(`/api/reports/analytics?days=${days}`, { headers })
      ]);
      
      if (!reposRes.ok || !scansRes.ok || !analyticsRes.ok) throw new Error("Failed to fetch data");
      
      const reposData = await reposRes.json();
      const scansData = await scansRes.json();
      const analyticsData = await analyticsRes.json();
      
      setRepos(Array.isArray(reposData) ? reposData : []);
      setScans(Array.isArray(scansData) ? scansData : []);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setRepos([]);
      setScans([]);
      setAnalytics(null);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [token, days]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, fetchData]);

  const totalCritical = analytics?.severity?.critical || 0;
  const totalHigh = analytics?.severity?.high || 0;
  const totalSecrets = analytics?.severity?.secrets || 0;
  
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

  const dynamicVulnerabilityData = analytics?.trend || [];
  const topRiskyRepos = analytics?.top_risky_repos || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  if (isLoading) {
    return (
      <div className="pt-24 pb-12 px-container-padding-mobile md:px-container-padding-desktop w-full h-full flex flex-col">
        <div className="mb-8 mt-2 animate-pulse">
          <div className="h-8 bg-surface-variant rounded w-64 mb-2"></div>
          <div className="h-4 bg-surface-variant rounded w-48"></div>
        </div>
        <div className="dashboard-grid mb-8">
          <div className="col-span-12 md:col-span-4 glass-card p-6 h-[220px] animate-pulse bg-surface-variant/50"></div>
          <div className="col-span-12 md:col-span-2 glass-card p-6 h-[220px] animate-pulse bg-surface-variant/50"></div>
          <div className="col-span-12 md:col-span-3 glass-card p-6 h-[220px] animate-pulse bg-surface-variant/50"></div>
          <div className="col-span-12 md:col-span-3 glass-card p-6 h-[220px] animate-pulse bg-surface-variant/50"></div>
        </div>
        <div className="dashboard-grid mb-8">
          <div className="col-span-12 md:col-span-8 glass-card p-6 min-h-[300px] animate-pulse bg-surface-variant/50"></div>
          <div className="col-span-12 md:col-span-4 glass-card p-6 min-h-[300px] animate-pulse bg-surface-variant/50"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-container-padding-mobile md:px-container-padding-desktop w-full h-full flex flex-col">
      <div className="flex justify-between items-end mb-8 mt-2">
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-2 font-bold gradient-text pb-1">Good morning, {userName}.</h2>
          <p className="text-on-surface-variant font-body-lg">Your security posture is looking strong.</p>
        </div>
        <button 
          onClick={() => fetchData(true)}
          className="flex items-center gap-2 bg-surface-variant hover:bg-surface-variant-hover text-on-surface text-sm font-medium py-2 px-4 rounded-md transition-colors"
        >
          <RefreshCw size={16} className={isRefreshing ? "animate-spin text-primary" : ""} />
          Refresh
        </button>
      </div>
      
      <motion.div 
        className="dashboard-grid mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }} className={`col-span-12 md:col-span-6 lg:col-span-3 glass-card p-6 flex flex-col justify-between relative overflow-hidden ${avgScore >= 80 ? 'bg-success-subtle/5' : (avgScore > 50 ? 'bg-warning-subtle/5' : 'bg-critical-subtle/5')} cursor-default`}>
          <div className={`absolute -right-10 -top-10 w-40 h-40 ${avgScore >= 80 ? 'bg-success/10' : (avgScore > 50 ? 'bg-warning/10' : 'bg-critical/10')} rounded-full blur-3xl`}></div>
          <div>
            <h3 className="text-on-surface-variant font-medium text-sm flex items-center gap-2 mb-4">
              <Shield className={avgScore >= 80 ? "text-success" : (avgScore > 50 ? "text-warning" : "text-critical")} size={18} />
              Security Score
            </h3>
          <Tooltip content={`Average security score across ${repos.length} repositories`}>
            <div className="flex items-end gap-3 cursor-help">
              <span className="font-display-lg text-4xl lg:text-[48px] font-bold text-on-surface leading-none">{avgScore}</span>
              <span className="text-on-surface-variant text-sm mb-1">/100</span>
            </div>
          </Tooltip>
          </div>
          <div className="mt-6">
            <Tooltip content="Organization-wide average security posture">
              <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden cursor-help">
                <div className={`h-full rounded-full w-[${avgScore}%] ${avgScore >= 80 ? 'bg-success shadow-[0_0_10px_rgba(74,222,128,0.5)]' : (avgScore > 50 ? 'bg-warning shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'bg-critical shadow-[0_0_10px_rgba(248,113,113,0.5)]')}`} style={{ width: `${avgScore}%` }}></div>
              </div>
            </Tooltip>
            <p className={`${avgScore >= 80 ? 'text-success' : (avgScore > 50 ? 'text-warning' : 'text-critical')} text-xs mt-2 font-medium flex items-center gap-1`}>
              <TrendingUp size={14} />
              {avgScore >= 80 ? 'Looking healthy' : 'Action required'}
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }} className="col-span-12 md:col-span-6 lg:col-span-3 glass-card p-6 flex flex-col justify-between cursor-default">
          <h3 className="text-on-surface-variant font-medium text-sm flex items-center gap-2 mb-4">
            <Radar className="text-primary" size={18} />
            Active Scans
          </h3>
          <Tooltip content="Active Scans">
            <div className="cursor-help">
              <span className="font-display-lg text-4xl lg:text-[40px] font-bold text-on-surface leading-none">{scanningCount}</span>
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
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }} className="col-span-12 md:col-span-6 lg:col-span-3 glass-card p-6 flex flex-col justify-between border-l-4 border-l-error shadow-critical-glow cursor-default">
          <h3 className="text-on-surface-variant font-medium text-sm flex items-center gap-2 mb-4">
            <AlertTriangle className="text-critical" size={18} />
            Critical Findings
          </h3>
          <div>
            <div className="flex items-end gap-3">
              <span className="font-display-lg text-4xl lg:text-[40px] font-bold text-critical leading-none">{totalCritical}</span>
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
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }} className="col-span-12 md:col-span-6 lg:col-span-3 glass-card p-6 flex flex-col justify-between cursor-default">
          <h3 className="text-on-surface-variant font-medium text-sm flex items-center gap-2 mb-4">
            <Puzzle className="text-warning" size={18} />
            Dependency Risks
          </h3>
          <div>
            <div className="flex items-end gap-3">
              <span className="font-display-lg text-4xl lg:text-[40px] font-bold text-warning leading-none">{totalHigh + totalSecrets}</span>
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
        </motion.div>
      </motion.div>

      <motion.div 
        className="dashboard-grid mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }} className="col-span-12 md:col-span-8 glass-card p-6 min-h-[300px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-title-md text-on-surface font-semibold">Vulnerabilities Over Time</h3>
            <select 
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="bg-surface-variant border-none text-sm text-on-surface rounded-md py-1 pl-3 pr-8 focus:ring-1 focus:ring-primary outline-none"
            >
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 30 Days</option>
            </select>
          </div>
          <div className="flex-1 mt-4 mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dynamicVulnerabilityData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <defs>
                  <linearGradient id="colorCrit" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="var(--color-critical)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-critical)" stopOpacity={1}/>
                  </linearGradient>
                  <linearGradient id="colorWarn" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="var(--color-warning)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-warning)" stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" strokeOpacity={0.3} vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-on-surface-variant)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-on-surface-variant)" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface-container-highest)', borderColor: 'var(--color-outline-variant)', borderRadius: '8px', color: 'var(--color-on-surface)' }}
                  itemStyle={{ color: 'var(--color-on-surface)' }}
                  labelStyle={{ fontWeight: 'bold', color: 'var(--color-on-surface)', marginBottom: '4px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" name="Critical Issues" dataKey="critical" stroke="url(#colorCrit)" strokeWidth={3} dot={{ r: 4, fill: 'var(--color-critical)', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                <Line type="monotone" name="High & Secrets" dataKey="highAndSecrets" stroke="url(#colorWarn)" strokeWidth={3} dot={{ r: 4, fill: 'var(--color-warning)', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }} className="col-span-12 md:col-span-4 glass-card p-6 min-h-[300px] flex flex-col">
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
        </motion.div>
      </motion.div>

      <motion.div 
        className="dashboard-grid mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }} className="col-span-12 glass-card p-6 min-h-[300px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-title-md text-on-surface font-semibold">Top Risky Repositories</h3>
            <button className="text-sm text-primary hover:underline">View Full Report</button>
          </div>
          <div className="flex-1 mt-4 mb-2">
            {topRiskyRepos.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topRiskyRepos} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" strokeOpacity={0.3} horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="var(--color-on-surface-variant)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="var(--color-on-surface-variant)" fontSize={12} tickLine={false} axisLine={false} width={150} />
                  <RechartsTooltip 
                    cursor={{fill: 'var(--color-surface-variant)', opacity: 0.2}}
                    contentStyle={{ backgroundColor: 'var(--color-surface-container-highest)', borderColor: 'var(--color-outline-variant)', borderRadius: '8px', color: 'var(--color-on-surface)' }}
                    itemStyle={{ color: 'var(--color-on-surface)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="critical" name="Critical" stackId="a" fill="var(--color-critical)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="high" name="High" stackId="a" fill="var(--color-warning)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="secrets" name="Secrets" stackId="a" fill="#f97316" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-on-surface-variant text-sm">
                No risky repositories found. You're completely secure!
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        className="dashboard-grid pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }} className="col-span-12 md:col-span-6 glass-card p-6 cursor-default">
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
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }} className="col-span-12 md:col-span-6 glass-card p-6 cursor-default">
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
        </motion.div>
      </motion.div>
    </div>
  );
}
