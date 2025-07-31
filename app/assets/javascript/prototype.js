var copyblocks = {
  settings: {
    selector: 'prototype-copy-block',
    buttonClass: 'prototype-copy-button',
    wrapprClass: 'prototype-copy-wrapper',
    defaultText: 'Copy code',
    tempText: 'Copied'
  },
  init: function() {
    const that = this;
    const copyBlocks = document.querySelectorAll('.' + that.settings.selector);

    copyBlocks.forEach((block, index) => {
      // Create wrapper
      const wrapper = document.createElement('div');
      wrapper.classList.add(that.settings.wrapprClass);

      // Assign unique ID to the block
      const blockId = `${that.settings.selector.slice(1)}-${index}`;
      block.setAttribute('id', blockId);

      // Create copy button
      const button = document.createElement('button');
      button.classList.add(that.settings.buttonClass);
      button.setAttribute('data-target', blockId);
      button.textContent = that.settings.defaultText;

      // Insert wrapper and reparent the block and button
      block.parentNode.insertBefore(wrapper, block);
      wrapper.appendChild(block);
      wrapper.appendChild(button);
    });

    // Set up copy functionality with feedback
    document.querySelectorAll('.' + that.settings.buttonClass).forEach(button => {
      button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');
        const targetElement = document.getElementById(targetId);

        if (!targetElement) return;

        const plainText = targetElement.innerText;

        navigator.clipboard.writeText(plainText)
          .then(() => {
            const originalText = button.textContent;
            button.textContent = that.settings.tempText;
            button.disabled = true;

            setTimeout(() => {
              button.textContent = originalText;
              button.disabled = false;
            }, 1000);
          })
          .catch(err => {
            console.error('Failed to copy text: ', err);
          });
      });
    });
  }
}

var headerScroll = {
  init: function() {
    const header = document.querySelector('.app-global-navigation-native');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 0) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
};


document.addEventListener('DOMContentLoaded', () => {
  headerScroll.init();
  copyblocks.init()
});
