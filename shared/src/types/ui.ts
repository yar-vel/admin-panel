export interface IAlert {
  id: number;
  text?: string;
  type?: 'error' | 'warning' | 'success';
  deleted?: boolean;
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
