
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData?: any) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email || 'No user');
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          ensureProfileExists(session.user);
        }, 0);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email || 'No user');
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            ensureProfileExists(session.user);
          }, 0);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const ensureProfileExists = async (authUser: User) => {
    try {
      console.log('Ensuring profile exists for:', authUser.email);
      
      // Always force admin role for lshot.crypto@gmail.com
      if (authUser.email === 'lshot.crypto@gmail.com') {
        console.log('FORCE UPDATING ADMIN ROLE for lshot.crypto@gmail.com');
        
        // Upsert profile with admin role
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert({
            id: authUser.id,
            username: authUser.email?.split('@')[0] || 'admin',
            first_name: authUser.user_metadata?.first_name || 'Admin',
            last_name: authUser.user_metadata?.last_name || 'User',
            role: 'admin'
          }, {
            onConflict: 'id'
          });

        if (upsertError) {
          console.error('Error upserting admin profile:', upsertError);
        } else {
          console.log('ADMIN PROFILE UPSERTED SUCCESSFULLY');
        }
        return;
      }

      // For other users, check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (!existingProfile) {
        // Create profile for non-admin users
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: authUser.id,
            username: authUser.email?.split('@')[0] || 'user',
            first_name: authUser.user_metadata?.first_name || '',
            last_name: authUser.user_metadata?.last_name || '',
            role: 'user'
          });

        if (error) {
          console.error('Error creating profile:', error);
        } else {
          console.log('Profile created successfully for:', authUser.email);
        }
      }
    } catch (error) {
      console.error('Error in ensureProfileExists:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      console.log('Login successful for:', email);
      toast({
        title: "Welcome back!",
        description: "You have been logged in successfully.",
      });
    } catch (error: any) {
      console.error('Login failed:', error);
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, userData: any = {}) => {
    try {
      console.log('Attempting registration for:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.first_name || '',
            last_name: userData.last_name || ''
          },
        },
      });

      if (error) {
        console.error('Registration error:', error);
        throw error;
      }

      console.log('Registration successful for:', email);
      toast({
        title: "Account Created",
        description: "Your account has been created successfully.",
      });
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out user...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log('Logout successful');
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isLoading: loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
