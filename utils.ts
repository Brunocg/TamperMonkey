export class Timer {
	private isResumed: boolean;
	private _interval: number;
	private proc: () => void;

	constructor (proc, interval) {
		this.proc = proc;
		this._interval = interval;
	}

	public resume() {
		this.isResumed = true;

		let self = this;
		var loop = function() {
			self.proc();

			if (self.isResumed)
				setTimeout(loop, self._interval);
		}

		setTimeout(loop, this._interval);
	}

	public pause() {
		this.isResumed = false;
	}

	get interval(): number {
		return this._interval;
	}
}

export class Display {
	private div: any;

	constructor (x, y, w, h) {
        this.div = document.createElement("div");
        this.div.width = w;
        this.div.height = h;
        this.div.style = "position: absolute; top: "+y+"px; left: "+x+"px; z-index: 1000;";

        document.body.appendChild(this.div);
    }

    get HTML(): string {
    	return this.div.innerHTML;
    }

    set HTML(html: string) {
    	this.div.innerHTML = html;
    }
}

export class Session {
	private sessionStorageName: string;

	constructor (sessionStorageName) {
		this.sessionStorageName = sessionStorageName;
		let storage = JSON.parse(sessionStorage.getItem(sessionStorageName)) || {};
		
		if (storage.log)
			storage.log.forEach(function(item, index) {console.log(item);});
		else
			storage.log = [];

		if (!storage.variables)
			storage.variables = {};

		sessionStorage.setItem(this.sessionStorageName, JSON.stringify(storage));
	}

	public log(text: string) {
		let storage = JSON.parse(sessionStorage.getItem(this.sessionStorageName));
		console.log(text);
		storage.log.push(text);
		sessionStorage.setItem(this.sessionStorageName, JSON.stringify(storage));
	}

	public writeVariable(name: string, value: string) {
		let storage = JSON.parse(sessionStorage.getItem(this.sessionStorageName));
		storage.variables[name] = value;
		sessionStorage.setItem(this.sessionStorageName, JSON.stringify(storage));
	}

	public readVariable(name: string) {
		let storage = JSON.parse(sessionStorage.getItem(this.sessionStorageName));
		return storage.variables[name];
	}
}