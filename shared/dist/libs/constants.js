"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UI_ROUTES = exports.API_ROUTES = exports.TEST = exports.DEV = exports.PASSWORD_REGEX = exports.EMAIL_REGEX = exports.NAME_REGEX = void 0;
/** Name validation regex */
exports.NAME_REGEX = /^[\w ]{1,100}$/;
/** Email validation regex */
exports.EMAIL_REGEX = /^[\w.]+@\w+\.+\w{2,4}$/;
/** Password validation regex */
exports.PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{10,100}$/;
exports.DEV = 'development';
exports.TEST = 'test';
/** Supported API routes */
exports.API_ROUTES = {
    auth: {
        _: 'auth',
        sighUp: 'sign-up',
        forgotPassword: 'forgot-password',
        resetPassword: 'reset-password',
        signIn: 'sign-in',
        verifyUser: 'verify-user',
        signInGoogle: 'sign-in/google',
        refresh: 'refresh',
        signOut: 'sign-out',
    },
    profile: {
        _: 'profile',
        updatePassword: 'update-password',
        changeEmail: 'change-email',
        sessions: 'sessions',
    },
    users: {
        _: 'users',
        user: (id) => `/${id}`,
        userRoles: (id) => `/${id}/roles`,
    },
    roles: {
        _: 'roles',
        role: (id) => `/${id}`,
        roleRights: (id) => `/${id}/rights`,
    },
    resources: {
        _: 'resources',
        resource: (id) => `/${id}`,
    },
};
/** Supported UI routes */
exports.UI_ROUTES = {
    signUp: '/registration',
    signIn: '/authorization',
    signInGoogle: '/authorization/google',
    forgotPassword: '/forgot-password',
    home: '/',
    profile: '/profile',
    users: '/users',
    newUser: '/users/new',
    user: (id) => `/users/${id}`,
    roles: '/roles',
    newRole: '/roles/new',
    role: (id) => `/roles/${id}`,
    resources: '/resources',
    newResource: '/resources/new',
    resource: (id) => `/resources/${id}`,
};
//# sourceMappingURL=constants.js.map