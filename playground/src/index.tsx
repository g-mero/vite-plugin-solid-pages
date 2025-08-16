/* @refresh reload */

import routes from 'virtual:pages';
import { Router } from '@solidjs/router';
import { render } from 'solid-js/web';
import { Nav } from './parts/Nav';

import 'uno.css';

render(
  () => (
    <Router
      root={(props) => {
        return (
          <div>
            <Nav />
            {props.children}
          </div>
        );
      }}
    >
      {routes}
    </Router>
  ),
  document.getElementById('root')!
);
