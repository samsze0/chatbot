# Contributing

## Generating Types for Supabase

- [Ref](https://supabase.com/docs/guides/api/rest/generating-types)

This process will require you to be logged in through the supabase CLI (and have the CLI installed).

`supabase gen types typescript --db-url postgres://postgres:<db_password>@db.<id>.supabase.co:6543/postgres > ./types.ts`

If the password contains special characters e.g. `@` or `#`, first find out what the URL-encoded version of that symbol is. This can be achieved in Python as follows:

```python
import urllib.parse

urllib.parse.quote_plus("@")
```

Or alternatively, specific the project ID using the `--project-id` flag instead. (I cannot get the other method to work)

## Working with Git Submodules

[StackOverflow - Git will not init/sync/update new submodules](https://stackoverflow.com/questions/3336995/git-will-not-init-sync-update-new-submodules)

- Your submodule folder should be committed into git repo
- It shouldn't be in `.gitignore`

**If you accidentally committed the local symlink**

Manually edit `.git/modules` and `.git/config` to reset the submodule status

**Useful commands**

- `git rm --cache -r ui/`
- Last resort: `git reset --hard origin/main`

**Update submodule**

1. `cd` into the submodule and `git checkout tag/<tag>`
2. `git commit` the submodule file
