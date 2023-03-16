# Custom code for gorgias.com (hosted on webflow)

## About The Project
This repository contains all the custom code (JS or CSS) that we need on gorgias.com
Instead of embedding our code in the admin interface of webflow, or even directly in the body of pages indvidually using webflow embed element, we decided to centralize it in one place

### Benefits
- easily maintain the custom
- Increase website performance: not repeated code, better usage of cach

## How does it work? (WIP)
- CDN using JS deliver
- Critical scripts are loaded from webflow admin interface, in head / sync
- Other scripts are called from /src/main.js
- Note: Need to purge CDN cache after repo has been updated

## Structure of the repo
Repo to organize all Webflow custom codes including :
- JS files
- CSS files

## jsDelivr (WIP)

### Purge
After every update publication, it may takes by default up to 7 days to jsDelivr to update @latest version of files hosted on Github.
To avoid this, we can purge the URL of the files which have been modified. 2 Options
- Use https://www.jsdelivr.com/tools/purge
- Visit https://purge.jsdelivr.net/gh/gorgias/gorgias-webflow@latest/{{file-path}}/{{filename.extension}}

Note: Even with purging, it may take a few hours for jsDelivr to propagate the update to all servers. It means some visitors may not load the last version of the files. To avoid this issue, You can edit temporary the file path of the files in webflow admin in the <head>, until the last version to be deployed. Simply reaplce @latest by the version fo the branch published (e.g. @4992840). You can find the version of the branch by runing to command line git branch -v

## Debug mode

### How to use local repository to develop (wip)
- add "debug=gorgias" in the URL of the page
- How it works ? condition in webflow <head> to call local repo vs cdn one 
- Use Go live feature in Visual studio (wip)
## Github Branch naming convention

### Best practices
1. Use descriptive names
2. Use lowercase letters
3. Use short names
3. Use hyphens or underscores
4. Avoid using special characters
5. Use a prefix for feature branches

### Prefix examples
- migration/{{code-to-migrate}} --> Use to migrate custom code from webflow to to github. E.g. migration/js-css-demo
- fix/{{what-you-fix}} --> Use to fixe a bug. E.g. fix/autocompletion-demo-form-fields
- new/{{what-you-built-new}} --> Use to add new features. E.g. new/graident-effect-animation-h1
- refactor/{{what-you-clean}} --> refactor/simplify-script-pricing-page
- refactor/{{what-you-clean}} --> refactor/simplify-script-pricing-page
- improve/{{what's-your-update}} --> e.g. improve/readme-purge
