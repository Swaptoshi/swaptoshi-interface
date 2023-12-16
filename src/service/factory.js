import { serviceGET, servicePOST } from "./node";

export const postFactoryCreate = async (data, serviceUrl) => {
  const response = await servicePOST(
    `/api/v3/factory/create`,
    data,
    serviceUrl
  );
  return response;
};

export const getFactoryToken = async (params, serviceUrl) => {
  const searchParams = new URLSearchParams(params);
  const response = await serviceGET(
    `/api/v3/factory/token?${searchParams.toString()}`,
    serviceUrl
  );
  return response;
};

export const getFactoryTokenMeta = async (params, serviceUrl) => {
  const searchParams = new URLSearchParams(params);
  const response = await serviceGET(
    `/api/v3/factory/token/meta?${searchParams.toString()}`,
    serviceUrl
  );
  return response;
};

export const getFactoryStatistic = async (params, serviceUrl) => {
  const searchParams = new URLSearchParams(params);
  const response = await serviceGET(
    `/api/v3/factory/statistic?${searchParams.toString()}`,
    serviceUrl
  );
  return response;
};
