class Main {
	constructor() {
		const UID = getCookie("UID");
		this.setPN(users[UID].student.name);
        const profileName = document.getElementById("profile-name");
        profileName.href = "profile.html";
  	}
  	
	setPN(name) {
		const profileName = document.getElementById("profile-name");
		profileName.innerText = name;
	}
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

function editUserData(edits) {
	console.log("editing...");
	console.log(edits);
}

var users;

// fetch database
fetch("database/userAccounts.json")
	.then(response => response.json())
  	.then(data => {
		users = data;

        return fetch("navbar.html"); // fetch navbar
  	}) 
    .then(res => res.text())
    .then(html => {
        document.getElementById("navbar").innerHTML = html;
		window.dispatchEvent(new Event("mainReady"));
        const main = new Main();
    })
  	.catch(err => console.error("Error loading JSON:", err));