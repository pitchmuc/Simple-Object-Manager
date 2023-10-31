'use strict';
class Som{
    /**
     * 
     * @param {object} object object that will be copy
     * @param {object} options object containing different options capability
     * @param {string} options.dv default value used in the get method
     * @param {boolean} options.deepcopy boolean, if the object copied is deepcopied or not (default: true)
     * @param {boolean} options.stack if set to true, a stack attribute is filled with the operation done
     * @param {function|object} options.context If you want to pass a context to your stack
    */
    constructor(object,options={dv:undefined,deepcopy:true,stack:false,context:undefined}) {
        this.data = {};
        this.deepcopy = options.deepcopy==undefined?true:options.deepcopy;
        this.defaultvalue = typeof arguments[1]=='string'?arguments[1]:options.dv; /* legacy backward compatibility with df parameter*/
        if(options.stack){
           this.stack = [];
           this.options = {"context":options.context}
        }
        function getCircularReplacer(){
            const seen = new WeakSet();
            return (key, value) => {
              if (typeof value === 'object' && value !== null) {
                if (seen.has(value)) {
                  return;
                }
                seen.add(value);
              }
              return value;
            };
          };
        if (typeof(object) == 'object' && (object instanceof Som) == false){
            if(Array.isArray(object) && object.length > 0){
                let reference = this.data;
                if(typeof object[0] == "object"){
                    let t = this
                    object.forEach(function(element){
                        if(t.deepcopy){
                            try{
                                reference = Object.assign(reference,JSON.parse(JSON.stringify(element)));
                            }
                            catch(e){
                                console.warn('issue assigning object, trying removing circular references.');
                                reference = Object.assign(reference,JSON.parse(JSON.stringify(element,getCircularReplacer())));
                            }    
                        }
                        else{
                            reference = Object.assign(reference,element)
                        }
                    })
                }
                else{
                    if(this.deepcopy){
                        this.data = JSON.parse(JSON.stringify(object))
                    }
                    else{
                        this.data = object
                    }
                }

            }
            else{
                try{
                    if(this.deepcopy && (arguments[2] !=false)){ //arguments[2] is legacy backward compatibility
                        this.data = JSON.parse(JSON.stringify(object));
                    }else{
                        this.data = object;
                    }
                }
                catch(e){
                    console.warn('issue assigning object, trying removing circular references.');
                    this.data = Object.assign({},JSON.parse(JSON.stringify(object,getCircularReplacer())));
                }
            }
        }
        else if (typeof(object) == 'object' && (object instanceof Som) == true){
            try{
                if(this.deepcopy){
                    this.data = Object.assign({},JSON.parse(JSON.stringify(object.data)));
                }else{
                    this.data = object.data
                }
                
            }
            catch(e){
                console.warn('issue assigning object, trying removing circular references.');
                this.data = Object.assign({},JSON.parse(JSON.stringify(object.data,getCircularReplacer())));
            }
            
        }
    }

