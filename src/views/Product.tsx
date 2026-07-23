import { View } from '../types';

export default function Product() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-on-surface mb-6">Product</h1>
      <div className="glass-card p-8">
        <p className="text-on-surface-variant leading-relaxed">
          RepoGuard is a comprehensive security platform designed to automatically identify and remediate vulnerabilities in your codebase.
          By integrating directly into your development workflow, we help you fix issues before they reach production.
        </p>
      </div>
    </div>
  );
}
