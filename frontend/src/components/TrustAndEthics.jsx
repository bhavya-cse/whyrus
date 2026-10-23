import React from 'react';
import { 
  ShieldAlert, 
  HelpCircle, 
  CheckCircle, 
  Lock, 
  Scale, 
  EyeOff,
  AlertTriangle
} from 'lucide-react';

export default function TrustAndEthics() {
  const principles = [
    {
      title: "Evidence Before Assumptions",
      icon: Scale,
      statement: "Every hypothesis must link directly to observed Evidence IDs.",
      description: "Whyrus never invents facts, logs, file paths, or line numbers. If a hypothesis cannot point to concrete timestamps and log events, it will not be presented."
    },
    {
      title: "Correlation Is Not Proof of Causation",
      icon: AlertTriangle,
      statement: "Chronological precedence suggests causality, but does not guarantee it.",
      description: "A database error preceding an HTTP 500 strongly correlates, but transient network partitions or third-party DNS failures may be the true root cause. Whyrus acknowledges alternatives."
    },
    {
      title: "Confidence Reflects Evidence Strength",
      icon: HelpCircle,
      statement: "Confidence labels reflect evidence completeness, not black-box certainty.",
      description: "Labels like High, Moderate, Plausible, and Preliminary indicate how many independent signals support the hypothesis and whether contradictory evidence exists."
    },
    {
      title: "Incomplete Logs Lead to Preliminary Conclusions",
      icon: ShieldAlert,
      statement: "The engine is only as good as the evidence supplied.",
      description: "If debug logs or metrics are omitted, Whyrus explicitly identifies 'Missing Evidence' needed to confirm the root cause before recommending irreversible production actions."
    },
    {
      title: "Strict Credential Redaction",
      icon: EyeOff,
      statement: "Sensitive tokens, passwords, and keys are scrubbed by default.",
      description: "JWTs, Bearer headers, database passwords, and AWS credentials are automatically masked into [REDACTED] tokens before processing or external AI synthesis."
    }
  ];

  return (
    <section id="trust" className="py-20 lg:py-28 bg-white border-b border-[#E5E4DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#167D78] flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#167D78]"></span>
            <span>Trust, Ethics & Scientific Rigor</span>
          </div>
          
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] text-[#17243A] leading-[1.18] tracking-tight">
            How Whyrus approaches uncertainty: <br className="hidden sm:inline" />
            <span className="text-[#167D78]">No false certainty. No fabricated claims.</span>
          </h2>
          
          <p className="text-lg text-[#64748B] font-normal leading-relaxed">
            Root-cause analysis in complex software systems requires honesty about what is known, what is plausible, and what requires further verification.
          </p>
        </div>

        {/* 5 Architectural Trust Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div 
                key={p.title}
                className={`p-7 rounded-xl border border-[#E5E4DE] bg-[#F7F6F2] flex flex-col justify-between ${
                  idx === 0 ? 'lg:col-span-2 bg-[#17243A] text-white border-[#273852]' : ''
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      idx === 0 ? 'bg-[#167D78] text-white' : 'bg-white text-[#167D78] border border-[#E5E4DE]'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className={`font-heading font-bold text-lg ${idx === 0 ? 'text-white' : 'text-[#17243A]'}`}>
                      {p.title}
                    </h3>
                  </div>

                  <div className={`font-mono text-xs font-medium ${idx === 0 ? 'text-[#5EEAD4]' : 'text-[#167D78]'}`}>
                    “{p.statement}”
                  </div>

                  <p className={`text-xs leading-relaxed ${idx === 0 ? 'text-[#CBD5E1]' : 'text-[#64748B]'}`}>
                    {p.description}
                  </p>
                </div>

                <div className={`pt-4 border-t mt-4 text-[11px] font-mono ${
                  idx === 0 ? 'border-[#273852] text-[#94A3B8]' : 'border-[#E5E4DE] text-[#64748B]'
                }`}>
                  Core Engineering Axiom #{idx + 1}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