    /** Getter of the Som class instanciation.
     *  
     * @param {string|array} path can be empty to return the whole object or a specific path such as "tenant.firstname" or an array of path. The first one returning a value is used.
     * @param {string|object} fallback if the field is not found in the Som, can provide a fallback value to be returned.
     * @param {string} origin default is undefined, "internal" for internal method used
     * @returns {object|string}
     */
    get(path,fallback,origin){
        if(typeof(path) == "undefined" || path == ""){
            if(this.stack && Array.isArray(this.stack) && origin != 'internal'){
                let data = {'method':'get','path' : path}
                if(this.options.context != undefined){ /* if something has been provided in the context options */
                    data['context'] = typeof this.options.context == "function"?this.options.context({'method':'get','value':this.data}):this.options.context;
                }
                this.stack.push(data)
            }
            return this.data
        }
        let paths = [];
        if(!Array.isArray(path)){//ensuring consistent array manipulation
            paths.push(path)
        }
        else{
            paths = path
        }
        let results = {}
        for (const path of paths) {
            results[path] = {'pathSplit':'','value':undefined};
        }
        for (const path of paths){
            if (typeof(path) == "string"){
                results[path]['pathSplit'] = path.split(".");
                let v = this.data;
                let tmp_pathSplit = path.split(".");
                for (var i = 0; i < tmp_pathSplit.length && v != undefined; i++) { // Traverse until found or undefined
                    if (Array.isArray(v) && Math.abs(parseInt(tmp_pathSplit[i]))<=v.length) { //If parent is array and path is in the index
                        if(parseInt(tmp_pathSplit[i])<0){ /** Negative number */
                            v = v[v.length - Math.abs(parseInt(tmp_pathSplit[i]))];
                        }
                        else{
                            v = v[parseInt(tmp_pathSplit[i])];
                        }
                    } 
                    else if(Array.isArray(v) && Math.abs(parseInt(tmp_pathSplit[i]))>v.length){ // trying to access above # of elements
                        v = fallback || this.defaultvalue || undefined
                    }
                    else {
                        v = v[tmp_pathSplit[i]];
                    }
                }
                if (v === "" || (typeof v === 'undefined' && fallback == "")){
                    results[path]['value'] = ""
                }
                results[path]['value'] = v
                }
            }
        let result = ""
        for (let res in results) {
            result = result || results[res]['value'] 
        }
        if((typeof result == "undefined" && fallback == "") || result ==""){
            if(this.stack && Array.isArray(this.stack) && origin != 'internal'){
                let data = {'method':'get','path' : path}
                if(this.options.context != undefined){ /* if something has been provided in the context options */
                    data['context'] = typeof this.options.context == "function"?this.options.context({'method':'get','value':""}):this.options.context;
                }
                this.stack.push(data)
            }
            return ""
        }
        else{
            let finalResult = result || fallback || this.defaultvalue || undefined
            if(this.stack && Array.isArray(this.stack) && origin != 'internal'){
                let data = {'method':'get','path' : path}
                if(this.options.context != undefined){ /* if something has been provided in the context options */
                    data['context'] = typeof this.options.context == "function"?this.options.context({'method':'get','value':finalResult}):this.options.context;
                }
                this.stack.push(data)
            }
            return finalResult
        }   
    }

    /**
     * Assign a v to a path, creating a path if necessary
     * 
     * @param {string} path to assign to
     * @param {object|string} v value to assign
     * @param {object|string|undefined} fallback fallback value when value specified in "v" is undefined. Default : undefined
     * @param {string} origin default is undefined, "internal" for internal method used
     */
    assign(path, v,fallback=undefined,origin){
        if(this.stack && Array.isArray(this.stack) && origin !='internal' && origin != 'override'){
            let data = {"method":"assign","path" : path}
            data['method'] == origin == 'modify'?"modify":"assign";
            if(this.options.context != undefined){ /* if something has been provided in the context options */
                data['context'] = typeof this.options.context == "function"?this.options.context({"method":"assign","value":v}):this.options.context;
            }
            this.stack.push(data)
        }
        if (typeof v == "undefined"){
            v = fallback || this.defaultvalue
        }
        let override = (arguments[3]=='override')?true:false;
        if(typeof path != "undefined" && path != "" && typeof path == "string"){
            var pS = path.split('.');
            /* define path and create it if required */
            var xom = this.data
            for (var i=0;i<pS.length && xom != undefined;i++){ // Traverse a create if necessary
                if (typeof(pS[i]) == 'string' && isNaN(pS[i]) == true) { //If v is a string
                    if(Object(xom).hasOwnProperty(pS[i])){// if path present
                        if (i == pS.length -1){ // if it is the last element
                            if(Array.isArray(xom[pS[i]])){ // if it is an array
                                if(override){
                                    xom[pS[i]] = v
                                }else{
                                    xom[pS[i]].push(v)
                                }
                                
                            }
                            else{
                                xom[pS[i]] = v
                            }
                            
                        }
                        else{
                            if(typeof xom[pS[i]] == 'string'){
                                xom[pS[i]] = {}
                            }
                            xom = xom[pS[i]]
                        }
                    }
                    else{// if path not present
                        if (i == pS.length -1){ /** if last element */
                            if(typeof xom !='object'){ /** if previous element is not an object */
                                return undefined
                            }
                            else{
                                xom[pS[i]] = v
                            }
                        }
                        else{
                            if(isNaN(pS[i+1])){ /* next element is part of object */
                                xom[pS[i]] = {} /** create the path */
                            }
                            else{/* next element is part of an array */
                                xom[pS[i]] = [] /** create the path */
                            }
                            xom = xom[pS[i]] /** assign the new path*/
                        }
                    }
                } 
                else if (typeof(pS[i]) == 'string' && isNaN(pS[i]) == false) { //If v is a number
                    if(Array.isArray(xom) && Math.abs(pS[i]) < xom.length){ /* Array contain enough elements */
                        if (i == pS.length -1){ /** last element */
                            xom[pS[i]] = v
                        }
                        else{
                            xom = xom[pS[i]]
                        }
                    }
                    else if(Array.isArray(xom) && pS[i] >= xom.length){ /* Array do not contain enough elements - creating one additional */
                        if (i == pS.length -1){
                            xom.push(v);
                        }
                        else{
                            xom.push({});
                            xom = xom[xom.length-1];
                        }
                    }
                    
                }
            }
        }
        else if (typeof path == "object" ){
            this.data = Object.assign(this.data,path)
        }
        return this.data
    }

