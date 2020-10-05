export const RouterStore = {
    website: {
        index: '/',
        profile: '/profile/',
        login: '/login/',
        signup: '/signup/',
    },
    api: {
        user: {
            current: '/api/v1/user/current/',
            login: '/api/v1/user/login/',
            register: '/api/v1/user/register',
            logout: '/api/v1/user/logout/',
            change: {
                avatar: '/api/v1/user/change/avatar',
                profile: '/api/v1/user/change/profile',
                password: '/api/v1/user/change/password',
            },
        },
    },
};
