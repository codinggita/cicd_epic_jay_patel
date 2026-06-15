'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { useToastStore } from '../../store/toastStore';
import Navbar from '../../components/layout/navbar';
import Footer from '../../components/layout/footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { 
  User as UserIcon, 
  Lock, 
  ShieldAlert, 
  Monitor, 
  Trash2, 
  Check, 
  Copy, 
  QrCode, 
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

// Zod schemas for validation
const profileSchema = zod.object({
  name: zod.string().min(2, 'Name must be at least 2 characters'),
  email: zod.string().email('Invalid email address'),
});

const passwordSchema = zod.object({
  currentPassword: zod.string().min(6, 'Password must be at least 6 characters'),
  newPassword: zod.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: zod.string().min(6, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ProfileFormValues = zod.infer<typeof profileSchema>;
type PasswordFormValues = zod.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { 
    user, 
    useUserProfileQuery, 
    useSessionsQuery, 
    useUpdateProfileMutation, 
    useChangePasswordMutation, 
    useToggle2FAMutation, 
    useDeleteAccountMutation,
    useRevokeSessionMutation 
  } = useAuth();
  
  const { addToast } = useToastStore();
  
  const [copiedText, setCopiedText] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState<{ secret: string; qrCodeMock: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize profile values
  useUserProfileQuery(true);

  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors, isSubmitting: isSubmittingProfile }, reset: resetProfile } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    }
  });

  // Keep form in sync when user loads
  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, resetProfile]);

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword }, reset: resetPassword } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema)
  });

  // Fetch active sessions
  const { data: sessions = [], isLoading: loadingSessions } = useSessionsQuery(true);

  // Revoke session mutation
  const revokeSessionMutation = useRevokeSessionMutation();

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await revokeSessionMutation.mutateAsync(sessionId);
      addToast('Session revoked successfully', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to revoke session', 'error');
    }
  };

  const updateProfileMutation = useUpdateProfileMutation();
  const onUpdateProfile = async (data: ProfileFormValues) => {
    try {
      await updateProfileMutation.mutateAsync({ name: data.name, email: data.email });
      addToast('Profile updated successfully', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to update profile', 'error');
    }
  };

  const changePasswordMutation = useChangePasswordMutation();
  const onChangePassword = async (data: PasswordFormValues) => {
    try {
      await changePasswordMutation.mutateAsync({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      addToast('Password changed successfully', 'success');
      resetPassword();
    } catch (err: any) {
      addToast(err.message || 'Failed to change password', 'error');
    }
  };

  const toggle2FAMutation = useToggle2FAMutation();
  const handleToggle2FA = async () => {
    try {
      if (user?.twoFactorEnabled) {
        await toggle2FAMutation.mutateAsync(false);
        setTwoFactorData(null);
        addToast('Multi-factor authentication (2FA) disabled', 'info');
      } else {
        const res = await toggle2FAMutation.mutateAsync(true);
        setTwoFactorData(res);
        addToast('2FA setup initialized. Copy secret to configure Authenticator App.', 'success');
      }
    } catch (err: any) {
      addToast(err.message || 'Failed to toggle 2FA', 'error');
    }
  };

  const handleCopySecret = () => {
    if (twoFactorData?.secret) {
      navigator.clipboard.writeText(twoFactorData.secret);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
      addToast('Secret key copied to clipboard', 'success');
    }
  };

  const deleteAccountMutation = useDeleteAccountMutation();
  const handleDeleteAccount = async () => {
    if (window.confirm('CRITICAL WARNING: Are you absolutely sure you want to delete your account? This action is irreversible and all your bookmarks and settings will be permanently destroyed.')) {
      setIsDeleting(true);
      try {
        await deleteAccountMutation.mutateAsync();
        addToast('Account deleted successfully. Goodbye!', 'info');
      } catch (err: any) {
        addToast(err.message || 'Failed to delete account', 'error');
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-white">
      <Navbar />

      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Account Settings
          </h1>
          <p className="text-sm text-slate-400">
            Manage your DevOpsPulse profile configurations, security access keys, active user sessions, and credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Card & Delete Account */}
          <div className="lg:col-span-2 space-y-8 animate-fade-in">
            {/* Profile Information Panel */}
            <Card className="glass shadow-xl border-slate-800/80">
              <CardHeader className="border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">Profile Details</CardTitle>
                    <CardDescription className="text-xs">Update your basic display credentials and email verification settings.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-400">Display Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        {...registerProfile('name')}
                        className={`w-full bg-slate-900 border ${profileErrors.name ? 'border-rose-500' : 'border-slate-800'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors`}
                      />
                      {profileErrors.name && (
                        <p className="text-xs text-rose-400 mt-0.5">{profileErrors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-400">Email Address</label>
                      <input
                        type="email"
                        placeholder="john.doe@example.com"
                        {...registerProfile('email')}
                        className={`w-full bg-slate-900 border ${profileErrors.email ? 'border-rose-500' : 'border-slate-800'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors`}
                      />
                      {profileErrors.email && (
                        <p className="text-xs text-rose-400 mt-0.5">{profileErrors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingProfile}
                      className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700 disabled:opacity-50 text-white font-medium text-sm px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {isSubmittingProfile && <RefreshCw className="w-4 h-4 animate-spin" />}
                      Save Changes
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Password Changes Panel */}
            <Card className="glass shadow-xl border-slate-800/80">
              <CardHeader className="border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">Change Password</CardTitle>
                    <CardDescription className="text-xs">Update your credentials regularly to guarantee access isolation.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      {...registerPassword('currentPassword')}
                      className={`w-full bg-slate-900 border ${passwordErrors.currentPassword ? 'border-rose-500' : 'border-slate-800'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors`}
                    />
                    {passwordErrors.currentPassword && (
                      <p className="text-xs text-rose-400 mt-0.5">{passwordErrors.currentPassword.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-400">New Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        {...registerPassword('newPassword')}
                        className={`w-full bg-slate-900 border ${passwordErrors.newPassword ? 'border-rose-500' : 'border-slate-800'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors`}
                      />
                      {passwordErrors.newPassword && (
                        <p className="text-xs text-rose-400 mt-0.5">{passwordErrors.newPassword.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-400">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        {...registerPassword('confirmPassword')}
                        className={`w-full bg-slate-900 border ${passwordErrors.confirmPassword ? 'border-rose-500' : 'border-slate-800'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors`}
                      />
                      {passwordErrors.confirmPassword && (
                        <p className="text-xs text-rose-400 mt-0.5">{passwordErrors.confirmPassword.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingPassword}
                      className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700 disabled:opacity-50 text-white font-medium text-sm px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {isSubmittingPassword && <RefreshCw className="w-4 h-4 animate-spin" />}
                      Change Password
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Active Sessions Panel */}
            <Card className="glass shadow-xl border-slate-800/80">
              <CardHeader className="border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">Active Device Sessions</CardTitle>
                    <CardDescription className="text-xs">Identify and revoke credentials for concurrent browser access tunnels.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {loadingSessions ? (
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-full rounded-lg" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                  </div>
                ) : sessions.length === 0 ? (
                  <p className="text-slate-400 text-sm py-2">No active sessions located.</p>
                ) : (
                  <div className="space-y-4">
                    {sessions.map((sess) => (
                      <div key={sess._id} className="flex items-center justify-between p-3 rounded-lg border border-slate-850 bg-slate-900/30">
                        <div className="flex items-start gap-3">
                          <div className="p-1.5 rounded bg-slate-800 text-slate-400 mt-0.5">
                            <Monitor className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{sess.device}</p>
                            <div className="flex items-center gap-3 text-xs text-slate-400">
                              <span>IP: {sess.ip}</span>
                              <span>•</span>
                              <span>Active: {new Date(sess.lastActive).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Revoke Option */}
                        <button
                          onClick={() => handleRevokeSession(sess._id)}
                          disabled={revokeSessionMutation.isPending}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 transition-all cursor-pointer"
                          title="Terminate Session"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Security Center & Delete Option */}
          <div className="space-y-8">
            {/* MFA Panel */}
            <Card className="glass shadow-xl border-slate-800/80">
              <CardHeader className="border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">Security Center</CardTitle>
                    <CardDescription className="text-xs">Fortify your DevOps access using multi-factor configuration.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">Authenticator App (TOTP)</p>
                    <p className="text-xs text-slate-400">Protect logins with dynamic codes.</p>
                  </div>
                  <button
                    onClick={handleToggle2FA}
                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      user?.twoFactorEnabled 
                        ? 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-600/30'
                        : 'bg-indigo-600 hover:bg-indigo-505 text-white'
                    }`}
                  >
                    {user?.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                  </button>
                </div>

                {/* Secret Key QR Display */}
                {twoFactorData && (
                  <div className="p-4 rounded-lg bg-slate-900 border border-slate-800/80 space-y-4 animate-slide-up">
                    <p className="text-xs text-indigo-400 font-bold flex items-center gap-1">
                      <QrCode className="w-3.5 h-3.5" /> TOTP Configuration Required
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Scan the mock QR code or enter the secret key in your Google Authenticator or Authy app.
                    </p>

                    {/* QR Placeholder Icon / Mock Visual */}
                    <div className="w-full aspect-square max-w-[150px] mx-auto bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center flex-col text-slate-500 gap-1.5 p-3">
                      <QrCode className="w-12 h-12 text-indigo-500 animate-pulse" />
                      <span className="text-[10px] uppercase tracking-wider font-bold">Pulse 2FA Active</span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Secret Key</label>
                      <div className="flex items-center gap-2 bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5">
                        <code className="text-xs font-mono text-indigo-300 flex-grow select-all overflow-hidden truncate">
                          {twoFactorData.secret}
                        </code>
                        <button
                          onClick={handleCopySecret}
                          className="text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
                        >
                          {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Critical Operations (Danger Zone) */}
            <Card className="glass shadow-xl border-rose-950 bg-rose-950/5">
              <CardHeader className="border-b border-rose-950/40 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-rose-400">Danger Zone</CardTitle>
                    <CardDescription className="text-xs text-rose-500/70">Destructive, non-revertible actions concerning your account.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Once deleted, your account references, catalog comments, ratings, and saved workspace bookmarks will be irreversibly purged.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="w-full bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold py-2.5 rounded-lg border border-rose-500/20 shadow-md shadow-rose-950/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    Permanently Delete Account
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