    /** the merge method will take a path, and an existing object to merge it into that instance.
     * It returns the result merge data.
     * 
     * @param {object} object the object to merge
     * @param {string} path where you want to merge the object
     * 
     */
    merge(path,object){
        if(typeof path == "object" && typeof object == "undefined"){
            object = path;
            path = undefined;
        }
        else if(typeof path == "string" && typeof object == "object") {
            path = path;
            object = object;
        }
        else if(typeof path == "object" && typeof object == "string"){
            let tmp_object = path;
            path = object;
            object = tmp_object
        }
        if(this.stack && Array.isArray(this.stack)){
            let data = {'method':'merge','path' : path}
            if(this.options.context != undefined){ /* if something has been provided in the context options */
                data['context'] = typeof this.options.context == "function"?this.options.context({"method":"merge","value":object}):this.options.context;
            }
            this.stack.push(data)
        }
        if(typeof(path) == 'undefined' || path == ""){
            this.data = Object.assign(this.data,JSON.parse(JSON.stringify(object)));
            return this.data
        }
        else{
            let pS = path.split(".");
            let v = this.data;
            for (var i = 0; i < pS.length && v != undefined; i++) { // Traverse until found or undefined
                if (Array.isArray(v) && Math.abs(parseInt(pS[i]))<=v.length) { //If parent is array and path is in the index
                    if(parseInt(pS[i])<0){ /** Negative number */
                        v = v[v.length - Math.abs(parseInt(pS[i]))];
                    }
                    else{
                        v = v[parseInt(pS[i])];
                    }
                } 
                else if(Array.isArray(v) && Math.abs(parseInt(pS[i]))>v.length){ // trying to access above # of elements
                    v = this.defaultvalue || undefined
                }
                else {
                    v = v[pS[i]];
                }
            }
            if(typeof(v) != 'undefined' || v != this.defaultvalue){
                if (Array.isArray(v) && Array.isArray(object)){
                    object.forEach(function(element){
                        v.push(element);
                    })
                }
                else{
                    var newv = Object.assign(v,JSON.parse(JSON.stringify(object)));
                    this.data = this.assign(path,newv,undefined,'internal')
                }
                return this.data
            }
            else{
                this.assign(path,object,undefined,'internal')
                return this.data
            }
        }

    }

