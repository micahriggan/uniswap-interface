import React, { useEffect } from 'react'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { ReactNode } from 'react'
import { useActiveLocale, useSetLocaleFromUrl } from 'hooks/useActiveLocale'
import { SupportedLocale } from 'constants/locales'

export async function dynamicActivate(locale: SupportedLocale) {
  const { messages } = await import(`@lingui/loader!./locales/${locale}.po`)
  i18n.loadLocaleData(locale, { plurals: () => null })
  i18n.load(locale, messages)
  i18n.activate(locale)
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  useSetLocaleFromUrl()
  const locale = useActiveLocale()

  useEffect(() => {
    dynamicActivate(locale).catch((error) => {
      console.error('Failed to activate locale', locale, error)
    })
  }, [locale])

  return (
    <I18nProvider forceRenderOnLocaleChange={false} i18n={i18n}>
      {children}
    </I18nProvider>
  )
}
