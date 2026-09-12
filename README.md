# commandref

A fast, minimal reference for the Git and Bash commands in the cheat sheet,
split into four sets: Git and Bash, each for macOS and Windows.

162 command cards. Each one shows the command in monospace, a one-line
purpose, and a copy button. Clicking a card reveals an example and its
common flags. Search filters all of it as you type.

The header carries a Light / Dark toggle. With nothing chosen the page
follows your system setting; clicking a button pins that theme and
remembers it; clicking the pinned one again releases it back to the system.
A small script in each page's `<head>` applies a pinned theme before first
paint, so there is no flash of the wrong colours on load.

No frameworks, no build step, no CDN links, no external fonts, no
dependencies of any kind. It is six HTML files, one stylesheet, one script
and one data file.

## About

**Built with AI, and not independently verified.** The commands themselves come
from existing cheat sheets, but every one-line purpose, example, flag note and
PowerShell equivalent was generated rather than tested. Treat the set as a
starting point rather than an authority, and check anything unfamiliar against
`git help <command>` or `<command> --help` before you run it.

Take particular care with the cards marked `destructive`. Those delete files,
discard uncommitted work, or rewrite published history, and several of them
cannot be undone.

I hope it serves you well.

## Running it

Double-click `index.html`. That is the whole process — it works from
`file://` with no server, which is why the data lives in `data/commands.js`
as a global rather than in a JSON file loaded with `fetch`.

## Files

```
index.html          landing page: four links plus a search across all sets
git-windows.html    Git, Windows      (Git Bash or PowerShell)
git-mac.html        Git, macOS        (zsh)
bash-windows.html   Bash, Windows     (Git Bash, plus native PowerShell)
bash-mac.html       Bash, macOS       (zsh)
404.html            served by GitHub Pages for unknown URLs
assets/style.css    shared by all six pages
assets/app.js       shared by all six pages
data/commands.js    the single source of truth
.nojekyll           empty; tells GitHub Pages to serve the directory as-is
README.md           this file
```

Every path in every file is relative and has no leading slash, so the site
works unchanged at a project subpath such as
`https://USERNAME.github.io/REPOSITORY/`. All filenames are lowercase, and
nothing starts with an underscore.

## Keyboard

| Key | What it does |
| --- | --- |
| `/` | Focus the search box and select what is already in it, so typing replaces the old query |
| `Esc` | Clear the search and restore the full list |
| `Tab` | Move between cards, copy buttons and links |
| `Enter` / `Space` | Expand the focused card |

Press `/` anywhere on the page and the search box takes focus, so you can start
typing straight away without reaching for the mouse. The one exception is when
you are already typing in a box — there it just types a slash.

Under the hood that rule lives in `assets/app.js`, which ignores the shortcut
whenever the key lands in an `<input>`, `<textarea>`, `<select>` or a
contenteditable element. That is why slashes stay searchable, which matters for
Git Bash drive paths such as `/c/projects`, and why any new field you add to a
page gets the same behaviour with nothing to wire up.

## Adding a command

Edit `data/commands.js`. It is the only file that holds command content —
every page reads from it, and the counts on the landing page are derived from
it, so nothing else drifts.

