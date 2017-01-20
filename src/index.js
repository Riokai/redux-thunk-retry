function done(timer) {
  return () => {
    clearInterval(timer);
  };
}

function argIndexOf(f, arg) {
  const s = f + '';
  return s.substring(s.indexOf('(') + 1, s.indexOf(')'))
    .replace(/\s+/g, '').split(',').indexOf(arg);
}

function createThunkMiddleware({ extraArgument, timeout = 5000, maxRetry } = {}) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      if (argIndexOf(action, 'done') === 2) {
        let runCount = 1;
        const timer = setInterval(() => {
          runCount += 1;
          action(dispatch, getState, done(timer), extraArgument);

          if (maxRetry && runCount >= maxRetry) {
            done(timer)();
          }
        }, timeout);

        return action(dispatch, getState, done(timer), extraArgument);
      }

      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();

thunk.withOptions = createThunkMiddleware;

export default thunk;
