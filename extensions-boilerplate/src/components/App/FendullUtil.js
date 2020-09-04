const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * 60;
const SECONDS_PER_DAY = SECONDS_PER_HOUR * 24;

export default class FendullUtil {
    static timeSince(t){
        var d = new Date(0);
        d.setUTCSeconds(t);
        var d2 = new Date();
        var diff = (d2 - d) / 1000;
        
        if (diff > SECONDS_PER_DAY){
            return Math.floor(diff / SECONDS_PER_DAY).toString() + " day(s) ago";
        }

        if (diff > SECONDS_PER_HOUR) {
            return Math.floor(diff / SECONDS_PER_HOUR).toString() + " hour(s) ago";
        }

        return Math.floor(diff / SECONDS_PER_MINUTE).toString() + " minute(s) ago";
    }
}