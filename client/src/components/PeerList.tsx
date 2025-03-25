import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPeerId, getSignalQuality } from '@/lib/networkUtils';

export interface PeerListProps {
  peers: Array<{
    peerId: string;
    signalStrength: number;
    uptime: string;
    status: 'Active' | 'Unstable' | 'Inactive';
  }>;
  onPing: (peerId: string) => void;
  onDisconnect: (peerId: string) => void;
}

export function PeerList({ peers, onPing, onDisconnect }: PeerListProps) {
  if (peers.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No peers connected</div>;
  }

  return (
    <div className="space-y-3">
      {peers.map((peer) => {
        const signalQuality = getSignalQuality(peer.signalStrength);
        return (
          <div key={peer.peerId} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-medium">{formatPeerId(peer.peerId)}</div>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant={peer.status === 'Active' ? "outline" : "secondary"}>
                  {peer.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Signal: <span className={`text-${signalQuality}`}>{peer.signalStrength}%</span>
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Uptime: {peer.uptime}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={() => onPing(peer.peerId)}>
                Ping
              </Button>
              <Button size="sm" variant="outline" onClick={() => onDisconnect(peer.peerId)}>
                Disconnect
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}