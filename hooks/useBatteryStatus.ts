'use client';

import { useState } from 'react';

export function useBatteryStatus() {
  const [batteryLevel] = useState(98);
  const [isCharging] = useState(true);

  return { batteryLevel, isCharging };
}
