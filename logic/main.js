class Main {
	constructor(users, jobPosts) {
		this.users = users;
		this.jobPosts = jobPosts;

		this.UID = getCookie("UID");
		this.user = users[this.UID];

		const profileName = document.getElementById("profile-name");
		profileName.innerText = this.user.student.name;
        profileName.href = "/webpages/student/profile.html";
  	}

	editUserData(edits) {
		console.log(edits);
		console.log(`UID ${this.UID} has been updated`);
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
		fetch("/webpages/student/navbar.html"),
		fetch("/webpages/employer/navbar.html")
	])
	.then(async ([userData, postData, studentNav, employerNav]) => {
		const users = userData;
		const posts = postData;
		const navbarHTML = await studentNav.text();
		const navbarEHTML = await employerNav.text();

		try {
			document.getElementById("navbar").innerHTML = navbarHTML;
		}
		catch (e) {
			console.log(e);
			document.getElementById("navbar-employer").innerHTML = navbarEHTML;
		}

		window.main = new Main(users, posts);
		window.dispatchEvent(new Event("mainReady"));
	})
	.catch(e => console.error("Error loading JSON:", e));
});