import { IconAvatar, IconCopy, IconPlay, IconSettings } from '@sberdevices/plasma-icons'
import { Button, Container, TabItem, Tabs } from '@sberdevices/plasma-ui'
import type { NextPage } from 'next'
import React, { useCallback, useEffect, useReducer, useRef } from 'react'
import style from '../client/styles/style.module.css'
import { ContentCard } from '../client/components/ContentCard'
import { GlobalStyles } from '../client/components/GlobalStyle'
import { actions, initialState, reducer, StateType, tabs, TabsType } from '../client/store'
import { createAssistant, createSmartappDebugger } from '@sberdevices/assistant-client'

const initializeAssistant = (getState: () => StateType) => {
  if (process.env.NODE_ENV === 'development') {
    return createSmartappDebugger({
      token: process.env.NEXT_PUBLIC_ASSISTANT_TOKEN ?? '',
      initPhrase: 'Запусти чувство времени',
      getState
    })
  }
  return createAssistant({ getState })
}

const Home: NextPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const assistantRef = useRef<ReturnType<typeof createAssistant>>()
  useEffect(() => {
    assistantRef.current = initializeAssistant(() => state)
    assistantRef.current.on('data', ({ smart_app_data, type, character }: any) => {
      if (smart_app_data) {
        console.log(smart_app_data)
        dispatch(smart_app_data)
        smart_app_data.type === 'SET_CLICK_DISABLE' &&
          assistantRef.current?.sendAction({ type: 'START_NEW_CLICK', payload: { timestamp: Date.now() } })
      }
      if (type === 'character') {
        dispatch(actions.setCharacter(character.id))
        assistantRef.current?.sendAction({ type: 'GET_SCORE', payload: {} })
      }
    })
  }, [])
  useEffect(() => {
    dispatch(actions.changePlayTabContent(
      `Сейчас узнаем насколько хорошо ${state.character === 'joy' ? 'ты чувствуешь' : 'вы чувствуете'} время.
      Отсчет времени начнется после звукового сигнала.`
    ))
  }, [state.character])
  const iconSelect = (tab: TabsType) => {
    switch (tab) {
      case 'Играть': return <IconPlay />
      case 'Настройки': return <IconSettings />
      case 'Правила': return <IconCopy />
      case 'Лучший счет': return <IconAvatar />
    }
  }
  const buttonRef = useRef<HTMLAnchorElement | HTMLButtonElement | HTMLSpanElement | null>()
  useEffect(() => {
    buttonRef.current?.focus()
  }, [state.isClickDisabled])
  const onPlayClick = useCallback(() => {
    if (!state.isPlayMode) {
      dispatch(actions.setPlayMode(true))
      assistantRef.current?.sendAction({ type: 'START_GAME', payload: { timePeriod: state.timePeriod } })
    } else {
      assistantRef.current?.sendAction({ type: 'CLICK', payload: { timestamp: Date.now() } })
    }
    dispatch(actions.setClickDisable(true))
  }, [state.isPlayMode, state.timePeriod])

  return (
    <>
      <GlobalStyles character={state.character} />
      <Container style={{ marginTop: '40px' }}>
        <div className={style.appContainer}>
          <Tabs
            size={'m'}
            view={'clear'}
            stretch={true}
            pilled={true}
            scaleOnPress={true}
            outlined={true}
            disabled={false}
          >
            {tabs.map(tab => (
              <TabItem
                key={tab}
                isActive={tab === state.tab}
                tabIndex={1}
                onClick={() => dispatch(actions.changeTab(tab))}
                contentLeft={iconSelect(tab)}
              >
                {/* {tab} */}
              </TabItem>
            ))}
          </Tabs>
          <div className={style.contentContainer}>
            <ContentCard
              playContent={state.playTabContent}
              dispatch={dispatch}
              timePeriod={state.timePeriod}
              tab={state.tab}
              score={state.score}
              character={state.character}
            />
            {
              state.tab === 'Играть' &&
              <div className={style.playButton}>
                <Button
                  //@ts-ignore
                  ref={buttonRef}
                  style={{ width: '100%' }}
                  text={state.isPlayMode ? 'Клик' : 'Играть'}
                  view='primary'
                  disabled={state.isClickDisabled}
                  onClick={onPlayClick}
                />
              </div>
            }
          </div>
        </div>
      </Container>
    </>
  )
}

export default Home
