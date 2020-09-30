import moment from 'moment';
import momentDurationFormat from 'moment-duration-format';

momentDurationFormat(moment);

moment.duration.fn.format.defaults.trim = false;

moment.locale('ru');
