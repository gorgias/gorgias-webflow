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

