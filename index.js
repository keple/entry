let fs = require('fs');
let path = require('path');

var GetEntry=(function(){
    let fileSystem;
    let paths;
    let dirCounts = 0;
    let filenameExp;
    let separator = path.sep;
    let base;
    let excludePaths = [];
    let hmrFlag = false;
    function GetEntry(option){
        fileSystem = option.fs;
        paths = option.path;
        base = option.base;
        excludePaths = option.exclude;
        hmrFlag = option.useHmr;
    }
    GetEntry.prototype.setRegexp = function(regExp){
        filenameExp = new RegExp(regExp);
    }
    GetEntry.prototype.setSubRegExp = function(regExp){
        subExp = new RegExp(regExp);
    }
    GetEntry.prototype.returnEntryObject = function(){
        
        if(!checkExclude(base)){
            return [];
        }
        let dirObj = getDirectories(base,true);
        
        let allFiles = dirObj.scripts;
        //console.log(dirObj);
        dirCounts = dirObj.counts;
        //console.log(dirObj.directories);
        console.log(dirObj.scripts.length);
        for(let i = 0 ; i < dirCounts ; i++){
            allFiles = allFiles.concat(search(base,false,dirObj.directories[i]));
        };
        
        console.log(allFiles.length);
        
        return genEntry(allFiles);
    };
    let checkExclude = function(currentDir){
        for(let i = 0 ; i< excludePaths.length ; i++){
            if(currentDir.includes(excludePaths[i])){
                return false;
            };
        };
        return true;
    };
    let search = function(base,flag,appendix){
        
        let currentDir = (appendix ||'');
        if(!checkExclude(currentDir)){
            return [];
        }
        let innerDirObj = getDirectories(currentDir,false); 
        let tempFiles = innerDirObj.scripts;
        console.log("inner dir counts : ",innerDirObj.counts);
        console.log("inner scripts counts",innerDirObj.scripts.length);
        for(let i = 0 ; i < innerDirObj.counts; i++){
            tempFiles = tempFiles.concat(search(base,false,innerDirObj.directories[i]));
        }
        
        return tempFiles;
        
    };
    let getDirectories = function(currentDir,entryFlag){
        let counts = 0;
        let directories = [];
        let scripts = [];
        //get files
        console.log("search dir : " + currentDir);
        let files = fileSystem.readdirSync(path.resolve(currentDir),(err,files)=>{
            return files;
        });
        //extract directories
        files.forEach(function(ele,idx){
            let entryKey = currentDir+separator+ele;
            
            if(fileSystem.lstatSync(entryKey).isDirectory()){
                counts++;
                directories.push(entryKey);
            }else{
                if(checkExclude(entryKey)){
                    if(filenameExp.test(entryKey)){
                        scripts.push(entryKey);
                    };
                }
            };
        });
        return {counts:counts , directories : directories , scripts : scripts};
    };
    let genEntry = function(files){
        let entryObject = {};
        files.forEach(function(ele,idx){
            let reduces = ele.replace(base+path.sep,'').replace(/\\/g,path.sep);
            console.log(reduces)
            if(subExp!==undefined && !subExp.test(reduces)){
                reduces = reduces.replace(filenameExp,'');
            }
            //console.log("key" , reduces , "value" , ele );
            if(!hmrFlag){
                entryObject[reduces] = ele;
            }else{
                entryObject[reduces] = ['webpack-hot-middleware/client?name=lazyLoadScripts&path=/js/__webpack_hmr&reload=true'];
                entryObject[reduces].push(ele);
            }
        });
        return entryObject;
    };
    return GetEntry;
})();



let entry = new GetEntry({
    fs:fs,
    path : path,
    base : path.resolve(__dirname,'../pine-ui/'),
    exclude : ['node_modules','highchart','lib','webpack','dist','server'],
    useHmr : true
});
console.log(entry);
entry.setRegexp('\.(js|css)$');
entry.setSubRegExp('\.css$');
console.log(entry.returnEntryObject());



