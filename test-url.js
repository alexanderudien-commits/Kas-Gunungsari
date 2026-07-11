const url = 'https://kas-gunungsari-client.vercel.app';
fetch(url).then(r=>r.text()).then(t=>{
    const m = t.match(/src=\"(.*?\.js)\"/);
    if(m) {
        fetch(url+m[1]).then(r=>r.text()).then(js=>{
            console.log('localhost:', js.includes('localhost:3000'));
            console.log('server:', js.includes('kas-gunungsari-server'));
        });
    }
});
