export default {
  fr: {
    name: 'Français',
    load: () => { return import('./fr.ts'); },
  },
  en: {
    name: 'English',
    load: () => { return import('./en.ts'); },
  },
  es: {
    name: 'Espanol',
    load: () => { return import('./es.ts'); },
  },
};

//https://www.npmjs.com/package/vue-lang-router