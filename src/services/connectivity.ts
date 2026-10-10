/**
 * Connectivity & Offline Awareness Service
 * Russia AI Support - Core Principle: Offline-First
 */
type ConnectivityListener = (isOnline: boolean) => void;

class ConnectivityService {
  private isOnline: boolean;
  private listeners: Set<ConnectivityListener> = new Set();

  constructor() {
    this.isOnline =
      typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
        ? navigator.onLine
        : true;

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleStatusChange(true));
      window.addEventListener('offline', () => this.handleStatusChange(false));
    }
  }

  public getStatus(): boolean {
    return this.isOnline;
  }

  public subscribe(listener: ConnectivityListener): () => void {
    this.listeners.add(listener);
    // emit current state immediately
    listener(this.isOnline);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public setSimulatedStatus(status: boolean): void {
    this.handleStatusChange(status);
  }

  private handleStatusChange(status: boolean) {
    this.isOnline = status;
    this.listeners.forEach((listener) => {
      try {
        listener(status);
      } catch (err) {
        console.error('Error in connectivity listener', err);
      }
    });
  }
}

export const connectivityService = new ConnectivityService();
