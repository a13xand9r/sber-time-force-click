import { FC, useMemo } from 'react'
import { createGlobalStyle } from 'styled-components'
import { darkSber, darkEva, darkJoy } from '@sberdevices/plasma-tokens/themes'
import {
    text, // Цвет текста
    background, // Цвет подложки
    gradient, // Градиент
} from '@sberdevices/plasma-tokens'

const themes = {
    sber: createGlobalStyle(darkSber),
    eva: createGlobalStyle(darkEva),
    joy: createGlobalStyle(darkJoy),
}

const DocumentStyle = createGlobalStyle`
    html:root {
        padding-top: 2rem;
        min-height: 100vh;
        color: ${text};
        background-color: ${background};
        background-image: ${gradient};
    }
`

export const GlobalStyles: FC<{ character: CharacterType }> = ({ character }) => {
    const Theme = useMemo(() => themes[character], [character])
    return (
        <>
            <DocumentStyle />
            <Theme />
        </>
    )
}

export type CharacterType = 'sber' | 'joy' | 'eva'