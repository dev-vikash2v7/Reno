import { hp, wp } from 'src/app/Login';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Dialog, Portal, Text , Button } from 'react-native-paper';



const Success = ({visible, setVisible}) => {

  const hideDialog = () => setVisible(false);
  
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog} style={{backgroundColor:'#fff' , height:hp('30%') , }}>
        <Dialog.Icon icon="check-circle" theme={{ colors: { primary: 'check' } }} color='green' size={hp('4.5%')}/>
        <Dialog.Title style={styles.title}>You have successfully unlocked your booking!</Dialog.Title>
       
        <Button onPress={hideDialog} style={{backgroundColor:'#d20000'  ,   width:'80%' ,alignSelf:'center' , justifyContent:'center'  , borderRadius:0 , bottom: hp('-1%') }} > <Text style={{color:'white', fontWeight:"800" , fontSize : hp('2%') }} >Got It!</Text> </Button>

      </Dialog>
    </Portal>
  );
};



const Warning = ({visible, setVisible , content , title} : {visible:boolean, setVisible:any , content:string , title?:string}) => {

  const hideDialog = () => setVisible(false);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog} style={{backgroundColor:'#fff' , height:245  }}>
      {!title ? 
      <>
        <Dialog.Icon icon="lock"  theme={{ colors: { primary: 'primary' } }} color='#d20000' size={35}/>
        <Dialog.Title style={styles.title}>{content}</Dialog.Title>
        <Button onPress={hideDialog} style={{backgroundColor:'#d20000'  ,   width:'80%' ,alignSelf:'center' , justifyContent:'center'  , borderRadius:0 , bottom: -10 }} >
        <Text style={{color:'white', fontWeight:"800" , fontSize : hp('2%') }} >Got It!</Text> </Button>
        </>
      :
      <>
       <Dialog.Icon icon="lock"  theme={{ colors: { primary: 'primary' } }} color='#d20000' size={35}/>
        <Dialog.Title style={styles.title}>{title}</Dialog.Title>
        <Dialog.Content style={styles.title}>{content}</Dialog.Content>
        <Button onPress={hideDialog} style={{backgroundColor:'#d20000'  ,   width:'80%' ,alignSelf:'center' , justifyContent:'center'  , borderRadius:0 , bottom: -10 }} >
        <Text style={{color:'white', fontWeight:"800" , fontSize : hp('2%') }} >Got It!</Text> </Button>
      </>
}
      </Dialog>
    </Portal>
  );
};

const NoInternetWarning = ({visible, setVisible } : {visible:boolean, setVisible:any }) => {

  const hideDialog = () => setVisible(false);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog} style={{backgroundColor:'#fff' , height:240  }}>
        <Dialog.Icon icon="lock"  theme={{ colors: { primary: 'primary' } }} color='#d20000' size={35}/>
        <Dialog.Title style={styles.title}>{'You are offline. Some features may not be available.'}</Dialog.Title>
        <Button onPress={hideDialog} style={{backgroundColor:'#d20000'  ,   width:'80%' ,alignSelf:'center' , justifyContent:'center'  , borderRadius:0 , bottom: -10 }} >
        <Text style={{color:'white', fontWeight:"800" , fontSize : hp('2%') }} >Got It!</Text> </Button>
      </Dialog>
    </Portal>
  );
};







const AlertWarning = ({visible, setVisible , content   , afterUnlock}) => {

  const hideDialog = () => setVisible(false);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}  style={{backgroundColor:'#fff' , height:hp('30%')  }}>

          <Dialog.Title style={styles.title}>{content}</Dialog.Title>

        <Dialog.Actions style={{display:'flex' , flexDirection:'row' , marginTop:hp('-1%')}}>
          <Button onPress={() => {
            hideDialog()
            afterUnlock();
          }} 
          style={{
            backgroundColor:'#d20000'  ,  
             width:'40%' ,
             alignSelf:'center' , 
             justifyContent:'center'  ,
              borderRadius:0 , 
              // bottom: -10  , 
              position:'absolute',
              left:wp('8%')
              
             }}
              >
                <Text style={{color:'white', fontWeight:"800" , fontSize : hp('2%') }} >Yes</Text> 
                </Button>


          <Button onPress={() => hideDialog()} style={{
            backgroundColor:'#d20000'  ,  
             width:'40%' ,
             alignSelf:'center' , 
             justifyContent:'center'  ,
              borderRadius:0 , 
              // bottom: -10  , 
              position:'absolute',
              right:wp('8%')
              
             }}
              >
                <Text style={{color:'white', fontWeight:"800" , fontSize : hp('2%') }} >No</Text> 
                </Button>

        </Dialog.Actions>


      </Dialog>
    </Portal>
  );
};




const CancelWarning = ({visible, setVisible    , handleCanel}) => {

  const hideDialog = () => setVisible(false);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}  style={{backgroundColor:'#fff' , height:hp('26%')  }}>

          <Dialog.Title style={styles.title}>You are about to cancel this booking.</Dialog.Title>
          {/* <Dialog.Content > <Text variant="bodyMedium">You are about to cancel this booking.</Text></Dialog.Content> */}

        <Dialog.Actions style={{display:'flex' , flexDirection:'row' , marginTop:0}}>
          <Button onPress={() => {
            handleCanel();
            hideDialog()
          }} 
          style={{
            backgroundColor:'#d20000'  ,  
             width:'40%' ,
             alignSelf:'center' , 
             justifyContent:'center'  ,
              borderRadius:0 , 
              // bottom: -10  , 
              position:'absolute',
              left:wp('8%')
              
             }}
              >
                <Text style={{color:'white', fontWeight:"800" , fontSize : hp('2%') }} >Yes</Text> 

              </Button>


          <Button onPress={() => hideDialog()} style={{
            backgroundColor:'#d20000'  ,  
             width:'40%' ,
             alignSelf:'center' , 
             justifyContent:'center'  ,
              borderRadius:0 , 
              // bottom: -10  , 
              position:'absolute',
              right:wp('8%')
              
             }}
              >
                <Text style={{color:'white', fontWeight:"800" , fontSize : hp('2%') }} >No</Text> 

                </Button>

        </Dialog.Actions>


      </Dialog>
    </Portal>
  );
};



const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize:hp('2.3%') ,
    fontWeight:'700',
    fontFamily:'Poppins-SemiBold',
    color: '#000',
  },
})

export  {Success , Warning ,AlertWarning , CancelWarning ,NoInternetWarning};