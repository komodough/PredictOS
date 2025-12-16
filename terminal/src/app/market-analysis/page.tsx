"use client";

import Terminal from "@/components/Terminal";
import Sidebar from "@/components/Sidebar";

export default function MarketAnalysisPage() {
  return (
    <div className="flex h-screen">
      {/* Sidebar Navigation */}
      <div className="relative z-10 overflow-visible">
        <Sidebar activeTab="analysis" />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <Terminal />
      </main>
    </div>
  );
}

