# Glance Extensions

> [!WARNING]
> Still In Progress

Extensions for [Glance](https://github.com/glanceapp/glance) Dashboard <br />
[Official Doc](https://github.com/glanceapp/glance/blob/main/docs/extensions.md)

# Installation

Add this into your docker-compose file near to your main glance container

```yaml
glance-ext:
  image: ghcr.io/mrmodest/glance-extensions:v0.0.1
  container_name: glance-ext
  hostname: glance-ext
  environment:
    APP__PORT: 9999
    TODOIST__TOKEN: <put your todoist API token here>
    TODOIST__FILTER__WORK: '(Overdue | Today) & (workspace: Work | @💼 WorkTime)' # Instead of `WORK`, put your preffered name and replace the value with your Todoist query
    TODOIST__FILTER__PERSONAL: '(Overdue | Today) & !workspace: Work' # you can define more than one custom query
```

Add widget into your config like this:

```yaml
- type: extension
  title: To Do # Put any name you wish
  title-url: https://app.todoist.com/ # Any link you wish
  cache: 1m
  url: http://glance-ext:9999/todoist # `glance-ext` because of container's `hostname` and `9999` because of defined above `APP__PORT`
  allow-potentially-dangerous-html: true
  parameters:
    filter: Private # Put yout todoist query or name of your custom filer defined above w/o `TODOIST__FILTER__` prefix
```

## Screenshots

### Todoist
<img width="323" alt="image" src="https://github.com/user-attachments/assets/f803ce7c-cadb-4326-b5ee-4f5200d74d4d" />

## Credits
Inspired by [DallasHoff/glance-extensions](https://github.com/DallasHoff/glance-extensions)

## Apps

`GET /apps` renders the apps passed by each widget, in order. Set `DOCKER_URL`
to your Docker proxy and `WUD_URL` to WUD, with `WUD_USER` and `WUD_PASSWORD`
for a WUD login. Both must be reachable from the extension container. No server-side app config is needed.

See [examples/glance-widget.yml](examples/glance-widget.yml) for a widget you
can copy. Each `app` parameter is a JSON string with `name`, `icon`, `url`, and
exactly one of `container` or `check`. Use `di:`, `mdi:`, or an HTTP(S) image
URL for icons. App URLs, check URLs, and optional `releaseUrl` values must use
HTTP(S). Checks treat any 2xx response as up.

WUD sometimes picks a newer tag from another channel, such as a dated build.
By default an update only shows when the new tag has the same shape as the
installed one (digits may differ, everything else must match); otherwise the
row shows a muted question-mark icon ("Update check unavailable" on hover). Two optional per-app fields adjust this:
`tagTransform` rewrites WUD's pick first, using WUD's `regex => replacement`
syntax, and `tagPattern` is a regex the (transformed) tag must match instead
of the shape check. For example, Jellyfin only cares about major.minor:
`"tagTransform": "^(\\d+\\.\\d+).*$ => $1.0"`.

The widget's `title` names the list. An optional `title` query parameter sets
`Widget-Title`; otherwise the endpoint omits that header. Invalid entries appear
as muted rows. A request without apps returns 400.

Container rows show their installed image tag. WUD updates add a linked version
badge; `releaseUrl` overrides WUD's release link. Missing WUD results show
a muted question-mark icon. Check apps and untagged images have no version line.
