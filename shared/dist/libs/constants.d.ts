/** Name validation regex */
export declare const NAME_REGEX: RegExp;
/** Email validation regex */
export declare const EMAIL_REGEX: RegExp;
/** Password validation regex */
export declare const PASSWORD_REGEX: RegExp;
export declare const DEV = "development";
export declare const TEST = "test";
/** Supported API routes */
export declare const API_ROUTES: {
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
export declare const UI_ROUTES: {
    readonly signUp: "/registration";
    readonly signIn: "/authorization";
    readonly signInGoogle: "/authorization/google";
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
//# sourceMappingURL=constants.d.ts.map