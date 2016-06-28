chrome.app.runtime.onLaunched.addListener ->
  winOptions = 
    state: 'maximized'
    bounds:
      width: screen.availWidth
      height: screen.availHeight
    frame: type: 'chrome'
  chrome.app.window.create 'views/index.html', winOptions
  return

loadJsonFile = (file) ->
  xhr = new XMLHttpRequest
  xhr.open 'GET', chrome.runtime.getURL(file), true

  xhr.onreadystatechange = ->
    if xhr.readyState == 4
      resp = JSON.parse(xhr.responseText)
      chrome.storage.local.set resp
    return

  xhr.send()
  return

loadFile = (file) ->
  xhr = undefined
  xhr = new XMLHttpRequest
  xhr.open 'GET', chrome.runtime.getURL(file), true

  xhr.onreadystatechange = ->
    if xhr.readyState == 4
      JSON.parse xhr.responseText
    else
      null 
    return

  xhr.send()
  return

loadJsonUrl = (url) ->
  xhr = undefined
  xhr = new XMLHttpRequest
  xhr.open 'GET', url, true

  xhr.onreadystatechange = ->
    if xhr.readyState == 4
      JSON.parse xhr.responseText
    else
      null 
    return

  xhr.send()
  return

#loadJsonFile('config/app.json')

syncServer = () ->
  data = undefined
  response = undefined
  url = undefined

  chrome.storage.local.get 'device', (data) ->
    url = data.device.server + '/?device=' + data.device.id
   
    xhr = new XMLHttpRequest
    xhr.open 'GET', url, true

    xhr.onreadystatechange = ->
      if xhr.readyState == 4
        resp = JSON.parse(xhr.responseText)
        chrome.storage.local.set resp
        console.log resp
      return

    xhr.send()
    return

syncServer()
