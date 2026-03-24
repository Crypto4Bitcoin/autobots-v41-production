'use client';

import React from 'react';
import WorldShell from '../../../components/world/WorldShell';
import WorldScaler from '../../../components/world/WorldScaler';
import WorldMobileShell from '../../../components/world/WorldMobileShell';
import WorldTabletShell from '../../../components/world/WorldTabletShell';

export default function WorldPage() {
  return (
    <WorldScaler 
      mobile={<WorldMobileShell />} 
      tablet={<WorldTabletShell />} 
      desktop={<WorldShell />} 
    />
  );
}
