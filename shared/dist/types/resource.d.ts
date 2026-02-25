import { IReqList, IResList } from './api';
import type { IRights } from './database';
export interface IResource {
    id: string;
    name: string;
    path: string;
    description?: string | null;
    enabled: boolean;
    default: boolean;
    rights?: IRights[];
}
export type TResourceCreate = Required<Pick<IResource, 'name' | 'path'>> & Partial<Pick<IResource, 'enabled' | 'description'>>;
export type TResourceReqListParams = Partial<Pick<IResource, 'name' | 'path' | 'enabled' | 'default'>>;
export type TResourceReqList = IReqList<IResource> & TResourceReqListParams;
export type TResourceResList = IResList<IResource>;
export type TResourceUpdate = Partial<Pick<IResource, 'name' | 'path' | 'description' | 'enabled'>>;
//# sourceMappingURL=resource.d.ts.map