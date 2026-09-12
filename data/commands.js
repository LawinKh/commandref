/* ------------------------------------------------------------------
   data/commands.js — the single source of truth for the whole site.

   Assigned to window.COMMANDS as a plain array, NOT fetched as JSON,
   so the site works when opened straight from disk over file://.

   Every record has the shape:

     { id, os, tool, shell, category, command, purpose,
       example, flags, destructive }

   os          "windows" | "mac"
   tool        "git" | "bash"
   shell       which shell the command assumes
   category    must appear in CATEGORY_ORDER below
   purpose     one line, 80 characters maximum, imperative
   example     a concrete line you can paste, or '' for none
   flags       [{ flag, note }] shown when the card is expanded
   destructive true if it loses work or rewrites history

   TO ADD A COMMAND: add an entry to GIT (it appears on both OS pages),
   or to BASH_MAC / BASH_WINDOWS. Nothing else in the site needs editing.
   ------------------------------------------------------------------ */

(function () {
  'use strict';

  /* Category display order = how often the commands are actually used.
     Not alphabetical. Index 0 renders first. */
  var CATEGORY_ORDER = {
    git: [
      'Everyday workflow',
      'Branches',
      'History and commits',
      'Undoing changes',
      'Starting a repository',
      'Remote repositories',
      'Name, email and settings',
      'Force push and rewriting history'
    ],
    bash: [
      'Moving around',
      'Files and folders',
      'Reading and searching',
      'Chaining commands',
      'Housekeeping'
    ]
  };

  /* Shorthand so the tables below stay readable. */
  function f(flag, note) {
    return { flag: flag, note: note };
  }

  /* ----------------------------------------------------------------
     GIT — every command in the source cheat sheet.
     Git itself is identical on macOS and Windows, so each entry here
     is emitted onto BOTH OS pages. `winNote`, where present, becomes
     an extra flag row on the Windows page only.
     Within each category, ordered by how often the command is typed.
     ---------------------------------------------------------------- */
  var GIT = [

    /* --- Everyday workflow ---------------------------------------- */
    {
      id: 'git-status',
      category: 'Everyday workflow',
      command: 'git status',
      purpose: 'Show what changed, what is staged, and which branch you are on',
      example: 'git status -sb',
      flags: [
        f('-s', 'One line per file instead of the full prose report'),
        f('-b', 'Keep the branch header when using -s'),
        f('--ignored', 'Also list the files excluded by .gitignore')
      ],
      destructive: false
    },
    {
      id: 'git-add-all',
      category: 'Everyday workflow',
      command: 'git add .',
      purpose: 'Stage every change below the current folder for the next commit',
      example: 'git add -A',
      flags: [
        f('-A', 'Stage the whole repository, including files outside this folder'),
        f('-p', 'Choose which hunks to stage, one at a time'),
        f('-n', 'Dry run: list what would be staged without staging it')
      ],
      destructive: false
    },
    {
      id: 'git-commit',
      category: 'Everyday workflow',
      command: 'git commit -m "<message>"',
      purpose: 'Record the staged changes with a short description',
      example: 'git commit -m "Fix nav overlap on small screens"',
      flags: [
        f('-a', 'Stage every tracked file first, skipping git add'),
        f('--amend', 'Replace the previous commit instead of adding one'),
        f('-m', 'Repeat the flag to add further paragraphs')
      ],
      destructive: false,
      winNote: 'Double quotes expand $name and backticks in PowerShell. Use single quotes for a literal message.'
    },
    {
      id: 'git-push',
      category: 'Everyday workflow',
      command: 'git push',
      purpose: 'Send commits to the branch this one already tracks',
      example: 'git push --dry-run',
      flags: [
        f('--dry-run', 'Show what would be sent without sending it'),
        f('-v', 'Print the remote URL and the refs being updated'),
        f('--tags', 'Send tags as well as commits')
      ],
      destructive: false
    },
    {
      id: 'git-pull-main',
      category: 'Everyday workflow',
      command: 'git pull origin main',
      purpose: 'Fetch and merge whatever was pushed to main since you last looked',
      example: 'git pull --rebase origin main',
      flags: [
        f('--rebase', 'Replay your commits on top instead of making a merge commit'),
        f('--ff-only', 'Refuse to merge unless it is a clean fast-forward')
      ],
      destructive: false
    },
    {
      id: 'git-push-branch',
      category: 'Everyday workflow',
      command: 'git push origin <branch>',
      purpose: 'Send commits to a named branch on the remote',
      example: 'git push origin feature-branch',
      flags: [
        f('-u', 'Remember the branch so later you can type git push alone'),
        f('--tags', 'Include tags in the same push')
      ],
      destructive: false
    },
    {
      id: 'git-diff',
      category: 'Everyday workflow',
      command: 'git diff',
      purpose: 'Show the exact lines changed but not yet staged',
      example: 'git diff styles.css',
      flags: [
        f('--stat', 'Summarise by file instead of printing every line'),
        f('--word-diff', 'Highlight changed words rather than whole lines')
      ],
      destructive: false
    },
    {
      id: 'git-add-file',
      category: 'Everyday workflow',
      command: 'git add <file>',
      purpose: 'Stage one file so the work can be split across commits',
      example: 'git add index.html',
      flags: [
        f('-p', 'Stage only the chosen hunks of that file')
      ],
      destructive: false
    },
    {
      id: 'git-diff-staged',
      category: 'Everyday workflow',
      command: 'git diff --staged',
      purpose: 'Show the exact lines already staged for the next commit',
      example: 'git diff --staged --stat',
      flags: [
        f('--stat', 'Summarise by file instead of printing every line'),
        f('--cached', 'The same thing under its older spelling')
      ],
      destructive: false
    },

    /* --- Branches -------------------------------------------------- */
    {
      id: 'git-branch',
      category: 'Branches',
      command: 'git branch',
      purpose: 'List local branches and mark the current one',
      example: 'git branch -v',
      flags: [
        f('-v', 'Show the newest commit on each branch'),
        f('-a', 'Include remote-tracking branches'),
        f('--merged', 'Only branches already merged into this one')
      ],
      destructive: false
    },
    {
      id: 'git-checkout-branch',
      category: 'Branches',
      command: 'git checkout <branch>',
      purpose: 'Move onto an existing branch',
      example: 'git checkout main',
      flags: [
        f('-b', 'Create the branch first if it does not exist'),
        f('-', 'Jump straight back to the previous branch')
      ],
      destructive: false
    },
    {
      id: 'git-checkout-b',
      category: 'Branches',
      command: 'git checkout -b <branch>',
      purpose: 'Create a branch and move onto it in one step',
      example: 'git checkout -b feature-branch',
      flags: [
        f('--track', 'Set the new branch to follow a remote one')
      ],
      destructive: false
    },
    {
      id: 'git-merge',
      category: 'Branches',
      command: 'git merge <branch>',
      purpose: 'Bring another branch\u2019s work into the current one',
      example: 'git merge feature-branch',
      flags: [
        f('--no-ff', 'Always make a merge commit, even when fast-forward is possible'),
        f('--abort', 'Back out of a merge that hit conflicts')
      ],
      destructive: false
    },
    {
      id: 'git-switch',
      category: 'Branches',
      command: 'git switch <branch>',
      purpose: 'Move onto an existing branch, modern syntax',
      example: 'git switch main',
      flags: [
        f('-c', 'Create the branch first'),
        f('-', 'Jump straight back to the previous branch')
      ],
      destructive: false
    },
    {
      id: 'git-switch-c',
      category: 'Branches',
      command: 'git switch -c <branch>',
      purpose: 'Create a branch and move onto it, modern syntax',
      example: 'git switch -c feature-branch',
      flags: [
        f('--track', 'Follow a remote branch of the same name')
      ],
      destructive: false
    },
    {
      id: 'git-branch-a',
      category: 'Branches',
      command: 'git branch -a',
      purpose: 'List local and remote-tracking branches together',
      example: 'git branch -av',
      flags: [
        f('-r', 'Remote-tracking branches only'),
        f('-v', 'Add the newest commit on each branch')
      ],
      destructive: false
    },
    {
      id: 'git-branch-d',
      category: 'Branches',
      command: 'git branch -d <branch>',
      purpose: 'Delete a branch whose work is already merged',
      example: 'git branch -d feature-branch',
      flags: [
        f('-D', 'Delete even when the work is unmerged, losing those commits')
      ],
      destructive: false
    },
    {
      id: 'git-push-delete',
      category: 'Branches',
      command: 'git push origin --delete <branch>',
      purpose: 'Delete a branch on the remote for everyone',
      example: 'git push origin --delete feature-branch',
      flags: [
        f('--dry-run', 'Check what would be deleted before doing it')
      ],
      destructive: true
    },
    {
      id: 'git-checkout-b-commit',
      category: 'Branches',
      command: 'git checkout -b <branch> <commit>',
      purpose: 'Start a new branch from an older commit',
      example: 'git checkout -b hotfix 4f2a91c',
      flags: [
        f('<commit>', 'Any hash, tag or ref such as HEAD~3')
      ],
      destructive: false
    },

    /* --- History and commits --------------------------------------- */
    {
      id: 'git-log-oneline',
      category: 'History and commits',
      command: 'git log --oneline',
      purpose: 'List commits one per line with short hashes',
      example: 'git log --oneline -10',
      flags: [
        f('-n', 'Limit how many commits are shown'),
        f('--author', 'Only commits by one person'),
        f('--since', 'Only commits after a date, such as "2 weeks ago"')
      ],
      destructive: false
    },
    {
      id: 'git-show',
      category: 'History and commits',
      command: 'git show',
      purpose: 'Print the message and full diff of the newest commit',
      example: 'git show --stat',
      flags: [
        f('--stat', 'File summary instead of the whole diff'),
        f('--name-only', 'Just the names of the files that changed')
      ],
      destructive: false
    },
    {
      id: 'git-log-graph',
      category: 'History and commits',
      command: 'git log --oneline --all --graph',
      purpose: 'Draw every branch\u2019s history as a compact tree',
      example: 'git log --oneline --all --graph -20',
      flags: [
        f('--all', 'Include every branch, not only this one'),
        f('--graph', 'Draw the lines showing where branches split')
      ],
      destructive: false
    },
    {
      id: 'git-show-commit',
      category: 'History and commits',
      command: 'git show <commit>',
      purpose: 'Print the message and full diff of one commit',
      example: 'git show 4f2a91c',
      flags: [
        f('--stat', 'File summary instead of the whole diff')
      ],
      destructive: false
    },
    {
      id: 'git-diff-commits',
      category: 'History and commits',
      command: 'git diff <commit> <commit>',
      purpose: 'Show every line that differs between two commits',
      example: 'git diff 4f2a91c 9b3de70',
      flags: [
        f('--stat', 'Summarise by file'),
        f('--name-only', 'List the changed files and nothing else')
      ],
      destructive: false
    },
    {
      id: 'git-log-decorate',
      category: 'History and commits',
      command: 'git log --oneline --decorate --graph --all',
      purpose: 'Draw the history tree with branch and tag names attached',
      example: 'git log --oneline --decorate --graph --all -30',
      flags: [
        f('--decorate', 'Label commits with the branches and tags pointing at them')
      ],
      destructive: false
    },
    {
      id: 'git-checkout-commit',
      category: 'History and commits',
      command: 'git checkout <commit>',
      purpose: 'Put the working tree back at an old commit to look around',
      example: 'git checkout 4f2a91c',
      flags: [
        f('-', 'Return to the branch you came from'),
        f('detached HEAD', 'You are not on a branch: commit here and the work is easy to lose')
      ],
      destructive: false
    },
    {
      id: 'git-rev-parse-short',
      category: 'History and commits',
      command: 'git rev-parse --short HEAD',
      purpose: 'Print the abbreviated hash of the current commit',
      example: 'git rev-parse --short=10 HEAD',
      flags: [
        f('--short', 'Abbreviate to the shortest unambiguous length')
      ],
      destructive: false
    },
    {
      id: 'git-rev-parse',
      category: 'History and commits',
      command: 'git rev-parse HEAD',
      purpose: 'Print the full hash of the current commit',
      example: 'git rev-parse main',
      flags: [
        f('--abbrev-ref', 'Print the branch name instead of the hash')
      ],
      destructive: false
    },

    /* --- Undoing changes ------------------------------------------- */
    {
      id: 'git-restore-staged',
      category: 'Undoing changes',
      command: 'git restore --staged .',
      purpose: 'Unstage everything while keeping the edits on disk',
      example: 'git restore --staged index.html',
      flags: [
        f('--staged', 'Touch the staging area only, never the files themselves')
      ],
      destructive: false
    },
    {
      id: 'git-reset-soft',
      category: 'Undoing changes',
      command: 'git reset --soft HEAD~1',
      purpose: 'Undo the last commit and leave its changes staged',
      example: 'git reset --soft HEAD~2',
      flags: [
        f('--soft', 'Keep the changes staged, ready to re-commit'),
        f('--mixed', 'Keep the changes but unstage them')
      ],
      destructive: false
    },
    {
      id: 'git-restore',
      category: 'Undoing changes',
      command: 'git restore .',
      purpose: 'Throw away every uncommitted edit in the working tree',
      example: 'git restore styles.css',
      flags: [
        f('--source', 'Restore from a named commit instead of the last one')
      ],
      destructive: true
    },
    {
      id: 'git-reset-hard',
      category: 'Undoing changes',
      command: 'git reset --hard <commit>',
      purpose: 'Move the branch back and wipe everything after it',
      example: 'git reset --hard 4f2a91c',
      flags: [
        f('--hard', 'Discard the working tree and the staging area as well'),
        f('git reflog', 'Lists the commits you just left, for a short while')
      ],
      destructive: true
    },
    {
      id: 'git-rm-r',
      category: 'Undoing changes',
      command: 'git rm -r .',
      purpose: 'Delete every tracked file and stage the deletion',
      example: 'git rm -r --cached .',
      flags: [
        f('--cached', 'Untrack the files but leave them on disk'),
        f('-r', 'Include the contents of folders')
      ],
      destructive: true
    },

    /* --- Starting a repository -------------------------------------- */
    {
      id: 'git-clone',
      category: 'Starting a repository',
      command: 'git clone <url>',
      purpose: 'Download a remote repository with its full history',
      example: 'git clone https://github.com/USERNAME/REPOSITORY.git',
      flags: [
        f('--depth 1', 'Fetch only the newest commit, much faster on big repositories'),
        f('-b', 'Clone one specific branch')
      ],
      destructive: false
    },
    {
      id: 'git-init',
      category: 'Starting a repository',
      command: 'git init',
      purpose: 'Turn the current folder into a new repository',
      example: 'git init -b main',
      flags: [
        f('-b', 'Name the first branch instead of accepting the default')
      ],
      destructive: false
    },
    {
      id: 'git-push-u',
      category: 'Starting a repository',
      command: 'git push -u origin main',
      purpose: 'Publish main and remember the remote for later pushes',
      example: 'git push -u origin feature-branch',
      flags: [
        f('-u', 'Set the upstream, so plain git push works from then on')
      ],
      destructive: false
    },
    {
      id: 'git-branch-M',
      category: 'Starting a repository',
      command: 'git branch -M main',
      purpose: 'Rename the current branch to main, overwriting any existing one',
      example: 'git branch -m old-name new-name',
      flags: [
        f('-m', 'Rename, but refuse if the target name is taken'),
        f('-M', 'Rename and overwrite the target name')
      ],
      destructive: false
    },

    /* --- Remote repositories ---------------------------------------- */
    {
      id: 'git-remote-v',
      category: 'Remote repositories',
      command: 'git remote -v',
      purpose: 'List the remotes this repository pushes to and fetches from',
      example: 'git remote show origin',
      flags: [
        f('-v', 'Show the URLs, not only the names')
      ],
      destructive: false
    },
    {
      id: 'git-fetch',
      category: 'Remote repositories',
      command: 'git fetch origin',
      purpose: 'Download remote commits without touching the working tree',
      example: 'git fetch origin --prune',
      flags: [
        f('--prune', 'Drop references to branches deleted on the remote'),
        f('--all', 'Fetch from every remote at once')
      ],
      destructive: false
    },
    {
      id: 'git-remote-add',
      category: 'Remote repositories',
      command: 'git remote add origin <url>',
      purpose: 'Point this repository at a remote under the name origin',
      example: 'git remote add origin https://github.com/USERNAME/REPOSITORY.git',
      flags: [
        f('origin', 'Just the conventional nickname; any name works')
      ],
      destructive: false
    },
    {
      id: 'git-remote-seturl',
      category: 'Remote repositories',
      command: 'git remote set-url origin <url>',
      purpose: 'Repoint origin at a different remote address',
      example: 'git remote set-url origin https://github.com/USERNAME/NEW_REPOSITORY.git',
      flags: [
        f('--push', 'Change only the push URL, leaving fetch alone')
      ],
      destructive: false
    },
    {
      id: 'git-remote-remove',
      category: 'Remote repositories',
      command: 'git remote remove origin',
      purpose: 'Forget the remote named origin',
      example: 'git remote rename origin upstream',
      flags: [
        f('rename', 'Rename a remote instead of removing it')
      ],
      destructive: false
    },
    {
      id: 'git-pull-unrelated',
      category: 'Remote repositories',
      command: 'git pull origin main --allow-unrelated-histories',
      purpose: 'Merge a remote history that shares no commits with yours',
      example: 'git pull origin main --allow-unrelated-histories --no-rebase',
      flags: [
        f('--allow-unrelated-histories', 'Permit a merge between two separate histories'),
        f('when to use', 'The local repo and the GitHub repo were created separately')
      ],
      destructive: false
    },

    /* --- Name, email and settings ------------------------------------ */
    {
      id: 'git-config-list',
      category: 'Name, email and settings',
      command: 'git config --list',
      purpose: 'Print every setting Git is currently using',
      example: 'git config --list --show-origin',
      flags: [
        f('--global', 'Only the settings for this user account'),
        f('--show-origin', 'Say which file each setting came from')
      ],
      destructive: false
    },
    {
      id: 'git-config-name',
      category: 'Name, email and settings',
      command: 'git config --global user.name "<name>"',
      purpose: 'Set the name attached to every commit on this machine',
      example: 'git config --global user.name "Lawin Khalil"',
      flags: [
        f('--global', 'Apply to every repository for this user'),
        f('--local', 'Apply to this one repository only')
      ],
      destructive: false,
      winNote: 'PowerShell expands $ inside double quotes. Use single quotes for a literal value.'
    },
    {
      id: 'git-config-email',
      category: 'Name, email and settings',
      command: 'git config --global user.email "<email>"',
      purpose: 'Set the email attached to every commit on this machine',
      example: 'git config --global user.email "you@example.com"',
      flags: [
        f('--global', 'Apply to every repository for this user'),
        f('match GitHub', 'Use an address on your GitHub account or commits show as unverified')
      ],
      destructive: false,
      winNote: 'The file written is %USERPROFILE%\\.gitconfig on Windows, ~/.gitconfig on macOS.'
    },

    /* --- Force push and rewriting history ----------------------------- */
    {
      id: 'git-push-force-branch',
      category: 'Force push and rewriting history',
      command: 'git push origin <branch> --force',
      purpose: 'Replace the remote branch with the local one, discarding its history',
      example: 'git push origin feature-branch --force',
      flags: [
        f('--force-with-lease', 'Refuse if someone else pushed since your last fetch'),
        f('--dry-run', 'See what would be overwritten first')
      ],
      destructive: true
    },
    {
      id: 'git-push-u-force',
      category: 'Force push and rewriting history',
      command: 'git push -u origin main --force',
      purpose: 'Replace remote main with local main and track it from now on',
      example: 'git push -u origin main --force-with-lease',
      flags: [
        f('--force-with-lease', 'The safer form: refuses if the remote moved'),
        f('warning', 'Commits on the remote that you do not have are erased')
      ],
      destructive: true
    },
    {
      id: 'git-push-refspec-force',
      category: 'Force push and rewriting history',
      command: 'git push origin <local-branch>:<remote-branch> --force',
      purpose: 'Replace a differently named remote branch with this local branch',
      example: 'git push origin main:feature-branch --force',
      flags: [
        f('local:remote', 'Left of the colon is yours, right of it is theirs'),
        f('--force-with-lease', 'The safer form of the same push')
      ],
      destructive: true,
      winNote: 'Quote the refspec in PowerShell: git push origin "main:feature-branch" --force'
    }
  ];

  /* ----------------------------------------------------------------
     BASH — macOS, running zsh.
     Ordered within each category by how often the command is typed.
     ---------------------------------------------------------------- */
  var BASH_MAC = [

    /* --- Moving around ---------------------------------------------- */
    {
      id: 'mac-cd',
      category: 'Moving around',
      command: 'cd <folder>',
      purpose: 'Step into a folder',
      example: 'cd my-project',
      flags: [
        f('..', 'Go up one level'),
        f('~', 'Jump to your home folder'),
        f('-', 'Jump back to the folder you were just in'),
        f('Tab', 'Press it part-way through a name to autocomplete')
      ],
      destructive: false
    },
    {
      id: 'mac-ls',
      category: 'Moving around',
      command: 'ls -la',
      purpose: 'List everything here, hidden files included, with sizes and dates',
      example: 'ls -la ~/Projects',
      flags: [
        f('-l', 'Long format: permissions, size, modified date'),
        f('-a', 'Include dotfiles such as .gitignore'),
        f('-h', 'Human-readable sizes'),
        f('-t', 'Newest first')
      ],
      destructive: false
    },
    {
      id: 'mac-cd-up',
      category: 'Moving around',
      command: 'cd ..',
      purpose: 'Go up one folder level',
      example: 'cd ../..',
      flags: [
        f('cd ~', 'Straight to your home folder'),
        f('cd -', 'Back to the folder you were just in')
      ],
      destructive: false
    },
    {
      id: 'mac-pwd',
      category: 'Moving around',
      command: 'pwd',
      purpose: 'Print the full path of the folder you are standing in',
      example: 'pwd -P',
      flags: [
        f('-P', 'Resolve symlinks and show the real path')
      ],
      destructive: false
    },
    {
      id: 'mac-open',
      category: 'Moving around',
      command: 'open .',
      purpose: 'Open the current folder in Finder',
      example: 'open index.html',
      flags: [
        f('-a', 'Open with a named application'),
        f('-R', 'Reveal the file in Finder instead of opening it')
      ],
      destructive: false
    },
    {
      id: 'mac-tree',
      category: 'Moving around',
      command: 'tree -L 2',
      purpose: 'Draw the folder structure two levels deep',
      example: 'tree -L 3 src',
      flags: [
        f('-L', 'How many levels deep to go'),
        f('-a', 'Include hidden files'),
        f('-d', 'Folders only'),
        f('install', 'Not built in: brew install tree')
      ],
      destructive: false
    },

    /* --- Files and folders ------------------------------------------- */
    {
      id: 'mac-mkdir',
      category: 'Files and folders',
      command: 'mkdir <folder>',
      purpose: 'Create a folder',
      example: 'mkdir -p src/assets/img',
      flags: [
        f('-p', 'Create any missing parent folders too')
      ],
      destructive: false
    },
    {
      id: 'mac-touch',
      category: 'Files and folders',
      command: 'touch <file>',
      purpose: 'Create an empty file, or bump the timestamp on an existing one',
      example: 'touch .gitignore',
      flags: [
        f('-c', 'Do not create the file if it is missing')
      ],
      destructive: false
    },
    {
      id: 'mac-mv',
      category: 'Files and folders',
      command: 'mv <source> <destination>',
      purpose: 'Rename a file, or move it somewhere else',
      example: 'mv old-notes.md docs/notes.md',
      flags: [
        f('-i', 'Ask before overwriting anything'),
        f('-n', 'Never overwrite')
      ],
      destructive: false
    },
    {
      id: 'mac-cp',
      category: 'Files and folders',
      command: 'cp <source> <destination>',
      purpose: 'Copy a file or folder',
      example: 'cp -r src build',
      flags: [
        f('-r', 'Copy a whole folder and its contents'),
        f('-i', 'Ask before overwriting anything')
      ],
      destructive: false
    },
    {
      id: 'mac-rm',
      category: 'Files and folders',
      command: 'rm -r <folder>',
      purpose: 'Delete a folder and everything inside it, with no recycle bin',
      example: 'rm -r node_modules',
      flags: [
        f('-f', 'Never prompt, never complain about missing files'),
        f('-i', 'Confirm each file before deleting it')
      ],
      destructive: true
    },
    {
      id: 'mac-mkdir-cd',
      category: 'Files and folders',
      command: 'mkdir <folder> && cd <folder>',
      purpose: 'Create a folder and step into it in one line',
      example: 'mkdir blog && cd blog',
      flags: [
        f('&&', 'Run the second part only if the first one succeeded'),
        f(';', 'Run the second part regardless')
      ],
      destructive: false
    },

    /* --- Reading and searching ---------------------------------------- */
    {
      id: 'mac-cat',
      category: 'Reading and searching',
      command: 'cat <file>',
      purpose: 'Print a whole file to the screen',
      example: 'cat package.json',
      flags: [
        f('-n', 'Number the lines')
      ],
      destructive: false
    },
    {
      id: 'mac-grep',
      category: 'Reading and searching',
      command: 'grep -rn "<text>" .',
      purpose: 'Search every file below here and print matching lines with numbers',
      example: 'grep -rn "TODO" src',
      flags: [
        f('-r', 'Search subfolders as well'),
        f('-n', 'Show the line number of each match'),
        f('-i', 'Ignore case'),
        f('--include', 'Limit to a file pattern, such as --include="*.css"')
      ],
      destructive: false
    },
    {
      id: 'mac-less',
      category: 'Reading and searching',
      command: 'less <file>',
      purpose: 'Scroll through a long file one screen at a time',
      example: 'less server.log',
      flags: [
        f('q', 'Quit and return to the prompt'),
        f('/text', 'Search forward for text'),
        f('G', 'Jump to the end of the file')
      ],
      destructive: false
    },
    {
      id: 'mac-head',
      category: 'Reading and searching',
      command: 'head -n 20 <file>',
      purpose: 'Print the first lines of a file',
      example: 'head -n 20 access.log',
      flags: [
        f('-n', 'How many lines to show'),
        f('tail', 'The same command for the last lines instead')
      ],
      destructive: false
    },
    {
      id: 'mac-tail',
      category: 'Reading and searching',
      command: 'tail -f <file>',
      purpose: 'Watch a file live as new lines are written to it',
      example: 'tail -f server.log',
      flags: [
        f('-f', 'Keep following the file instead of exiting'),
        f('-n', 'Start by showing the last N lines'),
        f('Ctrl + C', 'Stop following')
      ],
      destructive: false
    },
    {
      id: 'mac-find',
      category: 'Reading and searching',
      command: 'find . -name "<pattern>"',
      purpose: 'Find files by name rather than by content',
      example: 'find . -name "*.css"',
      flags: [
        f('-type f', 'Files only, no folders'),
        f('-iname', 'Ignore case in the pattern'),
        f('-maxdepth', 'Stop after N levels down')
      ],
      destructive: false
    },

    /* --- Chaining commands --------------------------------------------- */
    {
      id: 'mac-pipe',
      category: 'Chaining commands',
      command: '<command> | <command>',
      purpose: 'Send the output of one command straight into the next',
      example: 'ls -la | less',
      flags: [
        f('|', 'Pipe: pass output onward'),
        f('>', 'Redirect output into a file, replacing it'),
        f('>>', 'Redirect output into a file, appending')
      ],
      destructive: false
    },
    {
      id: 'mac-redirect',
      category: 'Chaining commands',
      command: 'echo "<text>" > <file>',
      purpose: 'Write text into a file, replacing whatever was there',
      example: 'echo "node_modules/" > .gitignore',
      flags: [
        f('>', 'Overwrite the file from the first byte'),
        f('>>', 'Append instead, keeping the existing contents')
      ],
      destructive: true
    },
    {
      id: 'mac-append',
      category: 'Chaining commands',
      command: 'echo "<text>" >> <file>',
      purpose: 'Add text to the end of a file, keeping what is already there',
      example: 'echo ".env" >> .gitignore',
      flags: [
        f('>>', 'Append to the end of the file')
      ],
      destructive: false
    },
    {
      id: 'mac-ls-grep',
      category: 'Chaining commands',
      command: 'ls -la | grep "<text>"',
      purpose: 'List the folder, then keep only the lines that match',
      example: 'ls -la | grep ".html"',
      flags: [
        f('-v', 'Invert: keep the lines that do NOT match'),
        f('-c', 'Print how many lines matched instead of the lines')
      ],
      destructive: false
    },
    {
      id: 'mac-wc',
      category: 'Chaining commands',
      command: 'wc -l <file>',
      purpose: 'Count the lines in a file',
      example: 'wc -l styles.css',
      flags: [
        f('-l', 'Lines'),
        f('-w', 'Words'),
        f('-c', 'Bytes')
      ],
      destructive: false
    },
    {
      id: 'mac-curl',
      category: 'Chaining commands',
      command: 'curl -s <url> | less',
      purpose: 'Fetch a page and read the response without saving it',
      example: 'curl -s https://example.com | less',
      flags: [
        f('-s', 'Hide the progress meter'),
        f('-o', 'Write the response to a file'),
        f('-I', 'Headers only, no body')
      ],
      destructive: false
    },

    /* --- Housekeeping --------------------------------------------------- */
    {
      id: 'mac-clear',
      category: 'Housekeeping',
      command: 'clear',
      purpose: 'Wipe the screen without losing the scrollback',
      example: '',
      flags: [
        f('Ctrl + L', 'Does the same thing without typing anything'),
        f('Ctrl + C', 'Stop whatever is running right now')
      ],
      destructive: false
    },
    {
      id: 'mac-history',
      category: 'Housekeeping',
      command: 'history | grep <text>',
      purpose: 'Find a command you ran before without scrolling back',
      example: 'history | grep git',
      flags: [
        f('Ctrl + R', 'Search history interactively as you type'),
        f('Up arrow', 'Bring back the previous command')
      ],
      destructive: false
    },
    {
      id: 'mac-which',
      category: 'Housekeeping',
      command: 'which <command>',
      purpose: 'Show where a program lives, or confirm it is installed',
      example: 'which node',
      flags: [
        f('-a', 'List every match on your PATH, not just the first')
      ],
      destructive: false
    },
    {
      id: 'mac-man',
      category: 'Housekeeping',
      command: 'man <command>',
      purpose: 'Read the manual page for a command',
      example: 'man grep',
      flags: [
        f('q', 'Quit the manual'),
        f('/text', 'Search inside the page')
      ],
      destructive: false
    }
  ];

  /* ----------------------------------------------------------------
     BASH — Windows.

     Git Bash ships with Git for Windows and runs the real GNU tools,
     so it is the native home for this content. PowerShell is the
     Windows default shell and is listed separately wherever typing the
     bash form there silently runs a DIFFERENT program instead of
     failing: ls, find, curl, man, echo > and tree.
     ---------------------------------------------------------------- */
  var BASH_WINDOWS = [

    /* --- Moving around ---------------------------------------------- */
    {
      id: 'win-cd',
      shell: 'Git Bash',
      category: 'Moving around',
      command: 'cd <folder>',
      purpose: 'Step into a folder',
      example: 'cd my-project',
      flags: [
        f('..', 'Go up one level'),
        f('~', 'Jump to your home folder'),
        f('drive paths', 'C:\\projects is /c/projects in Git Bash'),
        f('PowerShell', 'cd works there too, as an alias for Set-Location')
      ],
      destructive: false
    },
    {
      id: 'win-ls',
      shell: 'Git Bash',
      category: 'Moving around',
      command: 'ls -la',
      purpose: 'List everything here, hidden files included, with sizes and dates',
      example: 'ls -la ~/Projects',
      flags: [
        f('-l', 'Long format: permissions, size, modified date'),
        f('-a', 'Include dotfiles such as .gitignore'),
        f('PowerShell', 'ls is an alias for Get-ChildItem and rejects -la. Use Get-ChildItem -Force.')
      ],
      destructive: false
    },
    {
      id: 'win-ls-ps',
      shell: 'PowerShell',
      category: 'Moving around',
      command: 'Get-ChildItem -Force',
      purpose: 'List everything here, hidden and system files included',
      example: 'Get-ChildItem -Force | Format-Table Mode, Length, LastWriteTime, Name',
      flags: [
        f('-Force', 'Include hidden and system items'),
        f('-Recurse', 'Descend into subfolders'),
        f('gci / ls / dir', 'All three are aliases for this cmdlet')
      ],
      destructive: false
    },
    {
      id: 'win-cd-up',
      shell: 'Git Bash',
      category: 'Moving around',
      command: 'cd ..',
      purpose: 'Go up one folder level',
      example: 'cd ../..',
      flags: [
        f('cd ~', 'Straight to your home folder'),
        f('cd -', 'Back to the previous folder; PowerShell 7 only, not 5.1')
      ],
      destructive: false
    },
    {
      id: 'win-pwd',
      shell: 'Git Bash',
      category: 'Moving around',
      command: 'pwd',
      purpose: 'Print the full path of the folder you are standing in',
      example: 'pwd -P',
      flags: [
        f('-P', 'Resolve symlinks and show the real path'),
        f('PowerShell', 'pwd is an alias for Get-Location and works unchanged')
      ],
      destructive: false
    },
    {
      id: 'win-explorer',
      shell: 'Git Bash or PowerShell',
      category: 'Moving around',
      command: 'explorer .',
      purpose: 'Open the current folder in File Explorer',
      example: 'explorer .',
      flags: [
        f('start .', 'Does the same thing'),
        f('macOS', 'The equivalent there is open .')
      ],
      destructive: false
    },
    {
      id: 'win-tree-ps',
      shell: 'PowerShell',
      category: 'Moving around',
      command: 'Get-ChildItem -Recurse -Depth 1',
      purpose: 'List the folder structure two levels deep',
      example: 'Get-ChildItem -Recurse -Depth 2 src',
      flags: [
        f('-Depth', 'How many levels down to go; 0 is this folder only'),
        f('tree /F', 'Draws a real tree, but has no depth limit on Windows'),
        f('why not tree -L', 'Windows tree.com takes DOS switches and Git Bash has no GNU tree')
      ],
      destructive: false
    },

    /* --- Files and folders ------------------------------------------- */
    {
      id: 'win-mkdir',
      shell: 'Git Bash',
      category: 'Files and folders',
      command: 'mkdir <folder>',
      purpose: 'Create a folder',
      example: 'mkdir -p src/assets/img',
      flags: [
        f('-p', 'Create any missing parent folders too'),
        f('PowerShell', 'mkdir works, but -p does not. Use New-Item -ItemType Directory -Force.')
      ],
      destructive: false
    },
    {
      id: 'win-touch',
      shell: 'Git Bash',
      category: 'Files and folders',
      command: 'touch <file>',
      purpose: 'Create an empty file, or bump the timestamp on an existing one',
      example: 'touch .gitignore',
      flags: [
        f('-c', 'Do not create the file if it is missing'),
        f('PowerShell', 'There is no touch at all. Use New-Item -ItemType File.')
      ],
      destructive: false
    },
    {
      id: 'win-touch-ps',
      shell: 'PowerShell',
      category: 'Files and folders',
      command: 'New-Item -ItemType File <file>',
      purpose: 'Create an empty file',
      example: 'New-Item -ItemType File .gitignore',
      flags: [
        f('-ItemType Directory', 'Create a folder instead'),
        f('never -Force', 'On an existing file it truncates the contents'),
        f('timestamp only', '(Get-Item <file>).LastWriteTime = Get-Date')
      ],
      destructive: false
    },
    {
      id: 'win-mv',
      shell: 'Git Bash',
      category: 'Files and folders',
      command: 'mv <source> <destination>',
      purpose: 'Rename a file, or move it somewhere else',
      example: 'mv old-notes.md docs/notes.md',
      flags: [
        f('-i', 'Ask before overwriting anything'),
        f('PowerShell', 'mv is an alias for Move-Item and works for simple moves')
      ],
      destructive: false
    },
    {
      id: 'win-cp',
      shell: 'Git Bash',
      category: 'Files and folders',
      command: 'cp <source> <destination>',
      purpose: 'Copy a file or folder',
      example: 'cp -r src build',
      flags: [
        f('-r', 'Copy a whole folder and its contents'),
        f('PowerShell', 'cp is an alias for Copy-Item; -r maps to -Recurse')
      ],
      destructive: false
    },
    {
      id: 'win-rm',
      shell: 'Git Bash',
      category: 'Files and folders',
      command: 'rm -r <folder>',
      purpose: 'Delete a folder and everything inside it, with no recycle bin',
      example: 'rm -rf node_modules',
      flags: [
        f('-f', 'Never prompt, never complain about missing files'),
        f('PowerShell', 'rm -r prompts on non-empty folders and rm -rf fails outright')
      ],
      destructive: true
    },
    {
      id: 'win-mkdir-cd',
      shell: 'Git Bash',
      category: 'Files and folders',
      command: 'mkdir <folder> && cd <folder>',
      purpose: 'Create a folder and step into it in one line',
      example: 'mkdir blog && cd blog',
      flags: [
        f('&&', 'Run the second part only if the first succeeded'),
        f('PowerShell 7', '&& works there too'),
        f('PowerShell 5.1', '&& is a parser error. Use: mkdir blog; if ($?) { cd blog }')
      ],
      destructive: false
    },

    /* --- Reading and searching ---------------------------------------- */
    {
      id: 'win-cat',
      shell: 'Git Bash',
      category: 'Reading and searching',
      command: 'cat <file>',
      purpose: 'Print a whole file to the screen',
      example: 'cat package.json',
      flags: [
        f('-n', 'Number the lines'),
        f('PowerShell', 'cat is an alias for Get-Content and works; add -Raw for one string')
      ],
      destructive: false
    },
    {
      id: 'win-grep',
      shell: 'Git Bash',
      category: 'Reading and searching',
      command: 'grep -rn "<text>" .',
      purpose: 'Search every file below here and print matching lines with numbers',
      example: 'grep -rn "TODO" src',
      flags: [
        f('-r', 'Search subfolders as well'),
        f('-n', 'Show the line number of each match'),
        f('-i', 'Ignore case'),
        f('PowerShell', 'No grep at all, not even as an alias. Use Select-String.')
      ],
      destructive: false
    },
    {
      id: 'win-grep-ps',
      shell: 'PowerShell',
      category: 'Reading and searching',
      command: 'Get-ChildItem -Recurse -File | Select-String "<text>"',
      purpose: 'Search every file below here and print the matching lines',
      example: 'Get-ChildItem -Recurse -File | Select-String "TODO"',
      flags: [
        f('-CaseSensitive', 'Off by default, unlike grep'),
        f('line numbers', 'Included in the output, so there is no -n to add'),
        f('sls', 'The alias for Select-String')
      ],
      destructive: false
    },
    {
      id: 'win-less',
      shell: 'Git Bash',
      category: 'Reading and searching',
      command: 'less <file>',
      purpose: 'Scroll through a long file one screen at a time',
      example: 'less server.log',
      flags: [
        f('q', 'Quit and return to the prompt'),
        f('/text', 'Search forward for text'),
        f('PowerShell', 'No less. Use Get-Content <file> | Out-Host -Paging')
      ],
      destructive: false
    },
    {
      id: 'win-head',
      shell: 'Git Bash',
      category: 'Reading and searching',
      command: 'head -n 20 <file>',
      purpose: 'Print the first lines of a file',
      example: 'head -n 20 access.log',
      flags: [
        f('-n', 'How many lines to show'),
        f('PowerShell', 'No head. Use Get-Content <file> -TotalCount 20')
      ],
      destructive: false
    },
    {
      id: 'win-tail',
      shell: 'Git Bash',
      category: 'Reading and searching',
      command: 'tail -f <file>',
      purpose: 'Watch a file live as new lines are written to it',
      example: 'tail -f server.log',
      flags: [
        f('-f', 'Keep following the file instead of exiting'),
        f('Ctrl + C', 'Stop following'),
        f('PowerShell', 'No tail. Use Get-Content <file> -Wait -Tail 10')
      ],
      destructive: false
    },
    {
      id: 'win-find',
      shell: 'Git Bash',
      category: 'Reading and searching',
      command: 'find . -name "<pattern>"',
      purpose: 'Find files by name rather than by content',
      example: 'find . -name "*.css"',
      flags: [
        f('-type f', 'Files only, no folders'),
        f('-iname', 'Ignore case in the pattern'),
        f('PowerShell', 'find runs Windows find.exe, an unrelated text searcher. Watch for this one.')
      ],
      destructive: false
    },
    {
      id: 'win-find-ps',
      shell: 'PowerShell',
      category: 'Reading and searching',
      command: 'Get-ChildItem -Recurse -Filter <pattern>',
      purpose: 'Find files by name rather than by content',
      example: 'Get-ChildItem -Recurse -Filter *.css',
      flags: [
        f('-Filter', 'Fast, one pattern only'),
        f('-Include', 'Slower, accepts several patterns, needs -Recurse'),
        f('-File', 'Files only, no folders')
      ],
      destructive: false
    },

    /* --- Chaining commands --------------------------------------------- */
    {
      id: 'win-pipe',
      shell: 'Git Bash',
      category: 'Chaining commands',
      command: '<command> | <command>',
      purpose: 'Send the output of one command straight into the next',
      example: 'ls -la | less',
      flags: [
        f('|', 'Pipe: pass output onward'),
        f('>', 'Redirect output into a file, replacing it'),
        f('PowerShell', 'Same | syntax, but it passes objects, not lines of text')
      ],
      destructive: false
    },
    {
      id: 'win-redirect',
      shell: 'Git Bash',
      category: 'Chaining commands',
      command: 'echo "<text>" > <file>',
      purpose: 'Write text into a file, replacing whatever was there',
      example: 'echo "node_modules/" > .gitignore',
      flags: [
        f('>', 'Overwrite the file from the first byte'),
        f('>>', 'Append instead, keeping the existing contents'),
        f('PowerShell', 'Writes UTF-16 or UTF-8 with a BOM, not the plain UTF-8 Git expects')
      ],
      destructive: true
    },
    {
      id: 'win-redirect-ps',
      shell: 'PowerShell',
      category: 'Chaining commands',
      command: 'Set-Content -Encoding utf8 <file> "<text>"',
      purpose: 'Write text into a file as plain UTF-8, replacing the contents',
      example: 'Set-Content -Encoding utf8 .gitignore "node_modules/"',
      flags: [
        f('Add-Content', 'Append to the end instead of replacing'),
        f('-Encoding utf8', 'Without it you get the shell default, which Git misreads'),
        f('Out-File', 'Same job, also needs -Encoding utf8')
      ],
      destructive: true
    },
    {
      id: 'win-append',
      shell: 'Git Bash',
      category: 'Chaining commands',
      command: 'echo "<text>" >> <file>',
      purpose: 'Add text to the end of a file, keeping what is already there',
      example: 'echo ".env" >> .gitignore',
      flags: [
        f('>>', 'Append to the end of the file'),
        f('PowerShell', 'Add-Content -Encoding utf8 <file> "<text>"')
      ],
      destructive: false
    },
    {
      id: 'win-ls-grep',
      shell: 'Git Bash',
      category: 'Chaining commands',
      command: 'ls -la | grep "<text>"',
      purpose: 'List the folder, then keep only the lines that match',
      example: 'ls -la | grep ".html"',
      flags: [
        f('-v', 'Invert: keep the lines that do NOT match'),
        f('PowerShell', 'Both halves fail there. Use Get-ChildItem -Force | Where-Object Name -like "*.html"')
      ],
      destructive: false
    },
    {
      id: 'win-wc',
      shell: 'Git Bash',
      category: 'Chaining commands',
      command: 'wc -l <file>',
      purpose: 'Count the lines in a file',
      example: 'wc -l styles.css',
      flags: [
        f('-l', 'Lines'),
        f('-w', 'Words'),
        f('PowerShell', 'No wc. Use (Get-Content <file> | Measure-Object -Line).Lines')
      ],
      destructive: false
    },
    {
      id: 'win-curl',
      shell: 'Git Bash',
      category: 'Chaining commands',
      command: 'curl -s <url> | less',
      purpose: 'Fetch a page and read the response without saving it',
      example: 'curl -s https://example.com | less',
      flags: [
        f('-s', 'Hide the progress meter'),
        f('-o', 'Write the response to a file'),
        f('PowerShell 5.1', 'curl is an alias for Invoke-WebRequest and rejects -s')
      ],
      destructive: false
    },
    {
      id: 'win-curl-ps',
      shell: 'PowerShell',
      category: 'Chaining commands',
      command: 'curl.exe -s <url>',
      purpose: 'Fetch a page with the real curl, bypassing the alias',
      example: 'curl.exe -s https://example.com',
      flags: [
        f('.exe suffix', 'Forces the real binary, shipped in System32 since Windows 10'),
        f('Invoke-WebRequest', 'The native cmdlet; read the body with -ExpandProperty Content'),
        f('paging', 'Pipe into Out-Host -Paging, since there is no less')
      ],
      destructive: false
    },

    /* --- Housekeeping --------------------------------------------------- */
    {
      id: 'win-clear',
      shell: 'Git Bash or PowerShell',
      category: 'Housekeeping',
      command: 'clear',
      purpose: 'Wipe the screen without losing the scrollback',
      example: '',
      flags: [
        f('Ctrl + L', 'Does the same thing without typing anything'),
        f('Ctrl + C', 'Stop whatever is running right now'),
        f('cls', 'The other PowerShell alias for Clear-Host')
      ],
      destructive: false
    },
    {
      id: 'win-history',
      shell: 'Git Bash',
      category: 'Housekeeping',
      command: 'history | grep <text>',
      purpose: 'Find a command you ran before without scrolling back',
      example: 'history | grep git',
      flags: [
        f('Ctrl + R', 'Search history interactively as you type'),
        f('Up arrow', 'Bring back the previous command'),
        f('PowerShell', 'Get-History | Where-Object CommandLine -like "*git*"')
      ],
      destructive: false
    },
    {
      id: 'win-which',
      shell: 'Git Bash',
      category: 'Housekeeping',
      command: 'which <command>',
      purpose: 'Show where a program lives, or confirm it is installed',
      example: 'which node',
      flags: [
        f('-a', 'List every match on your PATH, not just the first'),
        f('path style', 'Reports /c/Program Files/... rather than C:\\Program Files\\...'),
        f('PowerShell', 'No which. Use Get-Command.')
      ],
      destructive: false
    },
    {
      id: 'win-which-ps',
      shell: 'PowerShell',
      category: 'Housekeeping',
      command: 'Get-Command <command>',
      purpose: 'Show where a program lives, or confirm it is installed',
      example: 'Get-Command node',
      flags: [
        f('.Source', 'Wrap in parentheses for the bare path: (Get-Command node).Source'),
        f('-All', 'List every match, not only the one that wins')
      ],
      destructive: false
    },
    {
      id: 'win-help',
      shell: 'Git Bash',
      category: 'Housekeeping',
      command: '<command> --help',
      purpose: 'Read the built-in usage notes for a command',
      example: 'grep --help',
      flags: [
        f('no man pages', 'Git for Windows does not install them, so man fails here'),
        f('git help <sub>', 'Opens the full Git documentation in your browser')
      ],
      destructive: false
    },
    {
      id: 'win-get-help-ps',
      shell: 'PowerShell',
      category: 'Housekeeping',
      command: 'Get-Help <command> -Full',
      purpose: 'Read the full documentation for a PowerShell command',
      example: 'Get-Help Get-ChildItem -Full',
      flags: [
        f('-Examples', 'Just the worked examples'),
        f('Update-Help', 'Downloads the full text the first time'),
        f('man is an alias', 'So man ls answers about Get-ChildItem, not the Unix ls')
      ],
      destructive: false
    }
  ];

  /* ----------------------------------------------------------------
     Expand the tables above into the flat array the pages read.
     Git is identical on both systems, so each git entry is emitted
     once per OS with the right shell label.
     ---------------------------------------------------------------- */
  var out = [];

  GIT.forEach(function (c) {
    ['mac', 'windows'].forEach(function (os) {
      var flags = c.flags ? c.flags.slice() : [];
      if (os === 'windows' && c.winNote) {
        flags = flags.concat([f('PowerShell', c.winNote)]);
      }
      out.push({
        id: c.id + '-' + os,
        os: os,
        tool: 'git',
        shell: os === 'mac' ? 'zsh' : 'Git Bash or PowerShell',
        category: c.category,
        command: c.command,
        purpose: c.purpose,
        example: c.example || '',
        flags: flags,
        destructive: !!c.destructive
      });
    });
  });

  BASH_MAC.forEach(function (c) {
    out.push({
      id: c.id,
      os: 'mac',
      tool: 'bash',
      shell: c.shell || 'zsh',
      category: c.category,
      command: c.command,
      purpose: c.purpose,
      example: c.example || '',
      flags: c.flags || [],
      destructive: !!c.destructive
    });
  });

  BASH_WINDOWS.forEach(function (c) {
    out.push({
      id: c.id,
      os: 'windows',
      tool: 'bash',
      shell: c.shell || 'Git Bash',
      category: c.category,
      command: c.command,
      purpose: c.purpose,
      example: c.example || '',
      flags: c.flags || [],
      destructive: !!c.destructive
    });
  });

  window.COMMANDS = out;
  window.CATEGORY_ORDER = CATEGORY_ORDER;
})();
