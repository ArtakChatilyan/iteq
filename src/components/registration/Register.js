import styles from "./Register.module.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

const Register = ({ register,resendLink, message, error, isSuccess }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required(t("required"))
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        t("incorrectEmail")
      ),
    password: Yup.string()
      .required(t("required"))
      .min(6, t("passwordShort"))
      .max(16, t("passwordLong")),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref("password"), null], t("passwordDontMatch"))
      .required(t("required")),
    name: Yup.string().required(t("required")),
    phone: Yup.string().matches(
      /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
      t("incorrectPhone")
    ),
  });

  const validation = () => {
    setEmailError("");
    setPasswordError("");
    setPasswordConfirmError("");
    setNameError("");
    setPhoneError("");
    validationSchema
      .validate(
        {
          email,
          password,
          passwordConfirm,
          name,
          phone,
        },
        { abortEarly: false }
      )
      .then(function (valid) {
        register({ email, password, name, phone });
      })
      .then(() => {
        setEmail("");
        setName("");
        setPhone("");
        setPassword("");
        setPasswordConfirm("");
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
            case "passwordConfirm":
              setPasswordConfirmError(error.errors[0]);
              break;
            case "name":
              setNameError(error.errors[0]);
              break;
            case "phone":
              setPhoneError(error.errors[0]);
              break;
          }
        });
      });
  };

  const registerKeyDown = (event) => {
    if (event.key === 'Enter') {
      validation();
    }
  };

  return (
    <div className={styles.block} onKeyDown={registerKeyDown}>
      <div className={styles.formItem}>
        <input
          placeholder={t("email") + "*"}
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
          placeholder={t("name") + "*"}
          type="input"
          name="name"
          onChange={(e) => setName(e.currentTarget.value)}
          value={name}
          className={styles.input}
        />
        <span className={styles.error}>{nameError}</span>
      </div>
      <div className={styles.formItem}>
        <input
          placeholder={t("phone") + "*"}
          type="input"
          name="phone"
          onChange={(e) => setPhone(e.currentTarget.value)}
          value={phone}
          className={styles.input}
        />
        <span className={styles.error}>{phoneError}</span>
      </div>
      <div className={styles.formItem}>
        <input
          placeholder={t("password") + "*"}
          type="password"
          name="pass"
          onChange={(e) => setPassword(e.currentTarget.value)}
          value={password}
          className={styles.input}
        />
        <span className={styles.error}>{passwordError}</span>
      </div>
      <div className={styles.formItem}>
        <input
          placeholder={t("passwordConfirm") + "*"}
          type="password"
          name="passConf"
          onChange={(e) => setPasswordConfirm(e.currentTarget.value)}
          value={passwordConfirm}
          className={styles.input}
        />
        <span className={styles.error}>{passwordConfirmError}</span>
      </div>
      <div>
        <button
          type="button"
          className={styles.btn}
          onClick={() => validation()}
        >
          {t("register")}
        </button>
      </div>
      <div style={{ clear: "both", margin: "1rem auto" }}>
        <div className={styles.error}>{error}</div>
        <div className={styles.message}>{message}</div>
        {isSuccess && (
          <div style={{float: "left"}}>
            <span className={styles.label}>if you didn't receive the link</span>{" "}
            <button className={styles.btnLink} onClick={resendLink}>resend activation link</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
