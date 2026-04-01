import { IResListMeta } from "@workspace/shared";

export interface IEntityFormCreate<T extends object> {
  onCreate?: (fields: T) => void;
  createDisabled?: boolean;
  createLoading?: boolean;
}

export interface IEntityFormUpdate<T extends object> {
  onUpdate?: (fields: T) => void;
  updateDisabled?: boolean;
  updateLoading?: boolean;
}

export interface IEntityFormDelete {
  onDelete?: () => void;
  deleteDisabled?: boolean;
  deleteLoading?: boolean;
}

export interface IEntityForm<T extends object, C extends object, U extends object>
  extends IEntityFormCreate<C>, IEntityFormUpdate<U>, IEntityFormDelete {
  initialData?: T;
}

export interface IEntityList<T extends object> {
  initialMeta?: IResListMeta<T>;
  onMetaUpdate?: (newMeta: IResListMeta<T>) => void;
}
