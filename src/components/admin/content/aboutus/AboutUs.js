import { createRef, useEffect, useState } from "react";
import RichTextEditor from "../../richtext/richText";
// import "./richText.css";
import styles from "./AboutUs.module.css";
import { stateFromHTML } from "draft-js-import-html";
import SplashScreen from "../splashscreen/SplashScreen";
import { settingsAPI } from "../../dal/api";
import { useTranslation } from "react-i18next";

const AboutUs = () => {
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const refAboutEn = createRef();
  const refAboutGe = createRef();
  const refAboutRu = createRef();
  const [contentAboutEn, setContentAboutEn] = useState();
  const [contentAboutGe, setContentAboutGe] = useState();
  const [contentAboutRu, setContentAboutRu] = useState();

  useEffect(() => {
    getAbout();
  }, []);

  useEffect(() => {
    if (editMode) {
      refAboutEn.current.focus();
      refAboutGe.current.focus();
      refAboutRu.current.focus();
    }
  }, [editMode]);

  const getAbout = () => {
    settingsAPI
      .getAbout()
      .then((response) => {
        if (response.data) {
          setContentAboutEn(response.data.about.aboutEn);
          setContentAboutGe(response.data.about.aboutGe);
          setContentAboutRu(response.data.about.aboutRu);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateContent = () => {
    setLoading(true);
    settingsAPI
      .updateAbout({
        aboutEn: refAboutEn.current.getContent(),
        aboutGe: refAboutGe.current.getContent(),
        aboutRu: refAboutRu.current.getContent(),
      })
      .then((response) => {
        if (response.data) {
          setContentAboutEn(response.data.about.aboutEn);
          setContentAboutGe(response.data.about.aboutGe);
          setContentAboutRu(response.data.about.aboutRu);
        }
        setEditMode(false);
      })
      .catch((error) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={styles.block}>
      {loading && <SplashScreen />}
      {editMode && (
        <div>
          <RichTextEditor
            name="contentAboutEn"
            ref={refAboutEn}
            content={stateFromHTML(contentAboutEn)}
          />
          <RichTextEditor
            name="contentAboutGe"
            ref={refAboutGe}
            content={stateFromHTML(contentAboutGe)}
          />
          <RichTextEditor
            name="contentAboutRu"
            ref={refAboutRu}
            content={stateFromHTML(contentAboutRu)}
          />
        </div>
      )}
      {editMode || (
        <div>
          <div
            className={styles.detailInfo}
            dangerouslySetInnerHTML={{ __html: contentAboutEn }}
          />
          <div
            className={styles.detailInfo}
            dangerouslySetInnerHTML={{ __html: contentAboutGe }}
          />
          <div
            className={styles.detailInfo}
            dangerouslySetInnerHTML={{ __html: contentAboutRu }}
          />
        </div>
      )}
      <div className={styles.buttons}>
        {editMode && (
          <div>
            <button className={styles.btn} onClick={updateContent}>
              {t("admin_save")}
            </button>
            <button className={styles.btn} onClick={() => setEditMode(false)}>
              {t("admin_cancel")}
            </button>
          </div>
        )}
        {editMode || (
          <div>
            <button className={styles.btn} onClick={() => setEditMode(true)}>
              {t("admin_edit")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutUs;
