import { View } from '../types';

export default function Pricing() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-on-surface mb-6">Pricing</h1>
      <div className="glass-card p-8">
        <p className="text-on-surface-variant leading-relaxed">
          Transparent, predictable pricing based on your team size and repository volume. Start for free, and upgrade
          as you need advanced features like AI-powered remediation and compliance reporting.
        </p>
      </div>
    </div>
  );
}
