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

## Structure of the repo
Repo to organize all Webflow custom codes including :
- JS files
- CSS files

## jsDelivr

After every commit, it may takes by default up to 7 days to jsDelivr to update @latest version of files hosted on Github. To avoid this, JsDelivr offers a purge functionnality, but it doesn't work properly.

To prevent the delay, each time you publish a branch, update the commitVersion in the head of the website admin with the latest branch version published (and don't forget to publish the website)
- Here is where you can find the latest branch Version in Github: https://share.getcloudapp.com/7KuzZ8gD. You can also You can also run to command line git branch -v
- Here is where you have to update the commitVersion in Webflow: https://share.getcloudapp.com/mXuDW6nY


## Debug mode

### How to use local repository to develop
You can test your local code before deploying by using Visual code Studio and the extension Live server
- Once the extension is installed, click on the bottom right corner button "Go live": https://share.getcloudapp.com/6quboede
- It will open http://127.0.0.1:5500/. It means all good, your local code is now runing on a local server. You can close the tab
- Then, add "?debug=gorgias" in the gorgias URL of the page want to test your local code
- In the admin of the webflow website (<head> tag -> https://share.getcloudapp.com/7KuzZ8BW), a function replaces all remote repository URLs by the local ones when "?debug=gorgias" is in the URL 


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


## Expertiments (WIP)
We use posthog.com to run experiments. The script /js/posthog.js is loaded in the head of the webflow (from webflow admin backend) end is embeded in segment.com snippet.

In case of adblocker installed on visitor browser, segment snippet won't load. It also means posthog script won't log.
To prevent unexpected issue on the frontend interface, sometimes you will have to create function to update the DOM in order to fit with the default behavior in case of ad blocker because your XP won't work.
Because /js/posthog.js won't be loaded, we created /js/experiments.js. You can create functions that will make sure the default behavior of your experiment is triggered
E.g.: customer logos are by default hidden on webflow. A posthog experiment display only a few of them. If the adblocker is detected, then the posthog experiment won't load customer logos. To by pass this, we have created a function in /js/experiments that will display default logos after 3 seconds in case no logos have been displayed by the posthog scripts.