import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Checkbox,
    Container,
    CopyButton,
    Divider,
    FileButton,
    Group,
    NumberInput,
    Select,
    Stack,
    Text,
    TextInput,
    Title,
    Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import {
    IconCheck,
    IconCopy,
    IconHeading,
    IconLink,
    IconLock,
    IconLockAccess,
    IconShare,
    IconShieldLock,
    IconSquarePlus,
    IconTrash,
} from '@tabler/icons';
import passwordGenerator from 'generate-password-browser';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import ErrorBox from '../../components/error-box';
import QRLink from '../../components/qrlink';
import Quill from '../../components/quill';

import { useTranslation } from 'react-i18next';
import { encrypt, generateKey } from '../../../shared/helpers/crypto';
import { burnSecret, createSecret, verifyCaptacha } from '../../api/secret';
import { zipFiles } from '../../helpers/zip';

import config from '../../config';

import ReCAPTCHA from 'react-google-recaptcha';

import style from './style.module.css';

const DEFAULT_TTL = 259200; // 3 days - 72 hours

const Home = () => {
    const form = useForm({
        initialValues: {
            text: '',
            title: '',
            maxViews: 1,
            files: [],
            password: '',
            ttl: DEFAULT_TTL,
            allowedIp: '',
            preventBurn: false,
            isPublic: false,
        },
    });

    const [text, setText] = useState('');
    const [ttl, setTTL] = useState(DEFAULT_TTL);
    const [enablePassword, setOnEnablePassword] = useState(false);
    const [secretId, setSecretId] = useState('');
    const [encryptionKey, setEncryptionKey] = useState('');
    const [creatingSecret, setCreatingSecret] = useState(false);
    const [error, setError] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [isDisableButton, setIsDisableButton] = useState(true);
    const secretRef = useRef(null);

    const isMobile = useMediaQuery('(max-width: 915px)');

    const isLoggedIn = useSelector((state) => state.isLoggedIn);

    const { t } = useTranslation();

    useEffect(() => {
        if (secretId) {
            secretRef.current.focus();
        }
    }, [secretId]);

    useEffect(() => {
        if (enablePassword) {
            form.setFieldValue(
                'password',
                passwordGenerator.generate({
                    length: 16,
                    numbers: true,
                    strict: true,
                    symbols: true,
                })
            );
        } else {
            form.setFieldValue('password', '');
        }
    }, [enablePassword]);

    const onTextChange = (value) => {
        setText(value);

        form.setFieldValue('text', value);
    };

    const onSelectChange = (value) => {
        form.setFieldValue('ttl', value);
        setTTL(value);
    };

    const onEnablePassword = () => {
        setOnEnablePassword(!enablePassword);
    };

    const onSetPublic = () => {
        setIsPublic(!isPublic);
    };

    const reset = () => {
        form.reset();
        setSecretId('');
        form.clearErrors();
        setEncryptionKey('');
        setOnEnablePassword(false);
        setCreatingSecret(false);
        setText('');
        setTTL(DEFAULT_TTL);
        setIsPublic(false);
        setError('');
    };

    const onSubmit = async (values) => {
        if (!form.values.text) {
            form.setErrors({ text: t('home.please_add_secret') });
            return;
        }

        const password = form.values.password;

        const publicEncryptionKey = generateKey(password);
        const encryptionKey = publicEncryptionKey + password;

        setCreatingSecret(true);

        const body = {
            text: isPublic ? form.values.text : encrypt(form.values.text, encryptionKey),
            files: [],
            title: isPublic ? form.values.title : encrypt(form.values.title, encryptionKey),
            password: form.values.password,
            ttl: form.values.ttl,
            allowedIp: form.values.allowedIp,
            preventBurn: form.values.preventBurn,
            maxViews: form.values.maxViews,
            isPublic: isPublic,
        };

        const zipFile = await zipFiles(form.values.files);

        if (zipFile) {
            body.files.push({
                type: 'application/zip',
                ext: '.zip',
                content: encrypt(zipFile, encryptionKey),
            });
        }

        const json = await createSecret(body);

        if (json.statusCode !== 201) {
            if (json.statusCode === 400) {
                setError(json.message);
            }

            if (json.message === 'request file too large, please check multipart config') {
                form.setErrors({ files: 'The file size is too large' });
            } else {
                form.setErrors({ files: json.message });
            }

            setCreatingSecret(false);

            return;
        }

        setSecretId(json.id);
        setEncryptionKey(publicEncryptionKey);
        form.clearErrors();
        setCreatingSecret(false);
    };

    const onNewSecret = async (event) => {
        event.preventDefault();

        reset();
    };

    const onBurn = async (event) => {
        if (!secretId) {
            return;
        }

        event.preventDefault();

        burnSecret(secretId);

        reset();
    };

    const onShare = (event) => {
        event.preventDefault();

        if (navigator.share) {
            navigator
                .share({
                    title: 'hemmelig.app',
                    text: t('home.get_your_secret'),
                    url: getSecretURL(),
                })
                .then(() => console.log(t('home.successful_share')))
                .catch(console.error);
        }
    };

    const removeFile = (index) => {
        const updatedFiles = [...form.values.files];
        updatedFiles.splice(index, 1);
        form.setFieldValue('files', updatedFiles);
    };

    const handleFocus = (event) => event.target.select();

    const getSecretURL = (withEncryptionKey = true) => {
        if (!withEncryptionKey) {
            return `${window.location.origin}/secret/${secretId}`;
        }

        return `${window.location.origin}/secret/${secretId}#encryption_key=${encryptionKey}`;
    };

    //qasim
    // RECAPTCHA_SITE_KEY = '6LfGcuspAAAAALARJm51vBxHgYr3qjgb5xlO6Rtk';
    const handleCaptchaChange = async (value) => {
        setRecaptchaToken(value);
        const json = await verifyCaptacha(value);
        console.log('jsonjsonjsonjson', json);
        if (json.success == true) {
            setIsDisableButton(false);
        } else {
            setIsDisableButton(true);
        }
    };

    const inputReadOnly = !!secretId;

    const disableFileUpload =
        (config.get('settings.upload_restriction') && !isLoggedIn) || isPublic;

    const ttlValues = [
        { value: 604800, label: t('home.7_days') },
        { value: 259200, label: t('home.3_days') },
        { value: 86400, label: t('home.1_day') },
        { value: 43200, label: t('home.12_hours') },
        { value: 14400, label: t('home.4_hours') },
        { value: 3600, label: t('home.1_hour') },
        { value: 1800, label: t('home.30_minutes') },
        { value: 300, label: t('home.5_minutes') },
    ];

    // Features allowed for signed in users only
    // This is validated from the server as well
    if (isLoggedIn) {
        ttlValues.unshift(
            { value: 2419200, label: t('home.28_days') },
            { value: 1209600, label: t('home.14_days') }
        );
    }

    const groupMobileStyle = () => {
        if (!isMobile) {
            return {};
        }

        return {
            root: {
                maxWidth: '100% !important',
            },
        };
    };

    return (
        <Container>
            <form
                onSubmit={form.onSubmit((values) => {
                    onSubmit(values);
                })}
            >
                <Stack>
                    <Title order={1} size="h2" align="center">
                        {t('home.app_subtitle')}
                    </Title>
                    <Text size="sm" align="center">
                        {t('home.welcome')}
                    </Text>

                    {error && <ErrorBox message={error} />}

                    <Quill
                        defaultValue={t('home.maintxtarea')}
                        value={text}
                        onChange={onTextChange}
                        readOnly={inputReadOnly}
                        secretId={secretId}
                    />

                    <Group grow>
                        <TextInput
                            styles={groupMobileStyle}
                            icon={<IconHeading size={14} />}
                            placeholder={t('home.title')}
                            readOnly={inputReadOnly}
                            {...form.getInputProps('title')}
                        />
                    </Group>

                    <Group grow>
                        <Select
                            zIndex={9999}
                            value={ttl}
                            onChange={onSelectChange}
                            data={ttlValues}
                            label={t('home.lifetime')}
                        />

                        <NumberInput
                            defaultValue={1}
                            min={1}
                            max={999}
                            placeholder="1"
                            label={t('home.max_views')}
                            {...form.getInputProps('maxViews')}
                        />
                    </Group>

                    <Group grow>
                        <Checkbox
                            styles={groupMobileStyle}
                            checked={enablePassword}
                            onChange={onEnablePassword}
                            readOnly={inputReadOnly}
                            color="hemmelig"
                            label={t('home.enable_password')}
                        />

                        <TextInput
                            styles={groupMobileStyle}
                            icon={<IconLock size={14} />}
                            placeholder={t('home.optional_password')}
                            minLength="8"
                            maxLength="28"
                            {...form.getInputProps('password')}
                            readOnly={!enablePassword || inputReadOnly}
                            rightSection={
                                <CopyButton value={form.values.password} timeout={2000}>
                                    {({ copied, copy }) => (
                                        <Tooltip
                                            label={copied ? t('copied') : t('copy')}
                                            withArrow
                                            position="right"
                                        >
                                            <ActionIcon
                                                color={copied ? 'teal' : 'gray'}
                                                onClick={copy}
                                            >
                                                {copied ? (
                                                    <IconCheck size={16} />
                                                ) : (
                                                    <IconCopy size={16} />
                                                )}
                                            </ActionIcon>
                                        </Tooltip>
                                    )}
                                </CopyButton>
                            }
                        />
                    </Group>

                    <Group grow>
                        <Checkbox
                            styles={groupMobileStyle}
                            readOnly={inputReadOnly}
                            color="hemmelig"
                            label={t('home.burn_aftertime')}
                            {...form.getInputProps('preventBurn')}
                        />

                        <Tooltip label={t('home.restrict_from_ip')}>
                            <TextInput
                                styles={groupMobileStyle}
                                icon={<IconLockAccess size={14} />}
                                placeholder={t('home.restrict_from_ip_placeholder')}
                                readOnly={inputReadOnly}
                                {...form.getInputProps('allowedIp')}
                            />
                        </Tooltip>
                    </Group>

                    <Group grow>
                        <Checkbox
                            styles={groupMobileStyle}
                            checked={isPublic}
                            onChange={onSetPublic}
                            readOnly={inputReadOnly}
                            color="hemmelig"
                            label={t('home.set_public')}
                        />

                        <FileButton
                            disabled={disableFileUpload}
                            styles={groupMobileStyle}
                            multiple
                            {...form.getInputProps('files')}
                        >
                            {(props) => (
                                <Button
                                    {...props}
                                    label={disableFileUpload ? t('home.upload_files') : ''}
                                    color={disableFileUpload ? 'gray' : 'hemmelig-orange'}
                                >
                                    {t('home.upload_files')}
                                </Button>
                            )}
                        </FileButton>

                        {disableFileUpload && (
                            <Text size="sm" align="center" mt="sm">
                                {isPublic ? t('home.public_no_upload') : t('home.login_to_upload')}
                            </Text>
                        )}
                    </Group>

                    {form.values.files?.length > 0 && (
                        <Group>
                            {form.values.files.map((file, index) => (
                                <Badge
                                    className={style['file-badge']}
                                    color="orange"
                                    key={file.name}
                                >
                                    <Badge
                                        className={style['file-remove']}
                                        onClick={() => removeFile(index)}
                                    >
                                        &times;
                                    </Badge>
                                    {file.name}
                                </Badge>
                            ))}
                        </Group>
                    )}

                    {secretId && (
                        <>
                            <Group grow>
                                <TextInput
                                    label={t('home.your_secret_url')}
                                    icon={<IconLink size={14} />}
                                    value={getSecretURL()}
                                    onFocus={handleFocus}
                                    ref={secretRef}
                                    readOnly
                                    rightSection={
                                        <CopyButton value={getSecretURL()} timeout={2000}>
                                            {({ copied, copy }) => (
                                                <Tooltip
                                                    label={copied ? t('copied') : t('copy')}
                                                    withArrow
                                                    position="right"
                                                >
                                                    <ActionIcon
                                                        color={copied ? 'teal' : 'gray'}
                                                        onClick={copy}
                                                    >
                                                        {copied ? (
                                                            <IconCheck size={16} />
                                                        ) : (
                                                            <IconCopy size={16} />
                                                        )}
                                                    </ActionIcon>
                                                </Tooltip>
                                            )}
                                        </CopyButton>
                                    }
                                />
                            </Group>

                            <QRLink value={getSecretURL()} />

                            <Divider
                                my="xs"
                                variant="dashed"
                                labelPosition="center"
                                label={
                                    <Box ml={5}>
                                        {t('home.or', 'Separate the link and decryption key')}
                                    </Box>
                                }
                            />

                            <Group grow>
                                <TextInput
                                    label={t(
                                        'home.secret_url',
                                        'Secret URL without decryption key'
                                    )}
                                    icon={<IconLink size={14} />}
                                    value={getSecretURL(false)}
                                    onFocus={handleFocus}
                                    styles={groupMobileStyle}
                                    readOnly
                                    rightSection={
                                        <CopyButton value={getSecretURL(false)} timeout={2000}>
                                            {({ copied, copy }) => (
                                                <Tooltip
                                                    label={copied ? t('copied') : t('copy')}
                                                    withArrow
                                                    position="right"
                                                >
                                                    <ActionIcon
                                                        color={copied ? 'teal' : 'gray'}
                                                        onClick={copy}
                                                    >
                                                        {copied ? (
                                                            <IconCheck size={16} />
                                                        ) : (
                                                            <IconCopy size={16} />
                                                        )}
                                                    </ActionIcon>
                                                </Tooltip>
                                            )}
                                        </CopyButton>
                                    }
                                />

                                <TextInput
                                    label={t('home.decryption_key', 'Decryption key')}
                                    icon={<IconShieldLock size={14} />}
                                    value={encryptionKey}
                                    onFocus={handleFocus}
                                    styles={groupMobileStyle}
                                    readOnly
                                    rightSection={
                                        <CopyButton value={encryptionKey} timeout={2000}>
                                            {({ copied, copy }) => (
                                                <Tooltip
                                                    label={copied ? t('copied') : t('copy')}
                                                    withArrow
                                                    position="right"
                                                >
                                                    <ActionIcon
                                                        color={copied ? 'teal' : 'gray'}
                                                        onClick={copy}
                                                    >
                                                        {copied ? (
                                                            <IconCheck size={16} />
                                                        ) : (
                                                            <IconCopy size={16} />
                                                        )}
                                                    </ActionIcon>
                                                </Tooltip>
                                            )}
                                        </CopyButton>
                                    }
                                />
                            </Group>
                        </>
                    )}

                    {isMobile && secretId && navigator.share && (
                        <Group grow>
                            <Button
                                styles={() => ({
                                    root: {
                                        backgroundColor: 'var(--color-contrast-second)',
                                        '&:hover': {
                                            backgroundColor: 'var(--color-contrast-second)',
                                            filter: 'brightness(115%)',
                                        },
                                    },
                                })}
                                onClick={onShare}
                                leftIcon={<IconShare size={16} />}
                            >
                                {t('home.share')}
                            </Button>
                        </Group>
                    )}

                    <Group position="right" grow={isMobile}>
                        {!secretId && (
                            <Button
                                color="hemmelig"
                                leftIcon={<IconSquarePlus size={14} />}
                                loading={creatingSecret}
                                type="submit"
                                disabled={isDisableButton}
                            >
                                {t('home.create_secret_link')}
                            </Button>
                        )}

                        {secretId && (
                            <Button
                                color="hemmelig"
                                leftIcon={<IconSquarePlus size={14} />}
                                onClick={onNewSecret}
                            >
                                {t('home.create_new')}
                            </Button>
                        )}
                        <div style={{ margin: '20px' }}>
                            {/* <Helmet>
                                <meta
                                    http-equiv="Content-Security-Policy"
                                    content="script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com"
                                />
                            </Helmet> */}
                            <ReCAPTCHA
                                sitekey="6LfGcuspAAAAALARJm51vBxHgYr3qjgb5xlO6Rtk"
                                onChange={handleCaptchaChange}
                            />
                        </div>

                        {secretId && (
                            <Button
                                variant="gradient"
                                gradient={{ from: 'orange', to: 'red' }}
                                onClick={onBurn}
                                disabled={!secretId}
                                leftIcon={<IconTrash size={14} />}
                            >
                                {t('home.delete')}
                            </Button>
                        )}
                    </Group>
                </Stack>
            </form>

            <Divider my="sm" variant="dashed" />

            <Stack spacing="xs">
                <Text size="sm" align="center">
                    {t('home.link_only_works_once')}
                </Text>

                <Text size="sm" align="center">
                    <strong>Hemmelig</strong>, {t('home.app_name_meaning')}
                </Text>
            </Stack>
        </Container>
    );
};

export default Home;
