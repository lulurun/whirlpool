// Import Whirlpool framework
import W from '../../dist/whirlpool.js';

// Import styles
import '../css/styles.css';

// Import all components
import './components/app.js';
import './components/data_table.js';
import './components/search_box.js';
import './components/pagination.js';

// Make W available globally
window.W = W;

// Initialize the application when DOM is ready
$(document).ready(() => {
    console.log('Whirlpool App starting...');

    // Start the main app
    const app = W.app('main-app', () => {
        // Main app template getter - can be customized
        return () => '<div data-component="app"></div>';
    });

    // Mount the app to body
    app.mount(document.body);

    console.log('Whirlpool App started successfully!');
});