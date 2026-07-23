import { View } from '../types';

export default function Docs() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-on-surface mb-6">Documentation</h1>
      <div className="glass-card p-8">
        <p className="text-on-surface-variant leading-relaxed">
          Welcome to the RepoGuard Documentation. Here you will find quick start guides, API references,
          and detailed integration tutorials for connecting your existing code repositories.
        </p>
      </div>
    </div>
  );
}
