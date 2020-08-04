'use strict';

const setSeason = month => {
  switch (month) {
    case 1:
    case 2:
    case 3:
      return 'Winter';
    case 4:
    case 5:
    case 6:
      return 'Spring';
    case 7:
    case 8:
    case 9:
      return 'Summer';
    case 10:
    case 11:
    case 12:
      return 'Autumn';
  }
};

module.exports = setSeason;
