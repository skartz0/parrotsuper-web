import { ref } from 'vue';

export type Language = 'el' | 'en';

export const currentLanguage = ref<Language>('el');

export function toggleLanguage() {
  currentLanguage.value = currentLanguage.value === 'el' ? 'en' : 'el';
}
