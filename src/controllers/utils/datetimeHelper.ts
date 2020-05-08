// src/controllers/utils/datetimeHelper.ts

import * as moment from "moment";

export class DatetimeHelper {

    getCurrentTimestamp = () => {
        return Math.floor(Date.now()).toString();
    };

    getDatetimeString = (timestamp: string) => {
        const date = moment(parseInt(timestamp));
        return date.format('LLLL');
    };
}