import { createLogger } from 'redux-logger';
import { applyMiddleware, configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './reducers';
import sagas from '@/redux/sagas';

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistCombineReducers(persistConfig, rootReducer);

const logger = createLogger({
  collapsed: true,
});

const isDev = process.env.NODE_ENV !== 'production';

export const store = configureStore({
  reducer: persistedReducer,
  devTools: isDev,
  middleware: gDM => {
    applyMiddleware(sagaMiddleware);
    if (isDev) {
      return gDM({
        serializableCheck: false,
      }).concat(sagaMiddleware, logger);
    }

    return gDM({
      serializableCheck: false,
    }).concat(sagaMiddleware);
  },
});

sagaMiddleware.run(sagas);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
