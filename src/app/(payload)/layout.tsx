/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import { rtlLanguages } from '@payloadcms/translations'
import { ProgressBar, RootProvider } from '@payloadcms/ui'
import { getClientConfig } from '@payloadcms/ui/utilities/getClientConfig'
import { cookies as nextCookies } from 'next/headers'
import type { ServerFunctionClient } from 'payload'
import { applyLocaleFiltering } from 'payload/shared'
import React from 'react'
import { handleServerFunctions } from '@payloadcms/next/layouts'
import { getNavPrefs } from '../../../node_modules/@payloadcms/next/dist/elements/Nav/getNavPrefs.js'
import { NestProviders } from '../../../node_modules/@payloadcms/next/dist/layouts/Root/NestProviders.js'
import { checkDependencies } from '../../../node_modules/@payloadcms/next/dist/layouts/Root/checkDependencies.js'
import { getRequestTheme } from '../../../node_modules/@payloadcms/next/dist/utilities/getRequestTheme.js'
import { initReq } from '../../../node_modules/@payloadcms/next/dist/utilities/initReq.js'

import { importMap } from './admin/importMap.js'
import './custom.scss'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = async ({ children }: Args) => {
  checkDependencies()

  const {
    cookies,
    headers,
    languageCode,
    permissions,
    req,
    req: {
      payload: { config: payloadConfig },
    },
  } = await initReq({
    configPromise: config,
    importMap,
    key: 'RootLayout',
  })

  const theme = getRequestTheme({
    config: payloadConfig,
    cookies,
    headers,
  })

  const dir = rtlLanguages.includes(languageCode as 'ar' | 'fa' | 'he') ? 'RTL' : 'LTR'

  const languageOptions = Object.entries(payloadConfig.i18n.supportedLanguages || {}).reduce<
    { label: string; value: string }[]
  >((acc, [language, languageConfig]) => {
    const typedLanguageConfig = languageConfig as {
      translations: { general: { thisLanguage: string } }
    }

    if (Object.keys(payloadConfig.i18n.supportedLanguages).includes(language)) {
      acc.push({
        label: typedLanguageConfig.translations.general.thisLanguage,
        value: language,
      })
    }

    return acc
  }, [])

  async function switchLanguageServerAction(lang: string) {
    'use server'

    const cookiesStore = await nextCookies()
    cookiesStore.set({
      name: `${payloadConfig.cookiePrefix || 'payload'}-lng`,
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      value: lang,
    })
  }

  const navPrefs = await getNavPrefs(req)

  const clientConfig = getClientConfig({
    config: payloadConfig,
    i18n: req.i18n,
    importMap,
    user: (req.user ?? undefined) as never,
  })

  await applyLocaleFiltering({
    clientConfig,
    config: payloadConfig,
    req,
  })

  return (
    <>
      <style>{'@layer payload-default, payload;'}</style>
      <RootProvider
        config={clientConfig}
        dateFNSKey={req.i18n.dateFNSKey}
        fallbackLang={payloadConfig.i18n.fallbackLanguage}
        isNavOpen={navPrefs?.open ?? true}
        languageCode={languageCode}
        languageOptions={languageOptions as never}
        locale={req.locale}
        permissions={(req.user ? permissions : undefined) as never}
        serverFunction={serverFunction}
        switchLanguageServerAction={switchLanguageServerAction}
        theme={theme}
        translations={req.i18n.translations}
        user={(req.user ?? undefined) as never}
      >
        <ProgressBar />
        {Array.isArray(payloadConfig.admin?.components?.providers) &&
        payloadConfig.admin.components.providers.length > 0 ? (
          <NestProviders
            importMap={req.payload.importMap}
            providers={payloadConfig.admin.components.providers}
            serverProps={{
              i18n: req.i18n,
              payload: req.payload,
              permissions: permissions as never,
              user: (req.user ?? undefined) as never,
            }}
          >
            {children}
          </NestProviders>
        ) : (
          children
        )}
      </RootProvider>
      <div id="portal" dir={dir} data-theme={theme} lang={languageCode} />
    </>
  )
}

export default Layout
