'use strict';
class Som{
    /**
     * 
     * @param {object} object object that will be copy
     * @param {string} df default value used in the get method
     * @param {boolean} deepcopy boolean, if the object copied is deepcopied or not (default: true)
     */
    constructor(object,df=undefined,deepcopy=true) {
        this.data = {};
        this.defaultvalue = df;
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
                object.forEach(function(element){
                    if(deepcopy){
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
                try{
                    if(deepcopy){
                        this.data = Object.assign({},JSON.parse(JSON.stringify(object)));
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
                this.data = Object.assign({},JSON.parse(JSON.stringify(object.data)));
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
     * @returns {object|string} 
     */
    get(path,fallback){
        if(typeof(path) == "undefined" || path == ""){
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
                if (v === "" || (typeof v === 'undefined' & fallback == "")){
                    results[path]['value'] = ""
                }
                results[path]['value'] = v
                }
            }
        let result = ""
        for (let res in results) {
            result = result || results[res]['value'] 
        }
        return result || fallback || this.defaultvalue || undefined
    }

    /**
     * Assign a v to a path, creating a path if necessary
     * 
     * @param {string} path to assign to
     * @param {object|string} v value to assign
     * @param {object|string|undefined} fallback fallback value when value specified in "v" is undefined. Default : undefined
     */
    assign(path, v,fallback=undefined){
        if (typeof v == "undefined"){
            v = fallback
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
        if(typeof(path) == 'undefined' || path == ""){
            this.data = Object.assign(this.data,JSON.parse(JSON.stringify(object)));
            return this.data
        }
        else{
            var pS = path.split(".");
            var v = this.data;
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
                    this.data = this.assign(path,newv)
                }
                return this.data
            }
            else{
                this.assign(path,object)
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
                    this.assign(path,n_v)
                }
            }
        }
        return this.data
    }

    /**
     * @param {string} p path to the element you want to merge
     * @param {object} o the object to deep merge with the current Som object.
     * @param {object} s source to merge data
     * It doesn't return anything and replace the current Som object.
     */
    mergeDeep(p,o,s){

        if(typeof p === "string"){ /* if path is provided */
            o = o;
            s = s || this.get(p);

        }
        else if(typeof p =="object"){/* if path is not provided and an object is provided*/
            s = o || this.data;
            o = p;
        }
        if (typeof o !== 'object'){
            throw new Error('expect an object as input')
        }
        let mNO = s || this.data;
        for (let key in o){
            if(typeof o[key] !== "object"){ /** Element is simple */
                mNO[key] = o[key]
            }
            else if(typeof o[key] === "object"){ /** Element is complex */
                if(typeof mNO[key] !== "object"){ /** Original was not an object */
                    mNO[key] = o[key]
                }
                else if(Array.isArray(o[key]) === false && Array.isArray(mNO[key]) === false){
                    this.mergeDeep(o[key],mNO[key])
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
                                this.mergeDeep(o[key][i],mNO[key][i])
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
     * @returns undefined
     */
    replace(o_v,n_v,regex=false,data){
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
                        let i = o[k].indexOf(o_v) /* if simple array of values */
                        if(i!=-1){
                            o[k][i] = n_v;
                        }
                        else{
                            o[k].forEach(function(el){
                                if(typeof el == "object"){/* ensuring only object can enter recursion */
                                    t.replace(o_v,n_v,regex,el)
                                }
                        })
                        }
                    }
                    else{
                        if(o[k] != undefined && typeof o[k]!= "undefined"){/* ensuring no undefined is being sent */
                            this.replace(o_v,n_v,regex,o[k])
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

    clear(){
        this.data = {
        }
    }
}