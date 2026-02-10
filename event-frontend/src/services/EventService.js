import axios from 'axios';

const API_URL = "http://localhost:8080/api/events";

class EventService {
    getEvents() {
        return axios.get(API_URL);
    }

    createEvent(event) {
        return axios.post(API_URL, event);
    }

    getEventById(eventId) {
        return axios.get(API_URL + '/' + eventId);
    }
}

export default new EventService();