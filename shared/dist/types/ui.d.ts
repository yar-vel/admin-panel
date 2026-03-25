export interface IAlert {
    id: string;
    text?: string;
    type?: 'error' | 'warning' | 'success';
}
export interface IWindowMessage<T = unknown> {
    type: string;
    payload: T;
}
export interface IMenuItem<I = unknown> {
    title?: string;
    href?: string;
    icon?: I;
    childs?: IMenuItem<I>[];
}
//# sourceMappingURL=ui.d.ts.map