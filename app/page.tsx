'use client';

import { useState } from 'react';
import PalletAssembly from '@/components/canvas/PalletAssembly';
import BackgroundPaths from '@/components/ui/modern-background-paths';

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);

  if (!hasStarted) {
    return (
      <BackgroundPaths
        title="Ambica Patterns"
        onStart={() => setHasStarted(true)}
      />
    );
  }

  return <PalletAssembly />;
}