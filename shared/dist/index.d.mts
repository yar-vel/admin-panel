import { z } from 'zod';

type TRoutes<T> = {
    [K in keyof T]: T[K] extends (...args: infer A) => string ? (...args: A) => string : T[K] extends string ? string : TRoutes<T[K]>;
};

/** Name validation regex */
declare const NAME_REGEX: RegExp;
/** Email validation regex */
declare const EMAIL_REGEX: RegExp;
/** Password validation regex */
declare const PASSWORD_REGEX: RegExp;
declare const DEV = "development";
declare const TEST = "test";
declare const REQ_LIST_DEFAULT_PAGE = 1;
declare const REQ_LIST_DEFAULT_LIMIT = 25;
declare const REQ_LIST_MAX_LIMIT = 100;
/** Supported API routes */
declare const API_ROUTES: {
    readonly auth: {
        readonly _: "auth";
        readonly sighUp: "sign-up";
        readonly forgotPassword: "forgot-password";
        readonly resetPassword: "reset-password";
        readonly signIn: "sign-in";
        readonly verifyUser: "verify-user";
        readonly signInGoogle: "sign-in/google";
        readonly refresh: "refresh";
        readonly signOut: "sign-out";
    };
    readonly profile: {
        readonly _: "profile";
        readonly updatePassword: "update-password";
        readonly changeEmail: "change-email";
        readonly sessions: "sessions";
    };
    readonly users: {
        readonly _: "users";
        readonly user: (id: string | number) => string;
        readonly userRoles: (id: string | number) => string;
    };
    readonly roles: {
        readonly _: "roles";
        readonly role: (id: string | number) => string;
        readonly roleRights: (id: string | number) => string;
    };
    readonly resources: {
        readonly _: "resources";
        readonly resource: (id: string | number) => string;
    };
};
/** Supported UI routes */
declare const UI_ROUTES: {
    readonly signUp: "/sign-up";
    readonly signIn: "/sign-in";
    readonly signInGoogle: "/sign-in/google";
    readonly forgotPassword: "/forgot-password";
    readonly home: "/";
    readonly profile: "/profile";
    readonly users: "/users";
    readonly newUser: "/users/new";
    readonly user: (id: string | number) => string;
    readonly roles: "/roles";
    readonly newRole: "/roles/new";
    readonly role: (id: string | number) => string;
    readonly resources: "/resources";
    readonly newResource: "/resources/new";
    readonly resource: (id: string | number) => string;
};
/** All supported routes */
declare const ROUTES: {
    ui: TRoutes<{
        readonly signUp: "/sign-up";
        readonly signIn: "/sign-in";
        readonly signInGoogle: "/sign-in/google";
        readonly forgotPassword: "/forgot-password";
        readonly home: "/";
        readonly profile: "/profile";
        readonly users: "/users";
        readonly newUser: "/users/new";
        readonly user: (id: string | number) => string;
        readonly roles: "/roles";
        readonly newRole: "/roles/new";
        readonly role: (id: string | number) => string;
        readonly resources: "/resources";
        readonly newResource: "/resources/new";
        readonly resource: (id: string | number) => string;
    }>;
    api: TRoutes<{
        readonly auth: {
            readonly _: "auth";
            readonly sighUp: "sign-up";
            readonly forgotPassword: "forgot-password";
            readonly resetPassword: "reset-password";
            readonly signIn: "sign-in";
            readonly verifyUser: "verify-user";
            readonly signInGoogle: "sign-in/google";
            readonly refresh: "refresh";
            readonly signOut: "sign-out";
        };
        readonly profile: {
            readonly _: "profile";
            readonly updatePassword: "update-password";
            readonly changeEmail: "change-email";
            readonly sessions: "sessions";
        };
        readonly users: {
            readonly _: "users";
            readonly user: (id: string | number) => string;
            readonly userRoles: (id: string | number) => string;
        };
        readonly roles: {
            readonly _: "roles";
            readonly role: (id: string | number) => string;
            readonly roleRights: (id: string | number) => string;
        };
        readonly resources: {
            readonly _: "resources";
            readonly resource: (id: string | number) => string;
        };
    }>;
};

