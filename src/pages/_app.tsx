import type { AppProps } from 'next/app'
import React from 'react'
import { DeviceThemeProvider, Header } from '@sberdevices/plasma-ui'
import style from '../client/styles/style.module.css'

function MyApp({ Component, pageProps }: AppProps) {
  return <DeviceThemeProvider>
    <Header
      className={style.header}
      // style={{marginLeft: '1.5rem'}}
      title={'Сила времени'}
    />
    <Component {...pageProps} />
  </DeviceThemeProvider>
}
export default MyApp
