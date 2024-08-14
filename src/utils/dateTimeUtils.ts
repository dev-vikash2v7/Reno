import moment from 'moment';

export const getDayFromNumber = (index:number) => {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return days[index]
};

export const isCurrentTimeInRange = (timeRange: string) => {
  // eg. timeRange = 21:30-22:00 
  // checks if current time is in between the timeRange provided

  const [t1, t2] = timeRange.split('-');
  const [t1hour, t1minute] = t1.split(':');
  const [t2hour, t2minute] = t2.split(':');
  const currentTime = moment();
  const startTime = moment()
    .set('hour', t1hour)
    .set('minute', t1minute)
    .set('second', '00');
  const endTime = moment()
    .set('hour', t2hour)
    .set('minute', t2minute)
    .set('second', '00');

  const startDiff = currentTime.diff(startTime);
  const endDiff = currentTime.diff(endTime);
  if (startDiff >= 0 && endDiff <= 0) {
    return true;
  }
  return false;
};

export const currentTimeRemainingFromRange = (timeRange, index = 0) => {
  // eg. timeRange = 21:30-22:00
  // gives the time difference from current time range
  // either from start or from the end of the range
  // index=0 means start index=1 means end

  // output in HH:mm:ss

  const t = timeRange.split('-')[index];
  const [thour, tminute] = t.split(':');
  const currentTime = moment();
  const time = moment()
    .set('hour', thour)
    .set('minute', tminute)
    .set('second', '00');

  const diff = time.diff(currentTime, 'millisecond');
  return moment(diff).format('hh:mm:ss');
};
