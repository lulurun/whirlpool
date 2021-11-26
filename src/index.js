import { registerComponent } from './component.js';
import { registerSwitch } from './switch.js';
import App from './app.js';

export default {
  app: (name, getTemplate) => {
    return new App(name, getTemplate);
  },
  component: registerComponent,
  switch: registerSwitch,
};
