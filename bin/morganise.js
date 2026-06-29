#!/usr/bin/env node

import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import fs from 'node:fs';
import path from 'node:path';
import { execSync, spawn } from 'node:child_process';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const MORGAN_ART = `
*********************=----------------------------------------------=+++===--+**********************
*******************=-----------------------------------------------------------+********************
****************+=--------------------====----------=---=====++++=----------=+*********************
*******************=------==--====+====++++=---==++=++==+++++++++++++==------==+********************
*****************=--------=+++++++++++++++++=+++++++++++++++++++++++++++=------+********************
****************+==--=++++++++++++++++++++++++++++++++++++++++++++++++==--------=*******************
******************----=++++++=--=+++++++++++++++++++++++++++++==-:::=++++++=----+*******************
*****************----++++++=:...:::::---====++++++++++===-::::::::...-+++++++=----+*****************
****************=---==+++=-....:::::::::::::::-=-:::::::::::::::::....:=+++++=----******************
***************=--=+++++=:.....::::::::::::::::::::::::::::::::::::.....-++++=----******************
****************+--=+++=:.....::::::::::::::::::::::::::::::::::::::.....-+++++=--=*****************
****************=-=+++=:......::::::::::::::::::::::::::::::::::::::.....:=++++=--=+****************
***************+--++++:......::::::::::::::::::::::::::::::::::::::::.....:++++=-=******************
***************=--+++=......::::::::::::::::::::::::::::::::::::::::::.....=+++--=******************
****************=-=++=:.....::::::::::::::::::::::::::::::::::::::::::.....=++++==******************
****************=-=+++-.:------::::::::::::::::::::::::::::::::::::::::...:++++=-=******************
****************+=+++=:-=-=+++++++=-::::::::::::::::::-:::::::::-====--:...-++++==******************
*****************=++=...:-=======+++++=-:::::::::::::------=++++++++++=-=-:.:=++++******************
*****************+++++:....:-------====+++=-::::::::-=++++=======---===--:::-++++*******************
************###***+++-....:**+++++++**#+--==-:::::::------=+*#*++++++**-....:=+++***###*************
*********#@@##%@@#*++:....-%@@@@@@@@@%*=----:::::::::----=+*%@@@@@@@@@#:....:=++*#@%#*%@#***********
*********%%-++--*#*++-....+=.:+###+.:*+++=-:::::::::::--=+=*####::+=.:*=....:+++##-:=*=*@#**********
********#@+#=:=#-=++++:.......+**##***:..:::::::::::::::...=#*###*#=........-++++:+*-:**@%**********
********#@=#-=###-++++=........+****+:...:::::::::::::::....=*****-........:+++=-*##*:+*%%**********
********#@+==:::+*=++++-.....:::::::::::::::::::::::::::::::::::::::::....:++++==*::::*=%%**********
********#@#::::*##+*+++=:..:::::::::::::::::::----:::::::::::::::::::::...=+++*=**#-:::=@#**********
*********%@-::**=%=**-:::.:::::::::::::::::::-==---:::::::::::::::::::::.:-:-**:**=#-::#@***********
**********@%+***#-.+%-::::::::::::::::::::::-*%-::::::::::::::::::::::::::::=%=.:#=#*++@#***********
***********@#=%%*#--%*:::.:::::::::::::::::-#@-:::::::::::::::::::::::::.::-*#::***@+*@%************
************%@=+##%%@@-....:::::::::::::::-%@+::::::::::::::::::::::::::...-@@#%###=#@#*************
*************#@#=...=@+....:::::::::::::::::-+*=---::::::::::::::::::::....#@+...:*@%***************
***************#@@#*#@%-....::::::::::::::----==-----:-::::::::::::::::...=@@%*#%@%#****************
******************###*@#:...:::::::::::------=--::---=--==-:::::::::::...=@%*###********************
**********************#@%:...:::::::::--:-:::::::::::::::::-:::::::::...=@%*************************
**********************#@%=...::::::::-:-+*##%%%%%%%%%##*::-::::::::...+@#**************************
************************%@+...::::::--::::::::::::::::::::-:::::::..:#@#***************************
**************************#@%-...:::::-:::::-==+++=::::::::--::::...+@%*****************************
****************************%@*:...:::-:::::-==***#*=-:::::--::...-%@#******************************
******************************%@+:...:--::::::------::::::--:...:#@#********************************
*******************************#%@+:.:-=::::--::--::::::---:..-#@%**********************************
**********************************%@#-::-:=:-:=--------=:::-*@@#************************************
**********************##############%@@#-..:-:::---:.-:.-+@@@@@@@@@@@@@@@@@%#***********************
*******************%@@@@%%%%%%%%%%%@@%-+%@#*-:....-:-+%@%*::%@@@@%%%%%%%%%%%@@@%#*******************
****************%@@%####****#%####@@%-.::=+%%@@@@%%#+=:::.-@@@@####********##%@@%******************
***************#@@%####%%%%###%@@@@@@@%:::::::::::::::::::=%@@@@%@@###%%%%###**#%@@*****************
***************%@#**#@@@@@@@@@@@@@@@@@@@%*=-:::::::::--=*%@@@@@@@@@@@@@@@@@@%#**#@@#****************
**************#@%#*#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#***#@@#***************
**************%@%###@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%#***@@#***************
**************%@%##%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%#**#%@#***************
**************%@%##%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%###*%@#***************
**************%@%##%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%#***%@#***************
**************%@%###@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#***%@#***************
**************%@%###@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#***%@#***************
**************%@%#*#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#***%@#***************
**************%@%###@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#***%@#***************
`;

