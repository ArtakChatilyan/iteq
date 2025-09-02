import { useState } from "react";
import styles from "./Login.module.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

const Login = ({ login, error, close }) => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

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

  return (
    <div className={styles.block}>
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
      <div>
        <button type="button" className={styles.btn} onClick={() => validate()}>
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
    </div>
  );
};

export default Login;
