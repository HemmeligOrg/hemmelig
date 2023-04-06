import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function settings(fastify) {
    fastify.get(
        '/',
        {
            preValidation: [fastify.authenticate],
        },
        async () => {
            const settings = await prisma.settings.findMany({
                where: {
                    id: 'admin_settings',
                },
            });

            return settings;
        }
    );

    fastify.put(
        '/',
        {
            preValidation: [fastify.authenticate, fastify.admin],
        },
        async (request, reply) => {
            const { disableUsers = false, readOnly = false } = request.body;

            const settings = await prisma.settings.upsert({
                where: {
                    id: 'admin_settings',
                },
                update: {
                    disable_users: disableUsers, // Disable user registration
                    read_only: readOnly, // Allow visiting users to read secrets, and not create any except if you are an admin
                },
                create: { id: 'admin_settings' },
            });

            return settings;
        }
    );
}

export default settings;
