import { IconFingerprint, IconInfoCircle } from '@tabler/icons';
import { Link } from 'react-router-dom';

const ApiDocs = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="space-y-8">
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">API Documentation</h1>
                    <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
                        <IconInfoCircle size={16} />
                        Work in Progress
                    </div>
                </div>
                <p className="text-gray-400 mb-8">
                    This documentation is currently being developed and may be incomplete or subject
                    to changes.
                </p>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">
                        How can I use Hemmelig programmatically?
                    </h2>
                    <p className="text-gray-300 leading-relaxed">
                        First, you need to{' '}
                        <Link
                            to="/signin"
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            create an account
                        </Link>{' '}
                        to obtain your basic auth token.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">Authentication</h2>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1 text-blue-400">
                                <IconFingerprint size={20} />
                            </div>
                            <div className="space-y-2">
                                <p className="text-gray-300">
                                    All API endpoints require Basic Authentication. Use your API
                                    token as the username and any value (or empty) as the password.
                                </p>
                                <pre className="bg-gray-900/50 p-3 rounded-md text-gray-300 overflow-x-auto">
                                    <code>Authorization: Basic {'{base64(api_token:)}'}</code>
                                </pre>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">Endpoints</h2>

                    {/* Secret Endpoints */}
                    <div className="bg-gray-800/50 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-white mb-4">Secret Management</h3>
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div>
                                    <span className="inline-block px-2 py-1 text-sm font-medium bg-green-500/20 text-green-400 rounded">
                                        POST
                                    </span>
                                    <span className="ml-2 text-gray-300">/api/v1/secret</span>
                                </div>
                                <p className="text-gray-300 text-sm">Create a new secret</p>
                                <pre className="bg-gray-900/50 p-3 rounded-md text-gray-300 overflow-x-auto">
                                    <code>
                                        {JSON.stringify(
                                            {
                                                text: 'Your secret message',
                                                ttl: 86400, // Time in seconds
                                                password: 'optional_password',
                                                title: 'optional_title',
                                                maxViews: 1,
                                                allowedIp: 'optional_ip_or_cidr',
                                                preventBurn: false,
                                                isPublic: false,
                                                files: [], // Optional array of files
                                            },
                                            null,
                                            2
                                        )}
                                    </code>
                                </pre>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <span className="inline-block px-2 py-1 text-sm font-medium bg-blue-500/20 text-blue-400 rounded">
                                        GET
                                    </span>
                                    <span className="ml-2 text-gray-300">/api/v1/secret/:id</span>
                                </div>
                                <p className="text-gray-300 text-sm">Retrieve a secret by ID</p>
                                <pre className="bg-gray-900/50 p-3 rounded-md text-gray-300 overflow-x-auto">
                                    <code>
                                        {JSON.stringify(
                                            {
                                                password: 'optional_if_protected',
                                            },
                                            null,
                                            2
                                        )}
                                    </code>
                                </pre>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <span className="inline-block px-2 py-1 text-sm font-medium bg-blue-500/20 text-blue-400 rounded">
                                        GET
                                    </span>
                                    <span className="ml-2 text-gray-300">
                                        /api/v1/secret/:id/exist
                                    </span>
                                </div>
                                <p className="text-gray-300 text-sm">
                                    Check if a secret exists and get its view count
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <span className="inline-block px-2 py-1 text-sm font-medium bg-red-500/20 text-red-400 rounded">
                                        POST
                                    </span>
                                    <span className="ml-2 text-gray-300">
                                        /api/v1/secret/:id/burn
                                    </span>
                                </div>
                                <p className="text-gray-300 text-sm">Delete a secret immediately</p>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <span className="inline-block px-2 py-1 text-sm font-medium bg-blue-500/20 text-blue-400 rounded">
                                        GET
                                    </span>
                                    <span className="ml-2 text-gray-300">
                                        /api/v1/secret/public/
                                    </span>
                                </div>
                                <p className="text-gray-300 text-sm">List all public secrets</p>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <span className="inline-block px-2 py-1 text-sm font-medium bg-blue-500/20 text-blue-400 rounded">
                                        GET
                                    </span>
                                    <span className="ml-2 text-gray-300">
                                        /api/v1/secret/public/:username
                                    </span>
                                </div>
                                <p className="text-gray-300 text-sm">
                                    List public secrets for a specific user
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* File Endpoints */}
                    <div className="bg-gray-800/50 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-white mb-4">File Management</h3>
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div>
                                    <span className="inline-block px-2 py-1 text-sm font-medium bg-green-500/20 text-green-400 rounded">
                                        POST
                                    </span>
                                    <span className="ml-2 text-gray-300">/api/v1/download</span>
                                </div>
                                <p className="text-gray-300 text-sm">Download a file</p>
                                <pre className="bg-gray-900/50 p-3 rounded-md text-gray-300 overflow-x-auto">
                                    <code>
                                        {JSON.stringify(
                                            {
                                                key: 'file_key',
                                                secretId: 'secret_id',
                                            },
                                            null,
                                            2
                                        )}
                                    </code>
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* Account Endpoints */}
                    <div className="bg-gray-800/50 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-white mb-4">Account Management</h3>
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div>
                                    <span className="inline-block px-2 py-1 text-sm font-medium bg-blue-500/20 text-blue-400 rounded">
                                        GET
                                    </span>
                                    <span className="ml-2 text-gray-300">/api/v1/account</span>
                                </div>
                                <p className="text-gray-300 text-sm">Get account details</p>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <span className="inline-block px-2 py-1 text-sm font-medium bg-yellow-500/20 text-yellow-400 rounded">
                                        PUT
                                    </span>
                                    <span className="ml-2 text-gray-300">
                                        /api/v1/account/update
                                    </span>
                                </div>
                                <pre className="bg-gray-900/50 p-3 rounded-md text-gray-300 overflow-x-auto">
                                    <code>
                                        {JSON.stringify(
                                            {
                                                currentPassword: 'required',
                                                newPassword: 'optional',
                                                confirmNewPassword: 'required_if_new_password',
                                                email: 'optional',
                                                generated: false,
                                            },
                                            null,
                                            2
                                        )}
                                    </code>
                                </pre>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <span className="inline-block px-2 py-1 text-sm font-medium bg-red-500/20 text-red-400 rounded">
                                        POST
                                    </span>
                                    <span className="ml-2 text-gray-300">
                                        /api/v1/account/delete
                                    </span>
                                </div>
                                <p className="text-gray-300 text-sm">Delete account</p>
                            </div>
                        </div>
                    </div>

                    {/* Authentication Endpoints */}
                    <div className="bg-gray-800/50 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-white mb-4">Authentication</h3>
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div>
                                    <span className="inline-block px-2 py-1 text-sm font-medium bg-green-500/20 text-green-400 rounded">
                                        POST
                                    </span>
                                    <span className="ml-2 text-gray-300">
                                        /api/v1/authentication/signup
                                    </span>
                                </div>
                                <pre className="bg-gray-900/50 p-3 rounded-md text-gray-300 overflow-x-auto">
                                    <code>
                                        {JSON.stringify(
                                            {
                                                email: 'required',
                                                username: 'required (4-20 chars)',
                                                password: 'required (5-50 chars)',
                                            },
                                            null,
                                            2
                                        )}
                                    </code>
                                </pre>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <span className="inline-block px-2 py-1 text-sm font-medium bg-green-500/20 text-green-400 rounded">
                                        POST
                                    </span>
                                    <span className="ml-2 text-gray-300">
                                        /api/v1/authentication/signin
                                    </span>
                                </div>
                                <pre className="bg-gray-900/50 p-3 rounded-md text-gray-300 overflow-x-auto">
                                    <code>
                                        {JSON.stringify(
                                            {
                                                username: 'required',
                                                password: 'required',
                                            },
                                            null,
                                            2
                                        )}
                                    </code>
                                </pre>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <span className="inline-block px-2 py-1 text-sm font-medium bg-green-500/20 text-green-400 rounded">
                                        POST
                                    </span>
                                    <span className="ml-2 text-gray-300">
                                        /api/v1/authentication/signout
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <span className="inline-block px-2 py-1 text-sm font-medium bg-blue-500/20 text-blue-400 rounded">
                                        GET
                                    </span>
                                    <span className="ml-2 text-gray-300">
                                        /api/v1/authentication/verify
                                    </span>
                                </div>
                                <p className="text-gray-300 text-sm">
                                    Verify authentication status
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <span className="inline-block px-2 py-1 text-sm font-medium bg-blue-500/20 text-blue-400 rounded">
                                        GET
                                    </span>
                                    <span className="ml-2 text-gray-300">
                                        /api/v1/authentication/refresh
                                    </span>
                                </div>
                                <p className="text-gray-300 text-sm">
                                    Refresh authentication token
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Admin Endpoints */}
                    <div className="bg-gray-800/50 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-white mb-4">
                            Admin (Requires Admin Role)
                        </h3>
                        <div className="space-y-6">
                            {/* User Management */}
                            <div className="space-y-3">
                                <h4 className="text-md font-medium text-white">User Management</h4>
                                <div>
                                    <span className="inline-block px-2 py-1 text-sm font-medium bg-blue-500/20 text-blue-400 rounded">
                                        GET
                                    </span>
                                    <span className="ml-2 text-gray-300">/api/v1/admin/users</span>
                                </div>
                                <p className="text-gray-300 text-sm">
                                    List all users (supports pagination with skip/take)
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <span className="inline-block px-2 py-1 text-sm font-medium bg-green-500/20 text-green-400 rounded">
                                        POST
                                    </span>
                                    <span className="ml-2 text-gray-300">/api/v1/admin/users</span>
                                </div>
                                <pre className="bg-gray-900/50 p-3 rounded-md text-gray-300 overflow-x-auto">
                                    <code>
                                        {JSON.stringify(
                                            {
                                                username: 'required',
                                                password: 'required',
                                                email: 'required',
                                                role: 'optional (default: user)',
                                                generated: 'optional (default: true)',
                                            },
                                            null,
                                            2
                                        )}
                                    </code>
                                </pre>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <span className="inline-block px-2 py-1 text-sm font-medium bg-yellow-500/20 text-yellow-400 rounded">
                                        PUT
                                    </span>
                                    <span className="ml-2 text-gray-300">/api/v1/admin/users</span>
                                </div>
                                <pre className="bg-gray-900/50 p-3 rounded-md text-gray-300 overflow-x-auto">
                                    <code>
                                        {JSON.stringify(
                                            {
                                                username: 'required',
                                                email: 'optional',
                                                role: 'optional',
                                            },
                                            null,
                                            2
                                        )}
                                    </code>
                                </pre>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <span className="inline-block px-2 py-1 text-sm font-medium bg-red-500/20 text-red-400 rounded">
                                        DELETE
                                    </span>
                                    <span className="ml-2 text-gray-300">/api/v1/admin/users</span>
                                </div>
                                <pre className="bg-gray-900/50 p-3 rounded-md text-gray-300 overflow-x-auto">
                                    <code>
                                        {JSON.stringify(
                                            {
                                                username: 'required',
                                            },
                                            null,
                                            2
                                        )}
                                    </code>
                                </pre>
                            </div>

                            {/* Settings Management */}
                            <div className="space-y-3">
                                <h4 className="text-md font-medium text-white">
                                    Settings Management
                                </h4>
                                <div>
                                    <span className="inline-block px-2 py-1 text-sm font-medium bg-blue-500/20 text-blue-400 rounded">
                                        GET
                                    </span>
                                    <span className="ml-2 text-gray-300">
                                        /api/v1/admin/settings
                                    </span>
                                </div>
                                <p className="text-gray-300 text-sm">Get application settings</p>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <span className="inline-block px-2 py-1 text-sm font-medium bg-yellow-500/20 text-yellow-400 rounded">
                                        PUT
                                    </span>
                                    <span className="ml-2 text-gray-300">
                                        /api/v1/admin/settings
                                    </span>
                                </div>
                                <pre className="bg-gray-900/50 p-3 rounded-md text-gray-300 overflow-x-auto">
                                    <code>
                                        {JSON.stringify(
                                            {
                                                disable_users: 'required boolean',
                                                disable_user_account_creation: 'required boolean',
                                                hide_allowed_ip_input: 'optional boolean',
                                                read_only: 'required boolean',
                                                disable_file_upload: 'required boolean',
                                                restrict_organization_email: 'optional string',
                                            },
                                            null,
                                            2
                                        )}
                                    </code>
                                </pre>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ApiDocs;
