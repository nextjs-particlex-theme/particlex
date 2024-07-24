> ⚠️ **This project is under construction, stay tuned.**
>
> Maybe you can check out my former project: [hexo-theme-particlex](https://github.com/IceOfSummer/hexo-theme-particlex) , 
> I am trying to refactor this project to current new project.

# Known Issue

## Static resources must be put in `source/images` in your hexo blog.

**The static resources like image or etc. must put in `source/images` in your hexo blog files**,
this is the limitation of next.js: [Route Resolution](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#route-resolution).

If `Page Component` use same dynamic route with `Route Handlers`, the last one will have primary order, so the `Page Component`
will never render. I have tried `Parallel Routes`, but it not work...
