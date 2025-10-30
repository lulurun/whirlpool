W.component('tutorial_nav', {
  init: function() {
    this.steps = [
      { id: 'step1', title: 'Step 1: Component Loading', description: 'Learn how components load and render' },
      { id: 'step2', title: 'Step 2: Counter', description: 'Manage internal state and interactions' },
      { id: 'step3', title: 'Step 3: Event Communication', description: 'Use app.ev for component communication' },
      { id: 'step4', title: 'Step 4: Shared Data', description: 'Use app.data for centralized state' }
    ];

    // Listen to navigation changes to update active step
    this.app.nav.on(() => {
      this.load();
    }, this);
  },

  getData: function(cb) {
    // Get current hash to determine active step
    const hash = location.hash.replace('#', '') || 'step1';

    const steps = this.steps.map(step => ({
      ...step,
      isActive: step.id === hash
    }));

    cb({ steps: steps });
  },

  rendered: function(cb) {
    const $container = $(this.el);

    // Handle step navigation clicks
    $container.find('.step-link').on('click', (ev) => {
      ev.preventDefault();
      const stepId = $(ev.currentTarget).data('step-id');
      location.hash = stepId;
    });

    cb();
  }
});
