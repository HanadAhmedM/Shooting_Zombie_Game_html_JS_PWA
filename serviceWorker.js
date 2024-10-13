self.addEventListener('install',(e) => {

    //console.log("serviceWork Installed",e)
e.Waituntill(caches.open(appCrasheName)
.then(cache =>{
    cache.addAll(assets)
    console.log("caching Assets");
}));


    
})


self.addEventListener('activate',(e) => {
    console.log("serviceWork Activated",e);
 
})


self.addEventListener("fetch", (e)=>{

    //console.log("Fetch Event",e)
    e.respondWith(caches.match(e.request)
    .then(cacheResponse => {
return cacheResponse|| fetch(e.request);

    }))

})

const appCrasheName = "app-cache";

const assets = [
    "/",
    "/index.html",
    "/script.js",
    "/style.css",
    "/manifest.json",
    "/Icon/icon_192.png",
    "/Icon/icon_512.png",
    "/Image/player.png",
    "/Image/zombi.gif",
    "/Image/Platform1.png",
    "/Image/Platform2.png",
    "/Image/Platform3.png"
];
