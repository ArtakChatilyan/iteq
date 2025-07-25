import { useEffect, useState } from "react";
import styles from "./Settings.module.css";
import { settingsAPI } from "../../dal/api";
import SplashScreen from "../splashscreen/SplashScreen";

const Settings = () => {
  const [loading, setLoading] = useState(true);

  const [addressEn, setAddressEn] = useState(' ');
  const [addressGe, setAddressGe] = useState('');
  const [addressRu, setAddressRu] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [addressEnMode, setAddressEnMode] = useState(false);
  const [addressGeMode, setAddressGeMode] = useState(false);
  const [addressRuMode, setAddressRuMode] = useState(false);
  const [emailMode, setEmailMode] = useState(false);
  const [phoneMode, setPhoneMode] = useState(false);

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
              <span>address(english):</span>
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
                    save
                  </button>
                  <button
                    className={styles.btn}
                    onClick={() => setAddressEnMode(false)}
                  >
                    cancel
                  </button>
                </div>
              ) : (
                <button
                  className={styles.btn}
                  onClick={() => setAddressEnMode(true)}
                >
                  edit
                </button>
              )}
            </td>
          </tr>
          <tr>
            <td className={styles.label}>
              <span>address(georgian):</span>
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
                    save
                  </button>
                  <button
                    className={styles.btn}
                    onClick={() => setAddressGeMode(false)}
                  >
                    cancel
                  </button>
                </div>
              ) : (
                <button
                  className={styles.btn}
                  onClick={() => setAddressGeMode(true)}
                >
                  edit
                </button>
              )}
            </td>
          </tr>
          <tr>
            <td className={styles.label}>
              <span>address(russian):</span>
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
                    save
                  </button>
                  <button
                    className={styles.btn}
                    onClick={() => setAddressRuMode(false)}
                  >
                    cancel
                  </button>
                </div>
              ) : (
                <button
                  className={styles.btn}
                  onClick={() => setAddressRuMode(true)}
                >
                  edit
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
                    save
                  </button>
                  <button
                    className={styles.btn}
                    onClick={() => setEmailMode(false)}
                  >
                    cancel
                  </button>
                </div>
              ) : (
                <button
                  className={styles.btn}
                  onClick={() => setEmailMode(true)}
                >
                  edit
                </button>
              )}
            </td>
          </tr>
          <tr>
            <td className={styles.label}>
              <span>phone:</span>
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
                    save
                  </button>
                  <button
                    className={styles.btn}
                    onClick={() => setPhoneMode(false)}
                  >
                    cancel
                  </button>
                </div>
              ) : (
                <button
                  className={styles.btn}
                  onClick={() => setPhoneMode(true)}
                >
                  edit
                </button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Settings;
