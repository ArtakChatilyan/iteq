export const convertUTCToLocal = (mysqlDatetime) => {

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const date=new Date(mysqlDatetime);
  return date.toLocaleString("en-US", { timeZone: timezone });
};
