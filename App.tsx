import React, { useState } from 'react'
import { Text, Picker} from 'react-native'
import styled, { css } from '@emotion/native'
import { ThemeProvider } from 'emotion-theming'
import flags from '@assets/flags'
import translations from './translations'
import names from '@assets/json/names'
import { countries } from '@assets/json/countries'

const theme = {
  color: '#000',
  backgroundColor: '#f0ead6',
  optionButton: '#eee'
}
const optionsNumber = 4;
const languages = [
  {code:'de', name:'Deutsch'}, 
  {code:'es', name:'Español'},
  {code:'fr', name:'Français'},
  {code:'ja', name:'日本語'},
  {code:'it', name:'Italiano'},
  {code:'pt', name:'Português'},
  {code:'nl', name:'Nederlandse'},
  {code:'hr', name:'Hrvatski'},
  {code:'fa', name:'زبان فارسی'}
]

const getRandomWithinIndex = () => Math.round(Math.random() * 249)

function getNewCountry(c, v){
  let newCountry = getRandomWithinIndex();
  while(v.has(newCountry))
    newCountry = getRandomWithinIndex();
  return newCountry;
}
function App() {
  const [country, setCountry] = useState(144);
  const [showModal, setShowModal] = useState(false);
  const [lang, setLang] = useState('es');
  const [good, setGood] = useState(0)
  const [bad, setBad] = useState(0)
  const [visited, setVisited] = useState(new Set())

  const getCountryName = ({translations, name}) => !!translations[lang] ? translations[lang] : name 
  
  function _handleSelectCountryName(name) {
    if(name === countries[country].translations[lang]) {
      visited.add(country)
      setVisited(visited)
      setGood(good + 1)
    } else {
      setBad(bad + 1);
    }
    const newCountry = getNewCountry(country, visited);
    setCountry(newCountry);
  }

  const _getCountryList = () => {
    let countryList = [countries[country].translations[lang]];
    while(countryList.length < optionsNumber){
      const curCountry = getCountryName(countries[getRandomWithinIndex()])
      !countryList.includes(curCountry) && countryList.push(curCountry);
    }
    return countryList.sort();
  }

  return (
    <ThemeProvider theme={theme}>
      <StyledView>
        <StyledModal
          animationType="fade"
          transparent={true}
          visible={showModal}
          onRequestClose={() => setShowModal(false)}>
          <StyledView>
            <StyledPicker
              selectedValue={lang}
              onValueChange={value => { setShowModal(false); setLang(value) }}>
                {languages.map( x => <StyledItem itemStyle={{heigth:'20px'}} key={x.code} label={x.name} value={x.code} /> )}
            </StyledPicker>
          </StyledView>
        </StyledModal>
        <StyledText>{translations[lang].scoreboard}: 
          <Text> <Text style={{color:'green'}}>{good}</Text> - <Text style={{color:'red'}}>{bad}</Text> </Text>
        </StyledText>
        <StyledText>{translations[lang].question}</StyledText>
        <StyledImage resizeMode="cover" source={flags[countries[country].alpha2Code.toLowerCase()]}/>
        {/* <StyledText>{countries[country].translations[lang]}</StyledText> */}
        {_getCountryList().map( x => 
          <StyledButton key={x} onPress={()=> _handleSelectCountryName(x)}>
            <StyledText>{x}</StyledText>
          </StyledButton>)
        }
        <StyledHr>
          <StyledButton onPress={()=> setShowModal(true)}>
            <StyledText>{translations[lang].changeLang}</StyledText>
          </StyledButton>
        </StyledHr>
      </StyledView>  
    </ThemeProvider>
  );
}
const StyledModal = styled.Modal``
const StyledItem = styled(Picker.Item)`
  background-color: ${props => props.theme.optionButton};
`
const StyledHr = styled.View`
  border-top: '1px solid black';
  margin-top: 50px;
`
const StyledPicker = styled.Picker`
  width: 90%;
  border:1px solid white;
`

const StyledButton = styled.TouchableHighlight`
  border: 1px solid ${props => props.theme.optionButton};
  border-radius: 12px;
  background-color: ${props => props.theme.optionButton};
  box-shadow: 0 3px 6px rgba(0,0,0,0.16);
  width:90%;
  margin:5px;
`

const StyledText = styled.Text`
  color: ${props => props.theme.color};
  font-size: 20px;
  padding: 10px;
`
const StyledImage = styled.Image`
  min-width:250px;
  min-height:150px;
  background-color:green;
  margin-bottom:25px;
`
const StyledView = styled.View`
  flex:1;
  background-color: ${props => props.theme.backgroundColor};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction:column;
`
export default App