    /** Remove the v from the specific path.
     *  If path is not provided, clear the data.
     *  If you provide true to the "key" parameter, it will delete the key itself.
     * 
     * @param {string} path
     * @param {boolean} key
     */
    remove(path,key){
        if(this.stack && Array.isArray(this.stack) && origin !='internal'){
            let data = {'method':'remove','path' : path}
            if(this.options.context != undefined){ /* if something has been provided in the context options */
                data['context'] = typeof this.options.context == "function"?this.options.context({"method":"remove","value":undefined}):this.options.context;
            }
            this.stack.push(data)
        }
        if (typeof key == "undefined"){
            key = false;
        }
        if(path == "" || typeof path == "undefined"){
            this.clear()
        }
        else{
            var pS = path.split('.');
        /* define path and create it if required */
        var xom = this.data
        for (var i=0;i<pS.length && xom != undefined;i++){ // Traverse a create if necessary
            if (typeof(pS[i]) == 'string' && isNaN(pS[i]) == true) { //If v is a string
                if(Object(xom).hasOwnProperty(pS[i])){// if path present
                    if (i == pS.length -1){/** last element */
                        if(typeof xom[pS[i]] == "object"){
                            delete xom[pS[i]]
                        }else{
                            if(key){
                                delete xom[pS[i]]
                            }
                            else{
                                xom[pS[i]] = undefined
                            }
                            
                        }
                    }
                    else{
                        xom = xom[pS[i]]
                    }
                }
                else{// if path not present
                    return this.data
                }
            } 
            else if (typeof(pS[i]) == 'string' && isNaN(pS[i]) == false) { //If v is a number
                if(Array.isArray(xom) && Math.abs(pS[i]) < xom.length){ /* Array contain enough elements */
                    if (i == pS.length -1){ /* if the element is the last */
                        xom.splice(pS[i], 1);
                        return this.data
                    }
                    else{ 
                        xom = xom[pS[i]]
                    }
                }
                else{ /* Array do not contain enough elements */
                    return this.data
                }
                
            }
        }
        }
    }
    /**
     * 
     * @param {*} path path where to push the element to
     * @param {*} v value to push
     * @param {*} o override. set to false by default. It means that any existing value in that path will be kept. if set to true, replacing the value of that path with an array with the value set. 
     * @returns return the whole data with that new elements.
     */
    push(path, v,o=false){
        if(this.stack && Array.isArray(this.stack) && origin !='internal'){
            let data = {'method':'push','path' : path}
            if(this.options.context != undefined){ /* if something has been provided in the context options */
                data['context'] = typeof this.options.context == "function"?this.options.context({"method":"push","value":v}):this.options.context;
            }
            this.stack.push(data)
        }
        if (path == "" || typeof path === "undefined"){ /*transforming the object to an array*/
            this.data = [this.data];
            this.data.push(v)
        }
        else if (path.length>0){
            let c_r = this.get(path);
            /* no element before OR the user wants to replace the v */
            if((typeof c_r=='undefined')||o){ 
                this.assign(path,[v],undefined,'override')
            }
            else if (Array.isArray(c_r)){
                c_r.push(v);
            }
            else if(typeof(c_r)=='object' || typeof(c_r)=="string"){
                if(o == false){ /* if the user want to keep the original v */
                    let n_v = [c_r,v]
                    this.assign(path,n_v,undefined,'internal')
                }
            }
        }
        return this.data
    }

    /**
     * @param {string} path path to the element you want to merge
     * @param {object} o the object to deep merge with the current Som object.
     * @param {object} s source to merge data
     * @param {string} origin origin of the call, used for internal calls
     * It doesn't return anything and replace the current Som object.
     */
    mergeDeep(path,o,s,origin){
        if(typeof path === "string"){ /* if path is provided */
            o = o;
            s = s || this.get(path,undefined,'internal');

        }
        else if(typeof path =="object"){/* if path is not provided and an object is provided*/
            s = o || this.data;
            o = path;
        }
        if (typeof o !== 'object'){
            throw new Error('expect an object as input')
        }
        let mNO = s || this.data;
        if(this.stack && Array.isArray(this.stack) && origin !='internal'){
            let data = {'method':'mergeDeep','path' : path}
            if(this.options.context != undefined){ /* if something has been provided in the context options */
                data['context'] = typeof this.options.context == "function"?this.options.context({"method":"mergeDeep","value":o}):this.options.context;
            }
            this.stack.push(data)
        }
        for (let key in o){
            if(typeof o[key] !== "object"){ /** Element is simple */
                mNO[key] = o[key]
            }
            else if(typeof o[key] === "object"){ /** Element is complex */
                if(typeof mNO[key] !== "object"){ /** Original was not an object */
                    mNO[key] = o[key]
                }
                else if(Array.isArray(o[key]) === false && Array.isArray(mNO[key]) === false){
                    this.mergeDeep(o[key],mNO[key],mNO[key],'internal')
                }
                else if(Array.isArray(o[key]) && Array.isArray(mNO[key])){
                    for(let i=0;i<Math.max(o[key].length,mNO[key].length);i++){
                        if(o[key][i] === undefined){
                            // nothing to be done here
                        }
                        else if(mNO[key][i]=== undefined) {
                            mNO[key][i] = o[key][i]
                        }
                        else{
                            if(typeof o[key][i] !== "object"){
                                if(mNO[key].indexOf(o[key][i])== -1){
                                    mNO[key].push(o[key][i])
                                }
                            }
                            else{
                                this.mergeDeep(o[key][i],mNO[key][i],mNO[key][i],'internal')
                            }
                            
                        }
                    }
                } 
            }
        }
        return undefined

    }

