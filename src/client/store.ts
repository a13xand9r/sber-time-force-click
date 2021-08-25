import { CharacterType } from './components/GlobalStyle';

export const initialState = {
  isPlayMode: false,
  playTabContent: '',
  isClickDisabled: false,
  character: 'sber' as CharacterType,
  tab: 'Играть' as TabsType,
  timePeriod: 5 as number
}

export const reducer = (state: StateType, action: ActionsType): StateType => {
  switch (action.type) {
    case 'SET_CHARACTER':
      return { ...state, character: action.characterId }
    case 'CHANGE_TAB':
      return {...state, tab: action.tab}
    case 'SET_PLAY_MODE':
      return {...state, isPlayMode: action.flag, isClickDisabled: false}
    case 'SET_CLICK_DISABLE':
      return {...state, isClickDisabled: action.flag}
    case 'CHANGE_TIME_PERIOD':
      return {...state, timePeriod: action.value}
    case 'CHANGE_PLAY_TAB_TEXT':
      return {...state, playTabContent: action.text}
    default: return state
  }
}

export const actions = {
  setCharacter: (characterId: CharacterType) => ({ type: 'SET_CHARACTER', characterId } as const),
  changeTab: (tab: TabsType) => ({type: 'CHANGE_TAB', tab} as const),
  setPlayMode: (flag: boolean) => ({type: 'SET_PLAY_MODE', flag} as const),
  setClickDisable: (flag: boolean) => ({type: 'SET_CLICK_DISABLE', flag} as const),
  changeTimePeriod: (value: number) => ({type: 'CHANGE_TIME_PERIOD', value} as const),
  changePlayTabContent: (text: string) => ({type: 'CHANGE_PLAY_TAB_TEXT', text} as const),
}

export const tabs = ['Играть', 'Настройки', 'Правила', 'Лучший счет'] as const

export type StateType = typeof initialState
export type TabsType = typeof tabs[number]
type InferActionType<T> = T extends { [key: string]: (...args: any[]) => infer U } ? U : never
export type ActionsType = InferActionType<typeof actions>