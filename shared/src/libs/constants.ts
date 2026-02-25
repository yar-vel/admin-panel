/** Name validation regex */
export const NAME_REGEX = /^[\w ]{1,100}$/;
/** Email validation regex */
export const EMAIL_REGEX = /^[\w.]+@\w+\.+\w{2,4}$/;
/** Password validation regex */
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{10,100}$/;

export const DEV = 'development';

/** Supported API routes */
export const API_ROUTES = {
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
    user: (id: string | number) => `/${id}`,
    userRoles: (id: string | number) => `/${id}/roles`,
  },
  roles: {
    _: 'roles',
    role: (id: string | number) => `/${id}`,
    roleRights: (id: string | number) => `/${id}/rights`,
  },
  resources: {
    _: 'resources',
    resource: (id: string | number) => `/${id}`,
  },
} as const;

/** Supported UI routes */
export const UI_ROUTES = {
  signUp: '/registration',
  signIn: '/authorization',
  signInGoogle: '/authorization/google',
  forgotPassword: '/forgot-password',
  home: '/',
  profile: '/profile',
  users: '/users',
  newUser: '/users/new',
  user: (id: string | number) => `/users/${id}`,
  roles: '/roles',
  newRole: '/roles/new',
  role: (id: string | number) => `/roles/${id}`,
  resources: '/resources',
  newResource: '/resources/new',
  resource: (id: string | number) => `/resources/${id}`,
} as const;
