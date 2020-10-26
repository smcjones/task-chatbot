/**
 * @fileoverview Description of this file.
 */

export class Event {
  private calendarId: string;
  private name: string;
  private description: string;
  private startDate: Date;
  private endDate: Date;
  private timezone: string;

  private checkDate = (date: string) => {
    return true;
  }

  public getJSON = () => {
return JSON.stringify({
  "summary": this.name,
  "description": this.description,
  'start': {
    'dateTime': this.startDate,
    'timeZone': this.timezone
  },
  'end': {
    'dateTime': this.endDate,
    'timeZone': this.timezone
  },
  'transparency': 'transparent',
  'visibility': 'private'
    })
  }

  constructor(name: string, description: string, startDate: string, endDate: string, timezone: string, calendarId: string) {
    if (this.checkDate(startDate) && this.checkDate(endDate)) {
      this.calendarId = calendarId;
      this.name = name;
      this.description = description;
      this.timezone = timezone;
      this.startDate =  Utilities.formatDate(new Date(startDate), timezone, "yyyy-MM-dd'T'HH:mm:ss");
      this.endDate =  Utilities.formatDate(new Date(endDate), timezone, "yyyy-MM-dd'T'HH:mm:ss");

    } else {
      //Logger.log('Wrong dates format')
    }
  }
}

