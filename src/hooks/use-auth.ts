import { createContext, useContext } from 'react';
import type { User, Account, Task } from '@/lib/types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (name: string, file: File | null) => Promise<void>;
  isLoading: boolean;
  accounts: Account[];
  tasks: Task[];
  addAccount: (account: Omit<Account, 'id' | 'status' | 'performance' | 'lastModified' | 'userId'>) => void;
  updateAccount: (account: Account) => void;
  updateTask: (task: Task) => void;
  deleteAccount: (accountId: string) => void;
  deleteTask: (taskId: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
