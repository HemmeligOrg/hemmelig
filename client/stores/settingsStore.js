import { create } from 'zustand';

const useSettingsStore = create((set) => ({
    settings: {
        disable_users: false,
        disable_user_account_creation: false,
        read_only: false,
        disable_file_upload: false,
        restrict_organization_email: '',
        hide_allowed_ip_input: true,
    },
    isLoading: true,
    error: null,
    setSettings: (settings) => set({ settings, isLoading: false, error: null }),
    setError: (error) => set({ error, isLoading: false }),
    setLoading: (isLoading) => set({ isLoading }),
}));

export default useSettingsStore;
