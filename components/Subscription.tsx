import React, { useState } from 'react';

const plans = [
  {
    id: 'Free',
    name: 'Free',
    price: '$0',
    features: ['3 Projects', 'Basic Brand Gen', 'Standard Chat'],
    color: 'slate'
  },
  {
    id: 'Starter',
    name: 'Starter',
    price: '$15',
    features: ['10 Projects', 'Priority Support', 'Export to PDF'],
    color: 'blue'
  },
  {
    id: 'Growth',
    name: 'Growth',
    price: '$49',
    features: ['Unlimited Projects', 'Veo 4K Video', 'Search Grounding', 'Advanced Analytics'],
    popular: true,
    color: 'indigo'
  },
  {
    id: 'Enterprise',
    name: 'Enterprise',
    price: '$199',
    features: ['Everything in Growth', 'Dedicated Account Manager', 'Custom API Access', 'Team Seats'],
    color: 'purple'
  }
];

interface SubscriptionProps {
  currentPlan: string;
  onUpgrade: (planId: string) => void;
}

export const Subscription: React.FC<SubscriptionProps> = ({ currentPlan, onUpgrade }) => {
  const [processing, setProcessing] = useState<string | null>(null);

  const handleUpgrade = (planId: string) => {
    setProcessing(planId);
    setTimeout(() => {
      onUpgrade(planId);
      setProcessing(null);
      alert(`Successfully switched to ${planId} Plan!`);
    }, 1500);
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-12">
      <div className="text-center max-w-2xl mx-auto pt-8">
        <h2 className="text-4xl font-extrabold text-white mb-4">Upgrade Your Workspace</h2>
        <p className="text-slate-400 text-lg">Current Plan: <span className="text-indigo-400 font-bold">{currentPlan}</span></p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`p-8 rounded-3xl border flex flex-col relative transition-all duration-300 ${
              currentPlan === plan.id 
                ? 'border-green-500 bg-slate-900 shadow-2xl ring-1 ring-green-500/50 scale-[1.02]' 
                : plan.popular 
                  ? 'border-indigo-500 bg-slate-900 shadow-2xl shadow-indigo-900/50 scale-110 z-10'
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-600'
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 inset-x-0 -mt-3 flex justify-center">
                <span className="bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide shadow-lg">Most Popular</span>
              </div>
            )}
            
            <h3 className={`text-xl font-bold text-white`}>{plan.name}</h3>
            <div className="my-6 text-4xl font-extrabold text-white">{plan.price}<span className="text-sm font-normal text-slate-500">/mo</span></div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                  <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs ${plan.id === 'Free' ? 'bg-slate-800 text-slate-400' : 'bg-green-500/20 text-green-400'}`}>✓</span> 
                  {feat}
                </li>
              ))}
            </ul>

            {currentPlan === plan.id ? (
              <button disabled className="w-full py-3 rounded-xl bg-green-500/10 text-green-400 font-bold cursor-default border border-green-500/30">
                Active Plan
              </button>
            ) : (
              <button 
                onClick={() => handleUpgrade(plan.id)}
                disabled={!!processing}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  plan.popular 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/50' 
                    : 'bg-white text-slate-900 hover:bg-slate-200'
                }`}
              >
                {processing === plan.id ? 'Processing...' : 'Switch Plan'}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="bg-slate-900/50 rounded-xl p-6 text-center text-sm text-slate-500 max-w-2xl mx-auto border border-slate-800">
        <p>Payments are securely processed. You can cancel anytime from your account settings.</p>
      </div>
    </div>
  );
};