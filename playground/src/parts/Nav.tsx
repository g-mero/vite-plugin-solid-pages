import routeInfo from 'virtual:route-info';
import { For } from 'solid-js';

function Item(props: { title: string; path: string }) {
  return (
    <a class="flex p-1" href={props.path}>
      {props.title}
    </a>
  );
}

export function Nav() {
  return (
    <div class="flex justify-evenly gap-1">
      <For each={routeInfo}>
        {(item) => {
          return <Item path={`/${item.path}`} title={item.info.title} />;
        }}
      </For>
    </div>
  );
}
