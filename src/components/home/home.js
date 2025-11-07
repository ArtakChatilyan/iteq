import Navbar from "../navbar/NavBar";
import Footer from "../footer/Footer";
import Cookies from "universal-cookie";
import { useEffect, useState } from "react";
import i18n from "../../localization/i18n";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import HeaderContainer from "../header/HeaderContainer";
import { LanguageContext } from "../../contexts/LanguageContext";
import { supportedLangs } from "../../router";

const Home = ({ router }) => {
  const cookies = new Cookies("langIteq", { path: "/" });
  const { lang } = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  const changeLanguage = (newLang) => {
    if (newLang === lang) return;
    i18n.changeLanguage(newLang);
    cookies.set("langIteq", newLang, {
      expires: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000),
      path: "/",
    });

    const bc = new BroadcastChannel("cookie_change_channel");
    bc.postMessage({
      type: "cookie_updated",
      name: "langCookie",
      value: newLang,
    });
    bc.close();

    const newPath = location.pathname.replace(/^\/[^/]+/, `/${newLang}`);
    navigate(newPath);
  };

  useEffect(() => {
    const cookieLang = cookies.get("langIteq");
    const supported = ["ka", "en", "ru"];
    if (!lang) {
      const target =
        cookieLang && supported.includes(cookieLang) ? cookieLang : "ka";
      navigate(`/${target}`, { replace: true });
      return;
    }

    // If URL lang is invalid, redirect to cookie or default
    if (!supported.includes(lang)) {
      const target =
        cookieLang && supported.includes(cookieLang) ? cookieLang : "ka";
      navigate(`/${target}`, { replace: true });
      return;
    }

    // ✅ Only change language if different
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
      cookies.set("langIteq", lang, {
        expires: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000),
        path: "/",
      });
    }
  }, [lang, i18n, navigate]);

  useEffect(() => {
    const bc = new BroadcastChannel("cookie_change_channel");
    bc.onmessage = (event) => {
      if (
        event.data.type === "cookie_updated" &&
        event.data.name === "langCookie"
      ) {
        const newLang = event.data.value;
        if (newLang && newLang !== lang) {
          const newPath = location.pathname.replace(/^\/[^/]+/, `/${newLang}`);
          navigate(newPath, { replace: true });
        }
      }
    };

    return () => bc.close();
  }, [lang, location, navigate]);

  return (
    <>
      <HeaderContainer changeLanguage={changeLanguage} />
      {/* <LanguageContext.Provider value={language}> */}
      <Navbar />

      <Outlet />
      {/* </LanguageContext.Provider> */}
      <Footer />
    </>
  );
};

export default Home;
