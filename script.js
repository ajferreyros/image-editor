const fileInput = document.querySelector("#imageFileInput");
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const saturationInput = document.querySelector("#saturation");
const brightnessInput = document.querySelector("#brightness");
const settings = {};
let image = null;

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