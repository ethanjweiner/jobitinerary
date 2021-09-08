import date from "date-and-time";

export function dateToStrings(inputDate) {
  return [
    inputDate.toString(),
    inputDate.toDateString(),
    inputDate.toISOString(),
    inputDate.toLocaleDateString(),
    inputDate.toLocaleString(),
    inputDate.toUTCString(),
    date.format(inputDate, "MMMM"),
    date.format(inputDate, "dddd"),
  ];
}
