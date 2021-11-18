import { registerComponent } from './component.js';
import App from './app.js';

export default {
  app: (name) => {
    return new App(name);
  },
  component: registerComponent,
};
