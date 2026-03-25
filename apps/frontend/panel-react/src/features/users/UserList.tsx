import { FC, useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import { GridPaginationModel, GridRowSelectionModel } from "@mui/x-data-grid";

import { FormButton } from "@/shared/ui/form/FormButton";
import { useRights } from "@/shared/hooks/useRights";
import { IUser, TUserReqList } from "@workspace/shared/dist/types";
import {
  getErrorText,
  REQ_LIST_DEFAULT_LIMIT,
  REQ_LIST_DEFAULT_PAGE,
  resListMetaToReq,
} from "@workspace/shared/dist/libs";
import { UserTable } from "@/entities/user/UserTable";
import { useUserListQuery } from "@/entities/user/queries";
import { useDeleteUsersMutation } from "./mutations";
import { useAlertsStore } from "@/shared/model/useAlertsStore";
import { IEntityList } from "@/shared/lib/types";
import { ROUTES } from "@/shared/lib/constants";

export const UserList: FC<IEntityList<IUser>> = ({
  initialMeta,
  onMetaUpdate,
}) => {
  const { t, i18n } = useTranslation();
  const rights = useRights(ROUTES.api.users._);
  const addAlert = useAlertsStore((s) => s.addAlert);
  const [selectedRows, setSelectedRows] = useState<IUser["id"][]>([]);
  const [params, setParams] = useState<TUserReqList>(() =>
    resListMetaToReq<IUser>(initialMeta ?? {}),
  );
  const userList = useUserListQuery(params, {
    placeholderData: (previousData) => previousData,
  });
  const deleteUsers = useDeleteUsersMutation();

  const handlePagination = (model: GridPaginationModel) => {
    const newParams: TUserReqList = {
      ...params,
      reqPage: model.page + 1,
      reqLimit: model.pageSize,
      reqCount: false,
    };
    setParams(newParams);
    onMetaUpdate?.({
      ...userList.data?.meta,
      page: newParams.reqPage,
      limit: newParams.reqLimit,
    });
  };

  const handleSelection = (rowSelectionModel: GridRowSelectionModel) =>
    setSelectedRows(
      rowSelectionModel.ids
        .values()
        .toArray()
        .map((value) => value.toString()),
    );

  const handleDelete = () =>
    deleteUsers.mutate(
      { items: selectedRows },
      {
        onSuccess: () => {
          addAlert({ type: "success", text: t("success") });
          setParams((prev) => ({ ...prev, reqCount: true }));
        },
        onError: (error) =>
          addAlert({ type: "error", text: getErrorText(error, i18n.language) }),
      },
    );

  useEffect(() => {
    if (userList.error) {
      addAlert({
        type: "error",
        text: getErrorText(userList.error, i18n.language),
      });
    }
  }, [userList.error, addAlert, i18n]);

  return (
    <>
      <FormButton
        color="primary"
        startIcon={<AddIcon />}
        disabled={!rights.creating}
        href={ROUTES.ui.newUser}
      >
        {t("create")}
      </FormButton>
      <FormButton
        color="error"
        startIcon={<DeleteIcon />}
        disabled={!rights.deleting || selectedRows.length === 0}
        loading={deleteUsers.isPending}
        onClick={handleDelete}
      >
        {t("delete")}
      </FormButton>
      <UserTable
        initialState={{
          pagination: {
            paginationModel: {
              page: (params.reqPage || REQ_LIST_DEFAULT_PAGE) - 1,
              pageSize: params.reqLimit || REQ_LIST_DEFAULT_LIMIT,
            },
          },
        }}
        rows={userList.data?.rows}
        rowCount={
          userList.data?.meta?.total ??
          initialMeta?.total ??
          userList.data?.rows?.length
        }
        onRowSelectionModelChange={handleSelection}
        onPaginationModelChange={handlePagination}
        paginationMode="server"
        loading={userList.isLoading || deleteUsers.isPending}
      />
    </>
  );
};