interface IReqList<T extends object> {
    reqLimit?: number;
    reqPage?: number;
    reqCount?: boolean;
    reqSortField?: keyof T;
    reqSortOrder?: ESortOrder;
}
interface IResList<T extends object, S extends object = T, F extends object = T> {
    rows: T[];
    meta?: IResListMeta<T, S, F>;
}
interface IResListMeta<T extends object, S extends object = T, F extends object = T> {
    page?: number;
    limit?: number;
    total?: number;
    sort?: ISort<S>;
    filters?: Partial<F>;
}
interface ISort<T extends object> {
    field: keyof T;
    order: ESortOrder;
}
declare enum ESortOrder {
    ASC = "ASC",
    DESC = "DESC"
}
interface IReqItems<T = string | number> {
    items: T[];
}
interface IFetchUpdate<T = unknown, U = T extends {
    id: infer P;
} ? P : string | number> {
    id: U;
    fields: T;
}

interface IResource {
    id: string;
    name: string;
    path: string;
    description?: string | null;
    enabled: boolean;
    default: boolean;
    rights?: IRights[];
    createdAt?: Date;
    updatedAt?: Date;
}
type TResourceCreate = Required<Pick<IResource, 'name' | 'path'>> & Partial<Pick<IResource, 'enabled' | 'description'>>;
type TResourceReqListParams = Partial<Pick<IResource, 'name' | 'path' | 'enabled' | 'default'>>;
type TResourceReqList = IReqList<IResource> & TResourceReqListParams;
type TResourceResList = IResList<IResource>;
type TResourceUpdate = Partial<Pick<IResource, 'name' | 'path' | 'description' | 'enabled'>>;

