import React from 'react';
import { Badge } from '@/components/ui/badge';

interface NetworkStatusProps {
  connected: boolean;
  peerCount: number;
}

export default function NetworkStatus({ connected, peerCount }: NetworkStatusProps) {
  return (
    <div className="flex items-center space-x-2">
      <Badge variant={connected ? "success" : "destructive"}>
        {connected ? "Connected" : "Disconnected"}
      </Badge>
      <span className="text-sm">
        {peerCount} {peerCount === 1 ? 'peer' : 'peers'} connected
      </span>
    </div>
  );
}