// Schema

/* Schema.org Website */
var script1 = document.createElement('script');
var scriptId1 = 'schema-website';
script1.setAttribute("type","application/ld+json");
script1.setAttribute("id",scriptId1);
script1.text = '{"@context": "https://schema.org/","@type": "WebSite","name": "Gorgias","url": "https://www.gorgias.com/","description": "Customer Service Made Easy for Online Stores"}';
$('body')[0].appendChild(script1);  
/* END Schema.org Website */

/* Schema.org Organization */
var script2 = document.createElement('script');
var scriptId2 = 'schema-organization';
script2.setAttribute("type","application/ld+json");
script2.setAttribute("id",scriptId2);
script2.text = '{"@context": "https://schema.org/","@type": "Organization","name": "Gorgias","url": "https://www.gorgias.com/","logo": "https://uploads-ssl.webflow.com/5e4ff204e7b6f80e402d407a/5e693ac1927efe8a51c9662b_logo-gorgias.svg"}';
$('body')[0].appendChild(script2);  
/* END Schema.org Organization */

/* Schema.org Software Application */
var script3 = document.createElement('script');
var scriptId3 = 'schema-software-application';
script3.setAttribute("type","application/ld+json");
script3.setAttribute("id",scriptId3);
script3.text = '{"@context": "https://schema.org/","@type": "SoftwareApplication","name": "Gorgias","aggregateRating": {"@type": "AggregateRating","ratingValue": "4.6","ratingCount": "484","reviewCount": "484","bestRating": "5","worstRating": "2"},"applicationCategory": "BusinessApplication","operatingSystem": ""}';
$('body')[0].appendChild(script3);  
/* END Schema.org Software Application */