import { useTranslation } from "react-i18next";
import styles from "./Services.module.css";
import iconInstall from "../../assets/icon-install.svg";
import iconSafety from "../../assets/icon-safety.svg";
import iconWarranty from "../../assets/icon-warranty.svg";
import backInage from "../../assets/serviceImage.png"

const Services = () => {
  const { t, i18n } = useTranslation();
  return (
    <>
      <div className={styles.block}>
        <Content param={t("servicesPage")} />
        <img src={backInage} className={styles.backImage} />
      </div>
      <div className={styles.cardWrapper}>
        <ServiceCard logo={iconInstall} title={t("serviceCardTitle1")} content={t("serviceCardContent1")}/>
        <ServiceCard logo={iconSafety} title={t("serviceCardTitle2")} content={t("serviceCardContent2")}/>
        <ServiceCard logo={iconWarranty} title={t("serviceCardTitle3")} content={t("serviceCardContent3")}/>
      </div>
    </>
  );
};

export default Services;

const Content = ({ param }) => {
  if (param === "servicesEn")
    return (
      <div>
        <h3 className={styles.title}>Service</h3>
        <p className={styles.info}>
          ITEQ is the only company in Georgia that can provide a comprehensive
          solution to security problems for its customers. This is the best
          thing, this service is not the perfect one, it can be announced by
          purchasing the product. This is a process, you can get a team of
          professionals, consult you, offer you the need you want, if you could
          get a customized product and purchase service. Multiple warranty is
          the price And yet, how can the safety and tranquility of the users
          come about?
        </p>
        <p className={styles.info} style={{ textAlign: "left" }}>
          We are such products as:
        </p>
        <ul className={styles.list}>
          <li>Safes </li>
          <li>Locks of varying difficulty and level (online consulting) </li>
          <li>Key Master System ABLOY PROTEC 2 </li>
          <li>Fireproof and soundproof doors for wood and metal doors </li>
          <li>Electronic and mechanical locks </li>
          <li>Child safety</li>
          <li>Surveillance systems </li>
          <li>High-tech storage and security systems </li>
          <li>Fire protection systems </li>
          <li>Fire and smoke "curtains" </li>
          <li>Special lifts (first disabled) </li>
          <li>Mini bars </li>
          <li>Telephones for the hospitality </li>
          <li>Strongrooms </li>
          <li>Deposit boxes </li>
          <li>etc.</li>
        </ul>
      </div>
    );
  if (param === "servicesGe")
    return (
      <div>
        <h3 className={styles.title}>სერვისი</h3>
        <p className={styles.info}>
          აიტექი ერთადერთი კომპანიაა საქართველოში, რომელიც უსაფრთხოებასთან
          დაკავშირებული პრობლემების კომპლექსურ გადაწყვეტას სთავაზობს
          მომხმარებლებს. რაც ყველაზე მთავარია, ეს მომსახურება არ სრულდება ერთი,
          რაიმე კონკრეტული პროდუქტის შეძენით. ეს არის პროცესი, რომლის ფარგლებშიც
          პროფესიონალთა გუნდი გაგიწევთ კონსულტაციას, შემოგთავაზებთ თქვენს
          საჭიროებებსა თუ შესაძლებლობებზე მორგებულ პროდუქტსა და ყიდვის შემდგომ
          სერვისს. აიტეკში თქვენს მიერ ერთხელ მიღებული გადაწყვეტილება
          უსაფრთხოების მრავალწლიანი გარანტიის ტოლფასია.
        </p>
        <p className={styles.info}>
          და მაინც, როგორ ვქმნით ჩვენი მომხმარებლების უსაფრთხოებასა და
          სიმშვიდეს?
        </p>
        <p className={styles.info} style={{ textAlign: "left" }}>
          ჩვენ გთავაზობთ ისეთ პროდუქტებს, როგორებიცაა:
        </p>
        <ul className={styles.list}>
          <li>სეიფები </li>
          <li>სხვადასხვა სირთულისა და დონის საკეტები (ონლაინ საკეტები) </li>
          <li>გასაღების მასტერ სისტემა ABLOY PROTEC 2</li>
          <li>ცეცხლგამძლე და ხმის იზოლაციის მქონე ხისა და მეტალის კარები</li>
          <li>ელექტრონნული და მექანიკური საკეტები </li>
          <li> ბავშვთა უსაფრთხოება</li>
          <li>სათვალთვალო სისტემები </li>
          <li>მაღალტექნოლოგიური შესანახი და უსაფრთხოების სისტემები</li>
          <li>ხანძარსაწინააღმდეგო სისტემები</li>
          <li>ხანძრისა და კვამლის საწინააღმდეგო „ფარდები“</li>
          <li>სპეციალური ლიფტები (შშმ პირებისათვის)</li>
          <li>მინი ბარები</li>
          <li>სასტუმროს ტელეფონები</li>
          <li>ბრონირებული ოთახები ბანკებისთვის</li>
          <li>დეპოზიტური ყუთები</li>
          <li>და სხვა.</li>
        </ul>
      </div>
    );
  if (param === "servicesRu")
    return (
      <div>
        <h3 className={styles.title}>Услуги</h3>
        <p className={styles.info}>
          ITEQ единственная компания в Грузии ,которая предлагает пользователю
          комплексное решение всех вопросов всязанных с безопасностью.И что
          самое главное эти услуги не кончаются при преобретении одного
          конкретного продукта.Это процесс, в рамках которого команда
          профессионалов предложит консультации по продуктам вашей необходимости
          или возможности и после покупки продукта его сервисс.Один раз принятое
          решение в сфере сотрудничества с ITEQ приравнивается к многолетней
          гарантии безопасности.
        </p>
        <p className={styles.info}>
          И все равно как мы создаем гаранию спокойствия и безопасности наших
          пользователей?
        </p>
        <p className={styles.info} style={{ textAlign: "left" }}>
          Мы предлагаем такую продукцию как:
        </p>
        <ul className={styles.list}>
          <li>Сейфы </li>
          <li>Замки разного уровня и сложности(онлайн замки)</li>
          <li>ABLOY PROTEC 2 мастер система замков</li>
          <li>
            Двери Металлические и деревянные ,огнеустойчивые ,с хорошей
            изоляцией
          </li>
          <li>Электронные и механический замки</li>
          <li>Детская безопасность</li>
          <li>Система наблюдения</li>
          <li>Высокотехнологичные системы безопасности и хранения</li>
          <li>Противопожарные системы</li>
          <li>"Занавеси" против дыма и огня</li>
          <li>Специальные лифты(для лиц с ограниченными возможностями)</li>
          <li>Мини бары</li>
          <li>Гостиничные телефоны</li>
          <li>бронированные комнаты банков</li>
          <li>Депозитные ящики</li>
          <li>и т.д</li>
        </ul>
      </div>
    );
};

const ServiceCard = ({logo, title, content}) => {
  return (
    <div className={styles.card}>
      <div className={styles.iconGroup}>
        <img src={logo} className={styles.icon} />
      </div>
      <h4 className={styles.cardTitle}>{title}</h4>
      <div className={styles.cardContent}>
        {content}
      </div>
    </div>
  );
};
