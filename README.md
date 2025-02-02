# notlink-ui

The official web app for [notlink](https://github.com/abdibrokhim/notlink), written in nextjs.

Based off of ibrohim's [egov ai agent template](https://github.com/abdibrokhim/egovagent-ui).

## Configuration

The following environment variables can be used to configure notlink ui:

| `ENV_VAR`                      | type     | default          | description                                                                         |
| ------------------------------ | -------- | ---------------- | ----------------------------------------------------------------------------------- |
| `NOTLINK_UI_HOST`              | `string` | `0.0.0.0:3000`   | The IP / port that the notlink ui should be hosted at.                              |
| `NOTLINK_BACKEND_HOST`         | `string` | `0.0.0.0:8000`   | The IP / port that the notlink backend is hosted at.                                |
| `THIRDWEB_CLIENT_ID` | `string` | `...`          | The client id for the thirdweb api.                                                   |