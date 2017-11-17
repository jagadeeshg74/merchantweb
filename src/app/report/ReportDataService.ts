import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


const parseTimestamp = (timestamp) => moment(new Date(timestamp * 1000));

const reconfigureCurrentForecastData = (forecastData, currentTimestamp) => {
  // Reconfigure some of the "currently" properties
  forecastData.apparentTemperature = Math.round(forecastData.apparentTemperature);
  forecastData.temperature = Math.round(forecastData.temperature);
  forecastData.precipProbability = Math.round(forecastData.precipProbability * 100);
  forecastData.humidity = Math.round(forecastData.humidity * 100);

  // Introduce this new property so that we can preserve the property "time" for further usage
  forecastData.dayName = moment(currentTimestamp).format('dddd, ha');

  return forecastData;
};

const reconfigureDailyForecastData = (forecastData) => {
  // Reconfigure some of the "daily" properties
  return forecastData.daily.data.map((dailyForecast) => {
    dailyForecast.apparentTemperatureMax = Math.round(dailyForecast.apparentTemperatureMax);
    dailyForecast.apparentTemperatureMin = Math.round(dailyForecast.apparentTemperatureMin);
    dailyForecast.temperatureMax = Math.round(dailyForecast.temperatureMax);
    dailyForecast.temperatureMin = Math.round(dailyForecast.temperatureMin);

    // Introduce this new property so that we can preserve the property "time" for further usage
    dailyForecast.dayName = moment(parseTimestamp(dailyForecast.time)).format('dddd');
    return dailyForecast;
  });
};

const reconfigureHourlyForecastData = (forecastData, currentTimestamp) => {
  // Reconfigure some of the "currently" properties
  forecastData.apparentTemperature = Math.round(forecastData.apparentTemperature);
  forecastData.temperatureRounded = Math.round(forecastData.temperature);
  forecastData.precipProbability = Math.round(forecastData.precipProbability * 100);
  forecastData.humidity = Math.round(forecastData.humidity * 100);

  // Introduce this new property so that we can preserve the property "time" for further usage
  forecastData.formattedDayTime = moment(currentTimestamp).format('hA');

  return forecastData;
};

@Injectable()
export class ReportDataService {
  private _apiurl = '../merchant_laravel/api/v1/cashpoints';
  private exclude = '&exclude=flags';
  private query = `?units=ca&lang=en`;
  private key = 'eedfd2f684ab3986f2a3876ac5177f83';
  private api = 'https://api.darksky.net/forecast';

  forecast: any = {};
  hourlyData = [];


  // Prepare the variables as observables so that we can notify other parts of the
  // application about the changes that are happening here
  hourlyDataChanged: Observable<any>;
  private hourlyDataEventTrigger: Subject<boolean>;

  constructor(private _http: Http) {
    this.hourlyDataEventTrigger = new Subject<boolean>();
    this.hourlyDataChanged = this.hourlyDataEventTrigger.asObservable();
  }


  public getMerchantCashpoints(merchantId: string) {


   const apiUrl = `${this._apiurl}/merchant/` + merchantId;

    return this._http.get(apiUrl)
      .map((res: Response) => res.json())
      .do(data => console.log('getMerchantCashpoints : ' + JSON.stringify(data)))
      .catch(this.handleError);

  }

  public getReportData(merchantId: string, report_type: string, report_date: Date) {

    const apiUrl = `${this._apiurl}/merchant/` + merchantId + `/report/` + report_type + `/` + report_date;
    console.log(apiUrl);
    return this._http.get(apiUrl)
      .map((res: Response) => res.json())
     // .do(data => console.log('GetReportData  : ' + JSON.stringify(data)))
      .catch(this.handleError);

  }

  getForecast(coordinates: string) {

    const apiUrl = `${this._apiurl }${this.api } / ${this.key }/${coordinates}${this.query}${this.exclude}`;
    return this._http.get(apiUrl).map((res: Response) => res.json());

  }

  getForecastForSpecificDate(coordinates: string, time) {
    // When getting the specific date, modify the timestamp so that it's set to the current time.
    const ts1 = new Date(time * 1000);
    const tsm1 = moment(ts1);
    const tsm2 = moment();

    tsm1.set({
      'hour': tsm2.get('hour'),
      'minute': tsm2.get('minute'),
      'second': tsm2.get('second')
    });

    const apiUrl = `${this._apiurl}${this.api}/${this.key}/${coordinates},${tsm1.unix()}${this.query}${this.exclude}`;
    return this._http.get(apiUrl).map((res: Response) => res.json());
  }


  parseForecastData(forecast) {
    const forecastServiceData = JSON.parse(JSON.stringify(forecast));
    const currentTime = parseTimestamp(forecastServiceData.currently.time);

    forecastServiceData.currently = reconfigureCurrentForecastData(forecastServiceData.currently, currentTime);
    forecastServiceData.daily = reconfigureDailyForecastData(forecastServiceData).slice(0, 7);

    // Memoize the data
    this.forecast = forecastServiceData;

    // Let other parts of the application know that they need to update
    this.hourlyDataEventTrigger.next();

    // Return for the direct consumption
    return forecastServiceData;
  }

  parseHourlyData() {
    // Return only the next 24 hours and memoize it
    this.hourlyData = this.forecast.hourly.data
      .map((hourlyData) => reconfigureHourlyForecastData(hourlyData, parseTimestamp(hourlyData.time)))
      .slice(0, 24);

    return this.hourlyData;
  }

  selectDifferentDayForInspection(data) {
    const forecastServiceData = JSON.parse(JSON.stringify(data));

    forecastServiceData.currently = reconfigureCurrentForecastData(
      forecastServiceData.currently,
      parseTimestamp(forecastServiceData.currently.time)
    );

    // Memoize the data
    this.forecast.currently = forecastServiceData.currently;
    this.forecast.hourly = forecastServiceData.hourly;

    // Let other parts of the application know that they need to update
    this.hourlyDataEventTrigger.next(forecastServiceData.currently.time);
  }


  private handleError(error: Response) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

}