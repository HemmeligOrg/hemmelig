import { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import './i18n';

import HemmeligApplication from './app';
import configureStore from './helpers/configureStore';
import './index.css';

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <Suspense
            fallback={
                <div
                    className="fixed inset-0 flex items-center justify-center 
                              bg-gray-900 bg-opacity-100 z-50"
                >
                    <div className="relative">
                        {/* Loading Spinner */}
                        <div
                            className="w-16 h-16 border-4 border-green-500 border-t-transparent 
                                      rounded-full animate-spin"
                        />
                    </div>
                </div>
            }
        >
            <HemmeligApplication />
        </Suspense>
    </Provider>,
    document.getElementById('root')
);
