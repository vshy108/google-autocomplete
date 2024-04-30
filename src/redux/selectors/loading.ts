// const loadingSelector = createLoadingSelector(['GET_TODOS_REQUEST']);
// const mapStateToProps = (state) => ({ isFetching: loadingSelector(state) });
import some from 'lodash/some';
import get from 'lodash/get';
import { type RootState } from '../configureStore';

export const createLoadingSelector =
  (actions: string[]) => (state: RootState) => {
    // returns false only when all related actions is not loading
    // expect any _REQUEST will be replaced by empty string
    return some(actions, (action: string) =>
      get(state, `loading.${action.replace('_REQUEST', '')}`)
    );
  };
