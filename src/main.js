import { fork, call } from 'redux-saga/effects'

import SagaObservable from 'saga-observable'

/*
  Our Observer will be called and create the observable.  An observable
  is create a cancellable promise then creating a queue of responses when
  the callback is received.  This allows us to stay within the saga pattern
  while handling "push" style events as well as allows us to cancel the
  promises if we need to (in the situation that our task or process are cancelled).
*/
export default function* eventObserver(
  uid,
  [ event, options = false ],
  {
    onEvent,
    onError,
    onCancel,
  },
  ...passThroughArgs
) {
  const observer = new SagaObservable({ name: uid || event })

  const listener = [ event, observer.publish, options ]

  const observerID = window.addEventListener(...listener)
  
  const removeListener = () => window.removeEventListener(...listener)

  try {
    while (true) {
      const args = yield call([ observer, observer.next ])
      if ( Array.isArray(onEvent) ) {
        yield fork(onEvent, event, args[0], uid, ...passThroughArgs)
      } else {
        yield fork([ this, onEvent ], event, args[0], uid, ...passThroughArgs)
      }
    }
  } catch(error) {
    if (onError) {
      if ( Array.isArray(onError) ) {
        yield call(onError, event, error, uid, ...passThroughArgs)
      } else {
        yield call([ this, onError ], event, error, uid, ...passThroughArgs)
      }
    }
  } finally {
    removeListener()
    if ( yield observer.cancelled() && onCancel ) {
      if ( Array.isArray(onCancel) ) {
        yield call(onCancel, event, uid, ...passThroughArgs)
      } else {
        yield call([ this, onCancel ], event, uid, ...passThroughArgs)
      }
    }
  }
  
}