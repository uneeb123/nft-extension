const createId = require('hat')
const uiUtils = require('metamask-ui/app/util')
var notificationHandlers = {}

module.exports = createTxNotification


// notification button press
chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex){
  var handlers = notificationHandlers[notificationId]
  if (buttonIndex === 0) {
    handlers.confirm()
  } else {
    handlers.cancel()
  }
  chrome.notifications.clear(notificationId)
})

// notification teardown
chrome.notifications.onClosed.addListener(function(notificationId){
  delete notificationHandlers[notificationId]
})

// creation helper
function createTxNotification(opts){
  var message = [
    'to: '+uiUtils.addressSummary(opts.txParams.to),
    'from: '+uiUtils.addressSummary(opts.txParams.from),
    'value: '+uiUtils.formatBalance(opts.txParams.value),
    'data: '+uiUtils.dataSize(opts.txParams.data),
  ].join('\n')

  var id = createId()
  chrome.notifications.create(id, {
    type: 'basic',
    iconUrl: '/images/icon-128.png',
    title: opts.title,
    message: message,
    buttons: [{
      title: 'confirm',
    },{
      title: 'cancel',
    }]
  })
  notificationHandlers[id] = {
    confirm: opts.confirm,
    cancel: opts.cancel,
  }
}