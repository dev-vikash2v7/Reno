import axios from 'axios';


export const validateBankAccount = () =>{

    const options = {
      method: 'POST',
      url: 'https://in.staging.decentro.tech/core_banking/money_transfer/validate_account',
      headers: {
        accept: 'application/json',
        client_id: 'renoapp_staging',
        client_secret: 'KKavuW9UOBKbpboezqX4pVyVlnVCQVDg',
        module_secret: 'Tg6DLmnd0VGkMyFtuRVaC18tqmpyBgye',
        provider_secret: 'RKNQYUUw1CL630OP4V978ZsfgzRAOGKX',
        'content-type': 'application/json'
      },
      data: {
        beneficiary_details: {account_number: '462510419463423805', ifsc: 'YESB0CMSNOC'},
        reference_id: 'kmkkjkk',
        purpose_message: 'This is a penny drop transaction',
        transfer_amount: '20'
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







/////////////////

export const checkTransactionStatus = ()=>{


const options = {
  method: 'GET',
  url: 'https://in.staging.decentro.tech/core_banking/money_transfer/get_status?reference_id=dfa&decentro_txn_id=adfad',
  headers: {
    accept: 'application/json',
    client_id: 'renoapp_staging', 
    client_secret: 'KKavuW9UOBKbpboezqX4pVyVlnVCQVDg',
    module_secret: 'Tg6DLmnd0VGkMyFtuRVaC18tqmpyBgye',
    provider_secret: 'RKNQYUUw1CL630OP4V978ZsfgzRAOGKX',
    
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
