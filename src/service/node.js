import axios from "axios";

export const serviceGET = async (url, serviceUrl) => {
  try {
    const response = await axios.get(`${serviceUrl}${url}`);
    return response;
  } catch (error) {
    console.error("Error:", error);
    return undefined;
  }
};
