const fs = require('fs');
const path = require('path');

let GetEntry = (function(){
    let fileSystem;
    let paths;
    let dirCounts = 0;

    function GetEntry(fsModule,pathModule){
        fileSystem = fsModule;
        paths = pathModule;
    }
    GetEntry.prototype.returnEntryObject = function(){
        let base = '../pine-ui/js/';
        dirCounts = getDirectories(base);
        console.log(dirCounts);
        for(let i = 0 ; i <= dirCounts ; i++){
             search(base,false,i);
        }
        
        return new Object();
    };
    let search = function(base,flag,index,appendix){
        if(!flag){
            let tempCounts = getDirectoryCounts(base+(appendix||''));
        }
        let currentDir = base+(appendix ||'');

        let tempDirCount  = fileSystem.readdir(path.resolve(currentDir),(err,files)=>{
            return files;
        });
        
        //return search(base,appendix,depth);
    };

    let getDirectoryCounts = function(currentDir){
        let counts = 0;
        let directories = [];
        //get files
        let files = fileSystem.readdirSync(path.resolve(currentDir),(err,files)=>{
            return files;
        });
        //extract directories
        files.forEach(function(ele,idx){
            if(fileSystem.lstatSync(currentDir+ele).isDirectory()){
                counts++;
                directories.push(ele);
            }else{

            }
        });
        return {counts:counts , directories : directories , scripts : scripts};
    }
    return GetEntry;
})()



let entry = new GetEntry(fs,path);
entry.returnEntryObject();


