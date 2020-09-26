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
            let days = Math.floor(diff / SECONDS_PER_DAY);
            return days == 1 ? "1 day ago" : days.toString() + " days ago";
        }

        if (diff > SECONDS_PER_HOUR) {
            let hours = Math.floor(diff / SECONDS_PER_HOUR);
            return hours == 1 ? "1 hour ago" : hours.toString() + " hours ago";
        }

        let minutes = Math.floor(diff / SECONDS_PER_MINUTE);
        return minutes == 1 ? "1 minute ago" : minutes.toString() + " minutes ago";
    }
}