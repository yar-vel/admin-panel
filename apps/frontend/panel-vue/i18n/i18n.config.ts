export default defineI18nConfig(() => {
  return {
    locale: getT().langCode,
    fallbackLocale: getT().langCode,
    messages: dictionary,
  }
})