interface IRights {
    roleId: IRole['id'];
    role?: IRole;
    resourceId: IResource['id'];
    resource?: IResource;
    creating: boolean;
    reading: boolean;
    updating: boolean;
    deleting: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
interface IUsersRoles {
    userId: IUser['id'];
    roleId: IRole['id'];
    createdAt?: Date;
}

interface IRole {
    id: string;
    name: string;
    description?: string | null;
    enabled: boolean;
    admin: boolean;
    default: boolean;
    users?: IUser[];
    rights?: IRights[];
    createdAt?: Date;
    updatedAt?: Date;
}
type TRoleCreate = Required<Pick<IRole, 'name'>> & Partial<Pick<IRole, 'description' | 'enabled'>>;
type TRoleReqListParams = Partial<Pick<IRole, 'name' | 'enabled' | 'default' | 'admin'>>;
type TRoleReqList = IReqList<IRole> & TRoleReqListParams;
type TRoleResList = IResList<IRole>;
type TRoleUpdate = Partial<Pick<IRole, 'name' | 'description' | 'enabled'>>;

type WithoutNulls<T> = {
    [K in keyof T]: NonNullable<T[K]>;
};

interface IUser {
    id: string;
    email?: string | null;
    password?: string | null;
    name: string;
    googleId?: string | null;
    enabled: boolean;
    verified: boolean;
    verificationCode?: string | null;
    resetPasswordCode?: string | null;
    changeEmailCode?: string | null;
    temporaryEmail?: string | null;
    roles?: IRole[];
    createdAt?: Date;
    updatedAt?: Date;
}
type TUserCreate = WithoutNulls<Required<Pick<IUser, 'email' | 'password' | 'name'>> & Partial<Pick<IUser, 'enabled'>>>;
type TUserCreateGoogle = WithoutNulls<Required<Pick<IUser, 'googleId' | 'name'>> & Partial<Pick<IUser, 'enabled'>>>;
type TUserReqListParams = Partial<Pick<IUser, 'email' | 'name' | 'enabled' | 'verified'>>;
type TUserReqList = IReqList<IUser> & TUserReqListParams;
type TUserResList = IResList<IUser>;
type TUserUpdate = Partial<Pick<IUser, 'name' | 'enabled'>>;

type TSignUp = WithoutNulls<Required<Pick<IUser, 'email' | 'password' | 'name'>>>;
interface IForgotPassword {
    email: string;
}
interface IResetPassword {
    email: string;
    code: string;
    password: string;
}
interface IVerifyUser {
    email: string;
    code: string;
}
interface ISignIn {
    username: string;
    password: string;
    rememberMe?: boolean;
}
interface ISignInGoogle {
    googleAccessToken: string;
}

interface IUpdatePassword {
    oldPassword?: string;
    newPassword: string;
}
interface IChangeEmailRequest {
    newEmail: string;
}
interface IChangeEmailConfirm {
    code: string;
}
interface ISession {
    ip: string;
    userAgent?: string;
    updatedAt: Date;
    sign: string;
}
type TSessionExternal = Omit<ISession, 'sign'> & {
    id: string;
    current: boolean;
};

interface IQueuePattern {
    cmd: string;
}
interface IEmailCode {
    email: string;
    code: string;
}

interface IAlert {
    id: string;
    text?: string;
    type?: 'error' | 'warning' | 'success';
}
interface IWindowMessage<T = unknown> {
    type: string;
    payload: T;
}
interface IMenuItem<I = unknown> {
    title?: string;
    href?: string;
    icon?: I;
    childs?: IMenuItem<I>[];
}

/**
 * @param {Date | string | number} date Parsed date
 * @returns {string} Formatted date string
 */
declare const getDateString: (date?: Date | string | number) => string;
/**
 * @param {T} oldObject Original object
 * @param {T} newObject Updated object
 * @returns {Partial<T>} An object with changed fields only
 */
declare const getUpdatedValues: <T>(oldObject: T, newObject: T) => Partial<T>;
/**
 * @param {RegExp} regex Regular expression
 * @param {string} payload The string being checked
 * @returns {boolean} true if the payload matches a regular expression
 */
declare const testString: (regex: RegExp, payload: string) => boolean;
/**
 * @param {unknown} error Some request error
 * @param {string} lang Error language
 * @returns {string} Formatted error text
 */
declare const getErrorText: (error?: unknown, lang?: string) => string;
/**
 * @param {string} href Checked link
 * @param {IMenuItem} navTree Navigation tree
 * @returns {boolean} true if link found in the navigation tree
 */
declare const checkActiveLink: (href: string, navTree: IMenuItem) => boolean;
/**
 * @param {string} googleClientId Google Client ID
 * @param {string} redirectUri URI to redirect to after login
 * @param {string} state Random string for security
 * @returns {boolean} Google Login URL
 */
declare const getGoogleSignInUrl: (googleClientId: string, redirectUri: string, state: string) => string;
/**
 * @param {unknown} object The object from which the field is extracted
 * @param {string} field Field name
 * @returns {T | undefined} Field value or nothing
 */
declare const getField: <T = unknown>(object: unknown, field: string) => T | undefined;
/**
 * @param {IResListMeta} resMeta Metadata from the list-response
 * @returns {IReqList} Request parameters
 */
declare const resListMetaToReq: <T extends object, S extends object = T, F extends object = T>(resMeta: IResListMeta<T, S, F>) => IReqList<S> & Record<string, unknown>;
/**
 * @param {object} options Options for creating search parameters
 * @returns {URLSearchParams} Search parameters
 */
declare const createSearchParams: ({ data, exclude, searchParams, }: {
    data: object;
    exclude?: string[];
    searchParams?: string[][] | Record<string, string> | string | URLSearchParams;
}) => URLSearchParams;
declare const buildRoutes: <T extends Record<string, unknown>>(tree: T, parent?: string) => TRoutes<T>;

declare const dictionary: {
    readonly en: {
        readonly langCode: "en";
        readonly langCodeFull: "en-US";
        readonly langName: "English";
        readonly adminPanel: "Admin Panel";
        readonly adminPanelAPIDescription: "The Admin Panel API description";
        readonly main: "Main";
        readonly mainMenu: "Main menu";
        readonly home: "Home";
        readonly profile: "Profile";
        readonly getProfileFields: "Get profile fields";
        readonly updateProfile: "Update profile";
        readonly sessions: "Sessions";
        readonly getSessions: "Get sessions";
        readonly deleteSessions: "Delete sessions";
        readonly users: "Users";
        readonly user: "User";
        readonly userAlreadyExist: "User already exist";
        readonly newUser: "New user";
        readonly userDeleted: "User deleted";
        readonly roles: "Roles";
        readonly role: "Role";
        readonly newRole: "New role";
        readonly defaultAdminRole: "Default admin role";
        readonly defaultUserRole: "Default user role";
        readonly resources: "Resources";
        readonly resource: "Resource";
        readonly newResource: "New resource";
        readonly defaultResource: "Default resource";
        readonly entityCreation: "Creating an entity";
        readonly getEntity: "Get entity";
        readonly getEntities: "Get entities";
        readonly updateEntity: "Update entity";
        readonly deleteEntity: "Delete entity";
        readonly signUp: "Sign up";
        readonly signUpText: "Don't have an account?";
        readonly signIn: "Sign in";
        readonly signInText: "Already have an account?";
        readonly signInWithGoogle: "Sign in with Google";
        readonly signOut: "Sign out";
        readonly email: "Email";
        readonly changeEmail: "Change email";
        readonly code: "Code";
        readonly codeFromEmail: "Code from email";
        readonly wrongCode: "Wrong code";
        readonly wrongEmailOrCode: "Wrong email or code";
        readonly emailValidation: "example@mail.com";
        readonly emailValidationI18N: "example{'@'}mail.com";
        readonly nameValidation: "Latin characters only, length from 1 to 100";
        readonly wrongEmail: "Wrong email";
        readonly changeEmailRequest: "Request to change email";
        readonly changeEmailConfirm: "Confirmation of the email change";
        readonly subjectChangeEmail: "Change email";
        readonly changeEmailCode: "Code for changing email";
        readonly password: "Password";
        readonly newPassword: "New password";
        readonly oldPassword: "Old password";
        readonly updatePassword: "Update password";
        readonly rememberMe: "Remember me";
        readonly forgotPassword: "Forgot password";
        readonly forgotPasswordText: "Forgot password?";
        readonly resetPassword: "Reset password";
        readonly wrongEmailOrPassword: "Wrong email or password";
        readonly passwordValidation: "Latin uppercase and lowercase characters, special symbols, numbers, length from 10 to 100";
        readonly subjectForgotPassword: "Forgot password";
        readonly resetPasswordCode: "Password reset code";
        readonly registration: "Registration";
        readonly registrationSuccessText: "The user has been successfully created";
        readonly confirmRegistration: "Confirm registration";
        readonly subjectRegistration: "Registration";
        readonly authorization: "Authorization";
        readonly refreshToken: "Refresh token";
        readonly verificationCode: "Verification code";
        readonly error404: "Error 404";
        readonly pageNotFound: "Page not found";
        readonly unknownError: "Unknown error";
        readonly error: "Error";
        readonly googleId: "Google ID";
        readonly name: "Name";
        readonly description: "Description";
        readonly path: "Path";
        readonly confirm: "Confirm";
        readonly change: "Change";
        readonly create: "Create";
        readonly read: "Read";
        readonly update: "Update";
        readonly delete: "Delete";
        readonly id: "Id";
        readonly enabled: "Enabled";
        readonly verified: "Verified";
        readonly edit: "Edit";
        readonly success: "Success";
        readonly verification: "Verification";
        readonly nothingToUpdate: "Nothing to update";
        readonly tooManyRequests: "Too many requests";
        readonly empty: "Empty";
        readonly close: "Close";
        readonly loading: "Loading";
        readonly current: "Current";
    };
};

declare const en: {
    readonly langCode: "en";
    readonly langCodeFull: "en-US";
    readonly langName: "English";
    readonly adminPanel: "Admin Panel";
    readonly adminPanelAPIDescription: "The Admin Panel API description";
    readonly main: "Main";
    readonly mainMenu: "Main menu";
    readonly home: "Home";
    readonly profile: "Profile";
    readonly getProfileFields: "Get profile fields";
    readonly updateProfile: "Update profile";
    readonly sessions: "Sessions";
    readonly getSessions: "Get sessions";
    readonly deleteSessions: "Delete sessions";
    readonly users: "Users";
    readonly user: "User";
    readonly userAlreadyExist: "User already exist";
    readonly newUser: "New user";
    readonly userDeleted: "User deleted";
    readonly roles: "Roles";
    readonly role: "Role";
    readonly newRole: "New role";
    readonly defaultAdminRole: "Default admin role";
    readonly defaultUserRole: "Default user role";
    readonly resources: "Resources";
    readonly resource: "Resource";
    readonly newResource: "New resource";
    readonly defaultResource: "Default resource";
    readonly entityCreation: "Creating an entity";
    readonly getEntity: "Get entity";
    readonly getEntities: "Get entities";
    readonly updateEntity: "Update entity";
    readonly deleteEntity: "Delete entity";
    readonly signUp: "Sign up";
    readonly signUpText: "Don't have an account?";
    readonly signIn: "Sign in";
    readonly signInText: "Already have an account?";
    readonly signInWithGoogle: "Sign in with Google";
    readonly signOut: "Sign out";
    readonly email: "Email";
    readonly changeEmail: "Change email";
    readonly code: "Code";
    readonly codeFromEmail: "Code from email";
    readonly wrongCode: "Wrong code";
    readonly wrongEmailOrCode: "Wrong email or code";
    readonly emailValidation: "example@mail.com";
    readonly emailValidationI18N: "example{'@'}mail.com";
    readonly nameValidation: "Latin characters only, length from 1 to 100";
    readonly wrongEmail: "Wrong email";
    readonly changeEmailRequest: "Request to change email";
    readonly changeEmailConfirm: "Confirmation of the email change";
    readonly subjectChangeEmail: "Change email";
    readonly changeEmailCode: "Code for changing email";
    readonly password: "Password";
    readonly newPassword: "New password";
    readonly oldPassword: "Old password";
    readonly updatePassword: "Update password";
    readonly rememberMe: "Remember me";
    readonly forgotPassword: "Forgot password";
    readonly forgotPasswordText: "Forgot password?";
    readonly resetPassword: "Reset password";
    readonly wrongEmailOrPassword: "Wrong email or password";
    readonly passwordValidation: "Latin uppercase and lowercase characters, special symbols, numbers, length from 10 to 100";
    readonly subjectForgotPassword: "Forgot password";
    readonly resetPasswordCode: "Password reset code";
    readonly registration: "Registration";
    readonly registrationSuccessText: "The user has been successfully created";
    readonly confirmRegistration: "Confirm registration";
    readonly subjectRegistration: "Registration";
    readonly authorization: "Authorization";
    readonly refreshToken: "Refresh token";
    readonly verificationCode: "Verification code";
    readonly error404: "Error 404";
    readonly pageNotFound: "Page not found";
    readonly unknownError: "Unknown error";
    readonly error: "Error";
    readonly googleId: "Google ID";
    readonly name: "Name";
    readonly description: "Description";
    readonly path: "Path";
    readonly confirm: "Confirm";
    readonly change: "Change";
    readonly create: "Create";
    readonly read: "Read";
    readonly update: "Update";
    readonly delete: "Delete";
    readonly id: "Id";
    readonly enabled: "Enabled";
    readonly verified: "Verified";
    readonly edit: "Edit";
    readonly success: "Success";
    readonly verification: "Verification";
    readonly nothingToUpdate: "Nothing to update";
    readonly tooManyRequests: "Too many requests";
    readonly empty: "Empty";
    readonly close: "Close";
    readonly loading: "Loading";
    readonly current: "Current";
};

type TLangDictionary = typeof en;
type TLangList = keyof typeof dictionary;

/**
 * @param {LangList} lang Desired language
 * @returns {LangDictionary} Dictionary in the desired language
 */
declare const getT: (lang?: string) => TLangDictionary;

declare const getReqListSchema: <T extends object>() => z.ZodObject<{
    reqLimit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    reqPage: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    reqCount: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    reqSortField: z.ZodType<keyof T | undefined>;
    reqSortOrder: z.ZodOptional<z.ZodEnum<typeof ESortOrder>>;
}, z.core.$strip>;

declare const resourceSchema: z.ZodObject<{
    id: z.ZodUUID;
    name: z.ZodString;
    path: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    enabled: z.ZodCoercedBoolean<unknown>;
    default: z.ZodCoercedBoolean<unknown>;
    rights: z.ZodOptional<z.ZodArray<z.ZodAny>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
declare const resourceReqListParamsSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    path: z.ZodOptional<z.ZodString>;
    enabled: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    default: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
}, z.core.$strip>;
declare const resourceReqListSchema: z.ZodObject<{
    reqLimit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    reqPage: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    reqCount: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    reqSortField: z.ZodType<keyof IResource | undefined, unknown, z.core.$ZodTypeInternals<keyof IResource | undefined, unknown>>;
    reqSortOrder: z.ZodOptional<z.ZodEnum<typeof ESortOrder>>;
    name: z.ZodOptional<z.ZodString>;
    path: z.ZodOptional<z.ZodString>;
    enabled: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    default: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
}, z.core.$strip>;

declare const userSchema: z.ZodObject<{
    id: z.ZodUUID;
    email: z.ZodOptional<z.ZodNullable<z.ZodEmail>>;
    password: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    name: z.ZodString;
    googleId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    enabled: z.ZodCoercedBoolean<unknown>;
    verified: z.ZodCoercedBoolean<unknown>;
    verificationCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    resetPasswordCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    changeEmailCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    temporaryEmail: z.ZodOptional<z.ZodNullable<z.ZodEmail>>;
    roles: z.ZodOptional<z.ZodArray<z.ZodAny>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
declare const userReqListParamsSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    enabled: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    email: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodEmail>>>;
    verified: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
}, z.core.$strip>;
declare const userReqListSchema: z.ZodObject<{
    reqLimit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    reqPage: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    reqCount: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    reqSortField: z.ZodType<keyof IUser | undefined, unknown, z.core.$ZodTypeInternals<keyof IUser | undefined, unknown>>;
    reqSortOrder: z.ZodOptional<z.ZodEnum<typeof ESortOrder>>;
    name: z.ZodOptional<z.ZodString>;
    enabled: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    email: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodEmail>>>;
    verified: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
}, z.core.$strip>;

declare const roleSchema: z.ZodObject<{
    id: z.ZodUUID;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    enabled: z.ZodCoercedBoolean<unknown>;
    admin: z.ZodCoercedBoolean<unknown>;
    default: z.ZodCoercedBoolean<unknown>;
    users: z.ZodOptional<z.ZodArray<z.ZodAny>>;
    rights: z.ZodOptional<z.ZodArray<z.ZodAny>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
declare const roleReqListParamsSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    enabled: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    default: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    admin: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
}, z.core.$strip>;
declare const roleReqListSchema: z.ZodObject<{
    reqLimit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    reqPage: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    reqCount: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    reqSortField: z.ZodType<keyof IRole | undefined, unknown, z.core.$ZodTypeInternals<keyof IRole | undefined, unknown>>;
    reqSortOrder: z.ZodOptional<z.ZodEnum<typeof ESortOrder>>;
    name: z.ZodOptional<z.ZodString>;
    enabled: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    default: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    admin: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
}, z.core.$strip>;

export { API_ROUTES, DEV, EMAIL_REGEX, ESortOrder, type IAlert, type IChangeEmailConfirm, type IChangeEmailRequest, type IEmailCode, type IFetchUpdate, type IForgotPassword, type IMenuItem, type IQueuePattern, type IReqItems, type IReqList, type IResList, type IResListMeta, type IResetPassword, type IResource, type IRights, type IRole, type ISession, type ISignIn, type ISignInGoogle, type ISort, type IUpdatePassword, type IUser, type IUsersRoles, type IVerifyUser, type IWindowMessage, NAME_REGEX, PASSWORD_REGEX, REQ_LIST_DEFAULT_LIMIT, REQ_LIST_DEFAULT_PAGE, REQ_LIST_MAX_LIMIT, ROUTES, TEST, type TLangDictionary, type TLangList, type TResourceCreate, type TResourceReqList, type TResourceReqListParams, type TResourceResList, type TResourceUpdate, type TRoleCreate, type TRoleReqList, type TRoleReqListParams, type TRoleResList, type TRoleUpdate, type TSessionExternal, type TSignUp, type TUserCreate, type TUserCreateGoogle, type TUserReqList, type TUserReqListParams, type TUserResList, type TUserUpdate, UI_ROUTES, type WithoutNulls, buildRoutes, checkActiveLink, createSearchParams, dictionary, getDateString, getErrorText, getField, getGoogleSignInUrl, getReqListSchema, getT, getUpdatedValues, resListMetaToReq, resourceReqListParamsSchema, resourceReqListSchema, resourceSchema, roleReqListParamsSchema, roleReqListSchema, roleSchema, testString, userReqListParamsSchema, userReqListSchema, userSchema };