function loadConfig() {
  const config = {
    repo: 'your-org/your-repo',
    limit: 30,
    issueTemplate: 'Issue: {repo}#{issue}',
    issuePrompt: 'Github issue number'
  };

  try {
    const pkgPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      if (pkg.morganise) {
        if (pkg.morganise.repo) config.repo = pkg.morganise.repo;
        if (typeof pkg.morganise.limit === 'number') config.limit = pkg.morganise.limit;
        if (pkg.morganise.issueTemplate) config.issueTemplate = pkg.morganise.issueTemplate;
        if (pkg.morganise.issuePrompt) config.issuePrompt = pkg.morganise.issuePrompt;
      }
    }
  } catch (e) {
    // Ignore error
  }

  const rcPaths = [
    path.join(process.cwd(), '.morganiserc'),
    path.join(process.cwd(), '.morganiserc.json')
  ];
  for (const rcPath of rcPaths) {
    try {
      if (fs.existsSync(rcPath)) {
        const rc = JSON.parse(fs.readFileSync(rcPath, 'utf8'));
        if (rc.repo) config.repo = rc.repo;
        if (typeof rc.limit === 'number') config.limit = rc.limit;
        if (rc.issueTemplate) config.issueTemplate = rc.issueTemplate;
        if (rc.issuePrompt) config.issuePrompt = rc.issuePrompt;
        break;
      }
    } catch (e) {
      // Ignore error
    }
  }

  return config;
}

