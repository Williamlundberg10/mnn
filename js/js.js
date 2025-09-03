function pq(){
    caches.keys().then((keys) => 
        Promise.all(
            keys.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log("[SW] Deleting old cache:", key);
                    return caches.delete(key);
                }
            })
        )
    )
}