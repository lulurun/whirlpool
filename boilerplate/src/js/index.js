// Import Whirlpool framework
import W from '../../dist/whirlpool.js';

// Import styles
import '../css/styles.css';

// Import all components
import './component/main_app.js';
import './component/sample_button.js';

// Make W available globally
window.W = W;

// Initialize application
$(document).ready(() => {
    console.log('Whirlpool app starting...');

    // Start the app - Whirlpool will automatically find and initialize components
    const app = W.app('starter-app', () => {
        return () => '<div data-component="main-app"></div>';
    });

    app.mount(document.body);
});