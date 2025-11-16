import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { visitsAPI } from "../dalUser/userApi";

function usePageTracker() {
  const location = useLocation();

  useEffect(() => {
    if (!window.location.href.includes("localhost")) {
      visitsAPI
        .addVisit({
          page_url: window.location.href,
          referrer: document.referrer,
        })
        .then((response) => {})
        .catch((error) => console.log(error))
        .finally(() => {});
    }
  }, [location.pathname]);
}

export default usePageTracker;
