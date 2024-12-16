import { For } from 'solid-js'
import routeInfo from 'virtual:route-info'

function Item(props: {
  title: string
  path: string
}) {
  return <a class="p-1 flex" href={props.path}>{props.title}</a>
}

export function Nav() {
  return (
    <div class="flex gap-1 justify-evenly">
      <For each={routeInfo}>
        {(item) => {
          return <Item title={item.info.title} path={`/${item.path}`} />
        }}
      </For>
    </div>
  )
}
