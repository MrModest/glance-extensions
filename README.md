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
