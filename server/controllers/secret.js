import validator from 'validator';
import getClientIp from '../helpers/client-ip.js';
import { compare, hash } from '../helpers/password.js';
import VALID_TTL from '../helpers/validate-ttl.js';
import prisma from '../services/prisma.js';
import { validUsername } from './authentication.js';

import { isValidSecretId } from '../helpers/regexp.js';

const DEFAULT_EXPIRATION = 60 * 60 * 24 * 1000;

const ipCheck = (ip) => {
    if (ip === 'localhost') {
        return true;
    }

    if (!validator.isIP(ip) && !validator.isIPRange(ip)) {
        return false;
    }

    return validator.isIP(ip) || validator.isIPRange(ip);
};

async function getSecretRoute(request, reply) {
    const { id } = request.params;

    const { password = '' } = request.body ? request.body : {};

    // If it does not match the valid characters set for nanoid, return 403
    if (!isValidSecretId.test(id)) {
        return reply.code(403).send({ error: 'Not a valid secret ID' });
    }

    // Use a transaction to ensure atomicity of read and delete operations
    const result = await prisma.$transaction(async (tx) => {
        const data = await tx.secret.findFirst({
            where: {
                id,
                expiresAt: { gte: new Date() },
            },
            include: { files: true },
        });

        if (!data) {
            return { error: 'Secret not found', status: 404 };
        }

        if (data.password) {
            const isPasswordValid = await compare(password, data.password);
            if (!isPasswordValid) {
                return { error: 'Wrong password!', status: 401 };
            }
        }

        // Handle view count and deletion within the same transaction
        if (data.maxViews > 1) {
            await tx.secret.update({
                where: { id: data.id },
                data: {
                    maxViews: {
                        decrement: 1,
                    },
                },
            });
        } else if (!data.preventBurn && data.maxViews === 1) {
            await tx.file.deleteMany({ where: { secretId: id } });
            await tx.secret.delete({ where: { id } });
        }

        return {
            success: true,
            data: {
                title: data.title,
                preventBurn: data.preventBurn,
                maxViews: data.maxViews,
                secret: data.data,
                files: data.files,
                isPublic: data.isPublic,
            },
        };
    });

    if (result.error) {
        return reply.code(result.status).send({ error: result.error });
    }

    return result.data;
}

async function secret(fastify) {
    fastify.get(
        '/:id',
        {
            preValidation: [fastify.allowedIp],
        },
        getSecretRoute
    );
    fastify.post(
        '/:id',
        {
            preValidation: [fastify.allowedIp],
        },
        getSecretRoute
    );

    fastify.get(
        '/',
        {
            preValidation: [fastify.authenticate],
        },
        async (req, reply) => {
            const { user_id } = req.user;

            const secrets = await prisma.secret.findMany({
                where: {
                    user_id: validator.isUUID(user_id) ? user_id : '',
                },
                include: { files: true },
            });

            return reply.code(200).send(
                secrets.map((secret) => ({
                    id: secret.id,
                    preventBurn: secret.preventBurn,
                    expiresAt: secret.expiresAt,
                    maxViews: secret.maxViews,
                    isPublic: secret.isPublic,
                    title: secret.title,
                }))
            );
        }
    );

    fastify.post(
        '/',
        {
            preValidation: [fastify.userFeatures, fastify.attachment],
            schema: {
                body: {
                    type: 'object',
                    required: ['text', 'ttl'],
                    properties: {
                        text: { type: 'string', minLength: 1 },
                        title: { type: 'string', maxLength: 255 },
                        ttl: { type: 'integer', minimum: 1, enum: VALID_TTL },
                        password: { type: 'string' },
                        allowedIp: { type: 'string' },
                        preventBurn: { type: 'boolean' },
                        maxViews: { type: 'integer', minimum: 1, maximum: 999 },
                        isPublic: { type: 'boolean' },
                    },
                },
            },
        },
        async (req, reply) => {
            const { text, title, ttl, password, allowedIp, preventBurn, maxViews, isPublic } =
                req.body;
            const { files } = req.secret;

            if (allowedIp && !ipCheck(allowedIp)) {
                return reply.code(400).send({ message: 'The IP address is not valid' });
            }

            const secret = await prisma.secret.create({
                data: {
                    title,
                    maxViews,
                    data: text,
                    allowed_ip: allowedIp,
                    password: password ? await hash(password) : undefined,
                    preventBurn,
                    isPublic,
                    files: {
                        create: files,
                    },
                    user_id: req?.user?.user_id ?? null,
                    expiresAt: new Date(
                        Date.now() + (parseInt(ttl) ? parseInt(ttl) * 1000 : DEFAULT_EXPIRATION)
                    ),
                    ipAddress: isPublic ? getClientIp(req.headers) : '',
                },
            });

            await prisma.statistic.upsert({
                where: {
                    id: 'secrets_created',
                },
                update: {
                    value: {
                        increment: 1,
                    },
                },
                create: { id: 'secrets_created' },
            });

            return reply.code(201).send({
                id: secret.id,
            });
        }
    );

    // This will burn the secret 🔥
    fastify.post('/:id/burn', async (request, reply) => {
        const { id } = request.params;

        if (!isValidSecretId.test(id)) {
            return reply.code(403).send({ error: 'Not a valid secret id' });
        }

        const response = await prisma.secret.delete({ where: { id } });

        if (!response) {
            return { error: 'Secret can not be burned before the expiration date' };
        } else {
            return { success: 'Secret is burned' };
        }
    });

    fastify.get('/:id/exist', async (request, reply) => {
        const { id } = request.params;

        if (!isValidSecretId.test(id)) {
            return reply.code(403).send({ error: 'Not a valid secret id' });
        }

        const data = await prisma.secret.findFirst({
            where: { id },
        });

        if (!data) {
            return reply.code(404).send({ error: 'Secret not found' });
        }

        if (data.password) {
            return reply.code(401).send({ error: 'Password required' });
        }

        return { id, maxViews: data.maxViews, preventBurn: data.preventBurn };
    });

    async function getPublicRoute(request, reply) {
        const { username } = request.params;

        const where = { isPublic: true };

        if (username && !validUsername.test(username)) {
            return reply.code(403).send([]);
        }

        if (username) {
            where.user = {
                username,
            };
        }

        const data = await prisma.secret.findMany({
            where,
            orderBy: {
                createdAt: 'desc',
            },
            take: 100,
            select: {
                id: true,
                expiresAt: true,
                title: true,
                createdAt: true,
                user: {
                    select: {
                        username: true,
                    },
                },
            },
        });

        return data;
    }

    fastify.get('/public/', getPublicRoute);
    fastify.get('/public/:username', getPublicRoute);
}

export default secret;
