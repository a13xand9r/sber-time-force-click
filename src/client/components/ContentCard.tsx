import { Card, CardBody, CardContent, CardMedia, CardParagraph1, TextBox, TextBoxBigTitle, TextBoxSubTitle, Stepper, Body1, Headline1, Body2, Headline3, ParagraphText2, Headline2 } from '@sberdevices/plasma-ui'
import React, { Dispatch, FC, useState } from 'react'
import { actions, ActionsType, TabsType } from '../store'
import style from '../styles/style.module.css'

export const ContentCard: FC<PropsType> = ({ tab, score, timePeriod, dispatch, playContent }) => {
  const selectTab = () => {
    switch (tab) {
      case 'Правила':
        return <TextBox>
          Правила игры крайне просты!
          Ты просто выбираешь нужные настройки и нажимаешь кнопку через определенный промежуток времени.
          Проще говоря, если ты выбрал нажимать кнопку каждые 5 секунд, тогда тебе предстоит нажимать кнопку через каждые 5 секунд.
          За каждое нажатие вовремя тебе начисляется балл.
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
          <TextBoxBigTitle>Выбери уровень:</TextBoxBigTitle>
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
  score: number
  timePeriod: number
  dispatch: Dispatch<ActionsType>
  playContent: string
}