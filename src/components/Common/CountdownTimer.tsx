import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ bookingDateTime }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const bookingTime = new Date(bookingDateTime);

      // Calculate the difference in milliseconds between now and the booking time
      let difference = bookingTime - now;

      // Convert the difference to positive if the booking time is in the future
      if (difference < 0) {
        difference = Math.abs(difference);
      }

      // Calculate days, hours, minutes, and seconds
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Format the remaining time
      const formattedTime = `${days} day(s) ${hours} hour(s) ${minutes} minute(s) ${seconds} second(s)`;

      return formattedTime;
    };

    // Update time left every second
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [bookingDateTime]);

  return <div>{timeLeft}</div>;
};

export default CountdownTimer;
