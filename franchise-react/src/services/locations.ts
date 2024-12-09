import { publicApi } from "@/lib/api";

export const getCountries = async () => {
  try {
    const response = await publicApi.get("/location/countries");
    return response.data;
  } catch (error) {
    console.error("Error" + error);
  }
};

export const getStates = async () => {
  try {
    const response = await publicApi.post("/location/states");
    return response.data;
  } catch (error) {
    console.error("Error" + error);
  }
};
export const getStatesByCountryId = async (country_code: string) => {
  try {
    const response = await publicApi.post("/location/states", { state_country_code: country_code });
    return response.data;
  } catch (error) {
    console.error("Error" + error);
  }
};

export const getCities = async (state_id: string) => {
  try {
    const response = await publicApi.post("/location/cities", { state_id });
    return response.data;
  } catch (error) {
    console.error("Error" + error);
  }
};

export const getLocationsByPincode = async (pincode: string) => {
  try {
    const response = await publicApi.post("/location/pincode-details", { pincode });
    return response.data;
  } catch (error) {
    console.error("Error" + error);
  }
};
