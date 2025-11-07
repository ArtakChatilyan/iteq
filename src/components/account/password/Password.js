import { useState } from "react";
import styles from "./Password.module.css";
import LoadingScreen from "../../loadingScreen/LoadingScreen";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
//import { useDispatch } from "react-redux";
//import { changePassword } from "../../../redux-store/userSlice";
import { usersAPI } from "../../dalUser/userApi";
import { Helmet } from "react-helmet-async";

const Password = () => {
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  //const dispatch = useDispatch();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setConfirmPassword] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [newPasswordConfirmError, setConfirmPasswordError] = useState("");

  const [modal, setModal] = useState(false);
  const [isAnimate, setIsAnimate] = useState(false);

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required(t("admin_required")),
    newPassword: Yup.string()
      .required(t("admin_required"))
      .min(6, t("admin_passwordTooShort"))
      .max(16, t("admin_passwordTooLong")),
    newPasswordConfirm: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], t("admin_passwordsDontMatch"))
      .required(t("admin_required")),
  });

  const changePasswordHandle = async () => {
    setOldPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");
    validationSchema
      .validate(
        {
          oldPassword,
          newPassword,
          newPasswordConfirm,
        },
        { abortEarly: false }
      )
      .then(function (valid) {
        setLoading(true);
        usersAPI
          .changePassword({
            oldPassword,
            newPassword,
          })
          .then((response) => console.log(response))
          .finally(() => setLoading(false));
      })
      .then(() => {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setOldPasswordError("");
        setNewPasswordError("");
        setConfirmPasswordError("");
      })
      .catch(function (errors) {
        errors.inner.forEach((error) => {
          switch (error.path) {
            case "oldPassword":
              setOldPasswordError(error.errors[0]);
              break;
            case "newPassword":
              setNewPasswordError(error.errors[0]);
              break;
            case "newPasswordConfirm":
              setConfirmPasswordError(error.errors[0]);
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
    <>
      <Helmet>
        <title>{t("settings") + " | ITEQ Shop"}</title>
      </Helmet>
      <div className={styles.block}>
        {loading && <LoadingScreen showGif={true} />}

        {/* <div className={styles.label} style={{ verticalAlign: "top" }}>
        <span> change password:</span>
      </div> */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <input
            className={styles.input}
            placeholder={t("admin_oldPassword")}
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.currentTarget.value)}
          />
          <span className={styles.error}>{oldPasswordError}</span>
          <input
            className={styles.input}
            placeholder={t("admin_newPassword")}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.currentTarget.value)}
          />
          <span className={styles.error}>{newPasswordError}</span>
          <input
            className={styles.input}
            placeholder={t("admin_confirmNewPassword")}
            type="password"
            value={newPasswordConfirm}
            onChange={(e) => setConfirmPassword(e.currentTarget.value)}
          />
          <span className={styles.error}>{newPasswordConfirmError}</span>
          <button
            className={styles.btn}
            style={{ width: "50%" }}
            onClick={changePasswordHandle}
          >
            {t("admin_changePassword")}
          </button>
        </div>
        <div className={modal ? styles.modal : styles.hide}>
          <div
            className={
              isAnimate
                ? "animate__animated animate__bounceInDown"
                : "animate__animated animate__bounceOutUp"
            }
          >
            <div className={styles.btnGroup}>
              <div className={styles.infoClose}>
                <p style={{ marginBottom: "1rem" }}>{t("passwordChanged")}</p>{" "}
              </div>
              <button className={styles.btnClose} onClick={closeModal}>
                {t("admin_close")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Password;
