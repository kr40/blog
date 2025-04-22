// Main application entry point

// Import global styles
import './style.css';

// Import the main application initializer
import { initializeApp } from './src/app.js';

// --- Loading Animation Logic ---
const loadingOverlay = document.getElementById('loading-overlay');
const progressBar = document.getElementById('progress-bar');
const loaderShownKey = 'exploitLogLoaderShown';
const animationDuration = 1500; // milliseconds (1.5 seconds)
const updateInterval = 15; // ms interval for smoother animation

function runLoadingAnimation() {
	let progress = 0;
	const totalSteps = animationDuration / updateInterval;
	const increment = 100 / totalSteps;

	const intervalId = setInterval(() => {
		progress += increment;
		if (progress >= 100) {
			progress = 100;
			clearInterval(intervalId);
			// Set session storage flag
			try {
				sessionStorage.setItem(loaderShownKey, 'true');
			} catch (e) {
				console.warn('Session storage is unavailable.');
			}
			// Wait a tiny bit after 100% before fading
			setTimeout(() => {
				loadingOverlay.classList.add('hidden');
				// Remove from DOM after transition
				setTimeout(() => {
					if (loadingOverlay.parentNode) {
						loadingOverlay.parentNode.removeChild(loadingOverlay);
					}
				}, 500); // Match CSS transition duration
			}, 100);
		}
		progressBar.style.width = `${progress}%`;
	}, updateInterval);
}

// Check session storage
let loaderHasBeenShown = false;
try {
	loaderHasBeenShown = sessionStorage.getItem(loaderShownKey) === 'true';
} catch (e) {
	console.warn('Session storage is unavailable.');
}

if (!loaderHasBeenShown && loadingOverlay && progressBar) {
	// Run the animation if it hasn't been shown and elements exist
	runLoadingAnimation();
} else if (loadingOverlay) {
	// If already shown or elements missing, hide immediately and remove
	loadingOverlay.style.display = 'none'; // Hide instantly
	if (loadingOverlay.parentNode) {
		loadingOverlay.parentNode.removeChild(loadingOverlay);
	}
}
// --- End Loading Animation Logic ---


// Start the application after the loader logic (or immediately if loader skipped)
document.addEventListener('DOMContentLoaded', initializeApp);

console.log('Main entry point loaded.');
