import axios from 'axios';
import http from 'http';
import https from 'https';
import serialize from 'serialize-javascript';

import { localStore } from '../helpers';

class HttpApi {

    static requestHeaders(multipart) {
        let token = localStore('_access_token');
        axios.defaults.headers['Authorization'] = (token) ? `jwt ${localStore('_access_token')}` : '';

        if (!multipart) axios.defaults.headers['Content-Type'] = 'application/json';
        axios.defaults.headers['Access-Control-Allow-Origin'] = '*'
    }

    static requestConfig(cancelToken) {
        let config = {
            httpAgent: new http.Agent({ keepAlive: true }),
            httpsAgent: new https.Agent({ keepAlive: true }),
            onDownloadProgress: (progressEvent) => {
                // let downloadCount = DownloadCount(progressEvent.timeStamp, progressEvent.total, progressEvent.loaded)
                // let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                // console.log(percentCompleted, progressEvent, 'DOWNLOAD')
            },
            onUploadProgress: (progressEvent) => {
                // let downloadCount = DownloadCount(progressEvent.timeStamp, progressEvent.total, progressEvent.loaded)
                // let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                // console.log(percentCompleted, progressEvent, 'UPLOAD')
            }
        }

        if (cancelToken) Object.assign(config, { cancelToken: cancelToken })
        return config;
    }

    static requestUrl(access) {
        switch (access) {
            default:
                return process.env.URL_WEB;
        }
    }

    static callGet(uri, data, access, cancelToken) {
        cancelToken = (cancelToken) ? cancelToken.token : '';

        this.requestHeaders();
        return axios.get(`${this.requestUrl(access)}/${uri}`, { params: data, cancelToken: cancelToken }, this.requestConfig())
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                let msg = { error: true, message: error.message };
                if (error.response) Object.assign(msg, error.response.data);

                if (axios.isCancel(error)) {
                    Object.assign(msg, { unmount: true });
                    console.log("Request cancelled", error.message);
                }

                return msg;
            });
    }

    static callPost(uri, data, access, multipart, cancelToken) {
        cancelToken = (cancelToken) ? cancelToken.token : '';

        this.requestHeaders(multipart);
        return axios.post(`${this.requestUrl(access)}/${uri}`, serialize(data, { isJSON: true }), this.requestConfig(cancelToken))
            .then(function (response) {
                if (multipart && multipart.progress === 100) {
                    // multipart.actprogress.loadProgress(false); 
                }

                return response.data;
            })
            .catch(function (error) {
                let msg = { error: true, message: error.message };
                if (error.response) Object.assign(msg, error.response.data);

                if (axios.isCancel(error)) {
                    Object.assign(msg, { unmount: true });
                    console.log("Request cancelled", error.message);
                }

                return msg;
            });
    }

    static callPut(uri, data, access, multipart, cancelToken) {
        cancelToken = (cancelToken) ? cancelToken.token : '';

        this.requestHeaders(multipart);
        return axios.put(`${this.requestUrl(access)}/${uri}`, serialize(data, { isJSON: true }), this.requestConfig(cancelToken))
            .then(function (response) {
                if (multipart && multipart.progress === 100) {
                    // multipart.actprogress.loadProgress(false); 
                }

                return response.data;
            })
            .catch(function (error) {
                let msg = { error: true, message: error.message };
                if (error.response) Object.assign(msg, error.response.data);

                if (axios.isCancel(error)) {
                    Object.assign(msg, { unmount: true });
                    console.log("Request cancelled", error.message);
                }

                return msg;
            });
    }

    static callDelete(uri, data, access, cancelToken) {
        cancelToken = (cancelToken) ? cancelToken.token : '';

        this.requestHeaders();
        return axios.delete(`${this.requestUrl(access)}/${uri}`, this.requestConfig(cancelToken))
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                let msg = { error: true, message: error.message };
                if (error.response) Object.assign(msg, error.response.data);

                if (axios.isCancel(error)) {
                    Object.assign(msg, { unmount: true });
                    console.log("Request cancelled", error.message);
                }

                return msg;
            });
    }
}

export default HttpApi;
