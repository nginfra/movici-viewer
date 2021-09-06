import Vue_ from 'vue';
import truncate from 'lodash/truncate';
import upperFirst from 'lodash/upperFirst';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const filters: Record<string, (term: number | string) => string> = {
  dateTimeString: value => {
    if (!value || typeof value === 'string') return '';
    return new Date(value * 1000).toLocaleString('NL');
  },
  dateString: value => {
    if (!value || typeof value === 'string') return '';
    return new Date(value * 1000).toLocaleDateString('NL');
  },
  snakeToSpaces: value => {
    if (!value || typeof value === 'number') return '';
    return value.replaceAll('_', ' ');
  },
  upperFirst: value => {
    if (!value || typeof value === 'number') return '';
    return upperFirst(value.toLowerCase());
  },
  truncate: value => {
    if (!value || typeof value === 'number') return '';
    return truncate(value);
  }
};

export default {
  install(Vue: typeof Vue_) {
    for (const key in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, key)) {
        Vue.filter(key, filters[key]);
      }
    }
  }
};
