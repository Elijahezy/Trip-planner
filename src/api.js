import EventsModel from '../src/model/events-model.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class Api {
  constructor(server, authorization) {
    this._server = server;
    this._authorization = authorization;
  }

  getDestinations() {
    return this._load({url: 'destinations'})
      .then(Api.fromJSON);
  }

  getOffers() {
    return this._load({url: 'offers'})
      .then(Api.fromJSON);
  }

  getEvents() {
    return this._load({url: 'points'})
      .then(Api.fromJSON)
      .then((points) => points.map(EventsModel.adaptToClient));
  }

  updateEvent(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(EventsModel.adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.fromJSON)
      .then(EventsModel.adaptToClient);
  }

  addEvent(point) {
    return this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(EventsModel.adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.fromJSON)
      .then(EventsModel.adaptToClient);
  }

  deleteEvent(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append('Authorization', this._authorization);

    return fetch(
      `${this._server}/${url}`,
      {method, body, headers},
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static fromJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
