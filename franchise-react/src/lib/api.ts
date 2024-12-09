import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const logOnDev = (message: string) => {
  if (import.meta.env.NODE_ENV === "development") console.log(message);
};

const onRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const { method, url } = config;
  const accessToken = localStorage.getItem("token");
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  logOnDev(`🚀 [API] ${method?.toUpperCase()} ${url} | Request`);

  return config;
};

api.interceptors.request.use(onRequest);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    }
    console.error("Looks like there was a problem. Status Code: " + error.response.status);
    return Promise.reject(error);
  },
);

export const publicApi: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const formDataApi: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_URL,
  headers: {
    Accept: "application/json",
    "Content-type": "multipart/form-data",
  },
});

formDataApi.interceptors.request.use(onRequest);

formDataApi.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/";
    }
    console.error("Looks like there was a problem. Status Code: " + error.response.status);
    return Promise.reject(error);
  },
);

const downloadFile = (res: any, defaultFileName: string) => {
  // Determine the file name from the response headers
  const contentDisposition = res.headers["content-disposition"];

  let fileName = defaultFileName;

  if (contentDisposition) {
    // Match both filename and filename* (RFC 5987)
    const fileNameMatch = contentDisposition.match(/filename\*?=['"]?([^;\r\n]+)['"]?/);
    if (fileNameMatch && fileNameMatch.length > 1) {
      fileName = decodeURIComponent(fileNameMatch[1].replace(/['"]/g, ""));
    }
  }

  const blob = new Blob([res.data], { type: res.headers["content-type"] });
  const url = window.URL.createObjectURL(blob);

  // Create a hidden download link and click it programmatically
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  window.URL.revokeObjectURL(url);
};

export { formDataApi, downloadFile };
export default api;
