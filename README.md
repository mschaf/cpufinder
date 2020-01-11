# cpufinder
cpufinder is a chrome extension to find CPU names in the title of ebay listings
and look them up on https://www.cpubenchmark.net/ to get some quick information about the cpu.

I wrote this to quickly evaluate if a server is worth to buy based on the cpu. 
It works with most of Intels server lineup right now, but adding more CPUs is just a matter of adding them to a regex.

This is by no means stable as it scrapes the information of https://www.cpubenchmark.net/ which might break at anytime. It also breaks if ebay changes the css classes of their title bars.

![exmaple listing](example.png?raw=true)
