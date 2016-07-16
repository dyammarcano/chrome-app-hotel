var _ = require('lodash');
require('angular');
require('moment');
require('angular-moment');
require('angular-jwt');
require('angular-chrome-messaging');
BackgroundService = require('./app/background/services/BackgroundService');

angular.module('backgroundApp', ['ChromeMessaging', 'angularMoment', 'angular-jwt']);


angular.module('backgroundApp').config(['ChromeMessagingProvider', function(ChromeMessagingProvider) {
    ChromeMessagingProvider.moduleName = 'ChromeMessaging';
}]);


angular.module('backgroundApp').run(function(ChromeMessaging, BackgroundService, amMoment) {
    amMoment.changeLocale('es');
    ChromeMessaging.publish('login', BackgroundService.login);
    ChromeMessaging.publish('logout', BackgroundService.logout);
});


angular.module('backgroundApp').service('BackgroundService', BackgroundService);


angular.module('backgroundApp').controller('backgroundController', ['jwtHelper', function(jwtHelper) {

}]);


/**
 * @see https://developer.chrome.com/apps/app_runtime
 * @see https://developer.chrome.com/apps/app_window
 */
chrome.app.runtime.onLaunched.addListener(function(launchData) {
    chrome.app.window.create('../views/index.html', {
        state: 'maximized',
        bounds: {
            width: screen.availWidth,
            height: screen.availHeight
        },
        frame: {
            type: 'chrome'
        }
    });
});


/**
 * @see https://developer.chrome.com/extensions/messaging
 */
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {

    var message = {
        event: 'system loading'
    }

    chrome.runtime.sendMessage(message, function(response) {
        console.log(response.farewell);
    });
});

/**
 * @see https://developer.chrome.com/apps/storage
 */
chrome.storage.onChanged.addListener(function(changes, namespace) {

});

//chrome.app.window.onMinimized.addListener(function callback);
//chrome.app.window.onMaximized.addListener(function callback);
//chrome.app.window.onRestored.addListener(function callback);

chrome.app.window.onClosed.addListener(function() {
    chrome.storage.local.clear();
    console.log('windows closed');
});

var loadJsonFile = function(file) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', chrome.runtime.getURL(file), true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            chrome.storage.local.set(JSON.parse(xhr.responseText));
        }
    };
    xhr.send();
};

var syncServer = function() {
    chrome.storage.local.get('device', function(data) {
        var url = data.device.server + '/?device=' + data.device.id;
        //console.log(url);
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                var resp = JSON.parse(xhr.responseText);

                if (resp.device !== 'error') {
                    chrome.storage.local.set(resp);
                    console.log(resp.remote);
                }
            }
        };
        xhr.send();
    });
};

var syncServer2 = function() {
    chrome.storage.local.get('remote', function(rdata) {
        var data = rdata.remote;
        var url = 'http://' + data.local_ip + '/api/status';
        //console.log(data);
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                var resp = JSON.parse(xhr.responseText);

                if (resp.status.online !== undefined) {
                    if (resp.status.online) {
                        chrome.storage.local.set(resp);
                        console.log(resp.status);
                    }
                }
            }
        };
        xhr.send();
    });
};

loadJsonFile('config/app.json');

/*setInterval(function() {
  syncServer();
}, 1800000);

setInterval(function() {
  syncServer2();
}, 60000);*/