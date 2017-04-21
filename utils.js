var Timer = (function () {
    function Timer(proc, interval) {
        this.proc = proc;
        this._interval = interval;
    }
    Timer.prototype.resume = function () {
        this.isResumed = true;
        var self = this;
        var loop = function () {
            self.proc();
            if (self.isResumed)
                setTimeout(loop, self._interval);
        };
        setTimeout(loop, this._interval);
    };
    Timer.prototype.pause = function () {
        this.isResumed = false;
    };
    Object.defineProperty(Timer.prototype, "interval", {
        get: function () {
            return this._interval;
        },
        enumerable: true,
        configurable: true
    });
    return Timer;
}());
var Display = (function () {
    function Display(x, y, w, h) {
        this.div = document.createElement("div");
        this.div.width = w;
        this.div.height = h;
        this.div.style = "position: absolute; top: " + y + "px; left: " + x + "px; z-index: 1000;";
        document.body.appendChild(this.div);
    }
    Object.defineProperty(Display.prototype, "HTML", {
        get: function () {
            return this.div.innerHTML;
        },
        set: function (html) {
            this.div.innerHTML = html;
        },
        enumerable: true,
        configurable: true
    });
    return Display;
}());
var Session = (function () {
    function Session(sessionStorageName) {
        this.sessionStorageName = sessionStorageName;
        var storage = JSON.parse(sessionStorage.getItem(sessionStorageName)) || {};
        if (storage.log)
            storage.log.forEach(function (item, index) { console.log(item); });
        else
            storage.log = [];
        if (!storage.variables)
            storage.variables = {};
        sessionStorage.setItem(this.sessionStorageName, JSON.stringify(storage));
    }
    Session.prototype.log = function (text) {
        var storage = JSON.parse(sessionStorage.getItem(this.sessionStorageName));
        console.log(text);
        storage.log.push(text);
        sessionStorage.setItem(this.sessionStorageName, JSON.stringify(storage));
    };
    Session.prototype.writeVariable = function (name, value) {
        var storage = JSON.parse(sessionStorage.getItem(this.sessionStorageName));
        storage.variables[name] = value;
        sessionStorage.setItem(this.sessionStorageName, JSON.stringify(storage));
    };
    Session.prototype.readVariable = function (name) {
        var storage = JSON.parse(sessionStorage.getItem(this.sessionStorageName));
        return storage.variables[name];
    };
    return Session;
}());
