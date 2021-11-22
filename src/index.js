import { registerComponent } from './component.js';
import App from './app.js';

export default {
  app: (name, getTemplate) => {
    return new App(name, getTemplate);
  },
  component: registerComponent,
};
