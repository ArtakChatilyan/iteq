export const CategorySeoData = {
  en: {
    title: (name) => `${name} – Category | ITEQ`,
    description: (category) =>
      `Browse all products in the ${category?.nameEn} category at ITEQ.`,
    ogLocale: "en_GB",
    baseUrl: "https://iteq.shop/en/category/",
  },
  ru: {
    title: (name) => `${name} – Категория | ITEQ`,
    description: (category) =>
      `Просмотрите все продукты в категории ${category?.nameRu} на ITEQ.`,
    ogLocale: "ru_RU",
    baseUrl: "https://iteq.shop/ru/category/",
  },
  ka: {
    title: (name) => `${name} – კატეგორია | ITEQ`,
    description: (category) =>
      `იხილეთ ყველა პროდუქტი კატეგორიაში ${category?.nameKa} ITEQ-ზე.`,
    ogLocale: "ka_GE",
    baseUrl: "https://iteq.shop/ka/category/",
  },
};
