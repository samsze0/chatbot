# Artizon Chatbot

## Dev

### Generating Types for Supabase

- [Ref](https://supabase.com/docs/guides/api/rest/generating-types)

This process will require you to be logged in through the supabase CLI (and have the CLI installed).

`supabase gen types typescript --db-url postgres://postgres:<db_password>@db.<id>.supabase.co:6543/postgres > ./types.ts`

If the password contains special characters e.g. `@` or `#`, first find out what the URL-encoded version of that symbol is. This can be achieved in Python as follows:

```python
import urllib.parse

urllib.parse.quote_plus("@")
```

Or alternatively, specific the project ID using the `--project-id` flag instead. (I cannot get the other method to work)
