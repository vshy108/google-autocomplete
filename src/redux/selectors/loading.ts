// const loadingSelector = createLoadingSelector(['GET_TODOS']);
// const mapStateToProps = (state) => ({ isFetching: loadingSelector(state) });
import some from 'lodash/some';
import get from 'lodash/get';
import { type RootState } from '../configureStore';

export const createLoadingSelector =
  (actions: string[]) => (state: RootState) => {
    // returns false only when all related actions is not loading
    return some(actions, (action: string) => get(state, `loading.${action}`));
  };
