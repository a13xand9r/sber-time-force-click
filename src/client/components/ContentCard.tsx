import { Card, CardBody, CardContent, CardMedia, CardParagraph1, TextBox, TextBoxBigTitle, TextBoxSubTitle, Stepper, Body1, Headline1, Body2, Headline3, ParagraphText2, Headline2 } from '@sberdevices/plasma-ui'
import React, { Dispatch, FC, useState } from 'react'
import { actions, ActionsType, TabsType } from '../store'
import style from '../styles/style.module.css'
import { CharacterType } from './GlobalStyle'

export const ContentCard: FC<PropsType> = ({ tab, score, timePeriod, dispatch, playContent, character }) => {
  const selectTab = () => {
    switch (tab) {
      case 'Правила':
        return <TextBox>
          Правила игры крайне просты!
          {character === 'joy' ? ' Ты просто выбираешь нужные настройки и нажимаешь ' : ' Вы просто выбираете нужные настройки и нажимаете '}
          кнопку через определенный промежуток времени.
          Проще говоря, если {character === 'joy' ? 'ты выбрал нажимать кнопку каждые 5 секунд, тогда тебе' :
           'вы выбрали нажимать кнопку каждые 5 секунд, тогда вам'}  предстоит нажимать кнопку через каждые 5 секунд.
          За каждое нажатие вовремя {character === 'joy' ? 'тебе' : 'вам'} начисляется балл. Отсчет времени начинается после нажатия на кнопку Играть и каждый раз, когда кнопка Клик становится доступной.
        </TextBox>
      case 'Играть':
        return <TextBox>
            {playContent}
        </TextBox>
      case 'Лучший счет':
        return <>
          Твой лучший счет: {score} очков
        </>
      case 'Настройки':
        return <>
        <TextBox>
          <TextBoxBigTitle>{character === 'joy' ? 'Выбери' : 'Выберите'} уровень:</TextBoxBigTitle>
          Нажимать кнопку нужно будет каждые
        <Stepper
          className={style.stepper}
          step={5}
          value={timePeriod}
          min={5}
          max={60}
          showRemove={false}
          onChange={(value) => dispatch(actions.changeTimePeriod(value))}
        />
        секунд
        </TextBox>
      </>
    }
  }
  return <Card className={style.cardContent}>
    <CardBody style={{ height: '100%', alignItems: 'center' }}>
      <CardContent style={{ height: '100%' }} cover={false}>
        {
          selectTab()
        }
        <TextBox>

        </TextBox>
      </CardContent>
    </CardBody>
  </Card>
}

type PropsType = {
  tab: TabsType
  character: CharacterType
  score: number
  timePeriod: number
  dispatch: Dispatch<ActionsType>
  playContent: string
}