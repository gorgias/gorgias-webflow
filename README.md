# Organization of the Gorgias custom code

Repo to organize all Webflow custom codes including :
- JS files
- CSS files

All files will be served from JS delivr

## How to create jsdelivr files

The pattern is :
https://cdn.jsdelivr.net/gh/{{user}}/{{repo}}/{{file}}

So, for us it should be :
https://cdn.jsdelivr.net/gh/gorgias/gorgias-webflow/{{file}}


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