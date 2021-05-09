// what this did is that set a global var peter to store pusher register info
window.peter = {
    pusher: new Pusher(process.env.key, {
        cluster: 'us3',
    }),
}