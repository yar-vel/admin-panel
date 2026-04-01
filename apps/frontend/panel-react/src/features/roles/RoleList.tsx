import { FC, useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import { GridPaginationModel, GridRowSelectionModel } from "@mui/x-data-grid";

import { FormButton } from "@/shared/ui/form/FormButton";
import { useRights } from "@/shared/hooks/useRights";
import {
  getErrorText,
  REQ_LIST_DEFAULT_LIMIT,
  REQ_LIST_DEFAULT_PAGE,
  resListMetaToReq,
  IRole,
  TRoleReqList,
} from "@workspace/shared";
import { RoleTable } from "@/entities/role/RoleTable";
import { useRoleListQuery } from "@/entities/role/queries";
import { useDeleteRolesMutation } from "./mutations";
import { useAlertsStore } from "@/shared/model/useAlertsStore";
import { IEntityList } from "@/shared/lib/types";
import { ROUTES } from "@workspace/shared";

export const RoleList: FC<IEntityList<IRole>> = ({
  initialMeta,
  onMetaUpdate,
}) => {
  const { t, i18n } = useTranslation();
  const rights = useRights(ROUTES.api.roles._);
  const addAlert = useAlertsStore((s) => s.addAlert);
  const [selectedRows, setSelectedRows] = useState<IRole["id"][]>([]);
  const [params, setParams] = useState<TRoleReqList>(() =>
    resListMetaToReq<IRole>(initialMeta ?? {}),
  );
  const roleList = useRoleListQuery(params, {
    placeholderData: (previousData) => previousData,
  });
  const deleteRoles = useDeleteRolesMutation();

  const handlePagination = (model: GridPaginationModel) => {
    const newParams: TRoleReqList = {
      ...params,
      reqPage: model.page + 1,
      reqLimit: model.pageSize,
      reqCount: false,
    };
    setParams(newParams);
    onMetaUpdate?.({
      ...roleList.data?.meta,
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
    deleteRoles.mutate(
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
    if (roleList.error) {
      addAlert({
        type: "error",
        text: getErrorText(roleList.error, i18n.language),
      });
    }
  }, [roleList.error, addAlert, i18n]);

  return (
    <>
      <FormButton
        color="primary"
        startIcon={<AddIcon />}
        disabled={!rights.creating}
        href={ROUTES.ui.newRole}
      >
        {t("create")}
      </FormButton>
      <FormButton
        color="error"
        startIcon={<DeleteIcon />}
        disabled={!rights.deleting || selectedRows.length === 0}
        loading={deleteRoles.isPending}
        onClick={handleDelete}
      >
        {t("delete")}
      </FormButton>
      <RoleTable
        initialState={{
          pagination: {
            paginationModel: {
              page: (params.reqPage || REQ_LIST_DEFAULT_PAGE) - 1,
              pageSize: params.reqLimit || REQ_LIST_DEFAULT_LIMIT,
            },
          },
        }}
        rows={roleList.data?.rows}
        rowCount={
          roleList.data?.meta?.total ??
          initialMeta?.total ??
          roleList.data?.rows?.length
        }
        onRowSelectionModelChange={handleSelection}
        onPaginationModelChange={handlePagination}
        paginationMode="server"
        loading={roleList.isLoading || deleteRoles.isPending}
      />
    </>
  );
};
