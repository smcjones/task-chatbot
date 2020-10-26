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

  private checkDate = (date: string, hour: number) => {
    if(date == null || date.trim().length < 0){
      return this.getTomorrowDate();
    }

    try{
      let final_date = new Date(date);
      return final_date;
    }catch(e){
      return this.getTomorrowDate();
    }

  }

  private getTomorrowDate = () => {
    let tomorrow_date = new Date();
    tomorrow_date.setDate(tomorrow_date.getDate() + 1);
    tomorrow_date.setHours(9);
    tomorrow_date.setMinutes(0);

    return tomorrow_date;

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
    });
  }

  constructor(name: string, description: string, startDate: string, endDate: string = "", timezone: string, calendarId: string = "") {
    this.calendarId = calendarId;
    this.name = name;
    this.description = description;
    this.timezone = timezone;
    this.startDate =  Utilities.formatDate(this.checkDate(startDate, 9), timezone, "yyyy-MM-dd'T'HH:mm:ss");
    this.endDate =  Utilities.formatDate(this.checkDate(endDate, 10), timezone, "yyyy-MM-dd'T'HH:mm:ss");
  }
}

