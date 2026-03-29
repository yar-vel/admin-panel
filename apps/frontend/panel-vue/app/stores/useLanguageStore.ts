export const useLanguageStore = defineStore('language', () => {
  const language = ref<TLangList>('en')
  function setLanguage(newLang: TLangList) {
    language.value = newLang
  }

  return {
    language,
    setLanguage,
  }
})
