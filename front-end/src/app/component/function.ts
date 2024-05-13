const CompareDate = (time1: string | number, time2: string | number) => {
  // if (typeof time1 == 'string')
  const Date1 = new Date(time1);
  const Date2 = new Date(time2);
  if (Date1.getTime() > Date2.getTime()) return true;
  else return false;
};
export default CompareDate;
