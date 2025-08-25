'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthContext } from '@/hooks/use-auth';
import type { User, Account, Task } from '@/lib/types';
import { auth, db, storage } from '@/lib/firebase';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    writeBatch,
  } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const protectedRoutes = ['/dashboard', '/accounts', '/tasks', '/calendar', '/profile'];
const authRoutes = ['/login', '/signup'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleUser = async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create new user document in Firestore
        const newUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'New User',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL || '/default-avatar.png',
        };
        await setDoc(userRef, newUser);
        setUser(newUser);
      } else {
        setUser(userSnap.data() as User);
      }
      // Fetch user-specific data
      fetchData(firebaseUser.uid);
    } else {
      setUser(null);
      setAccounts([]);
      setTasks([]);
    }
    setIsLoading(false);
  }

  const fetchData = async (userId: string) => {
    const accountsQuery = query(collection(db, "accounts"), where("userId", "==", userId));
    const tasksQuery = query(collection(db, "tasks"), where("userId", "==", userId));

    const [accountsSnapshot, tasksSnapshot] = await Promise.all([
        getDocs(accountsQuery),
        getDocs(tasksQuery)
    ]);

    const tasksData = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
    const accountsData = accountsSnapshot.docs.map(doc => {
        const account = { id: doc.id, ...doc.data() } as Account;
        account.tasks = tasksData.filter(task => task.accountId === account.id);
        return account;
    });

    setAccounts(accountsData);
    setTasks(tasksData);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleUser);
    return () => unsubscribe();
  }, []);

  const handleAuthCheck = useCallback((isAuthenticated: boolean) => {
    if (isLoading) return;

    const isProtectedRoute = protectedRoutes.some(p => pathname.startsWith(p));
    const isAuthRoute = authRoutes.includes(pathname);

    if (!isAuthenticated && isProtectedRoute) {
      router.replace('/login');
    } else if (isAuthenticated && isAuthRoute) {
      router.replace('/dashboard');
    }
  }, [pathname, router, isLoading]);

  useEffect(() => {
    handleAuthCheck(!!user);
  }, [user, handleAuthCheck]);
  
  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signup = async (email: string, pass: string) => {
    await createUserWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const updateUserProfile = async (name: string, file: File | null) => {
    if (!auth.currentUser) throw new Error("Not authenticated");

    let avatarUrl = user?.avatar || '';

    if (file) {
        const storageRef = ref(storage, `avatars/${auth.currentUser.uid}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        avatarUrl = await getDownloadURL(snapshot.ref);
    }

    await updateProfile(auth.currentUser, { displayName: name, photoURL: avatarUrl });
    
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await setDoc(userRef, { name, avatar: avatarUrl }, { merge: true });

    setUser(prevUser => prevUser ? { ...prevUser, name, avatar: avatarUrl } : null);
  }

  const addAccount = async (newAccountData: Omit<Account, 'id' | 'status' | 'performance' | 'lastModified' | 'userId'>) => {
    if (!user) throw new Error("User not authenticated");

    const batch = writeBatch(db);

    const newAccountRef = doc(collection(db, "accounts"));
    const newAccountForDb: Omit<Account, 'id' | 'tasks'> = {
      name: newAccountData.name,
      client: newAccountData.client,
      description: newAccountData.description,
      notes: newAccountData.notes,
      userId: user.id,
      status: 'active',
      performance: Math.floor(Math.random() * 41) + 60,
      lastModified: new Date().toISOString(),
    };
    batch.set(newAccountRef, newAccountForDb);

    const newTasks = newAccountData.tasks.map(task => {
      const newTaskRef = doc(collection(db, "tasks"));
      const newTaskForDb: Omit<Task, 'id'> = {
        ...task,
        accountId: newAccountRef.id,
        accountName: newAccountData.name,
        userId: user.id,
      };
      batch.set(newTaskRef, newTaskForDb);
      return { ...newTaskForDb, id: newTaskRef.id };
    });

    await batch.commit();

    const newAccountForState: Account = {
        ...(newAccountForDb as Account),
        id: newAccountRef.id,
        tasks: newTasks,
    };

    setAccounts(prev => [...prev, newAccountForState]);
    setTasks(prev => [...prev, ...newTasks]);
  };
  
  const updateAccount = async (updatedAccount: Account) => {
    if (!user) throw new Error("User not authenticated");
    const accountRef = doc(db, "accounts", updatedAccount.id);
    const { tasks, ...accountToUpdate } = updatedAccount;
    await updateDoc(accountRef, { ...accountToUpdate, lastModified: new Date().toISOString() });
    setAccounts(prev => prev.map(acc => acc.id === updatedAccount.id ? updatedAccount : acc));
  };

  const updateTask = async (updatedTask: Task) => {
    if (!user) throw new Error("User not authenticated");
    const taskRef = doc(db, "tasks", updatedTask.id);
    await updateDoc(taskRef, updatedTask);
    setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const deleteAccount = async (accountId: string) => {
    if (!user) throw new Error("User not authenticated");
    await deleteDoc(doc(db, "accounts", accountId));
    const tasksToDeleteQuery = query(collection(db, "tasks"), where("accountId", "==", accountId), where("userId", "==", user.id));
    const tasksToDeleteSnapshot = await getDocs(tasksToDeleteQuery);
    const batch = writeBatch(db);
    tasksToDeleteSnapshot.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    setAccounts(prev => prev.filter(acc => acc.id !== accountId));
    setTasks(prev => prev.filter(task => task.accountId !== accountId));
  };

  const deleteTask = async (taskId: string) => {
    if (!user) throw new Error("User not authenticated");
    await deleteDoc(doc(db, "tasks", taskId));
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const value = {
    isAuthenticated: !!user,
    user,
    login,
    signup,
    logout,
    updateUserProfile,
    isLoading,
    accounts,
    tasks,
    addAccount,
    updateAccount,
    updateTask,
    deleteAccount,
    deleteTask,
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
