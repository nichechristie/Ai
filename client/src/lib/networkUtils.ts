// Network utility functions

export function generateSignalData(numBars: number = 7, minHeight: number = 10, maxHeight: number = 90): number[] {
  const result = [];
  for (let i = 0; i < numBars; i++) {
    result.push(Math.floor(Math.random() * (maxHeight - minHeight) + minHeight));
  }
  return result;
}

export function calculateAverageSignal(signalData: number[]): number {
  if (signalData.length === 0) return 0;
  const sum = signalData.reduce((acc, val) => acc + val, 0);
  return Math.round(sum / signalData.length);
}

export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes % 60}m`;
  
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}

export function formatPeerId(peerId: string): string {
  if (!peerId) return '';
  if (peerId.length <= 10) return peerId;
  return `${peerId.substring(0, 6)}...${peerId.substring(peerId.length - 4)}`;
}

export function getSignalQuality(strength: number): 'high' | 'medium' | 'low' {
  if (strength >= 70) return 'high';
  if (strength >= 40) return 'medium';
  return 'low';
}

export function generateMockPeers(count: number = 5): any[] {
  const statuses = ['Active', 'Unstable', 'Inactive'];
  const peers = [];
  
  for (let i = 0; i < count; i++) {
    const signalStrength = Math.floor(Math.random() * 100);
    const statusIndex = Math.min(
      Math.floor(signalStrength / 40), 
      statuses.length - 1
    );
    
    peers.push({
      peerId: `0x${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
      walletAddress: `0x${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
      signalStrength,
      uptime: formatDuration(Math.floor(Math.random() * 86400)),
      status: statuses[statusIndex],
      lastSeen: new Date(),
      dataRelayed: Math.floor(Math.random() * 1024 * 1024 * 10)
    });
  }
  
  return peers;
}