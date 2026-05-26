class Main {
	constructor(users, jobPosts, articles) {
		this.users = users;
		this.jobPosts = jobPosts;
		this.articles = articles;
		this.UID = getCookie("UID");

		const profileName = document.getElementById("profile-name");
		if (this.UID === "") {
			profileName.innerText = "guest";
		}
		else {
			const user = this.getUser()
			if (user.role == "employer") {
				profileName.innerText = user.email;	
			}
			else {
				profileName.innerText = user.student.name;
        		profileName.href = "/webpages/student/profile.html";
			}
		}
  	}

	getUser() {
		return this.users[this.UID];
	}

	editUserData(edits) {
		console.log(edits);
		console.log(`UID ${this.UID} has been updated`);
	}

	genUID() {
		let UID = "";
		for (let i=0; i<8; i++) {
			UID += randomChar();
		}

		return UID;
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
	let li = document.createElement("li");
	li.textContent = childText;
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

window.addEventListener("DOMContentLoaded", () => {
	Promise.all([
		fetch("/database/userAccounts.json").then(r => r.json()),
		fetch("/database/data-mR36NBv3VwjMRsFCY26z5.json").then(r => r.json()),
		fetch("/database/articles.json").then(r => r.json()),
		fetch("/webpages/student/navbar.html"),
		fetch("/webpages/employer/navbar.html")
	])
	.then(async ([userData, postData, articles, studentNav, employerNav]) => {
		const navbarHTML = await studentNav.text();
		const navbarEHTML = await employerNav.text();

		document.getElementById("navbar").innerHTML = navbarHTML;

		window.main = new Main(userData, postData, articles);
		window.dispatchEvent(new Event("mainReady"));
	})
	.catch(e => console.error("Error loading JSON:", e));
});