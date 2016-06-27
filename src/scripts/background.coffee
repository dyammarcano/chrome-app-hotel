chrome.app.runtime.onLaunched.addListener ->
  winOptions = 
    state: 'maximized'
    bounds:
      width: screen.availWidth
      height: screen.availHeight
    frame: type: 'chrome'
  chrome.app.window.create 'views/index.html', winOptions
  return
chrome.storage.sync.get 'device', (device) ->
  xhr = new XMLHttpRequest
  xhr.open 'GET', 'http://api.node05.comxa.com/?device=' + device, true

  xhr.onreadystatechange = ->
    if xhr.readyState == 4
      resp = JSON.parse(xhr.responseText)
      console.log resp
      chrome.storage.sync.set 'client': resp
    return

  xhr.send()
  return
