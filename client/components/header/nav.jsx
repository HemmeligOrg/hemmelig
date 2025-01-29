import { IconFingerprint, IconList, IconLockOff, IconLogin, IconUser } from '@tabler/icons';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useSettingsStore from '../../stores/settingsStore.js';

const Nav = ({ opened, toggle, isLoggedIn }) => {
    const { t } = useTranslation();

    const { settings } = useSettingsStore();
    const navItems = [];

    const hideSignUp =
        isLoggedIn || settings.disable_user_account_creation || settings.disable_users;
    if (!hideSignUp) {
        navItems.push({
            label: t('sign_up'),
            icon: <IconUser size="1rem" stroke={1.5} />,
            to: '/signup',
        });
    }
    if (!isLoggedIn) {
        navItems.push({
            label: t('sign_in'),
            icon: <IconLogin size="1rem" stroke={1.5} />,
            to: '/signin',
        });
    }

    if (isLoggedIn) {
        navItems.push({
            label: t('sign_out'),
            icon: <IconLockOff size="1rem" stroke={1.5} />,
            to: '/signout',
        });
        navItems.push({
            label: t('account.home.title'),
            icon: <IconUser size="1rem" stroke={1.5} />,
            to: '/account',
        });
    }

    navItems.push(
        {
            label: t('public_list'),
            icon: <IconList size="1rem" stroke={1.5} />,
            to: '/public',
        },
        {
            label: t('privacy.title'),
            icon: <IconFingerprint size="1rem" stroke={1.5} />,
            to: '/privacy',
        }
    );

    if (!opened) {
        return null;
    }

    return (
        <nav className="w-full bg-gray-900">
            <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        to={item.to}
                        onClick={toggle}
                        className="flex items-center gap-2 px-4 py-2.5 text-gray-300 hover:text-white 
                                 hover:bg-gray-800 rounded-md transition-colors duration-200"
                    >
                        <span className="text-gray-400">{item.icon}</span>
                        <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                ))}
            </div>
        </nav>
    );
};

export default Nav;
