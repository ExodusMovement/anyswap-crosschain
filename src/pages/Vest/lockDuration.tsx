import React, { useRef, useState } from "react"
// import { useTranslation } from 'react-i18next'
import styled from "styled-components"

import moment from 'moment';
import BigNumber from 'bignumber.js';


import TokenLogo from '../../components/TokenLogo'

import {
  SwapInputBox,
  CurrencySelect1,
  TokenLogoBox1,
  SwapInputContent,
} from './style'

const DateInput = styled.input<{ error?: boolean; fontSize?: string; align?: string }>`
  color: ${({ error, theme }) => (error ? 'rgb(255, 104, 113)' : theme.textColorBold)};
  width: 100%;
  position: relative;
  font-weight: 500;
  outline: none;
  border: none;
  flex: 1 1 auto;
  background-color: ${({ theme }) => theme.bg1};
  font-size: ${({ fontSize }) => fontSize ?? '44px'};
  text-align: ${({ align }) => align && align};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0px;
  -webkit-appearance: textfield;
  height:56.8px;
  border-bottom:none;
  background: none;
  margin-right: 1.875rem;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  [type='number'] {
    -moz-appearance: textfield;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    visibility: hidden!important;
  }

  ::placeholder {
    // color: ${({ theme }) => theme.text4};
    color:#DADADA;
  }
  ${({ theme }) => theme.mediaWidth.upToLarge`
    width: 100%;
    margin-right: 0;
    height: 50px;
    font-size: 24px;
  `};
  &.error {
    color: ${({ theme }) => theme.red1};
  }
`
const CheckoutGroup = styled.div`
${({ theme }) => theme.flexSC};
// padding: 0 20px;
margin-top:10px;
`
const CheckoutLabel = styled.div`

`
const CheckoutItem = styled.div`
${({ theme }) => theme.flexSC};
`
const RadioStyle = styled.input`
  top: 0;
  left: 0;
  width: 100%;
  cursor: inherit;
  height: 100%;
  margin: 0;
  opacity: 0;
  padding: 0;
  z-index: 1;
  position: absolute;
`

const RadioLabel = styled.label`
  ${({ theme }) => theme.flexSC};
  height:42px;
  position:relative;
  margin-right:15px;
  .radioBox {
    ${({ theme }) => theme.flexC};
    height:100%;
    width: 42px;
    .radioBtn{
      ${({ theme }) => theme.flexC};
      width:24px;
      height:24px;
      .radio-init {
        width:100%;
        height:100%;
        border-radius: 100%;
        border: 3px solid #6c57ec;
        transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
      }
      .radio-selected {
        width:100%;
        height:100%;
        border-radius: 100%;
        border: 3px solid #6c57ec;
        transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        padding: 4px;
        .round {
          width:100%;
          height:100%;
          display:block;
          border-radius:100%;
          background: #6c57ec;
        }
      }
    }
  }
  .radioTxt {
    font-size:12px;
    color: ${({ theme }) => theme.text1};
  }
`

function RadiosStyle ({
  id,
  value,
  selected,
  label,
  onRadioChange,
  type = 'radio'
}: {
  id:any
  value:any
  selected:any
  label:any
  onRadioChange: (value: any) => void
  type?:any
}) {
  return (
    <>
      <RadioLabel>
        <span className="radioBox">
          <span className="radioBtn">
            <RadioStyle value={value} name={id} type={type} checked={selected === value ? true : false} onChange={onRadioChange} />
            {
              selected === value ? <div className="radio-selected"><i className="round"></i></div> : <div className="radio-init"></div>
            }
          </span>
        </span>
        <span className="radioTxt">{label}</span>
      </RadioLabel>
    </>
  )
}

export default function LockAmount ({
  lockEnds,
  updateLockDuration,
}: {
  lockEnds:any
  updateLockDuration: (value: any) => void
}) {

  const inputEl = useRef<any>(null);

  const [selectedDate, setSelectedDate] = useState(moment().add(8, 'days').format('YYYY-MM-DD'));
  const [selectedValue, setSelectedValue] = useState<any>();

  let min = moment().add(7, 'days').format('YYYY-MM-DD')
  if(lockEnds && new BigNumber(lockEnds).gt(0)) {
    min = moment.unix(lockEnds).format('YYYY-MM-DD')
  }

  const handleDateChange = (event:any) => {
    setSelectedDate(event.target.value);
    setSelectedValue(null);

    updateLockDuration(event.target.value)
  }

  const handleChange = (event:any) => {
    setSelectedValue(event.target.value);

    let days = 0;
    switch (event.target.value) {
      case 'week':
        days = 8;
        break;
      case 'month':
        days = 30;
        break;
      case 'year':
        days = 365;
        break;
      case 'years':
        days = 1461;
        break;
      default:
    }
    const newDate = moment().add(days, 'days').format('YYYY-MM-DD');

    setSelectedDate(newDate);
    updateLockDuration(newDate)
  }

  const focus = () => {
    if(inputEl?.current) {
      inputEl.current.focus()
    };
  }

  return (
    <>
      <SwapInputBox>
        <CurrencySelect1 selected={true} className="open-currency-select-button">
          <TokenLogoBox1 onClick={ focus }>
            <TokenLogo symbol={'DATE'} size={'100%'} />
          </TokenLogoBox1>
        </CurrencySelect1>
        <SwapInputContent>
          <DateInput
            value={ selectedDate }
            ref={inputEl}
            onChange={ handleDateChange }
            type="date"
            placeholder='Expiry Date'
            min={min}
            max={moment().add(1460, 'days').format('YYYY-MM-DD')}
            disabled={false}
          />
        </SwapInputContent>
      </SwapInputBox>
      <CheckoutGroup>
        <CheckoutLabel>Expires:</CheckoutLabel>
        <CheckoutItem>
          <RadiosStyle
            id='lockDate'
            value='week'
            selected={selectedValue}
            label='1 week'
            onRadioChange={handleChange}
          ></RadiosStyle>
          <RadiosStyle
            id='lockDate'
            value='month'
            selected={selectedValue}
            label='1 month'
            onRadioChange={handleChange}
          ></RadiosStyle>
          <RadiosStyle
            id='lockDate'
            value='year'
            selected={selectedValue}
            label='1 year'
            onRadioChange={handleChange}
          ></RadiosStyle>
          <RadiosStyle
            id='lockDate'
            value='years'
            selected={selectedValue}
            label='1 years'
            onRadioChange={handleChange}
          ></RadiosStyle>
        </CheckoutItem>
      </CheckoutGroup>
    </>
  )
}