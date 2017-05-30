# saga-event-observer

Uses [saga-observable](https://www.npmjs.com/package/saga-observable) to provide a
simple way to create window event listeners from sagas.


### Installation

```
yarn add saga-event-observer
```

**or**

```
npm install --save saga-event-observer
```

### Simple Example

```js
import { put, fork } = 'redux-saga/effects'
import eventObserver from 'saga-event-observer'

function* mySaga(foo, bar, ctx) {

  const task = yield fork(
    eventObserverSaga,
    'device-orientation-observer', // uid
    [ 'orientationchange' , { passive: true } ], // event args
    {
      onEvent:  handleEvent,
      onError:  handleError,
      // optionally use [ context, fn ] for binding context.
      onCancel: [ ctx, handleCancellation ] 
    }, // optional lifecycle events, called as saga if possible.
    /* pass through args are sent to the handlers */
    foo, bar
  )
  
}

function* handleEvent(event, value, uid, ...passThroughArgs) {
  yield put({
    type: 'WINDOW_EVENT',
    event, // 'orientationchange'
    value, // Event
    uid, // 'device-orientation-observer'
    passThroughArgs, // [ foo, bar ]
  })
}

function* handleError(event, error, uid, ...passThroughArgs) {
  /* ... handle error ... */
}

function* handleCancellation(event, uid, ...passThroughArgs) {
  /* ... handle cancellation ... */
}
```