    /**
     * 
     * @param {string} o_v old value to find
     * @param {string|undefined} n_v new value to be set
     * @param {bool} regex if the old value is a regular expression. It will match
     * @param {object} data in the recursion, passing the data attribute 
     * @param {string} origin if the method is used recursively
     * @returns undefined
     */
    replace(o_v,n_v,regex=false,data,origin){
        if(this.stack && Array.isArray(this.stack) && origin !='internal'){
            let data = {'method':'replace'}
            if(this.options.context != undefined){ /* if something has been provided in the context options */
                data['context'] = typeof this.options.context == "function"?this.options.context({"method":"replace","value":o_v,"new_value":n_v}):this.options.context;
            }
            this.stack.push(data)
        }
        let o = data || this.data; // argument used for recursion
        let myregexTest;
        if (regex){
            myregexTest = new RegExp(o_v)
        }
        if(typeof o == 'object'){
            for(let k in o){
                if(typeof o[k] !== "object"){
                    if (regex){
                        if(myregexTest.test(o[k])){
                            o[k] = n_v;
                        }
                    }
                    else{
                        if (o[k] == o_v){
                            o[k] = n_v;
                        }
                    }
                }
                else if (typeof o[k]=='object'){
                    if(Array.isArray(o[k])){
                        let t = this; /* save "this" */
                        let flagSArray = false; /*flag for simple array*/
                        if(o[k].length>0){
                            flagSArray = typeof o[k][0] == 'string' || typeof o[k][0] == 'number'?true:false;
                        }
                        let i = o[k].indexOf(o_v) /* if simple array of values */
                        if(i!=-1){
                            o[k][i] = n_v;
                        }
                        if(regex && flagSArray){
                            for(i=0;i<o[k].length;i++){
                                if(myregexTest.test(o[k][i])){
                                    o[k][i] = n_v;
                                }
                            }
                        }
                        else{
                            o[k].forEach(function(el){
                                if(typeof el == "object"){/* ensuring only object can enter recursion */
                                    t.replace(o_v,n_v,regex,el,'internal')
                                }
                        })
                        }
                    }
                    else{
                        if(o[k] != undefined && typeof o[k]!= "undefined" && !(o[k] instanceof Som)){/* ensuring no undefined is being sent */
                            this.replace(o_v,n_v,regex,o[k],'internal')
                        }
                        else{
                            return undefined
                        }
                        
                    }
                }
            }
        }
        return undefined
    }

    /**
     * 
     * @param {string} value value to be search in the Som data
     * @param {bool} regex if a regex is to be used
     * @param {object} d the object used in the recursion
     * @param {array} paths the array containing the paths found
     * @param {string} curr_path the current path built
     * @returns an object with the list of paths that contains that value
     */
    searchValue(value,regex=false,d,paths=undefined,curr_path=undefined,origin){
        let o = d || this.data; // argument used for recursion
        let cp = curr_path == undefined?"":curr_path;
        let ps = paths==undefined?[]:paths;
        let myregexTest;
        if (regex){
            myregexTest = new RegExp(value)
        }
        if(typeof o =='object'){
            for(let k in o){
                if(typeof o[k]!= 'object'){
                    if(regex){
                        if(myregexTest.test(o[k])){
                            let tmp_cp = cp==""?k:cp+'.'+k;
                            ps.push(tmp_cp)
                        }
                    }
                    else{
                        if(o[k]==value){
                            let tmp_cp = cp ==""?k:cp+'.'+k;
                            ps.push(tmp_cp)
                        }
                    }
                }
                else if(Array.isArray(o[k])){
                    let flagSArray = false; /*flag for simple array*/
                        if(o[k].length>0){
                            flagSArray = typeof o[k][0] == 'string' || typeof o[k][0] == 'number'?true:false;
                        }
                    if(flagSArray){
                        for(let i=0;i<o[k].length;i++){
                            if(regex){
                                if(myregexTest.test(o[k][i])){
                                    let tmp_cp = cp==""?k:cp+'.'+k+'.'+i;
                                    ps.push(tmp_cp)
                                }
                            }
                            else{
                                if(o[k][i] == value){
                                    let tmp_cp = cp==""?k:cp+'.'+k+'.'+i;
                                    ps.push(tmp_cp)
                                }
                            }
                        }
                    }
                    else{ // if array of objects
                        for(let i=0;i<o[k].length;i++){
                            if(typeof o[k][i] == "object"){/* ensuring only object can enter recursion */
                                let tmp_cp = cp==""?k+'.'+i:cp+'.'+k+'.'+i;
                                this.searchValue(value,regex,o[k][i],ps,tmp_cp,'internal')
                            }
                        }
                    }
                }
                else if(typeof o[k] == 'object'){
                    let tmp_cp = cp==""?k:cp+'.'+k;
                    this.searchValue(value,regex,o[k],ps,tmp_cp,'internal')
                }
            }
        }
        let dataResult = {}
        dataResult[value] = ps
        if(this.stack && Array.isArray(this.stack) && origin !='internal'){
            let data = {'method':'searchValue','path':undefined,'value' : ''}
            if(this.options.context != undefined){ /* if something has been provided in the context options */
                data['context'] = typeof this.options.context == "function"?this.options.context({"method":"searchValue","value":dataResult}):this.options.context;
            }
            this.stack.push(data)
        }
        return dataResult
    }

