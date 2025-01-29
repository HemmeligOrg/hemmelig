import { IconAt, IconEdit } from '@tabler/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router-dom';

import { updateSettings } from '../../api/settings';
import ErrorBox from '../../components/error-box';
import SuccessBox from '../../components/success-box';
import useSettingsStore from '../../stores/settingsStore';

const Settings = () => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const { t } = useTranslation();
    const adminSettings = useLoaderData();
    const { setSettings } = useSettingsStore();

    const [formData, setFormData] = useState(adminSettings);

    const onUpdateSettings = async (e) => {
        e.preventDefault();

        try {
            const updatedAdminSettings = await updateSettings(formData);

            if (
                updatedAdminSettings.error ||
                [401, 403, 500].includes(updatedAdminSettings.statusCode)
            ) {
                setError(
                    updatedAdminSettings.error
                        ? updatedAdminSettings.error
                        : t('something_went_wrong')
                );
                return;
            }

            setFormData(updatedAdminSettings);
            setSettings(updatedAdminSettings);
            setError(null);
            setSuccess(true);

            setTimeout(() => {
                setSuccess(false);
            }, 2500);
        } catch (err) {
            setError(err);
        }
    };

    if (adminSettings.error || [401, 403, 500].includes(adminSettings.statusCode)) {
        const error = adminSettings.error ? adminSettings.error : t('not_logged_in');

        return (
            <div className="space-y-4">
                <ErrorBox message={error} />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {error && <ErrorBox message={error} />}
            {success && <SuccessBox message={'settings.updated'} />}

            <p className="text-sm text-gray-300">{t('settings.description')}</p>

            <div className="space-y-4">
                {/* Read Only Mode */}
                <div className="flex items-start space-x-3">
                    <input
                        type="checkbox"
                        id="read_only"
                        checked={formData.read_only}
                        onChange={(e) => setFormData({ ...formData, read_only: e.target.checked })}
                        className="mt-1 rounded border-gray-700 bg-gray-800 text-blue-500 
                                 focus:ring-blue-500 focus:ring-offset-gray-900"
                    />
                    <div>
                        <label
                            htmlFor="read_only"
                            className="block text-sm font-medium text-gray-200"
                        >
                            {t('account.settings.read_only_mode')}
                        </label>
                        <p className="text-sm text-gray-400">
                            {t('account.settings.readonly_only_for_non_admin')}
                        </p>
                    </div>
                </div>

                {/* Disable Users */}
                <div className="flex items-start space-x-3">
                    <input
                        type="checkbox"
                        id="disable_users"
                        checked={formData.disable_users}
                        onChange={(e) =>
                            setFormData({ ...formData, disable_users: e.target.checked })
                        }
                        className="mt-1 rounded border-gray-700 bg-gray-800 text-blue-500 
                                 focus:ring-blue-500 focus:ring-offset-gray-900"
                    />
                    <div>
                        <label
                            htmlFor="disable_users"
                            className="block text-sm font-medium text-gray-200"
                        >
                            {t('account.settings.disable_users')}
                        </label>
                        <p className="text-sm text-gray-400">
                            {t('account.settings.disable_signin')}
                        </p>
                    </div>
                </div>

                {/* Disable User Account Creation */}
                <div className="flex items-start space-x-3">
                    <input
                        type="checkbox"
                        id="disable_user_account_creation"
                        checked={formData.disable_user_account_creation}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                disable_user_account_creation: e.target.checked,
                            })
                        }
                        className="mt-1 rounded border-gray-700 bg-gray-800 text-blue-500 
                                 focus:ring-blue-500 focus:ring-offset-gray-900"
                    />
                    <div>
                        <label
                            htmlFor="disable_user_account_creation"
                            className="block text-sm font-medium text-gray-200"
                        >
                            {t('account.settings.disable_user_account_creation')}
                        </label>
                        <p className="text-sm text-gray-400">
                            {t('account.settings.disable_user_account_creation_description')}
                        </p>
                    </div>
                </div>

                {/* Disable allowed IP restriction */}
                <div className="flex items-start space-x-3">
                    <input
                        type="checkbox"
                        id="hide_allowed_ip_input"
                        checked={formData.hide_allowed_ip_input}
                        onChange={(e) =>
                            setFormData({ ...formData, hide_allowed_ip_input: e.target.checked })
                        }
                        className="mt-1 rounded border-gray-700 bg-gray-800 text-blue-500
                                 focus:ring-blue-500 focus:ring-offset-gray-900"
                    />
                    <div>
                        <label
                            htmlFor="hide_allowed_ip_input"
                            className="block text-sm font-medium text-gray-200"
                        >
                            {t('account.settings.hide_allowed_ip_input')}
                        </label>
                        <p className="text-sm text-gray-400">
                            {t('account.settings.hide_allowed_ip_input_description')}
                        </p>
                    </div>
                </div>

                {/* Disable File Upload */}
                <div className="flex items-start space-x-3">
                    <input
                        type="checkbox"
                        id="disable_file_upload"
                        checked={formData.disable_file_upload}
                        onChange={(e) =>
                            setFormData({ ...formData, disable_file_upload: e.target.checked })
                        }
                        className="mt-1 rounded border-gray-700 bg-gray-800 text-blue-500 
                                 focus:ring-blue-500 focus:ring-offset-gray-900"
                    />
                    <div>
                        <label
                            htmlFor="disable_file_upload"
                            className="block text-sm font-medium text-gray-200"
                        >
                            {t('account.settings.disable_file_upload')}
                        </label>
                        <p className="text-sm text-gray-400">
                            {t('account.settings.disable_file_upload_description')}
                        </p>
                    </div>
                </div>

                {/* Restrict Organization Email */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-200">
                        {t('account.settings.restrict_organization_email')}
                    </label>
                    <p className="text-sm text-gray-400 mb-2">
                        {t('account.settings.restrict_organization_email_description')}
                    </p>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                            <IconAt size={14} />
                        </span>
                        <input
                            type="text"
                            placeholder="example.com"
                            value={formData.restrict_organization_email}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    restrict_organization_email: e.target.value,
                                })
                            }
                            className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 
                                     rounded-md text-gray-100 placeholder-gray-500
                                     focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Update Button */}
            <div className="flex justify-end mt-6">
                <button
                    onClick={onUpdateSettings}
                    disabled={success}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md
                             hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                             focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50
                             disabled:cursor-not-allowed transition-colors"
                >
                    <IconEdit size={14} />
                    {t('settings.update')}
                </button>
            </div>
        </div>
    );
};

export default Settings;
