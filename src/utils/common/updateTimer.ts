 const calculateTimeLeft = ({setFormattedTime , timer} :{setFormattedTime :any, timer:any} ) => {
    
  // Calculate days, hours, minutes, and seconds
  const days = Math.floor(timer / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timer % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timer % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timer % (1000 * 60)) / 1000);

  setFormattedTime(`Unlock In : ${days !=0 ? days + 'days' :''} ${hours}hrs ${minutes}min ${days ==0 ? seconds + 's' :'' }`)
};
export default calculateTimeLeft