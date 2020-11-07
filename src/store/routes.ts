export const RouterStore = {
    website: {
        index: '/',
        profile: '/profile/',
        login: '/login/',
        signup: '/signup/',
        album: '/album/:title/',
        artist: '/artist/:title/',
    },
    api: {
        user: {
            current: '/api/v1/user/current',
            login: '/api/v1/user/login',
            register: '/api/v1/user/register',
            logout: '/api/v1/user/logout',
            change: {
                avatar: '/api/v1/user/change/avatar',
                profile: '/api/v1/user/change/profile',
                password: '/api/v1/user/change/password',
            },
        },
        artist: {
            list: '/api/v1/artists',
            current: '/api/v1/artists/:slug',
        },
        albums: {
            current: '/api/v1/album/:id',
            indexList: '/api/v1/album/index',
            artist: '/api/v1/album/artist/:id',
        },
        track: {
            all: '/api/v1/track',
            update: '/api/v1/tracks/:id',
            add: 'api/v1/tracks/',
            delete: 'api/v1/tracks/:id',
            favorite: {
                list: '/api/v1/favorite/tracks',
                add: '/api/v1/favorite/track/',
            },
        },
    },
};
