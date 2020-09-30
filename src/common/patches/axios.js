import axios from 'axios';

//axios.defaults.baseURL = process.env.PUBLIC_URL || '';
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';

if (!process.browser) {
    axios.defaults.httpsAgent = new (require('https').Agent)({
        rejectUnauthorized: false,
    });
}

// axios.defaults.validateStatus = status => status >= 200 && status <= 500;
