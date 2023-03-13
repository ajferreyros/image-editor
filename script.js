const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-toggle-icon");
const editor = document.querySelector("div.editor");
const fileInput = document.querySelector("#imageFileInput");
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const saturationInput = document.querySelector("#saturation");
const brightnessInput = document.querySelector("#brightness");
const settings = {};
let image = null;

window.addEventListener("load", function () {
	const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)")
		.matches;
	if (prefersDarkMode) {
		editor.setAttribute("data-color-mode", "dark");
		themeIcon
			.querySelector("path")
			.setAttribute(
				"d",
				"M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
			);
	} else {
		editor.setAttribute("data-color-mode", "light");
		themeIcon
			.querySelector("path")
			.setAttribute(
				"d",
				"M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
			);
	}
});

themeToggleBtn.addEventListener("click", function () {
	if (editor.getAttribute("data-color-mode") === "dark") {
		editor.setAttribute("data-color-mode", "light");
		themeIcon
			.querySelector("path")
			.setAttribute(
				"d",
				"M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
			);
	} else {
		editor.setAttribute("data-color-mode", "dark");
		themeIcon
			.querySelector("path")
			.setAttribute(
				"d",
				"M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
			);
	}
});

function resetSettings() {
	settings.saturation = "100";
	settings.brightness = "100";
	saturationInput.value = settings.saturation;
	brightnessInput.value = settings.brightness;
}

function updateSetting(key, value) {
	if (!image) return;
	settings[key] = value;
	renderImage();
}

function generateFilter() {
	const { saturation, brightness } = settings;
	return `saturate(${saturation}%) brightness(${brightness}%)`;
}

function renderImage() {
	canvas.width = image.width;
	canvas.height = image.height;
	ctx.filter = generateFilter();
	ctx.drawImage(image, 0, 0);
}

saturationInput.addEventListener("click", () => updateSetting("saturation", 0));

brightnessInput.addEventListener("change", () =>
	updateSetting("brightness", brightnessInput.value)
);

fileInput.addEventListener("change", () => {
	image = new Image();
	const file = fileInput.files[0];
	if (!file.type.startsWith("image/")) {
		alert("Please select an image file");
		fileInput.value = "";
		renderImage();
		return;
	}
	image.addEventListener("load", () => {
		resetSettings();
		renderImage();
	});
	image.src = URL.createObjectURL(file);
});

resetSettings();

document.getElementById("download").addEventListener("click", function (e) {
	let canvasURL = canvas.toDataURL(fileInput.files[0].type, 1.0);
	const createIMG = document.createElement("a");
	createIMG.href = canvasURL;
	createIMG.download = fileInput.files[0].name;
	createIMG.click();
	createIMG.remove();
});
