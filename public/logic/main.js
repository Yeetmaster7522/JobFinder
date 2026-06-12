class Main {
	#uid

	constructor() {
		this.#uid = getCookie("UID");
  	}

	async init() {
		if (this.#uid === "") {
			window.navbarManager.applyNavbar();
		}
		else {
			const user = await this.getUser()
			const role = user.role;

			window.navbarManager.applyNavbar(role);
			if (role == "employer") {
				window.navbarManager.setProfileName(
					user.email, 
					"/webpages/employer/profile.html"
				);
			}
			else {
				window.navbarManager.setProfileName(
					user.student.name, 
					"/webpages/student/profile.html"
				);
			}
		}
	}

	async getUser() {
		let users = await wsRequest("userAccounts");
		users = JSON.parse(users);
		return users[this.#uid];
	}
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function randomChar() {
    const chars = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890";
    return chars[getRndInteger(0, chars.length)];
}

function getCookie(cname) {
  	// https://www.w3schools.com/js/js_cookies.asp
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function setCookie(cname, cvalue, exdays) {
	const d = new Date();
  	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	let expires = "";
	if (exdays === -1) {
		expires = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
	}
	else {
		expires = "expires="+ d.toUTCString();
	}
  	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function appendLI(parent, childText) {
	const li = document.createElement("li");
	li.textContent = childText;
	li.classList.add("list-group-item", "bg-transparent", "text-light");
	parent.appendChild(li);
}

function insideTimestamp(t1, t2) {
	const start = toMin(t1[0]);
	const end = toMin(t1[1]);
	let inside = true;

	if (start < toMin(t2.start) || start > this.toMin(t2.end)) {
		inside = false;
	}
	if (end > toMin(t2.end)) {
		inside = false;
	}

	return inside;
}

function toMin(time) {
	const [hr, min] = time.split(":").map(Number);
	return hr*60 + min;
}

function enableBtn(btn) {
	btn.classList.add("active");
	btn.setAttribute("aria-pressed", "true");
}

function getParam(param) {
	const params = new URLSearchParams(window.location.search);
	return params.get(param);
}

function setNestedValue(obj, path, value) {
    const keys = path.split(".");
    const newObj = structuredClone(obj);   // deep copy
    let current = newObj;

    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];

        if (!current[key] || typeof current[key] !== "object") {
            current[key] = {};
        }

        current = current[key];
    }

    current[keys[keys.length - 1]] = value;
    return newObj;
}



const ws = new WebSocket("ws://localhost:8080");
const pending = {}
let nextId = 1;

function wsRequest(req) {
	return new Promise(resolve => {
		const id = nextId++;
		pending[id] = resolve;

		ws.send(JSON.stringify( {"id": id, "request": req} ));
	});
}

ws.onopen = () => {
	console.log("Connected");

	window.main = new Main();
	window.main.init().then(() => {
		window.dispatchEvent(new Event("mainReady"));
	})
};

ws.onmessage = (msg) => {
	msg = JSON.parse(msg.data);

	if (msg.id && pending[msg.id]) {
		pending[msg.id](msg.data);
		delete pending[msg.id];
	}
}

ws.onerror = (err) => {
	console.log(err.message);
}

ws.onclose = () => {
	console.log("Disconnected from server");
}

window.addEventListener("DOMContentLoaded", () => {
	Promise.all([
		fetch("/webpages/student/navbar.html").then(r => r.text()),
		fetch("/webpages/employer/navbar.html").then(r => r.text())
	])
	.then(async ([studentHTML, employerHTML]) => {
		window.navbarManager = new Navbar();
		window.navbarManager.setHTML(studentHTML, employerHTML);
	})
	.catch(e => console.error("Error loading JSON:", e));
});