function getGitRepo(fallbackRepo) {
  try {
    const remoteUrl = execSync('git config --get remote.origin.url', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    if (remoteUrl) {
      // Match popular services (github, gitlab, bitbucket)
      const match = remoteUrl.match(/(?:github\.com[:/]|gitlab\.com[:/]|bitbucket\.org[:/])([^/]+\/[^/.]+?)(?:\.git)?$/);
      if (match) {
        return match[1];
      }
      // Fallback: match generic URL format
      const genericMatch = remoteUrl.match(/[:/]([^/:]+\/[^/.]+?)(?:\.git)?$/);
      if (genericMatch) {
        return genericMatch[1];
      }
    }
  } catch (e) {
    // Git command failed or not in git repo
  }
  return fallbackRepo;
}

function hasStagedChanges() {
  try {
    execSync('git diff --cached --quiet');
    return false;
  } catch (e) {
    return true; // exits with status 1 when there are staged changes
  }
}

function copyToClipboard(text) {
  return new Promise((resolve, reject) => {
    // Standard macOS tool
    const pbcopy = spawn('pbcopy');
    pbcopy.on('error', err => reject(err));
    pbcopy.on('close', () => resolve());
    pbcopy.stdin.write(text);
    pbcopy.stdin.end();
  });
}

async function run() {
  const config = loadConfig();
  const repo = getGitRepo(config.repo);

  // Check if we are running in Git Hook mode.
  // Git calls prepare-commit-msg with: .git/COMMIT_EDITMSG as process.argv[2]
  const commitMsgFile = process.argv[2];
  const isGitHook = commitMsgFile && fs.existsSync(commitMsgFile);

  console.log(`\n${colors.green}${colors.bright}🤖 Morganise CLI${colors.reset} — Making the world a better place, one commit at a time!`);

  const rl = readline.createInterface({ input, output });

  try {
    // 1. Issue Number
    let issue = '';
    while (!issue) {
      issue = (await rl.question(`${colors.cyan}?${colors.reset} ${config.issuePrompt}: `)).trim();
      if (!issue) {
        console.log(`${colors.red}Please enter a valid ${config.issuePrompt}, s'il vous plait.${colors.reset}`);
      }
    }

    // 2. Commit Title
    let title = '';
    while (true) {
      title = (await rl.question(`${colors.cyan}?${colors.reset} Commit title: `)).trim();
      if (!title) {
        console.log(`${colors.yellow}Morgan says untitled commit messages make him sad, please add one${colors.reset}`);
      } else if (title.length > config.limit) {
        console.log(`${colors.yellow}Ooh la la! Morgan says your commit title is too long, please shorten it to less than ${config.limit} characters (current length: ${title.length})${colors.reset}`);
      } else {
        break;
      }
    }

    // 3. Work Items
    const contentArray = [];
    let contentIteration = 1;
    console.log(`\nAdd the work you've completed. Once you're finished, type '${colors.green}done${colors.reset}'\n`);

    while (true) {
      const contentInput = (await rl.question(`Work item ${contentIteration}: `)).trim();
      if (contentInput.toLowerCase() === 'done') {
        if (contentArray.length === 0) {
          console.log(`${colors.red}Morgan says you must add at least one work item before finishing!${colors.reset}`);
          continue;
        }
        break;
      }

      if (!contentInput) {
        console.log(`\n${colors.red}Morgan is upset that this item is empty, please add some content${colors.reset}\n`);
      } else {
        contentArray.push(contentInput);
        contentIteration++;
      }
    }

    // Generate output
    const content = contentArray.join('\n- ');
    const issueString = config.issueTemplate
      .replace('{repo}', repo)
      .replace('{issue}', issue);
    const commitMsg = `${title}\n${issueString}\n\n- ${content}`;

    console.log(`\nHere is your Morganised commit message:\n--------------------------------------\n\n${colors.cyan}${commitMsg}${colors.reset}\n\n--------------------------------------\nMerci!\n`);

    // Output Morgan's face in styled cyan
    console.log(colors.cyan + MORGAN_ART + colors.reset);

    if (isGitHook) {
      // Hook mode: Write message directly to git file
      fs.writeFileSync(commitMsgFile, commitMsg, 'utf8');
      console.log(`${colors.green}✔ Commit message successfully written to Git!${colors.reset}\n`);
    } else {
      // Interactive Mode: Offer Copy / Commit options
      const copyAns = (await rl.question(`${colors.cyan}?${colors.reset} Copy this commit message to clipboard? (Y/n): `)).trim().toLowerCase();
      if (copyAns === 'y' || copyAns === '') {
        try {
          await copyToClipboard(commitMsg);
          console.log(`${colors.green}✔ Copied to clipboard!${colors.reset}`);
        } catch (e) {
          console.log(`${colors.red}✖ Failed to copy to clipboard automatically.${colors.reset}`);
        }
      }

      // Check if inside Git repository and has staged changes
      let inGit = false;
      try {
        execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
        inGit = true;
      } catch (e) { }

      if (inGit && hasStagedChanges()) {
        const commitAns = (await rl.question(`${colors.cyan}?${colors.reset} Stage is not empty. Commit these changes directly now? (y/N): `)).trim().toLowerCase();
        if (commitAns === 'y') {
          try {
            execSync(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });
            console.log(`\n${colors.green}✔ Successfully committed with Morganised message!${colors.reset}`);
          } catch (e) {
            console.log(`\n${colors.red}✖ Failed to commit: Git returned an error.${colors.reset}`);
          }
        }
      } else if (inGit) {
        console.log(`\n${colors.dim}Note: No staged changes found, skipping commit prompt.${colors.reset}`);
      }
    }
  } catch (err) {
    console.error(`\n${colors.red}An error occurred: ${err.message}${colors.reset}`);
    process.exit(1);
  } finally {
    rl.close();
  }
}

run();
