import moment from 'moment';
import download from 'downloadjs';
import parseContentDisposition from 'content-disposition'
import URI from 'urijs';
import {authTokenStore} from '../store/AuthTokenStore';
import { baseUrl } from './BaseUrl';

export class Request {

    static async post(url, body, authorization) {
        let response;

        let headers = new Headers();
        headers.append('Content-Type', 'application/json;charset=UTF-8');
        headers.append('Accept', 'application/json');
        if (authorization) {
            headers.append('Authorization', authorization);
        } else {
            headers.append('x-auth-token', authTokenStore.value);
        }

        try {
            const options = {
                headers: headers,
                method: 'POST',
                body: body && JSON.stringify(body)
            };
            response = await fetch(baseUrl + url, options);
        } catch (err) {
            throw {
                timestamp: moment().valueOf(),
                status: 'NETWORK_ERROR',
                error: 'Network error',
                message: 'Ошибка при отправке запроса',
                path: URI(baseUrl + url).path()
            };
        }

        let data;
        try {
            data = await response.json();
        } catch (err) {
            throw {
                timestamp: moment().valueOf(),
                status: 'PARSE_ERROR',
                error: 'Parse error',
                message: 'Ошибка при обработке ответа',
                path: URI(baseUrl + url).path()
            };
        }

        if (!response.ok) {
            if (response.status === 401) {
                authTokenStore.setValue(null);
            }
            throw data;
        } else {
            const token = response.headers.get('x-auth-token');
            if (token) {
                authTokenStore.setValue(token)
            }
        }

        return data;
    }

    static async postDownloadFile(url, body) {
        let response;

        let headers = new Headers();
        headers.append('Content-Type', 'application/json;charset=UTF-8');
        headers.append('Accept', 'application/json');
        headers.append('x-auth-token', authTokenStore.value);

        try {
            const options = {
                headers: headers,
                method: 'POST',
                body: body && JSON.stringify(body)
            };
            response = await fetch(baseUrl + url, options);
        } catch (err) {
            throw {
                timestamp: moment().valueOf(),
                status: 'NETWORK_ERROR',
                error: 'Network error',
                message: 'Ошибка при отправке запроса',
                path: URI(baseUrl + url).path()
            };
        }

        let blob;
        try {
            blob = await response.blob();
        } catch (err) {
            throw {
                timestamp: moment().valueOf(),
                status: 'PARSE_ERROR',
                error: 'Parse error',
                message: 'Ошибка при обработке ответа',
                path: URI(baseUrl + url).path()
            };
        }

        const responseContentDisposition = response.headers.get('content-disposition');
        const contentDisposition = parseContentDisposition.parse(responseContentDisposition);

        download(blob, contentDisposition.parameters.filename);
    }
}