## Onboarding Portal

Styling - Tailwind CSS
State Management - Zutstand
API Management - SWR or Redux Toolkit or Saga
Style Management - CSS and Tailwind


We will follow the approach for component design - Global Component / Individual Component:

- src
- core	
assets
config
constants
common.json
components (global components)
hooks
layout
utils
interface
data
pages
	- routes 
module
		- home 
			- index.tsx - No Static Contents
			- index.json - Serves all static content for pages
			- components - Page Based Components
			- hooks- Page Based Hooks
			- utils - Page Based Utils
  			- interface - UI Layer 
			- data 
				- api
				- interface - Data Layer Interface

	-> Next JS Linting + TS Linting
	-> Global Path
-> Colors -> global.css (Infima)
		- theme
			Dark ( white=> #fff)
			Light  ( white => #000)
	-> tailwind config
