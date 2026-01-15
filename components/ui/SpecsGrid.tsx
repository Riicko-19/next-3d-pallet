import React from 'react';

export default function SpecsGrid() {
  const specs = [
    { label: "Material", value: "Southern Yellow Pine" },
    { label: "Dimensions", value: '48" x 40"' },
    { label: "Load Capacity", value: "2,800 lbs" },
    { label: "Weight", value: "42 lbs" },
    { label: "Entry", value: "4-Way" },
    { label: "Finish", value: "Heat Treated (ISPM 15)" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-24 bg-zinc-900">
      <h2 className="text-3xl font-bold text-white mb-12 text-center">Technical Specifications</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-800 border border-zinc-800">
        {specs.map((spec, i) => (
          <div key={i} className="bg-zinc-900 p-8 flex flex-col items-center text-center hover:bg-zinc-800/50 transition-colors duration-300">
            <span className="text-zinc-500 text-sm uppercase tracking-wider mb-2">{spec.label}</span>
            <span className="text-white text-xl font-medium">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}