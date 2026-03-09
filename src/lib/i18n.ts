export type Locale = 'en' | 'es';

export const locales: Locale[] = ['en', 'es'];
export const defaultLocale: Locale = 'en';

export const localeName: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
};

const translations = {
  en: {
    'site.title': 'Feel Like Dancing',
    'site.description': 'Interactive stories, data visualization, and in-depth articles about classical ballet.',
    'nav.home': 'Home',
    'nav.stories': 'Stories',
    'nav.shop': 'Shop (Mexico)',
    'nav.language': 'Language',
    'footer.rights': 'All rights reserved.',
    'stories.title': 'Stories',
    'stories.subtitle': 'Interactive explorations of the world of classical ballet',
    'home.hero': 'The art and science of classical ballet',
    'home.heroSub': 'Interactive stories, data visualizations, and in-depth explorations.',
    'home.featured': 'Featured Stories',
    'home.explore': 'Explore stories',
    'story.readTime': 'min read',
  },
  es: {
    'site.title': 'Feel Like Dancing',
    'site.description': 'Historias interactivas, visualización de datos y artículos a profundidad sobre ballet clásico.',
    'nav.home': 'Inicio',
    'nav.stories': 'Historias',
    'nav.shop': 'Tienda (México)',
    'nav.language': 'Idioma',
    'footer.rights': 'Todos los derechos reservados.',
    'stories.title': 'Historias',
    'stories.subtitle': 'Exploraciones interactivas del mundo del ballet clásico',
    'home.hero': 'El arte y la ciencia del ballet clásico',
    'home.heroSub': 'Historias interactivas, visualizaciones de datos y exploraciones a profundidad.',
    'home.featured': 'Historias Destacadas',
    'home.explore': 'Explorar historias',
    'story.readTime': 'min de lectura',
  },
} as const;

type TranslationKey = keyof typeof translations.en;

export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale][key] ?? translations[defaultLocale][key] ?? key;
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === 'en' ? 'es' : 'en';
}

export function localePath(locale: Locale, path: string = ''): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${clean === '/' ? '' : clean}`;
}
