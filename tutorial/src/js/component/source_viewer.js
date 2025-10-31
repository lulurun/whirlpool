// Source file configuration for each tutorial step
const STEP_FILES = {
  'step1': [
    {
      path: 'tutorial/src/js/component/step1/index.js',
      label: 'step1/index.js (Component)',
      type: 'javascript'
    },
    {
      path: 'tutorial/src/js/template/step1/index.html',
      label: 'step1/index.html (Template)',
      type: 'html'
    },
    {
      path: 'tutorial/src/js/component/step1/component1.js',
      label: 'step1/component1.js (Component)',
      type: 'javascript'
    },
    {
      path: 'tutorial/src/js/template/step1/component1.html',
      label: 'step1/component1.html (Template)',
      type: 'html'
    },
    {
      path: 'tutorial/src/js/component/step1/component2.js',
      label: 'step1/component2.js (Component)',
      type: 'javascript'
    },
    {
      path: 'tutorial/src/js/template/step1/component2.html',
      label: 'step1/component2.html (Template)',
      type: 'html'
    },
    {
      path: 'tutorial/src/js/component/step1/component3.js',
      label: 'step1/component3.js (Component)',
      type: 'javascript'
    },
    {
      path: 'tutorial/src/js/template/step1/component3.html',
      label: 'step1/component3.html (Template)',
      type: 'html'
    }
  ],
  'step2': [
    {
      path: 'tutorial/src/js/component/step2/index.js',
      label: 'step2/index.js (Component)',
      type: 'javascript'
    },
    {
      path: 'tutorial/src/js/template/step2/index.html',
      label: 'step2/index.html (Template)',
      type: 'html'
    },
    {
      path: 'tutorial/src/js/component/step2/counter.js',
      label: 'step2/counter.js (Component)',
      type: 'javascript'
    },
    {
      path: 'tutorial/src/js/template/step2/counter.html',
      label: 'step2/counter.html (Template)',
      type: 'html'
    }
  ],
  'step3': [
    {
      path: 'tutorial/src/js/component/step3/index.js',
      label: 'step3/index.js (Component)',
      type: 'javascript'
    },
    {
      path: 'tutorial/src/js/template/step3/index.html',
      label: 'step3/index.html (Template)',
      type: 'html'
    },
    {
      path: 'tutorial/src/js/component/step3/button_emitter.js',
      label: 'step3/button_emitter.js (Component)',
      type: 'javascript'
    },
    {
      path: 'tutorial/src/js/template/step3/button_emitter.html',
      label: 'step3/button_emitter.html (Template)',
      type: 'html'
    },
    {
      path: 'tutorial/src/js/component/step3/message_display.js',
      label: 'step3/message_display.js (Component)',
      type: 'javascript'
    },
    {
      path: 'tutorial/src/js/template/step3/message_display.html',
      label: 'step3/message_display.html (Template)',
      type: 'html'
    },
    {
      path: 'tutorial/src/js/component/step3/event_counter.js',
      label: 'step3/event_counter.js (Component)',
      type: 'javascript'
    },
    {
      path: 'tutorial/src/js/template/step3/event_counter.html',
      label: 'step3/event_counter.html (Template)',
      type: 'html'
    }
  ],
  'step4': [
    {
      path: 'tutorial/src/js/component/step4/index.js',
      label: 'step4/index.js (Component)',
      type: 'javascript'
    },
    {
      path: 'tutorial/src/js/template/step4/index.html',
      label: 'step4/index.html (Template)',
      type: 'html'
    },
    {
      path: 'tutorial/src/js/component/step4/item_form.js',
      label: 'step4/item_form.js (Component)',
      type: 'javascript'
    },
    {
      path: 'tutorial/src/js/template/step4/item_form.html',
      label: 'step4/item_form.html (Template)',
      type: 'html'
    },
    {
      path: 'tutorial/src/js/component/step4/item_list.js',
      label: 'step4/item_list.js (Component)',
      type: 'javascript'
    },
    {
      path: 'tutorial/src/js/template/step4/item_list.html',
      label: 'step4/item_list.html (Template)',
      type: 'html'
    },
    {
      path: 'tutorial/src/js/component/step4/item_counter.js',
      label: 'step4/item_counter.js (Component)',
      type: 'javascript'
    },
    {
      path: 'tutorial/src/js/template/step4/item_counter.html',
      label: 'step4/item_counter.html (Template)',
      type: 'html'
    }
  ]
};

W.component('source_viewer', {
  getData: function(cb) {
    const step = this.props.step;
    const files = STEP_FILES[step] || [];

    cb({
      step: step,
      files: files,
      loadedFiles: [],
      currentFileIndex: 0,
      loading: true
    });
  },

  rendered: function(cb) {
    const self = this;
    const baseUrl = 'https://lulurun.github.io/whirlpool/';

    // Fetch all source files
    const files = this.data.files;
    const promises = files.map(file => {
      return fetch(baseUrl + file.path)
        .then(response => response.text())
        .then(content => ({
          ...file,
          content: content
        }))
        .catch(error => ({
          ...file,
          content: '// Error loading file: ' + error.message
        }));
    });

    Promise.all(promises).then(loadedFiles => {
      self.update({
        loadedFiles: loadedFiles,
        loading: false,
        currentFileIndex: 0
      });
    });

    cb();
  },

  actions: {
    selectFile: function(index) {
      this.update({
        currentFileIndex: parseInt(index)
      });
    }
  }
});
