import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";

function useThunk(thunk) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const runThunk = useCallback(
    (arg) => {
      setIsLoading(true);
      // when using dispatch function, it returns a promise. a promise have two states: 'then' and 'catch'.
      // if the promise is fulfilled, the code inside 'then' gets executed or if the promise is rejected, the code inside 'catch' gets executed.
      // but while make use of dispatch, the promise will always go to the 'then' state.
      // so to make use of both states, we need to unwrap it.
      dispatch(thunk(arg))
        .unwrap()
        .then(() => {})
        .catch((error) => {
          setError(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [dispatch, thunk]
  );

  return [runThunk, isLoading, error];
}

export default useThunk;
