export const RouterStore = {
    website: {
        index: '/',
        profile: '/profile/',
        login: '/login/',
        signup: '/signup/',
        album: '/album/:title/',
        artist: '/artist/:title/',
        favorite: '/favorite/',
        playlists: '/playlists/',
        playlist: '/playlist/:id/',
        search: '/search/',
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
            current: '/api/v1/albums/:id',
            indexList: '/api/v1/albums?count=:count&from=:from',
            artist: '/api/v1/artists/:id/albums',
        },
        track: {
            all: '/api/v1/track',
            update: '/api/v1/tracks/:id',
            add: '/api/v1/tracks',
            delete: '/api/v1/tracks/:id',
            artist: '/api/v1/artists/:id/tracks',
            index: '/api/v1/tracks?count=:count&from=:from',
            favorite: {
                list: '/api/v1/favorite/tracks',
                add: '/api/v1/favorite/track/:id',
            },
        },
        playlists: {
            list: '/api/v1/playlists',
            current: '/api/v1/playlists/:id',
            add: '/api/v1/playlists/:id/tracks',
            remove: '/api/v1/playlists/:id/tracks/:track_id',
            update: '/api/v1/playlists/:id',
            create: '/api/v1/playlists',
            delete: '/api/v1/playlists/:id',
        },
        search: {
            all: '/api/v1/search?query=:query&offset=:offset&limit=:limit',
        },
    },
};