    /**
     * 
     * @param {string} path path of the SOM to be returned 
     * @param {boolean} stack if you want to create a stack
     * @param {function} context if you want to pass a context callback function
     * @returns a new instance of SOM, related to it or undefined if value for path is not an object. if no value exists, set it to empty object!
     */
    subSom(path,stack,context,origin){
        let data = this.get(path,this.defaultvalue,'internal');
        if(data==this.defaultvalue){
            data = {}
            this.assign(path,data)
        }
        if(typeof(data)=='object'){
            const subSom = new this.constructor(data,{dv:this.defaultvalue,deepcopy:false,stack:stack,context:context})
            if(this.stack && Array.isArray(this.stack) && origin != "internal"){
                let data = {'method':'subSom','path' : path}
                if(this.options.context != undefined){ /* if something has been provided in the context options */
                    data['context'] = typeof this.options.context == "function"?this.options.context({"method":"subSom","value":subSom}):this.options.context;
                }
                this.stack.push(data)
            }
            return subSom
        }
        if(this.stack && Array.isArray(this.stack) && origin !='internal'){
            let data = {'method':'subSom','path' : path,}
            if(this.options.context != undefined){ /* if something has been provided in the context options */
                data['context'] = typeof this.options.context == "function"?this.options.context({"method":"subSom","value":undefined}):this.options.context;
            }
            this.stack.push(data)
        }
        return undefined
     }

    /**
     *  convenience function to get several subSoms in a single call
     *  @param path path to the main object
     *  @returns an object of sub-SOMs of every node within the access object
     *  example: {pageInfo, category} = getSubNodes('page') // { pageInfo: SOM(page.pageInfo), category: SOM(page.category}, attributes: SOM{page.attributes}}
     */
    getSubNodes(path){
        const sub = this.subSom(path,false,undefined,'internal')
        let results = Object.fromEntries(Object.keys(sub.data).map(key => [key, sub.subSom(key,false,undefined,'internal')]))
        if(this.stack && Array.isArray(this.stack)){
            let data = {'method':'getSubNodes','path' : path}
            if(this.options.context != undefined){ /* if something has been provided in the context options */
                data['context'] = typeof this.options.context == "function"?this.options.context({'method':'getSubNodes','value':results}):this.options.context;
            }
            this.stack.push(data)
        }
        return results
    }

    /**
     * convenience function to modify a node with a function based on its current value
     * @param path path to use.
     * @param modFct function that is apply on the node. It passes the value as a parameter.
     */
    modify(path, modFct){
        this.assign(Array.isArray(path)?path[0]:path, modFct(this.get(path,undefined,'modify')))
        if(this.stack && Array.isArray(this.stack)){
            let data = {'method':'modify','path' : path}
            if(this.options.context != undefined){ /* if something has been provided in the context options */
                data['context'] = typeof this.options.context == "function"?this.options.context({'method':'modify','value':modFct(this.get(path,undefined,'modify'))}):this.options.context;
            }
            this.stack.push(data)
        }
    }

    clear(){
        if(this.stack && Array.isArray(this.stack)){
            let data = {'method':'clear','path' : undefined}
            if(this.options.context != undefined){ /* if something has been provided in the context options */
                data['context'] = typeof this.options.context == "function"?this.options.context({'method':'clear','value':undefined}):this.options.context;
            }
            this.stack.push(data)
        }
        this.data = {
        }
    }
}

module.exports = Som