import React from 'react';
import { 
  Code2, 
  GraduationCap, 
  Terminal, 
  CheckCircle, 
  Users, 
  Server
} from 'lucide-react';

export default function TargetAudience({ onOpenAnalyzer }) {
  const audiences = [
    {
      title: "Software Developers",
      role: "Application Engineers",
      icon: Code2,
      tag: "Deep Debugging",
      benefit: "Bypass wall-of-text log parsing. Whyrus correlates stack traces with prior warnings and database logs so you can pinpoint whether an exception was caused by bad input or upstream dependency degradation."
    },
    {
      title: "DevOps & SRE Teams",
      role: "Reliability & Production",
      icon: Server,
      tag: "MTTR Reduction",
      benefit: "Rapidly isolate cascading outages. When 15 alerts trigger at once during an incident, Whyrus identifies the earliest fatal trigger to stop teams from chasing downstream symptoms."
    },
    {
      title: "CS Students & Junior Engineers",
      role: "Accelerated Learning",
      icon: GraduationCap,
      tag: "Debug Intuition",
      benefit: "Master forensic debugging without getting overwhelmed. Learn how to reconstruct incident timelines, distinguish observed facts from hypotheses, and form disciplined troubleshooting habits."
    },
    {
      title: "QA & Test Engineers",
      role: "Defect Verification",
      icon: CheckCircle,
      tag: "High-Fidelity Bug Reports",
      benefit: "Turn flaky test logs and staging crash dumps into structured incident summaries. Provide development teams with exact timeline sequences and reproducible verification checks."
    },
    {
      title: "Small Engineering Teams",
      role: "Lean Engineering Orgs",
      icon: Users,
      tag: "Incident Clarity",
      benefit: "Get enterprise-grade root-cause analysis without requiring dedicated 24/7 on-call tier-3 specialists. Paste staging or production crash logs and receive immediate, structured next steps."
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#F7F6F2] border-b border-[#E5E4DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#167D78] flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#167D78]"></span>
            <span>Who Whyrus Is Built For</span>
          </div>
          
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] text-[#17243A] leading-[1.18] tracking-tight">
            Tailored for engineers who demand <br className="hidden sm:inline" />
            <span className="text-[#167D78]">evidence over speculation.</span>
          </h2>
          
          <p className="text-lg text-[#64748B] font-normal leading-relaxed">
            From junior engineers learning to read complex stack traces to SREs managing multi-service production outages.
          </p>
        </div>

        {/* 5 Distinct Audience Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audiences.map((aud, index) => {
            const Icon = aud.icon;
            return (
              <div 
                key={aud.title}
                className={`bg-white rounded-xl p-7 border border-[#E5E4DE] shadow-sm flex flex-col justify-between hover:border-[#CBD5E1] transition-all ${
                  index === 4 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-[#17243A] flex items-center justify-center text-white">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#F7F6F2] text-[#64748B] border border-[#E5E4DE]">
                      {aud.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-lg text-[#17243A]">
                      {aud.title}
                    </h3>
                    <div className="text-xs font-mono text-[#167D78] mt-0.5">
                      {aud.role}
                    </div>
                  </div>

                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {aud.benefit}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#F7F6F2] mt-6 flex items-center justify-between text-xs font-mono text-[#64748B]">
                  <span>Practical application</span>
                  <span className="text-[#167D78]">✓ Evidence grounded</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
