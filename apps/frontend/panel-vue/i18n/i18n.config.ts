import { en as $vuetify } from 'vuetify/locale'

import type { TLangList, TLangDictionary } from '@workspace/shared/src/locales'
import { dictionary, getT } from '@workspace/shared/src/locales'

export default defineI18nConfig(() => {
  const messages: Record<
    TLangList,
    TLangDictionary & { $vuetify?: typeof $vuetify }
  > = { ...dictionary }

  Object.values(messages).map((value) => {
    value['$vuetify'] = $vuetify
  })

  return {
    legacy: false,
    fallbackLocale: getT().langCode,
    messages,
  }
})
