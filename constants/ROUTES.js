const ROUTES = {
    PUG: [
        {
            path: '/',
            file: 'index'
        },
        {
            path: '/profile',
            file: 'profile'
        },
        {
            path: '/users',
            file: 'users'
        }
    ],
    REST_API: [
        {
            path: '/notes',
            file: 'notes',
        },
        {
            path: '/folder',
            file: 'folder',
        },
        {
            path: '/user',
            file: 'user'
        },
        {
            path: '/admin',
            file: '/admin'
        }
    ]
}

module.exports = ROUTES