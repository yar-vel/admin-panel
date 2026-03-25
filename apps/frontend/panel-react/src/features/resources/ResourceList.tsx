import { FC, useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import { GridPaginationModel, GridRowSelectionModel } from "@mui/x-data-grid";

import { FormButton } from "@/shared/ui/form/FormButton";
import { useRights } from "@/shared/hooks/useRights";
import { IResource, TResourceReqList } from "@workspace/shared/dist/types";
import {
  getErrorText,
  REQ_LIST_DEFAULT_LIMIT,
  REQ_LIST_DEFAULT_PAGE,
  resListMetaToReq,
} from "@workspace/shared/dist/libs";
import { ResourceTable } from "@/entities/resource/ResourceTable";
import { useResourceListQuery } from "@/entities/resource/queries";
import { useDeleteResourcesMutation } from "./mutations";
import { useAlertsStore } from "@/shared/model/useAlertsStore";
import { IEntityList } from "@/shared/lib/types";
import { ROUTES } from "@/shared/lib/constants";

export const ResourceList: FC<IEntityList<IResource>> = ({
  initialMeta,
  onMetaUpdate,
}) => {
  const { t, i18n } = useTranslation();
  const rights = useRights(ROUTES.api.resources._);
  const addAlert = useAlertsStore((s) => s.addAlert);
  const [selectedRows, setSelectedRows] = useState<IResource["id"][]>([]);
  const [params, setParams] = useState<TResourceReqList>(() =>
    resListMetaToReq<IResource>(initialMeta ?? {}),
  );
  const resourceList = useResourceListQuery(params, {
    placeholderData: (previousData) => previousData,
  });
  const deleteResources = useDeleteResourcesMutation();

  const handlePagination = (model: GridPaginationModel) => {
    const newParams: TResourceReqList = {
      ...params,
      reqPage: model.page + 1,
      reqLimit: model.pageSize,
      reqCount: false,
    };
    setParams(newParams);
    onMetaUpdate?.({
      ...resourceList.data?.meta,
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
    deleteResources.mutate(
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
    if (resourceList.error) {
      addAlert({
        type: "error",
        text: getErrorText(resourceList.error, i18n.language),
      });
    }
  }, [resourceList.error, addAlert, i18n]);

  return (
    <>
      <FormButton
        color="primary"
        startIcon={<AddIcon />}
        disabled={!rights.creating}
        href={ROUTES.ui.newResource}
      >
        {t("create")}
      </FormButton>
      <FormButton
        color="error"
        startIcon={<DeleteIcon />}
        disabled={!rights.deleting || selectedRows.length === 0}
        loading={deleteResources.isPending}
        onClick={handleDelete}
      >
        {t("delete")}
      </FormButton>
      <ResourceTable
        initialState={{
          pagination: {
            paginationModel: {
              page: (params.reqPage || REQ_LIST_DEFAULT_PAGE) - 1,
              pageSize: params.reqLimit || REQ_LIST_DEFAULT_LIMIT,
            },
          },
        }}
        rows={resourceList.data?.rows}
        rowCount={
          resourceList.data?.meta?.total ??
          initialMeta?.total ??
          resourceList.data?.rows?.length
        }
        onRowSelectionModelChange={handleSelection}
        onPaginationModelChange={handlePagination}
        paginationMode="server"
        loading={resourceList.isLoading || deleteResources.isPending}
      />
    </>
  );
};
