import { useState } from "react";
import styles from "./Login.module.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

const Login = ({ login, error, close, sendLink }) => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [modal, setModal] = useState(false);
  const [isAnimate, setIsAnimate] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required(t("required"))
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        t("incorrectEmail")
      ),
    password: Yup.string()
      .required(t("required"))
      .min(6, t("wrongPassword"))
      .max(16, t("wrongPassword")),
  });

  const validationSchemaRecover = Yup.object().shape({
    email: Yup.string()
      .required(t("required"))
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        t("incorrectEmail")
      ),
  });

  const validate = () => {
    setEmailError("");
    setPasswordError("");
    validationSchema
      .validate(
        {
          email,
          password,
        },
        { abortEarly: false }
      )
      .then(function (valid) {
        login({ email, password });
      })
      .then(() => {
        setEmail("");
        setPassword("");
      })
      .catch(function (errors) {
        errors.inner.forEach((error) => {
          switch (error.path) {
            case "email":
              setEmailError(error.errors[0]);
              break;
            case "password":
              setPasswordError(error.errors[0]);
              break;
          }
        });
      });
  };

  const validateForRecover = () => {
    setEmailError("");
    setPasswordError("");
    validationSchemaRecover
      .validate(
        {
          email,
        },
        { abortEarly: false }
      )
      .then(function (valid) {
        sendLink({ email });
      })
      .then(() => {
        setModal(true);
        setIsAnimate(true);
      })
      .catch(function (errors) {
        errors.inner.forEach((error) => {
          switch (error.path) {
            case "email":
              setEmailError(error.errors[0]);
              break;
          }
        });
      });
  };

  const loginKeyDown = (event) => {
    if (event.key === "Enter") {
      validate();
    }
  };

  const closeModal = () => {
    setIsAnimate(false);
    setTimeout(() => {
      setModal(false);
    }, 600);
  };

  return (
    <div className={styles.block} onKeyDown={loginKeyDown}>
      <div className={styles.formItem}>
        <input
          placeholder={t("email")}
          type="input"
          name="email"
          onChange={(e) => setEmail(e.currentTarget.value)}
          value={email}
          className={styles.input}
        />
        <span className={styles.error}>{emailError}</span>
      </div>
      <div className={styles.formItem}>
        <input
          placeholder={t("password")}
          type="password"
          name="pass"
          onChange={(e) => setPassword(e.currentTarget.value)}
          value={password}
          className={styles.input}
        />
        <span className={styles.error}>{passwordError}</span>
      </div>
      <div style={{ clear: "both", float: "left" }}>
        <Link
          to="#"
          className={styles.link}
          style={{ color: "dodgerblue" }}
          onClick={() => validateForRecover()}
        >
          {t("forgotPassword")}
        </Link>
      </div>
      <div>
        <button
          type="button"
          className={styles.btn}
          style={{ clear: "both" }}
          onClick={() => validate()}
        >
          {t("login")}
        </button>
      </div>
      <div style={{ clear: "both", float: "left" }}>
        <Link to="/register" className={styles.link} onClick={close}>
          {t("registration")}
        </Link>
      </div>
      <div style={{ clear: "both", margin: "1rem auto" }}>
        <span className={styles.error}>{error}</span>
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
            <div className={styles.info}>
              <p style={{ marginBottom: "1rem" }}>{t("recoveryLink")}</p>{" "}
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

export default Login;
