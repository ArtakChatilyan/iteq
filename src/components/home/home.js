import Navbar from "../navbar/NavBar";
import Footer from "../footer/Footer";
import Cookies from "universal-cookie";
import { useEffect, useState } from "react";
import i18n from "../../localization/i18n";
import { Outlet } from "react-router-dom";
import HeaderContainer from "../header/HeaderContainer";
import { LanguageContext } from "../../contexts/LanguageContext";

const Home = ({ router }) => {
  const cookies = new Cookies();
  const [language, setLanguage] = useState(null);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    cookies.set("langIteq", lang, {
      expires: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000),
    });
    setLanguage(lang);
  };

  useEffect(() => {
    let lang = cookies.get("langIteq");

    if (lang) {
      setLanguage(lang);
      i18n.changeLanguage(lang);
    } else {
      setLanguage("ge");
    }
  }, []);

  return (
    <>
      <HeaderContainer changeLanguage={changeLanguage} />
      <LanguageContext.Provider value={language}>
        <Navbar />

        <Outlet lang={language} />
      </LanguageContext.Provider>
      <Footer lang={language} />
    </>
  );
};

export default Home;
