import { useState } from "react";
import styles from "./Password.module.css";
import LoadingScreen from "../../loadingScreen/LoadingScreen";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
//import { useDispatch } from "react-redux";
//import { changePassword } from "../../../redux-store/userSlice";
import { usersAPI } from "../../dalUser/userApi";

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

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required("required"),
    newPassword: Yup.string()
      .required("required")
      .min(6, "password is too short(at least 6 character)")
      .max(16, "password is too long(max 16 character)"),
    newPasswordConfirm: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "new passwords don't match")
      .required("required"),
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

  return (
    <div className={styles.block}>
      {loading && <LoadingScreen showGif={true} />}

      {/* <div className={styles.label} style={{ verticalAlign: "top" }}>
        <span> change password:</span>
      </div> */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <input
          className={styles.input}
          placeholder="old password"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.currentTarget.value)}
        />
        <span className={styles.error}>{oldPasswordError}</span>
        <input
          className={styles.input}
          placeholder="new password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.currentTarget.value)}
        />
        <span className={styles.error}>{newPasswordError}</span>
        <input
          className={styles.input}
          placeholder="confirm new password"
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
          change password
        </button>
      </div>
    </div>
  );
};

export default Password;
