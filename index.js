var GetEntry = (function(){
    var fileSystem;
    var paths;
    function GetEntry(fsModule,pathModule){
        fileSystem = fsModule;
        paths = pathModule;
    }
    GetEntry.prototype.returnEntryObject = function(){
        
        fileSystem.readdir(paths.resolve(__dirname),(err,files)=>{
            console.log(files);
        })

        return new Object();
    }
    return GetEntry;
})()


