import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate } from 'react-router-dom';

import { refresh } from '../../api/authentication.js';
import { getCookie, refreshCookie } from '../../helpers/cookie';
import useAuthStore from '../../stores/authStore';
import Logo from './logo.jsx';
import Nav from './nav';

const Header = () => {
    const { t } = useTranslation();
    const { isLoggedIn, username, setLogin, setLoginStatus } = useAuthStore();

    const [isMenuOpened, setIsMenuOpened] = useState(false);
    const [openRefreshModal, setOpenRefreshModal] = useState(false);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (!isLoggedIn && username) {
            setLoginStatus(true);
        }

        const cookie = getCookie();

        if (!isLoggedIn && !username && cookie) {
            setLogin(cookie.username);
        }
    }, [isLoggedIn, username]);

    useEffect(() => {
        const cookie = getCookie();

        if (!cookie) {
            return;
        }

        const refreshInterval = () => {
            const shouldRefresh = refreshCookie();
            if (shouldRefresh && !openRefreshModal) {
                setOpenRefreshModal(true);
            }
        };

        refreshInterval();

        const interval = setInterval(refreshInterval, 60 * 1000);

        return () => clearInterval(interval);
    }, [openRefreshModal]);

    const handleRefreshCookie = async () => {
        const cookie = getCookie();

        if (!cookie) {
            return;
        }

        const data = await refresh();

        if (data.statusCode === 401) {
            setOpenRefreshModal(false);
            setRedirect(true);
        }

        setLogin(cookie.username);
        setLoginStatus(true);

        setOpenRefreshModal(false);
    };

    return (
        <>
            {redirect && <Navigate to="/signout" />}

            {/* Session Refresh Modal */}
            {openRefreshModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/75">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative w-full max-w-lg rounded-lg bg-gray-800 p-6 shadow-xl">
                            <div className="mb-4">
                                <h3 className="text-lg font-medium text-gray-200">
                                    {t('header.session.auth', 'Authentication')}
                                </h3>
                                <p className="mt-2 text-sm text-gray-400">
                                    {t(
                                        'header.session.expire',
                                        'Your session is about to expire. Do you want to extend it?'
                                    )}
                                </p>
                            </div>
                            <div className="flex flex-row-reverse gap-3">
                                <button
                                    type="button"
                                    onClick={handleRefreshCookie}
                                    className="inline-flex justify-center rounded-md bg-hemmelig px-4 py-2 text-sm font-semibold text-white hover:bg-hemmelig-700"
                                >
                                    {t('header.session.update', 'Update session')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setOpenRefreshModal(false)}
                                    className="inline-flex justify-center rounded-md bg-gray-700 px-4 py-2 text-sm font-semibold text-gray-200 hover:bg-gray-600"
                                >
                                    {t('header.session.cancel', 'Cancel')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="fixed w-full top-0 z-50 bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 h-16">
                    <div className="flex items-center justify-between h-full">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link to="/" className="flex items-center">
                                <Logo className="w-10 h-10 [&>g]:fill-gray-100" />
                            </Link>
                        </div>

                        {/* Navigation Menu Button */}
                        <button
                            onClick={() => setIsMenuOpened(!isMenuOpened)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 
                                     hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 
                                     focus:ring-inset focus:ring-white transition-colors duration-200"
                            aria-label={isMenuOpened ? t('header.nav.close') : t('header.nav.open')}
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d={
                                        isMenuOpened
                                            ? 'M6 18L18 6M6 6l12 12'
                                            : 'M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5'
                                    }
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Dropdown Menu */}
                <div
                    className={`absolute top-16 right-0 w-64 bg-gray-900 border-b border-l border-gray-800 
                               transform transition-all duration-200 ease-in-out shadow-lg rounded-bl-lg
                               ${isMenuOpened ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none hidden'}`}
                >
                    <div className="py-2">
                        <Nav
                            isLoggedIn={isLoggedIn}
                            opened={isMenuOpened}
                            toggle={() => setIsMenuOpened(false)}
                        />
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
