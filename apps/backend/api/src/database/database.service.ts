import { Injectable } from '@nestjs/common';

import { TDatabaseGetList } from './database.types';
import {
  REQ_LIST_DEFAULT_LIMIT,
  REQ_LIST_DEFAULT_PAGE,
  REQ_LIST_MAX_LIMIT,
  IReqList,
  IResListMeta,
} from '@workspace/shared';

@Injectable()
export class DatabaseService {
  buildGetListOptions<T extends object>(
    reqList: IReqList<T> = {},
    options: TDatabaseGetList<T> = {},
    meta: IResListMeta<T> = {},
  ) {
    if (
      reqList.reqLimit &&
      reqList.reqLimit > 0 &&
      reqList.reqLimit <= REQ_LIST_MAX_LIMIT
    ) {
      options.take = reqList.reqLimit;
      meta.limit = reqList.reqLimit;
    } else {
      options.take = REQ_LIST_DEFAULT_LIMIT;
      meta.limit = REQ_LIST_DEFAULT_LIMIT;
    }

    if (reqList.reqPage && reqList.reqPage > 0) {
      options.skip = (reqList.reqPage - 1) * options.take;
      meta.page = reqList.reqPage;
    } else {
      options.skip = 0;
      meta.page = REQ_LIST_DEFAULT_PAGE;
    }

    if (reqList.reqSortField && reqList.reqSortOrder) {
      options.order = {
        [reqList.reqSortField]: reqList.reqSortOrder,
      } as TDatabaseGetList<T>['order'];
      meta.sort = { field: reqList.reqSortField, order: reqList.reqSortOrder };
    }

    return { options, meta };
  }
}
