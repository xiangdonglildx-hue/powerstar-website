import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const websiteRoot = '/Users/huxinghua/.openclaw/workspace-seo/powerstar-website';
const mobileNavScript = `${websiteRoot}/js/mobile-nav.js`;
const animationsScript = `${websiteRoot}/js/animations.js`;
const gsapAnimationsScript = `${websiteRoot}/js/gsap-animations.js`;

class FakeClassList {
  constructor() {
    this.values = new Set();
  }

  add(...tokens) {
    tokens.forEach((token) => {
      if (token) this.values.add(token);
    });
  }

  remove(...tokens) {
    tokens.forEach((token) => this.values.delete(token));
  }

  contains(token) {
    return this.values.has(token);
  }

  toString() {
    return [...this.values].join(' ');
  }
}

class FakeElement {
  constructor(tagName = 'div') {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.listeners = {};
    this.attributes = new Map();
    this.style = {};
    this.classList = new FakeClassList();
    this.textContent = '';
  }

  set className(value) {
    this.classList = new FakeClassList();
    String(value)
      .split(/\s+/)
      .filter(Boolean)
      .forEach((token) => this.classList.add(token));
    this.attributes.set('class', this.classList.toString());
  }

  get className() {
    return this.classList.toString();
  }

  setAttribute(name, value) {
    const stringValue = String(value);
    if (name === 'class') {
      this.className = stringValue;
      return;
    }

    this.attributes.set(name, stringValue);
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  addEventListener(type, listener) {
    this.listeners[type] ??= [];
    this.listeners[type].push(listener);
  }

  dispatchEvent(event) {
    for (const listener of this.listeners[event.type] ?? []) {
      listener(event);
    }
  }

  click() {
    this.dispatchEvent({
      type: 'click',
      preventDefault() {},
    });
  }

  cloneNode(deep = false) {
    const clone = new FakeElement(this.tagName.toLowerCase());
    clone.className = this.className;
    clone.textContent = this.textContent;

    for (const [name, value] of this.attributes.entries()) {
      if (name !== 'class') {
        clone.setAttribute(name, value);
      }
    }

    clone.style = {...this.style};

    if (deep) {
      this.children.forEach((child) => clone.appendChild(child.cloneNode(true)));
    }

    return clone;
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] ?? null;
  }

  querySelectorAll(selector) {
    const results = [];
    const parts = selector.trim().split(/\s+/);

    const visit = (node) => {
      for (const child of node.children) {
        if (matchesSelectorChain(child, parts)) {
          results.push(child);
        }
        visit(child);
      }
    };

    visit(this);
    return results;
  }
}

class FakeDocument {
  constructor() {
    this.body = new FakeElement('body');
    this.listeners = {};
  }

  addEventListener(type, listener) {
    this.listeners[type] ??= [];
    this.listeners[type].push(listener);
  }

  fire(type, event = {}) {
    for (const listener of this.listeners[type] ?? []) {
      listener({type, ...event});
    }
  }

  createElement(tagName) {
    return new FakeElement(tagName);
  }

  querySelector(selector) {
    return this.body.querySelector(selector);
  }

  querySelectorAll(selector) {
    return this.body.querySelectorAll(selector);
  }
}

function matchesSelectorChain(element, parts) {
  let current = element;

  for (let index = parts.length - 1; index >= 0; index -= 1) {
    const part = parts[index];
    if (!current || !matchesSimpleSelector(current, part)) {
      return false;
    }

    if (index > 0) {
      current = current.parentNode;
      while (current && !matchesSimpleSelector(current, parts[index - 1])) {
        current = current.parentNode;
      }
      index -= 1;
    }
  }

  return true;
}

function matchesSimpleSelector(element, selector) {
  if (selector.startsWith('.')) {
    return element.classList.contains(selector.slice(1));
  }

  return element.tagName.toLowerCase() === selector.toLowerCase();
}

function appendNavLink(list, href, text) {
  const item = new FakeElement('li');
  const link = new FakeElement('a');
  link.setAttribute('href', href);
  link.textContent = text;
  item.appendChild(link);
  list.appendChild(item);
}

