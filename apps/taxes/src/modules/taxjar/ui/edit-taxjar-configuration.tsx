import { useDashboardNotification } from "@saleor/apps-shared";
import { Box, Button, Text } from "@saleor/macaw-ui/next";
import { useRouter } from "next/router";
import { z } from "zod";
import { trpcClient } from "../../trpc/trpc-client";
import { TaxJarConfig } from "../taxjar-config";
import { TaxJarConfigurationForm } from "./taxjar-configuration-form";
import React from "react";

export const EditTaxJarConfiguration = () => {
  const router = useRouter();
  const { id } = router.query;
  const configurationId = z.string().parse(id ?? "");

  const { refetch: refetchProvidersConfigurationData } =
    trpcClient.providersConfiguration.getAll.useQuery();

  const { notifySuccess, notifyError } = useDashboardNotification();
  const { mutate: patchMutation, isLoading: isPatchLoading } =
    trpcClient.taxJarConfiguration.patch.useMutation({
      onSuccess() {
        notifySuccess("Success", "Updated TaxJar configuration");
        refetchProvidersConfigurationData();
      },
      onError(error) {
        notifyError("Error", error.message);
      },
    });

  const {
    data,
    isLoading: isGetLoading,
    isError: isGetError,
  } = trpcClient.taxJarConfiguration.get.useQuery(
    { id: configurationId },
    {
      enabled: !!configurationId,
    }
  );

  const submitHandler = React.useCallback(
    (data: TaxJarConfig) => {
      patchMutation({ value: data, id: configurationId });
    },
    [configurationId, patchMutation]
  );

  const { mutate: deleteMutation, isLoading: isDeleteLoading } =
    trpcClient.taxJarConfiguration.delete.useMutation({
      onSuccess() {
        notifySuccess("Success", "Deleted TaxJar configuration");
        refetchProvidersConfigurationData();
        router.push("/configuration");
      },
      onError(error) {
        notifyError("Error", error.message);
      },
    });

  const deleteHandler = () => {
    /*
     * // todo: add support for window.confirm to AppBridge or wait on Dialog component in Macaw
     * if (window.confirm("Are you sure you want to delete the provider?")) {
     */
    deleteMutation({ id: configurationId });
    // }
  };

  if (isGetLoading) {
    // todo: replace with skeleton once its available in Macaw
    return (
      <Box>
        <Text color="textNeutralSubdued">Loading...</Text>
      </Box>
    );
  }

  if (isGetError) {
    return (
      <Box>
        <Text color="textCriticalDefault">Error while fetching the provider data.</Text>
      </Box>
    );
  }

  return (
    <TaxJarConfigurationForm
      isLoading={isPatchLoading}
      onSubmit={submitHandler}
      defaultValues={data.config}
      cancelButton={
        <Button onClick={deleteHandler} variant="error">
          Delete provider
        </Button>
      }
    />
  );
};