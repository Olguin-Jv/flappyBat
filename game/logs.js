function showLogs(device){
    if(device == "Smartphone" || device == 'Tablet'){
        eruda.init();
        console.log(`User device: ${userDevice}`)
    }
}

showLogs(userDevice);