One extra step before you publish: bump the asset version (see
[Cache busting](#cache-busting) below), or returning visitors keep seeing the
copy their browser already cached.

There are three tables in the file:

- **`GIT`** — Git behaves identically on both systems, so each entry here is
  emitted onto *both* the macOS and Windows pages automatically. Add it once.
- **`BASH_MAC`** — the macOS / zsh set.
- **`BASH_WINDOWS`** — the Windows set. Each entry names its own `shell`.

A `GIT` entry looks like this:

```js
{
  id: 'git-stash',
  category: 'Undoing changes',
  command: 'git stash',
  purpose: 'Shelve uncommitted changes so you can switch branches',
  example: 'git stash pop',
  flags: [
    f('pop', 'Bring the shelved changes back and drop the stash'),
    f('list', 'Show everything currently shelved')
  ],
  destructive: false
}
```

A `BASH_MAC` or `BASH_WINDOWS` entry is the same, plus a `shell` field
(`'zsh'`, `'Git Bash'`, `'PowerShell'`, or `'Git Bash or PowerShell'`).

Field rules:

- `id` must be unique and lowercase with hyphens. Git entries get `-mac` and
  `-windows` appended for you, so `git-stash` becomes two records.
- `category` must be one of the names already listed in `CATEGORY_ORDER` at
  the top of the file. To add a category, add its name to that array.
- **Order is meaning.** `CATEGORY_ORDER` and the order of entries within each
  category both run from most-used to least-used. Put a new command where its
  real-world frequency says it belongs, not at the end.
- `purpose` is one line, 80 characters maximum, imperative, and must not
  restate the command name. "Discard all uncommitted changes in the working
  tree", not "This command is used to discard changes."
- `example` is one concrete pasteable line, or `''` for none.
- `flags` uses the `f(flag, note)` helper. Two to four entries reads best.
- `destructive: true` for anything that loses work or rewrites history. It
  renders as a small inline marker next to the command.

The command text itself is what the copy button puts on the clipboard, so
write it exactly as it should be typed — no leading `$`, `>` or `PS>` prompt
symbol and no trailing whitespace.

## Publishing to GitHub Pages

1. Commit every file in this folder to the **root** of the repository on the
   `main` branch — not into a subfolder, and including the empty `.nojekyll`:

   ```bash
   git add .
   git commit -m "Add command reference site"
   git push -u origin main
   ```

2. On GitHub, open the repository and go to **Settings → Pages**.

3. Under **Source**, choose **Deploy from a branch**.

4. Set **Branch** to `main` and the folder to **`/ (root)`**, then click
   **Save**.

5. The site appears at `https://USERNAME.github.io/REPOSITORY/` within a
   minute or two. Reload once if the first attempt 404s — the first build
   takes slightly longer than later ones.

A note on case: the GitHub Pages server is case-sensitive even though Windows
and macOS usually are not. `Git-Mac.html` works on your machine and 404s once
published, which is why every filename here is lowercase.

## Cache busting

Every page loads its three assets with a version query:

```html
<link rel="stylesheet" href="assets/style.css?v=3">
<script src="data/commands.js?v=3" defer></script>
<script src="assets/app.js?v=3" defer></script>
```

Browsers re-fetch an HTML page far more eagerly than the files it pulls in, so
without this a returning visitor gets your new `index.html` alongside the
`style.css` they cached last week — new markup, old rules, broken layout. The
query makes it a different URL, which no cache can satisfy from an old entry.

**Whenever you change `commands.js`, `style.css` or `app.js`, bump the number
in all six pages before you push.** From the repository root in Git Bash:

```bash
sed -i 's/?v=3/?v=4/g' *.html
```

Or in PowerShell:

```powershell
Get-ChildItem *.html | ForEach-Object { (Get-Content $_ -Raw) -replace '\?v=3','\?v=4' | Set-Content $_ -Encoding utf8 }
```

The number is arbitrary — it only has to differ from last time. Forgetting it
is not fatal: GitHub Pages sets a short max-age, so most visitors catch up
within minutes. It is the visitors whose browsers cache more aggressively,
as Edge does, that the bump protects.

## Notes on the content

- Git is identical on both systems, so all 49 Git commands appear on both Git
  pages. The Windows page labels the shell on every card and calls out the
  places the surrounding shell does change something: PowerShell expanding
  `$` inside double quotes, where `.gitconfig` lands, and the pager.
- The Bash pages differ, because the shells genuinely differ. `bash-mac`
  assumes zsh. `bash-windows` gives the Git Bash form and adds separate
  PowerShell cards for the commands that, typed there, quietly run a
  *different program* instead of failing: `ls`, `find`, `curl`, `man`,
  `echo >` and `tree`.
- Keyboard shortcuts such as `Ctrl + C` are not cards, because a card's copy
  button has to yield text you can paste into a terminal. They appear in the
  flags of the commands they relate to.
