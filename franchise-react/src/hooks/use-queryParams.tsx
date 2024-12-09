import { useLocation, useNavigate } from "react-router-dom";

const useQueryParams = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Immediately update the URL search parameters when the component mounts
  const searchParams = new URLSearchParams(location.search);

  const addQueryParams = (queryParams: Record<string, string>, replace: boolean = false) => {
    const searchParams = new URLSearchParams(replace ? undefined : location.search);

    Object.entries(queryParams).forEach(([key, value]) => {
      if (value === "") {
        searchParams.delete(key);
        return;
      }

      searchParams.set(key, value);
    });

    const newUrl = `${location.pathname}?${searchParams.toString()}`;
    navigate(newUrl, { replace: true });
  };

  const deleteQueryParam = (key: string) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete(key);

    const newUrl = `${location.pathname}?${searchParams.toString()}`;
    navigate(newUrl, { replace: true });
  };

  const getQueryParam = (key: string): string | null => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get(key) || null;
  };

  const hasQueryParam = (key: string): boolean => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.has(key);
  };

  const clearQueryParams = () => {
    const newUrl = `${location.pathname}`;
    navigate(newUrl, { replace: true });
  };

  return {
    deleteQueryParam,
    getQueryParam,
    hasQueryParam,
    clearQueryParams,
    searchParams,
    addQueryParams,
  };
};

export default useQueryParams;
