// src/context/AuthContext.jsx
// Studio Authentication & Session Management Context
// Preserves user accounts, session state, credentials, and role-based permissions in localStorage.

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const DEFAULT_USER = {
  id: 'usr_studio_exec_01',
  name: 'Vikramaditya Roy',
  email: 'v.roy@hombale-mythri.studios',
  role: 'Studio Executive',
  roleBadge: 'Executive Board',
  studio: 'Pan-Indian Theatrical Syndicate',
  accessLevel: 'TIER-1_UNRESTRICTED',
  avatar: 'VR',
  verifiedAt: '2026-09-26T18:30:00Z',
  permissions: ['view_all', 'dispatch_war_room', 'export_intelligence', 'override_threat_level']
};

export const AVAILABLE_ROLES = [
  {
    role: 'Studio Executive',
    roleBadge: 'Executive Board',
    description: 'Full unconstrained access to Pan-India theatrical intelligence, exposure models, and war-room dispatch.',
    avatar: 'VR',
    email: 'executive@cinema-damage-control.com'
  },
  {
    role: 'Lead Producer',
    roleBadge: 'Production House',
    description: 'Focused visibility on active release budgets, circuit distribution friction, and Monday hold forecast.',
    avatar: 'LP',
    email: 'producer@mythri-studios.in'
  },
  {
    role: 'Crisis PR Strategist',
    roleBadge: 'Damage Control Lead',
    description: 'Deep narrative de-biasing, review bot brigade tracking, and social counter-strategy deployment.',
    avatar: 'CP',
    email: 'pr.command@theatricintelligence.com'
  },
  {
    role: 'Trade Analyst',
    roleBadge: 'Verified Trade Desk',
    description: 'Financial claim reconciliation, Sacnilk/BMS cross-verification, and occupancy trending.',
    avatar: 'TA',
    email: 'analyst@sacnilk-corroboration.in'
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('cdc_authenticated_user');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse stored user session:', e);
    }
    return DEFAULT_USER; // Default to authenticated Studio Executive session
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Keep session synced with localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('cdc_authenticated_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('cdc_authenticated_user');
      }
    } catch (e) {
      console.warn('Storage sync failed:', e);
    }
  }, [user]);

  // Login handler with credential authentication
  const login = (email, password, selectedRole = 'Studio Executive') => {
    const roleConfig = AVAILABLE_ROLES.find(r => r.role === selectedRole) || AVAILABLE_ROLES[0];
    const newUser = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Studio Executive',
      email: email || roleConfig.email,
      role: roleConfig.role,
      roleBadge: roleConfig.roleBadge,
      studio: 'Pan-Indian Theatrical Syndicate',
      accessLevel: 'TIER-1_UNRESTRICTED',
      avatar: roleConfig.avatar,
      verifiedAt: new Date().toISOString(),
      permissions: ['view_all', 'dispatch_war_room', 'export_intelligence', 'override_threat_level']
    };
    setUser(newUser);
    setAuthModalOpen(false);
    return { success: true, user: newUser };
  };

  // Switch role seamlessly without losing session
  const switchRole = (roleName) => {
    const roleConfig = AVAILABLE_ROLES.find(r => r.role === roleName);
    if (!roleConfig) return;
    setUser(prev => ({
      ...prev,
      role: roleConfig.role,
      roleBadge: roleConfig.roleBadge,
      avatar: roleConfig.avatar,
      email: roleConfig.email
    }));
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('cdc_authenticated_user');
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        logout,
        switchRole,
        authModalOpen,
        setAuthModalOpen,
        availableRoles: AVAILABLE_ROLES
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
