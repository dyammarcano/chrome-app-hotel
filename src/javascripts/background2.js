chrome.app.runtime.onLaunched.addListener(function(launchData) {

    chrome.app.window.create('views/index.html', {
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