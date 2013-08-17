
/**
 * Emulate browserify envirement
 */

if (!window.process) window.process = {};
if (!process.browser) process.browser = true;
if (!process.nextTick) process.nextTick = require('next-tick');
