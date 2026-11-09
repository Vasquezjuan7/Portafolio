'use client';

import { useState } from 'react';
import { copyToClipboard } from '../utils/clipboard';

export function useClipboard(timeoutMs = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), timeoutMs);
    }
    return success;
  };

  return { copied, copy };
}
