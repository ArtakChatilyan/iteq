import { useParams } from "react-router-dom";
import styles from "./PasswordRecovery.module.css";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useState } from "react";
import { usersAPI } from "../dalUser/userApi";
import LoadingScreen from "../loadingScreen/LoadingScreen";

const PasswordRecovery = () => {
  const userId = useParams().userId;
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");

  const [modal, setModal] = useState(false);
  const [isAnimate, setIsAnimate] = useState(false);


  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required(t("admin_required"))
      .min(6, t("admin_passwordTooShort"))
      .max(16, t("admin_passwordTooLong")),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref("password"), null], t("admin_passwordsDontMatch"))
      .required(t("admin_required")),
  });

  const changePasswordHandle = async () => {
    setPasswordError("");
    setPasswordConfirmError("");
    validationSchema
      .validate(
        {
          password,
          passwordConfirm,
        },
        { abortEarly: false }
      )
      .then(function (valid) {
        setLoading(true);
        usersAPI
          .setPassword(
            userId,
            password
          )
          .then((response) => {
            setModal(true);
            setIsAnimate(true);
          })
          .finally(() => setLoading(false));
      })
      .then(() => {
        setPassword("");
        setPasswordConfirm("");
        setPasswordError("");
        setPasswordConfirmError("");
      })
      .catch(function (errors) {
        errors.inner.forEach((error) => {
          switch (error.path) {
            case "password":
              setPasswordError(error.errors[0]);
              break;
            case "passwordConfirm":
              setPasswordConfirmError(error.errors[0]);
              break;
          }
        });
      });
  };

  const closeModal = () => {
    setIsAnimate(false);
    setTimeout(() => {
      setModal(false);
    }, 600);
  };

  return (
    <div className={styles.block}>
      {loading && <LoadingScreen showGif={true} />}
      {userId ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <input
            className={styles.input}
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <span className={styles.error}>{passwordError}</span>
          <input
            className={styles.input}
            placeholder="confirm password"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.currentTarget.value)}
          />
          <span className={styles.error}>{passwordConfirmError}</span>
          <button
            className={styles.btn}
            style={{ width: "50%" }}
            onClick={changePasswordHandle}
          >
            change password
          </button>
        </div>
      ) : (
        <span className={styles.wrong}>{t("wrongRecoveryLink")}</span>
      )}
      <div className={modal ? styles.modal : styles.hide}>
        <div
          className={
            isAnimate
              ? "animate__animated animate__bounceInDown"
              : "animate__animated animate__bounceOutUp"
          }
        >
          <div className={styles.btnGroup}>
            <div className={styles.info}>
              <p style={{ marginBottom: "1rem" }}>{t("passwordChanged")}</p>{" "}
            </div>
            <button className={styles.btnClose} onClick={closeModal}>
              {t("admin_close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordRecovery;
