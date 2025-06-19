import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./About.module.css";
import { settingsAPI } from "../dalUser/userApi";
import { LanguageContext } from "../../contexts/LanguageContext";
import LoadingScreen from "../loadingScreen/LoadingScreen";

const AboutUs = () => {
  const { t, i18n } = useTranslation();
  const lang = useContext(LanguageContext);
  const [loading, setLoading] = useState(true);
  const [contentAboutEn, setContentAboutEn] = useState();
  const [contentAboutGe, setContentAboutGe] = useState();
  const [contentAboutRu, setContentAboutRu] = useState();

  useEffect(() => {
    LoadContent();
  }, []);

  const LoadContent = () => {
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

  return (
    <div className={styles.block}>
      {loading && <LoadingScreen />}
      <div>
        <h3 className={styles.title}>{t("aboutUs")}</h3>
        {lang === "en" && (
          <div
            className={styles.info}
            dangerouslySetInnerHTML={{ __html: contentAboutEn }}
          />
        )}
        {lang === "ge" && (
          <div
            className={styles.info}
            dangerouslySetInnerHTML={{ __html: contentAboutGe }}
          />
        )}
        {lang === "ru" && (
          <div
            className={styles.info}
            dangerouslySetInnerHTML={{ __html: contentAboutRu }}
          />
        )}
      </div>
    </div>
  );
};

export default AboutUs;

const Content = ({ param }) => {
  if (param === "aboutUsEn")
    return (
      <div>
        <h3 className={styles.title}>About Us</h3>
        <p className={styles.info}>
          <strong className={styles.strong}>ITEQ </strong>
          is the first company in Georgia to create unique security services. We
          offer our custumers, in addition to special equipment, detailed
          building security planning: professional consulting and technical
          support, equipment supply and installation, post-delivery services,
          etc.
        </p>
        <p className={styles.info}>
          We have been making real sence of security in hotels, banks, malls,
          private offices or apartments for years. Our showroom features
          products from world-renowned manufacturers used in leading brand
          projects.
        </p>
        <p className={styles.info}>
          We believe that it is the right of everyone to always and everywhere
          feel protected. Consequently, the main purpose of our company is to
          show customers that we should not see the problem only when faced with
          an unpleasant fact. With{" "}
          <strong className={styles.strong}>ITEQ</strong>, it is possible to
          control randomness and problem solving with a modern and reasonable
          solution.
        </p>
        <p className={styles.info}>
          <strong className={styles.strong}>ITEQ</strong> - all for your safety.
        </p>
      </div>
    );
  if (param === "aboutUsGe")
    return (
      <div>
        <h3 className={styles.title}>ჩვენ შესახებ</h3>
        <p className={styles.info}>
          აიტეკი არის პირველი კომპანია საქართველოში, რომელიც ქმნის
          უსაფრთხოებასთან დაკავშირებულ უნიკალურ მომსახურებას. ჩვენს
          მომხმარებლებს, გარდა სპეციალური აღჭურვილობისა, ვთავაზობთ შენობის
          უსაფრთხოების დეტალურ დაგეგმვას: პროფესიონალური კონსულტაცია და
          ტექნიკური მხარდაჭერა, აღჭურვილობის მიწოდება და დამონტაჟება, მიწოდების
          შემდგომი მომსახურება და ა.შ.
        </p>
        <p className={styles.info}>
          ჩვენ უკვე წლებია, რაც დაცულობის შეგრძნებას რეალურს ვხდით სასტუმროებში,
          ბანკებში, სავაჭრო ცენტრებში, კერძო ოფისებსა თუ ბინებში. ჩვენს შოურუმში
          წარმოდგენილია მსოფლიოში ცნობილი მწარმოებლების პროდუქცია, რომელიც
          გამოყენებულია წამყვანი ბრენდების პროექტებზე მუშაობისას.
        </p>
        <p className={styles.info}>
          ჩვენ ვთვლით, რომ თითოეული ადამიანის უფლებაა ყოველთვის და ყველგან თავი
          დაცულად იგრძნოს. შესაბამისად, ჩვენი კომპანიის მთავარი მიზანია
          მომხმარებლებს ვუჩვენოთ, რომ პრობლემა მხოლოდ მაშინ არ უნდა დავინახოთ,
          როდესაც არასასიამოვნო ფაქტის წინაშე დავდგებით. აიტექთან ერთად
          შესაძლებელია შემთხვევითობის კონტროლი და პრობლემის წინასწარი მოგვარება
          თანამედროვე და გონივრული გადაწყვეტილებით.
        </p>
        <p className={styles.info}>
          აიტეკი - ყველაფერი თქვენი უსაფრთხოებისათვის !
        </p>
      </div>
    );
  if (param === "aboutUsRu")
    return (
      <div>
        <h3 className={styles.title}>О нас</h3>
        <p className={styles.info}>
          <strong className={styles.strong}>ITEQ </strong>
          первая компания в Грузии,которая создает уникальное обслуживание в
          сфере безопасности. Кроме специального оснащения, мы предлагаем нашим
          потребителям детальную планировку безопасности здания,
          профессиональную консультацию и техническую поддержку. Доставка и
          монтаж оснащения с перечисленным обслуживанием и т.д. Мы уже годы как
          создаем реальное основы безопасности в гостиницах,банках,в торговых
          центрах, в частных офисах и домах.
        </p>
        <p className={styles.info}>
          В нашем шоуруме представлена продукция известных в мире
          производителей,которая была использована во время работы с известными
          брендами. Мы считаем,что каждый человек имеет право чувствовать себя в
          безопасности везде и всегда.Соответственно главная цель нашей компании
          показать пользователю,что проблему надо решать не тогда,когда мы
          сталкиваемся с неприятным фактом,а вместе с компанией
          <strong className={styles.strong}> ITEQ</strong> возможно
          предотвратить и заранее решить факт неожиданности.
        </p>
        <p className={styles.info}>
          <strong className={styles.strong}>ITEQ</strong> - все для Вашей
          безопасности.
        </p>
      </div>
    );
};
