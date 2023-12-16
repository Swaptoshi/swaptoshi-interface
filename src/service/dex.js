import { serviceGET } from "./node";

export const getDEXPool = async (param, serviceUrl) => {
  const searchParams = new URLSearchParams(param);
  const pool = await serviceGET(
    `/api/v3/dex/pool?${searchParams.toString()}`,
    serviceUrl
  );
  return pool;
};

export const getDEXPoolTick = async (param, serviceUrl) => {
  const searchParams = new URLSearchParams(param);
  const pool = await serviceGET(
    `/api/v3/dex/pool/tick?${searchParams.toString()}`,
    serviceUrl
  );
  return pool;
};

export const getDEXPosition = async (param, serviceUrl) => {
  const searchParams = new URLSearchParams(param);
  const position = await serviceGET(
    `/api/v3/dex/position?${searchParams.toString()}`,
    serviceUrl
  );
  return position;
};

export const getDEXPositionMetadata = async (param, serviceUrl) => {
  const searchParams = new URLSearchParams(param);
  const position = await serviceGET(
    `/api/v3/dex/position/metadata?${searchParams.toString()}`,
    serviceUrl
  );
  return position;
};

export const getDEXPositionValue = async (param, serviceUrl) => {
  const searchParams = new URLSearchParams(param);
  const position = await serviceGET(
    `/api/v3/dex/position/value?${searchParams.toString()}`,
    serviceUrl
  );
  return position;
};

export const getPriceOhlc = async (param, serviceUrl) => {
  const searchParams = new URLSearchParams(param);
  const price = await serviceGET(
    `/api/v3/dex/price/ohlc?${searchParams.toString()}`,
    serviceUrl
  );
  return price;
};

export const getPriceTick = async (param, serviceUrl) => {
  const searchParams = new URLSearchParams(param);
  const price = await serviceGET(
    `/api/v3/dex/price/tick?${searchParams.toString()}`,
    serviceUrl
  );
  return price;
};

export const getPrice = async (param, serviceUrl) => {
  const searchParams = new URLSearchParams(param);
  const price = await serviceGET(
    `/api/v3/dex/price?${searchParams.toString()}`,
    serviceUrl
  );
  return price;
};

export const getQuote = async (param, serviceUrl) => {
  const searchParams = new URLSearchParams(param);
  const quote = await serviceGET(
    `/api/v3/dex/quote?${searchParams.toString()}`,
    serviceUrl
  );
  return quote;
};

export const getRoute = async (param, serviceUrl) => {
  const searchParams = new URLSearchParams(param);
  const route = await serviceGET(
    `/api/v3/dex/route?${searchParams.toString()}`,
    serviceUrl
  );
  return route;
};

export const getStatistic = async (param, serviceUrl) => {
  const searchParams = new URLSearchParams(param);
  const statistic = await serviceGET(
    `/api/v3/dex/statistic?${searchParams.toString()}`,
    serviceUrl
  );
  return statistic;
};

export const getDEXToken = async (param, serviceUrl) => {
  const searchParams = new URLSearchParams(param);
  const token = await serviceGET(
    `/api/v3/dex/token?${searchParams.toString()}`,
    serviceUrl
  );
  return token;
};

export const getDEXTokenCompact = async (param, serviceUrl) => {
  const searchParams = new URLSearchParams(param);
  const token = await serviceGET(
    `/api/v3/dex/token/compact?${searchParams.toString()}`,
    serviceUrl
  );
  return token;
};
