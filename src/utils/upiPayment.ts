
import axios from 'axios';
import { EXPO_PUBLIC_Bholaram_Virtual_Account, EXPO_PUBLIC_Client_ID  ,EXPO_PUBLIC_Client_Secret ,EXPO_PUBLIC_Payments_Module_Secret , EXPO_PUBLIC_Provider_Secret, EXPO_PUBLIC_User_Virtual_Account } from '../env';
import { Alert } from 'react-native';
import QRCode from 'react-qr-code';
import uuid from 'react-uuid';

interface  generateUPIPaymentLinkProps {
  method : string | string[],
  amount : number,
  merchant_va : string , 
  name : string 
}

type GenerateUPIPaymentLink = {
  success : boolean , 
  message : string , 
  url  ?: string,
  decentroTxnId  ?: string,
}; // Adjust the return type as per your actual implementation

export async function  generateUPIPaymentLink({ 
  method ,
    amount ,
    merchant_va , 
    name
} : generateUPIPaymentLinkProps)  : Promise<GenerateUPIPaymentLink> {



      const data = {
        
          "reference_id": uuid(),
          "payee_account": merchant_va,
          "amount" : amount,
          "purpose_message": `Paying Rs ${amount} to ${name}`,
          "generate_qr": 0,
          "expiry_time": 5 ,
           "generate_uri": 1
      }

  
     const  headers =  {
        accept: 'application/json',
        client_id: EXPO_PUBLIC_Client_ID,
        client_secret:  EXPO_PUBLIC_Client_Secret,
        module_secret:  EXPO_PUBLIC_Payments_Module_Secret,
        provider_secret:  EXPO_PUBLIC_Provider_Secret,
        'content-type': 'application/json'
      }


   const res =  await  axios.post('https://in.staging.decentro.tech/v2/payments/upi/link' , data , {headers} )
        .then(response => {
          // console.log('generateUPIPaymentLink',response.data);

          const {decentroTxnId , message  , status} = response.data

          if(status == 'FAILURE') return {
            success : false ,
            message 
          }

          const {encodedDynamicQrCode , generatedLink  , pspUri } = response.data.data
          const {gpayUri , paytmUri  , phonepeUri } = pspUri 



          function getPaymentUri(){
            switch (method) {
              case 'phonepe':
                return phonepeUri;

              case 'paytm':
                return paytmUri;

              case 'gpay':
                return gpayUri;

              case 'qr':
                return encodedDynamicQrCode

              case 'universal':
                return generatedLink;
                
              default:
                Alert.alert('Payment type not supported')
                break;
            }
          }

          return {
            success : true ,
            message  , 
            decentroTxnId ,
            url : getPaymentUri() 
          }
      })


        .catch(function (error) {
          console.error('generating url error : ' ,  error.message);

          return{
            success : false ,
            message : error.message,
            decentroTxnId  : null,
            url : null 
          }

        });

        return {
          success : res.success ,
            message : res.message,
            decentroTxnId  : res.decentroTxnId,
            url : res.url
      }

      
      }
      

      

      /////////////////




      type StatusType = 'PENDING' | 'SUCCESS' | 'FAILURE' | 'EXPIRED';

interface Props {
  decentroTxnId  : string,
}

type CheckPaymentStatus = {
  transactionStatus  :StatusType , 
  bankReferenceNumber  : string ,
   npciTxnId : string 
}; // Adjust the return type as per your actual implementation


  export async function  checkPaymentStatus ( {   decentroTxnId  }   : Props )  : Promise<CheckPaymentStatus> {


   const  headers = { 
      client_id:  EXPO_PUBLIC_Client_ID,
      client_secret:  EXPO_PUBLIC_Client_Secret,
      module_secret:  EXPO_PUBLIC_Payments_Module_Secret,
      provider_secret:  EXPO_PUBLIC_Provider_Secret,
    }

    // console.log('decentroTxnId : ' , decentroTxnId) 
    
  const res =  await  axios.get(`https://in.staging.decentro.tech/v2/payments/transaction/${decentroTxnId}/status` , {headers})
    .then(function (response) {

      // console.log('checkPaymentStatus response - ' ,JSON.stringify(response.data));

      if(response.data.status === 'FAILURE') {
         return {transactionStatus  :'FAILURE' , bankReferenceNumber  : null, npciTxnId : null}
      }

      const {transactionStatus   , bankReferenceNumber , npciTxnId} = response.data.data

      return  {transactionStatus   , bankReferenceNumber , npciTxnId}

    })
    .catch(function (error) {
      console.log('checkPaymentStatus erro ' ,  error.message);
      return {transactionStatus  :'FAILURE' , bankReferenceNumber  : null, npciTxnId : null}
    });


    return {
      transactionStatus : res.transactionStatus ,
      bankReferenceNumber : res.bankReferenceNumber ,
      npciTxnId  : res.npciTxnId    
    } ;

  }
  


  ////////////////////////






  
