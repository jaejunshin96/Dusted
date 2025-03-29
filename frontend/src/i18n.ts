import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "Home": "Home",
          "Reviews": "Reviews",
          "Logout": "Logout",
          "Search for reviews...": "Search for reviews...",
          "No reviews found.": "No reviews found.",
          "All Reviews": "All Reviews",
          "Sort by Rating": "Sort by Rating",
          "Load More": "Load More",
        },
      },
      ko: {
        translation: {
          "Home": "홈",
          "Reviews": "리뷰",
          "Logout": "로그아웃",
          "Search for reviews...": "리뷰 검색...",
          "No reviews found.": "리뷰가 없습니다.",
          "All Reviews": "모든 리뷰",
          "Sort by Rating": "평점순 정렬",
          "Load More": "더 보기",
        },
      },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
