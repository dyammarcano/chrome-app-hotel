

module.exports = function OptionsController(ChromeBindings, ChromeMessaging) {
  // Bind `ChromeMessagingExample.user` to `OptionsController.user`
  this.user = {};
  ChromeBindings.bindVariable('ChromeMessagingExample', 'user').to(this, 'user');

  var vm = this;

  vm.inputEmail = '';
  vm.inputName = '';

  vm.login = function () {
    ChromeMessaging.callMethod('ChromeMessagingExample', 'login', {
      email: vm.inputEmail,
      name: vm.inputName
    }).then(function (user) {
      console.log('Logged in as:', user);
    });
  };
}