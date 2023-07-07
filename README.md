# Custom code for gorgias.com (hosted on webflow)

## About The Project
This repository contains all the custom code (JS or CSS) used on gorgias.com
While gorgias.com is built with webflow, a low code CMS platform, it requires sometimes to add custom code for some specific use cases. You can always add [Embed custom code through webflow](https://university.webflow.com/lesson/custom-code-embed), but it's not a code practise at scale: It's hard to maintain as we don't know where is what, and it doesn't allow streamline collaboration.

So as alternative, we built this github repository to centralize all of our custom code

### Benefits
- the custom code is easier to maintain
- Multiple stackholders can work in parallel
- It increases website performance: not repeated code, better usage of cache, etc.

## How does it work?
1. The code is stored on this Github repository
2. We use jdDelivr as CDN to deploy our repo
3. the critical scripts are loaded directly the head of our website, within the webflow admin backoffice [here](https://webflow.com/dashboard/sites/gorgiasio/code)
4. Critical scripts are loaded from webflow admin , in the <head> in order to not load async. 
5. For non-critical scripts are called from /src/main.js, which is loaded async, for performances purposes.
4. In this head, we also have a routing logic that allow us to work on local and test our code releasing (more info in the above section "How to use local repository to develop?")

### jsDelivr & Deployement
After every branch merges, it can take take up to 7 days to jsDelivr to update @latest version of files hosted on Github. To avoid this, JsDelivr offers a purge functionnality. That being said, it can still take a few hours.

So after each branch merge, it requires to execute manually the 2 following steps
1. Purge the CDN version of the files you've updated (format: https://cdn.jsdelivr.net/gh/gorgias/gorgias-webflow@latest/{{path}}/{{file}}.min.ext)
2. Update the "commitVersion" variable in the head of the website through the webflow admin [here](https://webflow.com/dashboard/sites/gorgiasio/code) with the latest branch version published (and don't forget to publish the website).
- Here is where you can find the latest branch Version in Github: https://share.getcloudapp.com/7KuzZ8gD. You can also You can also run to command line git branch -v
- Here is where you have to update the commitVersion in Webflow: https://share.getcloudapp.com/mXuDW6nY


### How to use local repository to develop
You can test your local code before deployement by using Visual code Studio and the extension Live server
- Once the extension is installed, click on the bottom right corner button "Go live": https://share.getcloudapp.com/6quboede
- It will open http://127.0.0.1:5500/. It means your local code is now runing on a local server. You can close the tab.
- Then, add "?debug=gorgias" in the gorgias URL page of the page want to test with your local code. This trick will load your local files instead of the CDN ones.
- Once ever


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


## Expertiments and A/B testing
We run A/B testing our our website to learn and improve website performances. We use posthog.com to run experiments. The script /js/posthog.js is loaded in the head of the webflow (from webflow admin backoffice) end is embeded in segment.com snippet in order to avoid any tracking or flicker issue.

That being said - if adblockers are installed on a a visitor browser, there is a risk for Segment snippet to not load. In that case, it also means posthog script won't log.
Depending of the A/B testing purposes, it can create unexpected issue on the frontend.  To by path this issue, we have created /js/experiments.js. This is where you will create functions that will handle the default behavior (so in case of the ads-blocker is triggers)
E.g.: We have a list of customer logos hidden by default in webflow. A posthog experiment display only a few of them. If the adblocker is detected, then the posthog experiment won't load customer logos. To bypass this, we have created a function in /js/experiments that will display default logos after 3 seconds in case no logos have been displayed by the posthog scripts.