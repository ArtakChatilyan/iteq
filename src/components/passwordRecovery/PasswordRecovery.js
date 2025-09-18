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

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("required")
      .min(6, "password is too short(at least 6 character)")
      .max(16, "password is too long(max 16 character)"),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref("password"), null], "passwords don't match")
      .required("required"),
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
          .then((response) => console.log(response))
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
    </div>
  );
};

export default PasswordRecovery;
