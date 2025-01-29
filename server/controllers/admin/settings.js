import getEmailDomain from '../../../shared/helpers/get-email-domain.js';
import { updateAdminSettings } from '../../bootstrap.js';
import prisma from '../../services/prisma.js';

async function settings(fastify) {
    // Public endpoint to get settings
    fastify.get('/', async (request, reply) => {
        try {
            const settings = await prisma.settings.findFirst({
                where: {
                    id: 'admin_settings',
                },
            });

            if (!settings) {
                // Return default settings if none exist
                return {
                    id: 'admin_settings',
                    disable_users: false,
                    disable_user_account_creation: false,
                    hide_allowed_ip_input: false,
                    read_only: false,
                    disable_file_upload: false,
                    restrict_organization_email: '',
                };
            }

            return settings;
        } catch (error) {
            request.log.error('Failed to fetch admin settings:', error);
            return reply.code(500).send({ error: 'Internal server error' });
        }
    });

    // Protected endpoint to update settings
    fastify.put(
        '/',
        {
            preValidation: [fastify.authenticate, fastify.admin],
            schema: {
                body: {
                    type: 'object',
                    properties: {
                        disable_users: { type: 'boolean', default: false },
                        disable_user_account_creation: { type: 'boolean', default: false },
                        hide_allowed_ip_input: { type: 'boolean', default: false },
                        read_only: { type: 'boolean', default: false },
                        disable_file_upload: { type: 'boolean', default: false },
                        restrict_organization_email: { type: 'string', default: '' },
                    },
                    required: [
                        'disable_users',
                        'disable_user_account_creation',
                        'read_only',
                        'disable_file_upload',
                    ],
                },
            },
        },
        async (request, reply) => {
            try {
                const {
                    disable_users,
                    disable_user_account_creation,
                    hide_allowed_ip_input,
                    read_only,
                    disable_file_upload,
                    restrict_organization_email,
                } = request.body;

                const settings = await prisma.settings.upsert({
                    where: {
                        id: 'admin_settings',
                    },
                    update: {
                        disable_users,
                        disable_user_account_creation,
                        hide_allowed_ip_input,
                        read_only,
                        disable_file_upload,
                        restrict_organization_email: getEmailDomain(restrict_organization_email),
                    },
                    create: {
                        id: 'admin_settings',
                        disable_users,
                        disable_user_account_creation,
                        hide_allowed_ip_input,
                        read_only,
                        disable_file_upload,
                        restrict_organization_email: getEmailDomain(restrict_organization_email),
                    },
                });

                updateAdminSettings(settings);

                return settings;
            } catch (error) {
                request.log.error('Failed to update admin settings:', error);
                return reply.code(500).send({ error: 'Internal server error' });
            }
        }
    );
}

export default settings;