// export const validateUPI = ({data })=>{
//     const options = {
//         method: 'POST',
//         url: 'https://in.staging.decentro.tech/v2/payments/vpa/validate',
//         headers: {
//           accept: 'application/json',
//           client_id:  EXPO_PUBLIC_Client_ID,
//           client_secret:  EXPO_PUBLIC_Client_Secret,
//           module_secret:  EXPO_PUBLIC_Payments_Module_Secret,
//           'content-type': 'application/json'
//         },
//         data
//       };
      
//       axios
//         .request(options)
//         .then(function (response) {
//           console.log('validateUPI' , response.data);
//           return response.data
//         })
//         .catch(function (error) {
//           console.error(error)
// }
//         )   
// }


// ///////////////







/////////////////

export const createVirtualAccount = ()=>{

  const options = {
    method: 'POST',
    url: 'https://in.staging.decentro.tech/v2/banking/account/virtual',
    headers: {
      accept: 'application/json',
      client_id: 'renoapp_staging',
      client_secret: 'KKavuW9UOBKbpboezqX4pVyVlnVCQVDg',
      module_secret: 'Tg6DLmnd0VGkMyFtuRVaC18tqmpyBgye',
      'content-type': 'application/json'
    },
    data: {
      virtual_account_balance_settlement: 'enabled',
      bank_codes: ['YESB', 'ICIC'],
      name: 'shivam verma',
      email: 'vk23developer@GMAIL.COM ',
      mobile: '8269700955',
      address: 'D15 , Patel Nagar  , Raisen Road , Bhopal , MP , 462022',
      city: 'bhopal',
      pincode: 462022,
      pan: 'CDAPV9062Q',
      kyc_verified: 1,
      minimum_balance: 7500,
      transaction_limit: 10000,
      customer_id: 'ABC123',
      kyc_check_decentro: 1,
      generate_static_qr: 1,
    }
  };
  
  axios
    .request(options)
    .then(function (response) {
      // console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
  }
  
  // {
  //   "decentroTxnId": "03CECBB6700E4F18892BA6DF0F195378",
  //   "status": "SUCCESS",
  //   "responseCode": "S00000",
  //   "message": "Virtual accounts created successfully",
  //   "data": [
  //       {
  //           "bank": "YES BANK LTD",
  //           "status": "success",
  //           "message": "Yes Bank account created successfully.",
  //           "accountNumber": "462510449200845568",
  //           "ifsc": "YESB0CMSNOC",
  //           "allowedMethods": [
  //               "IMPS",
  //               "NEFT",
  //               "RTGS",
  //               "UPI"
  //           ],
  //           "currency": "INR",
  //           "transactionLimit": 0.0,
  //           "minimumBalance": 0.0,
  //           "upiId": "462510449200845568@yesbankltd",
  //           "upiQrCode": "iVBORw0KGgoAAAANSUhEUgAAAPUAAAD1AQAAAACgyo7IAAACiUlEQVR4nO2YMa6zMBCEF6Wg5AjcJFwsEkhcDG7iI1C6QNl/ZkwAvV963dO6CAUhfBT2enc8a/Nfr2xf/uV/yzcza7ZXb7yydXvfLvbin7EOPrqvG59tTP7uPOXG916gCv6ydt0eyRqfUx68jL/HnCriPvX2ZGjfmIQ96+MMKG4IsvVKgnp4Wf9kA+Lb4qPP57Xwo36QBLfb//UVxXVtiOqzm6xl/fD2Q58iOQOqSfDJGekGf335jD+aTwbV4Q2pibcPxxPiO2yVcISxwc0U34XxlRw9O6+DT5YHZiWkxxVa1o9BhMYqOFOzUX1zE6R+628+9Sea6y0nQdVZin5b33olHFuLVFupqUlof2Ym1MFhGLj1SX+Ula1/0qEKPlG/MXTrMBNVNXaaUlM1cLzQ+kMfi367wt2u1/4Yyx/O5wTX4Bp60iT8fax/NGdBD/iB6jjz80ETgfie+hTNUdoGQ+iU7sKh37f9OZz33OuSKb7PDkOHP7TTH0Zz/CC0M6oaXzqtV+YkbLjqJ5a/qDqzaxLcCU0m9tr/gjn9DfsTJiSt4SGS9/yI5bOriDB+6zVqOjG79DuYM77MRfafznRIrHQWuVfCGVqZHKQmg+xUovzxh9GcpVMadpf+qJ3CR0slnPXNSRylLTuB6Zz+P5yz4URB820Z+lHfV/yjeamfUjrdjNAi3Pf8DObommBdM5eerisdM6mE6yoNnTaZvSz95f+DeWndZ4UWrpWT4PlWe/qzaI5VX+kK2QTQRCQdzVz5Gc11fskDI7iaXPzh9iM/4jkEUVuLjo7W4iTGirgVEULXudNO7Lf1j+Zaf7TuEkkeUh9NfC38qJ+iP6UJZTmtXgf/7fryL/9T/g82L02gMrAZGgAAAABJRU5ErkJggg==",
  //           "upiOnboardingStatus": "FAILED",
  //           "upiOnboardingStatusDescription": "Not valid for Static QR generation.",
  //           "virtualAccountBalanceSettlement": "ENABLED",
  //           "upiStaticQrGenerationStatus": "FAILED",
  //           "upiStaticQrGenerationStatusDescription": "UPI sub merchant details are not available. Kindly get in touch with support@decentro.tech."
  //       }
  //   ]
  // }
  
  
  
  
  
  
  
  
  
  ///////////////////////
  
  export const getVirtualAccountDetails = ()=>{
  
  const options = {
    method: 'GET',
    url: 'https://in.staging.decentro.tech/core_banking/account_information/fetch_details?type=virtual&account_number=462510419463423805&qr_requested=1#get_account_setails',
    headers: {
      accept: 'application/json',
      client_id: 'renoapp_staging',
      client_secret: 'KKavuW9UOBKbpboezqX4pVyVlnVCQVDg',
      module_secret: 'Tg6DLmnd0VGkMyFtuRVaC18tqmpyBgye',
      provider_secret: 'RKNQYUUw1CL630OP4V978ZsfgzRAOGKX'
    }
  };
  
  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
  }
  
  
  export const getBalance = () =>{
  
  
  const options = {
    method: 'GET',
    url: 'https://in.staging.decentro.tech/core_banking/money_transfer/get_balance?account_number=462510419463423805&mobile_number=9999999999#v2',
    headers: {
      accept: 'application/json',
      client_id: 'renoapp_staging',
      client_secret: 'KKavuW9UOBKbpboezqX4pVyVlnVCQVDg',
      module_secret: 'Tg6DLmnd0VGkMyFtuRVaC18tqmpyBgye',
      provider_secret: 'RKNQYUUw1CL630OP4V978ZsfgzRAOGKX'
    }
  };
  
  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
  }
  
  // {
  //   "decentroTxnId": "B2E5F60464E64B48AEACE366E72DA004",
  //   "status": "success",
  //   "responseCode": "S00000",
  //   "type": "VIRTUAL",
  //   "accountNumber": "462510419463423805",
  //   "presentBalance": 9994977.5,
  //   "upiId": "dece.decentro@timecosmos",
  //   "transactionAmountLimit": 1000000,
  //   "minimumBalance": 0
  // }