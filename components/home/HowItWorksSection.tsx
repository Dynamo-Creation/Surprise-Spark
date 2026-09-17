import React from "react";
import { Sparkles, Palette, Camera, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function HowItWorksSection() {
  const steps = [
    {
      stepNumber: "01",
      icon: Palette,
      title: "Choose a 3D World",
      description:
        "Select a celebration scene: glowing birthday cakes, floating lanterns, whimsical pastel parties, or romantic starfields.",
      accent: "from-pink-500 to-rose-500",
    },
    {
      stepNumber: "02",
      icon: Camera,
      title: "Add Secret Memories",
      description:
        "Upload photos, write a heartfelt personal note, choose background music, and add interactive surprises to blow or tap.",
      accent: "from-purple-500 to-indigo-500",
    },
    {
      stepNumber: "03",
      icon: Share2,
      title: "Send The Magic Link",
      description:
        "Your recipient opens a personalized link on phone or browser. No app install needed. Just instant delight and emotion.",
      accent: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <Badge variant="secondary" size="md">
          <Sparkles className="w-3.5 h-3.5 text-pink-500 shrink-0" />
          <span>Seamless Creation</span>
        </Badge>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How A Surprise Comes To Life
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          In 3 simple steps, turn a routine greeting into an interactive memory they will cherish forever.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {steps.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.stepNumber}
              className="relative rounded-3xl p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${item.accent} flex items-center justify-center text-white shadow-md`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-3xl font-black text-slate-200 dark:text-slate-800">
                    {item.stepNumber}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-xs font-semibold text-pink-600 dark:text-pink-400">
                <span>Step {index + 1} of 3</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
