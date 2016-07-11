/**
 * A service to hold global state and methods for the extension
 *
 * @param ChromeBindings
 * @constructor
 */
module.exports = function BackgroundService(ChromeBindings) {
  var s = this;

  s.user = {};
  // Publish the `user` object so it can be read & modified by other scripts
  ChromeBindings.publishVariable(s, 'user');

  s.login = function (user) {
    s.user = user;
    console.log('Logged in as:', s.user);
    return s.user;
  };

  s.logout = function () {
    s.user = {};
    console.log('Logged out');
  };
}