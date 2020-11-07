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
            current: '/api/v1/user',
            login: '/api/v1/session',
            register: '/api/v1/user',
            logout: '/api/v1/session',
            change: {
                avatar: '/api/v1/user/photo',
                profile: '/api/v1/user/profile',
                password: '/api/v1/user/password',
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