function loadBrowserScript(scriptPath, globals) {
  const source = fs.readFileSync(scriptPath, 'utf8');
  const context = vm.createContext(globals);
  vm.runInContext(source, context, {filename: scriptPath});
}

test('mobile-nav initializes a fallback mobile menu when hamburger exists without a mobile-menu container', () => {
  const document = new FakeDocument();
  const hamburger = document.createElement('button');
  hamburger.className = 'hamburger';

  const navLinks = document.createElement('ul');
  navLinks.className = 'nav-links';
  appendNavLink(navLinks, '../products/ai-photo.html', 'AI Photo');
  appendNavLink(navLinks, '../blog.html', 'Blog');

  const overlay = document.createElement('div');
  overlay.className = 'mobile-menu-overlay';

  document.body.appendChild(hamburger);
  document.body.appendChild(navLinks);
  document.body.appendChild(overlay);

  loadBrowserScript(mobileNavScript, {
    document,
    window: {document},
    console: {log() {}, warn() {}},
  });

  document.fire('DOMContentLoaded');

  const mobileMenu = document.querySelector('.mobile-menu');
  assert.ok(mobileMenu, 'expected a fallback .mobile-menu to be created');
  assert.equal(mobileMenu.querySelectorAll('a').length, 2);

  hamburger.click();

  assert.equal(hamburger.getAttribute('aria-expanded'), 'true');
  assert.equal(mobileMenu.getAttribute('aria-hidden'), 'false');
  assert.equal(document.body.style.overflow, 'hidden');
  assert.ok(hamburger.classList.contains('active'));
  assert.ok(mobileMenu.classList.contains('active'));
});

test('animations falls back to minimal visibility setup when ScrollTrigger is unavailable', () => {
  const document = new FakeDocument();
  const element = document.createElement('section');
  element.className = 'content-section';
  document.body.appendChild(element);

  let setCalls = 0;
  let registeredPlugin = null;

  const gsap = {
    registerPlugin(plugin) {
      registeredPlugin = plugin;
    },
    utils: {
      toArray() {
        return [element];
      },
    },
    set(targets, props) {
      setCalls += 1;
      targets.forEach((target) => {
        Object.assign(target.style, props);
      });
    },
    to() {},
    from() {},
    fromTo() {},
  };

  loadBrowserScript(animationsScript, {
    document,
    window: {
      matchMedia() {
        return {matches: false};
      },
    },
    gsap,
    console: {log() {}},
  });

  assert.doesNotThrow(() => {
    document.fire('DOMContentLoaded');
  });

  assert.equal(registeredPlugin, null, 'expected no ScrollTrigger registration when plugin is unavailable');
  assert.equal(setCalls, 1, 'expected minimal visibility fallback to run');
  assert.equal(element.style.opacity, 1);
});

test('gsap-animations falls back to minimal visibility setup when ScrollTrigger is unavailable', () => {
  const document = new FakeDocument();
  const element = document.createElement('section');
  element.className = 'product-card';
  document.body.appendChild(element);

  let setCalls = 0;
  let registeredPlugin = null;

  const gsap = {
    registerPlugin(plugin) {
      registeredPlugin = plugin;
    },
    utils: {
      toArray() {
        return [element];
      },
    },
    set(targets, props) {
      setCalls += 1;
      targets.forEach((target) => {
        Object.assign(target.style, props);
      });
    },
    to() {},
    from() {},
    timeline() {
      return {
        from() {
          return this;
        },
      };
    },
  };

  loadBrowserScript(gsapAnimationsScript, {
    document,
    window: {
      matchMedia() {
        return {matches: false};
      },
      addEventListener() {},
    },
    gsap,
    console: {log() {}, warn() {}},
    setTimeout,
    clearTimeout,
  });

  assert.doesNotThrow(() => {
    document.fire('DOMContentLoaded');
  });

  assert.equal(registeredPlugin, null, 'expected no ScrollTrigger registration when plugin is unavailable');
  assert.equal(setCalls, 1, 'expected minimal visibility fallback to run');
  assert.equal(element.style.opacity, 1);
});
