import Cookies from 'universal-cookie';

/*
|--------------------------------------------------------------------------
| Override class cookie
| Based on: https://www.npmjs.com/package/universal-cookie
|--------------------------------------------------------------------------
*/
class CookieService {
    constructor() {
        this.options = {
            path: "/"
        }
        this.cookies = new Cookies();
    }

    get(key, options = {}) {
        this.options = {...this.options, ...options}
        return this.cookies.get(key, this.options);
    }

    getAll(options = {}) {
        this.options = {...this.options, ...options}
        return this.cookies.getAll(this.options);
    }

    set(key, value, options = {}) {
        this.options = {...this.options, ...options}
        this.cookies.set(key, value, this.options);
    }
    
    remove(key, options = {}) {
        this.options = {...this.options, ...options}
        this.cookies.remove(key, this.options);
    }
}

export default new CookieService();
