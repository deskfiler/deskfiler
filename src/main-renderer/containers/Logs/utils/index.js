import {
  DateTime,
} from 'luxon';

export const formatToCSV = data => (
  Object.keys(data).reduce((acc, key) => (
    [
      ...acc,
      ...data[key]
        .map(log => (
          `${key} - ${log}`
            .trim()
            .split(' - ')
            .map((el, index) => (
              index === 1 ? `"${DateTime.fromRFC2822(el).toFormat('hh:mm dd/MM/yyyy')}"` : `"${el}"`
            ))
        )),
    ]
  ), [
    ['"Plugin"', '"Date and Time"', '"Operations"', '"Password"', '"Data path"'],
  ])
);

export const sortLogs = ({ isOrderAscending, sortKey, data }) => (
  data.sort((a, b) => {
    if (sortKey === 'date') {
      if (isOrderAscending) {
        if (DateTime.fromRFC2822(a.date) > (DateTime.fromRFC2822(b.date))) return -1;
        if (DateTime.fromRFC2822(a.date) < (DateTime.fromRFC2822(b.date))) return 1;
      }
      if (DateTime.fromRFC2822(a.date) > (DateTime.fromRFC2822(b.date))) return 1;
      if (DateTime.fromRFC2822(a.date) < (DateTime.fromRFC2822(b.date))) return -1;
    }
    if (isOrderAscending) {
      return b[sortKey].localeCompare(a[sortKey]);
    }
    return a[sortKey].localeCompare(b[sortKey]);
  })
);
