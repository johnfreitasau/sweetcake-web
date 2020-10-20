// import React from 'react';

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import { DateUtils, DayPickerInputProps } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';

import { LabelContainer } from './styles';

interface Props {
  name: string;
  label: string;
  label_name?: string;
}

// const DatePickerInput: React.FC<DayPickerInputProps> = (
//   str: string,
//   format: string,
//   locale: string,
// ) => {

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

const DatePickerInput: React.FC = () => {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <DatePicker
      selected={startDate}
      onChange={(date) => setStartDate(new Date())}
    />
  );
};

//   function parseDate(str, format, locale) {
//     const parsed = dateFnsParse(str, format, new Date(), { locale });
//     if (DateUtils.isDate(parsed)) {
//       return parsed;
//     }
//     return undefined;
//   }

//   function formatDate(date, format, locale) {
//     return dateFnsFormat(date, format, { locale });
//   }

//   export default function Example() {
//     const FORMAT = 'MM/dd/yyyy';
//     return (
//       <DayPickerInput
//         formatDate={formatDate}
//         format={FORMAT}
//         parseDate={parseDate}
//         placeholder={`${dateFnsFormat(new Date(), FORMAT)}`}
//       />
//     );
//   }

//   const colourStyles = {
//     color: '#EE4D64',
//     marginTop: 8,
//     borderRadius: 10,
//     borderColor: '#232129',
//     fontSize: 18,
//     height: 56,
//     // control: (styles) => ({
//     //   ...styles,
//     //   marginTop: 8,
//     //   borderRadius: 10,
//     //   borderColor: error ? '#EE4D64' : '#232129',
//     //   fontSize: 18,
//     //   height: 56,
//     // }),
//     // option: (styles) => ({
//     //   ...styles,
//     //   color: '#F4EDE8',
//     // }),
//   };

//   return (
//     <LabelContainer htmlFor={label_name || name}>
//       {label}
//       <DayPickerInput
//         dayPickerProps={{
//           month: new Date(2018, 10),
//           showWeekNumbers: true,
//           todayButton: 'Today',
//         }}
//         style={colourStyles}
//       />
//     </LabelContainer>
//   );
// };

export default DatePickerInput;
