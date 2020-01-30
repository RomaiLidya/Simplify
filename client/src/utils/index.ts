export const isValidEmail = (email: string): boolean => {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const minutesConvertToHours = (numberOfMinutes: number) => {
  const hours = numberOfMinutes / 60;
  let rhours = ('0' + Math.floor(hours)).slice(-2);
  const minutes = (hours - Number(rhours)) * 60;
  let rminutes = ('0' + Math.round(minutes)).slice(-2);
  return { rhours, rminutes };
};

export const hoursConvertToMinutes = (hours: number, minutes: number) => {
  const minutesFromHours = hours * 60;
  const numberOfMinutes = minutesFromHours + minutes;
  return numberOfMinutes;
};