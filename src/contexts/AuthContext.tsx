import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Role = 'employee' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  title: string;
  manager: string;
  ptoBalance: number;
}

interface AuthContextType {
  user: User | null;
  login: (role: Role) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('hr_portal_user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('hr_portal_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('hr_portal_user');
    }
  }, [user]);

  const login = (role: Role) => {
    const newUser: User = role === 'admin' 
      ? {
          id: 'admin-1',
          name: 'HR Admin',
          email: 'admin@lacounty.gov',
          role: 'admin',
          department: 'Human Resources',
          title: 'HR Director',
          manager: 'Chief Executive Officer',
          ptoBalance: 0,
        }
      : {
          id: 'emp-1',
          name: 'John Martinez',
          email: 'john.martinez@lacounty.gov',
          role: 'employee',
          department: 'Public Works',
          title: 'Senior Engineer',
          manager: 'Sarah Chen',
          ptoBalance: 120,
        };
    setUser(newUser);
  };

  const logout = () => setUser(null);

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
