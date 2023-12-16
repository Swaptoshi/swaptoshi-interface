import axios from "axios";

export const serviceGET = async (url, serviceUrl) => {
  const response = await axios.get(
    `${serviceUrl ? serviceUrl : process.env.REACT_APP_LISK_SERVICE_URL}${url}`
  );
  if (response && Object.keys(response).includes("error") && response.error) {
    throw new Error(response.message);
  }
  return response;
};

export const servicePOST = async (url, data, serviceUrl) => {
  const response = await axios.post(
    `${serviceUrl ? serviceUrl : process.env.REACT_APP_LISK_SERVICE_URL}${url}`,
    data
  );
  if (response && Object.keys(response).includes("error") && response.error) {
    throw new Error(response.message);
  }
  return response;
};

export const checkServiceNode = async (serviceHttp) => {
  try {
    await axios.get(`${serviceHttp}/api/v3/index/status`);
    return true;
  } catch {
    return false;
  }
};
