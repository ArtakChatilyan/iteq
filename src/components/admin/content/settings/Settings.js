import { useEffect, useRef, useState } from "react";
import styles from "./Settings.module.css";
import { settingsAPI } from "../../dal/api";
import SplashScreen from "../splashscreen/SplashScreen";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { changePassword } from "../../../../redux-store/userSlice";
import { Formik } from "formik";
import ReactPlayer from "react-player";

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const [addressEn, setAddressEn] = useState(" ");
  const [addressGe, setAddressGe] = useState("");
  const [addressRu, setAddressRu] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setConfirmPassword] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [newPasswordConfirmError, setConfirmPasswordError] = useState("");

  const [addressEnMode, setAddressEnMode] = useState(false);
  const [addressGeMode, setAddressGeMode] = useState(false);
  const [addressRuMode, setAddressRuMode] = useState(false);
  const [emailMode, setEmailMode] = useState(false);
  const [phoneMode, setPhoneMode] = useState(false);

  const fileInputRef = useRef(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [resultMessage, setResultMessage] = useState("");

  const hideMessage = () => {
    setTimeout(() => {
      setResultMessage("");
    }, 2000);
  };

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required("required"),
    newPassword: Yup.string()
      .required(t("admin_required"))
      .min(6, t("admin_passwordTooShort"))
      .max(16, t("admin_passwordTooLong")),
    newPasswordConfirm: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], t("admin_passwordsDontMatch"))
      .required(t("required")),
  });

  const changePasswordHandle = () => {
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
        dispatch(changePassword({ oldPassword, newPassword })).then(
          (response) => {
            console.log(response);
          }
        );
        //changePassword({ oldPassword, newPassword, newPasswordConfirm });
      })
      .then(() => {
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

  useEffect(() => {
    LoadContacts();
  }, []);

  const LoadContacts = () => {
    settingsAPI
      .getContacts()
      .then((response) => {
        setAddressEn(response.data.contacts.addressEn);
        setAddressGe(response.data.contacts.addressGe);
        setAddressRu(response.data.contacts.addressRu);
        setEmail(response.data.contacts.email);
        setPhone(response.data.contacts.phone);
        setMediaFile(response.data.contacts.mediaUrl);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateAddressEn = () => {
    setLoading(true);
    settingsAPI
      .updateContact({ contact: "addressEn", value: addressEn })
      .then((response) => {
        setAddressEn(response.data.addressEn);
        setAddressEnMode(false);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const updateAddressGe = () => {
    setLoading(true);
    settingsAPI
      .updateContact({ contact: "addressGe", value: addressGe })
      .then((response) => {
        setAddressGe(response.data.addressGe);
        setAddressGeMode(false);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const updateAddressRu = () => {
    setLoading(true);
    settingsAPI
      .updateContact({ contact: "addressRu", value: addressRu })
      .then((response) => {
        setAddressRu(response.data.addressRu);
        setAddressRuMode(false);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const updateEmail = () => {
    setLoading(true);
    settingsAPI
      .updateContact({ contact: "email", value: email })
      .then((response) => {
        setEmail(response.data.email);
        setEmailMode(false);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const updatePhone = () => {
    setLoading(true);
    settingsAPI
      .updateContact({ contact: "phone", value: phone })
      .then((response) => {
        setPhone(response.data.phone);
        setPhoneMode(false);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={styles.block}>
      {loading && <SplashScreen />}
      <table>
        <tbody>
          <tr>
            <td className={styles.label}>
              <span>{t("admin_addressEn")}:</span>
            </td>
            <td>
              {addressEnMode ? (
                <input
                  className={styles.input}
                  type="input"
                  value={addressEn}
                  onChange={(e) => setAddressEn(e.currentTarget.value)}
                />
              ) : (
                <span className={styles.info}>{addressEn}</span>
              )}
            </td>
            <td>
              {addressEnMode ? (
                <div>
                  <button className={styles.btn} onClick={updateAddressEn}>
                    {t("admin_save")}
                  </button>
                  <button
                    className={styles.btn}
                    onClick={() => setAddressEnMode(false)}
                  >
                    {t("admin_cancel")}
                  </button>
                </div>
              ) : (
                <button
                  className={styles.btn}
                  onClick={() => setAddressEnMode(true)}
                >
                  {t("admin_edit")}
                </button>
              )}
            </td>
          </tr>
          <tr>
            <td className={styles.label}>
              <span>{t("admin_addressGe")}:</span>
            </td>
            <td>
              {addressGeMode ? (
                <input
                  className={styles.input}
                  type="input"
                  value={addressGe}
                  onChange={(e) => setAddressGe(e.currentTarget.value)}
                />
              ) : (
                <span className={styles.info}>{addressGe}</span>
              )}
            </td>
            <td>
              {" "}
              {addressGeMode ? (
                <div>
                  <button className={styles.btn} onClick={updateAddressGe}>
                    {t("admin_save")}
                  </button>
                  <button
                    className={styles.btn}
                    onClick={() => setAddressGeMode(false)}
                  >
                    {t("admin_cancel")}
                  </button>
                </div>
              ) : (
                <button
                  className={styles.btn}
                  onClick={() => setAddressGeMode(true)}
                >
                  {t("admin_edit")}
                </button>
              )}
            </td>
          </tr>
          <tr>
            <td className={styles.label}>
              <span>{t("admin_addressRu")}:</span>
            </td>
            <td>
              {addressRuMode ? (
                <input
                  className={styles.input}
                  type="input"
                  value={addressRu}
                  onChange={(e) => setAddressRu(e.currentTarget.value)}
                />
              ) : (
                <span className={styles.info}>{addressRu}</span>
              )}
            </td>
            <td>
              {" "}
              {addressRuMode ? (
                <div>
                  <button className={styles.btn} onClick={updateAddressRu}>
                    {t("admin_save")}
                  </button>
                  <button
                    className={styles.btn}
                    onClick={() => setAddressRuMode(false)}
                  >
                    {t("admin_cancel")}
                  </button>
                </div>
              ) : (
                <button
                  className={styles.btn}
                  onClick={() => setAddressRuMode(true)}
                >
                  {t("admin_edit")}
                </button>
              )}
            </td>
          </tr>
          <tr>
            <td className={styles.label}>
              <span>e-mail:</span>
            </td>
            <td>
              {emailMode ? (
                <input
                  className={styles.input}
                  type="input"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                />
              ) : (
                <span className={styles.info}>{email}</span>
              )}
            </td>
            <td>
              {" "}
              {emailMode ? (
                <div>
                  <button className={styles.btn} onClick={updateEmail}>
                    {t("admin_save")}
                  </button>
                  <button
                    className={styles.btn}
                    onClick={() => setEmailMode(false)}
                  >
                    {t("admin_cancel")}
                  </button>
                </div>
              ) : (
                <button
                  className={styles.btn}
                  onClick={() => setEmailMode(true)}
                >
                  {t("admin_edit")}
                </button>
              )}
            </td>
          </tr>
          <tr>
            <td className={styles.label}>
              <span>{t("admin_phone")}:</span>
            </td>
            <td>
              {phoneMode ? (
                <input
                  className={styles.input}
                  type="input"
                  value={phone}
                  onChange={(e) => setPhone(e.currentTarget.value)}
                />
              ) : (
                <span className={styles.info}>{phone}</span>
              )}
            </td>
            <td>
              {" "}
              {phoneMode ? (
                <div>
                  <button className={styles.btn} onClick={updatePhone}>
                    {t("admin_save")}
                  </button>
                  <button
                    className={styles.btn}
                    onClick={() => setPhoneMode(false)}
                  >
                    {t("admin_cancel")}
                  </button>
                </div>
              ) : (
                <button
                  className={styles.btn}
                  onClick={() => setPhoneMode(true)}
                >
                  {t("admin_edit")}
                </button>
              )}
            </td>
          </tr>
          <tr>
            <td className={styles.label} style={{ verticalAlign: "top" }}>
              <span>{t("admin_password")}:</span>
            </td>
            <td>
              <form>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <input
                    autoComplete="off"
                    className={styles.input}
                    placeholder={t("admin_oldPassword")}
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.currentTarget.value)}
                  />
                  <span className={styles.error}>{oldPasswordError}</span>
                  <input
                    autoComplete="off"
                    className={styles.input}
                    placeholder={t("admin_newPassword")}
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.currentTarget.value)}
                  />
                  <span className={styles.error}>{newPasswordError}</span>
                  <input
                    autoComplete="off"
                    className={styles.input}
                    placeholder={t("admin_confirmNewPassword")}
                    type="password"
                    value={newPasswordConfirm}
                    onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                  />
                  <span className={styles.error}>
                    {newPasswordConfirmError}
                  </span>
                  <button
                    type="button"
                    className={styles.btn}
                    style={{ width: "50%" }}
                    onClick={changePasswordHandle}
                  >
                    {t("admin_changePassword")}
                  </button>
                </div>
              </form>
            </td>
          </tr>
          <tr>
            <td className={styles.label} style={{ verticalAlign: "top" }}>
              <span>{t("admin_video")}:</span>
            </td>
            <td style={{ verticalAlign: "top" }}>
              <Formik
                initialValues={{ mediaUrl: mediaFile }}
                enableReinitialize
                validate={(values) => {
                  const errors = {};
                  if (!values.mediaUrl) {
                    errors.mediaUrl = t("admin_required");
                  }
                  return errors;
                }}
                onSubmit={(
                  values,
                  { setFieldValue, setSubmitting, resetForm }
                ) => {
                  setLoading(true);
                  const formData = new FormData();
                  for (let value in values) {
                    formData.append(value, values[value]);
                  }

                  settingsAPI
                    .setContactsMedia(formData)
                    .then((data) => {
                      setResultMessage(t("admin_videoAddSuccess"));
                      LoadContacts();
                      resetForm();
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                      hideMessage();
                    })
                    .catch((error) => {
                      setResultMessage(t("admin_videoAddFailed"));
                    });
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                  setFieldValue,
                  /* and other goodies */
                }) => (
                  <form onSubmit={handleSubmit}>
                    <div className={styles.form}>
                      <div className={styles.formItem}>
                        <input
                          type="file"
                          name="mediaUrl"
                          accept="video/*"
                          ref={fileInputRef}
                          onChange={(e) => {
                            setFieldValue("mediaUrl", e.currentTarget.files[0]);
                          }}
                          className={styles.input}
                        />
                        <div
                          className={`${styles.label} ${styles.error}`}
                          style={{
                            display: errors ? "block" : "none",
                            marginLeft: "1rem",
                          }}
                        >
                          {errors.mediaUrl &&
                            touched.mediaUrl &&
                            errors.mediaUrl}
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={styles.btn}
                          style={{ width: "50%", display: "block" }}
                        >
                          {t("admin_changeMedia")}
                        </button>
                      </div>

                      <div
                        className={styles.formItem}
                        style={{
                          display: resultMessage ? "inline-block" : "none",
                        }}
                      >
                        {resultMessage}
                      </div>
                    </div>
                  </form>
                )}
              </Formik>
            </td>
            <td>
              {mediaFile && (
                <ReactPlayer
                  style={{ width: "100%" }}
                  src={mediaFile}
                  playing={true}
                  controls={true}
                  muted={true}
                />
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Settings;
