/**
 * @fileoverview A description of this module.  What would someone
 * new to your team want to know about the code in this file?
 * (DO NOT SUBMIT as is; replace this comment.)
 */

import {Event} from 'event';

export class CalendarService {
  private ldap: string;
  private endpoint: string;

  private getAuthHeaders = () => {
    var identity = ScriptApp.getOAuthToken();

    var headers = {
      "Authorization": "Bearer " + identity
    };

    return headers;
  }

  public listCalendars = () => {
    const headers = this.getAuthHeaders();
    const params = {
      "method": "GET",
      "headers": headers,
      "muteHttpExceptions": true
    };

    const calendars = UrlFetchApp.fetch(this.endpoint + '/users/me/calendarList', params);
    Logger.log(calendars);
  }

  public getUserCalendar = () => {
    const headers = this.getAuthHeaders();
    const params = {
      "method": "GET",
      "headers": headers,
      "muteHttpExceptions": true
    };

    return JSON.parse(UrlFetchApp.fetch(this.endpoint + '/calendars/' + this.ldap, params));
  }

  public createEvent = (name, description, startDate, endDate) => {
    //const startDate = '2020-10-23T20:00:00-03:00';
    //const endDate = '2020-10-23T21:00:00-03:00';

    const calendar = this.getUserCalendar();

    const event = new Event(name, description, startDate, endDate, calendar.timeZone, this.ldap);

    const headers = this.getAuthHeaders();
    const params = {
      "method":"POST",
      "headers": headers,
      "muteHttpExceptions": true,
      "payload": event.getJSON()
    };

    const response = UrlFetchApp.fetch(this.endpoint + '/calendars/' + this.ldap + '/events', params);
    Logger.log(response);
  };

  constructor(ldap: string, endpoint: string) {
    this.ldap = ldap;
    this.endpoint = endpoint;
  }
}


