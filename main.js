import { initializeApp } from './src/app.js';

// Import Highlight.js theme first
import 'highlight.js/styles/atom-one-dark.css';

// Import CSS files in order
import './src/styles/base.css';
import './src/styles/code.css';
import './src/styles/footer.css';
import './src/styles/header.css';
import './src/styles/layout.css';
import './src/styles/loader.css';
import './src/styles/pagination.css';
import './src/styles/post.css';
import './src/styles/responsive.css';
import './src/styles/sidebar.css';
import './src/styles/widgets.css';

const loadingOverlay = document.getElementById('loading-overlay');
const progressBar = document.getElementById('progress-bar');
const loaderShownKey = 'exploitLogLoaderShown';
const animationDuration = 1500;
const updateInterval = 15;

function runLoadingAnimation() {
	let progress = 0;
	const totalSteps = animationDuration / updateInterval;
	const increment = 100 / totalSteps;

	const intervalId = setInterval(() => {
		progress += increment;
		if (progress >= 100) {
			progress = 100;
			clearInterval(intervalId);

			try {
				sessionStorage.setItem(loaderShownKey, 'true');
			} catch (e) {
				console.warn('Session storage is unavailable.');
			}

			setTimeout(() => {
				loadingOverlay.classList.add('hidden');

				setTimeout(() => {
					if (loadingOverlay.parentNode) {
						loadingOverlay.parentNode.removeChild(loadingOverlay);
					}
				}, 500);
			}, 100);
		}
		progressBar.style.width = `${progress}%`;
	}, updateInterval);
}

let loaderHasBeenShown = false;
try {
	loaderHasBeenShown = sessionStorage.getItem(loaderShownKey) === 'true';
} catch (e) {
	console.warn('Session storage is unavailable.');
}

if (!loaderHasBeenShown && loadingOverlay && progressBar) {
	runLoadingAnimation();
} else if (loadingOverlay) {
	loadingOverlay.style.display = 'none';
	if (loadingOverlay.parentNode) {
		loadingOverlay.parentNode.removeChild(loadingOverlay);
	}
}

document.addEventListener('DOMContentLoaded', initializeApp);
