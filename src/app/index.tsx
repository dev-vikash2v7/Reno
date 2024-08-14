import React, { useEffect } from 'react'
import { Redirect } from 'expo-router'
import analytics from '@react-native-firebase/analytics';

import crashlytics from '@react-native-firebase/crashlytics';


const App: React.FC = () => {

  useEffect(() => {
    crashlytics().log('App mounted.');
    analytics().logAppOpen()
  }, []);
  
  return (
    <Redirect href={'/SplashScreen/'} />
    // <Redirect href={'/RenoPay/'} />
  )
}

export default App;